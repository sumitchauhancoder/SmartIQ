import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, 
  Award, 
  Compass, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Sun, 
  Heart, 
  BarChart3, 
  Dumbbell, 
  BookOpen, 
  HelpCircle, 
  XCircle 
} from 'lucide-react';
import PerformanceChart from '../components/PerformanceChart';
import ScoreSpectrumRuler from '../components/ScoreSpectrumRuler';

// Helper to normalize any raw score or legacy Wechsler score (70-145) to 0-100%
export const normalizeToPercent = (s) => {
  if (s === null || s === undefined) return null;
  const num = Number(s);
  if (isNaN(num)) return null;
  if (num <= 100) return Math.max(0, Math.min(100, Math.round(num)));
  // Legacy Wechsler (70-145) to 0-100%
  return Math.max(0, Math.min(100, Math.round(((num - 85) / 60) * 100)));
};

// Standardized 4-Tier Evaluation Engine (0-39% Developing, 40-64% Balanced, 65-84% Proficient, 85-100% Exceptional)
function calculatePsychometrics(score) {
  const numScore = normalizeToPercent(score) ?? 50;

  let tier = '';
  let classification = '';
  let badgeColor = '';
  let honestDiagnostic = '';

  if (numScore >= 85) {
    tier = 'Exceptional';
    classification = 'Exceptional Tier (85–100%)';
    badgeColor = 'border-emerald-500/50 text-emerald-300 bg-emerald-950/60';
    honestDiagnostic = 'Outstanding performance. You demonstrate exceptional precision, abstract processing, and fluid execution well above the balanced baseline.';
  } else if (numScore >= 65) {
    tier = 'Proficient';
    classification = 'Proficient Tier (65–84%)';
    badgeColor = 'border-blue-500/50 text-blue-300 bg-blue-950/60';
    honestDiagnostic = 'Strong, dependable capability. You solve multi-step problems with clarity and adapt comfortably to complex demands.';
  } else if (numScore >= 40) {
    tier = 'Balanced';
    classification = 'Balanced Tier (40–64%)';
    badgeColor = 'border-amber-500/50 text-amber-300 bg-amber-950/60';
    honestDiagnostic = 'Solid everyday baseline. You handle standard situations reliably. Targeted practice in the Cognitive Gym will elevate you into proficiency.';
  } else {
    tier = 'Developing';
    classification = 'Developing Tier (0–39%)';
    badgeColor = 'border-rose-500/50 text-rose-300 bg-rose-950/60';
    honestDiagnostic = 'Foundational development area. Focus on structured routines and daily drills in the Cognitive Gym to build speed and confidence.';
  }

  const percentile = Math.min(99, Math.max(1, Math.round(numScore)));

  return {
    score: numScore,
    tier,
    percentile,
    classification,
    badgeColor,
    honestDiagnostic,
    benchmark: 60
  };
}

// Helper to normalize any sub-category to the 12 canonical items
const normalizeSub = (type, sub) => {
  if (!sub) return '';
  const cat = (type || '').toUpperCase();
  const lower = sub.toLowerCase();
  if (cat === 'IQ') {
    if (lower.includes('spatial') || lower.includes('dice') || lower.includes('geometry') || lower.includes('symmetry')) return 'Spatial';
    if (lower.includes('math') || lower.includes('arithmetic') || lower.includes('number')) return 'Math';
    return 'Logic';
  }
  if (cat === 'EQ') {
    if (['empathy', 'listening', 'peer', 'social', 'team', 'conflict', 'inclusion'].some(k => lower.includes(k))) return 'Empathy';
    if (['regulation', 'feedback', 'criticism', 'dialogue', 'resilience'].some(k => lower.includes(k))) return 'Self-Regulation';
    return 'Self-Awareness';
  }
  if (cat === 'SQ') {
    if (['stoic', 'control', 'equanimity', 'impermanence', 'obstacle', 'perspective'].some(k => lower.includes(k))) return 'Philosophy & Stoicism';
    if (['purpose', 'solitude', 'gratitude', 'intention'].some(k => lower.includes(k))) return 'Purpose & Meaning';
    return 'Core Values & Wholeness';
  }
  if (cat === 'AQ') {
    if (['crisis', 'fallback', 'resilience', 'interruption', 'ambiguity', 'disruption'].some(k => lower.includes(k))) return 'Crisis Management & Resilience';
    if (['ai', 'tech', 'environment', 'novel', 'cloud'].some(k => lower.includes(k))) return 'AI & Tech Disruption';
    return 'Unlearning & Agility';
  }
  return sub;
};

