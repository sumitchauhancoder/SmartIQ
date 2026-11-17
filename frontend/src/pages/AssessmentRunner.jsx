import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Award, 
  Compass, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { startAssessment, submitAssessment } from '../api';

const CATEGORY_META = {
  IQ: {
    name: 'Cognitive Intelligence (IQ)',
    short: 'Cognitive IQ',
    tagline: 'Logic trees, spatial deduction & computational reasoning',
    icon: Brain,
    color: 'blue',
    badge: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
    border: 'border-blue-500/30 hover:border-blue-400/60',
    gradient: 'from-blue-600 to-indigo-600'
  },
  EQ: {
    name: 'Emotional Intelligence (EQ)',
    short: 'Emotional EQ',
    tagline: 'Affective empathy, self-regulation & social composure',
    icon: Award,
    color: 'rose',
    badge: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    border: 'border-rose-500/30 hover:border-rose-400/60',
    gradient: 'from-rose-600 to-pink-600'
  },
  SQ: {
    name: 'Spiritual Intelligence (SQ)',
    short: 'Stoic SQ',
    tagline: 'Stoic equanimity, purpose alignment & dichotomy of control',
    icon: Compass,
    color: 'amber',
    badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    gradient: 'from-amber-600 to-yellow-600'
  },
  AQ: {
    name: 'Adaptability Quotient (AQ)',
    short: 'Adaptability AQ',
    tagline: 'Crisis velocity, cognitive agility & deliberate unlearning',
    icon: Zap,
    color: 'emerald',
    badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    gradient: 'from-emerald-600 to-teal-600'
  }
};

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', hint: 'Does not reflect me at all', color: 'border-rose-500/40 text-rose-300 bg-rose-950/40 hover:bg-rose-900/50' },
  { value: 2, label: 'Disagree', hint: 'Rarely true for me', color: 'border-amber-500/30 text-amber-200 bg-amber-950/30 hover:bg-amber-900/40' },
  { value: 3, label: 'Neutral / Mixed', hint: 'Situational or uncertain', color: 'border-slate-700 text-slate-300 bg-slate-900/60 hover:bg-slate-800/80' },
  { value: 4, label: 'Agree', hint: 'Frequently true for me', color: 'border-teal-500/30 text-teal-200 bg-teal-950/30 hover:bg-teal-900/40' },
  { value: 5, label: 'Strongly Agree', hint: 'Directly reflects my daily behavior', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50' }
];

