import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Square, 
  Sliders, 
  Sparkles, 
  Languages, 
  Zap, 
  Settings2,
  Play
} from 'lucide-react';
import { GhanaianLanguage, TTSConfig } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { audioEngine } from '../services/audioEngine';

interface TTSStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: GhanaianLanguage;
  onLanguageChange: (lang: GhanaianLanguage) => void;
  ttsConfig: TTSConfig;
  onTTSConfigChange: (newConfig: TTSConfig) => void;
}

export const TTSStudioModal: React.FC<TTSStudioModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  ttsConfig,
  onTTSConfigChange
}) => {
  const [inputText, setInputText] = useState('Akwaaba, me ma wo akye!');
  const [isPlaying, setIsPlaying] = useState(false);

  // Ghanaian special characters
  const specialChars = ['ɛ', 'ɔ', 'Ɛ', 'Ɔ', 'ŋ', 'Ŋ', 'ɖ', 'Ɖ', 'ʋ', 'Ʋ', 'ã', 'ẽ', 'õ'];

  const samplePresets: Record<GhanaianLanguage, string[]> = {
    'twi-asante': [
      'Akwaaba, me ma wo akye!',
      'Medase pa ara, me ho yɛ',
      'Waakye ne shito ne kɔsʊa',
      'Mepaakyɛw bue ɛpono no ma me'
    ],
    'twi-akuapem': [
      'Mema wo akye, asomdwoe nka wo',
      'Kɔm de me, mepɛ nsuo a mɛnom',
      'Ɛberɛ aso sɛ menom aduro'
    ],
    'fante': [
      'Me kyea wo, wo ho tse dɛn?',
      'Medaase pii, mepaakyɛw bra fie',
      'Ghana Jollof na nam yɛ dɛ papaapa'
    ],
    'ga': [
      'Minge Oyiwala donn, baa jogbaŋŋ!',
      'Nu fɛɔɔ ni manu, hejɔlɛ',
      'Awula nyoŋmɔ, teŋ tɛŋ oyɔɔ?'
    ],
    'ewe': [
      'Woezɔ! Ndi na wò nyuie',
      'Akpe na wò ŋutɔ, fafa le eme',
      'Tsi faafĩ mano, dɔ le wuyem'
    ],
    'dagbani': [
      'Desiba, alaafee bɛni suhudoo',
      'M-pua pam, n-bɔri kom ni n-nyu',
      'Marhaba, zaayuma viɛnyɛla'
    ]
  };

  const handleInsertChar = (ch: string) => {
    setInputText(prev => prev + ch);
  };

  const handleSpeak = async () => {
    setIsPlaying(true);
    await audioEngine.speak(inputText, currentLanguage, ttsConfig);
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const phoneticRepresentation = audioEngine.getPhoneticMapping(inputText, currentLanguage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Ghanaian Text-to-Speech (TTS) Studio</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Formant Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acoustic speech synthesis supporting Ghanaian tonal contours and open-mid vowels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Language Selection */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Target Dialect:
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as GhanaianLanguage)}
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  🇬🇭 {lang.name} ({lang.dialect})
                </option>
              ))}
            </select>
          </div>

          {/* Text Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Text to Synthesize:</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Phonetic transliteration: &ldquo;{phoneticRepresentation}&rdquo;
              </span>
            </div>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any sentence in Twi, Ga, Ewe, or Dagbani..."
              className="w-full p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:border-emerald-500 outline-none text-base"
            />

            {/* Quick Ghanaian Characters Bar */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Insert Characters:
              </span>
              {specialChars.map((ch) => (
                <button
                  key={ch}
                  onClick={() => handleInsertChar(ch)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-sm rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition active:scale-90"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Samples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sample Ghanaian Phrases:
            </span>
            <div className="flex items-center flex-wrap gap-2">
              {(samplePresets[currentLanguage] || samplePresets['twi-asante']).map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(phrase)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Controls (Speed, Pitch, Gender, Engine) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              <span>Voice Modulation & Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Speed / Cadence:</span>
                  <span className="text-emerald-600 font-bold">{ttsConfig.speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={ttsConfig.speed}
                  onChange={(e) => onTTSConfigChange({ ...ttsConfig, speed: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Pitch Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Pitch / Tone:</span>
                  <span className="text-emerald-600 font-bold">{ttsConfig.pitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.05"
                  value={ttsConfig.pitch}
                  onChange={(e) => onTTSConfigChange({ ...ttsConfig, pitch: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Voice Gender & Synthesis Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Voice Profile:</label>
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                  {(['female', 'male', 'child'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => onTTSConfigChange({ ...ttsConfig, voiceGender: gender })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg capitalize transition ${
                        ttsConfig.voiceGender === gender 
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Synthesis Engine:</label>
                <select
                  value={ttsConfig.engineMode}
                  onChange={(e) => onTTSConfigChange({ ...ttsConfig, engineMode: e.target.value as any })}
                  className="w-full text-xs font-bold bg-slate-200 dark:bg-slate-700 border-none rounded-xl p-2 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="hybrid-formant">Hybrid Formant (Ghanaian Vowels)</option>
                  <option value="browser-speech">Browser Phonetic Adaptation</option>
                  <option value="cloud-api">Cloud API (Khaya / MMS Bridge)</option>
                </select>
              </div>
            </div>

            {/* Repeat Phrase Toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={ttsConfig.repeatPhrase}
                onChange={(e) => onTTSConfigChange({ ...ttsConfig, repeatPhrase: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Repeat phrase twice (recommended for noisy markets / trotro stations)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              disabled={isPlaying || !inputText.trim()}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isPlaying ? 'Synthesizing...' : 'Synthesize & Speak Aloud 🔊'}</span>
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition"
                title="Stop Speech"
              >
                <Square className="w-5 h-5 fill-white" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
