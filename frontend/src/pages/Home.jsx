import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Award, 
  Compass,
  Zap,
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Copy, 
  Check, 
  RefreshCw,
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
import { getSessionId } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Home({ onStartQuiz }) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);
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
      takeaway: 'In the AI age, adaptability and velocity of unlearning trump static knowledge.',
      color: 'emerald'
    },
    {
      pillar: 'SQ',
      quote: 'You have power over your mind — not outside events. Realize this, and you will find immense strength.',
      author: 'Marcus Aurelius',
      title: 'Roman Emperor & Stoic Philosopher',
      takeaway: 'Internal equanimity shields against uncontrollable macroeconomic and technological volatility.',
      color: 'amber'
    },
    {
      pillar: 'EQ',
      quote: 'In a high-IQ job pool, soft skills like emotional intelligence, self-regulation, and empathy determine who leads and who falters.',
      author: 'Daniel Goleman',
      title: 'Psychologist & Author of Emotional Intelligence',
      takeaway: 'Cognitive capability is merely the baseline; emotional sovereignty determines leadership success.',
      color: 'rose'
    },
    {
      pillar: 'IQ',
      quote: 'The measure of intelligence is the ability to change, adapt, and reason from first principles.',
      author: 'Albert Einstein',
      title: 'Theoretical Physicist',
      takeaway: 'True intelligence lies in deconstructing dogmas down to foundational truths, not rote computation.',
      color: 'blue'
    },
    {
      pillar: 'SQ',
      quote: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
      author: 'Viktor E. Frankl',
      title: 'Neurologist, Psychiatrist & Holocaust Survivor',
      takeaway: 'Meaning is discovered in intentional response, transforming involuntary suffering into inner triumph.',
      color: 'amber'
    },
    {
      pillar: 'AQ',
      quote: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.',
      author: 'Charles Darwin',
      title: 'Naturalist & Evolutionary Biologist',
      takeaway: 'Antifragility outlasts raw strength. Pivot agility preserves relevance across shifting paradigms.',
      color: 'emerald'
    }
  ];

  useEffect(() => {
    setSessionId(getSessionId());
    try {
      setIqRecord(JSON.parse(localStorage.getItem('enigma_iq_data') || localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('enigma_iq_data') || sessionStorage.getItem('smartiq_iq_data') || 'null'));
      setEqRecord(JSON.parse(localStorage.getItem('enigma_eq_data') || localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('enigma_eq_data') || sessionStorage.getItem('smartiq_eq_data') || 'null'));
      setSqRecord(JSON.parse(localStorage.getItem('enigma_sq_data') || localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('enigma_sq_data') || sessionStorage.getItem('smartiq_sq_data') || 'null'));
      setAqRecord(JSON.parse(localStorage.getItem('enigma_aq_data') || localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('enigma_aq_data') || sessionStorage.getItem('smartiq_aq_data') || 'null'));
    } catch (e) {}
  }, []);

  const handleCopySession = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateSession = () => {
    const newId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('smartiq_session_id', newId);
    setSessionId(newId);
  };

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

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          The <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">4 Types of Intelligence</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
          Explore and measure each dimension of human capability independently with 10 calibrated questions each. Complete individual tests at your own pace, or synthesize your complete 4D Multidimensional Matrix.
        </p>

        {/* Session ID Chip & Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Session ID:</span>
            <span className="font-mono text-indigo-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {sessionId || 'Initializing...'}
            </span>
            <button
              onClick={handleCopySession}
              title="Copy Session ID"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRegenerateSession}
              title="Regenerate"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

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

      {/* 2. Daily Intelligence Wisdom & Quotes Banner */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-md">
              <Quote className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  currentQuote.pillar === 'IQ' ? 'bg-blue-950 text-blue-300 border-blue-800/50' :
                  currentQuote.pillar === 'EQ' ? 'bg-rose-950 text-rose-300 border-rose-800/50' :
                  currentQuote.pillar === 'SQ' ? 'bg-amber-950 text-amber-300 border-amber-800/50' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                }`}>
                  {currentQuote.pillar} Wisdom
                </span>
                <span className="text-xs text-slate-400">Quote {quoteIndex + 1} of {intelligenceQuotes.length}</span>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
                "{currentQuote.quote}"
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                <span className="font-bold text-white">— {currentQuote.author}</span>
                <span>•</span>
                <span>{currentQuote.title}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/70 text-xs text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span><strong>Takeaway:</strong> {currentQuote.takeaway}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handlePrevQuote}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Previous Quote"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextQuote}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              title="Next Quote"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4 Separate Assessment Modules Grid */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose an Assessment Module
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each module contains 10 rigorous questions with a pre-test briefing and live anti-cheat protection.
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

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "The ability to think logically, recognize patterns, and solve problems." Evaluates raw deduction, mathematical sequences, and spatial mental rotation.
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Key Focus Areas</span>
                  <span className="font-semibold text-blue-400">Science • Math • Programming</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Training Routine</span>
                  <span className="text-slate-300">Chess, Sudoku, Statistics</span>
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

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "The ability to understand and manage emotions." Evaluates affective empathy, somatic self-regulation under pressure, and social conflict de-escalation.
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Key Focus Areas</span>
                  <span className="font-semibold text-rose-400">Psychology • Relationships • Leadership</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Training Routine</span>
                  <span className="text-slate-300">Nightly Emotional Journal, Active Listening</span>
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

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                "The ability to find meaning, stay grounded in your values, and feel internally whole." Measures Stoic equanimity, purpose alignment, and moral agency.
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Key Focus Areas</span>
                  <span className="font-semibold text-amber-400">Literature • Philosophy • Stoic Ethics</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Training Routine</span>
                  <span className="text-slate-300">Values Reflection, Study of Stoicism</span>
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
                "The ability to learn when faced with new or unpredictable situations." Measures crisis velocity, AI paradigm assimilation, and rapid unlearning/relearning.
              </p>

              <div className="space-y-1.5 mb-6 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Key Focus Areas</span>
                  <span className="font-semibold text-emerald-400">Leadership • AI • Crisis Management</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="font-medium text-slate-300">Training Routine</span>
                  <span className="text-slate-300">Ask 'What if...?', Voluntary Novelty</span>
                </div>
              </div>
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

      {/* 4. THE MAIN MODERN PROBLEM ENIGMA SOLVES */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>The Modern Cognitive Dilemma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            The Main Problem Enigma Solves
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            For over a century, human potential was gauged by a solitary metric: <strong>IQ (Academic Logic)</strong>. However, in the Generative AI era, mechanical calculation and syntax generation have been commoditized. Relying solely on IQ leaves humans vulnerable to four critical failure modes:
          </p>
        </div>

        {/* 4 Failure Modes vs 4 Enigma Antidotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> The IQ Dilemma
              </span>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded font-mono">AI Automation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              LLMs compute syntax and mathematical proofs in milliseconds. Enigma re-anchors IQ on <strong>first-principles mental models, pattern deconstruction, and Bayesian evaluation</strong> rather than rote memorization.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> The EQ Dilemma
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/50 px-2 py-0.5 rounded font-mono">Digital Friction</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Asynchronous communication and algorithmic polarization amplify burnout and defensive escalation. Enigma trains <strong>somatic nervous system self-regulation, active listening, and conflict de-escalation</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> The SQ Dilemma
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded font-mono">Existential Drift</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modern careers incentivize chasing external praise without an internal compass, causing chronic apathy. Enigma grounds your psyche in <strong>Stoic equanimity and Epictetus' Dichotomy of Control</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> The AQ Dilemma
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-mono">Disruption Shock</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industries and paradigms flip every 18 months. Rigid adherence to yesterday's mastery is fatal. Enigma measures and expands your <strong>unlearning rate, pivot velocity, and Nassim Taleb's antifragility</strong>.
            </p>
          </div>
        </div>

        {/* Antidote Summary Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">The Enigma Antidote: 4D Antifragile Synthesis</h4>
              <p className="text-xs text-slate-300">By assessing and training all 4 dimensions, you build a mind that thrives amid uncertainty.</p>
            </div>
          </div>
          <button
            onClick={() => onStartQuiz('gym')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Train in Cognitive Gym</span>
          </button>
        </div>
      </div>
    </div>
  );
}
