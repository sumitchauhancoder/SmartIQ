/**
 * SmartIQ API Client & Session Manager
 * Handles API interaction with FastAPI backend and local session state.
 * Equipped with automatic mobile fallback mechanisms for offline / high-latency connections.
 */

import { getFallbackQuestions } from './data/fallbackQuestions';

let RAW_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://smartiq-9ilb.onrender.com';

// Sanitize in case markdown URL syntax was inadvertently supplied
if (RAW_URL.includes('[') || RAW_URL.includes('(')) {
  const match = RAW_URL.match(/https?:\/\/[^\s)\]]+/);
  if (match) RAW_URL = match[0];
}

export const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

/**
 * Gets or creates an anonymous session UUID stored in localStorage.
 */
export function getSessionId() {
  let sessionId = localStorage.getItem('smartiq_session_id');
  if (!sessionId) {
    sessionId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('smartiq_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Fetches randomized questions for either 'IQ' or 'EQ'.
 * Implements a 7s timeout for slow mobile networks and gracefully falls back to local questions.
 */
export async function fetchQuestions(type, limit = 5) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout for mobile connections

    const response = await fetch(`${API_BASE_URL}/api/questions?type=${type}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data?.data || []);

    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    throw new Error('Empty question array returned from server');
  } catch (err) {
    console.warn(`[SmartIQ] Failed fetching from API (${err.message}). Using local fallback questions.`);
    return getFallbackQuestions(type, limit);
  }
}

/**
 * Sends test results to the backend for LLM mind archetype synthesis.
 * Uses a 12s timeout for Render free-tier latency before falling back to local deterministic calculation.
 */
export async function submitAnalysis(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Analysis request failed: ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn('[SmartIQ] Remote LLM analysis unavailable or timed out; activating local psychometric engine:', err);
    return computeLocalArchetype(payload);
  }
}

/**
 * Admin API: Fetch all questions
 */
export async function fetchAdminQuestions(adminKey) {
  const res = await fetch(`${API_BASE_URL}/api/admin/questions`, {
    headers: { 'X-Admin-Key': adminKey }
  });
  if (!res.ok) throw new Error('Unauthorized or failed to fetch questions');
  return res.json();
}

/**
 * Admin API: Create question
 */
export async function createAdminQuestion(questionData, adminKey) {
  const res = await fetch(`${API_BASE_URL}/api/admin/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey
    },
    body: JSON.stringify(questionData),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

/**
 * Admin API: Delete question
 */
export async function deleteAdminQuestion(id, adminKey) {
  const res = await fetch(`${API_BASE_URL}/api/admin/questions/${id}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': adminKey }
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}

/**
 * Admin API: Fetch platform statistics
 */
export async function fetchAdminStats(adminKey) {
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: { 'X-Admin-Key': adminKey }
  });
  if (!res.ok) throw new Error('Unauthorized or failed to fetch stats');
  return res.json();
}

/**
 * Deterministic local psychometric engine used when network is offline.
 */
export function computeLocalArchetype(submission) {
  const { iq_score = 100, eq_score = 100, incorrect_questions = [] } = submission;

  let archetype = 'The Balanced Catalyst';
  let summary = 'You display a harmonious synergy between deductive rationality and emotional situational responsiveness.';
  let edge = 'Adaptability across changing technical environments and group problem-solving dynamics.';
  let emotional = 'Grounded equilibrium; maintains objective neutrality while actively validating interpersonal nuances.';

  if (iq_score >= 120 && eq_score >= 115) {
    archetype = 'The Strategic Empathetic Architect';
    summary = 'A rare dual-cognitive powerhouse. You synthesize systemic algorithmic modeling with nuanced leadership resonance.';
    edge = 'High-dimensional abstract reasoning coupled with lightning pattern synthesis.';
    emotional = 'Effortless de-escalation of interpersonal tension and psychological safety cultivation.';
  } else if (iq_score >= 120) {
    archetype = 'The Systematic Deep-Logician';
    summary = 'Your mental machinery excels at structural architecture, rapid deduction, and structural fallacy elimination.';
    edge = 'Laser precision across spatial relations, algorithmic sequences, and logic trees.';
    emotional = 'Direct and clarity-driven; thrives when operational rules and metrics are clearly demarcated.';
  } else if (eq_score >= 115) {
    archetype = 'The Intuitive Resonant Navigator';
    summary = 'Exceptional human acuity. You intuitively decode emotional micro-cues, team friction, and social undercurrents.';
    edge = 'Holistic situational synthesis and empathetic perspective-taking.';
    emotional = 'High affective empathy, emotional composure under social duress, and deep motivational leadership.';
  }

  const mistakes = incorrect_questions.map((q) => ({
    question: (q.question_text || 'Assessment item').substring(0, 90) + '...',
    why_wrong: `Selected option '${q.user_option || 'N/A'}' diverged from the verified deductive rule.`,
    cognitive_bias: 'Heuristic framing or time-pressure cognitive shortcuts.',
  }));

  if (mistakes.length === 0) {
    mistakes.push({
      question: 'Zero Flaws Detected',
      why_wrong: 'Flawless execution under time constraints.',
      cognitive_bias: 'None observed.',
    });
  }

  return {
    archetype_title: archetype,
    core_summary: summary,
    cognitive_edge: edge,
    emotional_profile: emotional,
    growth_habits: [
      {
        habit: 'Dual-N-Back Working Memory Practice',
        frequency: 'Daily (10-15 mins)',
        action: 'Expand active short-term mental buffers to supercharge working memory retention.',
      },
      {
        habit: 'Somatic Trigger Labeling',
        frequency: 'Daily (Real-time)',
        action: 'When unexpected stress occurs, silently name the physiological sensation to stop amygdala hijack.',
      },
      {
        habit: 'Counter-Factual Ideation',
        frequency: 'Weekly',
        action: 'Argue rigorously against your most cherished assumption to dismantle confirmation bias.',
      },
    ],
    mistake_analyses: mistakes,
  };
}
