import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  AACBoard 
} from './components/AACBoard';
import { 
  SpeechClarifierModal 
} from './components/SpeechClarifierModal';
import { 
  TTSStudioModal 
} from './components/TTSStudioModal';
import { 
  TwoWayBridgeModal 
} from './components/TwoWayBridgeModal';
import { 
  VoiceBankingModal 
} from './components/VoiceBankingModal';
import { 
  AccessibilitySettingsModal 
} from './components/AccessibilitySettings';
import { 
  GhanaianLanguage, 
  AACTile, 
  TTSConfig, 
  AccessibilitySettings 
} from './types';
import { INITIAL_AAC_VOCABULARY } from './data/aacVocabulary';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { voiceBankingService } from './services/voiceBanking';
import { audioEngine } from './services/audioEngine';
import { 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  Heart, 
  Code2, 
  Info,
  ShieldCheck
} from 'lucide-react';

export const App: React.FC = () => {
  // Primary application state
  const [currentLanguage, setCurrentLanguage] = useState<GhanaianLanguage>('twi-asante');
  const [customTiles, setCustomTiles] = useState<AACTile[]>(voiceBankingService.getAsAACTiles());
  
  // TTS configuration
  const [ttsConfig, setTtsConfig] = useState<TTSConfig>({
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voiceGender: 'female',
    engineMode: 'hybrid-formant',
    repeatPhrase: false
  });

  // Accessibility settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    switchScanningEnabled: false,
    scanSpeedMs: 1800,
    dwellClickEnabled: false,
    dwellTimeMs: 1200,
    theme: 'light',
    largeText: false,
    hapticFeedback: true,
    auditoryPrompt: true
  });

  // Modals state
  const [isSpeechRepairOpen, setIsSpeechRepairOpen] = useState(false);
  const [isTTSStudioOpen, setIsTTSStudioOpen] = useState(false);
  const [isTwoWayBridgeOpen, setIsTwoWayBridgeOpen] = useState(false);
  const [isVoiceBankingOpen, setIsVoiceBankingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Switch scanning index
  const [activeScanIndex, setActiveScanIndex] = useState(0);

  // Combined vocabulary (Preset + Custom Banked)
  const allTiles: AACTile[] = [...customTiles, ...INITIAL_AAC_VOCABULARY];

  // Refresh custom cards when modified
  const handleCustomCardsChanged = () => {
    setCustomTiles(voiceBankingService.getAsAACTiles());
  };

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-high-contrast');

    if (accessibility.theme === 'dark') {
      root.classList.add('dark');
    } else if (accessibility.theme === 'high-contrast-yellow') {
      root.classList.add('theme-high-contrast');
    }
  }, [accessibility.theme]);

  // Switch-Access Auto Scanning Timer Loop
  useEffect(() => {
    if (!accessibility.switchScanningEnabled) return;

    const interval = setInterval(() => {
      setActiveScanIndex(prev => (prev + 1) % allTiles.length);
    }, accessibility.scanSpeedMs);

    return () => clearInterval(interval);
  }, [accessibility.switchScanningEnabled, accessibility.scanSpeedMs, allTiles.length]);

  // Switch-Access Keyboard Handler (Space / Enter trigger)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!accessibility.switchScanningEnabled) return;

    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      const currentTile = allTiles[activeScanIndex];
      if (currentTile) {
        const textToSpeak = currentTile.translations[currentLanguage] || currentTile.translations['twi-asante'];
        audioEngine.speak(textToSpeak, currentLanguage, ttsConfig);
      }
    }
  }, [accessibility.switchScanningEnabled, activeScanIndex, allTiles, currentLanguage, ttsConfig]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentLangDetails = SUPPORTED_LANGUAGES.find(l => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      accessibility.theme === 'high-contrast-yellow'
        ? 'bg-black text-yellow-300'
        : accessibility.theme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. Header with Language Selector & Innovation Links */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenSpeechRepair={() => setIsSpeechRepairOpen(true)}
        onOpenTTSStudio={() => setIsTTSStudioOpen(true)}
        onOpenTwoWayBridge={() => setIsTwoWayBridgeOpen(true)}
        onOpenVoiceBanking={() => setIsVoiceBankingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSwitchScanningActive={accessibility.switchScanningEnabled}
        isSpeaking={audioEngine.getSpeakingState()}
        theme={accessibility.theme}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        
        {/* Region & Cultural Context Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-rose-500/10 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg">
              🇬🇭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base">
                  Active Dialect: {currentLangDetails.name} ({currentLangDetails.localName})
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentLangDetails.dialect}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spoken across {currentLangDetails.region} • Sample greeting: &ldquo;{currentLangDetails.sampleGreeting}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => audioEngine.speak(currentLangDetails.sampleGreeting, currentLanguage, ttsConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Listen to Dialect 🔊</span>
            </button>
          </div>
        </div>

        {/* 3. Primary AAC Board & Sentence Builder */}
        <AACBoard
          tiles={allTiles}
          currentLanguage={currentLanguage}
          ttsConfig={ttsConfig}
          accessibility={accessibility}
          activeScanIndex={activeScanIndex}
          onTileSelect={() => {}}
          onOpenVoiceBanking={() => setIsVoiceBankingOpen(true)}
        />

        {/* 4. Quick Emergency / SOS Bar (Fixed bottom or persistent) */}
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Instant Emergency Cues (One-Tap Alarm):</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => audioEngine.speak('Boa me ntɛm ara!', currentLanguage, { ...ttsConfig, repeatPhrase: true })}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition active:scale-95"
            >
              🚨 Help Now! (Boa me!)
            </button>
            <button
              onClick={() => audioEngine.speak('M’ahwe fam, boa me!', currentLanguage, ttsConfig)}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              ⚠️ I Fell Down!
            </button>
            <button
              onClick={() => audioEngine.speak('Mentumi nnye me home yie', currentLanguage, ttsConfig)}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              🫁 Breathing Issue
            </button>
          </div>
        </div>

      </main>

      {/* 5. Footer with Open Source & Challenge Context */}
      <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Yenkasa (Yɛnkasa)</span>
            <span>•</span>
            <span>Empowering Speech Impaired Individuals in Ghanaian Languages</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/davidselorm/yenkasa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
            >
              <Code2 className="w-4 h-4" />
              <span>GitHub Repository</span>
            </a>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline-First PWA</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SpeechClarifierModal
        isOpen={isSpeechRepairOpen}
        onClose={() => setIsSpeechRepairOpen(false)}
        currentLanguage={currentLanguage}
        ttsConfig={ttsConfig}
      />

      <TTSStudioModal
        isOpen={isTTSStudioOpen}
        onClose={() => setIsTTSStudioOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        ttsConfig={ttsConfig}
        onTTSConfigChange={setTtsConfig}
      />

      <TwoWayBridgeModal
        isOpen={isTwoWayBridgeOpen}
        onClose={() => setIsTwoWayBridgeOpen(false)}
        currentLanguage={currentLanguage}
        ttsConfig={ttsConfig}
      />

      <VoiceBankingModal
        isOpen={isVoiceBankingOpen}
        onClose={() => setIsVoiceBankingOpen(false)}
        currentLanguage={currentLanguage}
        onCardAdded={handleCustomCardsChanged}
      />

      <AccessibilitySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={accessibility}
        onSettingsChange={setAccessibility}
      />

    </div>
  );
};
