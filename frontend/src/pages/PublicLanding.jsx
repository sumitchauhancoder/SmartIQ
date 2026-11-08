import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Award,
  Compass,
  Zap,
  ArrowRight,
  Quote,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function PublicLanding({ onGetStarted, onSignIn }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const intelligenceQuotes = [
    {
      quote:
        "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.",
      author: "Alvin Toffler",
      pillar: "AQ",
    },
    {
      quote:
        "You have power over your mind — not outside events. Realize this, and you will find immense strength.",
      author: "Marcus Aurelius",
      pillar: "SQ",
    },
    {
      quote:
        "In a high-IQ job pool, soft skills like emotional intelligence, self-regulation, and empathy determine who leads.",
      author: "Daniel Goleman",
      pillar: "EQ",
    },
    {
      quote:
        "The measure of intelligence is the ability to change, adapt, and reason from first principles.",
      author: "Albert Einstein",
      pillar: "IQ",
    },
    {
      quote:
        "When we are no longer able to change a situation, we are challenged to change ourselves.",
      author: "Viktor E. Frankl",
      pillar: "SQ",
    },
    {
      quote:
        "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.",
      author: "Charles Darwin",
      pillar: "AQ",
    },
  ];

  const currentQuote = intelligenceQuotes[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % intelligenceQuotes.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex(
      (prev) =>
        (prev - 1 + intelligenceQuotes.length) % intelligenceQuotes.length,
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Welcome / Hero Banner (Matching Home Typography) */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Next-Gen 4D Psychometric Assessment</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3 leading-tight">
          The{" "}
          <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            4 Types of Intelligence
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto mb-6">
          Pick a test below. Answer 10 quick questions to discover your
          strengths and personal style.
        </p>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transform hover:-translate-y-0.5 transition-all group"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSignIn}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all shadow-md"
          >
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* 2. Sleek Inspiration Bar (Identical to Home.jsx) */}
      <div className="glass-panel px-5 py-4 rounded-2xl border border-indigo-500/20 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
            <Quote className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs sm:text-sm text-slate-200 italic truncate">
              "{currentQuote.quote}"{" "}
              <span className="text-slate-400 not-italic font-semibold">
                — {currentQuote.author}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handlePrevQuote}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextQuote}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. 4 Separate Assessment Modules Grid (Exact Font & Card Structure from Home.jsx) */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose an Assessment Module
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each test has 10 quick questions with helpful tips and fair-play
            monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IQ Module Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-blue-500/30 relative overflow-hidden group hover:border-blue-400/60 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-md">
                  <Brain className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60">
                    Impact: 9/10
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    <Clock className="w-3 h-3 text-blue-400" />
                    45s / Q
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Cognitive Intelligence (IQ)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to think logically, recognize patterns, and solve
                problems."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Key Focus Areas:
                  </span>
                  <span className="text-blue-300 font-mono text-[11px]">
                    Science • Math • Programming
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Training Routine:
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Chess, Sudoku, Logic Puzzles
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all group"
            >
              <span>Start Independent IQ Test (10 Qs)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* EQ Module Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-rose-500/30 relative overflow-hidden group hover:border-rose-400/60 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-600/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
                    Impact: 9.3/10
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    <Clock className="w-3 h-3 text-rose-400" />
                    45s / Q
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Emotional Quotient (EQ)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to understand and manage emotions."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Key Focus Areas:
                  </span>
                  <span className="text-rose-300 font-mono text-[11px]">
                    Psychology • Relationships • Leadership
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Training Routine:
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Daily Journaling, Active Listening
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/20 transition-all group"
            >
              <span>Start Independent EQ Test (10 Qs)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* SQ Module Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/30 relative overflow-hidden group hover:border-amber-400/60 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-600/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shadow-md">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60">
                    Impact: 8/10
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    <Clock className="w-3 h-3 text-amber-400" />
                    45s / Q
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Spiritual Quotient (SQ)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to find meaning, stay grounded in your values, and
                feel internally whole."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Key Focus Areas:
                  </span>
                  <span className="text-amber-300 font-mono text-[11px]">
                    Philosophy • Values • Inner Peace
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Training Routine:
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Quiet Reflection, Living by Core Principles
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-500/20 transition-all group"
            >
              <span>Start Independent SQ Test (10 Qs)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* AQ Module Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400/60 transition-all flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-600/20 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shadow-md">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    Impact: 10/10 (Peak)
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    45s / Q
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Adaptability Quotient (AQ)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to learn when faced with new or unpredictable
                situations."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Key Focus Areas:
                  </span>
                  <span className="text-emerald-300 font-mono text-[11px]">
                    Leadership • Handling Change • New Tech
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    Training Routine:
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Trying New Things, Asking 'What if...?'
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all group"
            >
              <span>Start Independent AQ Test (10 Qs)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. The Problems We Face & How Enigma Helps (Simple & Friendly Terms) */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>The Modern Problem & The Solution</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Why One-Dimensional Intelligence Fails Us Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            For generations, people believed that book smarts and IQ were the
            only things needed for a good life. But the modern world poses four
            real problems that simple IQ cannot solve:
          </p>
        </div>

        {/* 4 Problem vs Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Problem 1: IQ */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-blue-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  The IQ Problem
                </span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded font-mono">
                  Machines Now Calculate Fast
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Computers Out-Compute Memorization
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                When AI can solve complex equations and retrieve data in
                milliseconds, simply memorizing facts is no longer enough.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs">
              <span className="text-blue-300 font-bold block mb-1">
                💡 Enigma's Solution:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We test and train genuine human reasoning: critical thinking,
                pattern recognition, and creative problem solving that AI cannot
                replace.
              </p>
            </div>
          </div>

          {/* Problem 2: EQ */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-rose-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  The EQ Problem
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded font-mono">
                  Stress & Digital Burnout
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Isolation, Friction & Constant Anxiety
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Constant screen time, workplace pressure, and lack of real
                connection leave people drained, reactive, and easily stressed.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs">
              <span className="text-rose-300 font-bold block mb-1">
                ❤️ Enigma's Solution:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We measure how you handle emotional tension and help you build
                habits to stay calm, listen deeply, and build trust with others.
              </p>
            </div>
          </div>

          {/* Problem 3: SQ */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  The SQ Problem
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded font-mono">
                  Outer Success, Inner Void
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Chasing Goals Without Inner Meaning
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Many achieve high scores or jobs, yet still feel empty or
                anxious because they haven't anchored themselves in clear core
                values.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-900/50 text-xs">
              <span className="text-amber-300 font-bold block mb-1">
                🧭 Enigma's Solution:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We evaluate your inner principles and purpose, guiding you to
                find peace, focus on what you can control, and live with
                clarity.
              </p>
            </div>
          </div>

          {/* Problem 4: AQ */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  The AQ Problem
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-mono">
                  Freezing When Life Changes
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Struggling When The Rules Shift Overnight
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                When career conditions, new technologies, or unexpected events
                happen, clinging to old methods causes panic and failure.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-xs">
              <span className="text-emerald-300 font-bold block mb-1">
                ⚡ Enigma's Solution:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We measure your adaptability quotient, helping you embrace
                novelty, learn new tools quickly, and bounce back stronger from
                challenges.
              </p>
            </div>
          </div>
        </div>

        {/* The Enigma Antidote Statement */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-emerald-950/90 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white">
              Enigma's Solution: 4D Intelligence Synthesis
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              We bring balance back to your mind. By measuring and training IQ,
              EQ, SQ, and AQ together, you grow into a well-rounded thinker who
              is calm, empathetic, and ready for whatever the future brings.
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
    </div>
  );
}
