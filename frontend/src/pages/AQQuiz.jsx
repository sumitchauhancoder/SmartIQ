import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  Cpu,
  BarChart3,
  Activity,
  ShieldCheck,
  TrendingUp,
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

export default function AQQuiz({ onComplete, onNavigate, onTabSwitch, tabSwitchCount = 0 }) {
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

  // Load 10 randomized AQ questions
  useEffect(() => {
    loadAQQuestions();
  }, []);

  const loadAQQuestions = async () => {
    setLoading(true);
    setCompletedData(null);
    setHasStarted(false);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    try {
      const data = await fetchQuestions('AQ', 10);
      if (data && data.length > 0) {
        setQuestions(data.slice(0, 10));
      } else {
        setQuestions(getFallbackQuestions('AQ', 10));
      }
    } catch (e) {
      setQuestions(getFallbackQuestions('AQ', 10));
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
      await finalizeAQEvaluation(updatedAnswers);
    }
  };

  const finalizeAQEvaluation = async (answers) => {
    setAnalyzing(true);

    let totalPoints = 0;
    const subTotals = {
      'Crisis Management & Resilience': { earned: 0, max: 0 },
      'AI & Tech Disruption': { earned: 0, max: 0 },
      'Unlearning & Agility': { earned: 0, max: 0 }
    };

    answers.forEach((ans) => {
      let sub = ans.sub_category || 'Crisis Management & Resilience';
      if (!['Crisis Management & Resilience', 'AI & Tech Disruption', 'Unlearning & Agility'].includes(sub)) {
        const lower = sub.toLowerCase();
        if (['crisis', 'resilience', 'fallback', 'interruption', 'prioritization', 'ambiguity', 'disruption'].some(k => lower.includes(k))) {
          sub = 'Crisis Management & Resilience';
        } else if (['ai', 'tech', 'environment', 'upskilling', 'cloud', 'novel'].some(k => lower.includes(k))) {
          sub = 'AI & Tech Disruption';
        } else {
          sub = 'Unlearning & Agility';
        }
      }
      subTotals[sub].earned += ans.points_earned;
      subTotals[sub].max += 4;
      totalPoints += ans.points_earned;
    });

    // Score scale: 85 baseline + scaled dynamic points -> 85 to 145
    const maxPossible = Math.max(1, answers.length * 4);
    const aqScore = Math.min(145, Math.round(85 + (totalPoints / maxPossible) * 55));

    const aqBreakdown = {};
    Object.keys(subTotals).forEach((cat) => {
      const item = subTotals[cat];
      const ratio = item.max > 0 ? item.earned / item.max : 0.6;
      aqBreakdown[cat] = Math.round(ratio * 100);
    });

    const sessionId = getSessionId();

    const submissionPayload = {
      session_id: sessionId,
      user_id: user?.id || null,
      test_type: 'AQ',
      aq_score: aqScore,
      aq_breakdown: aqBreakdown,
      incorrect_questions: answers.filter((a) => a.points_earned < 3),
      tab_switch_count: tabSwitchCount
    };

    // Synthesize analysis via Backend / Local Fallback
    const aiAnalysis = await submitAnalysis(submissionPayload, token);

    const resultRecord = {
      aq_score: aqScore,
      aq_breakdown: aqBreakdown,
      aq_answers: answers,
      ai_analysis: aiAnalysis,
      timestamp: new Date().toISOString()
    };

    // Save to persistent storage (Enigma & legacy SmartIQ compatibility)
    localStorage.setItem('enigma_aq_data', JSON.stringify(resultRecord));
    localStorage.setItem('smartiq_aq_data', JSON.stringify(resultRecord));
    sessionStorage.setItem('enigma_aq_data', JSON.stringify(resultRecord));
    sessionStorage.setItem('smartiq_aq_data', JSON.stringify(resultRecord));

    setCompletedData(resultRecord);
    setAnalyzing(false);

    if (onComplete) {
      onComplete(resultRecord);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium text-sm">Compiling Crisis Agility & Pivot Items...</p>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Zap className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analyzing Adaptability Quotient (AQ)</h3>
        <p className="text-slate-400 text-sm max-w-sm">Measuring crisis agility, unlearning velocity, and AI paradigm integration...</p>
      </div>
    );
  }

  // =========================================================================
  // Pre-Test Briefing / Start Gate Screen
  // =========================================================================
  if (!hasStarted && !completedData) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Module Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Module 04 • Adaptability Quotient</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-800/60 text-emerald-300">
              Impact Rating: 10 / 10 (Peak Impact)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Adaptability Quotient (AQ) Test
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Measure how easily you adapt to changes, solve unexpected problems, and learn new skills.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
              📝 10 Questions
            </span>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
              ⏱️ 45s / Question
            </span>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200">
              ⚡ Flexibility & Growth
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8 flex items-center gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>10 fast-paced scenarios. Pick how you instinctively respond when plans change.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Assessment Hub
            </button>

            <button
              onClick={handleStartTest}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 shadow-xl shadow-emerald-600/30 transform hover:-translate-y-0.5 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start AQ Assessment (10 Questions)</span>
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
    const { aq_score, aq_breakdown, ai_analysis } = completedData;
    const percentile = Math.min(99, Math.round(50 + ((aq_score - 100) / 15) * 34));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adaptability Quotient Module Completed (10/10 Questions)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                AQ Score: <span className="text-emerald-400 font-mono">{aq_score}</span>
              </h1>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                {ai_analysis?.core_summary || 'You demonstrate top-tier agility, thriving in disruptive ambiguity with rapid unlearning speed and high pivot velocity.'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-emerald-500/30 min-w-[130px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
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
              <span className="text-emerald-400 font-bold block mb-1">Impact Rating</span>
              <span className="text-lg font-bold text-white">10 / 10 (Peak)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Learn when faced with new situations</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Core Areas</span>
              <p className="font-semibold text-slate-200">Leadership • AI • Politics • Crisis Management</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">How to Train</span>
              <p className="text-slate-300">Ask 'What if...?' • Try new things (languages, tech, foods).</p>
            </div>
          </div>
        </div>

        {/* Sub-Dimension Breakdown Bars */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Adaptability & Agility Sub-Dimensions</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(aq_breakdown || {}).map(([category, score]) => (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{category}</span>
                  <span className="text-emerald-400 font-bold font-mono">{score}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
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
              onClick={loadAQQuestions}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake AQ Test</span>
            </button>
            <button
              onClick={() => onNavigate('gym', 'AQ')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/40 text-emerald-300 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Train AQ in Gym</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('results', 'AQ')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/40 transition-all"
            >
              <span>View AQ Analysis</span>
            </button>
            <button
              onClick={() => onNavigate('results', 'ALL')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-600/20 transition-all"
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
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Adaptability Quotient (AQ)
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
            questionKey={`aq-${currentIndex}`}
            onTimeUp={() => handleNext(true)}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-6 relative">
        <span className="text-[11px] font-mono text-emerald-400/80 uppercase tracking-widest block mb-2">
          Disruption Scenario & Agility Test
        </span>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.question_text}
        </h2>

        {/* Optional Question Image / Scenario Diagram */}
        {(currentQ.image_url || currentQ.diagram_svg) && (
          <div className="my-4 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-center items-center overflow-hidden max-h-56 sm:max-h-64 [&_svg]:max-h-48 [&_svg]:w-auto [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto [&_img]:max-h-48 [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain">
            {currentQ.image_url ? (
              typeof currentQ.image_url === 'string' && currentQ.image_url.trim().startsWith('<svg') ? (
                <div dangerouslySetInnerHTML={{ __html: currentQ.image_url }} />
              ) : (
                <img
                  src={currentQ.image_url}
                  alt="Scenario Diagram"
                  className="rounded-xl shadow-md"
                />
              )
            ) : (
              <div dangerouslySetInnerHTML={{ __html: currentQ.diagram_svg }} />
            )}
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const optText = typeof opt === 'object' && opt !== null ? opt.text : opt;
            const optImg = typeof opt === 'object' && opt !== null ? opt.image_url : (currentQ.option_images ? currentQ.option_images[idx] : null);

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-slate-700 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed">{optText}</span>
                </div>
                {optImg && (
                  <div className="sm:ml-4 flex-shrink-0 self-center">
                    {typeof optImg === 'string' && optImg.trim().startsWith('<svg') ? (
                      <div className="max-h-20 max-w-28 overflow-hidden rounded-lg bg-slate-950 p-1 border border-slate-800" dangerouslySetInnerHTML={{ __html: optImg }} />
                    ) : (
                      <img src={optImg} alt={`Option ${idx + 1}`} className="h-16 w-auto max-w-[120px] object-contain rounded-lg border border-slate-700/60 bg-slate-950" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Select the response showing your instinctive pivot response to unexpected disruption</span>
        </div>

        <button
          onClick={() => handleNext(false)}
          disabled={selectedOption === null}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
            selectedOption !== null
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 cursor-pointer shadow-emerald-500/20'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Finalize AQ Evaluation' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
