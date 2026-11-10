import React from 'react';
import { MapPin, Info, CheckCircle2, TrendingUp, Sparkles, HelpCircle } from 'lucide-react';

export default function ScoreSpectrumRuler({ score, title = "Intelligence", isOverall = false, pillarScores = null }) {
  const currentScore = Math.max(60, Math.min(145, Number(score) || 100));

  // Map score from range [70, 140] to percentage [0%, 100%]
  const minScale = 70;
  const maxScale = 140;
  const clampedPercentage = Math.min(98, Math.max(2, ((currentScore - minScale) / (maxScale - minScale)) * 100));

  // 100 is global average
  const averagePercentage = ((100 - minScale) / (maxScale - minScale)) * 100;

  // Plain-English Tier Categorization
  let tierName = '';
  let tierBadgeBg = '';
  let tierTextColor = '';
  let plainExplanation = '';

  if (currentScore >= 130) {
    tierName = 'Exceptional Tier (Top 2% Worldwide)';
    tierBadgeBg = 'bg-purple-950/80 border-purple-500/50';
    tierTextColor = 'text-purple-300';
    plainExplanation = `Your score of ${currentScore} places you in the top 2% of the world. This is exceptionally high aptitude well above the average person (score 100), reflecting rare speed, pattern abstraction, and mental endurance.`;
  } else if (currentScore >= 115) {
    tierName = 'Above Average / High Tier (Top 15%)';
    tierBadgeBg = 'bg-blue-950/80 border-blue-500/50';
    tierTextColor = 'text-blue-300';
    plainExplanation = `Your score of ${currentScore} places you clearly above the global average (score 100). You scored higher than about 85% of people worldwide, showing noticeable strength and dependable capability.`;
  } else if (currentScore >= 85) {
    tierName = 'Normal / Average Range (Most People)';
    tierBadgeBg = 'bg-emerald-950/80 border-emerald-500/50';
    tierTextColor = 'text-emerald-300';
    plainExplanation = `Your score of ${currentScore} places you right in the Normal / Average range where roughly 68% of all human adults fall. The global human average is 100. This indicates solid everyday capability, with great potential to rise into the high tier through practice.`;
  } else {
    tierName = 'Below Average Range (Room for Growth)';
    tierBadgeBg = 'bg-amber-950/80 border-amber-500/50';
    tierTextColor = 'text-amber-300';
    plainExplanation = `Your score of ${currentScore} is below the global average of 100. This usually happens due to rushing under time pressure, unfamiliarity with the test format, or distraction. Using the Cognitive Gym exercises can help train these specific skills.`;
  }

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Where You Stand Compared to the World</span>
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Visual Guide
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare your {title} score against the global human population curve (Average is 100)
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
            <span>YOU ARE HERE: {currentScore}</span>
          </div>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-indigo-600"></div>
        </div>

        {/* The Gradient Track with 4 Segments */}
        <div className="h-5 sm:h-6 rounded-xl overflow-hidden flex p-0.5 bg-slate-950 border border-slate-800 shadow-inner relative">
          {/* Segment 1: Below 85 (15/70 = 21.43%) */}
          <div 
            style={{ width: '21.43%' }} 
            className="h-full bg-gradient-to-r from-rose-600/70 to-amber-600/70 rounded-l-lg relative group"
            title="Below Average (< 85)"
          ></div>

          {/* Segment 2: 85 - 115 (30/70 = 42.86%) - Most People */}
          <div 
            style={{ width: '42.86%' }} 
            className="h-full bg-gradient-to-r from-amber-600/70 via-emerald-500/80 to-teal-600/70 relative group"
            title="Average / Normal Range (85 - 115) - Most People"
          >
            {/* 100 Average Notch Line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 shadow-sm transform -translate-x-1/2"
              style={{ left: '50%' }}
            ></div>
          </div>

          {/* Segment 3: 115 - 129 (15/70 = 21.43%) */}
          <div 
            style={{ width: '21.43%' }} 
            className="h-full bg-gradient-to-r from-teal-600/70 to-blue-500/80 relative group"
            title="Above Average (115 - 129)"
          ></div>

          {/* Segment 4: 130+ (10/70 = 14.28%) */}
          <div 
            style={{ width: '14.28%' }} 
            className="h-full bg-gradient-to-r from-blue-500/80 to-purple-500/90 rounded-r-lg relative group"
            title="Exceptional / Top 2% (130+)"
          ></div>

          {/* Pin Vertical Indicator Line across track */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-15 pointer-events-none rounded-full transform -translate-x-1/2"
            style={{ left: `${clampedPercentage}%` }}
          ></div>
        </div>

        {/* Global Average 100 Label below track */}
        <div 
          className="absolute bottom-[-18px] transform -translate-x-1/2 text-center text-[11px] font-bold text-slate-300 pointer-events-none whitespace-nowrap"
          style={{ left: `${averagePercentage}%` }}
        >
          <span className="text-emerald-400">▲</span>
          <span className="block text-[10px] text-slate-400">Global Average (100)</span>
        </div>

        {/* Min and Max Range Labels - Calibrated exactly to score scale [70 to 140] */}
        <div className="relative h-4 mt-1 text-[10px] text-slate-500 font-mono">
          <span className="absolute left-0">70 (Low)</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '21.43%' }}>85</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '64.29%' }}>115</span>
          <span className="absolute transform -translate-x-1/2" style={{ left: '85.71%' }}>130</span>
          <span className="absolute right-0 text-right">140+ (High)</span>
        </div>
      </div>

      {/* Plain English Explanation Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 mt-4">
        <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-white">
            What This Means in Simple Words:
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {plainExplanation}
          </p>
        </div>
      </div>

      {/* Match Your Score Quick-Reference Cards Grid */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Match Your Score to Find Where You Sit:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Tier 1 */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore < 85 ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">Below 85</span>
            <span className="text-[11px] text-amber-400 block font-medium">Below Average</span>
            <span className="text-[10px] text-slate-400 mt-1 block">~16% of people</span>
          </div>

          {/* Tier 2 */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 85 && currentScore < 115 ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">85 – 114</span>
            <span className="text-[11px] text-emerald-400 block font-medium">Average (Normal)</span>
            <span className="text-[10px] text-slate-400 mt-1 block">~68% of people (Most)</span>
          </div>

          {/* Tier 3 */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 115 && currentScore < 130 ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">115 – 129</span>
            <span className="text-[11px] text-blue-400 block font-medium">Above Average</span>
            <span className="text-[10px] text-slate-400 mt-1 block">~14% of people</span>
          </div>

          {/* Tier 4 */}
          <div className={`p-3 rounded-xl border transition-all ${
            currentScore >= 130 ? 'bg-purple-950/40 border-purple-500/80 ring-1 ring-purple-500/50' : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
          }`}>
            <span className="font-bold block text-slate-200">130 and Above</span>
            <span className="text-[11px] text-purple-400 block font-medium">Exceptional</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Top 2% worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
