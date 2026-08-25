import React, { useState } from 'react';
import { TelemedicineDoc, ElderProfile } from '../types';
import { initialTelemedicineDoctors } from '../data/mockData';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  Stethoscope, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Calendar, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  Download, 
  Pill 
} from 'lucide-react';

interface TelemedicinePortalProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
  onNavigateToJanAushadhi: () => void;
}

export const TelemedicinePortal: React.FC<TelemedicinePortalProps> = ({
  elderProfile,
  onBackToHome,
  onNavigateToJanAushadhi
}) => {
  const [doctors] = useState<TelemedicineDoc[]>(initialTelemedicineDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<TelemedicineDoc | null>(null);
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  
  // Call summary & Billing State
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [prescriptionGenerated, setPrescriptionGenerated] = useState<boolean>(false);
  const [invoicePaid, setInvoicePaid] = useState<boolean>(false);

  const isHighContrast = elderProfile.highContrast;

  const handleStartConsultation = (doc: TelemedicineDoc) => {
    setSelectedDoctor(doc);
    setIsInCall(true);
    setCallEnded(false);
    setPrescriptionGenerated(false);
    setInvoicePaid(false);
    soundFx.playChime();
    speakElderVoice(`${doc.name} के साथ वीडियो परामर्श शुरू हो रहा है।`);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallEnded(true);
    setPrescriptionGenerated(true);
    soundFx.playChime();
    confetti({ particleCount: 50, spread: 60 });
    speakElderVoice(`डॉक्टर से परामर्श समाप्त हुआ। डॉक्टर का पर्चा और ₹${selectedDoctor?.consultationFeeINR} का बिल नीचे तैयार है।`);
  };

  const handlePayBill = () => {
    setInvoicePaid(true);
    soundFx.playChime();
    confetti({ particleCount: 60, spread: 70 });
    speakElderVoice('परामर्श शुल्क का भुगतान सफलतापूर्वक हो गया है। रसीद डाउनलोड कर सकते हैं।');
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-telemed-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-600 text-white">
                Tele-Health Portal
              </span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                घर बैठे विशेषज्ञ डॉक्टर से वीडियो कॉल व डिजिटल पर्चा
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-indigo-600" />
              टेलीमेडिसिन पोर्टल (Doctor Video Consult & Billing)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              वरिष्ठ विशेषज्ञ डॉक्टरों से तत्काल वीडियो परामर्श और स्वचालित बिलिंग प्रणाली
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVE VIDEO CONSULTATION ROOM */}
      {isInCall && selectedDoctor && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border-4 border-indigo-500 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3 border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                लाइव परामर्श चल रहा है (Live Consultation with {selectedDoctor.name})
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-900 text-indigo-200 border border-indigo-700">
              ⏱ 04:32 • Secure HIPAA/EHR Encrypted
            </span>
          </div>

          {/* Video Frames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Feed */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-400">
              <img
                src={selectedDoctor.photoUrl}
                alt={selectedDoctor.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{selectedDoctor.name} (डॉक्टर स्क्रीन)</span>
              </div>
              <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                Audio: High Fidelity
              </div>
            </div>

            {/* Elder Patient Feed */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700">
              {isCameraOn ? (
                <img
                  src={elderProfile.avatarUrl}
                  alt={elderProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <VideoOff className="w-16 h-16 mb-2" />
                  <span>कैमरा बंद है (Camera Off)</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{elderProfile.nickname} (मरीज स्क्रीन)</span>
              </div>
            </div>
          </div>

          {/* Video Action Controls Bar */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-2xl font-bold transition-all ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-4 rounded-2xl font-bold transition-all ${
                isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            <button
              id="end-telemed-call-btn"
              onClick={handleEndCall}
              className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base flex items-center gap-2 shadow-lg shadow-rose-600/40"
            >
              <PhoneOff className="w-6 h-6" />
              <span>परामर्श समाप्त करें व पर्चा प्राप्त करें (End Call)</span>
            </button>
          </div>
        </div>
      )}

      {/* POST CONSULTATION: PRESCRIPTION & AUTOMATED BILLING RECEIPT */}
      {callEnded && selectedDoctor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Digital e-Prescription Note */}
          <div className={`p-6 rounded-3xl border-3 shadow-xl space-y-4 ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-indigo-300'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                <div>
                  <h4 className="font-black text-lg text-slate-900 dark:text-white">डिजिटल ई-पर्चा (e-Prescription)</h4>
                  <p className="text-xs text-slate-500">परामर्शदाता: {selectedDoctor.name} ({selectedDoctor.degree})</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900">
                #RX-2026-8942
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200">
                <p><strong>मरीज:</strong> {elderProfile.name} (76 वर्ष) • रक्त समूह: {elderProfile.bloodGroup}</p>
                <p><strong>निदान (Clinical Notes):</strong> प्राथमिक उच्च रक्तचाप व टाइप-2 डायबिटीज स्थिर स्थिति में। नियमित सुबह की सैर व पर्याप्त जल सेवन की सलाह।</p>
              </div>

              <h5 className="font-bold text-slate-900 dark:text-white">निर्धारित दवाइयां (Prescribed Medicines):</h5>
              <ul className="space-y-1.5 pl-2">
                <li>• <strong>Tab. Telmisartan 40mg</strong> - 1 गोली सुबह नाश्ते के बाद (30 दिन)</li>
                <li>• <strong>Tab. Metformin 500mg + Glimepiride 2mg</strong> - 1 गोली सुबह (30 दिन)</li>
                <li>• <strong>Cap. Calcium + Vit D3</strong> - 1 गोली दोपहर खाने के बाद (30 दिन)</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  soundFx.playChime();
                  speakElderVoice('पर्चा पीडीएफ प्रारूप में डाउनलोड हो गया है।');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>पर्चा डाउनलोड करें</span>
              </button>

              <button
                id="send-rx-to-jan-aushadhi-btn"
                onClick={onNavigateToJanAushadhi}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
              >
                <Pill className="w-4 h-4" />
                <span>जन औषधि केंद्र पर सस्ती दवा मंगवाएं →</span>
              </button>
            </div>
          </div>

          {/* Automated Billing System Invoice */}
          <div className={`p-6 rounded-3xl border-3 shadow-xl space-y-4 ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-emerald-300'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <div>
                  <h4 className="font-black text-lg text-slate-900 dark:text-white">स्वचालित परामर्श बिल (Tele-Consult Invoice)</h4>
                  <p className="text-xs text-slate-500">रसीद सं: #INV-TELE-2026-441</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                invoicePaid ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {invoicePaid ? '✓ भुगतान पूर्ण (PAID)' : 'भुगतान लंबित'}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>डॉक्टर परामर्श शुल्क ({selectedDoctor.name}):</span>
                <span className="font-mono font-bold">₹{selectedDoctor.consultationFeeINR}.00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>डिजिटल ई-पर्चा व स्वास्थ्य रिकॉर्ड शुल्क:</span>
                <span className="font-mono font-bold text-emerald-600">₹0.00 (मुफ्त)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>जीएसटी (GST 0% Senior Citizen Tele-Health):</span>
                <span className="font-mono font-bold">₹0.00</span>
              </div>
              <div className="flex justify-between py-2 text-base font-black text-slate-900 dark:text-white border-t-2 border-emerald-400">
                <span>कुल देय राशि (Total Amount):</span>
                <span className="text-xl font-mono text-emerald-600">₹{selectedDoctor.consultationFeeINR}.00</span>
              </div>
            </div>

            <div className="pt-2">
              {!invoicePaid ? (
                <button
                  id="pay-telemed-invoice-btn"
                  onClick={handlePayBill}
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>UPI / कार्ड द्वारा ₹{selectedDoctor.consultationFeeINR} का भुगतान करें</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>भुगतान रसीद Caregiver पोर्टल व ईमेल पर प्रेषित।</span>
                  </span>
                  <button
                    onClick={() => {
                      soundFx.playChime();
                      speakElderVoice('रसीद डाउनलोड हो गई है।');
                    }}
                    className="underline text-emerald-800 font-bold"
                  >
                    रसीद डाउनलोड
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOCTORS LIST & SCHEDULING */}
      {!isInCall && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
            उपलब्ध विशेषज्ञ डॉक्टर (Available Specialist Doctors)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                  isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{doc.rating} • {doc.experienceYears} वर्ष अनुभव</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-amber-200">
                        {doc.name}
                      </h4>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-300">
                        {doc.specialty}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {doc.degree} • भाषाएं: {doc.languages.join(', ')}
                  </p>

                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-zinc-800 text-xs flex items-center justify-between font-semibold">
                    <span className="text-indigo-900 dark:text-indigo-200">{doc.availableTime}</span>
                    <span className="font-mono font-black text-indigo-700 dark:text-indigo-300">₹{doc.consultationFeeINR}</span>
                  </div>
                </div>

                <button
                  id={`start-consult-${doc.id}`}
                  onClick={() => handleStartConsultation(doc)}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <Video className="w-4 h-4" />
                  <span>वीडियो कॉल शुरू करें</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
