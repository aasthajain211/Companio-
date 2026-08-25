import React, { useState, useEffect } from 'react';
import { ElderProfile } from '../types';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import { 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  ArrowLeft, 
  PhoneCall, 
  Radio, 
  Home, 
  Sparkles 
} from 'lucide-react';

interface GeofenceMapProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  elderProfile,
  onBackToHome
}) => {
  const [safeRadiusMeters, setSafeRadiusMeters] = useState<number>(150);
  const [currentDistanceMeters, setCurrentDistanceMeters] = useState<number>(35);
  const [isSimulatingBreach, setIsSimulatingBreach] = useState<boolean>(false);
  const [lastAlertTime, setLastAlertTime] = useState<string | null>(null);

  const isHighContrast = elderProfile.highContrast;
  const isOutsideGeofence = currentDistanceMeters > safeRadiusMeters;

  const handleSimulateWander = () => {
    if (!isSimulatingBreach) {
      setCurrentDistanceMeters(220);
      setIsSimulatingBreach(true);
      setLastAlertTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      soundFx.playChime();
      speakElderVoice('साइलेंट अलर्ट सक्रिय: दादाजी सुरक्षित सीमा (150 मीटर) से 220 मीटर बाहर चले गए हैं। केयरगिवर को शांत सूचना भेजी गई है।');
    } else {
      setCurrentDistanceMeters(35);
      setIsSimulatingBreach(false);
      soundFx.playChime();
      speakElderVoice('दादाजी सुरक्षित घर के अंदर वापस आ गए हैं।');
    }
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-geofence-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-600 text-white">
                Silent GPS Geofencing
              </span>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                बिना सायरन बजाए केयरगिवर को शांत सूचना (Zero Elder Panic)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-teal-600" />
              साइलेंट जियोफेंसिंग सुरक्षा (Silent Safe-Zone Radar)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              मरीज के घर से दूर जाने पर बिना किसी तेज शोर के केयरगिवर के फोन पर तत्काल साइलेंट अलर्ट
            </p>
          </div>
        </div>

        <button
          id="simulate-wander-btn"
          onClick={handleSimulateWander}
          className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all ${
            isSimulatingBreach
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
          }`}
        >
          <Radio className="w-5 h-5 animate-pulse" />
          <span>{isSimulatingBreach ? 'घर वापसी सिमुलेट करें (Return Home)' : 'घर से बाहर जाना टेस्ट करें (Simulate Wander)'}</span>
        </button>
      </div>

      {/* Live Status Banner */}
      <div className={`p-6 rounded-3xl border-3 shadow-xl transition-all ${
        isOutsideGeofence
          ? 'bg-rose-500 text-white border-rose-400'
          : isHighContrast 
            ? 'bg-zinc-950 text-amber-200 border-amber-400' 
            : 'bg-emerald-500 text-white border-emerald-400'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              {isOutsideGeofence ? <AlertTriangle className="w-10 h-10 animate-bounce" /> : <ShieldCheck className="w-10 h-10" />}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white/80">
                {isOutsideGeofence ? '⚠️ सुरक्षित सीमा उल्लंघन (Geofence Breach)' : '✓ सुरक्षित स्थिति (All Safe)'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                {isOutsideGeofence 
                  ? `दादाजी घर से ${currentDistanceMeters}m दूर पार्क की ओर हैं!` 
                  : `दादाजी घर के अंदर हैं (${currentDistanceMeters}m दूरी)`}
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                {isOutsideGeofence 
                  ? 'केयरगिवर रोहन के मोबाइल पर साइलेंट नोटिफिकेशन और लाइव मैप लिंक भेज दिया गया है।' 
                  : `घर की निर्धारित सुरक्षित परिधि: ${safeRadiusMeters} मीटर`}
              </p>
            </div>
          </div>

          {lastAlertTime && (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/30 text-white">
              अंतिम अलर्ट: {lastAlertTime}
            </span>
          )}
        </div>
      </div>

      {/* Radar Map Visual & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Simulation */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-950 text-white border-2 border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-teal-400" />
              लाइव रडार व परिधि (Real-time GPS Radar)
            </h4>
            <span className="text-xs font-mono text-teal-300">Accuracy: ±2.5m</span>
          </div>

          {/* Interactive Radar Visual */}
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* Concentric Safe Zone Rings */}
            <div 
              style={{ width: `${safeRadiusMeters * 1.5}px`, height: `${safeRadiusMeters * 1.5}px` }} 
              className="rounded-full border-2 border-dashed border-teal-400/80 bg-teal-500/10 flex items-center justify-center transition-all duration-500 relative"
            >
              <span className="absolute top-2 text-[10px] font-bold text-teal-300 bg-black/60 px-2 py-0.5 rounded-full">
                सुरक्षित सीमा ({safeRadiusMeters}m)
              </span>
            </div>

            {/* Home Center Anchor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center text-white text-xl shadow-2xl">
                🏠
              </div>
              <span className="text-[11px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-full mt-1 inline-block">
                होम बेस (Home)
              </span>
            </div>

            {/* Elder GPS Live Dot */}
            <div 
              style={{
                transform: `translate(${isOutsideGeofence ? '120px, -90px' : '20px, 20px'})`
              }}
              className="absolute text-center transition-all duration-1000 z-20"
            >
              <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white text-base shadow-2xl ${
                isOutsideGeofence ? 'bg-rose-600 animate-bounce' : 'bg-emerald-500 animate-pulse'
              }`}>
                👴
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                isOutsideGeofence ? 'bg-rose-700 text-white' : 'bg-emerald-800 text-emerald-200'
              }`}>
                दादाजी ({currentDistanceMeters}m)
              </span>
            </div>
          </div>
        </div>

        {/* Geofence Customization Controls */}
        <div className={`p-6 rounded-3xl border-2 space-y-6 shadow-md ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            सीमा सेटिंग्स (Perimeter Config)
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-bold">
              <span>सुरक्षित त्रिज्या (Safe Radius):</span>
              <span className="text-teal-600 font-mono">{safeRadiusMeters} मीटर</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="25"
              value={safeRadiusMeters}
              onChange={(e) => setSafeRadiusMeters(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50m (कमरा व लॉन)</span>
              <span>200m (पड़ोस)</span>
              <span>400m (कॉलोनी)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-zinc-800/80 border border-teal-200 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <h5 className="font-bold text-teal-950 dark:text-teal-200">साइलेंट फीचर का महत्व:</h5>
            <p>
              अक्सर डिमेंशिया या अल्जाइमर के मरीज सायरन या तेज बीप से डर जाते हैं और घबराहट में तेजी से भाग सकते हैं। Companio का <strong>साइलेंट जियोफेंसिंग</strong> मरीज के फोन को शांत रखता है और केयरगिवर को गोपनीय तरीके से सावधान करता है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
