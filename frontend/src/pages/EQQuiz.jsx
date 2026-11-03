import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  ShieldAlert, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import AntiCheatAlert from '../components/AntiCheatAlert';
import { fetchQuestions, submitAnalysis, getSessionId } from '../api';
import { getFallbackQuestions } from '../data/fallbackQuestions';
import { useAuth } from '../context/AuthContext';

export default function EQQuiz({ iqData, onComplete, onTabSwitch, tabSwitchCount = 0 }) {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Tab switch listener
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

  // Load 5 randomized EQ scenario questions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchQuestions('EQ', 5);
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setQuestions(getFallbackQuestions('EQ', 5));
        }
      } catch (e) {
        setQuestions(getFallbackQuestions('EQ', 5));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;

    const currentQ = questions[currentIndex];
    const pointsList = currentQ.points || [1, 2, 3, 4];
    const earnedPoints = pointsList[selectedOption] !== undefined ? pointsList[selectedOption] : 2;

    const answerRecord = {
      question_id: currentQ.id,
      question_text: currentQ.question_text,
      sub_category: currentQ.sub_category,
      user_index: selectedOption,
      user_option: currentQ.options[selectedOption],
      points_earned: earnedPoints,
      explanation: currentQ.explanation
    };

    const updatedAnswers = [...userAnswers, answerRecord];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await finalizeDualEvaluation(updatedAnswers);
    }
  };

  const finalizeDualEvaluation = async (answers) => {
    setAnalyzing(true);

    let totalPoints = 0;
    const subTotals = {
      'Self-Awareness': { earned: 0, max: 0 },
      'Self-Regulation': { earned: 0, max: 0 },
      'Empathy': { earned: 0, max: 0 }
    };

    answers.forEach((ans) => {
      const sub = ans.sub_category || 'Self-Awareness';
      if (!subTotals[sub]) subTotals[sub] = { earned: 0, max: 0 };
      subTotals[sub].earned += ans.points_earned;
      subTotals[sub].max += 4;
      totalPoints += ans.points_earned;
    });

    // EQ Score mapping: 5 questions * 4 max = 20 pts.
    // Score baseline 85 + (totalPoints / 20) * 55 -> 85 to 140
    const eqScore = Math.min(145, Math.round(85 + (totalPoints / (answers.length * 4)) * 55));

    const eqBreakdown = {};
    Object.keys(subTotals).forEach((cat) => {
      const item = subTotals[cat];
      const ratio = item.max > 0 ? item.earned / item.max : 0.6;
      eqBreakdown[cat] = Math.round(ratio * 100);
    });

    const sessionId = getSessionId();

    const submissionPayload = {
      session_id: sessionId,
      user_id: user?.id || null,
      iq_score: iqData?.iq_score || 105,
      iq_breakdown: iqData?.iq_breakdown || { Logic: 75, Math: 70, Spatial: 80 },
      eq_score: eqScore,
      eq_breakdown: eqBreakdown,
      incorrect_questions: iqData?.incorrect_questions || [],
      tab_switch_count: tabSwitchCount
    };

    // Synthesize analysis via Backend (Groq / Fallback)
    const aiAnalysis = await submitAnalysis(submissionPayload, token);

    setAnalyzing(false);

    onComplete({
      ...submissionPayload,
      eq_answers: answers,
      ai_analysis: aiAnalysis
    });
  };

  if (loading || analyzing) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {analyzing ? 'Synthesizing Neural Archetype...' : 'Loading Emotional Scenarios...'}
        </h3>
        <p className="text-slate-400 text-sm max-w-sm">
          {analyzing
            ? 'Transmitting psychometric dimensions to Groq AI cognitive engine...'
            : 'Calibrating empathy and self-regulation parameters...'}
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">No EQ Scenarios Found</h3>
        <p className="text-slate-400 text-sm max-w-sm mb-6">Unable to retrieve emotional scenario bank.</p>
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

      {/* Header Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-6 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Emotional Intelligence Module
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                {currentQ.sub_category}
              </span>
            </div>
            <p className="text-sm font-bold text-white">
              Scenario {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Competency Scale (1 - 4 Pts)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Scenario Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-6">
        <div className="inline-block px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-semibold mb-4">
          Workplace & Interpersonal Case Study
        </div>

        <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed mb-6">
          {currentQ.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full min-h-[56px] p-4 rounded-2xl text-left text-sm sm:text-base font-normal sm:font-medium transition-all duration-200 flex items-start justify-between border ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5 pr-2">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug pt-0.5">{optionText}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
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
          Reflective response evaluation
        </span>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
            selectedOption !== null
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Finalize & Synthesize' : 'Next Scenario'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
