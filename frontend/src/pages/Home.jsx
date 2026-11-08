import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Award, 
  Compass,
  Zap,
  ArrowRight, 
  BarChart3, 
  Clock, 
  UserCheck,
  TrendingUp,
  Layers,
  Dumbbell,
  Quote,
  AlertTriangle,
  HeartHandshake,
  Sun,
  Shield,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home({ onStartQuiz }) {
  const { user } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Check which modules have been completed
  const [iqRecord, setIqRecord] = useState(null);
  const [eqRecord, setEqRecord] = useState(null);
  const [sqRecord, setSqRecord] = useState(null);
  const [aqRecord, setAqRecord] = useState(null);

  const intelligenceQuotes = [
    {
      pillar: 'AQ',
      quote: 'The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.',
      author: 'Alvin Toffler',
      title: 'Futurist & Author of Future Shock',
      takeaway: 'In the modern world, being able to adapt and learn new skills is more important than memorizing facts.',
      color: 'emerald'
    },
    {
      pillar: 'SQ',
      quote: 'You have power over your mind — not outside events. Realize this, and you will find immense strength.',
      author: 'Marcus Aurelius',
      title: 'Roman Emperor & Stoic Philosopher',
      takeaway: 'Staying calm on the inside helps you handle unpredictable changes around you.',
      color: 'amber'
    },
    {
      pillar: 'EQ',
      quote: 'In a high-IQ job pool, soft skills like emotional intelligence, self-regulation, and empathy determine who leads and who falters.',
      author: 'Daniel Goleman',
      title: 'Psychologist & Author of Emotional Intelligence',
      takeaway: 'Being smart is just the start; how you handle emotions and relate to people determines real success.',
      color: 'rose'
    },
    {
      pillar: 'IQ',
      quote: 'The measure of intelligence is the ability to change, adapt, and reason from first principles.',
      author: 'Albert Einstein',
      title: 'Theoretical Physicist',
      takeaway: 'Real intelligence is about understanding why things work, not just memorizing steps.',
      color: 'blue'
    },
    {
      pillar: 'SQ',
      quote: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
      author: 'Viktor E. Frankl',
      title: 'Neurologist, Psychiatrist & Holocaust Survivor',
      takeaway: 'You find true strength by choosing how you respond to tough times.',
      color: 'amber'
    },
    {
      pillar: 'AQ',
      quote: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.',
      author: 'Charles Darwin',
      title: 'Naturalist & Evolutionary Biologist',
      takeaway: 'Being flexible and willing to change keeps you strong through any challenge.',
      color: 'emerald'
    }
  ];

  useEffect(() => {
    try {
      setIqRecord(JSON.parse(localStorage.getItem('enigma_iq_data') || localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('enigma_iq_data') || sessionStorage.getItem('smartiq_iq_data') || 'null'));
      setEqRecord(JSON.parse(localStorage.getItem('enigma_eq_data') || localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('enigma_eq_data') || sessionStorage.getItem('smartiq_eq_data') || 'null'));
      setSqRecord(JSON.parse(localStorage.getItem('enigma_sq_data') || localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('enigma_sq_data') || sessionStorage.getItem('smartiq_sq_data') || 'null'));
      setAqRecord(JSON.parse(localStorage.getItem('enigma_aq_data') || localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('enigma_aq_data') || sessionStorage.getItem('smartiq_aq_data') || 'null'));
    } catch (e) {}
  }, []);

  const completedCount = [iqRecord, eqRecord, sqRecord, aqRecord].filter(Boolean).length;
  const currentQuote = intelligenceQuotes[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % intelligenceQuotes.length);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + intelligenceQuotes.length) % intelligenceQuotes.length);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Authenticated Hub • {user?.email || 'User Account'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
          The <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">4 Types of Intelligence</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto mb-5">
          Pick a test below. Answer 10 quick questions to discover your strengths and personal style.
        </p>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onStartQuiz('gym')}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-950/80 border border-indigo-600/50 text-indigo-300 hover:bg-indigo-900/50 transition-all"
          >
            <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cognitive Gym & Drills</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={() => onStartQuiz('results')}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-md shadow-indigo-600/20 hover:opacity-95 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>View 4D Matrix ({completedCount}/4 Completed)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Sleek Inspiration Bar */}
      <div className="glass-panel px-5 py-4 rounded-2xl border border-indigo-500/20 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
            <Quote className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs sm:text-sm text-slate-200 italic truncate">
              "{currentQuote.quote}" <span className="text-slate-400 not-italic font-semibold">— {currentQuote.author}</span>
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

      {/* 3. 4 Separate Assessment Modules Grid */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose an Assessment Module
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each test has 10 quick questions with helpful tips and fair-play monitoring.
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">Cognitive Intelligence (IQ)</h3>
                {iqRecord && (
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                    Score: {iqRecord.iq_score}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to think logically, recognize patterns, and solve problems."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Key Focus Areas:</span>
                  <span className="text-blue-300 font-mono text-[11px]">Science • Math • Programming</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Training Routine:</span>
                  <span className="text-slate-400 text-[11px]">Chess, Sudoku, Logic Puzzles</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz('iq')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all group"
            >
              <span>{iqRecord ? 'Retake IQ Assessment (10 Qs)' : 'Start Independent IQ Test (10 Qs)'}</span>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">Emotional Quotient (EQ)</h3>
                {eqRecord && (
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                    Score: {eqRecord.eq_score}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to understand and manage emotions."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Key Focus Areas:</span>
                  <span className="text-rose-300 font-mono text-[11px]">Psychology • Relationships • Leadership</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Training Routine:</span>
                  <span className="text-slate-400 text-[11px]">Daily Journaling, Active Listening</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz('eq')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/20 transition-all group"
            >
              <span>{eqRecord ? 'Retake EQ Assessment (10 Qs)' : 'Start Independent EQ Test (10 Qs)'}</span>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">Spiritual Quotient (SQ)</h3>
                {sqRecord && (
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                    Score: {sqRecord.sq_score}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 italic">
                "The ability to find meaning, stay grounded in your values, and feel internally whole."
              </p>

              <div className="space-y-2 text-xs text-slate-400 mb-6 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Key Focus Areas:</span>
                  <span className="text-amber-300 font-mono text-[11px]">Philosophy • Values • Inner Peace</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">Training Routine:</span>
                  <span className="text-slate-400 text-[11px]">Quiet Reflection, Living by Core Principles</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz('sq')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-500/20 transition-all group"
            >
              <span>{sqRecord ? 'Retake SQ Assessment (10 Qs)' : 'Start Independent SQ Test (10 Qs)'}</span>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white">Adaptability Quotient (AQ)</h3>
                {aqRecord && (
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                    Score: {aqRecord.aq_score}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "The ability to learn and adapt when faced with new situations." Measures how fast you bounce back from setbacks, learn new skills, and handle surprises.
              </p>


            </div>

            <button
              onClick={() => onStartQuiz('aq')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all group"
            >
              <span>{aqRecord ? 'Retake AQ Assessment (10 Qs)' : 'Start Independent AQ Test (10 Qs)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

          </div>
  );
}