export default function AssessmentRunner({ 
  onComplete, 
  onNavigate, 
  onTabSwitch, 
  tabSwitchCount = 0 
}) {
  const { user, session } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [responses, setResponses] = useState([]); // [{ question_id, answer }]

  // 45s timer per question
  const [timeLeft, setTimeLeft] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timedOutNotice, setTimedOutNotice] = useState(false);

  // Tab switch anti-cheat detection
  const [tabSwitches, setTabSwitches] = useState(tabSwitchCount);
  const [showTabWarning, setShowTabWarning] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setShowTabWarning(true);
        if (onTabSwitch) onTabSwitch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [onTabSwitch]);

  // Load questions on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await startAssessment();
        if (isMounted) {
          if (Array.isArray(list) && list.length > 0) {
            setQuestions(list);
          } else {
            throw new Error('Unable to initialize question bank.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error loading assessment');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || isSubmitting || questions.length === 0) return;

    setTimeLeft(45);
    setTimedOutNotice(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, loading, isSubmitting, questions.length]);

  const handleTimeExpired = () => {
    setTimedOutNotice(true);
    setTimeout(() => {
      handleNext(null);
    }, 1200);
  };

  const handleNext = async (explicitAnswer = undefined) => {
    const answerToRecord = explicitAnswer !== undefined ? explicitAnswer : selectedAnswer;
    const currentQ = questions[currentIndex];

    const updatedResponses = [
      ...responses.filter(r => r.question_id !== currentQ.id),
      { question_id: currentQ.id, answer: answerToRecord }
    ];
    setResponses(updatedResponses);
    setSelectedAnswer(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all 40 questions -> Submit
      await submitAll(updatedResponses);
    }
  };

  const submitAll = async (finalResponses) => {
    setIsSubmitting(true);
    try {
      const result = await submitAssessment(
        finalResponses, 
        user?.id || null, 
        session?.access_token || null
      );

      // Persist in storage for instant hydration on results page
      sessionStorage.setItem('enigma_assessment_result', JSON.stringify(result));
      localStorage.setItem('enigma_assessment_result', JSON.stringify(result));

      if (onComplete) {
        onComplete(result);
      }
      if (onNavigate) {
        onNavigate('results');
      }
    } catch (err) {
      console.error('Submission failure:', err);
      // Fallback redirect
      if (onNavigate) onNavigate('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-rose-500 via-amber-500 to-emerald-500 p-[2px] animate-spin mb-6">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Assembling 4D Assessment Matrix</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Sampling 10 randomized items per dimension across IQ, EQ, SQ, and AQ from our verified 80-item psychometric bank...
        </p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] animate-pulse mb-6 shadow-2xl shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Brain className="w-9 h-9 text-indigo-400 animate-bounce" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Synthesizing 4D Cognitive Architecture</h3>
        <p className="text-sm text-slate-300 max-w-md mb-4 leading-relaxed">
          Evaluating your responses server-side across Cognitive Logic, Emotional Empathy, Stoic Principles, and Adaptability Velocity...
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Running Groq AI Inference & Normalized Gaussian Mapping...
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Assessment Bank Initialization Error</h3>
        <p className="text-xs text-slate-400 mb-6">{error || 'Could not load questions.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const meta = CATEGORY_META[currentQ.category] || CATEGORY_META.IQ;
  const CategoryIcon = meta.icon;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Banner: Anti-Cheat Alert */}
      {showTabWarning && tabSwitches > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/80 border border-amber-600/60 text-amber-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Fair Play Integrity Warning: </span>
              <span>Tab switches detected ({tabSwitches}). Maintain active window focus to preserve assessment validity.</span>
            </div>
          </div>
          <button 
            onClick={() => setShowTabWarning(false)}
            className="text-amber-400 hover:text-white font-bold ml-4 text-[11px]"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Assessment Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Category Badge */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${meta.badge} border flex items-center justify-center shadow-md`}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.badge}`}>
                  {meta.short}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                {meta.name}
              </h2>
            </div>
          </div>

          {/* 45s Countdown Timer */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              timeLeft <= 10 
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse' 
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400' : 'text-indigo-400'}`} />
              <span>{timeLeft}s remaining</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div 
            className={`h-full bg-gradient-to-r ${meta.gradient} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className={`glass-panel p-6 sm:p-8 rounded-3xl border ${meta.border} shadow-2xl relative overflow-hidden transition-all mb-6`}>
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Category Subtext */}
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {meta.tagline}
        </p>

        {/* Prompt Text */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white leading-relaxed mb-6">
          {currentQ.prompt_text}
        </h1>

        {/* Timeout Flash Notice */}
        {timedOutNotice && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <Clock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Time expired! Recording neutral benchmark and advancing...</span>
          </div>
        )}

        {/* Answer Options */}
        {currentQ.question_type === 'mcq' ? (
          /* MCQ: 4 Discrete Choice Cards (IQ Questions) */
          <div className="grid grid-cols-1 gap-3">
            {(currentQ.options || []).map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedAnswer === opt;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Likert: 5-Point Psychometric Agreement Scale (EQ, SQ, AQ Questions) */
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
              <span>Select the level that reflects your natural behavioral tendency:</span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">1 (Disagree) to 5 (Agree)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {LIKERT_OPTIONS.map((item) => {
                const isSelected = selectedAnswer === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setSelectedAnswer(item.value)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105'
                        : `${item.color} border`
                    }`}
                  >
                    <span className="text-base font-black font-mono mb-1">{item.value}</span>
                    <span className="text-xs font-bold leading-tight mb-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => handleNext(null)}
          className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors px-3 py-2"
        >
          Skip / Unsure (Neutral 3)
        </button>

        <button
          onClick={() => handleNext()}
          disabled={selectedAnswer === null}
          className={`flex items-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg ${
            selectedAnswer !== null
              ? `bg-gradient-to-r ${meta.gradient} text-white hover:opacity-95 shadow-indigo-500/20 cursor-pointer`
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'Submit Assessment' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
