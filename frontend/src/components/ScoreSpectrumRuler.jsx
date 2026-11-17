import React from 'react';
import { MapPin, Info, Sparkles } from 'lucide-react';

const normalizeScore = (val) => {
  if (val === null || val === undefined) return 50;
  const num = Number(val);
  if (isNaN(num)) return 50;
  if (num <= 100) return Math.max(0, Math.min(100, Math.round(num)));
  // Legacy Wechsler (70-145) to 0-100%
  return Math.max(0, Math.min(100, Math.round(((num - 85) / 60) * 100)));
};

export default function ScoreSpectrumRuler({ score, title = "Intelligence", isOverall = false, pillarScores = null }) {
  const currentScore = normalizeScore(score);

  // Clamped percentage position [2%, 98%] for the marker
  const clampedPercentage = Math.min(98, Math.max(2, currentScore));

  // Plain-English Tier Categorization (4-Tier System)
  let tierName = '';
  let tierBadgeBg = '';
  let tierTextColor = '';
  let plainExplanation = '';

  if (currentScore >= 85) {
    tierName = 'Exceptional Tier (85–100%)';
    tierBadgeBg = 'bg-emerald-950/80 border-emerald-500/50';
    tierTextColor = 'text-emerald-300';
    plainExplanation = `Your score of ${currentScore}% demonstrates exceptional command in this dimension. You exhibit rare speed, synthesis, and precision well above the balanced baseline.`;
  } else if (currentScore >= 65) {
    tierName = 'Proficient Tier (65–84%)';
    tierBadgeBg = 'bg-blue-950/80 border-blue-500/50';
    tierTextColor = 'text-blue-300';
    plainExplanation = `Your score of ${currentScore}% places you in the Proficient tier. You show dependable capability, clear reasoning, and consistent performance across complex challenges.`;
  } else if (currentScore >= 40) {
    tierName = 'Balanced Tier (40–64%)';
    tierBadgeBg = 'bg-amber-950/80 border-amber-500/50';
    tierTextColor = 'text-amber-300';
    plainExplanation = `Your score of ${currentScore}% reflects a solid, balanced baseline. This represents reliable day-to-day capability with clear runway to level up into proficiency through targeted practice.`;
  } else {
    tierName = 'Developing Tier (0–39%)';
    tierBadgeBg = 'bg-rose-950/80 border-rose-500/50';
    tierTextColor = 'text-rose-300';
    plainExplanation = `Your score of ${currentScore}% indicates a foundational development area. Focused workouts in the Cognitive Gym and daily habits will create rapid gains here.`;
  }

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Standardized Performance Spectrum</span>
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              4-Tier Spectrum
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your {title} score mapped across the 4 psychometric evaluation tiers (0% to 100%)
          </p>
        </div>

        {/* Current Tier Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${tierBadgeBg} ${tierTextColor} flex items-center gap-1.5 self-start sm:self-auto`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{tierName}</span>
        </div>
      </div>

      {/* Visual Spectrum Ruler */}
      <div className="relative pt-10 pb-4">
        {/* Floating "YOU ARE HERE" Marker */}
        <div 
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-700 z-20 flex flex-col items-center pointer-events-none"
          style={{ left: `${clampedPercentage}%` }}
        >
          <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-black shadow-lg shadow-indigo-600/50 border border-indigo-400 whitespace-nowrap flex items-center gap-1 animate-bounce">
            <span>YOU ARE HERE: {currentScore}%</span>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-indigo-600"></div>
        </div>

        {/* The Gradient Track with 4 Segments */}
        <div className="h-5 sm:h-6 rounded-xl overflow-hidden flex p-0.5 bg-slate-950 border border-slate-800 shadow-inner relative">
          {/* Segment 1: Developing (0 - 39%) */}
          <div 
            style={{ width: '40%' }} 
            className="h-full bg-gradient-to-r from-rose-600/70 to-rose-500/70 rounded-l-lg relative group"
            title="Developing (0 - 39%)"
          ></div>

          {/* Segment 2: Balanced (40 - 64%) */}
          <div 
            style={{ width: '25%' }} 
            className="h-full bg-gradient-to-r from-amber-600/70 to-amber-500/70 relative group"
            title="Balanced (40 - 64%)"
          >
            {/* 60% Balanced Benchmark Notch */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 shadow-sm transform -translate-x-1/2"
              style={{ left: '80%' }}
            ></div>
          </div>

          {/* Segment 3: Proficient (65 - 84%) */}
          <div 
            style={{ width: '20%' }} 
            className="h-full bg-gradient-to-r from-sky-600/70 to-blue-500/80 relative group"
            title="Proficient (65 - 84%)"
          ></div>

          {/* Segment 4: Exceptional (85 - 100%) */}
          <div 
            style={{ width: '15%' }} 
            className="h-full bg-gradient-to-r from-emerald-500/80 to-teal-400/90 rounded-r-lg relative group"
            title="Exceptional (85 - 100%)"
          ></div>

          {/* Pin Vertical Indicator Line across track */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-15 pointer-events-none rounded-full transform -translate-x-1/2"
            style={{ left: `${clampedPercentage}%` }}
          ></div>
        </div>

        {/* Benchmark 60% Label below track */}
        <div 
          className="absolute bottom-[-18px] transform -translate-x-1/2 text-center text-[11px] font-bold text-slate-300 pointer-events-none whitespace-nowrap"
          style={{ left: '60%' }}
        >
          <span className="text-amber-400">▲</span>
          <span className="block text-[10px] text-slate-400">Balanced Baseline (60%)</span>
        </div>

        {/* Min and Max Range Labels - Calibrated exactly to score scale [0% to 100%] */}
        <div className="relative h-4 mt-1 text-[10px] text-slate-500 font-mono">
          <span className="absolute left-0">0%</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '40%' }}>40%</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '65%' }}>65%</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '85%' }}>85%</span>
          <span className="absolute right-0 text-right">100%</span>
        </div>
      </div>

      {/* Plain English Explanation Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 mt-4">
        <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white">
            What This Tier Means:
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {plainExplanation}
          </p>
        </div>
      </div>

      {/* Match Your Score Quick-Reference Cards Grid */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          The 4 Standardized Performance Tiers:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Tier 1: Developing */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore < 40 ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">0% – 39%</span>
            <span className="text-[11px] text-rose-400 block font-medium">Developing</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Foundational area</span>
          </div>

          {/* Tier 2: Balanced */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 40 && currentScore < 65 ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">40% – 64%</span>
            <span className="text-[11px] text-amber-400 block font-medium">Balanced</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Solid everyday baseline</span>
          </div>

          {/* Tier 3: Proficient */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 65 && currentScore < 85 ? 'bg-sky-950/40 border-sky-500/80 ring-1 ring-sky-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">65% – 84%</span>
            <span className="text-[11px] text-sky-400 block font-medium">Proficient</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Strong dependable skill</span>
          </div>

          {/* Tier 4: Exceptional */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 85 ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">85% – 100%</span>
            <span className="text-[11px] text-emerald-400 block font-medium">Exceptional</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Peak capability tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
