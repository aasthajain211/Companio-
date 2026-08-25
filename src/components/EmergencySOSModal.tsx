import React, { useState, useEffect, useRef } from 'react';
import { ElderProfile } from '../types';
import { soundFx } from '../utils/audioUtils';
import { 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  X, 
  AlertTriangle, 
  Battery, 
  Clock, 
  HeartHandshake 
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  elderProfile: ElderProfile;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  elderProfile
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);
  const [isSirenMuted, setIsSirenMuted] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<'pending' | 'dispatched'>('pending');
  const stopSirenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (isOpen) {
      setCountdown(3);
      setIsTriggered(false);
      setDispatchStatus('pending');

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            triggerAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (stopSirenRef.current) {
        stopSirenRef.current();
        stopSirenRef.current = null;
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (stopSirenRef.current) {
        stopSirenRef.current();
        stopSirenRef.current = null;
      }
    };
  }, [isOpen]);

  const triggerAlert = () => {
    setIsTriggered(true);
    setDispatchStatus('dispatched');
    if (!isSirenMuted) {
      stopSirenRef.current = soundFx.playSiren(15);
    }
  };

  const handleCancelBeforeTrigger = () => {
    if (stopSirenRef.current) {
      stopSirenRef.current();
      stopSirenRef.current = null;
    }
    onClose();
  };

  const toggleSirenMute = () => {
    if (isSirenMuted) {
      stopSirenRef.current = soundFx.playSiren(10);
      setIsSirenMuted(false);
    } else {
      if (stopSirenRef.current) {
        stopSirenRef.current();
        stopSirenRef.current = null;
      }
      setIsSirenMuted(true);
    }
  };

  if (!isOpen) return null;

  const primaryContact = elderProfile.emergencyContacts.find(c => c.isPrimary) || elderProfile.emergencyContacts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-4 transition-all ${
        isTriggered 
          ? 'bg-red-950 text-white border-red-500 animate-pulse' 
          : 'bg-slate-900 text-white border-amber-500'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-6 text-center relative border-b border-red-800/60 bg-gradient-to-b from-red-900/80 to-transparent">
          <button
            id="close-sos-btn"
            onClick={handleCancelBeforeTrigger}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-full bg-red-600 border-4 border-white flex items-center justify-center shadow-lg shadow-red-500/50 mb-3 animate-bounce">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-red-100">
            {isTriggered ? '🚨 आपातकालीन अलार्म सक्रिय!' : '⚠️ आपातकालीन सहायता (Emergency SOS)'}
          </h2>
          <p className="text-sm sm:text-base text-red-200 mt-1">
            {isTriggered 
              ? 'केयरगिवर और परिवार को लोकेशन व कॉल भेजा जा रहा है...' 
              : 'गलती से दबा हो तो तुरंत नीचे दिए गए बटन से रद्द करें।'}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {!isTriggered ? (
            /* Countdown Stage */
            <div className="text-center py-6 space-y-4">
              <div className="text-6xl sm:text-8xl font-black text-amber-400 font-mono">
                0{countdown}
              </div>
              <p className="text-lg text-slate-200 font-medium">
                अलार्म बजने में {countdown} सेकंड बाकी हैं...
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  id="cancel-sos-countdown-btn"
                  onClick={handleCancelBeforeTrigger}
                  className="px-6 py-4 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg border-2 border-slate-500 shadow-md"
                >
                  गलती से दब गया (रद्द करें / Cancel)
                </button>
                <button
                  id="instant-trigger-sos-btn"
                  onClick={triggerAlert}
                  className="px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-lg border-2 border-red-400 shadow-lg shadow-red-600/40"
                >
                  अभी तुरंत भेजें (Alert Now)
                </button>
              </div>
            </div>
          ) : (
            /* Dispatched Active State */
            <div className="space-y-4">
              {/* Alert Status Banner */}
              <div className="p-4 rounded-2xl bg-red-900/60 border border-red-500 flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base">
                  <h4 className="font-bold text-white text-base sm:text-lg">
                    मैसेज और लोकेशन सफलतापूर्वक भेज दिया गया है
                  </h4>
                  <p className="text-red-200 text-xs sm:text-sm mt-0.5">
                    रोहन (बेटा) और आपातकालीन टीम को अलर्ट नोटिफिकेशन जा चुका है।
                  </p>
                </div>
              </div>

              {/* Patient Live Details Sent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm bg-black/40 p-4 rounded-2xl border border-red-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span><strong>स्थान:</strong> {elderProfile.homeAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span><strong>फोन बैटरी:</strong> 88% (चार्ज्ड)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span><strong>रक्त समूह:</strong> {elderProfile.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span><strong>समय:</strong> अभी-अभी (Live)</span>
                </div>
              </div>

              {/* Direct Quick Call Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <a
                  id="call-primary-caregiver-btn"
                  href={`tel:${primaryContact.phone}`}
                  className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-emerald-400"
                >
                  <PhoneCall className="w-6 h-6 animate-pulse" />
                  <span className="text-base font-black">रोहन को कॉल करें</span>
                  <span className="text-xs text-emerald-100">{primaryContact.phone}</span>
                </a>

                <a
                  id="call-112-btn"
                  href="tel:112"
                  className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-blue-400"
                >
                  <PhoneCall className="w-6 h-6" />
                  <span className="text-base font-black">112 पुलिस/इमरजेंसी</span>
                  <span className="text-xs text-blue-100">National Helpline</span>
                </a>

                <a
                  id="call-108-ambulance-btn"
                  href="tel:108"
                  className="p-4 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-center flex flex-col items-center justify-center gap-1 shadow-lg border-2 border-rose-400"
                >
                  <HeartHandshake className="w-6 h-6" />
                  <span className="text-base font-black">108 एम्बुलेंस</span>
                  <span className="text-xs text-rose-100">Govt Medical Ambulance</span>
                </a>
              </div>

              {/* Bottom Siren & Safe Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-red-900">
                <button
                  id="toggle-siren-btn"
                  onClick={toggleSirenMute}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-600"
                >
                  {isSirenMuted ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-amber-400" />}
                  <span>{isSirenMuted ? 'सायरन फिर बजाएं' : 'सायरन की आवाज बंद करें'}</span>
                </button>

                <button
                  id="i-am-safe-now-btn"
                  onClick={handleCancelBeforeTrigger}
                  className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm sm:text-base border-2 border-emerald-400 shadow-md"
                >
                  ✓ मैं अब सुरक्षित हूँ (I am Safe)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
