import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  BarChart3,
  Heart,
  ShieldCheck
} from 'lucide-react';
import Timer from '../components/Timer';
import AntiCheatAlert from '../components/AntiCheatAlert';
import { fetchQuestions, submitAnalysis, getSessionId } from '../api';
import { getFallbackQuestions } from '../data/fallbackQuestions';
import { useAuth } from '../context/AuthContext';

export default function EQQuiz({ onComplete, onNavigate, onTabSwitch, tabSwitchCount = 0 }) {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [completedData, setCompletedData] = useState(null);

  // Tab switch & visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !completedData) {
        onTabSwitch();
      }
    };
    const handleBlur = () => {
      if (!completedData) {
        onTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitch, completedData]);

  // Load 5 randomized EQ questions
  useEffect(() => {
    loadEQQuestions();
  }, []);

  const loadEQQuestions = async () => {
    setLoading(true);
    setCompletedData(null);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
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
  };

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  const handleNext = async (timedOut = false) => {
    if (selectedOption === null && !timedOut) return;

    const currentQ = questions[currentIndex];
    const pointsList = currentQ.points || [1, 2, 3, 4];
    const chosenIndex = timedOut ? 0 : selectedOption;
    const earnedPoints = pointsList[chosenIndex] !== undefined ? pointsList[chosenIndex] : 2;

    const answerRecord = {
      question_id: currentQ.id,
      question_text: currentQ.question_text,
      sub_category: currentQ.sub_category,
      user_index: chosenIndex,
      user_option: chosenIndex >= 0 ? currentQ.options[chosenIndex] : 'Time Expired',
      points_earned: earnedPoints,
      explanation: currentQ.explanation
    };

    const updatedAnswers = [...userAnswers, answerRecord];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await finalizeEQEvaluation(updatedAnswers);
    }
  };

  const finalizeEQEvaluation = async (answers) => {
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

    // Score scale: baseline 85 + (totalPoints / 20) * 55 -> 85 to 140
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
      test_type: 'EQ',
      eq_score: eqScore,
      eq_breakdown: eqBreakdown,
      incorrect_questions: answers.filter((a) => a.points_earned < 3),
      tab_switch_count: tabSwitchCount
    };

    // Synthesize analysis via Backend / Local Fallback
    const aiAnalysis = await submitAnalysis(submissionPayload, token);

    const resultRecord = {
      eq_score: eqScore,
      eq_breakdown: eqBreakdown,
      eq_answers: answers,
      ai_analysis: aiAnalysis,
      timestamp: new Date().toISOString()
    };

    // Save to persistent storage
    localStorage.setItem('smartiq_eq_data', JSON.stringify(resultRecord));
    sessionStorage.setItem('smartiq_eq_data', JSON.stringify(resultRecord));

    setCompletedData(resultRecord);
    setAnalyzing(false);

    if (onComplete) {
      onComplete(resultRecord);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm">Compiling Emotional Acuity Scenarios...</p>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Emotional Intelligence (EQ)</h3>
        <p className="text-slate-400 text-sm max-w-sm">Evaluating affective empathy, somatic regulation, and social de-escalation acuity...</p>
      </div>
    );
  }

  // =========================================================================
  // Independent Completion Report View
  // =========================================================================
  if (completedData) {
    const { eq_score, eq_breakdown, ai_analysis } = completedData;
    const percentile = Math.min(99, Math.round(50 + ((eq_score - 100) / 15) * 34));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 relative overflow-hidden mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/40 text-rose-300 text-xs font-semibold mb-3">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Emotional Intelligence Module Completed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                EQ Score: <span className="text-rose-400 font-mono">{eq_score}</span>
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                {ai_analysis?.core_summary || 'You demonstrate high affective empathy, situational self-regulation, and natural interpersonal warmth.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-rose-500/30 min-w-[130px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                Percentile Rank
              </span>
              <span className="text-3xl font-black text-white font-mono">
                {percentile}%
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Top {Math.max(1, 100 - percentile)}% of cohort
              </span>
            </div>
          </div>

          {/* Infographic Alignment Badge */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">Impact Rating</span>
              <span className="text-lg font-bold text-white">9.3 / 10</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Understand and manage emotions</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">Core Areas</span>
              <p className="font-semibold text-slate-200">Psychology • Relationships • Family Dynamics</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-rose-400 font-bold block mb-1">How to Train</span>
              <p className="text-slate-300">Emotional journal for 10 mins each night. Listen actively.</p>
            </div>
          </div>
        </div>

        {/* Sub-Dimension Breakdown Bars */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>Emotional & Social Sub-Dimensions</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(eq_breakdown || {}).map(([category, score]) => (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{category}</span>
                  <span className="text-rose-400 font-bold font-mono">{score}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={loadEQQuestions}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake EQ Assessment</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('sq')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-amber-800/60 hover:bg-amber-950/40 text-amber-300 transition-all"
            >
              <span>Take SQ Test (Spiritual)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-lg shadow-rose-600/20 transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View 4D Matrix</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Active Assessment Question Flow
  // =========================================================================
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div 
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 select-none no-select"
      onContextMenu={(e) => e.preventDefault()}
    >
      <AntiCheatAlert switchCount={tabSwitchCount} />

      {/* Header Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl mb-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Emotional Quotient (EQ)
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
            questionKey={`eq-${currentIndex}`}
            onTimeUp={() => handleNext(true)}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-6 relative">
        <span className="text-[11px] font-mono text-rose-400/80 uppercase tracking-widest block mb-2">
          Interpersonal & Emotional Intelligence Scenario
        </span>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-rose-950/40 border-rose-500/80 text-white shadow-lg shadow-rose-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-500 text-white'
                    : 'border-slate-700 text-transparent'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm font-medium leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
          <span>Select the response representing highest empathetic acuity & composure</span>
        </div>

        <button
          onClick={() => handleNext(false)}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
            selectedOption !== null
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-500 hover:to-rose-400 cursor-pointer shadow-rose-500/20'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Finalize EQ Evaluation' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}