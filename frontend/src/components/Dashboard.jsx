import React from "react";
import {
  Brain,
  ArrowRight,
  Zap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function Dashboard({ onStart, error }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex p-4 bg-indigo-600/10 text-indigo-400 rounded-2xl mb-1 shadow-inner">
          <Brain size={48} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
          SmartIQ Assessment
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Test your cognitive reasoning, pattern recognition, and logic with our
          fast AI-driven evaluation engine.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center space-y-2">
          <div className="text-indigo-400 flex justify-center">
            <Zap size={22} />
          </div>
          <h3 className="font-semibold text-sm text-slate-200">
            Instant Analysis
          </h3>
          <p className="text-xs text-slate-400">
            Real-time performance scoring powered by AI.
          </p>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center space-y-2">
          <div className="text-emerald-400 flex justify-center">
            <Sparkles size={22} />
          </div>
          <h3 className="font-semibold text-sm text-slate-200">
            Action Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Custom exercises tailored to your weak points.
          </p>
        </div>
        <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl text-center space-y-2">
          <div className="text-amber-400 flex justify-center">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-semibold text-sm text-slate-200">Cross-Device</h3>
          <p className="text-xs text-slate-400">
            Optimized for phones, tablets, and laptops.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer text-base"
      >
        Start Core IQ Test <ArrowRight size={18} />
      </button>
    </div>
  );
}
