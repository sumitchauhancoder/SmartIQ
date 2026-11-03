import React from 'react';
import { 
  Brain, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Users 
} from 'lucide-react';

export default function PublicLanding({ onGetStarted, onSignIn }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto pt-6 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-6 shadow-sm animate-pulse-subtle">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The Next-Generation Dual Psychometrics Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Measure Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Cognitive & Emotional
          </span> Architecture
        </h1>

        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
          SmartIQ combines rigorous deductive problem-solving with situational emotional intelligence testing. Uncover your true psychological archetype powered by ultra-fast Groq AI inference.
        </p>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all text-base group"
          >
            <span>Get Started</span>
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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Cloud Profile
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Groq AI Synthesis
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Anti-Cheat Verification
          </span>
        </div>
      </div>

      {/* Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        {/* Pillar 1: IQ Module */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-5">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Cognitive Intelligence (IQ)</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Evaluates raw abstract reasoning, quantitative sequences, and spatial mental rotation. Features 45-second timed question cycles drawn from a dynamic cloud question bank.
          </p>
        </div>

        {/* Pillar 2: EQ Module */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-5">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Emotional Intelligence (EQ)</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tests somatic trigger recognition, emotional self-regulation under crisis, and cognitive empathy in realistic interpersonal and leadership scenarios.
          </p>
        </div>

        {/* Pillar 3: AI Mind Archetypes */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 mb-5">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Archetype Synthesis</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Groq AI combines your multi-dimensional sub-scores into a customized psychological profile, mistake deconstruction, and daily mental training protocols.
          </p>
        </div>
      </div>

      {/* Security & Analytics Footer Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 my-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/50 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Cloud Authentication & Anti-Cheat Protection</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Supabase Auth with live tab-switch tracking to safeguard score integrity.
            </p>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span>Create Free Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
