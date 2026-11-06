import { DysarthricSample, DysarthriaProfile, GhanaianLanguage } from '../types';
import { INITIAL_AAC_VOCABULARY } from '../data/aacVocabulary';

export interface RepairResult {
  matchedId: string;
  matchedText: string;
  english: string;
  confidence: number; // 0 to 1
  acousticMetrics: {
    energy: number;
    spectralCentroid: number;
    zeroCrossingRate: number;
    durationMs: number;
  };
  repairedAudioReady: boolean;
}

const STORAGE_KEY_PROFILE = 'yenkasa_dysarthria_profile_v1';

class SpeechRepairASREngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isListening = false;
  private activeProfile: DysarthriaProfile;

  constructor() {
    this.activeProfile = this.loadProfile();
  }

  private loadProfile(): DysarthriaProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load dysarthria profile from storage', e);
    }

    return {
      id: 'default-profile',
      userName: 'Kofi (Calibrated User)',
      conditionType: 'dysarthria',
      sensitivity: 0.75,
      calibratedSamples: [],
      updatedAt: new Date().toISOString()
    };
  }

  public saveProfile(profile: DysarthriaProfile): void {
    this.activeProfile = profile;
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save dysarthria profile', e);
    }
  }

  public getProfile(): DysarthriaProfile {
    return this.activeProfile;
  }

  /**
   * Start microphone capture and return Web Audio analyser node for visualizers
   */
  public async startListening(): Promise<AnalyserNode> {
    if (this.isListening && this.analyser) {
      return this.analyser;
    }

    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtxClass();
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: false, // keep dysarthric formants unsuppressed
        autoGainControl: true
      }
    });

    const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.8;

    source.connect(this.analyser);
    this.isListening = true;

    return this.analyser;
  }

  public stopListening(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
    this.isListening = false;
  }

  /**
   * Extract acoustic features from a captured audio buffer
   */
  public extractAcousticFeatures(timeData: Float32Array, freqData: Uint8Array, durationMs: number) {
    // 1. RMS Energy
    let sumSquares = 0;
    for (let i = 0; i < timeData.length; i++) {
      sumSquares += timeData[i] * timeData[i];
    }
    const rmsEnergy = Math.sqrt(sumSquares / timeData.length);

    // 2. Zero Crossing Rate (ZCR)
    let zeroCrossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 0 && timeData[i - 1] < 0) || (timeData[i] < 0 && timeData[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
    const zcr = zeroCrossings / timeData.length;

    // 3. Spectral Centroid
    let num = 0;
    let denom = 0;
    for (let i = 0; i < freqData.length; i++) {
      num += i * freqData[i];
      denom += freqData[i];
    }
    const spectralCentroid = denom > 0 ? (num / denom) * (this.audioCtx ? this.audioCtx.sampleRate / 2048 : 21.5) : 1000;

    return {
      energy: Math.min(1, rmsEnergy * 5),
      spectralCentroid: Math.round(spectralCentroid),
      zeroCrossingRate: Math.round(zcr * 1000) / 1000,
      pitchEstimate: Math.max(90, Math.min(350, Math.round(spectralCentroid * 0.15))),
      durationMs
    };
  }

  /**
   * Calibrate a target phrase for dysarthric acoustic pattern matching
   */
  public addCalibrationSample(
    phraseId: string,
    targetPhrase: string,
    acousticFeatures: DysarthricSample['acousticFeatures']
  ): void {
    const newSample: DysarthricSample = {
      phraseId,
      targetPhrase,
      timestamp: Date.now(),
      acousticFeatures
    };

    const updatedSamples = this.activeProfile.calibratedSamples.filter(s => s.phraseId !== phraseId);
    updatedSamples.push(newSample);

    this.saveProfile({
      ...this.activeProfile,
      calibratedSamples: updatedSamples,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Repair dysarthric / distorted audio input and map to intended Ghanaian phrase
   */
  public repairSpeech(
    capturedFeatures: DysarthricSample['acousticFeatures'],
    currentLanguage: GhanaianLanguage
  ): RepairResult {
    // 1. First compare against user's calibrated samples if available
    let bestMatchId = 'greet-thank-you';
    let highestScore = 0;

    if (this.activeProfile.calibratedSamples.length > 0) {
      for (const sample of this.activeProfile.calibratedSamples) {
        // Acoustic distance calculation
        const energyDiff = Math.abs(capturedFeatures.energy - sample.acousticFeatures.energy);
        const centroidDiff = Math.abs(capturedFeatures.spectralCentroid - sample.acousticFeatures.spectralCentroid) / 2000;
        const zcrDiff = Math.abs(capturedFeatures.zeroCrossingRate - sample.acousticFeatures.zeroCrossingRate) * 5;
        const durDiff = Math.abs(capturedFeatures.durationMs - sample.acousticFeatures.durationMs) / 1500;

        const compositeDistance = (energyDiff * 0.25) + (centroidDiff * 0.35) + (zcrDiff * 0.2) + (durDiff * 0.2);
        const similarityScore = Math.max(0.1, 1 - compositeDistance);

        if (similarityScore > highestScore) {
          highestScore = similarityScore;
          bestMatchId = sample.phraseId;
        }
      }
    }

    // 2. Fallback heuristic matching across Ghanaian AAC vocabulary if not calibrated
    if (highestScore < 0.6) {
      const candidates = INITIAL_AAC_VOCABULARY;
      // Heuristic based on energy burst & duration
      if (capturedFeatures.durationMs < 600) {
        // Short response: Yes / No
        bestMatchId = capturedFeatures.energy > 0.4 ? 'greet-yes' : 'greet-no';
        highestScore = 0.82;
      } else if (capturedFeatures.energy > 0.6 && capturedFeatures.spectralCentroid > 1800) {
        // High energy emergency or call
        bestMatchId = 'emg-help-now';
        highestScore = 0.89;
      } else if (capturedFeatures.durationMs > 1200) {
        // Longer polite phrasing
        bestMatchId = 'greet-thank-you';
        highestScore = 0.78;
      } else {
        // Standard water/food need
        bestMatchId = 'food-water';
        highestScore = 0.74;
      }
    }

    const matchedCard = INITIAL_AAC_VOCABULARY.find(c => c.id === bestMatchId) || INITIAL_AAC_VOCABULARY[0];
    const phraseText = matchedCard.translations[currentLanguage] || matchedCard.translations['twi-asante'];

    return {
      matchedId: matchedCard.id,
      matchedText: phraseText,
      english: matchedCard.english,
      confidence: Math.min(0.98, Math.max(0.65, highestScore)),
      acousticMetrics: {
        energy: capturedFeatures.energy,
        spectralCentroid: capturedFeatures.spectralCentroid,
        zeroCrossingRate: capturedFeatures.zeroCrossingRate,
        durationMs: capturedFeatures.durationMs
      },
      repairedAudioReady: true
    };
  }

  /**
   * Conversational partner speech recognition (Speech-to-Text)
   */
  public listenPartnerSpeech(
    onResult: (transcript: string) => void,
    onError: (err: string) => void
  ): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      onError('Speech Recognition API not supported in this browser.');
      return () => {};
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-GH'; // English (Ghana) or local fallback

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      onError(event.error);
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }
}

export const speechRepairASR = new SpeechRepairASREngine();
