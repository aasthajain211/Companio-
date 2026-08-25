import React, { useState, useRef } from 'react';
import { ReminderItem } from '../types';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import { 
  Mic, 
  Square, 
  Play, 
  Check, 
  Volume2, 
  Sparkles, 
  X,
  UserCheck 
} from 'lucide-react';

interface FamilyVoiceRecorderProps {
  reminders: ReminderItem[];
  setReminders: React.Dispatch<React.SetStateAction<ReminderItem[]>>;
  onClose: () => void;
}

export const FamilyVoiceRecorder: React.FC<FamilyVoiceRecorderProps> = ({
  reminders,
  setReminders,
  onClose
}) => {
  const [selectedReminderId, setSelectedReminderId] = useState<string>(reminders[0]?.id || '');
  const [recorderName, setRecorderName] = useState<string>('रोहन (बेटा)');
  const [voiceText, setVoiceText] = useState<string>('दादाजी, अपनी सुबह की शुगर और बीपी की दवा पानी के साथ ले लीजिए।');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasRecordedAudio, setHasRecordedAudio] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [previewPlaying, setPreviewPlaying] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const sampleSuggestions = [
    'दादाजी, नाश्ते का समय हो गया है, गरम दलिया खा लीजिए।',
    'पापाजी, दोपहर की कैल्शियम और दिल की गोली ले लीजिए।',
    'दादू, पानी का गिलास आपके पास रखा है, पूरा पी लीजिए!',
    'दादाजी, शाम हो गई है, चलिए बालकनी में थोड़ा टहल आते हैं।',
    'सोने का समय हो गया, रात की गोली खा लीजिए और शुभ रात्रि!'
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    soundFx.playChime();

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setHasRecordedAudio(true);
    soundFx.playChime();
  };

  const handleTestPreview = async () => {
    setPreviewPlaying(true);
    soundFx.playChime();
    await speakElderVoice(voiceText);
    setPreviewPlaying(false);
  };

  const handleSaveToReminder = () => {
    if (!selectedReminderId) return;

    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === selectedReminderId) {
          return {
            ...r,
            recordedBy: recorderName,
            audioPromptText: voiceText,
          };
        }
        return r;
      })
    );

    soundFx.playChime();
    speakElderVoice(`आवाज को सफलतापूर्वक ${reminders.find(r => r.id === selectedReminderId)?.titleHindi || "रिमाइंडर"} के साथ जोड़ दिया गया है।`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-3xl max-w-xl w-full p-6 space-y-5 border-2 border-indigo-500 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">
                परिवार की अपनी आवाज में रिमाइंडर (Family Voice Note)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                मशीनी बीप के बजाय बेटे, बेटी या पोते की अपनी आवाज सुनाएं
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* Choose Reminder */}
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
              किस रिमाइंडर के लिए रिकॉर्ड करना है? (Select Reminder)
            </label>
            <select
              value={selectedReminderId}
              onChange={(e) => setSelectedReminderId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm font-semibold"
            >
              {reminders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.time} - {r.titleHindi} ({r.period})
                </option>
              ))}
            </select>
          </div>

          {/* Recorder Name */}
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
              आवाज किसकी है? (Recorded by)
            </label>
            <input
              type="text"
              value={recorderName}
              onChange={(e) => setRecorderName(e.target.value)}
              placeholder="उदा. रोहन (बेटा) या अनन्या (पोती)"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
            />
          </div>

          {/* Voice Prompt Text */}
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>बोले जाने वाले शब्द (Voice Note Message):</span>
              <span className="text-[11px] text-indigo-600 font-normal">सुझाव नीचे से चुनें</span>
            </label>
            <textarea
              rows={2}
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
            />
            
            {/* Quick Suggestions Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sampleSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVoiceText(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-indigo-50 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 truncate max-w-full"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          {/* Live Mic Recorder Simulation */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-zinc-800/80 border border-indigo-200 dark:border-zinc-700 text-center space-y-3">
            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <button
                  id="start-mic-record-btn"
                  type="button"
                  onClick={handleStartRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-600/30"
                >
                  <Mic className="w-5 h-5" />
                  <span>माइक से रिकॉर्ड करें (Record)</span>
                </button>
              ) : (
                <button
                  id="stop-mic-record-btn"
                  type="button"
                  onClick={handleStopRecording}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm flex items-center gap-2 animate-pulse border-2 border-rose-500"
                >
                  <Square className="w-5 h-5 text-rose-500 fill-current" />
                  <span>रिकॉर्डिंग रोकें ({recordingSeconds}s)</span>
                </button>
              )}

              <button
                id="preview-voice-btn"
                type="button"
                onClick={handleTestPreview}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
              >
                <Volume2 className="w-5 h-5" />
                <span>आवाज टेस्ट करें</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hasRecordedAudio 
                ? '✓ आपकी आवाज सफलतापूर्वक रिकॉर्ड हो चुकी है!' 
                : 'परिवार का कोई भी सदस्य अपने फोन से दूर बैठे भी यह आवाज सेट कर सकता है।'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 text-sm font-bold"
          >
            रद्द करें
          </button>
          <button
            id="save-voice-reminder-btn"
            type="button"
            onClick={handleSaveToReminder}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>रिमाइंडर में सेव करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
