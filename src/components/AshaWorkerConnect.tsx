import React, { useState } from 'react';
import { AshaWorker, HealthVitalLog, ElderProfile } from '../types';
import { initialAshaWorker, initialHealthVitals } from '../data/mockData';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  PhoneCall, 
  Calendar, 
  Activity, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Droplet, 
  Sparkles,
  Award
} from 'lucide-react';

interface AshaWorkerConnectProps {
  elderProfile: ElderProfile;
  vitals: HealthVitalLog[];
  setVitals: React.Dispatch<React.SetStateAction<HealthVitalLog[]>>;
  onBackToHome: () => void;
}

export const AshaWorkerConnect: React.FC<AshaWorkerConnectProps> = ({
  elderProfile,
  vitals,
  setVitals,
  onBackToHome
}) => {
  const [asha] = useState<AshaWorker>(initialAshaWorker);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Form State for new checkup entry
  const [newBpSys, setNewBpSys] = useState<number>(126);
  const [newBpDia, setNewBpDia] = useState<number>(82);
  const [newSugar, setNewSugar] = useState<number>(110);
  const [newPulse, setNewPulse] = useState<number>(75);
  const [newNotes, setNewNotes] = useState<string>('नियमित मासिक स्वास्थ्य जांच सामान्य पाई गई।');

  const isHighContrast = elderProfile.highContrast;

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: HealthVitalLog = {
      id: `v-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      bpSystolic: Number(newBpSys),
      bpDiastolic: Number(newBpDia),
      bloodSugarFasting: Number(newSugar),
      pulseRate: Number(newPulse),
      sleepHours: 7.2,
      moodRating: 5,
      adherencePercentage: 100,
      loggedBy: 'ASHA Worker',
      notes: newNotes
    };

    setVitals(prev => [newLog, ...prev]);
    setIsLogModalOpen(false);
    soundFx.playChime();
    confetti({ particleCount: 50, spread: 60 });
    speakElderVoice(`आशा कार्यकर्ता द्वारा स्वास्थ्य जांच सफलतापूर्वक दर्ज कर ली गई है। बीपी ${newBpSys} बटा ${newBpDia} और शुगर ${newSugar} सामान्य स्तर पर है।`);
  };

  const handleCallAsha = () => {
    soundFx.playChime();
    speakElderVoice(`आशा कार्यकर्ता ${asha.name} को कॉल लगाया जा रहा है।`);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-asha-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-pink-600 text-white">
                National Health Mission (NHM)
              </span>
              <span className="text-xs font-bold text-pink-700 dark:text-pink-300">
                ग्रामीण व अर्ध-शहरी स्वास्थ्य नेटवर्क
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <Heart className="w-8 h-8 text-pink-600" />
              आशा वर्कर कनेक्ट (ASHA Worker Connect)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              स्थानीय आशा संगिनी से सीधा संपर्क, मासिक बीपी/शुगर रूटीन जांच व सहायता
            </p>
          </div>
        </div>

        <button
          id="open-asha-checkup-modal-btn"
          onClick={() => setIsLogModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>नई स्वास्थ्य जांच दर्ज करें (Log Vitals)</span>
        </button>
      </div>

      {/* ASHA Profile Card & Emergency Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ASHA Worker Main Card */}
        <div className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border-3 shadow-xl flex flex-col justify-between space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-br from-pink-50 via-white to-rose-50 border-pink-300'
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={asha.photoUrl}
                alt={asha.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-pink-400 shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-pink-600 text-white shadow">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-300">
                अधिकृत आशा संगिनी (Verified ASHA)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-200">
                {asha.name}
              </h2>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {asha.villageWard}
              </p>
              <p className="text-xs text-slate-500">
                केंद्र: {asha.subCenter}
              </p>

              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-700 mt-2 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="flex items-center gap-1.5 text-pink-800 dark:text-pink-300">
                  <Calendar className="w-4 h-4" />
                  <strong>अगली रूटीन विजिट:</strong> {asha.nextScheduledVisit}
                </span>
                <span className="text-emerald-600 font-bold">✓ शेड्यूल तय है</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-pink-200 dark:border-zinc-800">
            <a
              id="call-asha-direct-btn"
              href={`tel:${asha.phone}`}
              onClick={handleCallAsha}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <PhoneCall className="w-5 h-5" />
              <span>सीधा आशा दीदी को कॉल करें ({asha.phone})</span>
            </a>

            <button
              onClick={() => {
                soundFx.playChime();
                speakElderVoice(`रेखा दीदी आपके प्राथमिक स्वास्थ्य केंद्र की आशा कार्यकर्ता हैं। वे हर महीने दादाजी का बीपी और शुगर जांचने घर आती हैं।`);
              }}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-sm"
            >
              जानकारी सुनें
            </button>
          </div>
        </div>

        {/* Govt Emergency Helplines */}
        <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-md ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-pink-600" />
            सरकारी स्वास्थ्य हेल्पलाइन (Helplines)
          </h3>

          <div className="space-y-2.5">
            <a
              href="tel:104"
              className="p-3.5 rounded-2xl bg-pink-50 dark:bg-zinc-800 border border-pink-200 hover:border-pink-400 flex items-center justify-between transition-colors block"
            >
              <div>
                <h4 className="font-bold text-sm text-pink-950 dark:text-pink-200">104 - राष्ट्रीय स्वास्थ्य सलाह</h4>
                <p className="text-xs text-slate-500">24x7 डॉक्टर व आशा मेडिकल सपोर्ट</p>
              </div>
              <PhoneCall className="w-5 h-5 text-pink-600" />
            </a>

            <a
              href="tel:108"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-zinc-800 border border-rose-200 hover:border-rose-400 flex items-center justify-between transition-colors block"
            >
              <div>
                <h4 className="font-bold text-sm text-rose-950 dark:text-rose-200">108 - सरकारी एम्बुलेंस</h4>
                <p className="text-xs text-slate-500">आपातकालीन मुफ्त एम्बुलेंस सेवा</p>
              </div>
              <PhoneCall className="w-5 h-5 text-rose-600" />
            </a>

            <a
              href="tel:112"
              className="p-3.5 rounded-2xl bg-blue-50 dark:bg-zinc-800 border border-blue-200 hover:border-blue-400 flex items-center justify-between transition-colors block"
            >
              <div>
                <h4 className="font-bold text-sm text-blue-950 dark:text-blue-200">112 - राष्ट्रीय इमरजेंसी</h4>
                <p className="text-xs text-slate-500">पुलिस, फायर व संकट सहायता</p>
              </div>
              <PhoneCall className="w-5 h-5 text-blue-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Routine Checkup Logs Table */}
      <div className={`p-6 rounded-3xl border-2 shadow-md space-y-4 ${
        isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-pink-600" />
              मासिक स्वास्थ्य जांच रिकॉर्ड (Monthly Routine Vitals History)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              रक्तचाप (BP), शुगर और नब्ज (Pulse) का नियमित इतिहास
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            ✓ सभी मानक सामान्य सीमा में हैं
          </span>
        </div>

        <div className="space-y-3">
          {vitals.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900">
                    {v.date} ({v.time})
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    दर्जकर्ता: <strong>{v.loggedBy}</strong>
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {v.notes}
                </p>
              </div>

              {/* Vitals Badges */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 font-bold block">ब्लड प्रेशर</span>
                  <span className="text-base font-black text-indigo-600 font-mono">
                    {v.bpSystolic}/{v.bpDiastolic}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 font-bold block">शुगर (Fasting)</span>
                  <span className="text-base font-black text-emerald-600 font-mono">
                    {v.bloodSugarFasting} mg/dL
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 text-center min-w-[80px]">
                  <span className="text-[10px] text-slate-400 font-bold block">पल्स (Pulse)</span>
                  <span className="text-base font-black text-rose-600 font-mono">
                    {v.pulseRate} bpm
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log New Vitals Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-pink-300 shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-600" />
              आशा स्वास्थ्य जांच दर्ज करें
            </h3>

            <form onSubmit={handleSaveVital} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    सिस्टोलिक बीपी (Systolic BP)
                  </label>
                  <input
                    type="number"
                    required
                    value={newBpSys}
                    onChange={(e) => setNewBpSys(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    डायस्टोलिक बीपी (Diastolic BP)
                  </label>
                  <input
                    type="number"
                    required
                    value={newBpDia}
                    onChange={(e) => setNewBpDia(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    फास्टिंग शुगर (mg/dL)
                  </label>
                  <input
                    type="number"
                    required
                    value={newSugar}
                    onChange={(e) => setNewSugar(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    पल्स रेट (Pulse Rate)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPulse}
                    onChange={(e) => setNewPulse(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  जांच टिप्पणी व सलाह (ASHA Notes)
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-sm font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-black shadow-md"
                >
                  जांच सुरक्षित करें (Save Log)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
