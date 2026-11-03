import React from "react";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function Quiz({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNext,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
        <span>
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="flex items-center gap-1 text-indigo-400">
          <Clock size={14} /> Live Assessment
        </span>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-lg md:text-xl font-medium text-slate-200 min-h-[60px]">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              onClick={() => onSelectOption(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                isSelected
                  ? "border-indigo-500 bg-indigo-600/10 text-white shadow-md"
                  : "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
              }`}
            >
              <span>{option}</span>
              {isSelected && (
                <CheckCircle2 size={18} className="text-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedOption}
        className={`w-full py-3.5 px-6 font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 ${
          selectedOption
            ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-600/20"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        {currentIndex === totalQuestions - 1
          ? "Evaluate Results"
          : "Next Question"}{" "}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
