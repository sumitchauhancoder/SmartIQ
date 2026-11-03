import React from "react";
import { Award, RotateCcw } from "lucide-react";

export default function Results({ results, totalTime, onRetake }) {
  return (
    <div className="space-y-6">
      <div className="text-center pb-2 border-b border-slate-800">
        <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl mb-2">
          <Award size={32} />
        </div>
        <h2 className="text-2xl font-bold">Assessment Complete</h2>
        <p className="text-slate-400 text-sm">
          Completed in {totalTime} seconds
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl text-center">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Estimated IQ Band
        </span>
        <div className="text-3xl font-extrabold text-white mt-1">
          {results.estimated_iq_range}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl space-y-2">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Strengths
          </h4>
          <ul className="text-sm space-y-1 text-slate-300">
            {results.cognitive_strengths?.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl space-y-2">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Areas to Improve
          </h4>
          <ul className="text-sm space-y-1 text-slate-300">
            {results.cognitive_weaknesses?.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          Personalized Action Roadmap
        </h4>
        <div className="space-y-2">
          {results.action_plan?.map((stepItem, i) => (
            <div
              key={i}
              className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl text-sm text-slate-300 flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-5 h-5 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span>{stepItem}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRetake}
        className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
      >
        <RotateCcw size={18} /> Back to Dashboard
      </button>
    </div>
  );
}
