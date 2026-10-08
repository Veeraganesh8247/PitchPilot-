import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Loader2, 
  Zap, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  Heart
} from 'lucide-react';
import { PresentationDeck } from '../../types';
import { askCoachVocalis } from '../../services/geminiService';

interface CoachConsultationViewProps {
  activeDeck: PresentationDeck;
  onGoToStudio: () => void;
}

interface Message {
  sender: 'user' | 'coach';
  text: string;
  drill?: string;
  timestamp: string;
}

export const CoachConsultationView: React.FC<CoachConsultationViewProps> = ({
  activeDeck,
  onGoToStudio
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: `Welcome to your executive studio consultation. I'm Vocalis Coach. Whether you are calibrating your "${activeDeck.title}" delivery, eliminating subconscious filler words, or preparing for high-intensity venture partner Q&A, I am here to help you hone commanding vocal authority. What would you like to refine today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Metronome & Breathing Trainer State
  const [isTrainerActive, setIsTrainerActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Deliver Statement' | 'Exhale'>('Inhale');
  const [trainerTimer, setTrainerTimer] = useState(4);
  const [metronomeBpm, setMetronomeBpm] = useState(138);

  useEffect(() => {
    let interval: any = null;
    if (isTrainerActive) {
      interval = setInterval(() => {
        setTrainerTimer(prev => {
          if (prev <= 1) {
            setBreathPhase(current => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Deliver Statement';
              if (current === 'Deliver Statement') return 'Exhale';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTrainerActive]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await askCoachVocalis(textToSend, {
        deckTitle: activeDeck.title,
        averageWpm: activeDeck.targetWPM
      });

      const coachMsg: Message = {
        sender: 'coach',
        text: res.answer,
        drill: res.drillRecommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-3xl p-6 sm:p-8 card-shadow ai-glow relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 mb-1">
              <Sparkles className="w-4 h-4 text-[#dad7ff]" />
              <span>AI Speech & Presence Mentor</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Executive Vocal Coaching Room
            </h2>
            <p className="text-xs text-indigo-100 mt-1 max-w-xl leading-relaxed">
              Tactical vocal architecture, stress-inoculation drills, and real-time cadence conditioning.
            </p>
          </div>

          <button
            onClick={onGoToStudio}
            className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md self-stretch sm:self-auto justify-center"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Rehearsal Studio</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Chat & Consultation, Right Cadence Trainer & Drills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Interactive Chat with Coach Vocalis (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] p-6 card-shadow flex flex-col h-[640px]">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3525cd] to-[#712ae2] flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#131b2e]">
                  Coach Vocalis
                </h3>
                <span className="text-xs text-[#047857] flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini-Powered Vocal Advisor
                </span>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="text-xs text-[#777587] hover:text-[#131b2e] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

          {/* Quick Prompt Starters */}
          <div className="py-3 flex flex-wrap gap-1.5 border-b border-[#f2f3ff]">
            <button
              onClick={() => handleSendMessage("How do I maintain authority when an investor interrupts my presentation?")}
              className="text-[11px] bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1 rounded-full transition-all cursor-pointer"
            >
              🛡️ Handling hostile interruptions
            </button>
            <button
              onClick={() => handleSendMessage("How do I avoid sounding monotone on financial and unit economic slides?")}
              className="text-[11px] bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1 rounded-full transition-all cursor-pointer"
            >
              📈 Inflection on financial data
            </button>
            <button
              onClick={() => handleSendMessage("My throat gets dry and heart races before speaking. What is the fastest physical reset?")}
              className="text-[11px] bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1 rounded-full transition-all cursor-pointer"
            >
              🫁 Instant physiological reset
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'btn-primary-gradient text-white rounded-br-none shadow-xs'
                      : 'bg-[#faf8ff] border border-[#e2e7ff] text-[#131b2e] rounded-bl-none card-shadow'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.drill && (
                    <div className="mt-3 pt-3 border-t border-[#dae2fd] bg-[#f2f3ff] p-2.5 rounded-xl text-[#131b2e]">
                      <span className="font-bold text-[#3525cd] block mb-0.5">🎯 Recommended Practice Drill:</span>
                      <span className="text-[#464555] italic">{m.drill}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#777587] mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#777587] p-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#4f46e5]" />
                <span>Coach Vocalis is formulating your drill...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-[#E2E8F0] flex gap-2">
            <input
              type="text"
              placeholder="Ask about vocal inflections, eliminating fillers, breathing, or pitch..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputQuery.trim()}
              className="btn-primary-gradient text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Cadence Metronome & Core Vocal Drills (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Real-time Physiological Reset & Cadence Trainer */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
                  Physiological Calibration
                </span>
                <h4 className="font-heading font-bold text-base text-[#131b2e]">
                  Vocal Pacing Metronome
                </h4>
              </div>

              <button
                onClick={() => setIsTrainerActive(prev => !prev)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isTrainerActive ? 'bg-red-50 text-red-700' : 'btn-primary-gradient text-white'
                }`}
              >
                {isTrainerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isTrainerActive ? 'Stop Trainer' : 'Start Trainer'}</span>
              </button>
            </div>

            {/* Breathing Animation Circle */}
            <div className="flex flex-col items-center justify-center py-4 bg-[#faf8ff] rounded-2xl border border-[#e2e7ff]">
              <div 
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-md ${
                  breathPhase === 'Inhale' 
                    ? 'scale-110 bg-gradient-to-tr from-[#3525cd] to-[#712ae2]' 
                    : breathPhase === 'Hold'
                    ? 'scale-105 bg-amber-500'
                    : breathPhase === 'Deliver Statement'
                    ? 'scale-100 bg-[#10B981]'
                    : 'scale-90 bg-sky-600'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                  {breathPhase}
                </span>
                <span className="font-heading font-extrabold text-2xl tabular-nums">
                  {trainerTimer}s
                </span>
              </div>

              <div className="text-center mt-3">
                <p className="text-xs font-semibold text-[#131b2e]">
                  {breathPhase === 'Inhale' && 'Inhale deeply through your nose and expand belly.'}
                  {breathPhase === 'Hold' && 'Hold gently with relaxed shoulders and chest open.'}
                  {breathPhase === 'Deliver Statement' && 'Speak your core value prop at steady 138 WPM.'}
                  {breathPhase === 'Exhale' && 'Release residual air and ground your posture.'}
                </p>
              </div>
            </div>

            {/* Cadence Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#f2f3ff]">
              <div className="flex justify-between text-xs text-[#777587]">
                <span>Target Rehearsal Tempo:</span>
                <span className="font-bold text-[#131b2e] tabular-nums">{metronomeBpm} WPM</span>
              </div>
              <input
                type="range"
                min={110}
                max={165}
                value={metronomeBpm}
                onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                className="w-full accent-[#4f46e5] cursor-pointer"
              />
            </div>
          </div>

          {/* Curated Executive Vocal Workout Drills */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 card-shadow space-y-4">
            <h4 className="font-heading font-bold text-base text-[#131b2e]">
              Core Executive Vocal Drills
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-[#e2e7ff] bg-[#faf8ff] hover:bg-white transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#131b2e]">
                    1. The "Steve Jobs Silence" Drill
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    3 min
                  </span>
                </div>
                <p className="text-xs text-[#777587] leading-relaxed">
                  State your primary statistic. Maintain unbroken eye contact and count 3 full silent heartbeats before moving to the next slide.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e7ff] bg-[#faf8ff] hover:bg-white transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#131b2e]">
                    2. The Downward Pitch Hook
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    2 min
                  </span>
                </div>
                <p className="text-xs text-[#777587] leading-relaxed">
                  Practice stating "We are seeking fourteen million dollars" ensuring your vocal pitch drops on the final syllable rather than rising like a question.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#e2e7ff] bg-[#faf8ff] hover:bg-white transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#131b2e]">
                    3. The Monotone Breaker (Coloring)
                  </span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                    4 min
                  </span>
                </div>
                <p className="text-xs text-[#777587] leading-relaxed">
                  Read one paragraph emphasizing opposites with high contrast: speak "bottleneck" with low rasp, and "breakthrough" with vibrant brightness.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
