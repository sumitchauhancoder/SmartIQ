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
  BookOpen,
  Quote,
  Flame,
  AlertTriangle,
  Layers,
  HeartHandshake,
  Sun,
  Shield,
  Lightbulb
} from 'lucide-react';

export default function PublicLanding({ onGetStarted, onSignIn }) {
  const [activeQuotePillar, setActiveQuotePillar] = useState('ALL');

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

  const intelligenceQuotes = [
    {
      pillar: 'AQ',
      quote: "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.",
      author: "Alvin Toffler",
      title: "Futurist & Author of Future Shock",
      color: "emerald"
    },
    {
      pillar: 'SQ',
      quote: "You have power over your mind — not outside events. Realize this, and you will find immense strength.",
      author: "Marcus Aurelius",
      title: "Roman Emperor & Stoic Philosopher",
      color: "amber"
    },
    {
      pillar: 'EQ',
      quote: "In a high-IQ job pool, soft skills like emotional intelligence, self-regulation, and empathy determine who leads and who falters.",
      author: "Daniel Goleman",
      title: "Psychologist & Author of Emotional Intelligence",
      color: "rose"
    },
    {
      pillar: 'IQ',
      quote: "The measure of intelligence is the ability to change, adapt, and reason from first principles.",
      author: "Albert Einstein",
      title: "Theoretical Physicist",
      color: "blue"
    },
    {
      pillar: 'SQ',
      quote: "When we are no longer able to change a situation, we are challenged to change ourselves.",
      author: "Viktor E. Frankl",
      title: "Neurologist, Psychiatrist & Holocaust Survivor",
      color: "amber"
    },
    {
      pillar: 'AQ',
      quote: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.",
      author: "Charles Darwin",
      title: "Naturalist & Evolutionary Biologist",
      color: "emerald"
    }
  ];

  const filteredQuotes = activeQuotePillar === 'ALL' 
    ? intelligenceQuotes 
    : intelligenceQuotes.filter(q => q.pillar === activeQuotePillar);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <div className="text-center max-w-4xl mx-auto pt-4 pb-4">
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
          Human excellence cannot be captured by raw computational logic alone. Discover your comprehensive cognitive architecture across <strong>IQ</strong> (Cognitive), <strong>EQ</strong> (Emotional), <strong>SQ</strong> (Spiritual & Stoic), and <strong>AQ</strong> (Adaptability) with instant AI synthesis.
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10-Question Standalone Tests
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Groq AI Synthesis
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Anti-Cheat Verification
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Playable Cognitive Gym
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. THE MAIN MODERN PROBLEM ENIGMA SOLVES
          ===================================================================== */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>The Modern Crisis of One-Dimensional Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
            The Main Problem Enigma Solves
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            For over a century, the world evaluated human capability through a single narrow lens: <strong>traditional academic IQ</strong>. But in the era of Generative AI, raw computational calculation has been commoditized. Humans are facing unprecedented psychological burnout, disconnection, and disruption paralysis.
          </p>
        </div>

        {/* 4 Problem vs Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Problem 1: AI Commoditizing IQ */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">The IQ Problem</span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded font-mono">Commoditization</span>
            </div>
            <h3 className="text-base font-bold text-white">Algorithms Now Out-Compute Pure Logic</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When software solves equations and writes syntax in milliseconds, pure memorization is obsolete. Humans need <strong>Bayesian discernment, first-principles critique, and spatial modeling</strong> — not mechanical rote calculation.
            </p>
          </div>

          {/* Problem 2: The Empathy & EQ Deficit */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">The EQ Problem</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded font-mono">Hyper-Reactivity</span>
            </div>
            <h3 className="text-base font-bold text-white">Digital Isolation & Amygdala Hijacking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chronic screen time, remote friction, and defensive polarization trigger constant nervous system strain. Without trained <strong>somatic self-regulation and active empathy</strong>, teams collapse under pressure regardless of how brilliant their members are.
            </p>
          </div>

          {/* Problem 3: The Existential Void (SQ Deficit) */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">The SQ Problem</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded font-mono">Loss of Anchor</span>
            </div>
            <h3 className="text-base font-bold text-white">External Success with Internal Emptiness</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Professionals chase fleeting external validation while suffering from deep existential fatigue. Without ancient <strong>Stoic equanimity and Epictetus' Dichotomy of Control</strong>, external volatility easily shatters mental peace.
            </p>
          </div>

          {/* Problem 4: Disruption Paralysis (AQ Deficit) */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">The AQ Problem</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-mono">Obsolescence Trap</span>
            </div>
            <h3 className="text-base font-bold text-white">Paralysis When Rules Change Overnight</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Career and organizational crises fail not from lack of intelligence, but from refusal to let go of outdated mastery. <strong>Adaptability (AQ) is the peak meta-skill</strong>: rapid unlearning, pivot velocity, and Nassim Taleb's antifragility.
            </p>
          </div>
        </div>

        {/* The Enigma Antidote Statement */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/80 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Enigma's Antidote: 4D Intelligence Synthesis
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              We restore human equilibrium by measuring and training IQ, EQ, SQ, and AQ as mutually reinforcing pillars. You emerge not just smart, but centered, empathetic, and antifragile under chaos.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>Explore Your 4D Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. TIMELESS WISDOM & QUOTES SHOWCASE
          ===================================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Quote className="w-6 h-6 text-indigo-400" />
              <span>Timeless Wisdom on Human Intelligence</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Foundational philosophical and scientific insights that power the Enigma methodology
            </p>
          </div>

          {/* Quote Pillar Filter Tabs */}
          <div className="glass-panel p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            {['ALL', 'IQ', 'EQ', 'SQ', 'AQ'].map((p) => (
              <button
                key={p}
                onClick={() => setActiveQuotePillar(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeQuotePillar === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((q, idx) => (
            <div 
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    q.pillar === 'IQ' ? 'bg-blue-950 text-blue-300 border-blue-800/50' :
                    q.pillar === 'EQ' ? 'bg-rose-950 text-rose-300 border-rose-800/50' :
                    q.pillar === 'SQ' ? 'bg-amber-950 text-amber-300 border-amber-800/50' :
                    'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                  }`}>
                    {q.pillar} Intelligence
                  </span>
                  <Quote className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>

                <p className="text-sm font-medium text-slate-200 leading-relaxed italic mb-6">
                  "{q.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <p className="text-xs font-bold text-white">{q.author}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{q.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          4. 4 PILLARS INTERACTIVE SHOWCASE
          ===================================================================== */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            The 4 Standalone Pillars
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Take any 10-question assessment independently or complete all four to synthesize your complete 4D Mind Matrix.
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
                  <span>Evaluate {p.id} (10 Qs)</span>
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
