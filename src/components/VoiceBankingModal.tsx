import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Plus, 
  Trash2, 
  BookmarkCheck, 
  Download, 
  Upload, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { GhanaianLanguage, CustomVoiceBankCard } from '../types';
import { voiceBankingService } from '../services/voiceBanking';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface VoiceBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: GhanaianLanguage;
  onCardAdded: () => void;
}

export const VoiceBankingModal: React.FC<VoiceBankingModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onCardAdded
}) => {
  const [cards, setCards] = useState<CustomVoiceBankCard[]>(voiceBankingService.getCards());
  const [englishText, setEnglishText] = useState('');
  const [ghanaianText, setGhanaianText] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const iconOptions = ['⭐', '🏠', '❤️', '📍', '💳', '🍲', '🩺', '👨‍👩‍👧', '🚌', '📞', '🙏'];

  // Start voice banking recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Could not access microphone for voice banking.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleAddCard = () => {
    if (!ghanaianText.trim() || !englishText.trim()) {
      alert('Please enter both Ghanaian phrase and English meaning.');
      return;
    }

    const translations: Record<GhanaianLanguage, string> = {
      'twi-asante': ghanaianText,
      'twi-akuapem': ghanaianText,
      'fante': ghanaianText,
      'ga': ghanaianText,
      'ewe': ghanaianText,
      'dagbani': ghanaianText
    };

    voiceBankingService.addCard(englishText, translations, selectedIcon, recordedAudioUrl || undefined);
    setCards(voiceBankingService.getCards());
    setEnglishText('');
    setGhanaianText('');
    setRecordedAudioUrl(null);
    onCardAdded();
  };

  const handleDeleteCard = (id: string) => {
    voiceBankingService.deleteCard(id);
    setCards(voiceBankingService.getCards());
    onCardAdded();
  };

  const handleExportBackup = () => {
    const dataStr = voiceBankingService.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yenkasa-voicebank-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Ghanaian Voice Banking & Custom AAC</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  Preservation
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bank personal phrases or family voices before speech deterioration (ALS, stroke, tracheostomy)
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
          
          {/* Add New Phrase Form */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Record & Add Custom Ghanaian AAC Phrase</span>
            </h3>

            {/* Icon Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Card Icon:</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition ${
                      selectedIcon === icon 
                        ? 'border-purple-600 bg-white dark:bg-slate-800 scale-110 shadow-sm' 
                        : 'border-transparent hover:bg-purple-100 dark:hover:bg-purple-900/40'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  Ghanaian Phrase (e.g. Twi/Ga/Ewe):
                </label>
                <input
                  type="text"
                  value={ghanaianText}
                  onChange={(e) => setGhanaianText(e.target.value)}
                  placeholder="e.g. Me din de Kwame"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  English Meaning / Translation:
                </label>
                <input
                  type="text"
                  value={englishText}
                  onChange={(e) => setEnglishText(e.target.value)}
                  placeholder="e.g. My name is Kwame"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Optional Voice Banking Audio Recording */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Record Authentic Voice Clip</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold animate-pulse shadow-sm transition"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordedAudioUrl && (
                  <audio src={recordedAudioUrl} controls className="h-8 w-44" />
                )}
              </div>

              <button
                onClick={handleAddCard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Board</span>
              </button>
            </div>
          </div>

          {/* List of Custom Voice Bank Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Saved Custom Cards ({cards.length}):
              </span>
              <button
                onClick={handleExportBackup}
                className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (JSON)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {c.translations[currentLanguage] || c.translations['twi-asante']}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {c.english}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {c.recordedAudioDataUrl && (
                      <button
                        onClick={() => {
                          const snd = new Audio(c.recordedAudioDataUrl);
                          snd.play();
                        }}
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition"
                        title="Play recorded clip"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(c.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
