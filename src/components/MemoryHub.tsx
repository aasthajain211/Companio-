import React, { useState } from 'react';
import { MemoryMember, ElderProfile } from '../types';
import { soundFx, speakElderVoice } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Volume2, 
  PhoneCall, 
  Sparkles, 
  Heart, 
  CheckCircle, 
  XCircle, 
  Plus, 
  HelpCircle, 
  ArrowLeft,
  Calendar
} from 'lucide-react';

interface MemoryHubProps {
  members: MemoryMember[];
  setMembers: React.Dispatch<React.SetStateAction<MemoryMember[]>>;
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

export const MemoryHub: React.FC<MemoryHubProps> = ({
  members,
  setMembers,
  elderProfile,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'album' | 'quiz'>('album');
  const [playingMemberId, setPlayingMemberId] = useState<string | null>(null);
  
  // Quiz Game State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // New Memory Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newRelationHindi, setNewRelationHindi] = useState('');
  const [newVoiceText, setNewVoiceText] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const isHighContrast = elderProfile.highContrast;

  const handlePlayVoice = async (member: MemoryMember) => {
    setPlayingMemberId(member.id);
    soundFx.playChime();
    const textToSpeak = member.voiceMessageText || `नमस्ते दादाजी, मैं ${member.name} हूँ।`;
    await speakElderVoice(textToSpeak);
    setPlayingMemberId(null);
  };

  const handleStartQuiz = () => {
    setActiveTab('quiz');
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizFeedback(null);
    setQuizScore(0);
  };

  const currentQuizMember = members[quizIndex % members.length];
  
  // Generate 3 choices for the quiz (including correct one)
  const getQuizOptions = () => {
    if (!currentQuizMember) return [];
    const otherMembers = members.filter(m => m.id !== currentQuizMember.id);
    const shuffledOthers = [...otherMembers].sort(() => 0.5 - Math.random()).slice(0, 2);
    const allChoices = [currentQuizMember, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return allChoices;
  };

  const handleSelectQuizAnswer = (selectedMember: MemoryMember) => {
    if (quizFeedback !== null) return; // already answered this turn

    setQuizSelectedOption(selectedMember.id);
    if (selectedMember.id === currentQuizMember.id) {
      soundFx.playChime();
      confetti({ particleCount: 50, spread: 60 });
      setQuizFeedback('correct');
      setQuizScore(prev => prev + 1);
      speakElderVoice(`अरे वाह! बिल्कुल सही पहचाना। यह आपके ${currentQuizMember.relationHindi} हैं।`);
    } else {
      setQuizFeedback('wrong');
      speakElderVoice(`कोई बात नहीं दादाजी, यह ${currentQuizMember.name} हैं (${currentQuizMember.relationHindi})।`);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizIndex(prev => prev + 1);
    setQuizSelectedOption(null);
    setQuizFeedback(null);
  };

  const handleSaveNewMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRelation) return;

    const newMember: MemoryMember = {
      id: `mem-${Date.now()}`,
      name: newName,
      relation: newRelation,
      relationHindi: newRelationHindi || newRelation,
      photoUrl: newPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      voiceMessageText: newVoiceText || `नमस्ते, मैं ${newName}!`,
      storyCues: [`परिवार के प्रिय सदस्य: ${newName}`],
      lastVisited: 'Just added'
    };

    setMembers(prev => [newMember, ...prev]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewRelation('');
    setNewRelationHindi('');
    setNewVoiceText('');
    setNewPhotoUrl('');
    soundFx.playChime();
    speakElderVoice(`नई याद और परिवार के सदस्य ${newName} को सफलतापूर्वक जोड़ दिया गया है।`);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-memory-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black flex items-center gap-2 text-slate-900 dark:text-amber-300">
              <Users className="w-8 h-8 text-amber-500" />
              परिवार की यादें (Family Memory Hub)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-200">
              अपने बच्चों और पोते-पोतियों के फोटो, उनकी आवाजें और प्यारी बातें
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="toggle-memory-album-tab"
            onClick={() => setActiveTab('album')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'album' 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>फोटो एल्बम</span>
          </button>

          <button
            id="toggle-memory-quiz-tab"
            onClick={handleStartQuiz}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all ${
              activeTab === 'quiz' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>पहचानो कौन? (Quiz Game)</span>
          </button>

          <button
            id="add-memory-photo-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">नया फोटो जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Photo Album & Voice Messages */}
      {activeTab === 'album' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className={`rounded-3xl overflow-hidden border-2 shadow-lg transition-transform hover:scale-[1.01] flex flex-col justify-between ${
                isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-amber-200'
              }`}
            >
              {/* Photo Banner with Tag */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-200 overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                  <span>{member.relation}</span>
                </div>
                {member.lastVisited && (
                  <div className="absolute bottom-3 right-3 bg-amber-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {member.lastVisited}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-amber-200">
                    {member.name}
                  </h3>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                    {member.relationHindi}
                  </p>

                  {/* Story Cues */}
                  <div className="mt-3 space-y-1.5">
                    {member.storyCues.map((cue, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-slate-600 dark:text-amber-100 flex items-start gap-1.5">
                        <span className="text-amber-500 font-black">•</span>
                        <span>{cue}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Voice Message & Call Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-700">
                    <p className="text-xs italic text-slate-700 dark:text-amber-100 line-clamp-2">
                      "{member.voiceMessageText}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`play-voice-member-${member.id}`}
                      onClick={() => handlePlayVoice(member)}
                      className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                        playingMemberId === member.id
                          ? 'bg-amber-400 text-black border border-amber-500 animate-pulse'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>आवाज सुनें</span>
                    </button>

                    {member.phoneNumber ? (
                      <a
                        id={`call-member-${member.id}`}
                        href={`tel:${member.phoneNumber}`}
                        className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>कॉल करें</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="p-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>घर पर साथ</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 2: Interactive Memory Quiz Game ("पहचानो कौन?") */}
      {activeTab === 'quiz' && currentQuizMember && (
        <div className={`p-6 sm:p-10 rounded-3xl border-3 shadow-2xl max-w-3xl mx-auto text-center space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-indigo-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-900 font-black text-sm">
              प्रश्न {quizIndex + 1} • स्कोर: {quizScore}
            </span>
            <button
              onClick={() => setActiveTab('album')}
              className="text-sm font-bold text-slate-500 hover:text-slate-800"
            >
              एल्बम पर वापस जाएं ✕
            </button>
          </div>

          <div className="w-48 h-48 sm:w-60 sm:h-60 mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-amber-400">
            <img
              src={currentQuizMember.photoUrl}
              alt="Quiz Memory"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-200">
              बताइए, ये कौन हैं? (Who is this?)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-100 mt-1">
              सही नाम और रिश्ते पर टैप करें
            </p>
          </div>

          {/* 3 Choice Buttons */}
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
            {getQuizOptions().map((opt) => {
              const isSelected = quizSelectedOption === opt.id;
              const isCorrect = opt.id === currentQuizMember.id;
              let btnStyle = isHighContrast 
                ? 'bg-zinc-900 text-amber-200 border-amber-400 hover:bg-zinc-800' 
                : 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-indigo-50 hover:border-indigo-400';

              if (quizFeedback !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-400 scale-[1.02] shadow-lg';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-400';
                }
              }

              return (
                <button
                  key={opt.id}
                  id={`quiz-option-${opt.id}`}
                  onClick={() => handleSelectQuizAnswer(opt)}
                  disabled={quizFeedback !== null}
                  className={`p-4 rounded-2xl border-2 font-black text-lg sm:text-xl flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <div className="text-left">
                    <span>{opt.name}</span>
                    <span className="block text-xs sm:text-sm font-medium opacity-80">
                      ({opt.relationHindi})
                    </span>
                  </div>
                  {quizFeedback !== null && isCorrect && (
                    <CheckCircle className="w-7 h-7 text-white animate-bounce" />
                  )}
                  {quizFeedback !== null && isSelected && !isCorrect && (
                    <XCircle className="w-7 h-7 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizFeedback && (
            <div className="pt-4 space-y-4 animate-fade-in">
              <div className={`p-4 rounded-2xl ${
                quizFeedback === 'correct' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <p className="text-lg font-bold">
                  {quizFeedback === 'correct' 
                    ? '🎉 शाबाश दादाजी! बहुत बढ़िया याददाश्त!' 
                    : `❤️ ये आपके ${currentQuizMember.relationHindi} हैं।`}
                </p>
              </div>

              <button
                id="next-quiz-question-btn"
                onClick={handleNextQuizQuestion}
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-lg shadow-indigo-500/30"
              >
                अगला फोटो देखें (Next) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New Family Memory Photo */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-amber-300 shadow-2xl">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              परिवार का नया फोटो और याद जोड़ें
            </h3>
            
            <form onSubmit={handleSaveNewMemory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  सदस्य का नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. अमित शर्मा (बड़ा पोता)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    रिश्ता (Relation English)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grandson / Pota"
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    रिश्ता हिंदी में
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. छोटा पोता"
                    value={newRelationHindi}
                    onChange={(e) => setNewRelationHindi(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  फोटो का लिंक (Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  प्यारा वॉयस मैसेज (Voice Note Prompt)
                </label>
                <textarea
                  rows={2}
                  placeholder="उदा. नमस्ते दादाजी! मैं अमित बोल रहा हूँ, शाम को आपसे बात करूँगा।"
                  value={newVoiceText}
                  onChange={(e) => setNewVoiceText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-bold"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black shadow-md"
                >
                  सुरक्षित करें (Save Memory)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
