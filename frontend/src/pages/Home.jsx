import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { getSessionId } from '../api';

export default function Home({ onStartQuiz }) {
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSessionId(getSessionId());
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/40 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Dual Psychometrics</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Map Your <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Cognitive & Emotional</span> Architecture
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
          SmartIQ combines rigorous deductive problem-solving with emotional resonance testing. Uncover your true mental archetype backed by Google Gemini & Groq cognitive analytics.
        </p>

        {/* Anonymous Session Token Card */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl glass-card border border-slate-800 text-xs text-slate-400 mb-8 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Session ID:</span>
            <span className="font-mono text-indigo-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700/60">
              {sessionId || 'Initializing...'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopySession}
              title="Copy Session ID"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRegenerateSession}
              title="Regenerate Anonymous Token"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => onStartQuiz('iq')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all text-base sm:text-lg group"
          >
            <span>Begin Dual Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Assessment Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        {/* IQ Module Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              45s / Question
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Cognitive Intelligence (IQ)</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Evaluates raw abstract reasoning, mathematical series deduction, and spatial mental rotation. Questions are drawn randomly from our curated psychometric bank.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Deductive Logic & Syllogisms</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Quantitative & Sequence Math</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Spatial Matrix & SVG Rotation</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
          </div>

          <button
            onClick={() => onStartQuiz('iq')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
          >
            <span>Launch IQ Test (5 Sampled)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* EQ Module Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-600/20 transition-all"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Scenario-Based
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Emotional Intelligence (EQ)</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Measures situational self-regulation, somatic trigger awareness, and social empathy in high-stakes workplace and interpersonal scenarios.
          </p>

          <div className="space-y-2 mb-6 text-xs text-slate-400">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Self-Awareness & Somatic Triggers</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Self-Regulation & Conflict Control</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span>Perspective-Taking & Empathy</span>
              <span className="font-semibold text-slate-200">5 Pool Items</span>
            </div>
          </div>

          <button
            onClick={() => onStartQuiz('eq')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all"
          >
            <span>Launch EQ Test (5 Sampled)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 pb-4 border-t border-slate-800/80 text-center sm:text-left">
        <div className="flex items-center gap-3 p-3">
          <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Anti-Cheat Defense</h4>
            <p className="text-xs text-slate-400">Visibility API tab tracking & selection locking</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/50">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Dual AI Inference</h4>
            <p className="text-xs text-slate-400">Gemini & Groq with offline deterministic engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Full Analytics Matrix</h4>
            <p className="text-xs text-slate-400">Radar maps, habit plans & error breakdowns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
