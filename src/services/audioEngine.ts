import { GhanaianLanguage, TTSConfig } from '../types';

// Vowel formant frequencies in Hz (F1, F2, F3) for Ghanaian languages
const GHANAIAN_VOWEL_FORMANTS: Record<string, [number, number, number]> = {
  'a': [750, 1300, 2400],
  'e': [400, 2100, 2700],
  'ɛ': [580, 1800, 2550],
  'i': [300, 2300, 2900],
  'o': [420, 850, 2400],
  'ɔ': [550, 950, 2450],
  'u': [320, 800, 2300],
  'ã': [800, 1400, 2400],
  'ẽ': [600, 1900, 2600],
  'õ': [570, 1000, 2500],
};

class GhanaianAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Phonetic converter for browser speech synthesis fallback.
   * Maps Ghanaian orthography (ɛ, ɔ, gy, ky, tw, ɖ, ʋ, ŋ) to phonetic representations
   * so standard Web Speech API speaks them with authentic Ghanaian inflection.
   */
  public getPhoneticMapping(text: string, language: GhanaianLanguage): string {
    let mapped = text;

    // Common Ghanaian vowel normalization
    mapped = mapped
      .replace(/ɛ/g, 'eh')
      .replace(/Ɛ/g, 'Eh')
      .replace(/ɔ/g, 'aw')
      .replace(/Ɔ/g, 'Aw')
      .replace(/ŋ/g, 'ng')
      .replace(/Ŋ/g, 'Ng');

    if (language.startsWith('twi') || language === 'fante') {
      // Akan consonant mappings
      mapped = mapped
        .replace(/ky/gi, 'ch')
        .replace(/gy/gi, 'j')
        .replace(/tw/gi, 'chw')
        .replace(/hw/gi, 'fw')
        .replace(/hy/gi, 'sh');
    } else if (language === 'ewe') {
      // Ewe consonant mappings
      mapped = mapped
        .replace(/ɖ/g, 'd')
        .replace(/Ɖ/g, 'D')
        .replace(/ƒ/g, 'f')
        .replace(/Ƒ/g, 'F')
        .replace(/ʋ/g, 'v')
        .replace(/Ʋ/g, 'V')
        .replace(/kp/gi, 'kp')
        .replace(/gb/gi, 'gb')
        .replace(/ny/gi, 'ny');
    } else if (language === 'ga') {
      // Ga specific mappings
      mapped = mapped
        .replace(/kp/gi, 'kp')
        .replace(/gb/gi, 'gb')
        .replace(/sh/gi, 'sh');
    }

    return mapped;
  }

  /**
   * Synthesize natural Ghanaian speech using procedural formant filters and pitch modulation.
   */
  public async speakProcedural(
    text: string,
    language: GhanaianLanguage,
    config: TTSConfig
  ): Promise<void> {
    try {
      const ctx = this.getAudioContext();
      this.isSpeaking = true;

      // Base fundamental frequency (F0) based on voice gender
      let baseFreq = 165; // female default
      if (config.voiceGender === 'male') baseFreq = 110;
      if (config.voiceGender === 'child') baseFreq = 240;
      baseFreq *= config.pitch;

      const words = text.split(/\s+/).filter(w => w.length > 0);
      const syllablesPerSecond = 4.2 * config.speed;
      const syllableDuration = 1 / syllablesPerSecond;

      let currentTime = ctx.currentTime + 0.05;

      for (let wIdx = 0; wIdx < words.length; wIdx++) {
        const word = words[wIdx].toLowerCase().replace(/[^a-zɛɔŋɖʋa-z]/g, '');
        if (!word) continue;

        // Approximate syllables
        const syllables = word.match(/[^aeiouɛɔãẽõ]*[aeiouɛɔãẽõ]+(?:[^aeiouɛɔãẽõ]+(?![aeiouɛɔãẽõ]))*/g) || [word];

        for (let sIdx = 0; sIdx < syllables.length; sIdx++) {
          const syllable = syllables[sIdx];
          const hasVowelMatch = syllable.match(/[aeiouɛɔ]/);
          const vowel = hasVowelMatch ? hasVowelMatch[0] : 'a';
          const formants = GHANAIAN_VOWEL_FORMANTS[vowel] || [600, 1500, 2500];

          // 1. Glottal Pulse Generator (Voice Source)
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          // Tone variation (High / Low / Mid cadence typical in Ghanaian tonal speech)
          const toneOffset = (sIdx % 2 === 0 ? 12 : -8) + (wIdx === words.length - 1 && sIdx === syllables.length - 1 ? -15 : 0);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(baseFreq + toneOffset, currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq + toneOffset * 0.85, currentTime + syllableDuration);

          // 2. Formant Filters (F1, F2)
          const f1Filter = ctx.createBiquadFilter();
          f1Filter.type = 'bandpass';
          f1Filter.frequency.setValueAtTime(formants[0], currentTime);
          f1Filter.Q.setValueAtTime(4.5, currentTime);

          const f2Filter = ctx.createBiquadFilter();
          f2Filter.type = 'bandpass';
          f2Filter.frequency.setValueAtTime(formants[1], currentTime);
          f2Filter.Q.setValueAtTime(5.5, currentTime);

          // Envelope shaping
          gainNode.gain.setValueAtTime(0.001, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.35 * config.volume, currentTime + 0.03);
          gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + syllableDuration);

          // Routing
          osc.connect(f1Filter);
          osc.connect(f2Filter);
          f1Filter.connect(gainNode);
          f2Filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(currentTime);
          osc.stop(currentTime + syllableDuration);

          currentTime += syllableDuration + 0.015;
        }

        // Inter-word pause
        currentTime += 0.08 / config.speed;
      }

      await new Promise(res => setTimeout(res, (currentTime - ctx.currentTime) * 1000));
      this.isSpeaking = false;
    } catch (err) {
      console.warn('Formant synthesis fallback error:', err);
      this.isSpeaking = false;
    }
  }

  /**
   * Speak using browser Web Speech API with Ghanaian phonetic adaptation.
   */
  public speakWithBrowserAPI(
    text: string,
    language: GhanaianLanguage,
    config: TTSConfig
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const phoneticText = this.getPhoneticMapping(text, language);
      const utterance = new SpeechSynthesisUtterance(phoneticText);

      utterance.rate = config.speed;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      // Try selecting an African or British English voice if available, which handles Ghanaian accents best
      const voices = window.speechSynthesis.getVoices();
      const africanVoice = voices.find(v => 
        v.lang.includes('GH') || 
        v.lang.includes('NG') || 
        v.lang.includes('ZA') || 
        v.name.toLowerCase().includes('african') ||
        v.lang.startsWith('en-GB')
      );
      if (africanVoice) {
        utterance.voice = africanVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        resolve();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Master speak method: selects optimal synthesis tier.
   */
  public async speak(
    text: string,
    language: GhanaianLanguage,
    config: TTSConfig
  ): Promise<void> {
    if (!text || text.trim().length === 0) return;

    if (config.engineMode === 'browser-speech') {
      await this.speakWithBrowserAPI(text, language, config);
    } else {
      // Default to hybrid formant synthesis + speech fallback
      try {
        await this.speakProcedural(text, language, config);
      } catch {
        await this.speakWithBrowserAPI(text, language, config);
      }
    }

    if (config.repeatPhrase) {
      await new Promise(r => setTimeout(r, 400));
      await this.speak(text, language, { ...config, repeatPhrase: false });
    }
  }

  public stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
    this.isSpeaking = false;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const audioEngine = new GhanaianAudioEngine();
