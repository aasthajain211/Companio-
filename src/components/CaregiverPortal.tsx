import React, { useState } from 'react';
import { 
  ElderProfile, 
  ReminderItem, 
  UIStage, 
  SmartHomeDevice 
} from '../types';
import { FamilyVoiceRecorder } from './FamilyVoiceRecorder';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Mic, 
  ShieldCheck, 
  Moon, 
  MapPin, 
  Sparkles, 
  Heart, 
  Check, 
  Clock, 
  Pill, 
  Smartphone, 
  User, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

interface CaregiverPortalProps {
  elderProfile: ElderProfile;
  setElderProfile: React.Dispatch<React.SetStateAction<ElderProfile>>;
  reminders: ReminderItem[];
  setReminders: React.Dispatch<React.SetStateAction<ReminderItem[]>>;
  smartDevices: SmartHomeDevice[];
  setSmartDevices: React.Dispatch<React.SetStateAction<SmartHomeDevice[]>>;
  onNavigateToView: (view: any) => void;
}

export const CaregiverPortal: React.FC<CaregiverPortalProps> = ({
  elderProfile,
  setElderProfile,
  reminders,
  setReminders,
  smartDevices,
  setSmartDevices,
  onNavigateToView
}) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState<boolean>(false);
  
  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleHindi, setNewTitleHindi] = useState('');
  const [newCategory, setNewCategory] = useState<'med' | 'water' | 'food' | 'walk' | 'doctor'>('med');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newPeriod, setNewPeriod] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Afternoon');
  const [newDosage, setNewDosage] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newInstructionsHindi, setNewInstructionsHindi] = useState('');

  // Geofence Radius
  const [geofenceRadius, setGeofenceRadius] = useState<number>(150);

  // Night Wander Alert Simulation
  const [nightWanderAlert, setNightWanderAlert] = useState<boolean>(false);

  const handleStageChange = (stage: UIStage) => {
    setElderProfile(prev => ({ ...prev, stage }));
    soundFx.playChime();
    speakElderVoice(`इंटरफेस को स्टेज ${stage} पर सेट कर दिया गया है।`);
  };

  const handleToggleSmartDevice = (id: string) => {
    soundFx.playChime();
    setSmartDevices(prev =>
      prev.map(d => (d.id === id ? { ...d, isOn: !d.isOn } : d))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    soundFx.playChime();
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newReminder: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newTitle,
      titleHindi: newTitleHindi || newTitle,
      category: newCategory,
      time: newTime,
      period: newPeriod,
      dosage: newDosage || '1 Tablet with water',
      instructions: newInstructions || 'Take as prescribed.',
      instructionsHindi: newInstructionsHindi || 'डॉक्टर के निर्देशानुसार लें।',
      audioPromptText: `दादाजी, ${newTitleHindi || newTitle} का समय हो गया है।`,
      recordedBy: 'रोहन (केयरगिवर)',
      takenToday: false,
      iconName: newCategory === 'med' ? 'Pill' : newCategory === 'water' ? 'Droplet' : 'Footprints'
    };

    setReminders(prev => [...prev, newReminder]);
    setIsAddMedModalOpen(false);
    setNewTitle('');
    setNewTitleHindi('');
    setNewDosage('');
    setNewInstructions('');
    setNewInstructionsHindi('');
    soundFx.playChime();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-600 text-white">
              Remote Control Mode
            </span>
            <span className="text-xs font-bold text-slate-500">
              Active Sync: Connected from Bengaluru
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Sliders className="w-8 h-8 text-indigo-600" />
            केयरगिवर रिमोट पोर्टल (Caregiver Remote Control)
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {elderProfile.name} के लिए दूर से दवाइयां, आवाज संदेश और सुरक्षा सेटिंग्स प्रबंधित करें
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="open-voice-recorder-btn"
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
          >
            <Mic className="w-4 h-4" />
            <span>परिवार की आवाज रिकॉर्ड करें</span>
          </button>

          <button
            id="add-med-schedule-btn"
            onClick={() => setIsAddMedModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>नई दवा जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Auto-Simplifying UI Stage Selector Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-teal-500/10 border-2 border-indigo-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              ऑटो-सिंपलीफाइंग इंटरफेस (Auto-Simplifying UI Stage)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              मरीज की स्थिति/स्टेज के अनुसार ऐप का लेआउट अपने आप बड़ा और सरल बनता जाता है
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-600 text-white">
            वर्तमान स्टेज: S{elderProfile.stage}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            id="set-stage-1-btn"
            onClick={() => handleStageChange(1)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              elderProfile.stage === 1 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md font-bold' 
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-amber-400'
            }`}
          >
            <h4 className="font-black text-base">स्टेज 1: सामान्य / माइल्ड</h4>
            <p className="text-xs opacity-90 mt-1">
              पूरा ग्रिड मेनू, सभी सुविधाएं और विस्तृत चेकलिस्ट
            </p>
          </button>

          <button
            id="set-stage-2-btn"
            onClick={() => handleStageChange(2)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              elderProfile.stage === 2 
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md font-bold' 
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-indigo-400'
            }`}
          >
            <h4 className="font-black text-base">स्टेज 2: मध्यम / सरल (4 बड़े कार्ड)</h4>
            <p className="text-xs opacity-90 mt-1">
              4 बड़े टच कार्ड्स: दवा, परिवार, गाने और साथी
            </p>
          </button>

          <button
            id="set-stage-3-btn"
            onClick={() => handleStageChange(3)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              elderProfile.stage === 3 
                ? 'bg-rose-600 text-white border-rose-700 shadow-md font-bold' 
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 hover:border-rose-400'
            }`}
          >
            <h4 className="font-black text-base">स्टेज 3: उन्नत / 2-बटन मोड</h4>
            <p className="text-xs opacity-90 mt-1">
              सिर्फ 2 विशाल टच बटन: "साथी से बात करें" और "मदद / SOS"
            </p>
          </button>
        </div>
      </div>

      {/* Safety & Sensors Row: Silent Geofencing & Night Wander */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Silent Geofencing Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">साइलेंट जियोफेंसिंग (Safe Home Boundary)</h3>
                <p className="text-xs text-slate-500">घर से बाहर जाने पर बिना शोर के फोन पर शांत अलर्ट</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToView('geofence')}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              मैप देखें →
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>सुरक्षित दायरा (Radius):</span>
              <span className="text-teal-600">{geofenceRadius} मीटर (Home Safe Zone)</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-zinc-800 text-xs flex items-center justify-between">
            <span className="text-teal-900 dark:text-teal-200 font-semibold">
              ✓ दादाजी अभी घर की सीमा के अंदर हैं (Live GPS: Model Town)
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Night Wander Alert Sensor */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">नाइट वांडर अलर्ट (Night Wander Monitor)</h3>
                <p className="text-xs text-slate-500">रात 11 PM से सुबह 5 AM तक मोशन सेंसर निगरानी</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Active Mode
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-zinc-800 text-xs flex items-center justify-between">
            <span className="text-purple-900 dark:text-purple-200 font-semibold">
              {nightWanderAlert 
                ? '⚠️ अलर्ट: रात 02:40 AM पर बिस्तर से उठने की हलचल दर्ज हुई!' 
                : '✓ रात में कोई असामान्य हलचल नहीं हुई।'}
            </span>
            <button
              onClick={() => setNightWanderAlert(!nightWanderAlert)}
              className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs shadow-sm"
            >
              {nightWanderAlert ? 'हलचल रीसेट करें' : 'सिमुलेट करें (Test)'}
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            हलचल होने पर स्वचालित रूप से हॉलवे की धीमी पीली लाइट चालू हो जाती है ताकि गिरने का खतरा न रहे।
          </p>
        </div>
      </div>

      {/* Medication & Routine Remote Manager */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Pill className="w-6 h-6 text-rose-600" />
              दवाइयों और दिनचर्या का शेड्यूल (Medication Schedule)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              यहां जोड़े गए बदलाव सीधे दादाजी के फोन/टैबलेट पर तुरंत अपडेट हो जाते हैं
            </p>
          </div>

          <button
            onClick={() => setIsAddMedModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>नया शेड्यूल जोड़ें</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-zinc-800/40"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700">
                    {r.time} ({r.period})
                  </span>
                  {r.recordedBy && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Mic className="w-3 h-3" /> {r.recordedBy} की आवाज
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {r.titleHindi}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.dosage} • {r.instructionsHindi}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-300 italic mt-1">
                  "{r.audioPromptText}"
                </p>
              </div>

              <button
                onClick={() => handleDeleteReminder(r.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-700 transition-colors"
                title="Delete Schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Home Automation Quick Toggles */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          स्मार्ट होम उपकरण (Smart Home Integration)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {smartDevices.map((dev) => (
            <div
              key={dev.id}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                dev.isOn 
                  ? 'bg-amber-50/70 border-amber-400 text-slate-900 dark:bg-zinc-800 dark:text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-zinc-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-slate-200">
                    {dev.room}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${dev.isOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                </div>
                <h4 className="font-bold text-sm">{dev.nameHindi}</h4>
                <p className="text-xs text-slate-500 mt-1">{dev.scheduleDescription}</p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="text-xs font-semibold">{dev.isOn ? 'चालू (ON)' : 'बंद (OFF)'}</span>
                <button
                  onClick={() => handleToggleSmartDevice(dev.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    dev.isOn ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {dev.isOn ? 'बंद करें' : 'चालू करें'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Recorder Modal */}
      {isVoiceModalOpen && (
        <FamilyVoiceRecorder
          reminders={reminders}
          setReminders={setReminders}
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}

      {/* Add Medication Modal */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-emerald-300 shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-600" />
              नई दवा या दिनचर्या रिमाइंडर जोड़ें
            </h3>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  दवा/काम का नाम (English Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. Telma 40 Blood Pressure Tablet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  नाम हिंदी में (Hindi Display Name)
                </label>
                <input
                  type="text"
                  placeholder="उदा. सुबह की बीपी की गोली (Telma 40)"
                  value={newTitleHindi}
                  onChange={(e) => setNewTitleHindi(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    समय (Time)
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    समय का भाग (Period)
                  </label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                  >
                    <option value="Morning">Morning (सुबह)</option>
                    <option value="Afternoon">Afternoon (दोपहर)</option>
                    <option value="Evening">Evening (शाम)</option>
                    <option value="Night">Night (रात)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  खुराक व निर्देश (Dosage Instruction Hindi)
                </label>
                <input
                  type="text"
                  value={newInstructionsHindi}
                  onChange={(e) => setNewInstructionsHindi(e.target.value)}
                  placeholder="उदा. 1 हरी गोली नाश्ते के बाद गुनगुने पानी से लें"
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-sm font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-md"
                >
                  शेड्यूल जोड़ें (Save Schedule)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
