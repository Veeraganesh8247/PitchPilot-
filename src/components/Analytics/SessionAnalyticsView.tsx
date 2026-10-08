import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  Gauge, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  RotateCcw, 
  Share2, 
  Printer, 
  Sliders, 
  Zap, 
  ChevronRight, 
  Volume2, 
  HelpCircle, 
  Filter, 
  ArrowUpRight,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { RehearsalSession, SlidePerformance, TranscriptSegment, PracticeDrill } from '../../types';
import { askCoachVocalis } from '../../services/geminiService';

interface SessionAnalyticsViewProps {
  session: RehearsalSession;
  onRehearseAgain: () => void;
  onViewAllRuns: () => void;
}

export const SessionAnalyticsView: React.FC<SessionAnalyticsViewProps> = ({
  session,
  onRehearseAgain,
  onViewAllRuns
}) => {
  // Scrubber state
  const [scrubberTimeSec, setScrubberTimeSec] = useState<number>(0);
  const [transcriptFilter, setTranscriptFilter] = useState<'all' | 'filler' | 'rushed' | 'impact'>('all');
  
  // Custom Coach Ask State
  const [userQuestion, setUserQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState<{ answer: string; drillRecommendation?: string } | null>(null);
  const [isAskingCoach, setIsAskingCoach] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Active slide at scrubber position
  const activeSlideNumber = (() => {
    let acc = 0;
    for (const sp of session.slidePerformances) {
      acc += sp.actualDurationSec;
      if (scrubberTimeSec <= acc) return sp.slideNumber;
    }
    return session.slidePerformances[session.slidePerformances.length - 1]?.slideNumber || 1;
  })();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAskCoach = async (overridePrompt?: string) => {
    const query = overridePrompt || userQuestion;
    if (!query.trim()) return;
    setIsAskingCoach(true);
    try {
      const res = await askCoachVocalis(query, {
        deckTitle: session.deckTitle,
        averageWpm: session.metrics.averageWpm,
        fillerCount: session.metrics.fillerCount,
        lastScore: session.overallScore
      });
      setCoachAnswer(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAskingCoach(false);
    }
  };

  // Filtered transcript segments
  const filteredSegments = session.transcriptSegments.filter(seg => {
    if (transcriptFilter === 'all') return true;
    if (transcriptFilter === 'filler') return seg.category === 'filler';
    if (transcriptFilter === 'rushed') return seg.category === 'rushed' || seg.wpm > 160;
    if (transcriptFilter === 'impact') return seg.category === 'high-impact' || seg.category === 'power-pause';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">

      {/* Hero Header & Executive Score Card */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-3xl p-6 sm:p-8 shadow-xl ai-glow relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Session metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/15">
                Session Diagnostic Complete
              </span>
              <span className="text-xs text-indigo-300">
                {new Date(session.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {formatTime(session.durationSec)} runtime
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {session.deckTitle}
            </h1>
            <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {session.aiCritique.executiveHeadline}
            </p>
          </div>

          {/* Right: Executive Score & Rehearse Again CTA */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 self-stretch lg:self-auto justify-between lg:justify-start">
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                Presence Index
              </div>
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white tabular-nums tracking-tight">
                {session.overallScore}
                <span className="text-lg font-normal text-indigo-300">/100</span>
              </div>
              <div className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{session.overallScore >= 90 ? 'Investor Ready' : 'Strong Progress'}</span>
              </div>
            </div>

            <div className="h-14 w-px bg-white/20 hidden sm:block" />

            <div className="flex flex-col gap-2">
              <button
                onClick={onRehearseAgain}
                className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rehearse Deck</span>
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-white/10"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>

          </div>

        </div>

        {/* Sub-Pill Performance Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-indigo-200">Cadence Mastery</div>
            <div className="font-heading font-bold text-lg text-white tabular-nums">
              {session.metrics.optimalPacingPercentage}%
            </div>
            <div className="text-[11px] text-indigo-300">Optimal 130-155 WPM</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-indigo-200">Verbal Economy</div>
            <div className="font-heading font-bold text-lg text-white tabular-nums">
              {session.metrics.fillerCount === 0 ? '100%' : `${Math.max(60, 100 - session.metrics.fillerCount * 4)}%`}
            </div>
            <div className="text-[11px] text-indigo-300">{session.metrics.fillerCount} total hesitations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-indigo-200">Vocal Dynamism</div>
            <div className="font-heading font-bold text-lg text-white tabular-nums">
              {session.metrics.vocalVarietyScore}%
            </div>
            <div className="text-[11px] text-indigo-300">Monotone Risk: {session.metrics.monotoneRisk}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-indigo-200">Clarity & Pauses</div>
            <div className="font-heading font-bold text-lg text-white tabular-nums">
              {session.metrics.pauseMasteryScore}%
            </div>
            <div className="text-[11px] text-indigo-300">{session.metrics.deliberatePausesCount} deliberate pauses</div>
          </div>
        </div>

      </div>

      {/* Four Primary Analytical Metric Cards with 4px Health Accent Border */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Pacing & Cadence */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow border-l-4 border-l-[#10B981] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
              Cadence & Pace
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Gauge className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e] tabular-nums">
                {session.metrics.averageWpm}
              </span>
              <span className="text-xs font-semibold text-[#777587]">WPM</span>
            </div>
            <div className="text-xs text-[#047857] font-semibold mt-0.5">
              Target: {session.metrics.targetWpm} WPM (±{session.metrics.wpmVariance} dev)
            </div>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Maintained optimal pace across {session.metrics.optimalPacingPercentage}% of speaking time. No severe drags.
          </p>
        </div>

        {/* Card 2: Filler Word Density */}
        <div className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow border-l-4 ${
          session.metrics.fillerCount <= 3 ? 'border-l-[#10B981]' : 'border-l-[#F59E0B]'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
              Filler Density
            </span>
            <span className={`p-1.5 rounded-lg ${session.metrics.fillerCount <= 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e] tabular-nums">
                {session.metrics.fillerCount}
              </span>
              <span className="text-xs font-semibold text-[#777587]">Fillers</span>
            </div>
            <div className="text-xs text-amber-700 font-semibold mt-0.5">
              {session.metrics.fillerRatePerMinute} per min rate
            </div>
          </div>

          {/* Breakdown pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Object.entries(session.metrics.fillerBreakdown).map(([word, cnt]) => (
              cnt > 0 && (
                <span key={word} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {word}: {cnt}
                </span>
              )
            ))}
          </div>
        </div>

        {/* Card 3: Vocal Dynamism */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow border-l-4 border-l-[#4F46E5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
              Vocal Modulation
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e] tabular-nums">
                {session.metrics.vocalVarietyScore}
              </span>
              <span className="text-xs font-semibold text-[#777587]">/100</span>
            </div>
            <div className="text-xs text-[#4338CA] font-semibold mt-0.5">
              Monotone Risk: {session.metrics.monotoneRisk}
            </div>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Effective pitch contouring. Emphasized pivotal hardware margins without nervous uptalk.
          </p>
        </div>

        {/* Card 4: Executive Pauses */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow border-l-4 border-l-[#10B981] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
              Power Pauses
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-3xl text-[#131b2e] tabular-nums">
                {session.metrics.deliberatePausesCount}
              </span>
              <span className="text-xs font-semibold text-[#777587]">Pauses</span>
            </div>
            <div className="text-xs text-[#047857] font-semibold mt-0.5">
              Mastery: {session.metrics.pauseMasteryScore}%
            </div>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Constructive silence allowed key metrics to settle in the listener's memory before transition.
          </p>
        </div>

      </div>

      {/* Interactive Timeline & Waveform Scrubber */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#131b2e]">
              Interactive Session Cadence Scrubber
            </h3>
            <p className="text-xs text-[#777587]">
              Drag the scrubber to inspect pacing spikes, filler word locations, and slide transitions across your rehearsal.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#faf8ff] border border-[#e2e7ff] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[#777587]">Selected:</span>
            <span className="font-bold text-[#131b2e] tabular-nums">{formatTime(scrubberTimeSec)}</span>
            <span className="text-[#777587]">•</span>
            <span className="font-semibold text-[#4f46e5]">Slide {activeSlideNumber}</span>
          </div>
        </div>

        {/* Timeline Visualization Track */}
        <div className="space-y-2">
          <div className="relative h-20 bg-[#faf8ff] rounded-xl border border-[#e2e7ff] p-3 overflow-hidden flex items-end">
            
            {/* Visual WPM bars */}
            <div className="w-full flex items-end justify-between h-14 gap-1">
              {session.wpmTimeline.map((pt, idx) => {
                const heightPercent = Math.min(100, Math.max(20, ((pt.wpm - 80) / 120) * 100));
                let barColor = 'bg-[#4f46e5]';
                if (pt.isRushing) barColor = 'bg-amber-500';
                if (pt.isDragging) barColor = 'bg-sky-400';

                return (
                  <div
                    key={idx}
                    onClick={() => setScrubberTimeSec(pt.timestampSec)}
                    className="flex-1 group cursor-pointer relative h-full flex items-end"
                  >
                    <div 
                      className={`w-full rounded-t-sm transition-all group-hover:opacity-80 ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded-sm whitespace-nowrap z-20">
                      {pt.wpm} WPM @ {formatTime(pt.timestampSec)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filler markers on timeline */}
            {session.fillerOccurrences.map(fill => {
              const leftPercent = Math.min(98, Math.max(2, (fill.timestampSec / session.durationSec) * 100));
              return (
                <div
                  key={fill.id}
                  onClick={() => setScrubberTimeSec(fill.timestampSec)}
                  className="absolute top-1.5 -translate-x-1/2 cursor-pointer z-10"
                  style={{ left: `${leftPercent}%` }}
                  title={`Filler "${fill.word}" at ${formatTime(fill.timestampSec)}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white shadow-xs animate-pulse" />
                </div>
              );
            })}

            {/* Scrubber Needle */}
            {(() => {
              const needlePos = Math.min(100, Math.max(0, (scrubberTimeSec / session.durationSec) * 100));
              return (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20"
                  style={{ left: `${needlePos}%` }}
                >
                  <div className="w-3 h-3 bg-red-500 -ml-1.5 rounded-full shadow-sm" />
                </div>
              );
            })()}
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min={0}
            max={session.durationSec}
            value={scrubberTimeSec}
            onChange={(e) => setScrubberTimeSec(Number(e.target.value))}
            className="w-full accent-[#4f46e5] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-[#777587]">
            <span>0:00 (Start)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Optimal Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Pace Surge / Filler Ping
              </span>
            </div>
            <span>{formatTime(session.durationSec)} (End)</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Slide Scorecards & Full Interactive Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Slide-by-Slide Diagnostic Matrix (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#131b2e]">
                  Slide-by-Slide Scorecards
                </h3>
                <p className="text-xs text-[#777587]">
                  Time discipline and cadence breakdown per presentation slide
                </p>
              </div>
              <span className="text-xs font-semibold text-[#4f46e5] bg-[#eef2ff] px-2.5 py-1 rounded-full">
                {session.slidePerformances.length} Slides
              </span>
            </div>

            <div className="space-y-3">
              {session.slidePerformances.map((perf) => (
                <div 
                  key={perf.slideNumber}
                  className={`p-4 rounded-xl border transition-all ${
                    activeSlideNumber === perf.slideNumber
                      ? 'bg-[#f2f3ff] border-[#4f46e5] shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#faf8ff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#eaedff] text-[#3525cd] font-bold text-xs flex items-center justify-center">
                        {perf.slideNumber}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-[#131b2e]">
                          {perf.slideTitle}
                        </h4>
                        <div className="text-xs text-[#777587] flex items-center gap-2 mt-0.5">
                          <span>{formatTime(perf.actualDurationSec)} actual / {formatTime(perf.targetDurationSec)} target</span>
                          <span>•</span>
                          <span className="tabular-nums font-medium text-[#131b2e]">{perf.averageWpm} WPM</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        perf.status === 'Optimal' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {perf.status}
                      </span>
                      <div className="text-xs font-bold text-[#131b2e] mt-1 tabular-nums">
                        {perf.score}/100
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#464555] mt-2.5 pt-2.5 border-t border-[#dae2fd]/60 leading-relaxed">
                    💡 <span className="font-semibold">Coaching Note:</span> {perf.aiCoachingNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Transcript with AI Rewrites (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#131b2e]">
                  Interactive Transcript & Rewrites
                </h3>
                <p className="text-xs text-[#777587]">
                  Color-coded verbal delivery with executive alternative suggestions
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl text-xs">
                <button
                  onClick={() => setTranscriptFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    transcriptFilter === 'all' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#777587]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTranscriptFilter('filler')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    transcriptFilter === 'filler' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#777587]'
                  }`}
                >
                  Fillers
                </button>
                <button
                  onClick={() => setTranscriptFilter('rushed')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    transcriptFilter === 'rushed' ? 'bg-white text-indigo-700 shadow-xs' : 'text-[#777587]'
                  }`}
                >
                  Rushed
                </button>
                <button
                  onClick={() => setTranscriptFilter('impact')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    transcriptFilter === 'impact' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#777587]'
                  }`}
                >
                  High Impact
                </button>
              </div>
            </div>

            {/* Transcript stream */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredSegments.map((seg) => {
                const isSelectedTime = scrubberTimeSec >= seg.timestampSec && scrubberTimeSec <= seg.endTimestampSec;
                return (
                  <div
                    key={seg.id}
                    onClick={() => setScrubberTimeSec(seg.timestampSec)}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelectedTime
                        ? 'bg-[#EEF2FF] border-[#4F46E5] ring-2 ring-indigo-500/20'
                        : seg.category === 'filler'
                        ? 'bg-amber-50/60 border-amber-200'
                        : seg.category === 'rushed'
                        ? 'bg-purple-50/60 border-purple-200'
                        : seg.category === 'high-impact'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-[#faf8ff] border-[#e2e7ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#777587] mb-1.5">
                      <span className="font-semibold text-[#131b2e]">
                        Slide {seg.slideNumber} • {formatTime(seg.timestampSec)} - {formatTime(seg.endTimestampSec)}
                      </span>
                      <span className="tabular-nums font-medium">
                        {seg.wpm} WPM
                      </span>
                    </div>

                    <p className="text-[#131b2e] leading-relaxed">
                      {seg.text}
                    </p>

                    {/* AI Improvement Popover */}
                    {seg.aiImprovement && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-[#3525cd] bg-white/70 p-2 rounded-lg">
                        <div className="flex items-center gap-1 font-bold text-[10px] text-[#4f46e5] mb-0.5">
                          <Sparkles className="w-3 h-3 text-[#712ae2]" />
                          <span>Executive Rephrase:</span>
                        </div>
                        <p className="italic text-[#464555]">
                          "{seg.aiImprovement}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* AI Coach Action Plan & Practice Drills */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl btn-primary-gradient flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-[#131b2e]">
              Personalized AI Coach Action Plan
            </h3>
            <p className="text-xs text-[#777587]">
              Synthesized by Vocalis Intelligence based on your pacing telemetry and vocal inflections
            </p>
          </div>
        </div>

        {/* Strengths & Priority Fixes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="bg-[#faf8ff] border border-[#e2e7ff] p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#047857] font-heading font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Observed Executive Strengths</span>
            </div>
            <ul className="space-y-2 text-xs text-[#464555]">
              {session.aiCritique.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority Fixes */}
          <div className="bg-[#faf8ff] border border-[#e2e7ff] p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-heading font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>High-Leverage Fixes For Next Run</span>
            </div>
            <ul className="space-y-2 text-xs text-[#464555]">
              {session.aiCritique.priorityFixes.map((fix, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recommended Practice Drills */}
        <div>
          <h4 className="font-heading font-bold text-base text-[#131b2e] mb-3">
            Recommended Practice Drills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session.aiCritique.recommendedDrills.map((drill) => (
              <div 
                key={drill.id}
                className="bg-white rounded-2xl border border-[#dae2fd] p-5 card-shadow space-y-3 hover:border-[#4f46e5] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] px-2.5 py-1 rounded-full">
                    {drill.targetSkill} • {drill.durationMinutes} min
                  </span>
                  <span className="text-xs text-[#777587]">Actionable Drill</span>
                </div>

                <h5 className="font-heading font-bold text-base text-[#131b2e]">
                  {drill.title}
                </h5>

                <ol className="list-decimal list-inside text-xs text-[#464555] space-y-1">
                  {drill.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>

                <div className="bg-[#f2f3ff] p-3 rounded-xl text-xs text-[#131b2e] border border-[#dae2fd]">
                  <span className="font-bold text-[#3525cd] block mb-0.5">Practice Sentence:</span>
                  <span className="italic">"{drill.sampleSentence}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive "Ask Coach Vocalis" Consultation Widget */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#4f46e5]" />
            <h4 className="font-heading font-bold text-base text-[#131b2e]">
              Ask Coach Vocalis About This Session
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleAskCoach("How can I make my closing valuation ask sound firmer and more authoritative?")}
              className="bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              💼 "How do I state the $14M ask more firmly?"
            </button>
            <button
              onClick={() => handleAskCoach("Why did my speed surge on the traction slide and how can I slow down under adrenaline?")}
              className="bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              ⏱️ "How do I curb speed surges on traction metrics?"
            </button>
            <button
              onClick={() => handleAskCoach("Give me a quick 30-second breathing drill before going into an investor pitch.")}
              className="bg-[#faf8ff] hover:bg-[#eef2ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e7ff] px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              🫁 "What's the best pre-pitch breathing drill?"
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about your tone, cadence, pauses, or pitch delivery..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
              className="flex-1 bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
            />
            <button
              onClick={() => handleAskCoach()}
              disabled={isAskingCoach || !userQuestion.trim()}
              className="btn-primary-gradient text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isAskingCoach ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Consult Coach</span>
            </button>
          </div>

          {coachAnswer && (
            <div className="bg-[#f2f3ff] border border-[#dae2fd] rounded-2xl p-4 text-xs space-y-2 ai-glow">
              <div className="flex items-center gap-2 text-[#3525cd] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Coach Vocalis Recommendation</span>
              </div>
              <p className="text-[#131b2e] leading-relaxed">
                {coachAnswer.answer}
              </p>
              {coachAnswer.drillRecommendation && (
                <div className="pt-2 border-t border-[#dae2fd] text-[#464555]">
                  <span className="font-semibold text-[#3525cd]">Target Micro-Drill: </span>
                  {coachAnswer.drillRecommendation}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Share / Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#131b2e]">
                Executive Rehearsal Summary
              </h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-[#777587] hover:text-[#131b2e] text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#faf8ff] p-4 rounded-2xl border border-[#e2e7ff] text-xs space-y-2 font-mono text-[#131b2e]">
              <div className="font-bold text-sm text-[#3525cd]">VOCALIS STUDIO EXECUTIVE SCORECARD</div>
              <div>Deck: {session.deckTitle}</div>
              <div>Executive Presence Index: {session.overallScore}/100</div>
              <div>Average Cadence: {session.metrics.averageWpm} WPM (Target: {session.metrics.targetWpm})</div>
              <div>Filler Words Logged: {session.metrics.fillerCount}</div>
              <div>Power Pauses: {session.metrics.deliberatePausesCount}</div>
              <div className="pt-2 text-xs font-sans text-[#464555]">
                Headline: "{session.aiCritique.executiveHeadline}"
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-white border border-[#E2E8F0] text-[#131b2e] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Scorecard</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Vocalis Studio Rehearsal Report: ${session.deckTitle}\nScore: ${session.overallScore}/100\nAverage WPM: ${session.metrics.averageWpm}\nFillers: ${session.metrics.fillerCount}\n${session.aiCritique.executiveHeadline}`);
                  alert('Scorecard copied to clipboard!');
                  setShowExportModal(false);
                }}
                className="btn-primary-gradient text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Copy Markdown Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