// Holistic 4D Intelligence Synthesizer across all completed assessments (0-100% Scale + Top-2 Archetype Matrix)
function synthesizeUnified4DProfile(rawIq, rawEq, rawSq, rawAq) {
  const iq = normalizeToPercent(rawIq);
  const eq = normalizeToPercent(rawEq);
  const sq = normalizeToPercent(rawSq);
  const aq = normalizeToPercent(rawAq);

  const scores = [];
  if (iq !== null) scores.push({ key: 'IQ', name: 'Cognitive IQ', val: iq });
  if (eq !== null) scores.push({ key: 'EQ', name: 'Emotional EQ', val: eq });
  if (sq !== null) scores.push({ key: 'SQ', name: 'Spiritual SQ', val: sq });
  if (aq !== null) scores.push({ key: 'AQ', name: 'Adaptability AQ', val: aq });

  if (scores.length === 0) {
    return {
      archetype: 'The Multidimensional Strategist',
      summary: 'Complete test modules to unlock your personalized 4D intelligence synthesis.',
      edge: 'Balanced potential across logic, emotional resonance, stoic grounding, and adaptability.',
      emotionalProfile: 'Calm composure, adaptive empathy, and fluid execution.',
      growthHabits: [],
      compositeAvg: 50,
      tierName: 'Balanced',
      balanceType: 'Well-Rounded Generalist',
      spread: 0,
      topStrength: 'IQ',
      growthArea: 'AQ'
    };
  }

  const compositeAvg = Math.round(scores.reduce((a, b) => a + b.val, 0) / scores.length);
  const scoreBreakdownText = scores.map(s => `${s.name}: ${s.val}%`).join(' • ');

  const vals = scores.map(s => s.val);
  const spread = Math.max(...vals) - Math.min(...vals);
  const balanceType = spread <= 20 ? 'Well-Rounded Generalist' : 'Spiky Specialist';
  const sorted = [...scores].sort((a, b) => b.val - a.val);
  const topStrength = sorted[0].key;
  const growthArea = sorted[sorted.length - 1].key;

  // Top-2 Archetype Matrix
  let archetype = 'The Holistic Integrator';
  if (scores.length >= 2) {
    const pair = [sorted[0].key, sorted[1].key].sort().join('+');
    const archetypeMatrix = {
      'AQ+IQ': 'The Resilient Strategist',
      'EQ+IQ': 'The Empathetic Analyst',
      'IQ+SQ': 'The Tactical Communicator',
      'EQ+SQ': 'The People Catalyst',
      'AQ+EQ': 'The Grounded Anchor',
      'AQ+SQ': 'The Crisis Leader'
    };
    if (spread <= 12) {
      archetype = 'The Holistic Integrator';
    } else {
      archetype = archetypeMatrix[pair] || 'The Holistic Integrator';
    }
  }

  const tierName = compositeAvg >= 85 ? 'Exceptional' : compositeAvg >= 65 ? 'Proficient' : compositeAvg >= 40 ? 'Balanced' : 'Developing';

  const summary = `Holding an overall composite score of ${compositeAvg}% (${tierName}) across your completed assessments (${scoreBreakdownText}), your cognitive architecture exhibits a ${balanceType.toLowerCase()} profile with a ${spread}% score spread. Your leading dimension is ${topStrength} (${scores.find(s=>s.key===topStrength)?.val}%), while targeted development in ${growthArea} (${scores.find(s=>s.key===growthArea)?.val}%) provides the highest leverage for expansion.`;

  const edge = `Dominant Strength: ${topStrength} (${scores.find(s=>s.key===topStrength)?.val}%) • Dynamic Balance: ${balanceType} (Spread: ${spread}%)`;
  const emotionalProfile = `Primary Growth Catalyst: ${growthArea} (${scores.find(s=>s.key===growthArea)?.val}%) • Overall Performance Tier: ${tierName}`;

  const growthHabits = [
    {
      habit: "Combinatorial Puzzle & Speed Drills (IQ)",
      frequency: "Weekly (15-20 mins)",
      action: "Spend 10 minutes solving math puzzles, playing chess, or trying speed drills in the Cognitive Gym."
    },
    {
      habit: "10-Minute Reflective Emotional Journal (EQ)",
      frequency: "Nightly",
      action: "Note moments during the day where you felt calm or stressed, and practice listening actively to others."
    },
    {
      habit: "Stoic Control Audit & Amor Fati (SQ)",
      frequency: "Daily (Morning)",
      action: "Focus your energy strictly on choices within your control, letting go of outcomes dictated by external factors."
    },
    {
      habit: "The 'What If...?' Agility Simulation (AQ)",
      frequency: "Daily (10 mins)",
      action: "Challenge a fixed daily habit by asking: 'If this tool or constraint changed tomorrow, how would I pivot?'"
    }
  ];

  return { archetype, summary, edge, emotionalProfile, growthHabits, compositeAvg, tierName, balanceType, spread, topStrength, growthArea };
}

