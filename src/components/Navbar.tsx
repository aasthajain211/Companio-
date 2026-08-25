import React from 'react';
import { 
  AppView, 
  UIStage, 
  ElderProfile,
  UserAccount,
  SupportedLanguageCode
} from '../types';
import { INDIAN_22_LANGUAGES, getTranslation } from '../data/languages';
import { 
  Heart, 
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Music, 
  MessageCircleHeart, 
  Pill, 
  MapPin, 
  WifiOff, 
  Sparkles, 
  Mic, 
  Sliders, 
  Eye, 
  Home,
  Globe2,
  UserCircle,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  elderProfile: ElderProfile;
  setElderProfile: React.Dispatch<React.SetStateAction<ElderProfile>>;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onOpenSOS: () => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  elderProfile,
  setElderProfile,
  currentUser,
  onOpenAuthModal,
  onOpenSOS,
  isOffline,
  setIsOffline
}) => {
  const isHighContrast = elderProfile.highContrast;
  const currentLang = (elderProfile.language as SupportedLanguageCode) || 'hi';
  const langObj = INDIAN_22_LANGUAGES.find(l => l.code === currentLang) || INDIAN_22_LANGUAGES[0];

  const t = (key: any) => getTranslation(currentLang, key);

  const toggleContrast = () => {
    setElderProfile(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const handleStageChange = (stage: UIStage) => {
    setElderProfile(prev => ({ ...prev, stage }));
  };

  const toggleFontSize = () => {
    const nextSize = elderProfile.fontSize === 'normal' 
      ? 'large' 
      : elderProfile.fontSize === 'large' 
        ? 'extra-large' 
        : 'normal';
    setElderProfile(prev => ({ ...prev, fontSize: nextSize }));
  };

  return (
    <header className={`sticky top-0 z-40 shadow-md transition-colors ${
      isHighContrast 
        ? 'bg-black text-amber-300 border-b-2 border-amber-400' 
        : 'bg-white text-slate-800 border-b border-slate-200'
    }`}>
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & User Profile Badge */}
        <div className="flex items-center gap-3">
          <button 
            id="nav-logo-btn"
            onClick={() => setCurrentView('elder')}
            className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm ${
              isHighContrast ? 'bg-amber-400 text-black' : 'bg-gradient-to-br from-amber-500 to-rose-500 text-white'
            }`}>
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight flex items-center gap-1.5 ${
                isHighContrast ? 'text-amber-300' : 'text-slate-900'
              }`}>
                Companio
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  Care
                </span>
              </span>
              <p className={`text-xs ${isHighContrast ? 'text-amber-200' : 'text-slate-500'}`}>
                {currentUser?.fullName ? currentUser.fullName : elderProfile.name}
              </p>
            </div>
          </button>
        </div>

        {/* Center Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            id="tab-elder-btn"
            onClick={() => setCurrentView('elder')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'elder' 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Home className="w-4 h-4" />
            {t('seniorMode')}
          </button>
          <button
            id="tab-caregiver-btn"
            onClick={() => setCurrentView('caregiver')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'caregiver' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            {t('caregiverPortal')}
          </button>
          <button
            id="tab-doctor-btn"
            onClick={() => setCurrentView('doctor')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'doctor' 
                ? 'bg-teal-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            {t('doctorMode')}
          </button>
          <button
            id="tab-jan-aushadhi-btn"
            onClick={() => setCurrentView('jan-aushadhi')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'jan-aushadhi' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Pill className="w-4 h-4" />
            {t('janAushadhi')}
          </button>
        </div>

        {/* Accessibility, 22 Languages & Auth Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* 22 Indian Languages Switcher Button */}
          <button
            id="language-switcher-btn"
            onClick={onOpenAuthModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1.5 shadow-sm transition-all"
            title="भारतीय 22 भाषाएं चुनें (Select 22 Indian Languages)"
          >
            <Globe2 className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">{langObj.nativeName}</span>
            <span className="hidden sm:inline text-[10px] text-indigo-500 font-normal">({langObj.code.toUpperCase()})</span>
          </button>

          {/* User Account / Login Button */}
          <button
            id="user-auth-btn"
            onClick={onOpenAuthModal}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all shadow-sm ${
              currentUser?.isLoggedIn
                ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
            title="लॉग इन / अकाउंट सेटिंग्स (Sign In / Account Settings)"
          >
            {currentUser?.isLoggedIn ? (
              <>
                <UserCircle className="w-4 h-4 text-amber-600" />
                <span className="hidden md:inline truncate max-w-[110px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5 rounded font-mono">
                  {currentUser.role === 'senior' ? t('seniorMode') : currentUser.role === 'caregiver' ? t('caregiverMode') : currentUser.role === 'doctor' ? t('doctorMode') : t('ashaMode')}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('signIn')}</span>
              </>
            )}
          </button>

          {/* Stage Selector Pill */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 px-1">Stage:</span>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                id={`stage-select-${s}`}
                onClick={() => handleStageChange(s as UIStage)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  elderProfile.stage === s
                    ? 'bg-amber-500 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
                title={`Stage ${s}: ${s === 1 ? t('stage1') : s === 2 ? t('stage2') : t('stage3')}`}
              >
                S{s}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle */}
          <button
            id="high-contrast-toggle-btn"
            onClick={toggleContrast}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors ${
              isHighContrast 
                ? 'bg-amber-400 text-black border-amber-300 ring-2 ring-amber-300' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title={t('highContrast')}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden xl:inline">{t('highContrast')}</span>
          </button>

          {/* Font Size Button */}
          <button
            id="font-size-toggle-btn"
            onClick={toggleFontSize}
            className="p-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            title={`${t('fontSize')}: ${elderProfile.fontSize}`}
          >
            <span className="text-sm font-black">
              {elderProfile.fontSize === 'normal' ? 'A' : elderProfile.fontSize === 'large' ? 'A+' : 'A++'}
            </span>
          </button>

          {/* Offline Mode Toggle */}
          <button
            id="offline-toggle-btn"
            onClick={() => setIsOffline(!isOffline)}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
              isOffline
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Offline / Live Simulation"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            <span className="hidden xl:inline">{isOffline ? 'Offline' : 'Live'}</span>
          </button>

          {/* Emergency SOS Big Button */}
          <button
            id="emergency-sos-top-btn"
            onClick={onOpenSOS}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-red-400 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar for Direct Features */}
      <div className={`px-3 py-1.5 border-t overflow-x-auto flex items-center gap-2 scrollbar-none text-xs sm:text-sm ${
        isHighContrast ? 'border-amber-500/40 bg-zinc-950' : 'border-slate-100 bg-slate-50'
      }`}>
        <span className="text-slate-400 font-medium whitespace-nowrap pl-1">{t('services')}:</span>
        <button
          id="subnav-elder"
          onClick={() => setCurrentView('elder')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
            currentView === 'elder' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('welcome')}
        </button>
        <button
          id="subnav-memory"
          onClick={() => setCurrentView('memory-hub')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'memory-hub' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {t('memoryAlbum')}
        </button>
        <button
          id="subnav-music"
          onClick={() => setCurrentView('music-games')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'music-games' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          {t('musicRadio')}
        </button>
        <button
          id="subnav-companion"
          onClick={() => setCurrentView('companion-dost')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'companion-dost' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MessageCircleHeart className="w-3.5 h-3.5" />
          {t('voiceCompanion')}
        </button>
        <button
          id="subnav-diary"
          onClick={() => setCurrentView('audio-diary')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'audio-diary' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          {t('voiceDiaryTitle')}
        </button>
        <button
          id="subnav-geofence"
          onClick={() => setCurrentView('geofence')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'geofence' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {t('geofenceTitle')}
        </button>
        <button
          id="subnav-jan-aushadhi"
          onClick={() => setCurrentView('jan-aushadhi')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'jan-aushadhi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          {t('janAushadhi')}
        </button>
        <button
          id="subnav-asha"
          onClick={() => setCurrentView('asha-connect')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'asha-connect' ? 'bg-pink-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          {t('ashaConnect')}
        </button>
        <button
          id="subnav-telemedicine"
          onClick={() => setCurrentView('telemedicine')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'telemedicine' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          {t('telemedicine')}
        </button>
        <button
          id="subnav-smart-home"
          onClick={() => setCurrentView('smart-home')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'smart-home' ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {t('smartHomeTitle')}
        </button>
        <button
          id="subnav-caregiver"
          onClick={() => setCurrentView('caregiver')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'caregiver' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          {t('caregiverPortal')}
        </button>
        <button
          id="subnav-doctor"
          onClick={() => setCurrentView('doctor')}
          className={`px-3 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-colors ${
            currentView === 'doctor' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          {t('doctorReportTitle')}
        </button>
      </div>
    </header>
  );
};
