import React, { useState, useRef } from 'react';
import { AudioDiaryEntry, ElderProfile } from '../types';
import { initialAudioDiaries } from '../data/mockData';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Mic, 
  Square, 
  Play, 
  Sparkles, 
  Smile, 
  ArrowLeft, 
  Calendar, 
  Volume2, 
  Clock, 
  Heart 
} from 'lucide-react';

interface AudioDiaryProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

export const AudioDiary: React.FC<AudioDiaryProps> = ({
  elderProfile,
  onBackToHome
}) => {
  const [diaries, setDiaries] = useState<AudioDiaryEntry[]>(initialAudioDiaries);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const isHighContrast = elderProfile.highContrast;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    soundFx.playChime();

    // Start recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = 'hi-IN';
          rec.continuous = true;
          rec.onresult = (e: any) => {
            const transcript = Array.from(e.results)
              .map((r: any) => r[0].transcript)
              .join(' ');
            setActiveSpeechText(transcript);
          };
          rec.start();
          (window as any)._currentRec = rec;
        } catch (err) {
          console.error(err);
        }
      }
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    soundFx.playChime();

    if ((window as any)._currentRec) {
      try {
        (window as any)._currentRec.stop();
      } catch (err) {
        console.error(err);
      }
    }

    setIsProcessingAI(true);
    setTimeout(() => {
      setIsProcessingAI(false);
      const text = activeSpeechText || 'आज शाम को मंदिर गया था, पुराने दोस्तों से मिलकर बहुत अच्छा लगा और चाय पी।';
      const newEntry: AudioDiaryEntry = {
        id: `d-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        durationSeconds: recordingSeconds || 24,
        transcriptHindi: text,
        moodSummary: 'आनंद व संतोष (Contentment & Peace)',
        sentiment: 'Happy',
        sentimentScore: 90
      };

      setDiaries(prev => [newEntry, ...prev]);
      setActiveSpeechText('');
      confetti({ particleCount: 50, spread: 60 });
      speakElderVoice('आपकी आज की डायरी सुरक्षित हो गई है। आपके विचार बहुत सुंदर हैं!');
    }, 1200);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-diary-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white">
                Daily Voice Memoir
              </span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                बोलकर अपनी यादें और दिनभर की बातें रिकॉर्ड करें
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
              दैनिक ऑडियो डायरी (Daily Audio Diary)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              बिना टाइप किए बोलें — AI अपने आप आपकी बातों को सहेजकर मूड विश्लेषण करता है
            </p>
          </div>
        </div>
      </div>

      {/* Recording Studio Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl text-center space-y-6 max-w-3xl mx-auto ${
        isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-300'
      }`}>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRecording ? 'आपकी बात रिकॉर्ड हो रही है... बोलिए' : 'आज आपका दिन कैसा बीता? माइक दबाकर बोलें'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            अपने बचपन के किस्से, आज की खुशी या जो भी मन में आए, दिल खोलकर साझा करें
          </p>
        </div>

        {/* Live Mic Action Button */}
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {!isRecording ? (
            <button
              id="start-audio-diary-btn"
              onClick={handleStartRecording}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 hover:scale-105 transition-all"
            >
              <Mic className="w-12 h-12" />
            </button>
          ) : (
            <button
              id="stop-audio-diary-btn"
              onClick={handleStopRecording}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/40 animate-pulse transition-all border-4 border-white"
            >
              <Square className="w-8 h-8 fill-current" />
              <span className="text-xs font-mono font-bold mt-1">{recordingSeconds}s</span>
            </button>
          )}

          <span className="text-xs font-bold text-slate-500">
            {isRecording ? 'रिकॉर्डिंग रोकने के लिए लाल बटन दबाएं' : 'रिकॉर्ड करने के लिए बैंगनी बटन दबाएं'}
          </span>
        </div>

        {/* Live transcript preview */}
        {activeSpeechText && (
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-purple-200 text-sm font-medium text-purple-950 dark:text-purple-200 italic">
            "{activeSpeechText}"
          </div>
        )}

        {isProcessingAI && (
          <div className="flex items-center justify-center gap-2 text-purple-600 font-bold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>एआई यादों को संजो रहा है और सारांश बना रहा है...</span>
          </div>
        )}
      </div>

      {/* Saved Audio Diaries Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          सहेजी गई डायरी प्रविष्टियां (Saved Voice Diaries)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diaries.map((entry) => (
            <div
              key={entry.id}
              className={`p-6 rounded-3xl border-2 transition-all space-y-3 ${
                isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900">
                    {entry.date} ({entry.time})
                  </span>
                  <span className="text-xs text-slate-400">⏱ {entry.durationSeconds} सेकंड</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-800 flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" /> {entry.sentiment}
                </span>
              </div>

              <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                "{entry.transcriptHindi}"
              </p>

              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-zinc-800 text-xs font-semibold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                <span>💡 एआई मूड: {entry.moodSummary}</span>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    speakElderVoice(entry.transcriptHindi);
                  }}
                  className="p-1.5 rounded-lg bg-purple-600 text-white font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>सुनें</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
