import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Trash2, 
  Delete, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  PlusCircle,
  VolumeX,
  Share2
} from 'lucide-react';
import { AACTile, GhanaianLanguage, AACCategory, AccessibilitySettings, TTSConfig } from '../types';
import { AAC_CATEGORIES } from '../data/languages';
import { audioEngine } from '../services/audioEngine';

interface AACBoardProps {
  tiles: AACTile[];
  currentLanguage: GhanaianLanguage;
  ttsConfig: TTSConfig;
  accessibility: AccessibilitySettings;
  activeScanIndex: number;
  onTileSelect: (tile: AACTile) => void;
  onOpenVoiceBanking: () => void;
}

export const AACBoard: React.FC<AACBoardProps> = ({
  tiles,
  currentLanguage,
  ttsConfig,
  accessibility,
  activeScanIndex,
  onTileSelect,
  onOpenVoiceBanking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AACCategory>('all');
  const [sentenceTiles, setSentenceTiles] = useState<AACTile[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [dwellProgressTileId, setDwellProgressTileId] = useState<string | null>(null);
  const dwellTimerRef = useRef<number | null>(null);

  // Filter tiles by category
  const filteredTiles = tiles.filter(tile => {
    if (selectedCategory === 'all') return true;
    return tile.category === selectedCategory;
  });

  // Handle tile click: Add to sentence bar and immediately speak it
  const handleCardClick = (tile: AACTile) => {
    setSentenceTiles(prev => [...prev, tile]);
    const textToSpeak = tile.translations[currentLanguage] || tile.translations['twi-asante'];
    audioEngine.speak(textToSpeak, currentLanguage, ttsConfig);
    onTileSelect(tile);

    // Haptic feedback if enabled and supported
    if (accessibility.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
  };

  // Handle Dwell Clicking for eye-trackers & head-pointers
  const handleMouseEnter = (tile: AACTile) => {
    if (!accessibility.dwellClickEnabled) return;
    setDwellProgressTileId(tile.id);

    dwellTimerRef.current = window.setTimeout(() => {
      handleCardClick(tile);
      setDwellProgressTileId(null);
    }, accessibility.dwellTimeMs || 1200);
  };

  const handleMouseLeave = () => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
    setDwellProgressTileId(null);
  };

  // Speak the entire constructed sentence
  const handleSpeakSentence = () => {
    if (sentenceTiles.length === 0) return;
    const fullSentence = sentenceTiles
      .map(t => t.translations[currentLanguage] || t.translations['twi-asante'])
      .join(' ');

    audioEngine.speak(fullSentence, currentLanguage, ttsConfig);
  };

  // Clear sentence
  const handleClear = () => {
    setSentenceTiles([]);
    audioEngine.stop();
  };

  // Backspace one tile
  const handleBackspace = () => {
    setSentenceTiles(prev => prev.slice(0, -1));
  };

  // Copy sentence text to clipboard
  const handleCopySentence = () => {
    const text = sentenceTiles
      .map(t => t.translations[currentLanguage] || t.translations['twi-asante'])
      .join(' ');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Helper color map for Fitzgerald Key borders & cards
  const getColorClasses = (colorKey: string) => {
    switch (colorKey) {
      case 'red':
        return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 shadow-rose-100 hover:bg-rose-100';
      case 'pink':
        return 'border-pink-400 bg-pink-50 dark:bg-pink-950/40 text-pink-950 dark:text-pink-100 shadow-pink-100 hover:bg-pink-100';
      case 'orange':
        return 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-amber-100 hover:bg-amber-100';
      case 'blue':
        return 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 shadow-sky-100 hover:bg-sky-100';
      case 'green':
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-emerald-100 hover:bg-emerald-100';
      case 'yellow':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-950 dark:text-yellow-100 shadow-yellow-100 hover:bg-yellow-100';
      default:
        return 'border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Dynamic Sentence Builder Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Constructed Sentence Bar (Yɛnkasa Phrase Builder)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBackspace}
              disabled={sentenceTiles.length === 0}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
              title="Delete last word"
              aria-label="Delete last word"
            >
              <Delete className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={handleClear}
              disabled={sentenceTiles.length === 0}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 disabled:opacity-40 transition"
              title="Clear all"
              aria-label="Clear all"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
            </button>
            <button
              onClick={handleCopySentence}
              disabled={sentenceTiles.length === 0}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
              title="Copy sentence"
              aria-label="Copy sentence"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Sentence Tiles Display */}
        <div className="min-h-[72px] flex items-center flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          {sentenceTiles.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-500 text-sm font-medium italic flex items-center gap-2 px-2">
              <span>👉 Tap tiles below to build a sentence in Ghanaian languages, or click Speak</span>
            </div>
          ) : (
            sentenceTiles.map((tile, idx) => (
              <div 
                key={`${tile.id}-${idx}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 shadow-sm animate-in fade-in zoom-in-95 duration-150"
              >
                <span className="text-xl">{tile.icon}</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {tile.translations[currentLanguage] || tile.translations['twi-asante']}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Speak Full Sentence Big Button */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
            {sentenceTiles.length > 0 && (
              <span>English meaning: &ldquo;{sentenceTiles.map(t => t.english).join(' ')}&rdquo;</span>
            )}
          </div>

          <button
            onClick={handleSpeakSentence}
            disabled={sentenceTiles.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm sm:text-base shadow-md disabled:opacity-40 transition active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
            <span>Speak Full Sentence 🔊</span>
          </button>
        </div>
      </div>

      {/* 2. Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {AAC_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          const localizedName = cat.name[currentLanguage] || cat.name['twi-asante'];

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isSelected 
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-slate-900 dark:border-amber-400 shadow-sm scale-105' 
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.englishName}</span>
              <span className="opacity-70 text-[11px] font-normal">({localizedName})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Communication Grid (AAC Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredTiles.map((tile, index) => {
          const isCurrentScanTarget = accessibility.switchScanningEnabled && activeScanIndex === index;
          const localizedPhrase = tile.translations[currentLanguage] || tile.translations['twi-asante'];
          const phonetic = tile.phonetics?.[currentLanguage];
          const isDwellActive = dwellProgressTileId === tile.id;

          return (
            <button
              key={tile.id}
              onClick={() => handleCardClick(tile)}
              onMouseEnter={() => handleMouseEnter(tile)}
              onMouseLeave={handleMouseLeave}
              className={`relative flex flex-col items-center justify-between text-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-150 min-h-[140px] sm:min-h-[155px] cursor-pointer group shadow-sm active:scale-95 ${
                getColorClasses(tile.colorKey)
              } ${isCurrentScanTarget ? 'switch-highlight ring-4 ring-amber-500' : ''}`}
              title={`${localizedPhrase} (${tile.english})`}
            >
              {/* Dwell Progress Ring if hovering */}
              {isDwellActive && (
                <div className="absolute inset-0 rounded-2xl border-4 border-amber-500 animate-pulse bg-amber-500/10 pointer-events-none" />
              )}

              {/* Quick Code Badge or Custom Tag */}
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400">
                {tile.quickCode ? (
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60">
                    {tile.quickCode}
                  </span>
                ) : <span />}
                {tile.isCustom && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Custom
                  </span>
                )}
              </div>

              {/* Icon / Emoji */}
              <div className="text-3xl sm:text-4xl my-1 group-hover:scale-110 transition-transform">
                {tile.icon}
              </div>

              {/* Local Ghanaian Translation */}
              <div className="w-full">
                <div className="text-sm sm:text-base font-extrabold leading-snug line-clamp-2">
                  {localizedPhrase}
                </div>
                
                {/* English Meaning */}
                <div className="text-[11px] opacity-75 font-medium line-clamp-1 mt-0.5">
                  {tile.english}
                </div>

                {/* Phonetics if present */}
                {phonetic && (
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-mono italic line-clamp-1 mt-0.5">
                    /{phonetic}/
                  </div>
                )}
              </div>

              {/* Subtle speaker indicator on hover */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </button>
          );
        })}

        {/* Add Custom Tile Quick Button */}
        <button
          onClick={onOpenVoiceBanking}
          className="flex flex-col items-center justify-center text-center p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-slate-500 hover:text-purple-600 transition min-h-[140px] sm:min-h-[155px]"
        >
          <PlusCircle className="w-8 h-8 mb-2" />
          <span className="font-bold text-xs sm:text-sm">Add Custom Word</span>
          <span className="text-[11px] opacity-75 mt-0.5">Record or Type</span>
        </button>
      </div>
    </div>
  );
};
