import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Volume2, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { GhanaianLanguage, TTSConfig } from '../types';
import { speechRepairASR, RepairResult } from '../services/speechRepairASR';
import { audioEngine } from '../services/audioEngine';

interface SpeechClarifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: GhanaianLanguage;
  ttsConfig: TTSConfig;
}

export const SpeechClarifierModal: React.FC<SpeechClarifierModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  ttsConfig
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [calibrationStep, setCalibrationStep] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [liveAcoustics, setLiveAcoustics] = useState({
    energy: 0,
    spectralCentroid: 0,
    zeroCrossingRate: 0
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Calibration target phrases
  const calibrationTargets = [
    { id: 'greet-yes', label: 'Aane (Yes)' },
    { id: 'greet-no', label: 'Dabi (No)' },
    { id: 'greet-thank-you', label: 'Medase (Thank you)' },
    { id: 'food-water', label: 'Nsuo (Water)' }
  ];

  // Visualizer loop
  const updateVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeArray = new Float32Array(bufferLength);

    analyserRef.current.getByteFrequencyData(dataArray);
    analyserRef.current.getFloatTimeDomainData(timeArray);

    // Calculate real-time acoustics
    const features = speechRepairASR.extractAcousticFeatures(timeArray, dataArray, 50);
    setLiveAcoustics({
      energy: features.energy,
      spectralCentroid: features.spectralCentroid,
      zeroCrossingRate: features.zeroCrossingRate
    });

    // Draw canvas spectrum
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 3.5;
    let barHeight: number;
    let x = 0;

    for (let i = 0; i < bufferLength; i += 2) {
      barHeight = (dataArray[i] / 255) * canvas.height;

      // Gradient color based on frequency
      const hue = (i / bufferLength) * 120 + 340; // Ghana rose to amber
      ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
      if (x > canvas.width) break;
    }

    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  const handleStartCapture = async () => {
    try {
      const analyser = await speechRepairASR.startListening();
      analyserRef.current = analyser;
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setRepairResult(null);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Please allow microphone permissions to test Speech Repair.');
    }
  };

  const handleStopCapture = () => {
    if (!isRecording) return;
    const durationMs = Date.now() - recordingStartTimeRef.current;

    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeArray = new Float32Array(bufferLength);

      analyserRef.current.getByteFrequencyData(dataArray);
      analyserRef.current.getFloatTimeDomainData(timeArray);

      const features = speechRepairASR.extractAcousticFeatures(timeArray, dataArray, durationMs);

      if (isCalibrating) {
        // Save to calibration profile
        const currentTarget = calibrationTargets[calibrationStep];
        speechRepairASR.addCalibrationSample(currentTarget.id, currentTarget.label, features);

        if (calibrationStep < calibrationTargets.length - 1) {
          setCalibrationStep(prev => prev + 1);
        } else {
          setIsCalibrating(false);
          setCalibrationStep(0);
          alert('Dysarthria Calibration Complete! Your voice profile has been saved.');
        }
      } else {
        // Run speech repair algorithm
        const result = speechRepairASR.repairSpeech(features, currentLanguage);
        setRepairResult(result);

        // Automatically synthesize the repaired clean Ghanaian speech!
        audioEngine.speak(result.matchedText, currentLanguage, ttsConfig);
      }
    }

    speechRepairASR.stopListening();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      speechRepairASR.stopListening();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentProfile = speechRepairASR.getProfile();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Kasa-Clarifier (Speech Repair ASR)</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  Assistive AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transforms slurred or dysarthric vocalizations into clear, fluent Ghanaian speech
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

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Audio Visualizer Canvas */}
          <div className="relative w-full h-32 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={128} 
              className="w-full h-full object-cover"
            />
            {!isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 text-slate-400 text-xs gap-1.5 pointer-events-none">
                <Activity className="w-6 h-6 text-amber-500 animate-pulse" />
                <span>Microphone inactive. Press &ldquo;Hold to Speak&rdquo; below.</span>
              </div>
            )}
          </div>

          {/* Real-time Acoustic Feature Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RMS Energy</span>
              <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                {(liveAcoustics.energy * 100).toFixed(0)}%
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spectral Centroid</span>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {liveAcoustics.spectralCentroid} Hz
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Zero Crossing</span>
              <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {liveAcoustics.zeroCrossingRate}
              </div>
            </div>
          </div>

          {/* Primary Action Button (Hold or Tap to Speak) */}
          <div className="flex flex-col items-center gap-2">
            {!isRecording ? (
              <button
                onClick={handleStartCapture}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 hover:from-rose-700 hover:to-emerald-700 text-white font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition active:scale-98"
              >
                <Mic className="w-6 h-6 animate-bounce" />
                <span>{isCalibrating ? `Record Sample: ${calibrationTargets[calibrationStep].label}` : 'Start Dysarthric Speech Capture'}</span>
              </button>
            ) : (
              <button
                onClick={handleStopCapture}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition active:scale-98 animate-pulse"
              >
                <Square className="w-6 h-6 fill-white" />
                <span>Stop & Run Speech Repair</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Speak or make your vocal attempt. The algorithm matches your phonetic formants.
            </span>
          </div>

          {/* Speech Repair Result Box */}
          {repairResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-600 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Repaired Speech Match Found
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                  {(repairResult.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {repairResult.matchedText}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Meaning: {repairResult.english}
                  </div>
                </div>

                <button
                  onClick={() => audioEngine.speak(repairResult.matchedText, currentLanguage, ttsConfig)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </div>
            </div>
          )}

          {/* Calibration Profile Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Personal Dysarthria Calibration
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentProfile.calibratedSamples.length} of 4 target sound samples saved
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCalibrating(!isCalibrating);
                  setCalibrationStep(0);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition"
              >
                {isCalibrating ? 'Cancel Calibration' : 'Recalibrate Profile'}
              </button>
            </div>

            {isCalibrating && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-700 text-xs space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-200">
                  Step {calibrationStep + 1} of 4:
                </span>
                <p className="text-amber-700 dark:text-amber-300">
                  Click the big button above and speak your best vocal approximation for:{' '}
                  <strong>{calibrationTargets[calibrationStep].label}</strong>
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
