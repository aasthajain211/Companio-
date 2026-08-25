import React, { useState } from 'react';
import { 
  UserAccount, 
  ElderProfile, 
  SupportedLanguageCode, 
  UIStage, 
  UserRole 
} from '../types';
import { INDIAN_22_LANGUAGES, getTranslation } from '../data/languages';
import { 
  User, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Globe2, 
  Check, 
  X, 
  Sparkles, 
  LogOut, 
  HeartHandshake, 
  Stethoscope, 
  Users, 
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { soundFx } from '../utils/audioUtils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: Partial<ElderProfile>) => void;
  elderProfile: ElderProfile;
}

export const DEMO_PRESET_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-senior-01',
    username: 'ramesh.sharma',
    fullName: 'रमेश चंद्र शर्मा (Ramesh Chandra)',
    phoneNumber: '9876543210',
    role: 'senior',
    age: 74,
    gender: 'male',
    bloodGroup: 'B+ Positive',
    city: 'जयपुर, राजस्थान',
    language: 'hi',
    stage: 2,
    emergencyPhone: '+91 98765 43210',
    emergencyContactName: 'Rohan Sharma (Beta / Son)',
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'user-senior-02',
    username: 'shanti.devi',
    fullName: 'श्रीमती शांति देवी (Shanti Devi)',
    phoneNumber: '9812345678',
    role: 'senior',
    age: 71,
    gender: 'female',
    bloodGroup: 'O+ Positive',
    city: 'नई दिल्ली',
    language: 'hi',
    stage: 1,
    emergencyPhone: '+91 98123 45678',
    emergencyContactName: 'Amit Verma (Son)',
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'user-caregiver-01',
    username: 'rohan.care',
    fullName: 'रोहन शर्मा (Rohan Sharma - Son & Caregiver)',
    phoneNumber: '9876500001',
    role: 'caregiver',
    age: 42,
    gender: 'male',
    city: 'जयपुर, राजस्थान',
    language: 'en',
    stage: 1,
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'user-doctor-01',
    username: 'dr.alok',
    fullName: 'Dr. Alok Mathur (MD Geriatrics)',
    phoneNumber: '9911233445',
    role: 'doctor',
    age: 52,
    gender: 'male',
    city: 'SMS Hospital, Jaipur',
    language: 'hi',
    stage: 1,
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'user-asha-01',
    username: 'rekha.asha',
    fullName: 'रेखा देवी (ASHA Swasthya Karyakartri)',
    phoneNumber: '9829012345',
    role: 'asha',
    age: 38,
    gender: 'female',
    city: 'वार्ड 12, जयपुर',
    language: 'hi',
    stage: 1,
    isLoggedIn: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateProfile,
  elderProfile
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'profile'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [ageInput, setAgeInput] = useState('72');
  const [roleInput, setRoleInput] = useState<UserRole>('senior');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>(
    (elderProfile.language as SupportedLanguageCode) || 'hi'
  );
  const [selectedStage, setSelectedStage] = useState<UIStage>(elderProfile.stage);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchLang, setSearchLang] = useState('');

  if (!isOpen) return null;

  const currentLang = (elderProfile.language as SupportedLanguageCode) || 'hi';
  const t = (key: any) => getTranslation(currentLang, key);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!usernameInput.trim() && !phoneInput.trim()) {
      setErrorMessage('कृपया यूज़रनेम या मोबाइल नंबर दर्ज करें (Please enter username or mobile)');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('कृपया पासवर्ड या 4-अंकों का पिन दर्ज करें (Please enter password or PIN)');
      return;
    }

    // Match with existing or construct user account
    const matched = DEMO_PRESET_ACCOUNTS.find(
      (a) =>
        a.username.toLowerCase() === usernameInput.toLowerCase() ||
        a.phoneNumber === phoneInput ||
        a.phoneNumber === usernameInput
    );

    const userToLogin: UserAccount = matched || {
      id: `usr-${Date.now()}`,
      username: usernameInput || phoneInput,
      fullName: fullNameInput || usernameInput || 'उपयोगकर्ता (User)',
      phoneNumber: phoneInput || '9876543210',
      role: roleInput,
      age: parseInt(ageInput, 10) || 72,
      language: selectedLanguage,
      stage: selectedStage,
      isLoggedIn: true,
      city: 'India',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
    };

    soundFx.playChime();
    onLogin(userToLogin);
    setSuccessMessage('सफलतापूर्वक लॉग इन हुआ! (Successfully Logged In)');
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameInput.trim()) {
      setErrorMessage('कृपया पूरा नाम दर्ज करें (Enter full name)');
      return;
    }
    if (!phoneInput.trim()) {
      setErrorMessage('कृपया मोबाइल नंबर दर्ज करें (Enter mobile number)');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: (usernameInput.trim() || fullNameInput.toLowerCase().replace(/\s+/g, '.')),
      fullName: fullNameInput.trim(),
      phoneNumber: phoneInput.trim(),
      role: roleInput,
      age: parseInt(ageInput, 10) || 70,
      language: selectedLanguage,
      stage: selectedStage,
      isLoggedIn: true,
      city: 'India',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
    };

    soundFx.playSuccess();
    onLogin(newUser);
    setSuccessMessage('नया खाता सफलतापूर्वक बनाया गया! (Account Created)');
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  const handleQuickAccountSelect = (account: UserAccount) => {
    soundFx.playChime();
    onLogin(account);
    setSuccessMessage(`${account.fullName} के रूप में लॉग इन हुआ!`);
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  const handleSaveProfileChanges = () => {
    onUpdateProfile({
      language: selectedLanguage,
      stage: selectedStage,
      name: fullNameInput || elderProfile.name,
      age: parseInt(ageInput, 10) || elderProfile.age
    });
    soundFx.playSuccess();
    setSuccessMessage('प्रोफ़ाइल और भाषा सेटिंग सहेजी गई! (Settings Saved)');
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  const filteredLanguages = INDIAN_22_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchLang.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchLang.toLowerCase()) ||
      l.region.toLowerCase().includes(searchLang.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        id="auth-modal-card"
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border transition-all duration-300 my-auto ${
          elderProfile.highContrast
            ? 'bg-black border-amber-400 text-amber-300'
            : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {currentUser?.isLoggedIn ? 'प्रोफ़ाइल व भाषा चयन (Profile & Settings)' : 'लॉग इन / साइन इन (Sign In / Login)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                22 भारतीय भाषाएं समर्थित (22 Indian Languages Supported)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="बंद करें (Close)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-zinc-800 px-5 pt-3 bg-slate-50 dark:bg-zinc-950/40">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            लॉग इन (Sign In)
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'signup'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            नया खाता (Sign Up)
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            22 भाषाएं व मोड
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              {successMessage}
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {/* Quick Demo Selector */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    1-क्लिक डेमो अकाउंट चुनें (Instant Switch Profile)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_PRESET_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickAccountSelect(acc)}
                      className="text-left p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 flex items-center space-x-2.5 transition-all shadow-sm group hover:scale-[1.02]"
                    >
                      <img
                        src={acc.avatarUrl}
                        alt={acc.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                          {acc.fullName}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                          {acc.role === 'senior' && '👴 वरिष्ठ नागरिक (Senior)'}
                          {acc.role === 'caregiver' && '👨‍💼 केयरगिवर / परिवार'}
                          {acc.role === 'doctor' && '🩺 डॉक्टर (MD)'}
                          {acc.role === 'asha' && '👩‍⚕️ आशा कार्यकर्ता'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Username/Phone + Password Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    यूज़रनेम या मोबाइल नंबर (Username or Mobile Number)
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="उदा. 9876543210 या ramesh.sharma"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    पासवर्ड / 4-अंकों का सीनियर पिन (Password / 4-Digit Senior PIN)
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Easy Numeric PIN Helpers for Seniors */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 mb-1.5 block">
                    आसान 4-अंकों का त्वरित पिन (Easy 1-Tap Quick PINs):
                  </span>
                  <div className="flex gap-2">
                    {['1234', '1111', '0000', '7777'].map((pin) => (
                      <button
                        key={pin}
                        type="button"
                        onClick={() => setPasswordInput(pin)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-slate-200 dark:border-zinc-700 transition-colors"
                      >
                        PIN: {pin}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-5 h-5" />
                  लॉग इन करें (Sign In)
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    पूरा नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="उदा. कैलाश नाथ / सुमन शर्मा"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    मोबाइल नंबर (Mobile Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    आयु / उम्र (Age in Years)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="115"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                    प्रोफ़ाइल भूमिका (Role)
                  </label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="senior">👴 वरिष्ठ नागरिक (Senior Citizen)</option>
                    <option value="caregiver">👨‍💼 परिवार / केयरगिवर (Family Caregiver)</option>
                    <option value="doctor">🩺 चिकित्सक / डॉक्टर (Doctor)</option>
                    <option value="asha">👩‍⚕️ आशा कार्यकर्ता (ASHA Worker)</option>
                  </select>
                </div>
              </div>

              {/* Password / PIN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  पासवर्ड या 4-अंकों का पिन (Create PIN / Password)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="उदा. 1234 या सुरक्षित पासवर्ड"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Preferred Language Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  पसंदीदा भाषा (Select Preferred Language - 22 Languages)
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguageCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {INDIAN_22_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name}) — {lang.region}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <User className="w-5 h-5" />
                खाता बनाएं व आगे बढ़ें (Register & Continue)
              </button>
            </form>
          )}

          {/* TAB 3: 22 INDIAN LANGUAGES & UI STAGES */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Language Search & Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-indigo-500" />
                    22 भारतीय भाषाएं (22 Constitutional Languages of India)
                  </label>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                    वर्तमान: {INDIAN_22_LANGUAGES.find((l) => l.code === selectedLanguage)?.nativeName}
                  </span>
                </div>

                <input
                  type="text"
                  value={searchLang}
                  onChange={(e) => setSearchLang(e.target.value)}
                  placeholder="भाषा खोजें (Search Language, e.g., Bengali, Tamil, Marathi, Punjabi)..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                  {filteredLanguages.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          onUpdateProfile({ language: lang.code });
                          soundFx.playChime();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{lang.nativeName}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-zinc-400'}`}>
                          {lang.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UI Stage Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  इंटरफ़ेस सरलीकरण मोड (Cognitive Stage Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStage(1)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedStage === 1
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                        : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <p className="text-xs font-bold">स्टेज 1 (Stage 1)</p>
                    <p className="text-[10px] opacity-80">पूर्ण दृश्य (Full View)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage(2)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedStage === 2
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                        : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <p className="text-xs font-bold">स्टेज 2 (Stage 2)</p>
                    <p className="text-[10px] opacity-80">4-कार्ड ग्रिड (4 Cards)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage(3)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedStage === 3
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                        : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <p className="text-xs font-bold">स्टेज 3 (Stage 3)</p>
                    <p className="text-[10px] opacity-80">2 बड़े बटन (Ultra-Simple)</p>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSaveProfileChanges}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  भाषा व सेटिंग्स लागू करें (Save & Apply)
                </button>

                {currentUser?.isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      soundFx.playChime();
                      onClose();
                    }}
                    className="py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-sm border border-rose-200 dark:border-rose-900 transition-all flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    लॉग आउट
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
