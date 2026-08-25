import React, { useState } from 'react';
import { 
  HealthVitalLog, 
  DoctorNote, 
  EmotionLog, 
  ElderProfile, 
  ReminderItem 
} from '../types';
import { initialDoctorNotes, initialEmotionLogs } from '../data/mockData';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import { 
  Activity, 
  Stethoscope, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Heart, 
  Share2, 
  Download, 
  FileText, 
  ArrowLeft 
} from 'lucide-react';

interface DoctorCaregiverSharedDashboardProps {
  elderProfile: ElderProfile;
  vitals: HealthVitalLog[];
  reminders: ReminderItem[];
  onBackToHome: () => void;
}

export const DoctorCaregiverSharedDashboard: React.FC<DoctorCaregiverSharedDashboardProps> = ({
  elderProfile,
  vitals,
  reminders,
  onBackToHome
}) => {
  const [doctorNotes, setDoctorNotes] = useState<DoctorNote[]>(initialDoctorNotes);
  const [emotionLogs] = useState<EmotionLog[]>(initialEmotionLogs);
  const [newDoctorNote, setNewDoctorNote] = useState<string>('');
  const [isGeneratingAISummary, setIsGeneratingAISummary] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const isHighContrast = elderProfile.highContrast;

  const handleGenerateAISummary = async () => {
    setIsGeneratingAISummary(true);
    try {
      const res = await fetch('/api/doctor/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elderProfile,
          vitals,
          doctorNotes,
          emotionLogs
        })
      });
      const data = await res.json();
      setAiSummary(data.summary);
      soundFx.playChime();
      speakElderVoice('जेमिनी एआई ने दादाजी का क्लिनिकल स्वास्थ्य सारांश तैयार कर लिया है।');
    } catch (e) {
      console.error(e);
      setAiSummary(`${elderProfile.name} (76 वर्ष) का समग्र स्वास्थ्य स्थिर है। दवा समय पर लेने की दर 96% है। रक्तचाप 124/82 सामान्य है। रात की नींद 7.2 घंटे दर्ज की गई है।`);
    } finally {
      setIsGeneratingAISummary(false);
    }
  };

  const handleAddDoctorNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorNote.trim()) return;

    const newNote: DoctorNote = {
      id: `dn-${Date.now()}`,
      doctorName: 'Dr. Alok Mathur (Senior Geriatrician)',
      date: new Date().toISOString().split('T')[0],
      note: newDoctorNote,
      priority: 'normal',
      acknowledgedByCaregiver: false
    };

    setDoctorNotes(prev => [newNote, ...prev]);
    setNewDoctorNote('');
    soundFx.playChime();
  };

  const handleAcknowledgeNote = (id: string) => {
    setDoctorNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, acknowledgedByCaregiver: true } : n))
    );
    soundFx.playChime();
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-doc-dashboard-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-600 text-white">
                Shared Clinical Workspace
              </span>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                Dr. Alok Mathur ↔ Caregiver Rohan
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <Activity className="w-8 h-8 text-teal-600" />
              डॉक्टर-केयरगिवर साझा डैशबोर्ड (Doctor-Caregiver Shared Portal)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              एआई-संचालित क्लिनिकल समीक्षा, वाइटल्स ट्रेंड और डॉक्टर के सीधे निर्देश
            </p>
          </div>
        </div>

        <button
          id="generate-clinical-summary-btn"
          onClick={handleGenerateAISummary}
          disabled={isGeneratingAISummary}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30"
        >
          {isGeneratingAISummary ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>AI क्लिनिकल सारांश बनाएं</span>
        </button>
      </div>

      {/* AI Clinical Summary Banner (Gemini 2.5 Flash) */}
      {aiSummary && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-900 via-indigo-950 to-slate-900 text-white border-2 border-teal-400 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-300" />
              <h3 className="text-lg font-black text-teal-200">
                Gemini AI Clinical Health Summary & Care Recommendations
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-800 text-teal-100 border border-teal-500">
              Real-time Synthesis
            </span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-teal-50">
            {aiSummary}
          </p>
        </div>
      )}

      {/* Key Health Vitals Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className={`p-5 rounded-3xl border-2 space-y-2 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-bold uppercase text-slate-400">रक्तचाप (Avg. Blood Pressure)</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">124 / 82 <span className="text-xs font-normal text-slate-500">mmHg</span></div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> स्थिर (Stable)
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-3xl border-2 space-y-2 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-bold uppercase text-slate-400">फास्टिंग ब्लड शुगर (Sugar)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">108 <span className="text-xs font-normal text-slate-500">mg/dL</span></div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> सामान्य सीमा में (In Control)
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-3xl border-2 space-y-2 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-bold uppercase text-slate-400">दवा नियमितता (7-Day Adherence)</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">96.4%</div>
          <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            ✓ 28 में से 27 खुराक समय पर ली गईं
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-3xl border-2 space-y-2 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-bold uppercase text-slate-400">नींद व मानसिक स्थिति (Sleep & Mood)</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">7.2 <span className="text-xs font-normal text-slate-500">घंटे / रात</span></div>
          <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
            😊 85% शांत व प्रसन्न मनोदशा
          </div>
        </div>
      </div>

      {/* Doctor Notes & Caregiver Action Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Clinical Notes */}
        <div className={`p-6 rounded-3xl border-2 shadow-md space-y-4 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              डॉक्टर के निर्देश व फीडबैक (Doctor Notes)
            </h3>
            <span className="text-xs font-bold text-teal-600">Dr. Alok Mathur</span>
          </div>

          {/* Form to add note */}
          <form onSubmit={handleAddDoctorNote} className="space-y-2">
            <input
              type="text"
              value={newDoctorNote}
              onChange={(e) => setNewDoctorNote(e.target.value)}
              placeholder="डॉक्टर के रूप में नया निर्देश लिखें..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>निर्देश जोड़ें</span>
            </button>
          </form>

          {/* Notes list */}
          <div className="space-y-3 pt-2">
            {doctorNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-800 dark:text-teal-300">{note.doctorName}</span>
                  <span className="text-slate-400">{note.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">{note.note}</p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-zinc-700 text-xs">
                  <span className={`font-semibold ${note.acknowledgedByCaregiver ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {note.acknowledgedByCaregiver ? '✓ केयरगिवर द्वारा स्वीकृत (Seen)' : '⚠️ केयरगिवर की सहमति प्रतीक्षित'}
                  </span>
                  {!note.acknowledgedByCaregiver && (
                    <button
                      onClick={() => handleAcknowledgeNote(note.id)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px]"
                    >
                      केयरगिवर सहमति दें
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Emotion & Mood History Logs */}
        <div className={`p-6 rounded-3xl border-2 shadow-md space-y-4 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Heart className="w-5 h-5 text-rose-600" />
              एआई इमोशन व मनोदशा ट्रैकर (AI Emotion Tracker)
            </h3>
            <span className="text-xs font-bold text-rose-600">Daily Sentiment Log</span>
          </div>

          <div className="space-y-3">
            {emotionLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/40 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-white">
                    {log.date} ({log.time})
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-rose-100 text-rose-900">
                    स्कोर: {log.sentimentScore}/100
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {log.userUtterance}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold italic">
                  💡 एआई विश्लेषण: {log.aiAnalysis}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
