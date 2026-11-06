import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  Volume2, 
  Send, 
  MessageSquare, 
  UserCheck, 
  HeartHandshake,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { GhanaianLanguage, TTSConfig, DialogueMessage } from '../types';
import { speechRepairASR } from '../services/speechRepairASR';
import { audioEngine } from '../services/audioEngine';

interface TwoWayBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: GhanaianLanguage;
  ttsConfig: TTSConfig;
}

export const TwoWayBridgeModal: React.FC<TwoWayBridgeModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  ttsConfig
}) => {
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: '1',
      sender: 'partner',
      senderName: 'Caregiver / Doctor (Akosua)',
      textGhanaian: 'Wo ho te sɛn nne? Wopɛ aduane anaa nsuo?',
      textEnglish: 'How are you feeling today? Do you want food or water?',
      language: 'twi-asante',
      timestamp: 'Just now'
    },
    {
      id: '2',
      sender: 'impaired-user',
      senderName: 'You (Assistive Voice)',
      textGhanaian: 'Me ti pae me kakra, mepɛ nsuo nwunu',
      textEnglish: 'I have a slight headache, I need cold water',
      language: 'twi-asante',
      timestamp: 'Just now',
      audioGenerated: true
    }
  ]);

  const [partnerInput, setPartnerInput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isPartnerListening, setIsPartnerListening] = useState(false);

  // Quick replies for user
  const quickUserReplies = [
    { text: 'Aane, medase', eng: 'Yes, thank you' },
    { text: 'Dabi, menpɛ saa', eng: 'No, not that' },
    { text: 'Me ho yɛ pa ara', eng: 'I am doing well' },
    { text: 'Ɛyɛ me ya wɔ ha', eng: 'It hurts right here' },
    { text: 'Mepaakyɛw boa me', eng: 'Please assist me' },
    { text: 'Mepɛ sɛ me kɔda', eng: 'I want to sleep' }
  ];

  // Send message from Impaired User
  const handleSendUserMessage = (text: string, english = '') => {
    if (!text.trim()) return;

    const newMsg: DialogueMessage = {
      id: `${Date.now()}`,
      sender: 'impaired-user',
      senderName: 'You (Assistive Voice)',
      textGhanaian: text,
      textEnglish: english || text,
      language: currentLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      audioGenerated: true
    };

    setMessages(prev => [...prev, newMsg]);
    setUserInput('');

    // Speak aloud in Ghanaian language!
    audioEngine.speak(text, currentLanguage, ttsConfig);
  };

  // Send message from Conversation Partner
  const handleSendPartnerMessage = (text: string) => {
    if (!text.trim()) return;

    const newMsg: DialogueMessage = {
      id: `${Date.now()}`,
      sender: 'partner',
      senderName: 'Partner / Caregiver',
      textGhanaian: text,
      textEnglish: text,
      language: currentLanguage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setPartnerInput('');
  };

  // Listen to Partner via microphone ASR
  const handleTogglePartnerListen = () => {
    if (isPartnerListening) {
      setIsPartnerListening(false);
      return;
    }

    setIsPartnerListening(true);
    speechRepairASR.listenPartnerSpeech(
      (transcript) => {
        handleSendPartnerMessage(transcript);
        setIsPartnerListening(false);
      },
      (err) => {
        console.warn('Partner speech error:', err);
        setIsPartnerListening(false);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Two-Way Ghanaian Dialogue Bridge</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Real-time
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connects speech-impaired individuals with nurses, family, market sellers, and doctors
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

        {/* Dialogue Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((msg) => {
            const isUser = msg.sender === 'impaired-user';

            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[11px] font-bold text-slate-400 mb-1 px-1 flex items-center gap-1.5">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm ${
                  isUser 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                }`}>
                  <div className="text-base sm:text-lg font-black leading-snug">
                    {msg.textGhanaian}
                  </div>
                  {msg.textEnglish && msg.textEnglish !== msg.textGhanaian && (
                    <div className={`text-xs mt-1 font-medium ${isUser ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {msg.textEnglish}
                    </div>
                  )}

                  {/* Audio Replay Button */}
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      onClick={() => audioEngine.speak(msg.textGhanaian, currentLanguage, ttsConfig)}
                      className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition ${
                        isUser 
                          ? 'bg-emerald-700/60 hover:bg-emerald-700 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                      }`}
                      title="Speak phrase aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Quick Tap Response Section */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Quick User Responses (Tap to Speak):
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickUserReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendUserMessage(reply.text, reply.eng)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold whitespace-nowrap shadow-sm transition active:scale-95"
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Input Panels: User Typing vs Partner Mic */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Left: Speech Impaired User Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Your Message (Speaks Aloud):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendUserMessage(userInput)}
                placeholder="Type response in Ghanaian language..."
                className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendUserMessage(userInput)}
                disabled={!userInput.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Caregiver / Partner Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Partner / Caregiver Speech (ASR):
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePartnerListen}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow transition active:scale-95 ${
                  isPartnerListening 
                    ? 'bg-rose-600 animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isPartnerListening ? 'Listening to Partner...' : 'Tap for Partner to Speak'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
