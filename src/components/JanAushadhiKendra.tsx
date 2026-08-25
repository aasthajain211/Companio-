import React, { useState } from 'react';
import { JanAushadhiKendraItem, GenericMedicineItem, ElderProfile } from '../types';
import { initialJanAushadhiKendras, initialGenericMedicines } from '../data/mockData';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  Pill, 
  MapPin, 
  Search, 
  Upload, 
  PhoneCall, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ShoppingBag, 
  FileText, 
  Clock, 
  Star 
} from 'lucide-react';

interface JanAushadhiKendraProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

export const JanAushadhiKendra: React.FC<JanAushadhiKendraProps> = ({
  elderProfile,
  onBackToHome
}) => {
  const [stores] = useState<JanAushadhiKendraItem[]>(initialJanAushadhiKendras);
  const [medicines] = useState<GenericMedicineItem[]>(initialGenericMedicines);
  const [activeTab, setActiveTab] = useState<'substitute' | 'locator' | 'prescription'>('substitute');

  // Search / Custom generic substitution query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMed, setSelectedMed] = useState<GenericMedicineItem>(initialGenericMedicines[0]);
  const [customAIResult, setCustomAIResult] = useState<any | null>(null);
  const [isSearchingAI, setIsSearchingAI] = useState<boolean>(false);

  // Prescription Upload Simulation
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isAnalyzingRx, setIsAnalyzingRx] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  const isHighContrast = elderProfile.highContrast;

  const handleSearchGenericAI = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingAI(true);
    setCustomAIResult(null);

    try {
      const res = await fetch('/api/jan-aushadhi/substitutes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName: query })
      });
      const data = await res.json();
      setCustomAIResult(data);
      soundFx.playChime();
      speakElderVoice(`जन औषधि केंद्र पर ${data.genericName} केवल ₹${data.janAushadhiPriceINR || data.janAushadhiPrice10Tablets} में उपलब्ध है। आपको लगभग ${data.savingsPercent || 85}% की बचत होगी!`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleSimulatePrescriptionUpload = () => {
    setIsAnalyzingRx(true);
    setTimeout(() => {
      setIsAnalyzingRx(false);
      setUploadedFile('Dr_Mathur_Prescription_Ram_Prakash_Sharma.pdf');
      soundFx.playChime();
      confetti({ particleCount: 60, spread: 70 });
      speakElderVoice('पर्चे का विश्लेषण पूरा हुआ! आपकी सभी 4 दवाइयां जन औषधि केंद्र पर उपलब्ध हैं और मासिक खर्च ₹1850 से घटकर मात्र ₹240 रह जाएगा।');
    }, 1800);
  };

  const handlePlacePickupOrder = () => {
    setOrderPlaced(true);
    soundFx.playChime();
    confetti({ particleCount: 70, spread: 80 });
    speakElderVoice('आपका जन औषधि पिकअप ऑर्डर सफलतापूर्वक बुक हो गया है। नजदीकी केंद्र से 30 मिनट में कलेक्ट कर सकते हैं।');
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-jan-aushadhi-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white">
                PMBJP Govt. Initiative
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                50% - 90% कम कीमत पर उच्च गुणवत्ता
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-200 mt-1 flex items-center gap-2">
              <Pill className="w-8 h-8 text-emerald-600" />
              प्रधानमंत्री जन औषधि केंद्र (Jan Aushadhi)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100">
              जेनेरिक दवा सब्स्टीट्यूट चेकर, नजदीकी स्टोर खोजें और पर्चा अपलोड करके सस्ती दवा पाएं
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="tab-substitute-btn"
            onClick={() => setActiveTab('substitute')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'substitute' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>जेनेरिक दवा बचत चेकर</span>
          </button>

          <button
            id="tab-locator-btn"
            onClick={() => setActiveTab('locator')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'locator' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>नजदीकी जन औषधि केंद्र ({stores.length})</span>
          </button>

          <button
            id="tab-prescription-btn"
            onClick={() => setActiveTab('prescription')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'prescription' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>पर्चा (Rx) अपलोड व ऑर्डर</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GENERIC MEDICINE SAVINGS CALCULATOR & SUBSTITUTION */}
      {activeTab === 'substitute' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className={`p-6 rounded-3xl border-2 shadow-md space-y-4 ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
          }`}>
            <h3 className="text-xl font-black text-slate-900 dark:text-amber-200">
              अपनी ब्रांडेड दवा का नाम खोजें (Search Branded Medicine)
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchGenericAI(searchQuery);
                  }}
                  placeholder="उदा. Glycomet-GP, Telma 40, Shelcal, Pan-D, Augmentin, Lipitor..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-base font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                id="search-generic-ai-btn"
                onClick={() => handleSearchGenericAI(searchQuery || 'Glycomet-GP 2')}
                disabled={isSearchingAI}
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                {isSearchingAI ? <Sparkles className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>सब्स्टीट्यूट खोजें</span>
              </button>
            </div>

            {/* Popular Common Medicines Quick Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">सुझाव:</span>
              {medicines.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMed(m);
                    setCustomAIResult(null);
                    speakElderVoice(`जन औषधि पर ${m.genericSalt} मात्र ₹${m.janAushadhiPrice10Tablets} में उपलब्ध है।`);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedMed.id === m.id && !customAIResult
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                  }`}
                >
                  {m.brandedName} ({m.savingsPercentage}% बचत)
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Price Comparison Card */}
          {(() => {
            const displayMed = customAIResult ? {
              brandedName: customAIResult.brandedName,
              genericSalt: customAIResult.genericName,
              brandedPrice10Tablets: customAIResult.brandPriceEstimateINR,
              janAushadhiPrice10Tablets: customAIResult.janAushadhiPriceINR,
              savingsPercentage: customAIResult.savingsPercent,
              category: customAIResult.therapeuticCategory,
              janAushadhiCode: customAIResult.janAushadhiCode,
              dosageAdvice: customAIResult.dosageInstruction,
              safetyNote: customAIResult.safetyNote
            } : selectedMed;

            const savingsAmt = (displayMed.brandedPrice10Tablets || 200) - (displayMed.janAushadhiPrice10Tablets || 25);

            return (
              <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl space-y-6 ${
                isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300'
              }`}>
                {/* Top Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <span className="text-sm font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Govt of India (BPPI) Certified Generic Bio-Equivalence
                    </span>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                    कोड: {displayMed.janAushadhiCode || 'PMBJP-GEN-101'}
                  </span>
                </div>

                {/* Main Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Branded Private Side */}
                  <div className="p-5 rounded-3xl bg-rose-50/80 dark:bg-zinc-900 border-2 border-rose-200 text-center space-y-2">
                    <span className="text-xs font-black uppercase text-rose-600 tracking-wider">
                      प्राइवेट ब्रांडेड दवा (Private Pharma)
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-200">
                      {displayMed.brandedName}
                    </h4>
                    <div className="text-3xl sm:text-4xl font-black text-rose-600 font-mono">
                      ₹{displayMed.brandedPrice10Tablets}
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-300">
                      प्रति 10 टैबलेट का अनुमानित बाजार मूल्य
                    </p>
                  </div>

                  {/* VS & Savings Banner */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-pulse">
                      VS
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-400">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 block">कुल बचत (Total Savings)</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                        {displayMed.savingsPercentage}% (₹{savingsAmt} बचाएं)
                      </span>
                    </div>
                  </div>

                  {/* Jan Aushadhi Generic Side */}
                  <div className="p-5 rounded-3xl bg-emerald-500 text-white border-2 border-emerald-400 text-center space-y-2 shadow-xl shadow-emerald-500/20">
                    <span className="text-xs font-black uppercase text-emerald-100 tracking-wider">
                      प्रधानमंत्री जन औषधि केंद्र (PMBJP)
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white">
                      {displayMed.genericSalt}
                    </h4>
                    <div className="text-4xl sm:text-5xl font-black text-amber-300 font-mono">
                      ₹{displayMed.janAushadhiPrice10Tablets}
                    </div>
                    <p className="text-xs text-emerald-100">
                      100% शुद्ध फॉर्मूला, प्रमाणित गुणवत्ता
                    </p>
                  </div>
                </div>

                {/* Additional Clinical Info */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm space-y-2">
                  <p><strong>रोग/श्रेणी (Category):</strong> {displayMed.category || 'Chronic Maintenance'}</p>
                  <p><strong>खुराक सलाह:</strong> {displayMed.dosageAdvice || 'डॉक्टर के पर्चे के अनुसार लें।'}</p>
                  <p className="text-xs text-slate-500">
                    ℹ️ जेनेरिक दवाओं में वही एक्टिव साल्ट (Chemical Compound) होता है जो महंगी ब्रांडेड दवाओं में होता है। सरकार इनका सीधा वितरण करती है जिससे बिचौलियों का कमीशन हट जाता है।
                  </p>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> नजदीकी 3 जन औषधि केंद्रों पर तुरंत स्टॉक में उपलब्ध
                  </span>
                  <button
                    id="order-generic-pickup-btn"
                    onClick={() => {
                      setActiveTab('prescription');
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>पर्चा अपलोड करके ऑर्डर करें</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: NEARBY JAN AUSHADHI STORES LOCATOR */}
      {activeTab === 'locator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              आपके घर के निकटतम जन औषधि केंद्र (Nearby PMBJP Kendras)
            </h3>

            <div className="space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                        {store.distanceKm} KM दूर
                      </span>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" /> {store.rating}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-amber-200">
                      {store.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{store.address}</span>
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>समय: {store.timings} • {store.availableStockCount}+ दवाइयां स्टॉक में</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
                    <a
                      id={`call-store-${store.id}`}
                      href={`tel:${store.phone}`}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>कॉल करें</span>
                    </a>
                    <button
                      onClick={() => {
                        soundFx.playChime();
                        speakElderVoice(`यह केंद्र आपके घर से ${store.distanceKm} किलोमीटर दूर कम्युनिटी सेंटर के पास स्थित है।`);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>दिशा-निर्देश</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Simulated Map */}
          <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-md ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-lg font-black flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              लाइव मैप लोकेशन (Jaipur Area)
            </h4>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
              {/* Simulated Map Visual */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Center Home Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center text-white shadow-xl animate-bounce">
                  🏠
                </div>
                <span className="text-[11px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-full mt-1 inline-block">
                  दादाजी का घर
                </span>
              </div>

              {/* Kendra 1 Pin */}
              <div className="absolute top-1/3 left-2/3 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-lg">
                  💊
                </div>
                <span className="text-[10px] font-semibold text-emerald-200 bg-black/80 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">
                  0.6 KM
                </span>
              </div>

              {/* Kendra 2 Pin */}
              <div className="absolute bottom-1/4 left-1/4 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-lg">
                  💊
                </div>
                <span className="text-[10px] font-semibold text-emerald-200 bg-black/80 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">
                  1.8 KM
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-zinc-800 text-xs text-slate-700 dark:text-slate-300">
              💡 जन औषधि केंद्र पर जाने से पहले आप फोन करके अपनी दवाओं की उपलब्धता की पुष्टि भी कर सकते हैं।
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRESCRIPTION UPLOAD & ORDER SIMULATOR */}
      {activeTab === 'prescription' && (
        <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl max-w-3xl mx-auto space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-indigo-200'
        }`}>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-amber-200 flex items-center gap-2">
              <Upload className="w-7 h-7 text-indigo-600" />
              डॉक्टर का पर्चा (Prescription) अपलोड करें
            </h3>
            <p className="text-sm text-slate-600 dark:text-amber-100 mt-1">
              AI अपने आप सभी महंगी ब्रांडेड दवाओं को सरकारी जन औषधि जेनेरिक साल्ट में बदलकर कुल बचत दिखाएगा।
            </p>
          </div>

          {!uploadedFile ? (
            <div
              onClick={handleSimulatePrescriptionUpload}
              className="p-8 sm:p-12 border-3 border-dashed border-indigo-300 dark:border-zinc-700 rounded-3xl text-center bg-indigo-50/50 dark:bg-zinc-800/40 hover:bg-indigo-50 transition-colors cursor-pointer space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                {isAnalyzingRx ? <Sparkles className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              </div>
              <h4 className="text-lg font-black text-indigo-950 dark:text-white">
                {isAnalyzingRx ? 'पर्चे का विश्लेषण हो रहा है...' : 'पर्चे की फोटो खींचें या फाइल चुनें'}
              </h4>
              <p className="text-xs text-slate-500">
                (Click to simulate prescription scan of Dr. Alok Mathur's BP & Diabetes Rx)
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              {/* Analyzed Result Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-zinc-800 border border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h5 className="font-bold text-sm text-emerald-950 dark:text-emerald-200">{uploadedFile}</h5>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">✓ 4 दवाइयां सफलतापूर्वक पहचानी गईं</p>
                  </div>
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600"
                >
                  हटाएं ✕
                </button>
              </div>

              {/* Monthly Medicine Cost Breakdown Table */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 space-y-3">
                <h5 className="font-black text-base text-slate-900 dark:text-white">मासिक खर्च की तुलना (Monthly Cost Breakdown)</h5>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>1. Telma 40 (बीपी) 30 टैबलेट:</span>
                    <span>ब्रांडेड: ₹330 ➔ <strong>जन औषधि: ₹42</strong></span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>2. Glycomet GP 2 (शुगर) 60 टैबलेट:</span>
                    <span>ब्रांडेड: ₹1290 ➔ <strong>जन औषधि: ₹156</strong></span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>3. Shelcal HD (कैल्शियम) 30 टैबलेट:</span>
                    <span>ब्रांडेड: ₹405 ➔ <strong>जन औषधि: ₹54</strong></span>
                  </div>
                  <div className="flex justify-between py-2 font-black text-base text-emerald-700 dark:text-emerald-300 border-t-2 border-emerald-400">
                    <span>कुल मासिक खर्च:</span>
                    <span>₹2,025 ➔ मात्र ₹252 (87.5% बचत)</span>
                  </div>
                </div>
              </div>

              {/* Order / Pickup Button */}
              {!orderPlaced ? (
                <button
                  id="confirm-jan-aushadhi-order-btn"
                  onClick={handlePlacePickupOrder}
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>नजदीकी केंद्र (मॉडल टाउन) पर पिकअप बुक करें (₹252)</span>
                </button>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-100 text-emerald-950 border-2 border-emerald-500 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-black">ऑर्डर बुक हो गया है!</h4>
                  <p className="text-xs">
                    पिकअप टोकन: <strong>#PMBJP-JPR-8821</strong> • एसएमएस आपके फोन पर भेज दिया गया है।
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
