import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Award, 
  Compass,
  Zap,
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  Cpu,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function PublicLanding({ onGetStarted, onSignIn }) {
  const [activePillar, setActivePillar] = useState('ALL');

  const pillars = [
    {
      id: 'IQ',
      title: 'IQ (Intelligence Quotient)',
      tagline: 'The ability to think logically, recognize patterns, and solve problems.',
      impact: '9 / 10',
      color: 'blue',
      borderClass: 'border-blue-500/40 hover:border-blue-400',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      icon: Brain,
      areas: 'Science • Math & Engineering • Programming',
      training: 'Solve puzzles (chess, sudoku). Learn basic statistics.',
    },
    {
      id: 'EQ',
      title: 'EQ (Emotional Quotient)',
      tagline: 'The ability to understand and manage emotions.',
      impact: '9.3 / 10',
      color: 'rose',
      borderClass: 'border-rose-500/40 hover:border-rose-400',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      icon: Award,
      areas: 'Psychology • Relationships • Family Dynamics',
      training: 'Keep an emotional journal for 10 minutes each night. Listen actively.',
    },
    {
      id: 'SQ',
      title: 'SQ (Spiritual Quotient)',
      tagline: 'The ability to find meaning, stay grounded in your values, and feel internally whole.',
      impact: '8 / 10',
      color: 'amber',
      borderClass: 'border-amber-500/40 hover:border-amber-400',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      icon: Compass,
      areas: 'Literature • Philosophy • Art & Religion',
      training: 'Reflect on your values. Study the timeless principles of Stoicism.',
    },
    {
      id: 'AQ',
      title: 'AQ (Adaptability Quotient)',
      tagline: 'The ability to learn when faced with new or unpredictable situations.',
      impact: '10 / 10 (Peak)',
      color: 'emerald',
      borderClass: 'border-emerald-500/40 hover:border-emerald-400',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      icon: Zap,
      areas: 'Leadership • AI • Politics • Crisis Management',
      training: "Ask 'What if...?' • Try new things (languages, technologies, food).",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto pt-4 pb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Next-Generation Multidimensional Psychometrics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
          Master The <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            4 Types of Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
          Human excellence is not measured by raw logic alone. Discover your comprehensive cognitive architecture across <strong>IQ</strong> (Cognitive), <strong>EQ</strong> (Emotional), <strong>SQ</strong> (Spiritual & Stoic), and <strong>AQ</strong> (Adaptability) with instant AI synthesis.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all text-base group"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onSignIn}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all text-base"
          >
            <span>Sign In</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4 Standalone Test Modules
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Groq AI Synthesis
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Anti-Cheat Verification
          </span>
        </div>
      </div>

      {/* 4 Pillars Interactive Showcase */}
      <div className="my-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            The 4 Pillars of Human Potential
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Take any test separately or complete all four to unlock your unified 4D Mind Matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.id}
                className={`glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] shadow-xl ${p.borderClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${p.badgeClass}`}>
                      {p.impact}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 italic">
                    "{p.tagline}"
                  </p>

                  <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-300 font-semibold block mb-0.5">Core Areas:</span>
                      <p className="text-[11px] leading-snug">{p.areas}</p>
                    </div>
                    <div>
                      <span className="text-slate-300 font-semibold block mb-0.5">How to Train:</span>
                      <p className="text-[11px] leading-snug">{p.training}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 transition-all group-hover:border-slate-500"
                >
                  <span>Evaluate {p.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}