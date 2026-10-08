import { RehearsalSession } from '../types';

export const SAMPLE_SESSIONS: RehearsalSession[] = [
  {
    id: 'session-rec-03',
    deckId: 'deck-series-a',
    deckTitle: 'Aura Robotics — Series A Investor Pitch',
    recordedAt: '2026-10-07T14:32:00Z',
    durationSec: 295,
    totalWords: 698,
    overallScore: 92, // High Executive Presence
    metrics: {
      averageWpm: 142,
      targetWpm: 140,
      wpmVariance: 11,
      optimalPacingPercentage: 88,
      fillerCount: 5,
      fillerRatePerMinute: 1.01,
      fillerBreakdown: {
        'um': 2,
        'like': 1,
        'basically': 1,
        'you know': 1,
        'uh': 0
      },
      vocalVarietyScore: 84,
      monotoneRisk: 'Low',
      pauseMasteryScore: 90,
      deliberatePausesCount: 14,
      awkwardPausesCount: 1,
      clarityScore: 94,
      energyScore: 89
    },
    wpmTimeline: [
      { timestampSec: 15, wpm: 136, slideNumber: 1, isRushing: false, isDragging: false },
      { timestampSec: 30, wpm: 138, slideNumber: 1, isRushing: false, isDragging: false },
      { timestampSec: 45, wpm: 141, slideNumber: 1, isRushing: false, isDragging: false },
      { timestampSec: 65, wpm: 145, slideNumber: 2, isRushing: false, isDragging: false },
      { timestampSec: 85, wpm: 149, slideNumber: 2, isRushing: false, isDragging: false },
      { timestampSec: 100, wpm: 142, slideNumber: 2, isRushing: false, isDragging: false },
      { timestampSec: 125, wpm: 144, slideNumber: 3, isRushing: false, isDragging: false },
      { timestampSec: 145, wpm: 168, slideNumber: 3, isRushing: true, isDragging: false }, // Slight rush spike
      { timestampSec: 160, wpm: 148, slideNumber: 3, isRushing: false, isDragging: false },
      { timestampSec: 180, wpm: 134, slideNumber: 4, isRushing: false, isDragging: false },
      { timestampSec: 205, wpm: 136, slideNumber: 4, isRushing: false, isDragging: false },
      { timestampSec: 225, wpm: 152, slideNumber: 5, isRushing: false, isDragging: false },
      { timestampSec: 245, wpm: 146, slideNumber: 5, isRushing: false, isDragging: false },
      { timestampSec: 270, wpm: 132, slideNumber: 6, isRushing: false, isDragging: false },
      { timestampSec: 290, wpm: 128, slideNumber: 6, isRushing: false, isDragging: false }
    ],
    fillerOccurrences: [
      { id: 'f1', word: 'um', timestampSec: 42, slideNumber: 1, contextPhrase: 'And um... this leads to massive fulfillment delays.' },
      { id: 'f2', word: 'like', timestampSec: 92, slideNumber: 2, contextPhrase: 'Our neural SLAM behaves like an organic sensory organ.' },
      { id: 'f3', word: 'basically', timestampSec: 148, slideNumber: 3, contextPhrase: 'With DHL, basically our expansion grew 140% in quarter two.' },
      { id: 'f4', word: 'you know', timestampSec: 210, slideNumber: 4, contextPhrase: 'When you manufacture commodity hardware, you know, margins can compress unless protected.' },
      { id: 'f5', word: 'um', timestampSec: 265, slideNumber: 6, contextPhrase: 'We are raising um... fourteen million dollars in this Series A.' }
    ],
    slidePerformances: [
      {
        slideNumber: 1,
        slideTitle: 'The Industrial Bottleneck',
        actualDurationSec: 46,
        targetDurationSec: 45,
        averageWpm: 138,
        targetWpm: 135,
        fillerWordCount: 1,
        score: 95,
        status: 'Optimal',
        pacingDriftPercent: 2.2,
        aiCoachingNote: 'Superb opening gravity. Your pause after "$85B deadweight loss" gave investors time to absorb the scale.'
      },
      {
        slideNumber: 2,
        slideTitle: 'The Autonomous Core: Aura OS',
        actualDurationSec: 54,
        targetDurationSec: 55,
        averageWpm: 144,
        targetWpm: 140,
        fillerWordCount: 1,
        score: 92,
        status: 'Optimal',
        pacingDriftPercent: -1.8,
        aiCoachingNote: 'Crisp articulation of the neural SLAM architecture. Very natural vocal pitch modulation.'
      },
      {
        slideNumber: 3,
        slideTitle: 'Commercial Traction & Live Pilots',
        actualDurationSec: 58,
        targetDurationSec: 60,
        averageWpm: 154,
        targetWpm: 138,
        fillerWordCount: 1,
        score: 87,
        status: 'Rushed',
        pacingDriftPercent: 11.5,
        aiCoachingNote: 'Pace briefly surged to 168 WPM around the Maersk contract metric. Remember to let your traction breathe.'
      },
      {
        slideNumber: 4,
        slideTitle: 'Unit Economics & Scaled Hardware Margin',
        actualDurationSec: 48,
        targetDurationSec: 50,
        averageWpm: 135,
        targetWpm: 135,
        fillerWordCount: 1,
        score: 94,
        status: 'Optimal',
        pacingDriftPercent: -4.0,
        aiCoachingNote: 'Defensive, measured, and highly credible tone on gross margin defenses.'
      },
      {
        slideNumber: 5,
        slideTitle: 'Defensible Moat: Fleet Telemetry Flywheel',
        actualDurationSec: 44,
        targetDurationSec: 45,
        averageWpm: 148,
        targetWpm: 142,
        fillerWordCount: 0,
        score: 96,
        status: 'Optimal',
        pacingDriftPercent: -2.2,
        aiCoachingNote: 'Zero filler words. High rhythmic velocity that conveyed technical leadership effortlessly.'
      },
      {
        slideNumber: 6,
        slideTitle: 'The $14M Series A Round',
        actualDurationSec: 45,
        targetDurationSec: 45,
        averageWpm: 130,
        targetWpm: 130,
        fillerWordCount: 1,
        score: 89,
        status: 'Optimal',
        pacingDriftPercent: 0.0,
        aiCoachingNote: 'You hesitated slightly before the valuation and ask ($14M). Next run, state the round size with zero vocal ramp-up.'
      }
    ],
    transcriptSegments: [
      {
        id: 't1',
        text: 'Good morning partners. Over 420,000 industrial fulfillment centers across North America and Europe are operating under severe constraint.',
        timestampSec: 0,
        endTimestampSec: 14,
        slideNumber: 1,
        wpm: 134,
        category: 'high-impact'
      },
      {
        id: 't2',
        text: 'This is not a temporary supply shock. It is an enduring $85 billion annual deadweight loss in global logistics.',
        timestampSec: 15,
        endTimestampSec: 28,
        slideNumber: 1,
        wpm: 137,
        category: 'high-impact'
      },
      {
        id: 't3',
        text: 'Legacy robotic carriers require months of optical magnetic tape, and um... this leads to massive fulfillment delays whenever workflows shift.',
        timestampSec: 29,
        endTimestampSec: 46,
        slideNumber: 1,
        wpm: 142,
        category: 'filler',
        fillerWord: 'um',
        aiImprovement: 'Replace "and um... this leads to" with "which systematically freezes throughput during peak seasons."'
      },
      {
        id: 't4',
        text: 'We built Aura OS: zero-infrastructure autonomous spatial navigation. Our neural SLAM processes edge camera feeds at sixty frames per second.',
        timestampSec: 47,
        endTimestampSec: 68,
        slideNumber: 2,
        wpm: 143,
        category: 'normal'
      },
      {
        id: 't5',
        text: 'In practice, our neural SLAM behaves like an organic sensory organ, mapping uncharted warehouse aisles in under four minutes.',
        timestampSec: 69,
        endTimestampSec: 88,
        slideNumber: 2,
        wpm: 146,
        category: 'normal'
      },
      {
        id: 't6',
        text: 'Today, we have 3.4 million dollars in contracted annual recurring revenue, and with DHL, basically our expansion grew 140% in quarter two.',
        timestampSec: 102,
        endTimestampSec: 124,
        slideNumber: 3,
        wpm: 166,
        category: 'rushed',
        fillerWord: 'basically',
        aiImprovement: 'Pacing was 166 WPM here. Say: "DHL alone expanded 140% quarter-over-quarter, driven by automated pallet turnover."'
      },
      {
        id: 't7',
        text: 'Notice our unit economics. We achieve seventy-eight percent blended gross margins because our compute runs on commoditized edge silicon.',
        timestampSec: 162,
        endTimestampSec: 188,
        slideNumber: 4,
        wpm: 133,
        category: 'high-impact'
      },
      {
        id: 't8',
        text: 'When you manufacture commodity hardware, you know, margins can compress unless protected by deep software lock-in.',
        timestampSec: 189,
        endTimestampSec: 210,
        slideNumber: 4,
        wpm: 138,
        category: 'filler',
        fillerWord: 'you know',
        aiImprovement: 'Eliminate conversational hedges. State: "Hardware margins are protected through our embedded telemetry platform."'
      },
      {
        id: 't9',
        text: 'Every single mile driven by our fleet continuously trains our central model. That creates a defensible 4.2 million operational hour flywheel.',
        timestampSec: 211,
        endTimestampSec: 250,
        slideNumber: 5,
        wpm: 146,
        category: 'power-pause'
      },
      {
        id: 't10',
        text: 'We are raising um... fourteen million dollars in this Series A to accelerate our commercial pipeline and scale our US deployments. Thank you.',
        timestampSec: 251,
        endTimestampSec: 295,
        slideNumber: 6,
        wpm: 129,
        category: 'filler',
        fillerWord: 'um',
        aiImprovement: 'Remove the hesitation before the capital amount: "We are raising fourteen million dollars to scale US deployments and execute our 18-month roadmap."'
      }
    ],
    fullTranscript: 'Good morning partners. Over 420,000 industrial fulfillment centers across North America and Europe are operating under severe constraint. This is not a temporary supply shock. It is an enduring $85 billion annual deadweight loss in global logistics. Legacy robotic carriers require months of optical magnetic tape, and um... this leads to massive fulfillment delays whenever workflows shift. We built Aura OS: zero-infrastructure autonomous spatial navigation. Our neural SLAM processes edge camera feeds at sixty frames per second. In practice, our neural SLAM behaves like an organic sensory organ, mapping uncharted warehouse aisles in under four minutes. Today, we have 3.4 million dollars in contracted annual recurring revenue, and with DHL, basically our expansion grew 140% in quarter two. Notice our unit economics. We achieve seventy-eight percent blended gross margins because our compute runs on commoditized edge silicon. When you manufacture commodity hardware, you know, margins can compress unless protected by deep software lock-in. Every single mile driven by our fleet continuously trains our central model. That creates a defensible 4.2 million operational hour flywheel. We are raising um... fourteen million dollars in this Series A to accelerate our commercial pipeline and scale our US deployments. Thank you.',
    aiCritique: {
      executiveHeadline: 'Authoritative, calm, and venture-grade cadence with minor speed spikes on traction metrics.',
      summary: 'You demonstrated exceptional executive command throughout the initial problem statement and unit economics. Vocal inflection sounded confident and grounded. Your pacing remained in the sweet spot (130-145 WPM) for 88% of your session.',
      strengths: [
        'Deliberate power pause after the $85B market opportunity statement gave the room gravity.',
        'Zero vocal fry and crisp articulation across technical terminology like neural SLAM.',
        'Pacing deceleration to 133 WPM during unit economics increased investor credibility.'
      ],
      priorityFixes: [
        'Traction slide acceleration: You jumped from 144 WPM to 168 WPM when discussing DHL numbers. Slow down to highlight key wins.',
        'Hesitation before the ask: A micro-hesitation ("um...") occurred right before "$14M". Practice declaring the valuation and ask with unshakeable stillness.',
        'Eliminate colloquial "you know" filler when addressing hardware margins.'
      ],
      recommendedDrills: [
        {
          id: 'drill-1',
          title: 'The Unflinching Ask Drill',
          targetSkill: 'Power Pauses',
          durationMinutes: 3,
          instructions: [
            'Inhale deeply through your diaphragm.',
            'Maintain level eye contact with the camera.',
            'Deliver the sentence with downward pitch inflection at the end, then hold 2 seconds of silence.'
          ],
          sampleSentence: 'We are raising fourteen million dollars to scale fleet manufacturing and capture the US enterprise pipeline.'
        },
        {
          id: 'drill-2',
          title: 'The Traction Metric Anchor',
          targetSkill: 'Pacing Control',
          durationMinutes: 4,
          instructions: [
            'Speak the metric at 120 WPM—one-third slower than your conversational speed.',
            'Emphasize the multiplier ("one hundred forty percent") with deliberate syllables.'
          ],
          sampleSentence: 'Contracted revenue stands at three point four million, with one hundred forty percent net expansion.'
        }
      ]
    }
  },
  {
    id: 'session-rec-02',
    deckId: 'deck-series-a',
    deckTitle: 'Aura Robotics — Series A Investor Pitch',
    recordedAt: '2026-10-05T11:15:00Z',
    durationSec: 275,
    totalWords: 720,
    overallScore: 81,
    metrics: {
      averageWpm: 157,
      targetWpm: 140,
      wpmVariance: 24,
      optimalPacingPercentage: 62,
      fillerCount: 14,
      fillerRatePerMinute: 3.05,
      fillerBreakdown: {
        'um': 5,
        'like': 4,
        'basically': 3,
        'you know': 2
      },
      vocalVarietyScore: 71,
      monotoneRisk: 'Moderate',
      pauseMasteryScore: 73,
      deliberatePausesCount: 6,
      awkwardPausesCount: 5,
      clarityScore: 82,
      energyScore: 86
    },
    wpmTimeline: [
      { timestampSec: 15, wpm: 162, slideNumber: 1, isRushing: true, isDragging: false },
      { timestampSec: 40, wpm: 168, slideNumber: 1, isRushing: true, isDragging: false },
      { timestampSec: 70, wpm: 155, slideNumber: 2, isRushing: false, isDragging: false },
      { timestampSec: 110, wpm: 172, slideNumber: 3, isRushing: true, isDragging: false },
      { timestampSec: 150, wpm: 150, slideNumber: 4, isRushing: false, isDragging: false },
      { timestampSec: 200, wpm: 160, slideNumber: 5, isRushing: true, isDragging: false },
      { timestampSec: 250, wpm: 142, slideNumber: 6, isRushing: false, isDragging: false }
    ],
    fillerOccurrences: [
      { id: 'f-prev1', word: 'um', timestampSec: 18, slideNumber: 1, contextPhrase: 'And um... warehouses are having problems.' },
      { id: 'f-prev2', word: 'like', timestampSec: 52, slideNumber: 2, contextPhrase: 'It is like super fast to deploy.' }
    ],
    slidePerformances: [
      {
        slideNumber: 1,
        slideTitle: 'The Industrial Bottleneck',
        actualDurationSec: 38,
        targetDurationSec: 45,
        averageWpm: 164,
        targetWpm: 135,
        fillerWordCount: 3,
        score: 76,
        status: 'Rushed',
        pacingDriftPercent: 21.4,
        aiCoachingNote: 'Spoke 7 seconds too fast. Pacing felt nervous.'
      },
      {
        slideNumber: 2,
        slideTitle: 'The Autonomous Core',
        actualDurationSec: 50,
        targetDurationSec: 55,
        averageWpm: 156,
        targetWpm: 140,
        fillerWordCount: 4,
        score: 80,
        status: 'Rushed',
        pacingDriftPercent: 11.4,
        aiCoachingNote: 'Good passion, but multiple filler words diminished technical authority.'
      }
    ],
    transcriptSegments: [],
    fullTranscript: 'Summary rehearsal recording run #2.',
    aiCritique: {
      executiveHeadline: 'Fast delivery with 14 filler words; strong energy but needed intentional deceleration.',
      summary: 'High enthusiasm, but 157 WPM average made key financial details slide past too quickly.',
      strengths: ['High vocal stamina and energy', 'Clear mission conviction'],
      priorityFixes: ['Slow down pace by 15 WPM', 'Replace "um" with silence'],
      recommendedDrills: []
    }
  },
  {
    id: 'session-rec-01',
    deckId: 'deck-series-a',
    deckTitle: 'Aura Robotics — Series A Investor Pitch',
    recordedAt: '2026-10-02T09:40:00Z',
    durationSec: 260,
    totalWords: 745,
    overallScore: 74,
    metrics: {
      averageWpm: 172,
      targetWpm: 140,
      wpmVariance: 32,
      optimalPacingPercentage: 45,
      fillerCount: 19,
      fillerRatePerMinute: 4.38,
      fillerBreakdown: {
        'um': 7,
        'like': 6,
        'basically': 4,
        'uh': 2
      },
      vocalVarietyScore: 65,
      monotoneRisk: 'Elevated',
      pauseMasteryScore: 60,
      deliberatePausesCount: 3,
      awkwardPausesCount: 8,
      clarityScore: 75,
      energyScore: 84
    },
    wpmTimeline: [
      { timestampSec: 20, wpm: 178, slideNumber: 1, isRushing: true, isDragging: false },
      { timestampSec: 60, wpm: 174, slideNumber: 2, isRushing: true, isDragging: false },
      { timestampSec: 120, wpm: 180, slideNumber: 3, isRushing: true, isDragging: false },
      { timestampSec: 180, wpm: 168, slideNumber: 4, isRushing: true, isDragging: false }
    ],
    fillerOccurrences: [],
    slidePerformances: [],
    transcriptSegments: [],
    fullTranscript: 'Initial baseline recording run #1.',
    aiCritique: {
      executiveHeadline: 'Baseline Run: Rapid delivery (172 WPM) with 19 fillers.',
      summary: 'Foundational pass. Strong raw material, but significant room to develop executive pacing.',
      strengths: ['Good energy', 'Articulate concepts'],
      priorityFixes: ['Reduce speech speed', 'Eliminate rushing on slides 2 and 3'],
      recommendedDrills: []
    }
  }
];
