/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { LiveRehearsalStudio } from './components/Studio/LiveRehearsalStudio';
import { SessionAnalyticsView } from './components/Analytics/SessionAnalyticsView';
import { DeckLibraryView } from './components/Decks/DeckLibraryView';
import { ProgressHistoryView } from './components/Progress/ProgressHistoryView';
import { CoachConsultationView } from './components/Coach/CoachConsultationView';
import { DEFAULT_DECKS } from './data/defaultDecks';
import { SAMPLE_SESSIONS } from './data/sampleSessions';
import { PresentationDeck, RehearsalSession } from './types';
import { Radio, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'studio' | 'analytics' | 'decks' | 'progress' | 'coach'>('studio');
  
  // Decks & Sessions State
  const [decks, setDecks] = useState<PresentationDeck[]>(DEFAULT_DECKS);
  const [activeDeck, setActiveDeck] = useState<PresentationDeck>(DEFAULT_DECKS[0]);
  const [sessions, setSessions] = useState<RehearsalSession[]>(SAMPLE_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<RehearsalSession>(SAMPLE_SESSIONS[0]);
  const [isRecording, setIsRecording] = useState(false);

  // When a rehearsal finishes in Studio, add session and view analytics
  const handleSessionFinished = (newSession: RehearsalSession) => {
    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSession);
    setIsRecording(false);
    setCurrentTab('analytics');
  };

  const handleSelectDeckForRehearsal = (deck: PresentationDeck) => {
    setActiveDeck(deck);
    setCurrentTab('studio');
  };

  const handleUpdateDeck = (updatedDeck: PresentationDeck) => {
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    if (activeDeck.id === updatedDeck.id) {
      setActiveDeck(updatedDeck);
    }
  };

  const handleCreateDeck = (newDeck: PresentationDeck) => {
    setDecks(prev => [newDeck, ...prev]);
    setActiveDeck(newDeck);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-[#4f46e5] selection:text-white">
      
      {/* Top Application Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeDeck={activeDeck}
        isRecording={isRecording}
        onQuickRehearse={() => setCurrentTab('studio')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'studio' && (
          <LiveRehearsalStudio
            activeDeck={activeDeck}
            onFinishSession={handleSessionFinished}
            onSwitchDeck={() => setCurrentTab('decks')}
          />
        )}

        {currentTab === 'analytics' && (
          <SessionAnalyticsView
            session={selectedSession}
            onRehearseAgain={() => setCurrentTab('studio')}
            onViewAllRuns={() => setCurrentTab('progress')}
          />
        )}

        {currentTab === 'decks' && (
          <DeckLibraryView
            decks={decks}
            activeDeck={activeDeck}
            onSelectDeck={setActiveDeck}
            onUpdateDeck={handleUpdateDeck}
            onCreateDeck={handleCreateDeck}
            onStartRehearsal={handleSelectDeckForRehearsal}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressHistoryView
            sessions={sessions}
            onSelectSession={(sess) => {
              setSelectedSession(sess);
              setCurrentTab('analytics');
            }}
            onRehearseNow={() => setCurrentTab('studio')}
          />
        )}

        {currentTab === 'coach' && (
          <CoachConsultationView
            activeDeck={activeDeck}
            onGoToStudio={() => setCurrentTab('studio')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777587]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#4f46e5]" />
            <span className="font-semibold text-[#131b2e]">Vocalis Studio</span>
            <span>• High-Performance Speech & Pitch Coaching System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-[#047857]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real-Time WebAudio & Gemini 3.8 Flash Powered</span>
            </span>
            <span>Optimal Pitch Cadence: 130–155 WPM</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
