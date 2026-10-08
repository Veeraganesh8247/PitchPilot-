export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  targetDurationSec: number;
  scriptNotes: string;
  keyTakeaway: string;
  recommendedPaceWPM: number;
}

export interface PresentationDeck {
  id: string;
  title: string;
  category: 'Investor Pitch' | 'Keynote' | 'All-Hands' | 'Product Launch' | 'Sales Pitch';
  description: string;
  targetDurationTotalSec: number;
  targetWPM: number;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

export interface FillerOccurrence {
  id: string;
  word: string;
  timestampSec: number;
  slideNumber: number;
  contextPhrase: string;
}

export interface WpmDataPoint {
  timestampSec: number;
  wpm: number;
  slideNumber: number;
  isRushing: boolean;
  isDragging: boolean;
}

export interface SlidePerformance {
  slideNumber: number;
  slideTitle: string;
  actualDurationSec: number;
  targetDurationSec: number;
  averageWpm: number;
  targetWpm: number;
  fillerWordCount: number;
  score: number;
  status: 'Optimal' | 'Rushed' | 'Overtime' | 'Monotone';
  pacingDriftPercent: number;
  aiCoachingNote: string;
}

export interface TranscriptSegment {
  id: string;
  text: string;
  timestampSec: number;
  endTimestampSec: number;
  slideNumber: number;
  wpm: number;
  category?: 'normal' | 'filler' | 'rushed' | 'drag' | 'high-impact' | 'power-pause';
  fillerWord?: string;
  aiImprovement?: string;
}

export interface PracticeDrill {
  id: string;
  title: string;
  targetSkill: 'Pacing Control' | 'Filler Elimination' | 'Vocal Variety' | 'Power Pauses' | 'Executive Hook';
  durationMinutes: number;
  instructions: string[];
  sampleSentence: string;
}

export interface RehearsalSession {
  id: string;
  deckId: string;
  deckTitle: string;
  recordedAt: string;
  durationSec: number;
  totalWords: number;
  overallScore: number; // 0-100 Executive Presence Index
  
  metrics: {
    averageWpm: number;
    targetWpm: number;
    wpmVariance: number;
    optimalPacingPercentage: number;
    
    fillerCount: number;
    fillerRatePerMinute: number;
    fillerBreakdown: Record<string, number>;
    
    vocalVarietyScore: number; // 0-100
    monotoneRisk: 'Low' | 'Moderate' | 'Elevated';
    
    pauseMasteryScore: number;
    deliberatePausesCount: number;
    awkwardPausesCount: number;
    
    clarityScore: number;
    energyScore: number;
  };

  wpmTimeline: WpmDataPoint[];
  fillerOccurrences: FillerOccurrence[];
  slidePerformances: SlidePerformance[];
  transcriptSegments: TranscriptSegment[];
  fullTranscript: string;

  aiCritique: {
    executiveHeadline: string;
    summary: string;
    strengths: string[];
    priorityFixes: string[];
    recommendedDrills: PracticeDrill[];
  };
}
