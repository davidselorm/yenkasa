import React from 'react';
import { 
  X, 
  Eye, 
  Keyboard, 
  Smartphone, 
  Volume2, 
  Contrast, 
  Sliders, 
  Check, 
  Sparkles
} from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSettingsChange: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Accessibility & Switch Access</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  WCAG AAA
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assistive controls for motor, visual, and cognitive impairments
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

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* 1. Theme & Contrast */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Contrast className="w-4 h-4 text-amber-500" />
              <span>Visual Theme & Contrast:</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onSettingsChange({ ...settings, theme: 'light' })}
                className={`p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  settings.theme === 'light' 
                    ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-sm' 
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-sm" />
                <span>Light</span>
              </button>

              <button
                onClick={() => onSettingsChange({ ...settings, theme: 'dark' })}
                className={`p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  settings.theme === 'dark' 
                    ? 'border-amber-500 bg-slate-800 text-white shadow-sm' 
                    : 'border-slate-700 bg-slate-900 text-slate-300'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 shadow-sm" />
                <span>Dark OLED</span>
              </button>

              <button
                onClick={() => onSettingsChange({ ...settings, theme: 'high-contrast-yellow' })}
                className={`p-3 rounded-2xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  settings.theme === 'high-contrast-yellow' 
                    ? 'border-yellow-400 bg-black text-yellow-300 shadow-sm' 
                    : 'border-yellow-600 bg-black text-yellow-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black shadow-sm" />
                <span>Yellow / Black</span>
              </button>
            </div>
          </div>

          {/* 2. Switch Access / Auto Scanning */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Switch Access (Auto-Scanning)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cycles through tiles. Press Spacebar or Enter to select.
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={settings.switchScanningEnabled}
                onChange={(e) => onSettingsChange({ ...settings, switchScanningEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {settings.switchScanningEnabled && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Scanning Interval:</span>
                  <span className="text-amber-600 font-bold">{(settings.scanSpeedMs / 1000).toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="4000"
                  step="200"
                  value={settings.scanSpeedMs}
                  onChange={(e) => onSettingsChange({ ...settings, scanSpeedMs: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 3. Dwell Clicking (Eye-Tracking & Head-Mouse) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Dwell Clicking (Eye-Tracking Ready)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Hovering over a tile for a set time triggers speech.
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={settings.dwellClickEnabled}
                onChange={(e) => onSettingsChange({ ...settings, dwellClickEnabled: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {settings.dwellClickEnabled && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Dwell Hover Duration:</span>
                  <span className="text-emerald-600 font-bold">{(settings.dwellTimeMs / 1000).toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2500"
                  step="100"
                  value={settings.dwellTimeMs}
                  onChange={(e) => onSettingsChange({ ...settings, dwellTimeMs: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 4. Haptic Feedback */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Haptic Feedback
                </div>
                <div className="text-[11px] text-slate-500">
                  Vibrates on card tap for tactile confirmation
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.hapticFeedback}
              onChange={(e) => onSettingsChange({ ...settings, hapticFeedback: e.target.checked })}
              className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
