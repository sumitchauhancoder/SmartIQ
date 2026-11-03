import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, 
  Award, 
  Sparkles, 
  Share2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';
import PerformanceChart from '../components/PerformanceChart';

export default function Results({ resultsData, onRetake }) {
  const [expandedMistake, setExpandedMistake] = useState(null);
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#38bdf8', '#fbbf24']
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  if (!resultsData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <Brain className="w-12 h-12 text-indigo-400 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">No Active Assessment Data</h3>
        <p className="text-slate-400 text-sm max-w-sm mb-6">Complete both IQ and EQ evaluations to generate your mind profile.</p>
        <button
          onClick={() => onRetake('iq')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
        >
          Begin Assessment
        </button>
      </div>
    );
  }

  const {
    iq_score = 100,
    iq_breakdown = {},
    eq_score = 100,
    eq_breakdown = {},
    tab_switch_count = 0,
    ai_analysis = {}
  } = resultsData;

  const archetype = ai_analysis.archetype_title || 'The Dynamic Synthesizer';
  const summary = ai_analysis.core_summary || 'Balanced cognitive and emotional processing capabilities.';
  const edge = ai_analysis.cognitive_edge || 'Strong pattern abstraction and deductive sequence modeling.';
  const emotionalProfile = ai_analysis.emotional_profile || 'Adaptive empathy and situational self-regulation under pressure.';
  const growthHabits = ai_analysis.growth_habits || [];
  const mistakeAnalyses = ai_analysis.mistake_analyses || [];

  const handleShare = () => {
    const textToShare = `🧠 My SmartIQ Psychometric Profile:\n` +
      `⚡ Cognitive IQ: ${iq_score} | 🌟 Emotional EQ: ${eq_score}\n` +
      `🏛️ Archetype: "${archetype}"\n` +
      `🛡️ Anti-Cheat Integrity: ${tab_switch_count === 0 ? 'Verified 100%' : `${tab_switch_count} Flags`}\n` +
      `Evaluated on SmartIQ Platform.`;

    if (navigator.share) {
      navigator.share({
        title: 'SmartIQ Mind Profile',
        text: textToShare,
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Archetype Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-600/40 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Mind Archetype Synthesized</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              {archetype}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {summary}
            </p>
          </div>

          {/* Overall Dual Score Medallions */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-around sm:justify-start">
            <div className="p-4 rounded-2xl glass-card border border-indigo-500/40 text-center min-w-[110px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                Cognitive IQ
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {iq_score}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {iq_score >= 120 ? 'Superior' : iq_score >= 105 ? 'High Average' : 'Normal'}
              </span>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-emerald-500/40 text-center min-w-[110px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Emotional EQ
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {eq_score}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {eq_score >= 120 ? 'Empathetic' : eq_score >= 105 ? 'Attuned' : 'Balanced'}
              </span>
            </div>
          </div>
        </div>

        {/* Cognitive Edge & Emotional Profile Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Brain className="w-4 h-4" />
              <span>Cognitive Processing Edge</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {edge}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Award className="w-4 h-4" />
              <span>Emotional & Behavioral Profile</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {emotionalProfile}
            </p>
          </div>
        </div>

        {/* Action bar (Share / Retake / AntiCheat Status) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            {tab_switch_count === 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                Anti-Cheat Audit: 100% Uncompromised
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/50">
                <ShieldAlert className="w-3.5 h-3.5" />
                Anti-Cheat Audit: {tab_switch_count} Tab Disruption(s) Logged
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Scorecard Copied!' : 'Share Scorecard'}</span>
            </button>
            <button
              onClick={() => onRetake('iq')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Section */}
      <div className="mb-8">
        <PerformanceChart
          iqBreakdown={iq_breakdown}
          eqBreakdown={eq_breakdown}
          iqScore={iq_score}
          eqScore={eq_score}
        />
      </div>

      {/* Grid: Growth Habits & Mistake Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Growth Habits Plan */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Hyper-Personalized Growth Plan</span>
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">
              Actionable Routines
            </span>
          </div>

          <div className="space-y-3.5">
            {growthHabits.map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-white">{item.habit}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {item.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Explain My Mistakes Module */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span>Cognitive Error Deconstruction</span>
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              {mistakeAnalyses.length} Diagnostic Note{mistakeAnalyses.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-3">
            {mistakeAnalyses.map((mistake, index) => {
              const isExpanded = expandedMistake === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedMistake(isExpanded ? null : index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-200 line-clamp-1">
                        {mistake.question}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-800 text-xs space-y-2.5 bg-slate-950/40">
                      <div>
                        <span className="font-bold text-indigo-300 block mb-0.5">Why the logic diverged:</span>
                        <p className="text-slate-300 leading-relaxed">{mistake.why_wrong}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-300 block mb-0.5">Identified Cognitive Bias:</span>
                        <p className="text-slate-400 italic">{mistake.cognitive_bias}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
