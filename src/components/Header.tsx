import React from 'react';
import { 
  Mic, 
  BarChart3, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Radio, 
  Play,
  Volume2
} from 'lucide-react';
import { PresentationDeck } from '../types';

interface HeaderProps {
  currentTab: 'studio' | 'analytics' | 'decks' | 'progress' | 'coach';
  setCurrentTab: (tab: 'studio' | 'analytics' | 'decks' | 'progress' | 'coach') => void;
  activeDeck: PresentationDeck;
  isRecording: boolean;
  onQuickRehearse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeDeck,
  isRecording,
  onQuickRehearse
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3525cd] via-[#4f46e5] to-[#712ae2] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl text-[#131b2e] tracking-tight">
                  Vocalis<span className="text-[#4f46e5]">.studio</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef2ff] text-[#4338ca] border border-[#dad7ff]">
                  AI Speech Intelligence
                </span>
              </div>
              <p className="text-xs text-[#777587] hidden sm:block">
                Executive Speech & Pitch Coaching System
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl border border-[#dae2fd]">
            <button
              onClick={() => setCurrentTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'studio'
                  ? 'bg-white text-[#3525cd] shadow-xs border border-[#dad7ff]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-white/50'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Studio</span>
              {isRecording && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'analytics'
                  ? 'bg-white text-[#3525cd] shadow-xs border border-[#dad7ff]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setCurrentTab('decks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'decks'
                  ? 'bg-white text-[#3525cd] shadow-xs border border-[#dad7ff]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pitch Decks</span>
            </button>

            <button
              onClick={() => setCurrentTab('progress')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'progress'
                  ? 'bg-white text-[#3525cd] shadow-xs border border-[#dad7ff]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-white/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Progress</span>
            </button>

            <button
              onClick={() => setCurrentTab('coach')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'coach'
                  ? 'bg-white text-[#3525cd] shadow-xs border border-[#dad7ff]'
                  : 'text-[#464555] hover:text-[#131b2e] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#712ae2]" />
              <span>Ask Coach</span>
            </button>
          </nav>

          {/* Right Controls: Active Deck Pill & Start Rehearsal */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#faf8ff] border border-[#e2e7ff] px-3 py-1.5 rounded-lg text-xs">
              <span className="text-[#777587]">Deck:</span>
              <span className="font-semibold text-[#131b2e] max-w-[140px] truncate" title={activeDeck.title}>
                {activeDeck.title}
              </span>
            </div>

            {currentTab !== 'studio' ? (
              <button
                onClick={onQuickRehearse}
                className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Rehearse Now</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-[#464555] bg-[#eaedff] px-3 py-1.5 rounded-lg font-medium border border-[#dae2fd]">
                <Volume2 className="w-3.5 h-3.5 text-[#3525cd]" />
                <span className="hidden sm:inline">Audio Engine Ready</span>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#f2f3ff] text-xs">
          <button
            onClick={() => setCurrentTab('studio')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'studio' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Studio</span>
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'analytics' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setCurrentTab('decks')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'decks' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Decks</span>
          </button>
          <button
            onClick={() => setCurrentTab('progress')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'progress' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </button>
          <button
            onClick={() => setCurrentTab('coach')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'coach' ? 'text-[#3525cd] font-bold' : 'text-[#777587]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Coach</span>
          </button>
        </div>
      </div>
    </header>
  );
};