export default function Results({ 
  resultsData, 
  iqData: propIQ, 
  eqData: propEQ, 
  sqData: propSQ, 
  aqData: propAQ, 
  onNavigate,
  initialTab = 'ALL'
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'ALL'); // 'ALL', 'IQ', 'EQ', 'SQ', 'AQ'
  const [showMistakes, setShowMistakes] = useState(false);

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Hydrate from props or localStorage
  const iq = propIQ || (function() {
    try { return JSON.parse(localStorage.getItem('enigma_iq_data') || localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('enigma_iq_data') || sessionStorage.getItem('smartiq_iq_data') || 'null'); } catch(e) { return null; }
  })();
  const eq = propEQ || (function() {
    try { return JSON.parse(localStorage.getItem('enigma_eq_data') || localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('enigma_eq_data') || sessionStorage.getItem('smartiq_eq_data') || 'null'); } catch(e) { return null; }
  })();
  const sq = propSQ || (function() {
    try { return JSON.parse(localStorage.getItem('enigma_sq_data') || localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('enigma_sq_data') || sessionStorage.getItem('smartiq_sq_data') || 'null'); } catch(e) { return null; }
  })();
  const aq = propAQ || (function() {
    try { return JSON.parse(localStorage.getItem('enigma_aq_data') || localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('enigma_aq_data') || sessionStorage.getItem('smartiq_aq_data') || 'null'); } catch(e) { return null; }
  })();

  const assessmentResult = (function() {
    try {
      if (resultsData?.rawScores || resultsData?.compositeScore) return resultsData;
      const saved = sessionStorage.getItem('enigma_assessment_result') || localStorage.getItem('enigma_assessment_result');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const completedCount = assessmentResult ? 4 : [iq, eq, sq, aq].filter(Boolean).length;

  // Trigger celebration confetti on mount if any test completed
  useEffect(() => {
    if (completedCount > 0 || assessmentResult) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f43f5e', '#f59e0b', '#10b981']
        });
      } catch (e) {}
    }
  }, [completedCount, assessmentResult]);

  // Aggregate scores (with assessmentResult priority & normalized to 0-100%)
  const rawIq = assessmentResult?.rawScores?.IQ !== undefined ? assessmentResult.rawScores.IQ : (iq?.iq_score ?? null);
  const rawEq = assessmentResult?.rawScores?.EQ !== undefined ? assessmentResult.rawScores.EQ : (eq?.eq_score ?? null);
  const rawSq = assessmentResult?.rawScores?.SQ !== undefined ? assessmentResult.rawScores.SQ : (sq?.sq_score ?? null);
  const rawAq = assessmentResult?.rawScores?.AQ !== undefined ? assessmentResult.rawScores.AQ : (aq?.aq_score ?? null);

  const iqScore = normalizeToPercent(rawIq);
  const eqScore = normalizeToPercent(rawEq);
  const sqScore = normalizeToPercent(rawSq);
  const aqScore = normalizeToPercent(rawAq);

  const iqBreakdown = iq?.iq_breakdown || (assessmentResult ? { Logic: iqScore, Math: iqScore, Spatial: iqScore } : {});
  const eqBreakdown = eq?.eq_breakdown || (assessmentResult ? { 'Self-Awareness': eqScore, 'Self-Regulation': eqScore, Empathy: eqScore } : {});
  const sqBreakdown = sq?.sq_breakdown || (assessmentResult ? { 'Philosophy & Stoicism': sqScore, 'Purpose & Meaning': sqScore, 'Core Values & Wholeness': sqScore } : {});
  const aqBreakdown = aq?.aq_breakdown || (assessmentResult ? { 'Crisis Management & Resilience': aqScore, 'AI & Tech Disruption': aqScore, 'Unlearning & Agility': aqScore } : {});

  // Unified 4D Archetype Synthesis:
  const combinedSynthesis = synthesizeUnified4DProfile(iqScore, eqScore, sqScore, aqScore);
  let archetype = combinedSynthesis.archetype;
  let summary = combinedSynthesis.summary;
  let edge = combinedSynthesis.edge;
  let emotionalProfile = combinedSynthesis.emotionalProfile;
  let growthHabits = combinedSynthesis.growthHabits;

  // Display metrics unified across single assessment battery and individual quizzes
  const displayComposite = assessmentResult?.compositeScore ?? combinedSynthesis.compositeAvg;
  const displayTier = assessmentResult?.tier ?? combinedSynthesis.tierName;
  const displayBalanceType = assessmentResult?.balanceType ?? combinedSynthesis.balanceType;
  const displaySpread = assessmentResult?.spread ?? combinedSynthesis.spread;
  const displayTopStrength = assessmentResult?.topStrength ?? combinedSynthesis.topStrength;
  const displayGrowthArea = assessmentResult?.growthArea ?? combinedSynthesis.growthArea;
  const displayTopVal = assessmentResult?.rawScores?.[displayTopStrength] ?? (displayTopStrength === 'IQ' ? iqScore : displayTopStrength === 'EQ' ? eqScore : displayTopStrength === 'SQ' ? sqScore : aqScore) ?? 0;
  const displayGrowthVal = assessmentResult?.rawScores?.[displayGrowthArea] ?? (displayGrowthArea === 'IQ' ? iqScore : displayGrowthArea === 'EQ' ? eqScore : displayGrowthArea === 'SQ' ? sqScore : aqScore) ?? 0;

  if (assessmentResult && assessmentResult.aiAnalysis) {
    const ai = assessmentResult.aiAnalysis;
    archetype = ai.archetypeTitle || combinedSynthesis.archetype;
    summary = ai.overallSummary || combinedSynthesis.summary;
    edge = `Dominant Strength: ${displayTopStrength} (${displayTopVal}%) • Balance: ${displayBalanceType}`;
    emotionalProfile = `Primary Growth Catalyst: ${displayGrowthArea} (${displayGrowthVal}%) • Tier: ${displayTier}`;
    if (Array.isArray(ai.actionableAdvice) && ai.actionableAdvice.length > 0) {
      growthHabits = ai.actionableAdvice.map((adv, idx) => ({
        habit: `Strategic Recommendation ${idx + 1} (${displayGrowthArea})`,
        frequency: 'High-Leverage Habit',
        action: adv
      }));
    }
  } else if (resultsData?.test_type === 'COMBINED' && resultsData?.ai_analysis) {
    const ai = resultsData.ai_analysis;
    archetype = ai.archetype_title || combinedSynthesis.archetype;
    summary = ai.core_summary || combinedSynthesis.summary;
    edge = ai.cognitive_edge || combinedSynthesis.edge;
    emotionalProfile = ai.emotional_profile || combinedSynthesis.emotionalProfile;
    growthHabits = ai.growth_habits || combinedSynthesis.growthHabits;
  } else if (completedCount === 1) {
    const singleSource = aq?.ai_analysis || sq?.ai_analysis || eq?.ai_analysis || iq?.ai_analysis;
    if (singleSource) {
      archetype = singleSource.archetype_title || combinedSynthesis.archetype;
      summary = singleSource.core_summary || combinedSynthesis.summary;
      edge = singleSource.cognitive_edge || combinedSynthesis.edge;
      emotionalProfile = singleSource.emotional_profile || combinedSynthesis.emotionalProfile;
      growthHabits = singleSource.growth_habits || combinedSynthesis.growthHabits;
    }
  }


  // Fallback default habits if empty
  if (growthHabits.length === 0) {
    growthHabits = [
      {
        habit: "The 'What If...?' Simulation (AQ)",
        frequency: "Daily (10 mins)",
        action: "Think of a daily routine and ask: 'If this changed suddenly tomorrow, how would I adapt?'"
      },
      {
        habit: "Stoic Premeditation & Dichotomy of Control (SQ)",
        frequency: "Daily (Morning)",
        action: "Each morning, focus your energy only on your choices and actions, letting go of things outside your control."
      },
      {
        habit: "10-Minute Reflective Emotional Journal (EQ)",
        frequency: "Nightly",
        action: "Note moments during the day where you felt calm or stressed, and practice listening actively to others."
      },
      {
        habit: "Combinatorial Puzzle & Working Memory Training (IQ)",
        frequency: "Weekly (15-20 mins)",
        action: "Spend 10 minutes solving math puzzles, playing chess, or trying speed drills in the Cognitive Gym."
      }
    ];
  }

  if (completedCount === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-rose-500 via-amber-500 to-emerald-500 p-[2px] mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Active Intelligence Records</h3>
        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
          Complete any of the 4 independent 10-question assessments (IQ, EQ, SQ, or AQ) to view separate in-depth analyses or your unified 4D matrix.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('iq')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all"
          >
            Start IQ Test
          </button>
          <button
            onClick={() => onNavigate('eq')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all"
          >
            Start EQ Test
          </button>
          <button
            onClick={() => onNavigate('sq')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-lg transition-all"
          >
            Start SQ Test
          </button>
          <button
            onClick={() => onNavigate('aq')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
          >
            Start AQ Test
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Render Individual Test Analysis Page
  // =========================================================================
  const renderIndividualAnalysis = (type) => {
    let testData = null;
    let title = '';
    let icon = null;
    let themeColor = '';
    let impactText = '';
    let domains = '';
    let retakeRoute = '';

    if (type === 'IQ') {
      testData = iq;
      title = 'Cognitive Intelligence (IQ)';
      icon = <Brain className="w-6 h-6 text-blue-400" />;
      themeColor = 'blue';
      impactText = '9 / 10 Impact • Science, Math, Engineering & Programming';
      domains = 'Logic • Math • Spatial Mechanics';
      retakeRoute = 'iq';
    } else if (type === 'EQ') {
      testData = eq;
      title = 'Emotional Quotient (EQ)';
      icon = <Award className="w-6 h-6 text-rose-400" />;
      themeColor = 'rose';
      impactText = '9.3 / 10 Impact • Psychology, Relationships & Family';
      domains = 'Self-Awareness • Self-Regulation • Active Empathy';
      retakeRoute = 'eq';
    } else if (type === 'SQ') {
      testData = sq;
      title = 'Spiritual Quotient (SQ)';
      icon = <Compass className="w-6 h-6 text-amber-400" />;
      themeColor = 'amber';
      impactText = '8 / 10 Impact • Literature, Philosophy & Stoicism';
      domains = 'Stoic Equanimity • Existential Purpose • Core Values';
      retakeRoute = 'sq';
    } else if (type === 'AQ') {
      testData = aq;
      title = 'Adaptability Quotient (AQ)';
      icon = <Zap className="w-6 h-6 text-emerald-400" />;
      themeColor = 'emerald';
      impactText = '10 / 10 Peak Impact • Leadership, AI Disruption & Crisis Management';
      domains = 'Crisis Velocity • AI Assimilation • Cognitive Unlearning';
      retakeRoute = 'aq';
    }

    if (!testData && assessmentResult?.rawScores?.[type] !== undefined) {
      testData = {
        [`${type.toLowerCase()}_score`]: assessmentResult.rawScores[type],
        [`${type.toLowerCase()}_breakdown`]: {
          [type === 'IQ' ? 'Logic' : type === 'EQ' ? 'Self-Awareness' : type === 'SQ' ? 'Philosophy & Stoicism' : 'Crisis Management & Resilience']: assessmentResult.rawScores[type]
        },
        ai_analysis: {
          archetype_title: assessmentResult.aiAnalysis?.archetypeTitle,
          core_summary: assessmentResult.aiAnalysis?.categoryInsights?.[type] || assessmentResult.aiAnalysis?.overallSummary,
          cognitive_edge: assessmentResult.aiAnalysis?.categoryInsights?.[type],
          emotional_profile: `Profile evaluation for ${type} placed in tier: ${assessmentResult.tier}`,
          growth_habits: (assessmentResult.aiAnalysis?.actionableAdvice || []).map(adv => ({
            habit: `${type} High-Leverage Protocol`,
            frequency: 'Daily Practice',
            action: adv
          }))
        }
      };
    }

    if (!testData) {

      return (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title} Not Yet Taken</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            You haven't completed the 10-question {title} assessment. Complete it to unlock your score, sub-dimension metrics, and tailored growth roadmap.
          </p>
          <button
            onClick={() => onNavigate(retakeRoute)}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-2"
          >
            <span>Start {type} Assessment (10 Questions)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    const rawScore = testData[`${type.toLowerCase()}_score`];
    const score = normalizeToPercent(rawScore) ?? 50;
    const rawBreakdown = testData[`${type.toLowerCase()}_breakdown`] || {};
    const CANONICAL_SUBS = {
      IQ: ['Logic', 'Math', 'Spatial'],
      EQ: ['Self-Awareness', 'Self-Regulation', 'Empathy'],
      SQ: ['Philosophy & Stoicism', 'Purpose & Meaning', 'Core Values & Wholeness'],
      AQ: ['Crisis Management & Resilience', 'AI & Tech Disruption', 'Unlearning & Agility']
    };
    const canonicalSubs = CANONICAL_SUBS[type] || ['Logic', 'Math', 'Spatial'];
    const breakdown = {};
    canonicalSubs.forEach((subKey) => {
      if (rawBreakdown[subKey] !== undefined) {
        breakdown[subKey] = normalizeToPercent(rawBreakdown[subKey]) ?? score;
      } else {
        const matching = Object.entries(rawBreakdown).filter(([k]) => {
          const lk = k.toLowerCase();
          const ls = subKey.toLowerCase();
          if (ls === 'spatial') return lk.includes('spatial') || lk.includes('dice') || lk.includes('geometry') || lk.includes('symmetry');
          if (ls === 'math') return lk.includes('math') || lk.includes('arithmetic') || lk.includes('number');
          if (ls === 'logic') return lk.includes('logic') || lk.includes('analogy') || lk.includes('relation') || lk.includes('pattern');
          if (ls === 'empathy') return ['empathy', 'listening', 'peer', 'social', 'team', 'conflict'].some(w => lk.includes(w));
          if (ls === 'self-regulation') return ['regulation', 'feedback', 'criticism', 'dialogue', 'resilience'].some(w => lk.includes(w));
          if (ls === 'self-awareness') return ['awareness', 'accountability', 'humility', 'integrity'].some(w => lk.includes(w));
          if (ls.includes('stoic')) return ['stoic', 'control', 'equanimity', 'impermanence', 'obstacle', 'perspective'].some(w => lk.includes(w));
          if (ls.includes('purpose')) return ['purpose', 'solitude', 'gratitude', 'intention'].some(w => lk.includes(w));
          if (ls.includes('values')) return ['values', 'wholeness', 'worth', 'generosity', 'forgiveness'].some(w => lk.includes(w));
          if (ls.includes('crisis')) return ['crisis', 'fallback', 'resilience', 'interruption', 'ambiguity'].some(w => lk.includes(w));
          if (ls.includes('ai')) return ['ai', 'tech', 'environment', 'novel', 'cloud'].some(w => lk.includes(w));
          if (ls.includes('unlearning')) return ['unlearning', 'agility', 'pivot', 'learning', 'habits'].some(w => lk.includes(w));
          return lk.includes(ls);
        });
        if (matching.length > 0) {
          const avg = Math.round(matching.reduce((acc, [, v]) => acc + (normalizeToPercent(v) ?? score), 0) / matching.length);
          breakdown[subKey] = avg;
        } else {
          breakdown[subKey] = score;
        }
      }
    });
    const ai = testData.ai_analysis || {};
    const answers = testData[`${type.toLowerCase()}_answers`] || [];
    const incorrect = testData.incorrect_questions || [];
    const metrics = calculatePsychometrics(score);
    const percentile = metrics.percentile;

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Pillar Header Card */}
        <div className={`glass-panel p-6 sm:p-8 rounded-3xl border border-${themeColor}-500/30 relative overflow-hidden shadow-2xl`}>
          <div className={`absolute top-0 right-0 w-80 h-80 bg-${themeColor}-500/10 rounded-full blur-3xl pointer-events-none`}></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold mb-3">
                {icon}
                <span className="text-slate-200">{title} • 10 Questions Evaluated</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Score: <span className="font-mono text-indigo-400">{score}%</span>
                </h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${metrics.badgeColor}`}>
                  {metrics.classification}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Evaluation Tier: <strong className="text-white">{metrics.tier}</strong></span>
                <span>•</span>
                <span>Balanced Baseline: <strong>60%</strong></span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                {ai.core_summary || `Evaluates your psychometric performance across ${domains}.`}
              </p>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {impactText}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card border border-slate-800 min-w-[145px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Performance Tier
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {metrics.tier}
              </span>
              <span className="text-[11px] text-slate-300 mt-1 font-semibold">
                {score}% Mastery
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Baseline: 60%
              </span>
            </div>
          </div>

          {/* Archetype & Demeanor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Specialized Archetype
              </span>
              <p className="text-sm font-bold text-white mb-1">
                {ai.archetype_title || `${title} Specialist`}
              </p>
              <p className="text-xs text-slate-300">
                {ai.cognitive_edge || 'High analytical focus and consistent strategic alignment.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Your Natural Style
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                {ai.emotional_profile || 'Exhibits grounded clarity, calm execution under time constraints, and strong pattern mastery.'}
              </p>
            </div>
          </div>

          {/* Objective Psychometric Review Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shrink-0 mt-0.5">
              <Brain className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">Clear & Honest Review</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Scientific Benchmark</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {metrics.honestDiagnostic}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Score Spectrum Ruler (Where You Stand Compared to the World) */}
        <ScoreSpectrumRuler score={score} title={title} />

        {/* Sub-Dimension Breakdown Progress Bars */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Sub-Dimension Mastery (% Accuracy / Weighted Points)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(breakdown).map(([category, val]) => (
              <div key={category} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-bold">{category}</span>
                  <span className="font-mono font-bold text-indigo-400">{val}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-700"
                    style={{ width: `${val}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {val >= 80 ? 'Mastery tier: exceptional precision' : val >= 60 ? 'Competent tier: solid baseline' : 'Growth opportunity'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Question Review & Explanations (if available) */}
        {answers.length > 0 && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>10-Question Item Breakdown</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review your answers and see helpful explanations
                </p>
              </div>
              <button
                onClick={() => setShowMistakes(!showMistakes)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showMistakes ? 'Collapse Review' : 'Expand All 10 Questions'}
              </button>
            </div>

            {showMistakes && (
              <div className="space-y-3 mt-4">
                {answers.map((ans, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border text-xs ${
                      ans.is_correct || ans.points_earned >= 3
                        ? 'bg-slate-900/40 border-slate-800'
                        : 'bg-rose-950/20 border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-300">Question {idx + 1} • {normalizeSub(type, ans.sub_category)}</span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ans.is_correct || ans.points_earned >= 3
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                      }`}>
                        {ans.is_correct || ans.points_earned >= 3 ? 'Optimal Answer' : 'Growth Area'}
                      </span>
                    </div>
                    <p className="text-white font-medium mb-2">{ans.question_text}</p>
                    <div className="space-y-1 text-slate-400">
                      <p><strong className="text-slate-300">Your Answer:</strong> {ans.user_option}</p>
                      {ans.correct_option && ans.correct_option !== ans.user_option && (
                        <p><strong className="text-emerald-400">Optimal:</strong> {ans.correct_option}</p>
                      )}
                      {ans.explanation && (
                        <p className="text-slate-400 mt-1 italic">💡 {ans.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(retakeRoute)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake {type} Assessment</span>
            </button>
            <button
              onClick={() => onNavigate('gym', type)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-950/60 border border-indigo-700/60 hover:bg-indigo-900/40 text-indigo-300 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-indigo-400" />
              <span>Train {type} in Cognitive Gym</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('ALL')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <span>View Unified 4D Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Tab Switcher: Separate Test Analysis vs All Together */}
      <div className="flex items-center justify-center mb-8">
        <div className="glass-panel p-1.5 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-1.5 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Unified 4D Matrix (All Together)</span>
          </button>

          <button
            onClick={() => setActiveTab('IQ')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'IQ'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-blue-300 hover:bg-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span>IQ Cognitive {iqScore !== null ? `(${iqScore}%)` : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('EQ')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'EQ'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-rose-400" />
            <span>EQ Emotional {eqScore !== null ? `(${eqScore}%)` : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('SQ')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SQ'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>SQ Spiritual {sqScore !== null ? `(${sqScore}%)` : ''}</span>
          </button>

          <button
            onClick={() => setActiveTab('AQ')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AQ'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AQ Adaptability {aqScore !== null ? `(${aqScore}%)` : ''}</span>
          </button>
        </div>
      </div>

      {/* Render Individual Tab If Selected */}
      {activeTab !== 'ALL' ? (
        renderIndividualAnalysis(activeTab)
      ) : (
        /* =========================================================================
           Unified 4D Intelligence Matrix (All Together)
           ========================================================================= */
        <div>
          {/* Top Banner / Archetype Card */}
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden mb-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-rose-500/10 via-amber-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-indigo-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{assessmentResult ? '80-Item Psychometric Matrix Engine' : 'Unified 4D Intelligence Synthesis'}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-xs font-bold font-mono">
                    Composite: {displayComposite}% • {displayTier}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-700/60 text-xs font-bold">
                    {displayBalanceType} (Spread: {displaySpread}%)
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                  {archetype}
                </h1>
                <div className="flex flex-wrap items-center gap-3 my-3 text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Dominant Strength: <strong>{displayTopStrength} ({displayTopVal}%)</strong></span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-300 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Primary Growth Area: <strong>{displayGrowthArea} ({displayGrowthVal}%)</strong></span>
                  </span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {summary}
                </p>
              </div>

            </div>

            {/* Cognitive Edge & Emotional Demeanor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Brain className="w-4 h-4" />
                  <span>Your Key Strengths</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {edge}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Compass className="w-4 h-4" />
                  <span>How You Handle Stress & Change</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {emotionalProfile}
                </p>
              </div>
            </div>
          </div>

          {/* Overall Unified 4D Score Spectrum Ruler (Where You Stand Across All 4 Dimensions) */}
          <div className="mb-8">
            <ScoreSpectrumRuler 
              score={displayComposite} 
              title="Unified 4D Composite Intelligence" 
              isOverall={true} 
            />
          </div>

          {/* 4 Pillars Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* IQ Card */}
            <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-blue-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    iqScore !== null ? 'bg-blue-950 text-blue-300 border border-blue-800/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {iqScore !== null ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                  Cognitive IQ
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {iqScore !== null ? `${iqScore}%` : '--'}
                  </span>
                  {iqScore !== null && (
                    <span className="text-xs text-slate-400">
                      {iqScore >= 85 ? 'Exceptional' : iqScore >= 65 ? 'Proficient' : iqScore >= 40 ? 'Balanced' : 'Developing'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  10 questions • Logic, math, and spatial mechanics.
                </p>
                {assessmentResult?.aiAnalysis?.categoryInsights?.IQ && (
                  <p className="text-[11px] text-blue-200/90 italic bg-blue-950/40 p-2.5 rounded-xl border border-blue-800/40 mb-3">
                    💡 {assessmentResult.aiAnalysis.categoryInsights.IQ}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {iqScore !== null ? (
                  <button
                    onClick={() => setActiveTab('IQ')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 transition-all"
                  >
                    <span>View IQ Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('iq')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md"
                  >
                    <span>Take IQ Test (10 Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* EQ Card */}
            <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-rose-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    eqScore !== null ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {eqScore !== null ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                  Emotional EQ
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {eqScore !== null ? `${eqScore}%` : '--'}
                  </span>
                  {eqScore !== null && (
                    <span className="text-xs text-slate-400">
                      {eqScore >= 85 ? 'Exceptional' : eqScore >= 65 ? 'Proficient' : eqScore >= 40 ? 'Balanced' : 'Developing'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  10 scenarios • Managing emotions and active empathy.
                </p>
                {assessmentResult?.aiAnalysis?.categoryInsights?.EQ && (
                  <p className="text-[11px] text-rose-200/90 italic bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 mb-3">
                    💡 {assessmentResult.aiAnalysis.categoryInsights.EQ}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {eqScore !== null ? (
                  <button
                    onClick={() => setActiveTab('EQ')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 transition-all"
                  >
                    <span>View EQ Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('eq')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-md"
                  >
                    <span>Take EQ Test (10 Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* SQ Card */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    sqScore !== null ? 'bg-amber-950 text-amber-300 border border-amber-800/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sqScore !== null ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Spiritual SQ
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {sqScore !== null ? `${sqScore}%` : '--'}
                  </span>
                  {sqScore !== null && (
                    <span className="text-xs text-slate-400">
                      {sqScore >= 85 ? 'Exceptional' : sqScore >= 65 ? 'Proficient' : sqScore >= 40 ? 'Balanced' : 'Developing'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  10 dilemmas • Stoic equanimity and inner wholeness.
                </p>
                {assessmentResult?.aiAnalysis?.categoryInsights?.SQ && (
                  <p className="text-[11px] text-amber-200/90 italic bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40 mb-3">
                    💡 {assessmentResult.aiAnalysis.categoryInsights.SQ}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {sqScore !== null ? (
                  <button
                    onClick={() => setActiveTab('SQ')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 transition-all"
                  >
                    <span>View SQ Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('sq')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-md"
                  >
                    <span>Take SQ Test (10 Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* AQ Card */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    aqScore !== null ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {aqScore !== null ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Adaptability AQ
                </h4>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {aqScore !== null ? `${aqScore}%` : '--'}
                  </span>
                  {aqScore !== null && (
                    <span className="text-xs text-slate-400">
                      {aqScore >= 85 ? 'Exceptional' : aqScore >= 65 ? 'Proficient' : aqScore >= 40 ? 'Balanced' : 'Developing'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  10 disruptions • Learning velocity and crisis pivoting.
                </p>
                {assessmentResult?.aiAnalysis?.categoryInsights?.AQ && (
                  <p className="text-[11px] text-emerald-200/90 italic bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 mb-3">
                    💡 {assessmentResult.aiAnalysis.categoryInsights.AQ}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {aqScore !== null ? (
                  <button
                    onClick={() => setActiveTab('AQ')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all"
                  >
                    <span>View AQ Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('aq')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md"
                  >
                    <span>Take AQ Test (10 Qs)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4D Radar Performance Matrix Canvas */}
          <div className="mb-8">
            <PerformanceChart
              iqScore={iqScore}
              eqScore={eqScore}
              sqScore={sqScore}
              aqScore={aqScore}
              iqBreakdown={iqBreakdown}
              eqBreakdown={eqBreakdown}
              sqBreakdown={sqBreakdown}
              aqBreakdown={aqBreakdown}
            />
          </div>

          {/* Tailored Growth Protocols Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <span>Recommended Daily Habits</span>
              </h3>
              <button
                onClick={() => onNavigate('gym')}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Open Cognitive Gym</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {growthHabits.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 mb-2">
                      {item.frequency || 'Daily Protocol'}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-2">{item.habit}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Action Bar */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {assessmentResult ? 'Re-calibrate Your 4D Cognitive Architecture' : 'Take the Full 4D Psychometric Assessment'}
              </h4>
              <p className="text-xs text-slate-400">
                Randomized 40-item battery (10 per dimension) evaluated across Gaussian norms with Groq AI mind archetype analytics.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('assessment')}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>{assessmentResult ? 'Retake 4D Assessment (40 Qs)' : 'Start 4D Assessment (40 Qs)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
