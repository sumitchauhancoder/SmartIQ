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
  Dumbbell
} from 'lucide-react';
import { getSessionId } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Home({ onStartQuiz }) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);

  // Check which modules have been completed
  const [iqRecord, setIqRecord] = useState(null);
  const [eqRecord, setEqRecord] = useState(null);
  const [sqRecord, setSqRecord] = useState(null);
  const [aqRecord, setAqRecord] = useState(null);

  useEffect(() => {
    setSessionId(getSessionId());
    try {
      setIqRecord(JSON.parse(localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('smartiq_iq_data') || 'null'));
      setEqRecord(JSON.parse(localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('smartiq_eq_data') || 'null'));
      setSqRecord(JSON.parse(localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('smartiq_sq_data') || 'null'));
      setAqRecord(JSON.parse(localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('smartiq_aq_data') || 'null'));
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Authenticated Hub • {user?.email || 'User Account'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          The <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">4 Types of Intelligence</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
          Explore and measure each dimension of human capability independently. Complete individual tests at your own pace, or synthesize your complete 4D Multidimensional Matrix.
        </p>

        {/* Session ID Chip & 4D Progress */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
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

      {/* 4 Separate Assessment Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
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
            <span>{iqRecord ? 'Retake IQ Assessment' : 'Start Independent IQ Test'}</span>
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
            <span>{eqRecord ? 'Retake EQ Assessment' : 'Start Independent EQ Test'}</span>
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
            <span>{sqRecord ? 'Retake SQ Assessment' : 'Start Independent SQ Test'}</span>
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
            <span>{aqRecord ? 'Retake AQ Assessment' : 'Start Independent AQ Test'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}