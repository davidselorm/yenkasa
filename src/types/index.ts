export type GhanaianLanguage = 
  | 'twi-asante'
  | 'twi-akuapem'
  | 'fante'
  | 'ga'
  | 'ewe'
  | 'dagbani';

export interface LanguageInfo {
  id: GhanaianLanguage;
  name: string;
  localName: string;
  dialect: string;
  region: string;
  sampleGreeting: string;
}

export type AACCategory = 
  | 'all'
  | 'greetings'
  | 'food'
  | 'health'
  | 'needs'
  | 'transit'
  | 'market'
  | 'family'
  | 'emergency';

export interface CategoryInfo {
  id: AACCategory;
  name: Record<GhanaianLanguage, string>;
  englishName: string;
  icon: string;
  color: string;
}

export type FitzgeraldKeyColor = 
  | 'yellow'  // People / Pronouns
  | 'green'   // Actions / Verbs
  | 'blue'    // Adjectives / Feelings / Needs
  | 'orange'  // Nouns / Things / Places
  | 'pink'    // Social / Greetings
  | 'red';    // Emergency / Critical

export interface AACTile {
  id: string;
  icon: string;
  category: AACCategory;
  colorKey: FitzgeraldKeyColor;
  translations: Record<GhanaianLanguage, string>;
  english: string;
  phonetics?: Partial<Record<GhanaianLanguage, string>>;
  quickCode?: string;
  isCustom?: boolean;
}

export interface DysarthricSample {
  phraseId: string;
  targetPhrase: string;
  timestamp: number;
  acousticFeatures: {
    energy: number;
    spectralCentroid: number;
    zeroCrossingRate: number;
    pitchEstimate: number;
    durationMs: number;
  };
}

export interface DysarthriaProfile {
  id: string;
  userName: string;
  conditionType: 'dysarthria' | 'stroke' | 'als' | 'cerebral-palsy' | 'stuttering' | 'general';
  sensitivity: number; // 0.1 to 1.0
  calibratedSamples: DysarthricSample[];
  updatedAt: string;
}

export interface TTSConfig {
  speed: number;       // 0.6 - 1.4
  pitch: number;       // 0.7 - 1.5
  volume: number;      // 0 - 1
  voiceGender: 'female' | 'male' | 'child';
  engineMode: 'hybrid-formant' | 'browser-speech' | 'cloud-api';
  repeatPhrase: boolean;
  speakEnglishSubtitle?: boolean; // Also speak English meaning for complete clarity
}

export interface AccessibilitySettings {
  switchScanningEnabled: boolean;
  scanSpeedMs: number;
  dwellClickEnabled: boolean;
  dwellTimeMs: number;
  theme: 'light' | 'dark' | 'high-contrast-yellow';
  largeText: boolean;
  hapticFeedback: boolean;
  auditoryPrompt: boolean;
}

export interface DialogueMessage {
  id: string;
  sender: 'impaired-user' | 'partner';
  senderName: string;
  textGhanaian: string;
  textEnglish: string;
  language: GhanaianLanguage;
  timestamp: string;
  audioGenerated?: boolean;
}

export interface CustomVoiceBankCard {
  id: string;
  icon: string;
  category: AACCategory;
  translations: Record<GhanaianLanguage, string>;
  english: string;
  recordedAudioDataUrl?: string;
  createdAt: string;
}
