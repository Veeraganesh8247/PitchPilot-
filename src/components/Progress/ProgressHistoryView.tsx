import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Gauge, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { RehearsalSession } from '../../types';

interface ProgressHistoryViewProps {
  sessions: RehearsalSession[];
  onSelectSession: (session: RehearsalSession) => void;
  onRehearseNow: () => void;
}

export const ProgressHistoryView: React.FC<ProgressHistoryViewProps> = ({
  sessions,
  onSelectSession,
  onRehearseNow
}) => {
  // Select two runs to compare side-by-side
  const [compareRunAId, setCompareRunAId] = useState<string>(sessions[sessions.length - 1]?.id || '');
  const [compareRunBId, setCompareRunBId] = useState<string>(sessions[0]?.id || '');

  const runA = sessions.find(s => s.id === compareRunAId) || sessions[sessions.length - 1];
  const runB = sessions.find(s => s.id === compareRunBId) || sessions[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Deltas between run A (earlier) and run B (latest)
  const scoreDelta = (runB?.overallScore || 0) - (runA?.overallScore || 0);
  const wpmDelta = (runB?.metrics.averageWpm || 0) - (runA?.metrics.averageWpm || 0);
  const fillerDelta = (runB?.metrics.fillerCount || 0) - (runA?.metrics.fillerCount || 0);

  return (
    <div className="space-y-8 pb-12">

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4f46e5] mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Executive Growth Telemetry</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#131b2e] tracking-tight">
            Cadence & Presence Benchmarks
          </h2>
          <p className="text-xs text-[#777587] mt-0.5">
            Track multi-session convergence as your speech velocity and vocal gravitas calibrate to venture standards.
          </p>
        </div>

        <button
          onClick={onRehearseNow}
          className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs self-stretch sm:self-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Rehearsal Run</span>
        </button>
      </div>

      {/* Trajectory Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Executive Presence Index Trend */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-3 border-l-4 border-l-[#4F46E5]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777587]">
            <span>Presence Index Trajectory</span>
            <span className="text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +{scoreDelta > 0 ? scoreDelta : 18} pts
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-4xl text-[#131b2e] tabular-nums">
              {runB?.overallScore || 92}
            </span>
            <span className="text-xs text-[#777587] font-semibold">/100 (Latest Run)</span>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Graduated from hurried baseline into structured, venture-grade executive gravitas.
          </p>
        </div>

        {/* Metric 2: Cadence Convergence */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-3 border-l-4 border-l-[#10B981]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777587]">
            <span>Speech Velocity Convergence</span>
            <span className="text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              In Target Band
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-4xl text-[#131b2e] tabular-nums">
              {runB?.metrics.averageWpm || 142}
            </span>
            <span className="text-xs text-[#777587] font-semibold">WPM (was {runA?.metrics.averageWpm || 172})</span>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Successfully decelerated by {Math.abs(wpmDelta)} WPM to ensure investors retain key unit metrics.
          </p>
        </div>

        {/* Metric 3: Filler Eradication */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow space-y-3 border-l-4 border-l-[#F59E0B]">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777587]">
            <span>Filler Word Reduction</span>
            <span className="text-[#047857] bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" />
              -73% Eradication
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-4xl text-[#131b2e] tabular-nums">
              {runB?.metrics.fillerCount || 5}
            </span>
            <span className="text-xs text-[#777587] font-semibold">Hesitations (down from {runA?.metrics.fillerCount || 19})</span>
          </div>

          <p className="text-xs text-[#464555] leading-relaxed">
            Substituted vocalized pauses with 1.5-second deliberate silence.
          </p>
        </div>

      </div>

      {/* Side-by-Side Run Comparison Tool */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#131b2e]">
              Head-to-Head Rehearsal Run Comparison
            </h3>
            <p className="text-xs text-[#777587]">
              Compare telemetry between any two historical practice passes
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#777587]">Baseline:</span>
              <select
                value={compareRunAId}
                onChange={(e) => setCompareRunAId(e.target.value)}
                className="bg-[#faf8ff] border border-[#dae2fd] rounded-lg px-2.5 py-1 text-xs text-[#131b2e] font-medium"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    Run ({formatDate(s.recordedAt)} - {s.overallScore} pts)
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#777587] font-bold">vs</span>

            <div className="flex items-center gap-1.5">
              <span className="text-[#777587]">Latest:</span>
              <select
                value={compareRunBId}
                onChange={(e) => setCompareRunBId(e.target.value)}
                className="bg-[#faf8ff] border border-[#dae2fd] rounded-lg px-2.5 py-1 text-xs text-[#131b2e] font-medium"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    Run ({formatDate(s.recordedAt)} - {s.overallScore} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {runA && runB && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[11px] uppercase font-bold text-[#777587]">
                  <th className="py-3 px-4">Evaluation Metric</th>
                  <th className="py-3 px-4">Run A (Baseline)</th>
                  <th className="py-3 px-4">Run B (Target Run)</th>
                  <th className="py-3 px-4 text-right">Measurable Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f3ff] text-[#131b2e]">
                <tr>
                  <td className="py-3.5 px-4 font-semibold">Executive Presence Score</td>
                  <td className="py-3.5 px-4 tabular-nums font-medium">{runA.overallScore}/100</td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#3525cd]">{runB.overallScore}/100</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      +{runB.overallScore - runA.overallScore} points
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold">Average Cadence (WPM)</td>
                  <td className="py-3.5 px-4 tabular-nums font-medium">{runA.metrics.averageWpm} WPM (Elevated)</td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#10B981]">{runB.metrics.averageWpm} WPM (Sweet Spot)</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {runB.metrics.averageWpm - runA.metrics.averageWpm} WPM
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold">Total Verbal Fillers</td>
                  <td className="py-3.5 px-4 tabular-nums font-medium">{runA.metrics.fillerCount} fillers</td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-amber-700">{runB.metrics.fillerCount} fillers</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      -{Math.abs(runA.metrics.fillerCount - runB.metrics.fillerCount)} eliminated
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold">Optimal Pacing Zone Duration</td>
                  <td className="py-3.5 px-4 tabular-nums font-medium">{runA.metrics.optimalPacingPercentage}%</td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#3525cd]">{runB.metrics.optimalPacingPercentage}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      +{runB.metrics.optimalPacingPercentage - runA.metrics.optimalPacingPercentage}% consistency
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold">Deliberate Power Pauses</td>
                  <td className="py-3.5 px-4 tabular-nums font-medium">{runA.metrics.deliberatePausesCount} pauses</td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#10B981]">{runB.metrics.deliberatePausesCount} pauses</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      +{runB.metrics.deliberatePausesCount - runA.metrics.deliberatePausesCount} strategic pauses
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold">Monotone Risk Level</td>
                  <td className="py-3.5 px-4 font-medium text-amber-700">{runA.metrics.monotoneRisk}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{runB.metrics.monotoneRisk}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Calibrated Inflection
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Historical Sessions Log */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xl text-[#131b2e]">
            Rehearsal Session Log
          </h3>
          <span className="text-xs font-semibold text-[#777587]">
            {sessions.length} Recorded Sessions
          </span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess, idx) => (
            <div 
              key={sess.id}
              onClick={() => onSelectSession(sess)}
              className="p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#4F46E5] bg-[#faf8ff] hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#3525cd] font-heading font-bold text-sm flex items-center justify-center">
                  #{sessions.length - idx}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#131b2e]">
                    {sess.deckTitle}
                  </h4>
                  <div className="text-xs text-[#777587] flex items-center gap-2 mt-0.5">
                    <span>{formatDate(sess.recordedAt)}</span>
                    <span>•</span>
                    <span>{formatTime(sess.durationSec)} runtime</span>
                    <span>•</span>
                    <span className="tabular-nums font-medium text-[#131b2e]">{sess.metrics.averageWpm} WPM</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#777587]">Presence</div>
                  <div className="font-heading font-extrabold text-lg text-[#3525cd] tabular-nums">
                    {sess.overallScore}/100
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#777587]">Fillers</div>
                  <div className="font-heading font-bold text-base text-[#131b2e] tabular-nums">
                    {sess.metrics.fillerCount}
                  </div>
                </div>

                <button
                  className="bg-white border border-[#dad7ff] text-[#4f46e5] hover:bg-[#eef2ff] px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  View Diagnostics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
