import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  ElderProfile, 
  ReminderItem, 
  MemoryMember, 
  HealthVitalLog, 
  SmartHomeDevice,
  UserAccount,
  SupportedLanguageCode
} from './types';
import { 
  initialElderProfile, 
  initialReminders, 
  initialMemoryMembers, 
  initialHealthVitals, 
  initialSmartHomeDevices 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AuthModal, DEMO_PRESET_ACCOUNTS } from './components/AuthModal';
import { ElderMainView } from './components/ElderMainView';
import { MemoryHub } from './components/MemoryHub';
import { BrainAndMusicGames } from './components/BrainAndMusicGames';
import { CaregiverPortal } from './components/CaregiverPortal';
import { VirtualCompanionChat } from './components/VirtualCompanionChat';
import { JanAushadhiKendra } from './components/JanAushadhiKendra';
import { AshaWorkerConnect } from './components/AshaWorkerConnect';
import { TelemedicinePortal } from './components/TelemedicinePortal';
import { DoctorCaregiverSharedDashboard } from './components/DoctorCaregiverSharedDashboard';
import { AudioDiary } from './components/AudioDiary';
import { GeofenceMap } from './components/GeofenceMap';
import { soundFx } from './utils/audioUtils';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('elder');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(DEMO_PRESET_ACCOUNTS[0]);
  const [elderProfile, setElderProfile] = useState<ElderProfile>(() => {
    const saved = localStorage.getItem('companio_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return initialElderProfile;
  });
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [members, setMembers] = useState<MemoryMember[]>(initialMemoryMembers);
  const [vitals, setVitals] = useState<HealthVitalLog[]>(initialHealthVitals);
  const [smartDevices, setSmartDevices] = useState<SmartHomeDevice[]>(initialSmartHomeDevices);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Play audio greeting on initial load
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      soundFx.playChime();
    }, 800);
    return () => clearTimeout(greetingTimer);
  }, []);

  // Sync profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('companio_profile', JSON.stringify(elderProfile));
    } catch (e) {
      // ignore
    }
  }, [elderProfile]);

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setElderProfile(prev => ({
      ...prev,
      name: user.fullName,
      nickname: user.fullName.split(' ')[0] + ' जी',
      age: user.age || prev.age,
      language: user.language || prev.language,
      stage: user.stage || prev.stage
    }));

    // If caregiver/doctor logged in, switch to their appropriate view
    if (user.role === 'caregiver') {
      setCurrentView('caregiver');
    } else if (user.role === 'doctor') {
      setCurrentView('doctor');
    } else if (user.role === 'asha') {
      setCurrentView('asha-connect');
    } else {
      setCurrentView('elder');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setElderProfile(initialElderProfile);
    setCurrentView('elder');
  };

  const handleUpdateProfile = (updatedProfile: Partial<ElderProfile>) => {
    setElderProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        fullName: updatedProfile.name || prev.fullName,
        language: (updatedProfile.language as SupportedLanguageCode) || prev.language,
        stage: updatedProfile.stage || prev.stage
      } : null);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      elderProfile.highContrast 
        ? 'bg-black text-amber-300 font-sans' 
        : 'bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-100 font-sans'
    }`}>
      {/* Universal Senior Care Navbar with 22 Languages & Auth */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        elderProfile={elderProfile}
        setElderProfile={setElderProfile}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
      />

      {/* Main Dynamic Viewport */}
      <main className="pb-16 pt-2">
        {currentView === 'elder' && (
          <ElderMainView
            elderProfile={elderProfile}
            reminders={reminders}
            setReminders={setReminders}
            setCurrentView={setCurrentView}
            onOpenSOS={() => setIsSOSModalOpen(true)}
            isOffline={isOffline}
          />
        )}

        {currentView === 'memory-hub' && (
          <MemoryHub
            members={members}
            setMembers={setMembers}
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'music-games' && (
          <BrainAndMusicGames
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'companion-dost' && (
          <VirtualCompanionChat
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'caregiver' && (
          <CaregiverPortal
            elderProfile={elderProfile}
            setElderProfile={setElderProfile}
            reminders={reminders}
            setReminders={setReminders}
            smartDevices={smartDevices}
            setSmartDevices={setSmartDevices}
            onNavigateToView={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'jan-aushadhi' && (
          <JanAushadhiKendra
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'asha-connect' && (
          <AshaWorkerConnect
            elderProfile={elderProfile}
            vitals={vitals}
            setVitals={setVitals}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'telemedicine' && (
          <TelemedicinePortal
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
            onNavigateToJanAushadhi={() => setCurrentView('jan-aushadhi')}
          />
        )}

        {currentView === 'doctor' && (
          <DoctorCaregiverSharedDashboard
            elderProfile={elderProfile}
            vitals={vitals}
            reminders={reminders}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'audio-diary' && (
          <AudioDiary
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'geofence' && (
          <GeofenceMap
            elderProfile={elderProfile}
            onBackToHome={() => setCurrentView('elder')}
          />
        )}

        {currentView === 'smart-home' && (
          <CaregiverPortal
            elderProfile={elderProfile}
            setElderProfile={setElderProfile}
            reminders={reminders}
            setReminders={setReminders}
            smartDevices={smartDevices}
            setSmartDevices={setSmartDevices}
            onNavigateToView={(view) => setCurrentView(view)}
          />
        )}
      </main>

      {/* 1-Tap Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        elderProfile={elderProfile}
      />

      {/* User Login, Registration & 22 Languages Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
        elderProfile={elderProfile}
      />
    </div>
  );
}
