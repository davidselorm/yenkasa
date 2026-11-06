import React from 'react';
import { 
  Volume2, 
  Mic, 
  Settings, 
  RefreshCw, 
  Globe, 
  BookmarkCheck, 
  Sliders, 
  MessageSquare
} from 'lucide-react';
import { GhanaianLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface HeaderProps {
  currentLanguage: GhanaianLanguage;
  onLanguageChange: (lang: GhanaianLanguage) => void;
  onOpenSpeechRepair: () => void;
  onOpenTTSStudio: () => void;
  onOpenTwoWayBridge: () => void;
  onOpenVoiceBanking: () => void;
  onOpenSettings: () => void;
  isSwitchScanningActive: boolean;
  isSpeaking: boolean;
  theme: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenSpeechRepair,
  onOpenTTSStudio,
  onOpenTwoWayBridge,
  onOpenVoiceBanking,
  onOpenSettings,
  isSwitchScanningActive,
  isSpeaking,
  theme
}) => {
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.id === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const isYellowTheme = theme === 'high-contrast-yellow';
  const isDarkTheme = theme === 'dark';

  return (
    <header className={`border-b transition-colors ${
      isYellowTheme 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : isDarkTheme 
        ? 'bg-slate-900 border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    } sticky top-0 z-40 px-3 py-2.5 sm:px-6 sm:py-3.5`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-rose-600 shadow-md text-white font-black text-xl">
              <span>Yɛ</span>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                  <span>Yenkasa</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Ghana
                  </span>
                </h1>
                {isSwitchScanningActive && (
                  <span className="animate-pulse text-xs bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded">
                    SCANNING ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Assistive Speech Recognition & Native AAC for Ghanaian Languages
              </p>
            </div>
          </div>

          {/* Quick Mobile Language Dropdown */}
          <div className="md:hidden">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as GhanaianLanguage)}
              aria-label="Select Ghanaian Language"
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language selector & innovation modules */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          
          {/* Desktop Language Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Globe className="w-4 h-4 ml-2 text-slate-500" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as GhanaianLanguage)}
              aria-label="Select Ghanaian Language"
              className="text-sm font-semibold bg-transparent text-slate-800 dark:text-slate-200 border-none outline-none pr-3 py-1 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                  {lang.name} ({lang.localName})
                </option>
              ))}
            </select>
          </div>

          {/* Dysarthric Speech Repair (ASR) */}
          <button
            onClick={onOpenSpeechRepair}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white shadow-sm transition active:scale-95"
            title="Calibrate and repair dysarthric / slurred speech into clear Ghanaian phrases"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Speech Repair ASR</span>
            <span className="sm:hidden">Repair</span>
          </button>

          {/* Ghanaian TTS Studio */}
          <button
            onClick={onOpenTTSStudio}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-sm transition active:scale-95"
            title="Custom Ghanaian Text-to-Speech Phonetics & Formant Synthesizer"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">TTS Studio</span>
            <span className="sm:hidden">TTS</span>
          </button>

          {/* Two-Way Dialogue Bridge */}
          <button
            onClick={onOpenTwoWayBridge}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95"
            title="Two-Way Dialogue between Speech Impaired & Caregiver/Doctor"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">2-Way Bridge</span>
            <span className="sm:hidden">Bridge</span>
          </button>

          {/* Voice Banking */}
          <button
            onClick={onOpenVoiceBanking}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition active:scale-95"
            title="Voice Banking & Custom AAC Phrases"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Bank</span>
            <span className="sm:hidden">Bank</span>
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            title="Accessibility Settings (Switch Access, Dwell Click, High Contrast)"
            aria-label="Accessibility Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
