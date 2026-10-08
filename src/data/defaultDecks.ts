import { PresentationDeck } from '../types';

export const DEFAULT_DECKS: PresentationDeck[] = [
  {
    id: 'deck-series-a',
    title: 'Aura Robotics — Series A Investor Pitch',
    category: 'Investor Pitch',
    description: 'High-stakes 5-minute investor presentation for venture capital partners. Covers problem validation, autonomous perception stack, and unit economics.',
    targetDurationTotalSec: 300,
    targetWPM: 140,
    createdAt: '2026-09-15',
    updatedAt: '2026-10-04',
    slides: [
      {
        id: 's1',
        slideNumber: 1,
        title: 'The Industrial Bottleneck',
        subtitle: 'Why 420,000 global warehouses face acute fulfillment gridlock',
        targetDurationSec: 45,
        recommendedPaceWPM: 135,
        keyTakeaway: 'Labor shortage is structural, not cyclical. Traditional AGVs fail dynamically.',
        scriptNotes: 'Start with grounded gravitas. Do not rush the opening statistic: 420,000 warehouses are operating at 70% throughput. Pause for one beat after naming the $85B annual deadweight loss.'
      },
      {
        id: 's2',
        slideNumber: 2,
        title: 'The Autonomous Core: Aura OS',
        subtitle: 'Zero-infrastructure real-time spatial intelligence at 60 FPS',
        targetDurationSec: 55,
        recommendedPaceWPM: 140,
        keyTakeaway: 'Our neural SLAM eliminates pre-mapped optical beacons entirely.',
        scriptNotes: 'Introduce the core breakthrough with crisp articulation. Avoid technical jargon traps. Clearly state that deployment takes hours, not six months like our competitors.'
      },
      {
        id: 's3',
        slideNumber: 3,
        title: 'Commercial Traction & Live Pilots',
        subtitle: '$3.4M contracted ARR across Fortune 50 supply chain leaders',
        targetDurationSec: 60,
        recommendedPaceWPM: 138,
        keyTakeaway: 'Triple-digit expansion rate in Tier 1 logistics accounts.',
        scriptNotes: 'Highlight the 18-month payback period. Emphasize the logos—especially DHL and Maersk. Modulate voice with steady confidence when citing the 142% net dollar retention.'
      },
      {
        id: 's4',
        slideNumber: 4,
        title: 'Unit Economics & Scaled Hardware Margin',
        subtitle: '78% blended gross margin via commodity sensor architecture',
        targetDurationSec: 50,
        recommendedPaceWPM: 135,
        keyTakeaway: 'Hardware is commoditized; software platform captures recurring margin.',
        scriptNotes: 'Slow down when delivering the gross margin figures. Investors always scrutinize hardware margins. Anchor your posture, make deliberate eye contact, and drop your vocal pitch on 78%.'
      },
      {
        id: 's5',
        slideNumber: 5,
        title: 'Defensible Moat: Fleet Telemetry Flywheel',
        subtitle: 'Over 4.2M autonomous operational hours trained in edge environments',
        targetDurationSec: 45,
        recommendedPaceWPM: 142,
        keyTakeaway: 'Network effects compound: every fleet deployment trains our central edge models.',
        scriptNotes: 'Build momentum and energy here. Connect data advantage directly to insurmountable switching barriers.'
      },
      {
        id: 's6',
        slideNumber: 6,
        title: 'The $14M Series A Round',
        subtitle: 'Scaling field engineering, fleet manufacturing, and US enterprise go-to-market',
        targetDurationSec: 45,
        recommendedPaceWPM: 130,
        keyTakeaway: 'Clear 24-month milestones leading to $18M ARR.',
        scriptNotes: 'Close with deliberate, commanding conviction. The ask is $14M. Do not let your voice pitch rise like a question. State the ask with downward inflection and hold the pause.'
      }
    ]
  },
  {
    id: 'deck-keynote-ai',
    title: 'Keynote: The Sovereign Enterprise AI Era',
    category: 'Keynote',
    description: 'Visionary 8-minute keynote address delivered to enterprise CTOs and executive boards. Explores local governance, agentic systems, and trust architecture.',
    targetDurationTotalSec: 480,
    targetWPM: 135,
    createdAt: '2026-09-20',
    updatedAt: '2026-10-06',
    slides: [
      {
        id: 'k1',
        slideNumber: 1,
        title: 'The Centralized Illusion',
        subtitle: 'Why the era of monolithic cloud models is fracturing',
        targetDurationSec: 75,
        recommendedPaceWPM: 130,
        keyTakeaway: 'Data gravity and regulatory sovereignty will force enterprise AI to the private perimeter.',
        scriptNotes: 'Open with a thoughtful rhetorical question. Stand tall, scan the auditorium, and deliver the hook slowly.'
      },
      {
        id: 'k2',
        slideNumber: 2,
        title: 'Agentic Workflows in Production',
        subtitle: 'Moving beyond autocomplete to autonomous business processes',
        targetDurationSec: 100,
        recommendedPaceWPM: 135,
        keyTakeaway: 'Multi-agent orchestration transforms 40-hour audit workflows into 3-minute verified runs.',
        scriptNotes: 'Use vivid contrasts. Compare manual spreadsheet auditing with real-time autonomous reconciliation.'
      },
      {
        id: 'k3',
        slideNumber: 3,
        title: 'The Trust & Verification Boundary',
        subtitle: 'Deterministic guardrails in an inherently probabilistic world',
        targetDurationSec: 90,
        recommendedPaceWPM: 132,
        keyTakeaway: 'Hallucination is not a bug; it is an unconstrained latent space. Guardrails make it bank-grade.',
        scriptNotes: 'Emphasize regulatory compliance and cryptographic provenance.'
      },
      {
        id: 'k4',
        slideNumber: 4,
        title: 'The 2027 Autonomous Enterprise',
        subtitle: 'How market leaders are architecting their self-optimizing business fabric',
        targetDurationSec: 95,
        recommendedPaceWPM: 140,
        keyTakeaway: 'The winners won’t be who has the biggest cluster, but who closes the telemetry loop fastest.',
        scriptNotes: 'Inspire and rally the audience. Build vocal dynamics and warmth.'
      },
      {
        id: 'k5',
        slideNumber: 5,
        title: 'The Call to Action: Build for Sovereignty',
        subtitle: 'Three non-negotiable architectural decisions every CIO must make this quarter',
        targetDurationSec: 120,
        recommendedPaceWPM: 130,
        keyTakeaway: 'Audit your model dependencies today before lock-in solidifies.',
        scriptNotes: 'Deliver your closing points with measured pacing and steady eye contact.'
      }
    ]
  },
  {
    id: 'deck-all-hands',
    title: 'Q4 Global All-Hands: Operational Velocity',
    category: 'All-Hands',
    description: 'Internal executive broadcast aligning 450 cross-functional team members on annual milestones, cultural standards, and upcoming product launches.',
    targetDurationTotalSec: 360,
    targetWPM: 145,
    createdAt: '2026-09-28',
    updatedAt: '2026-10-02',
    slides: [
      {
        id: 'ah1',
        slideNumber: 1,
        title: 'Celebrating Q3 Milestones',
        subtitle: 'Record net retention and our fastest customer onboarding cycle to date',
        targetDurationSec: 70,
        recommendedPaceWPM: 145,
        keyTakeaway: 'Every department contributed directly to our 140% growth.',
        scriptNotes: 'Warm, energized, transparent tone. Celebrate specific teams and call out individual contributors.'
      },
      {
        id: 'ah2',
        slideNumber: 2,
        title: 'Transparent Look at Market Headwinds',
        subtitle: 'Where enterprise deal cycles elongated and how we adapted',
        targetDurationSec: 85,
        recommendedPaceWPM: 138,
        keyTakeaway: 'Candor builds trust: we trimmed non-core experiments to accelerate core product delivery.',
        scriptNotes: 'Direct, honest delivery. Avoid defensive posture; embrace ownership and resilience.'
      },
      {
        id: 'ah3',
        slideNumber: 3,
        title: 'The Q4 Velocity Priorities',
        subtitle: 'Three key bets: Enterprise SOC2 certification, Mobile v2, and Automated Billing',
        targetDurationSec: 95,
        recommendedPaceWPM: 142,
        keyTakeaway: 'Focus is saying no to good ideas so great ideas can win.',
        scriptNotes: 'Drive clarity on priority ranking. Reinforce how cross-team silos must break down.'
      },
      {
        id: 'ah4',
        slideNumber: 4,
        title: 'Our Cultural Standard: Extreme Ownership',
        subtitle: 'How we uphold craft and accountability in a distributed company',
        targetDurationSec: 110,
        recommendedPaceWPM: 136,
        keyTakeaway: 'High performance is a byproduct of high trust and rigorous execution.',
        scriptNotes: 'Inspiring finish. Reiterate gratitude for the team and invite honest questions in Slido.'
      }
    ]
  }
];
