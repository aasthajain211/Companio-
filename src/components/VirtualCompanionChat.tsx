import React, { useState, useEffect, useRef } from 'react';
import { ElderProfile } from '../types';
import { soundFx, speakElderVoice, stopSpeaking } from '../utils/audioUtils';
import { 
  MessageCircleHeart, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart, 
  RefreshCw, 
  ArrowLeft,
  Smile
} from 'lucide-react';

interface VirtualCompanionChatProps {
  elderProfile: ElderProfile;
  onBackToHome: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'dost';
  text: string;
  timestamp: string;
}

export const VirtualCompanionChat: React.FC<VirtualCompanionChatProps> = ({
  elderProfile,
  onBackToHome
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'dost',
      text: `नमस्ते ${elderProfile.nickname}! मैं आपका प्यारा साथी 'कंपैनियो दोस्त' हूँ। आज आपका दिन कैसा बीत रहा है? मुझसे आप कोई भी बात कर सकते हैं, कहानी सुन सकते हैं या पुराने दिनों की बातें साझा कर सकते हैं।`,
      timestamp: '08:30 AM'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(true);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isHighContrast = elderProfile.highContrast;

  const quickStarters = [
    '🌸 मुझे आज कोई अच्छी पुरानी कहानी सुनाओ',
    '☕ आज का मौसम कैसा है और मैं क्या करूँ?',
    '❤️ मुझे थोड़ा अकेलापन लग रहा है, बात करो',
    '🎶 मुझे कबीर का कोई प्यारा दोहा सुनाओ',
    '💧 क्या मैंने आज अपनी सारी दवाइयां ले ली हैं?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech Recognition
  const handleToggleMic = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type or use standard input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Default to Hindi / Indian English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundFx.playChime();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isLoading) return;

    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          elderName: elderProfile.nickname,
          language: elderProfile.language
        })
      });

      const data = await res.json();
      const replyText = data.reply || `नमस्ते ${elderProfile.nickname}! मैं आपकी बात समझ गया। आपका दिन शुभ और सुखद रहे।`;

      const dostMsg: ChatMessage = {
        id: `d-${Date.now()}`,
        sender: 'dost',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, dostMsg]);
      setIsLoading(false);

      if (isAutoSpeakEnabled) {
        setIsSpeakingNow(true);
        await speakElderVoice(replyText);
        setIsSpeakingNow(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `d-${Date.now()}`,
        sender: 'dost',
        text: `अरे ${elderProfile.nickname}! मैं आपके साथ हूँ। चिंता मत कीजिए, पानी का एक घूंट लीजिए और मुस्कुराइए।`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setIsLoading(false);
      if (isAutoSpeakEnabled) {
        speakElderVoice(fallbackMsg.text);
      }
    }
  };

  const handleSpeakMessage = async (text: string) => {
    setIsSpeakingNow(true);
    soundFx.playChime();
    await speakElderVoice(text);
    setIsSpeakingNow(false);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-4 max-w-5xl mx-auto flex flex-col h-[85vh] ${
      isHighContrast ? 'text-amber-300' : 'text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="back-home-from-dost-btn"
            onClick={onBackToHome}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-800 dark:text-amber-300 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Smile className="w-9 h-9 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-ping"></span>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black flex items-center gap-1.5 text-slate-900 dark:text-amber-200">
                कंपैनियो दोस्त (AI Voice Companion)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-amber-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>हमेशा आपके साथ, हर पल सुनने को तैयार</span>
              </p>
            </div>
          </div>
        </div>

        {/* Speak Toggle Button */}
        <button
          id="toggle-dost-auto-speak-btn"
          onClick={() => {
            if (isSpeakingNow) stopSpeaking();
            setIsAutoSpeakEnabled(!isAutoSpeakEnabled);
          }}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            isAutoSpeakEnabled 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-zinc-800 dark:text-indigo-300' 
              : 'bg-slate-100 text-slate-500 border-slate-300'
          }`}
        >
          {isAutoSpeakEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{isAutoSpeakEnabled ? 'आवाज चालू है' : 'आवाज बंद'}</span>
        </button>
      </div>

      {/* Quick Starters Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none shrink-0">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap pl-1">सुझाव:</span>
        {quickStarters.map((starter, idx) => (
          <button
            key={idx}
            id={`dost-starter-${idx}`}
            onClick={() => handleSendMessage(starter.replace(/^[^\s]+\s/, ''))}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-900 dark:bg-zinc-800 dark:text-indigo-200 border border-indigo-200 dark:border-zinc-700 whitespace-nowrap shadow-sm transition-transform hover:scale-105"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 rounded-3xl border-2 space-y-4 shadow-inner ${
        isHighContrast ? 'bg-zinc-950 border-amber-400' : 'bg-slate-50/70 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800'
      }`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'dost' && (
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Smile className="w-6 h-6" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl space-y-1.5 shadow-md ${
              msg.sender === 'user'
                ? 'bg-amber-500 text-white rounded-tr-none'
                : isHighContrast 
                  ? 'bg-zinc-900 text-amber-200 border border-amber-400 rounded-tl-none' 
                  : 'bg-white text-slate-900 border border-slate-200 dark:bg-zinc-800 dark:text-white rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between gap-3 text-[11px] opacity-75">
                <span className="font-bold">{msg.sender === 'user' ? 'आप (You)' : 'कंपैनियो दोस्त'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <p className="text-base sm:text-lg font-medium leading-relaxed">
                {msg.text}
              </p>

              {msg.sender === 'dost' && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleSpeakMessage(msg.text)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 text-indigo-600 dark:text-amber-300"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Smile className="w-6 h-6 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 text-slate-600 dark:text-slate-300 text-sm font-semibold flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>दोस्त सोच रहा है और आपके लिए जवाब तैयार कर रहा है...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          id="dost-mic-btn"
          type="button"
          onClick={handleToggleMic}
          className={`p-4 sm:p-5 rounded-2xl font-black text-white shadow-lg transition-all ${
            isListening 
              ? 'bg-rose-600 animate-pulse border-2 border-white scale-105' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
          }`}
          title="Speak with Voice"
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <input
          type="text"
          id="dost-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="बोलें या लिखें: जैसे 'नमस्ते दोस्त, आज का मौसम कैसा है?'..."
          className="flex-1 p-4 sm:p-5 rounded-2xl border-2 border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-base sm:text-lg font-medium focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />

        <button
          id="dost-send-btn"
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-4 sm:p-5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black shadow-lg transition-all hover:scale-105"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
