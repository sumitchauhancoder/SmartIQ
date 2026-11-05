import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  BookOpen,
  BarChart3,
  Sun,
  ShieldCheck,
  Play,
  Clock,
  Target,
  Dumbbell
} from 'lucide-react';
import Timer from '../components/Timer';
import AntiCheatAlert from '../components/AntiCheatAlert';
import { fetchQuestions, submitAnalysis, getSessionId } from '../api';
import { getFallbackQuestions } from '../data/fallbackQuestions';
import { useAuth } from '../context/AuthContext';

export default function SQQuiz({ onComplete, onNavigate, onTabSwitch, tabSwitchCount = 0 }) {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [completedData, setCompletedData] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Tab switch & visibility listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !completedData) {
        onTabSwitch();
      }
    };
    const handleBlur = () => {
      if (hasStarted && !completedData) {
        onTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitch, hasStarted, completedData]);

  // Load 10 randomized SQ questions
  useEffect(() => {
    loadSQQuestions();
  }, []);

  const loadSQQuestions = async () => {
    setLoading(true);
    setCompletedData(null);
    setHasStarted(false);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    try {
      const data = await fetchQuestions('SQ', 10);
      if (data && data.length > 0) {
        setQuestions(data.slice(0, 10));
      } else {
        setQuestions(getFallbackQuestions('SQ', 10));
      }
    } catch (e) {
      setQuestions(getFallbackQuestions('SQ', 10));
    }
    setLoading(false);
  };

  const handleStartTest = () => {
    setHasStarted(true);
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
      await finalizeSQEvaluation(updatedAnswers);
    }
  };

  const finalizeSQEvaluation = async (answers) => {
    setAnalyzing(true);

    let totalPoints = 0;
    const subTotals = {
      'Philosophy & Stoicism': { earned: 0, max: 0 },
      'Purpose & Meaning': { earned: 0, max: 0 },
      'Core Values & Wholeness': { earned: 0, max: 0 }
    };

    answers.forEach((ans) => {
      const sub = ans.sub_category || 'Philosophy & Stoicism';
      if (!subTotals[sub]) subTotals[sub] = { earned: 0, max: 0 };
      subTotals[sub].earned += ans.points_earned;
      subTotals[sub].max += 4;
      totalPoints += ans.points_earned;
    });

    // Score scale: 85 baseline + scaled dynamic points -> 85 to 145
    const maxPossible = Math.max(1, answers.length * 4);
    const sqScore = Math.min(145, Math.round(85 + (totalPoints / maxPossible) * 55));

    const sqBreakdown = {};
    Object.keys(subTotals).forEach((cat) => {
      const item = subTotals[cat];
      const ratio = item.max > 0 ? item.earned / item.max : 0.6;
      sqBreakdown[cat] = Math.round(ratio * 100);
    });

    const sessionId = getSessionId();

    const submissionPayload = {
      session_id: sessionId,
      user_id: user?.id || null,
      test_type: 'SQ',
      sq_score: sqScore,
      sq_breakdown: sqBreakdown,
      incorrect_questions: answers.filter((a) => a.points_earned < 3),
      tab_switch_count: tabSwitchCount
    };

    // Synthesize analysis via Backend / Local Fallback
    const aiAnalysis = await submitAnalysis(submissionPayload, token);

    const resultRecord = {
      sq_score: sqScore,
      sq_breakdown: sqBreakdown,
      sq_answers: answers,
      ai_analysis: aiAnalysis,
      timestamp: new Date().toISOString()
    };

    // Save to persistent storage
    localStorage.setItem('smartiq_sq_data', JSON.stringify(resultRecord));
    sessionStorage.setItem('smartiq_sq_data', JSON.stringify(resultRecord));

    setCompletedData(resultRecord);
    setAnalyzing(false);

    if (onComplete) {
      onComplete(resultRecord);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm">Compiling Spiritual & Stoic Items...</p>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Spiritual Quotient (SQ)</h3>
        <p className="text-slate-400 text-sm max-w-sm">Measuring existential purpose, inner wholeness, and Stoic dichotomy of control...</p>
      </div>
    );
  }

  // =========================================================================
  // Pre-Test Briefing / Start Gate Screen
  // =========================================================================
  if (!hasStarted && !completedData) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Module Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Module 03 • Spiritual Quotient</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-800/60 text-amber-300">
              Impact Rating: 8 / 10
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            SQ Spiritual & Stoic Intelligence Assessment
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            The capacity to find existential meaning, anchor yourself in unchanging core values, exercise Epictetus' dichotomy of control, and maintain inner wholeness during adversity.
          </p>

          {/* Parameter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Target className="w-4 h-4" />
                <span>Test Length</span>
              </div>
              <p className="text-xl font-black text-white font-mono">10 Dilemmas</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Philosophical & moral scenarios</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4" />
                <span>Pacing</span>
              </div>
              <p className="text-xl font-black text-white font-mono">45s / Question</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Total duration ~8 mins</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Core Domains</span>
              </div>
              <p className="text-xs font-bold text-white mt-1">Stoicism • Meaning • Values</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Literature, philosophy & art</p>
            </div>
          </div>

          {/* Integrity & Rules */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/40 mb-8 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Assessment Protocol & Instructions:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>Choose the response that truthfully reflects your internal moral philosophy and instincts.</li>
              <li>Scenarios evaluate equanimity, judgment of externalities, and integrity under trial.</li>
              <li>45-second timer per item. Automatic progression when time runs out.</li>
            </ul>
          </div>

          {/* Start CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Assessment Hub
            </button>

            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 shadow-xl shadow-amber-600/30 transform hover:-translate-y-0.5 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start SQ Assessment (10 Questions)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Independent Completion Report View
  // =========================================================================
  if (completedData) {
    const { sq_score, sq_breakdown, ai_analysis } = completedData;
    const percentile = Math.min(99, Math.round(50 + ((sq_score - 100) / 15) * 34));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-3">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Spiritual Quotient Module Completed (10/10 Questions)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                SQ Score: <span className="text-amber-400 font-mono">{sq_score}</span>
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                {ai_analysis?.core_summary || 'You demonstrate deep existential grounding, resilient inner wholeness, and a principled moral compass.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-amber-500/30 min-w-[130px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
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
              <span className="text-amber-400 font-bold block mb-1">Impact Rating</span>
              <span className="text-lg font-bold text-white">8 / 10</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Existential meaning and inner wholeness</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">Core Areas</span>
              <p className="font-semibold text-slate-200">Literature • Philosophy • Art & Religion</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">How to Train</span>
              <p className="text-slate-300">Reflect on your values. Study the principles of Stoicism.</p>
            </div>
          </div>
        </div>

        {/* Sub-Dimension Breakdown Bars */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Spiritual & Stoic Sub-Dimensions</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(sq_breakdown || {}).map(([category, score]) => (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{category}</span>
                  <span className="text-amber-400 font-bold font-mono">{score}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={loadSQQuestions}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake SQ Test</span>
            </button>
            <button
              onClick={() => onNavigate('gym', 'SQ')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900/40 text-amber-300 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <span>Train SQ in Gym</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('results', 'SQ')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-amber-700/60 text-amber-300 hover:bg-amber-950/40 transition-all"
            >
              <span>View SQ Analysis</span>
            </button>
            <button
              onClick={() => onNavigate('results', 'ALL')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-600/20 transition-all"
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
          <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Spiritual Quotient (SQ)
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
            questionKey={`sq-${currentIndex}`}
            onTimeUp={() => handleNext(true)}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-6 relative">
        <span className="text-[11px] font-mono text-amber-400/80 uppercase tracking-widest block mb-2">
          Philosophical & Existential Dilemma
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
                    ? 'bg-amber-950/40 border-amber-500/80 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500 text-white'
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
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Select the choice aligning with your deepest values and philosophical reasoning</span>
        </div>

        <button
          onClick={() => handleNext(false)}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
            selectedOption !== null
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 cursor-pointer shadow-amber-500/20'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Finalize SQ Evaluation' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
