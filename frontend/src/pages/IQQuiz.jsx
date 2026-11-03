import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ShieldAlert 
} from 'lucide-react';
import Timer from '../components/Timer';
import AntiCheatAlert from '../components/AntiCheatAlert';
import { fetchQuestions } from '../api';
import { getFallbackQuestions } from '../data/fallbackQuestions';

export default function IQQuiz({ onComplete, onTabSwitch, tabSwitchCount = 0 }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab switch & visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onTabSwitch();
      }
    };
    const handleBlur = () => {
      onTabSwitch();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitch]);

  // Load 5 randomized IQ questions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchQuestions('IQ', 5);
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(getFallbackQuestions('IQ', 5));
        }
      } catch (e) {
        setQuestions(getFallbackQuestions('IQ', 5));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = (timedOut = false) => {
    const currentQ = questions[currentIndex];
    const chosenIndex = timedOut ? -1 : selectedOption;
    const isCorrect = chosenIndex === currentQ.correct_answer_index;

    const answerRecord = {
      question_id: currentQ.id,
      question_text: currentQ.question_text,
      sub_category: currentQ.sub_category,
      user_index: chosenIndex,
      user_option: chosenIndex >= 0 ? currentQ.options[chosenIndex] : 'Time Expired (No Option Selected)',
      correct_index: currentQ.correct_answer_index,
      correct_option: currentQ.options[currentQ.correct_answer_index],
      is_correct: isCorrect,
      explanation: currentQ.explanation
    };

    const updatedAnswers = [...userAnswers, answerRecord];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate overall IQ and sub-score breakdown
      finishIQQuiz(updatedAnswers);
    }
  };

  const finishIQQuiz = (answers) => {
    let correctCount = 0;
    const subTotals = { Logic: { correct: 0, total: 0 }, Math: { correct: 0, total: 0 }, Spatial: { correct: 0, total: 0 } };
    const incorrect = [];

    answers.forEach((ans) => {
      const sub = ans.sub_category || 'Logic';
      if (!subTotals[sub]) subTotals[sub] = { correct: 0, total: 0 };
      subTotals[sub].total += 1;

      if (ans.is_correct) {
        correctCount += 1;
        subTotals[sub].correct += 1;
      } else {
        incorrect.push({
          question_text: ans.question_text,
          user_option: ans.user_option,
          correct_option: ans.correct_option,
          explanation: ans.explanation
        });
      }
    });

    // Score formula: baseline 95 + (correctCount * 9) -> 0=95, 5=140
    const iqScore = Math.min(145, 95 + correctCount * 9);

    const iqBreakdown = {};
    Object.keys(subTotals).forEach((cat) => {
      const item = subTotals[cat];
      const ratio = item.total > 0 ? item.correct / item.total : 0.5;
      iqBreakdown[cat] = Math.round(ratio * 100);
    });

    onComplete({
      iq_score: iqScore,
      iq_breakdown: iqBreakdown,
      iq_answers: answers,
      incorrect_questions: incorrect
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm">Compiling psychometric sequence...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">No Questions Available</h3>
        <p className="text-slate-400 text-sm max-w-sm mb-6">Unable to connect to the question bank. Please verify backend service.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div 
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 select-none no-select"
      onContextMenu={(e) => e.preventDefault()}
    >
      <AntiCheatAlert switchCount={tabSwitchCount} />

      {/* Header bar: Progress + Timer */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Cognitive Intelligence Module
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                {currentQ.sub_category}
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* 45-Second Countdown Timer */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Timer
            duration={45}
            questionKey={`q-${currentIndex}`}
            onTimeUp={() => handleNext(true)}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-slate-100 leading-relaxed mb-6">
          {currentQ.question_text}
        </h2>

        {/* Inline Diagram/SVG Renderer for Spatial Questions */}
        {currentQ.diagram_svg && (
          <div 
            className="my-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center overflow-x-auto shadow-inner"
            dangerouslySetInnerHTML={{ __html: currentQ.diagram_svg }}
          />
        )}

        {/* Options Grid */}
        <div className="space-y-3 mt-6">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[52px] p-4 rounded-2xl text-left text-sm sm:text-base font-normal sm:font-medium transition-all duration-200 flex items-center justify-between border ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5 pr-2">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{optionText}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Anti-Cheat active • Auto-advances at 0s
        </span>

        <button
          onClick={() => handleNext(false)}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
            selectedOption !== null
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Submit IQ & Next' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
