import React from "react";
import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="inline-block animate-spin text-indigo-500 mb-2">
        <Brain size={40} />
      </div>
      <h3 className="text-xl font-bold">Analyzing Cognitive Patterns...</h3>
      <p className="text-slate-400 text-sm">
        Gemini is evaluating your response metrics and generating your custom
        action plan.
      </p>
    </div>
  );
}
