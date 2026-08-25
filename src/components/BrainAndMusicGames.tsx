import React, { useState, useEffect, useRef } from 'react';
import { ClassicSong, ElderProfile } from '../types';
import { initialSongs, colorBellsData, initialWordPuzzles } from '../data/mockData';
import { soundFx, speakElderVoice, melodyPlayer, stopSpeaking } from '../utils/audioUtils';
import confetti from 'canvas-confetti';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Check, 
  Brain, 
  Wind, 
  Tv, 
  Bell, 
  Puzzle, 
  HelpCircle, 
  Lightbulb, 
  Award, 
  Radio, 
  Repeat, 
  Sliders 
} from 'lucide-react';

interface BrainAndMusicGamesProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

interface TileItem {
  id: number;
  icon: string;
  label: string;
  matched: boolean;
}

const TILE_PAIRS = [
  { icon: '🪔', label: 'दीया (Diya)' },
  { icon: '🦚', label: 'मोर (Peacock)' },
  { icon: '🌺', label: 'कमल (Lotus)' },
  { icon: '☕', label: 'गरम चाय (Tea)' },
  { icon: '🥭', label: 'आम (Mango)' },
  { icon: '🪕', label: 'सितार (Sitar)' },
];

export const BrainAndMusicGames: React.FC<BrainAndMusicGamesProps> = ({
  elderProfile,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'radio' | 'memory-match' | 'musical-bells' | 'word-puzzle' | 'trivia' | 'breathing'>('radio');

  // -------------------------------------------------------------
  // RADIO & MUSIC PLAYER STATE
  // -------------------------------------------------------------
  const [songs] = useState<ClassicSong[]>(initialSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songProgress, setSongProgress] = useState<number>(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(0);
  const [playbackMode, setPlaybackMode] = useState<'melody' | 'stream'>('melody');
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [songCategoryFilter, setSongCategoryFilter] = useState<'all' | 'Calm' | 'Devotional' | 'Joyful' | 'Nostalgic'>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // -------------------------------------------------------------
  // GAME 1: MEMORY MATCH STATE
  // -------------------------------------------------------------
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [selectedTileIndexes, setSelectedTileIndexes] = useState<number[]>([]);
  const [isMatchProcessing, setIsMatchProcessing] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [matchMoves, setMatchMoves] = useState<number>(0);

  // -------------------------------------------------------------
  // GAME 2 (NEW): MUSICAL COLOR BELLS (SIMON SAYS) STATE
  // -------------------------------------------------------------
  const [bellSequence, setBellSequence] = useState<number[]>([]);
  const [userBellStep, setUserBellStep] = useState<number>(0);
  const [bellLevel, setBellLevel] = useState<number>(1);
  const [isBellPlayingSeq, setIsBellPlayingSeq] = useState<boolean>(false);
  const [activeLitBell, setActiveLitBell] = useState<number | null>(null);
  const [bellGameScore, setBellGameScore] = useState<number>(0);
  const [bellGameStatus, setBellGameStatus] = useState<'idle' | 'playing' | 'success' | 'failed'>('idle');

  // -------------------------------------------------------------
  // GAME 3 (NEW): DESI WORD & PICTURE PUZZLE STATE
  // -------------------------------------------------------------
  const [wordPuzzles] = useState(initialWordPuzzles);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [selectedWordLetters, setSelectedWordLetters] = useState<string[]>([]);
  const [wordPuzzleSolved, setWordPuzzleSolved] = useState<boolean>(false);
  const [showWordHint, setShowWordHint] = useState<boolean>(false);

  // -------------------------------------------------------------
  // GAME 4: BREATHING CIRCLE (PRANAYAMA)
  // -------------------------------------------------------------
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // -------------------------------------------------------------
  // GAME 5: NOSTALGIA TRIVIA
  // -------------------------------------------------------------
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaSelectedAnswer, setTriviaSelectedAnswer] = useState<number | null>(null);

  const isHighContrast = elderProfile.highContrast;
  const currentSong = songs[currentSongIndex] || songs[0];

  // -------------------------------------------------------------
  // INITIALIZATIONS
  // -------------------------------------------------------------
  useEffect(() => {
    initializeMemoryGame();
    return () => {
      melodyPlayer.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeaking();
    };
  }, []);

  // Update volume in synth and audio tag
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume / 100;
    melodyPlayer.setVolume(effectiveVol);
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
  }, [volume, isMuted]);

  // -------------------------------------------------------------
  // REAL AUDIO & MELODY PLAYBACK ENGINE
  // -------------------------------------------------------------
  const playCurrentSong = (song: ClassicSong) => {
    setIsPlayingSong(true);
    setSongProgress(0);
    setActiveLyricIndex(0);

    if (playbackMode === 'melody') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      melodyPlayer.playSong(song.id, (pct, lyricIdx) => {
        setSongProgress(pct);
        if (lyricIdx !== undefined) {
          setActiveLyricIndex(lyricIdx);
        }
      });
    } else {
      melodyPlayer.stop();
      if (audioRef.current && song.audioSnippetUrl) {
        audioRef.current.src = song.audioSnippetUrl;
        audioRef.current.play().catch(() => {
          // Fallback to melody player if stream audio is blocked/offline
          melodyPlayer.playSong(song.id, (pct, lyricIdx) => {
            setSongProgress(pct);
            if (lyricIdx !== undefined) setActiveLyricIndex(lyricIdx);
          });
        });
      }
    }
  };

  const handleTogglePlaySong = () => {
    if (!isPlayingSong) {
      soundFx.playChime();
      playCurrentSong(currentSong);
    } else {
      setIsPlayingSong(false);
      melodyPlayer.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleNextSong = () => {
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
    playCurrentSong(songs[nextIdx]);
  };

  const handlePrevSong = () => {
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    playCurrentSong(songs[prevIdx]);
  };

  const handleTellSongStory = () => {
    if (currentSong.singerStoryHindi) {
      speakElderVoice(`${currentSong.title} के बारे में: ${currentSong.singerStoryHindi}`);
    }
  };

  // -------------------------------------------------------------
  // GAME 1: MEMORY MATCH LOGIC
  // -------------------------------------------------------------
  const initializeMemoryGame = () => {
    const duplicated = [...TILE_PAIRS, ...TILE_PAIRS];
    const shuffled = duplicated
      .map((item, index) => ({ ...item, id: index, matched: false }))
      .sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setSelectedTileIndexes([]);
    setGameWon(false);
    setMatchMoves(0);
  };

  const handleTileClick = (index: number) => {
    if (isMatchProcessing || tiles[index].matched || selectedTileIndexes.includes(index)) return;

    soundFx.playBellNote(440, 0.4);
    const newSelected = [...selectedTileIndexes, index];
    setSelectedTileIndexes(newSelected);

    if (newSelected.length === 2) {
      setMatchMoves((prev) => prev + 1);
      setIsMatchProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const firstTile = tiles[firstIdx];
      const secondTile = tiles[secondIdx];

      if (firstTile.icon === secondTile.icon) {
        soundFx.playSuccess();
        setTiles((prev) =>
          prev.map((t, idx) => (idx === firstIdx || idx === secondIdx ? { ...t, matched: true } : t))
        );
        setSelectedTileIndexes([]);
        setIsMatchProcessing(false);

        const allMatched = tiles.filter((t) => !t.matched).length <= 2;
        if (allMatched) {
          setGameWon(true);
          confetti({ particleCount: 70, spread: 80 });
          speakElderVoice('शानदार! आपने सारे जोड़े ढूंढ निकाले!');
        }
      } else {
        setTimeout(() => {
          setSelectedTileIndexes([]);
          setIsMatchProcessing(false);
        }, 1100);
      }
    }
  };

  // -------------------------------------------------------------
  // GAME 2: MUSICAL COLOR BELLS (SIMON SAYS) LOGIC
  // -------------------------------------------------------------
  const startNewBellGame = () => {
    setBellLevel(1);
    setBellGameScore(0);
    setBellGameStatus('playing');
    const firstSeq = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    setBellSequence(firstSeq);
    setUserBellStep(0);
    playBellSequence(firstSeq);
  };

  const playBellSequence = (seq: number[]) => {
    setIsBellPlayingSeq(true);
    let step = 0;

    const interval = setInterval(() => {
      if (step < seq.length) {
        const bellId = seq[step];
        const bell = colorBellsData[bellId];
        setActiveLitBell(bellId);
        soundFx.playBellNote(bell.freq, 0.9);

        setTimeout(() => {
          setActiveLitBell(null);
        }, 500);

        step++;
      } else {
        clearInterval(interval);
        setIsBellPlayingSeq(false);
        setUserBellStep(0);
      }
    }, 850);
  };

  const handleUserBellTap = (bellId: number) => {
    if (isBellPlayingSeq || bellGameStatus !== 'playing') return;

    const bell = colorBellsData[bellId];
    setActiveLitBell(bellId);
    soundFx.playBellNote(bell.freq, 0.7);

    setTimeout(() => {
      setActiveLitBell(null);
    }, 300);

    const expectedBell = bellSequence[userBellStep];

    if (bellId === expectedBell) {
      const nextStep = userBellStep + 1;
      setUserBellStep(nextStep);

      // Completed full sequence for this level!
      if (nextStep === bellSequence.length) {
        soundFx.playSuccess();
        confetti({ particleCount: 40, spread: 60 });
        setBellGameScore((prev) => prev + bellLevel * 10);
        setBellLevel((prev) => prev + 1);

        speakElderVoice('अरे वाह! बिल्कुल सही सुर बजाया आपने!');

        // Add 1 more bell note for next round
        const newSeq = [...bellSequence, Math.floor(Math.random() * 4)];
        setBellSequence(newSeq);

        setTimeout(() => {
          playBellSequence(newSeq);
        }, 1400);
      }
    } else {
      // Mistake made
      soundFx.playRetryTone();
      setBellGameStatus('failed');
      speakElderVoice('कोई बात नहीं दादाजी! फिर से प्रयास करते हैं।');
    }
  };

  // -------------------------------------------------------------
  // GAME 3: DESI WORD & PICTURE PUZZLE LOGIC
  // -------------------------------------------------------------
  const currentPuzzle = wordPuzzles[currentWordIdx % wordPuzzles.length];

  const handleAddLetter = (letter: string) => {
    if (wordPuzzleSolved) return;
    soundFx.playBellNote(500, 0.3);
    const newLetters = [...selectedWordLetters, letter];
    setSelectedWordLetters(newLetters);

    const currentFormed = newLetters.join('');
    if (currentFormed === currentPuzzle.answerHindi) {
      setWordPuzzleSolved(true);
      soundFx.playSuccess();
      confetti({ particleCount: 60, spread: 70 });
      speakElderVoice(`शाबाश! सही शब्द है - ${currentPuzzle.answerHindi}!`);
    }
  };

  const handleRemoveLetter = () => {
    if (selectedWordLetters.length > 0) {
      soundFx.playBellNote(350, 0.2);
      setSelectedWordLetters((prev) => prev.slice(0, prev.length - 1));
      setWordPuzzleSolved(false);
    }
  };

  const handleNextWordPuzzle = () => {
    setCurrentWordIdx((prev) => prev + 1);
    setSelectedWordLetters([]);
    setWordPuzzleSolved(false);
    setShowWordHint(false);
  };

  // -------------------------------------------------------------
  // GAME 4: BREATHING PRANAYAMA LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    let timer: any = null;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathingPhase((phase) => {
              if (phase === 'Inhale') {
                soundFx.playBellNote(392, 1.2);
                return 'Hold';
              } else if (phase === 'Hold') {
                return 'Exhale';
              } else {
                soundFx.playCalmingTone(4);
                return 'Inhale';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // -------------------------------------------------------------
  // GAME 5: TRIVIA QUESTIONS
  // -------------------------------------------------------------
  const triviaQuestions = [
    {
      question: '1971 की सुपरहिट फिल्म "आनंद" में राजेश खन्ना का प्रसिद्ध संवाद क्या था?',
      options: [
        'बाबूमोशाय, जिंदगी बड़ी होनी चाहिए लंबी नहीं!',
        'कितने आदमी थे?',
        'डॉन को पकड़ना मुश्किल ही नहीं नामुमकिन है',
      ],
      correctIndex: 0,
      fact: 'आनंद फिल्म में राजेश खन्ना और अमिताभ बच्चन की जोड़ी को पूरे भारत ने सराहा था।'
    },
    {
      question: '1983 में भारत ने किस देश को हराकर पहला क्रिकेट वर्ल्ड कप जीता था?',
      options: ['इंग्लैंड', 'वेस्टइंडीज (West Indies)', 'ऑस्ट्रेलिया'],
      correctIndex: 1,
      fact: 'कपिल देव की कप्तानी में लॉर्ड्स के मैदान पर भारत ने ऐतिहासिक जीत दर्ज की थी।'
    },
    {
      question: 'दूरदर्शन पर रविवार सुबह प्रसारित होने वाले कौन से धारावाहिक को देखने के लिए सड़कें खाली हो जाती थीं?',
      options: ['रामायण (रामानंद सागर)', 'चित्रहार', 'सुरभि'],
      correctIndex: 0,
      fact: '1987 में रामायण धारावाहिक के समय पूरा देश टीवी के सामने हाथ जोड़कर बैठ जाता था।'
    },
    {
      question: 'भारत के किस महान गायक को "सुरों की मल्लिका" या "भारत कोकिला" कहा जाता है?',
      options: ['लता मंगेशकर जी', 'आशा भोसले जी', 'गीता दत्त जी'],
      correctIndex: 0,
      fact: 'लता मंगेशकर जी ने 36 से अधिक भाषाओं में 30,000 से ज्यादा गाने गाए हैं।'
    }
  ];

  const currentTrivia = triviaQuestions[triviaIndex % triviaQuestions.length];

  // Filtered songs
  const filteredSongs = songCategoryFilter === 'all' 
    ? songs 
    : songs.filter(s => s.moodTag === songCategoryFilter);

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Hidden Native Audio Element for Direct MP3 playback */}
      <audio 
        ref={audioRef} 
        onEnded={handleNextSong}
        onError={() => {
          // Graceful fallback to melodic synthesizer
          setPlaybackMode('melody');
          melodyPlayer.playSong(currentSong.id);
        }}
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-music-btn"
            onClick={onBackToHome}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors shadow-sm"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black flex items-center gap-2 text-slate-900 dark:text-amber-300">
              <Music className="w-8 h-8 text-teal-600" />
              पुराने गाने व 5 दिमागी खेल (Music & Brain Games)
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-amber-200">
              सदाबहार गीतों का रेडियो, सुरों की घंटी, शब्द पहेली, जोड़ी खेल व प्राणायाम
            </p>
          </div>
        </div>

        {/* 6 Rich Tab Switchers */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <button
            id="tab-radio-btn"
            onClick={() => setActiveTab('radio')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'radio' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>1. रेडियो (Songs)</span>
          </button>

          <button
            id="tab-musical-bells-btn"
            onClick={() => {
              setActiveTab('musical-bells');
              if (bellGameStatus === 'idle') startNewBellGame();
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'musical-bells' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>2. सुरों की घंटी (Bells)</span>
          </button>

          <button
            id="tab-word-puzzle-btn"
            onClick={() => setActiveTab('word-puzzle')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'word-puzzle' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>3. शब्द पहेली (Words)</span>
          </button>

          <button
            id="tab-memory-match-btn"
            onClick={() => setActiveTab('memory-match')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'memory-match' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>4. जोड़ी मिलाओ (Pairs)</span>
          </button>

          <button
            id="tab-trivia-btn"
            onClick={() => setActiveTab('trivia')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'trivia' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>5. पुरानी यादें (Quiz)</span>
          </button>

          <button
            id="tab-breathing-btn"
            onClick={() => setActiveTab('breathing')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'breathing' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-white/60'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>6. प्राणायाम (Calm)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GOLDEN ERA RETRO RADIO & REAL MUSIC PLAYER                          */}
      {/* ========================================================================= */}
      {activeTab === 'radio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Player */}
          <div className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border-3 shadow-xl flex flex-col justify-between space-y-6 ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 text-white'
          }`}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 shrink-0 relative group">
                <img
                  src={currentSong.coverArt}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isPlayingSong && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-end gap-1.5 h-12">
                      <span className="w-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-8"></span>
                      <span className="w-2.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.1s] h-12"></span>
                      <span className="w-2.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.4s] h-6"></span>
                      <span className="w-2.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.2s] h-10"></span>
                    </div>
                    <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                      सुरीली धुन चालू है
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
                    {currentSong.era} • {currentSong.moodTag}
                  </span>
                  {currentSong.raag && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/30 text-teal-200 border border-teal-400/40">
                      {currentSong.raag}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-amber-200 leading-tight">
                  {currentSong.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-semibold">
                  गायक व संगीत: {currentSong.artist}
                </p>

                {/* Live Karaoke Sing-Along Lyrics Box */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                    <span>🎤 साथ-साथ गाएं (Sing-Along Lyrics)</span>
                    <button 
                      onClick={handleTellSongStory}
                      className="text-teal-300 hover:text-teal-100 flex items-center gap-1 underline text-xs"
                      title="Listen to story"
                    >
                      <Lightbulb className="w-3.5 h-3.5" /> कहानी सुनें
                    </button>
                  </div>
                  {currentSong.fullLyrics ? (
                    <div className="space-y-1">
                      {currentSong.fullLyrics.map((line, idx) => (
                        <p 
                          key={idx}
                          className={`text-sm sm:text-base font-serif transition-all duration-300 ${
                            idx === activeLyricIndex 
                              ? 'text-amber-300 font-black scale-[1.02] pl-2 border-l-2 border-amber-400' 
                              : 'text-slate-300 opacity-70'
                          }`}
                        >
                          "{line}"
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-amber-100">"{currentSong.lyricsSnippet}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* Playback Audio Engine Controls */}
            <div className="space-y-4 pt-4 border-t border-white/15">
              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>प्रगति: {songProgress}%</span>
                  <span>{currentSong.durationSeconds ? `${Math.floor((songProgress * currentSong.durationSeconds) / 6000)}m : ${Math.floor(((songProgress * currentSong.durationSeconds) / 100) % 60)}s` : 'सुरीला सुर'}</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${songProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Main Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Volume & Audio Mode */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-300" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-24 accent-amber-400 cursor-pointer"
                    title={`आवाज़: ${volume}%`}
                  />
                </div>

                {/* Primary Player Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    id="prev-song-btn"
                    onClick={handlePrevSong}
                    className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="पिछला गाना (Previous)"
                  >
                    <SkipBack className="w-7 h-7" />
                  </button>

                  <button
                    id="play-pause-song-btn"
                    onClick={handleTogglePlaySong}
                    className="p-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-2xl shadow-amber-400/50 hover:scale-105 active:scale-95 transition-all"
                    title={isPlayingSong ? 'रोकें (Pause)' : 'बजाएं (Play Melody)'}
                  >
                    {isPlayingSong ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 translate-x-0.5" />}
                  </button>

                  <button
                    id="next-song-btn"
                    onClick={handleNextSong}
                    className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="अगला गाना (Next)"
                  >
                    <SkipForward className="w-7 h-7" />
                  </button>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextMode = playbackMode === 'melody' ? 'stream' : 'melody';
                      setPlaybackMode(nextMode);
                      if (isPlayingSong) playCurrentSong(currentSong);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 border border-white/20 flex items-center gap-1.5"
                    title="Audio Mode"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>{playbackMode === 'melody' ? '🪕 राग धुन (Synth)' : '📻 लाइव स्ट्रीम (MP3)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist & Categories */}
          <div className={`p-5 rounded-3xl border-2 space-y-4 shadow-md flex flex-col justify-between ${
            isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-slate-900 dark:text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  सदाबहार प्लेलिस्ट ({filteredSongs.length})
                </h3>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(['all', 'Devotional', 'Calm', 'Joyful'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSongCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      songCategoryFilter === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat === 'all' ? 'सभी' : cat === 'Devotional' ? '🪔 भजन' : cat === 'Calm' ? '🌸 सुकून' : '✨ आनंद'}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredSongs.map((song, idx) => (
                  <button
                    key={song.id}
                    id={`select-song-${song.id}`}
                    onClick={() => {
                      const originalIdx = songs.findIndex(s => s.id === song.id);
                      setCurrentSongIndex(originalIdx);
                      playCurrentSong(song);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      song.id === currentSong.id
                        ? 'bg-teal-50 dark:bg-teal-950 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-900 border-slate-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      song.id === currentSong.id ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700'
                    }`}>
                      {song.id === currentSong.id && isPlayingSong ? <Volume2 className="w-5 h-5 animate-pulse" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-slate-900 dark:text-amber-200">
                        {song.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-amber-100 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-zinc-900 border border-amber-200 text-xs text-slate-700 dark:text-amber-100">
              💡 <strong>टिप:</strong> आप ऊपर "कहानी सुनें" दबाकर इस गीत की पुरानी फिल्मी यादें भी सुन सकते हैं!
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2 (NEW GAME): MUSICAL COLOR BELLS (SIMON SAYS)                        */}
      {/* ========================================================================= */}
      {activeTab === 'musical-bells' && (
        <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl max-w-4xl mx-auto space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-amber-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-200 flex items-center gap-2">
                <Bell className="w-7 h-7 text-amber-500 animate-bounce" />
                सुरों की घंटी - याददाश्त खेल (Musical Simon Bells)
              </h2>
              <p className="text-sm text-slate-600 dark:text-amber-100 mt-1">
                घंटियों की मधुर धुन सुनें और उसी क्रम में घंटियों को बजाएं!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-zinc-900 border border-amber-300 text-center">
                <span className="text-xs text-slate-500 dark:text-amber-200 block font-bold">लेवल (Round)</span>
                <strong className="text-lg font-black text-amber-700 dark:text-amber-300">{bellLevel}</strong>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-emerald-100 dark:bg-zinc-900 border border-emerald-300 text-center">
                <span className="text-xs text-slate-500 dark:text-emerald-200 block font-bold">अंक (Score)</span>
                <strong className="text-lg font-black text-emerald-700 dark:text-emerald-300">{bellGameScore}</strong>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center py-2">
            {isBellPlayingSeq ? (
              <p className="text-lg font-black text-amber-600 dark:text-amber-300 animate-pulse flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> ध्यान से धुन सुनें...
              </p>
            ) : bellGameStatus === 'failed' ? (
              <div className="space-y-2">
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  गलत घंटी बज गई! कोई बात नहीं, फिर से शुरुआत करते हैं।
                </p>
                <button
                  id="restart-bell-game-btn"
                  onClick={startNewBellGame}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-md"
                >
                  नया खेल शुरू करें
                </button>
              </div>
            ) : (
              <p className="text-base font-bold text-slate-700 dark:text-amber-200">
                आपकी बारी: {userBellStep} / {bellSequence.length} घंटियां बजीं
              </p>
            )}
          </div>

          {/* 4 Large Musical Bell Buttons */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto py-4">
            {colorBellsData.map((bell) => {
              const isLit = activeLitBell === bell.id;

              return (
                <button
                  key={bell.id}
                  id={`bell-btn-${bell.id}`}
                  disabled={isBellPlayingSeq}
                  onClick={() => handleUserBellTap(bell.id)}
                  className={`h-36 sm:h-44 rounded-3xl font-black text-xl sm:text-2xl flex flex-col items-center justify-center gap-2 border-4 transition-all transform active:scale-95 shadow-xl ${
                    isLit ? bell.activeColorClass : bell.colorClass
                  } ${isBellPlayingSeq ? 'cursor-not-allowed opacity-90' : 'hover:scale-[1.03]'}`}
                >
                  <Bell className={`w-10 h-10 sm:w-12 sm:h-12 ${isLit ? 'animate-wiggle scale-125' : ''}`} />
                  <span>{bell.note}</span>
                  <span className="text-xs font-semibold opacity-90">{bell.nameHindi}</span>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="replay-bell-seq-btn"
              disabled={isBellPlayingSeq || bellGameStatus !== 'playing'}
              onClick={() => playBellSequence(bellSequence)}
              className="px-5 py-3 rounded-2xl bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-slate-800 dark:text-amber-200 font-bold text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>धुन फिर से सुनें (Replay Sound)</span>
            </button>

            <button
              id="start-fresh-bell-btn"
              onClick={startNewBellGame}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>नया खेल (Start Fresh)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3 (NEW GAME): DESI WORD & PICTURE PUZZLE                              */}
      {/* ========================================================================= */}
      {activeTab === 'word-puzzle' && (
        <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl max-w-3xl mx-auto space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
              चित्र व शब्द पहेली {currentWordIdx + 1} / {wordPuzzles.length}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-amber-200">
              श्रेणी: {currentPuzzle.category}
            </span>
          </div>

          {/* Picture and Hint Box */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-emerald-50/60 dark:bg-zinc-900 border border-emerald-200">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-3 border-emerald-400 shadow-md shrink-0">
              <img
                src={currentPuzzle.image}
                alt={currentPuzzle.answerHindi}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-200">
                चित्र देखकर शब्द बनाएं!
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-amber-100 font-semibold">
                💡 <strong>संकेत:</strong> {currentPuzzle.hintHindi}
              </p>

              <button
                id="voice-hint-puzzle-btn"
                onClick={() => speakElderVoice(`संकेत है: ${currentPuzzle.hintHindi}`)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-300 text-emerald-800 dark:text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-emerald-100"
              >
                <Volume2 className="w-4 h-4" /> संकेत की आवाज सुनें
              </button>
            </div>
          </div>

          {/* Formed Word Display Slots */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="flex items-center gap-2 min-h-[64px] px-6 py-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 border-2 border-dashed border-slate-400">
              {selectedWordLetters.length === 0 ? (
                <span className="text-slate-400 text-sm font-semibold">नीचे दिए अक्षरों पर टैप करें</span>
              ) : (
                selectedWordLetters.map((char, i) => (
                  <span
                    key={i}
                    className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md animate-scale-in"
                  >
                    {char}
                  </span>
                ))
              )}
            </div>

            {selectedWordLetters.length > 0 && !wordPuzzleSolved && (
              <button
                id="backspace-letter-btn"
                onClick={handleRemoveLetter}
                className="p-3 rounded-2xl bg-rose-100 text-rose-800 font-bold hover:bg-rose-200 transition-colors"
                title="मिटाएं"
              >
                ← मिटाएं
              </button>
            )}
          </div>

          {/* Letter Options */}
          <div className="space-y-2">
            <p className="text-center text-xs font-bold text-slate-500 dark:text-amber-200">
              अक्षर चुनें:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentPuzzle.scrambledLetters.map((char, idx) => (
                <button
                  key={idx}
                  id={`letter-tile-${idx}`}
                  disabled={wordPuzzleSolved}
                  onClick={() => handleAddLetter(char)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-2xl sm:text-3xl shadow-md border-2 border-amber-600 transition-transform"
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {wordPuzzleSolved && (
            <div className="p-5 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-center space-y-3 animate-bounce">
              <p className="text-xl font-black">
                🎉 बधाई हो! सही शब्द है: {currentPuzzle.answerHindi} ({currentPuzzle.answerEnglish})
              </p>
              <p className="text-sm font-semibold">
                📖 {currentPuzzle.factHindi}
              </p>
              <button
                id="next-word-puzzle-btn"
                onClick={handleNextWordPuzzle}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
              >
                अगली पहेली देखें →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MEMORY MATCH TILE GAME                                              */}
      {/* ========================================================================= */}
      {activeTab === 'memory-match' && (
        <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl max-w-4xl mx-auto space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-200">
                जोड़ी मिलाओ खेल (Memory Pair Match)
              </h2>
              <p className="text-sm text-slate-600 dark:text-amber-100">
                दो कार्ड्स पर टैप करके समान चित्रों के जोड़े ढूंढें • कुल चालें: {matchMoves}
              </p>
            </div>

            <button
              id="reset-match-game-btn"
              onClick={initializeMemoryGame}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>नया खेल</span>
            </button>
          </div>

          {gameWon && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center animate-bounce font-black text-lg">
              🎉 बहुत बढ़िया! आपने {matchMoves} चालों में सभी जोड़े ढूंढ लिए हैं!
            </div>
          )}

          {/* Tiles Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {tiles.map((tile, idx) => {
              const isSelected = selectedTileIndexes.includes(idx);
              const isFlipped = tile.matched || isSelected;

              return (
                <button
                  key={tile.id}
                  id={`match-tile-${idx}`}
                  onClick={() => handleTileClick(idx)}
                  className={`h-24 sm:h-32 rounded-3xl text-4xl sm:text-5xl flex flex-col items-center justify-center gap-1 transition-all duration-300 transform shadow-md border-3 ${
                    tile.matched
                      ? 'bg-emerald-100 border-emerald-500 opacity-90 scale-95'
                      : isSelected
                        ? 'bg-amber-200 border-amber-500 scale-105'
                        : isHighContrast
                          ? 'bg-zinc-900 border-amber-400 text-transparent hover:bg-zinc-800'
                          : 'bg-amber-500/90 hover:bg-amber-600 border-amber-600 text-transparent'
                  }`}
                >
                  {isFlipped ? (
                    <>
                      <span>{tile.icon}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-800">
                        {tile.label.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl text-white font-black">?</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: NOSTALGIA TRIVIA QUIZ                                               */}
      {/* ========================================================================= */}
      {activeTab === 'trivia' && (
        <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-xl max-w-3xl mx-auto space-y-6 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-white border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-900 font-bold text-xs">
              पुरानी यादें प्रश्न {triviaIndex + 1} / {triviaQuestions.length}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-zinc-900 border border-purple-200 dark:border-zinc-700">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-200">
              {currentTrivia.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentTrivia.options.map((opt, idx) => {
              const isSelected = triviaSelectedAnswer === idx;
              const isCorrect = idx === currentTrivia.correctIndex;

              return (
                <button
                  key={idx}
                  id={`trivia-opt-${idx}`}
                  onClick={() => {
                    setTriviaSelectedAnswer(idx);
                    if (isCorrect) {
                      soundFx.playSuccess();
                      confetti({ particleCount: 50, spread: 60 });
                      speakElderVoice('अरे वाह! बिल्कुल सही उत्तर दिया आपने!');
                    } else {
                      soundFx.playRetryTone();
                    }
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base sm:text-lg flex items-center justify-between transition-all ${
                    triviaSelectedAnswer !== null
                      ? isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                        : isSelected
                          ? 'bg-rose-100 border-rose-400 text-rose-900'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      : 'hover:bg-purple-50 border-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  {triviaSelectedAnswer !== null && isCorrect && (
                    <Check className="w-6 h-6 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {triviaSelectedAnswer !== null && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-zinc-900 border border-amber-300 space-y-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-amber-100">
                💡 <strong>रोचक तथ्य:</strong> {currentTrivia.fact}
              </p>
              <button
                id="next-trivia-btn"
                onClick={() => {
                  setTriviaIndex((prev) => prev + 1);
                  setTriviaSelectedAnswer(null);
                }}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md"
              >
                अगला सवाल देखें (Next) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CALMING BREATHING CIRCLE (PRANAYAMA)                                */}
      {/* ========================================================================= */}
      {activeTab === 'breathing' && (
        <div className={`p-8 sm:p-12 rounded-3xl border-3 shadow-xl max-w-2xl mx-auto text-center space-y-8 ${
          isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-gradient-to-b from-indigo-50 to-teal-50 border-indigo-200'
        }`}>
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-indigo-950 dark:text-amber-200">
              शांति प्राणायाम (Calm Breathing Circle)
            </h2>
            <p className="text-base text-slate-600 dark:text-amber-100 mt-1">
              धीमी और गहरी सांस लें, मन को असीम शांति मिलेगी
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              breathingPhase === 'Inhale' 
                ? 'scale-110 bg-indigo-300/40 animate-pulse' 
                : breathingPhase === 'Hold' 
                  ? 'scale-105 bg-amber-300/40' 
                  : 'scale-90 bg-teal-300/40'
            }`}></div>

            <div className={`w-52 h-52 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 border-4 border-white ${
              breathingPhase === 'Inhale' 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 scale-105' 
                : breathingPhase === 'Hold' 
                  ? 'bg-gradient-to-br from-amber-600 to-amber-700 scale-100' 
                  : 'bg-gradient-to-br from-teal-600 to-emerald-700 scale-95'
            }`}>
              <Wind className="w-12 h-12 mb-1 animate-bounce" />
              <span className="text-2xl sm:text-3xl font-black tracking-wide">
                {breathingPhase === 'Inhale' ? 'सांस अंदर लें' : breathingPhase === 'Hold' ? 'रोक कर रखें' : 'धीरे से छोड़ें'}
              </span>
              <span className="text-4xl font-mono font-black mt-2">
                {breathCounter}s
              </span>
            </div>
          </div>

          <button
            id="toggle-breathing-loop-btn"
            onClick={() => {
              setIsBreathingActive(!isBreathingActive);
              if (!isBreathingActive) {
                soundFx.playCalmingTone(10);
                speakElderVoice('गहरी सांस अंदर खींचिए, और मन को शांत महसूस कीजिए।');
              }
            }}
            className={`px-8 py-4 rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-all ${
              isBreathingActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isBreathingActive ? 'रोकें (Pause Breathing)' : 'प्राणायाम शुरू करें (Start Calming Session)'}
          </button>
        </div>
      )}
    </div>
  );
};
