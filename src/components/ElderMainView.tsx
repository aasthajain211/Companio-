import React, { useState, useEffect } from 'react';
import { 
  ElderProfile, 
  ReminderItem, 
  AppView,
  SupportedLanguageCode 
} from '../types';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import { getTranslation, formatLocalDate, getDayPeriodLabel } from '../data/languages';
import confetti from 'canvas-confetti';
import { 
  Sun, 
  Volume2, 
  CheckCircle, 
  Users, 
  Music, 
  MessageCircleHeart, 
  Mic, 
  Pill, 
  Heart, 
  ShieldAlert, 
  Smile, 
  Meh, 
  Frown
} from 'lucide-react';

interface ElderMainViewProps {
  elderProfile: ElderProfile;
  reminders: ReminderItem[];
  setReminders: React.Dispatch<React.SetStateAction<ReminderItem[]>>;
  setCurrentView: (view: AppView) => void;
  onOpenSOS: () => void;
  isOffline: boolean;
}

export const ElderMainView: React.FC<ElderMainViewProps> = ({
  elderProfile,
  reminders,
  setReminders,
  setCurrentView,
  onOpenSOS,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [dayPeriodStr, setDayPeriodStr] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [moodFeedback, setMoodFeedback] = useState<string | null>(null);

  const isHighContrast = elderProfile.highContrast;
  const stage = elderProfile.stage;
  const currentLang = (elderProfile.language as SupportedLanguageCode) || 'hi';

  const t = (key: any) => getTranslation(currentLang, key);

  // Live time & localized date ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      const hours = now.getHours();
      
      const periodObj = getDayPeriodLabel(hours, currentLang);
      const localizedDate = formatLocalDate(now, currentLang);

      setCurrentTime(timeString);
      setCurrentDateStr(localizedDate);
      setDayPeriodStr(periodObj.label);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  const handleToggleReminder = (id: string) => {
    soundFx.playChime();
    setReminders(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.takenToday;
        if (nextState) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 }
          });
          speakElderVoice(`${t('doneMark')}! ${item.titleHindi}`);
        }
        return {
          ...item,
          takenToday: nextState,
          takenAt: nextState ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return item;
    }));
  };

  const handlePlayVoiceReminder = async (item: ReminderItem) => {
    setIsPlayingAudio(item.id);
    soundFx.playChime();
    const textToSpeak = item.audioPromptText || `${elderProfile.nickname || elderProfile.name}, ${item.titleHindi} - ${item.instructionsHindi}`;
    await speakElderVoice(textToSpeak);
    setIsPlayingAudio(null);
  };

  const handleSpeakTime = () => {
    const text = `${t('todayIs')} ${currentDateStr}, ${t('timeIs')} ${currentTime}. ${dayPeriodStr}!`;
    speakElderVoice(text);
  };

  const handleMoodSelect = (mood: string) => {
    const respectfulName = elderProfile.name ? `${elderProfile.name.split(' ')[0]}` : '';
    if (mood === 'happy') {
      const msg = `${t('happyFeedback')} (${respectfulName})`;
      setMoodFeedback(msg);
      speakElderVoice(msg);
    } else if (mood === 'calm') {
      const msg = `${t('calmFeedback')} (${respectfulName})`;
      setMoodFeedback(msg);
      speakElderVoice(msg);
    } else if (mood === 'sad') {
      const msg = `${t('sadFeedback')} (${respectfulName})`;
      setMoodFeedback(msg);
      speakElderVoice(msg);
    } else {
      const msg = `${t('tiredFeedback')} (${respectfulName})`;
      setMoodFeedback(msg);
      speakElderVoice(msg);
    }
  };

  // Find next pending reminder
  const pendingReminders = reminders.filter(r => !r.takenToday);
  const nextReminder = pendingReminders[0] || reminders[0];

  /* -------------------------------------------------------------------------- */
  /* STAGE 3: ADVANCED / ULTRA-SIMPLE 2-BUTTON MODE                             */
  /* -------------------------------------------------------------------------- */
  if (stage === 3) {
    return (
      <div className={`min-h-[82vh] p-4 sm:p-8 flex flex-col justify-between ${
        isHighContrast ? 'bg-black text-amber-300' : 'bg-amber-50/70 text-slate-900'
      }`}>
        {/* Giant Time & Greeting Header */}
        <div className={`p-6 sm:p-8 rounded-3xl text-center border-4 ${
          isHighContrast ? 'bg-zinc-900 border-amber-400' : 'bg-white border-amber-300 shadow-xl'
        }`}>
          <h1 className="text-3xl sm:text-5xl font-black mb-2 text-amber-900 dark:text-amber-300">
            {dayPeriodStr}, {elderProfile.nickname || elderProfile.name}!
          </h1>
          <div className="text-5xl sm:text-7xl font-black font-mono tracking-tight my-4 text-slate-800 dark:text-amber-200">
            {currentTime}
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-amber-300">
            {currentDateStr}
          </p>
          <button
            id="stage3-speak-time-btn"
            onClick={handleSpeakTime}
            className="mt-4 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center gap-2 mx-auto shadow-md transition-transform active:scale-95"
          >
            <Volume2 className="w-6 h-6" />
            <span>{t('speakTimeDay')}</span>
          </button>
        </div>

        {/* 2 Massive Color-Coded Touch Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
          <button
            id="stage3-companion-btn"
            onClick={() => setCurrentView('companion-dost')}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center gap-4 text-center shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border-4 border-emerald-300"
          >
            <MessageCircleHeart className="w-20 h-20 text-emerald-100 animate-pulse" />
            <span className="text-3xl sm:text-5xl font-black">
              1. {t('talkToDost')}
            </span>
            <span className="text-xl sm:text-2xl text-emerald-100 font-semibold">
              {t('talkToDostDesc')}
            </span>
          </button>

          <button
            id="stage3-emergency-btn"
            onClick={onOpenSOS}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center gap-4 text-center shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border-4 border-red-300"
          >
            <ShieldAlert className="w-20 h-20 text-red-100 animate-bounce" />
            <span className="text-3xl sm:text-5xl font-black">
              2. {t('callFamilySOS')}
            </span>
            <span className="text-xl sm:text-2xl text-red-100 font-semibold">
              {t('callFamilySOSDesc')}
            </span>
          </button>
        </div>

        {/* Quick Family Photos Button */}
        <div className="text-center">
          <button
            id="stage3-memory-btn"
            onClick={() => setCurrentView('memory-hub')}
            className="px-8 py-5 rounded-3xl bg-amber-500 hover:bg-amber-600 text-white font-black text-2xl flex items-center justify-center gap-3 mx-auto shadow-lg border-2 border-amber-300 transition-transform active:scale-95"
          >
            <Users className="w-8 h-8" />
            <span>{t('viewFamilyPhotos')} ({t('memoryAlbum')})</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* STAGE 2: MODERATE / SIMPLIFIED 4-CARD MODE                                 */
  /* -------------------------------------------------------------------------- */
  if (stage === 2) {
    return (
      <div className={`p-4 sm:p-6 space-y-6 max-w-6xl mx-auto ${
        isHighContrast ? 'text-amber-300' : 'text-slate-800'
      }`}>
        {/* Greeting Banner */}
        <div className={`p-5 sm:p-7 rounded-3xl border-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}>
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-amber-950 dark:text-amber-300">
              {dayPeriodStr}, {elderProfile.nickname || elderProfile.name}!
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-amber-200 font-semibold mt-1">
              {t('todayIs')} {currentDateStr} • {t('timeIs')}: <strong className="text-slate-900 dark:text-amber-400 font-mono text-xl">{currentTime}</strong>
            </p>
          </div>
          <button
            id="stage2-speak-time-btn"
            onClick={handleSpeakTime}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
            <span>{t('speakTimeDay')}</span>
          </button>
        </div>

        {/* Immediate Next Reminder Urgent Card */}
        {nextReminder && (
          <div className={`p-5 sm:p-6 rounded-3xl border-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isHighContrast 
              ? 'bg-zinc-900 border-emerald-400' 
              : nextReminder.takenToday 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-amber-100/80 border-amber-400'
          }`}>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                nextReminder.category === 'med' ? 'bg-rose-600' : nextReminder.category === 'water' ? 'bg-sky-600' : 'bg-emerald-600'
              }`}>
                {nextReminder.category === 'med' ? <Pill className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {t('timeIs')}: {nextReminder.time} ({nextReminder.period})
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-200 mt-1">
                  {nextReminder.titleHindi}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-amber-100 font-medium">
                  {nextReminder.instructionsHindi}
                </p>
                {nextReminder.recordedBy && (
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mt-0.5">
                    {t('voiceBy')}: {nextReminder.recordedBy}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                id="stage2-play-voice-btn"
                onClick={() => handlePlayVoiceReminder(nextReminder)}
                className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 border-2 shadow-sm ${
                  isPlayingAudio === nextReminder.id
                    ? 'bg-amber-400 text-slate-900 border-amber-500 animate-pulse'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>{t('hearFamilyVoice')}</span>
              </button>

              <button
                id="stage2-check-reminder-btn"
                onClick={() => handleToggleReminder(nextReminder.id)}
                className={`px-6 py-3 rounded-2xl font-black text-lg flex items-center gap-2 border-2 shadow-md transition-all ${
                  nextReminder.takenToday
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
                <span>{nextReminder.takenToday ? t('doneMark') : t('markDoneBtn')}</span>
              </button>
            </div>
          </div>
        )}

        {/* 4 Large High-Contrast Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. Medicines & Daily Routine */}
          <button
            id="stage2-meds-btn"
            onClick={() => setCurrentView('caregiver')}
            className={`p-6 sm:p-8 rounded-3xl border-3 text-left flex items-center gap-5 transition-all shadow-md hover:scale-[1.01] ${
              isHighContrast ? 'bg-zinc-900 border-amber-400' : 'bg-white border-rose-200 hover:border-rose-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Pill className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-rose-950 dark:text-amber-200">
                1. {t('todayMedicinesCard')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-amber-300 font-semibold mt-1">
                {t('todayMedicinesDesc')}
              </p>
            </div>
          </button>

          {/* 2. Family Memory Hub */}
          <button
            id="stage2-memory-btn"
            onClick={() => setCurrentView('memory-hub')}
            className={`p-6 sm:p-8 rounded-3xl border-3 text-left flex items-center gap-5 transition-all shadow-md hover:scale-[1.01] ${
              isHighContrast ? 'bg-zinc-900 border-amber-400' : 'bg-white border-amber-200 hover:border-amber-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Users className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-200">
                2. {t('viewFamilyPhotos')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-amber-300 font-semibold mt-1">
                {t('familyPhotosDesc')}
              </p>
            </div>
          </button>

          {/* 3. Old Melodies & Brain Games */}
          <button
            id="stage2-music-btn"
            onClick={() => setCurrentView('music-games')}
            className={`p-6 sm:p-8 rounded-3xl border-3 text-left flex items-center gap-5 transition-all shadow-md hover:scale-[1.01] ${
              isHighContrast ? 'bg-zinc-900 border-amber-400' : 'bg-white border-teal-200 hover:border-teal-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Music className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-amber-200">
                3. {t('retroMusicCard')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-amber-300 font-semibold mt-1">
                {t('retroMusicDesc')}
              </p>
            </div>
          </button>

          {/* 4. AI Companion Dost */}
          <button
            id="stage2-companion-btn"
            onClick={() => setCurrentView('companion-dost')}
            className={`p-6 sm:p-8 rounded-3xl border-3 text-left flex items-center gap-5 transition-all shadow-md hover:scale-[1.01] ${
              isHighContrast ? 'bg-zinc-900 border-amber-400' : 'bg-white border-indigo-200 hover:border-indigo-400'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageCircleHeart className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-amber-200">
                4. {t('voiceCompanion')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-amber-300 font-semibold mt-1">
                {t('talkToDostDesc')}
              </p>
            </div>
          </button>
        </div>

        {/* Emotion Check Quick Bar */}
        <div className={`p-5 rounded-3xl border-2 text-center shadow-sm ${
          isHighContrast ? 'bg-zinc-950 border-amber-500/50' : 'bg-white border-slate-200'
        }`}>
          <h4 className="text-lg font-bold text-slate-800 dark:text-amber-200 mb-3">
            {elderProfile.name ? `${elderProfile.name.split(' ')[0]}` : ''} - {t('howAreYouFeeling')}
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="mood-happy-btn"
              onClick={() => handleMoodSelect('happy')}
              className="px-5 py-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-base flex items-center gap-2 border border-emerald-300 transition-transform active:scale-95"
            >
              <Smile className="w-6 h-6 text-emerald-600" />
              <span>{t('feelingHappy')}</span>
            </button>
            <button
              id="mood-calm-btn"
              onClick={() => handleMoodSelect('calm')}
              className="px-5 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-base flex items-center gap-2 border border-sky-300 transition-transform active:scale-95"
            >
              <Sun className="w-6 h-6 text-sky-600" />
              <span>{t('feelingCalm')}</span>
            </button>
            <button
              id="mood-sad-btn"
              onClick={() => handleMoodSelect('sad')}
              className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-base flex items-center gap-2 border border-amber-300 transition-transform active:scale-95"
            >
              <Meh className="w-6 h-6 text-amber-600" />
              <span>{t('feelingSad')}</span>
            </button>
            <button
              id="mood-tired-btn"
              onClick={() => handleMoodSelect('tired')}
              className="px-5 py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-base flex items-center gap-2 border border-rose-300 transition-transform active:scale-95"
            >
              <Frown className="w-6 h-6 text-rose-600" />
              <span>{t('feelingTired')}</span>
            </button>
          </div>
          {moodFeedback && (
            <p className="mt-3 text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-zinc-900 p-3 rounded-xl inline-block border border-amber-200">
              {moodFeedback}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* STAGE 1: MILD / COMPREHENSIVE ELDER DASHBOARD                               */
  /* -------------------------------------------------------------------------- */
  return (
    <div className={`p-3 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Welcome Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-md flex flex-col md:flex-row items-center justify-between gap-6 ${
        isHighContrast 
          ? 'bg-zinc-950 border-amber-400' 
          : 'bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center gap-5">
          <img
            src={elderProfile.avatarUrl}
            alt={elderProfile.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white">
                {dayPeriodStr}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-amber-200">
                {elderProfile.homeAddress}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-amber-300 mt-1">
              {t('welcome')}, {elderProfile.nickname || elderProfile.name}!
            </h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-amber-200 font-semibold">
              {t('todayIs')} {currentDateStr} • <strong className="font-mono text-xl text-amber-700 dark:text-amber-300">{currentTime}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="stage1-speak-time-btn"
            onClick={handleSpeakTime}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-transform active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
            <span>{t('speakTimeDay')}</span>
          </button>

          <button
            id="stage1-open-sos-btn"
            onClick={onOpenSOS}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-red-500/30 transition-transform active:scale-95 animate-pulse"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>{t('emergencySOS')}</span>
          </button>
        </div>
      </div>

      {/* Routine & Medication Checklist Section */}
      <div className={`p-6 rounded-3xl border shadow-md space-y-4 ${
        isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-slate-900 dark:text-amber-300">
              <Pill className="w-6 h-6 text-rose-600" />
              {t('todaySchedule')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-amber-200">
              {t('routineSubtitle')}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {reminders.filter(r => r.takenToday).length} / {reminders.length} {t('completedCount')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                item.takenToday 
                  ? 'bg-emerald-50/70 border-emerald-300 text-slate-700' 
                  : isHighContrast 
                    ? 'bg-zinc-900 border-amber-400/80 text-amber-200' 
                    : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  id={`toggle-reminder-${item.id}`}
                  onClick={() => handleToggleReminder(item.id)}
                  className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    item.takenToday 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border-2 border-slate-400 hover:border-emerald-500'
                  }`}
                  title={item.takenToday ? 'Mark Incomplete' : 'Mark as Done'}
                >
                  {item.takenToday ? <CheckCircle className="w-5 h-5" /> : null}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {item.time} ({item.period})
                    </span>
                    {item.recordedBy && (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> {item.recordedBy}
                      </span>
                    )}
                  </div>
                  <h4 className={`text-base sm:text-lg font-bold mt-1 ${item.takenToday ? 'line-through text-slate-500' : 'text-slate-900 dark:text-amber-200'}`}>
                    {item.titleHindi}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-amber-100">
                    {item.instructionsHindi}
                  </p>
                  {item.takenAt && (
                    <span className="text-xs text-emerald-700 font-bold block mt-1">
                      ✓ {t('takenAtTime')}: {item.takenAt}
                    </span>
                  )}
                </div>
              </div>

              <button
                id={`play-voice-reminder-${item.id}`}
                onClick={() => handlePlayVoiceReminder(item)}
                className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                  isPlayingAudio === item.id 
                    ? 'bg-amber-400 text-black animate-pulse border-amber-500' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title="Hear audio reminder in family voice"
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Tiles to All Companion Services */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Memory Hub */}
        <button
          id="quick-memory-hub-btn"
          onClick={() => setCurrentView('memory-hub')}
          className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Users className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('memoryAlbum')}</span>
        </button>

        {/* Music & Radio */}
        <button
          id="quick-music-btn"
          onClick={() => setCurrentView('music-games')}
          className="p-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Music className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('musicRadio')}</span>
        </button>

        {/* AI Voice Companion */}
        <button
          id="quick-dost-btn"
          onClick={() => setCurrentView('companion-dost')}
          className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <MessageCircleHeart className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('voiceCompanion')}</span>
        </button>

        {/* Daily Voice Diary */}
        <button
          id="quick-diary-btn"
          onClick={() => setCurrentView('audio-diary')}
          className="p-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Mic className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('voiceDiaryTitle')}</span>
        </button>

        {/* Jan Aushadhi Kendra */}
        <button
          id="quick-jan-aushadhi-btn"
          onClick={() => setCurrentView('jan-aushadhi')}
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Pill className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('janAushadhi')}</span>
        </button>

        {/* ASHA & Doctor Connect */}
        <button
          id="quick-asha-btn"
          onClick={() => setCurrentView('asha-connect')}
          className="p-4 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center justify-center gap-2 text-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <Heart className="w-8 h-8" />
          <span className="font-bold text-sm sm:text-base leading-tight">{t('ashaConnect')}</span>
        </button>
      </div>

      {/* Emotion Check Card */}
      <div className={`p-5 rounded-3xl border text-center shadow-sm ${
        isHighContrast ? 'bg-zinc-950 border-amber-500/50' : 'bg-white border-slate-200'
      }`}>
        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-amber-200 mb-2">
          {t('howAreYouFeeling')}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="stage1-mood-happy-btn"
            onClick={() => handleMoodSelect('happy')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm flex items-center gap-1.5 border border-emerald-300 transition-transform active:scale-95"
          >
            <Smile className="w-5 h-5 text-emerald-600" />
            <span>{t('feelingHappy')}</span>
          </button>
          <button
            id="stage1-mood-calm-btn"
            onClick={() => handleMoodSelect('calm')}
            className="px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm flex items-center gap-1.5 border border-sky-300 transition-transform active:scale-95"
          >
            <Sun className="w-5 h-5 text-sky-600" />
            <span>{t('feelingCalm')}</span>
          </button>
          <button
            id="stage1-mood-sad-btn"
            onClick={() => handleMoodSelect('sad')}
            className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm flex items-center gap-1.5 border border-amber-300 transition-transform active:scale-95"
          >
            <Meh className="w-5 h-5 text-amber-600" />
            <span>{t('feelingSad')}</span>
          </button>
          <button
            id="stage1-mood-tired-btn"
            onClick={() => handleMoodSelect('tired')}
            className="px-4 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-sm flex items-center gap-1.5 border border-rose-300 transition-transform active:scale-95"
          >
            <Frown className="w-5 h-5 text-rose-600" />
            <span>{t('feelingTired')}</span>
          </button>
        </div>
        {moodFeedback && (
          <p className="mt-3 text-sm font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-zinc-900 p-2.5 rounded-xl inline-block border border-amber-200">
            {moodFeedback}
          </p>
        )}
      </div>
    </div>
  );
};
