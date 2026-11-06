import { GhanaianLanguage, TTSConfig } from '../types';

class GhanaianAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  /**
   * Phonetic converter so browser speech engines pronounce Ghanaian words
   * (Akan/Twi, Ga, Ewe, Dagbani) naturally and articulately.
   */
  public getPhoneticMapping(text: string, language: GhanaianLanguage): string {
    let mapped = text;

    // Normalizing Ghanaian special vowels to phonetic approximations
    mapped = mapped
      .replace(/ɛ/g, 'eh')
      .replace(/Ɛ/g, 'Eh')
      .replace(/ɔ/g, 'aw')
      .replace(/Ɔ/g, 'Aw')
      .replace(/ŋ/g, 'ng')
      .replace(/Ŋ/g, 'Ng');

    if (language.startsWith('twi') || language === 'fante') {
      // Akan specific consonants
      mapped = mapped
        .replace(/ky/gi, 'ch')
        .replace(/gy/gi, 'j')
        .replace(/tw/gi, 'chw')
        .replace(/hw/gi, 'fw')
        .replace(/hy/gi, 'sh');
    } else if (language === 'ewe') {
      // Ewe specific consonants
      mapped = mapped
        .replace(/ɖ/g, 'd')
        .replace(/Ɖ/g, 'D')
        .replace(/ƒ/g, 'f')
        .replace(/Ƒ/g, 'F')
        .replace(/ʋ/g, 'v')
        .replace(/Ʋ/g, 'V')
        .replace(/kp/gi, 'kp')
        .replace(/gb/gi, 'gb');
    } else if (language === 'ga') {
      // Ga specific mappings
      mapped = mapped
        .replace(/kp/gi, 'kp')
        .replace(/gb/gi, 'gb');
    }

    return mapped;
  }

  /**
   * Speak clear spoken human voice using browser speech synthesis with Ghanaian phonetics
   * and optional English meaning for 100% clarity.
   */
  public speakWithBrowserAPI(
    text: string,
    language: GhanaianLanguage,
    config: TTSConfig,
    englishMeaning?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this environment.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Ensure voices are loaded
      if (this.voices.length === 0) {
        this.voices = window.speechSynthesis.getVoices();
      }

      const phoneticGhanaian = this.getPhoneticMapping(text, language);

      // Construct spoken text: Speaks the Ghanaian phrase clearly, and if an English translation
      // is provided and different, also speaks the meaning so everyone understands!
      let speechText = phoneticGhanaian;
      if (config.speakEnglishSubtitle && englishMeaning && englishMeaning.toLowerCase() !== text.toLowerCase()) {
        speechText = `${phoneticGhanaian}. (${englishMeaning})`;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = Math.max(0.7, Math.min(1.3, config.speed));
      utterance.pitch = Math.max(0.8, Math.min(1.4, config.pitch));
      utterance.volume = Math.max(0.2, Math.min(1.0, config.volume));

      // Voice selection: find best matching voice (African English, British English, or matching gender)
      let selectedVoice: SpeechSynthesisVoice | undefined;

      // 1. Look for African / Nigerian / South African English voice if available
      selectedVoice = this.voices.find(v => 
        v.lang.includes('GH') || 
        v.lang.includes('NG') || 
        v.lang.includes('ZA') || 
        v.name.toLowerCase().includes('ghana') ||
        v.name.toLowerCase().includes('nigeria')
      );

      // 2. Gender matching if requested
      if (!selectedVoice && config.voiceGender) {
        if (config.voiceGender === 'male') {
          selectedVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george'))
          );
        } else if (config.voiceGender === 'female') {
          selectedVoice = this.voices.find(v => 
            v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('susan') || v.name.toLowerCase().includes('hazel'))
          );
        }
      }

      // 3. Fallback to British or standard English
      if (!selectedVoice) {
        selectedVoice = this.voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.isSpeaking = false;
        resolve();
      };

      this.isSpeaking = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Master speak method: Defaults to clear, intelligible human speech synthesis!
   */
  public async speak(
    text: string,
    language: GhanaianLanguage,
    config: TTSConfig,
    englishMeaning?: string
  ): Promise<void> {
    if (!text || text.trim().length === 0) return;

    // Always use real human voice synthesis for understandable speech
    await this.speakWithBrowserAPI(text, language, config, englishMeaning);

    if (config.repeatPhrase) {
      await new Promise(r => setTimeout(r, 450));
      await this.speakWithBrowserAPI(text, language, { ...config, repeatPhrase: false }, englishMeaning);
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
