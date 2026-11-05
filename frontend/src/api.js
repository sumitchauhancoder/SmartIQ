/**
 * SmartIQ API Client & Session Manager
 * Handles API interaction with FastAPI backend and local session state.
 * Equipped with automatic mobile fallback mechanisms for offline / high-latency connections.
 */

import { getFallbackQuestions } from './data/fallbackQuestions';
import { supabase } from './supabaseClient';

let RAW_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://smartiq-9ilb.onrender.com';

// Sanitize in case markdown URL syntax was inadvertently supplied
if (RAW_URL.includes('[') || RAW_URL.includes('(')) {
  const match = RAW_URL.match(/https?:\/\/[^\s)\]]+/);
  if (match) RAW_URL = match[0];
}

export const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

/**
 * Gets or creates an anonymous session UUID stored in localStorage.
 * Maintains Enigma and legacy compatibility.
 */
export function getSessionId() {
  let sessionId = localStorage.getItem('enigma_session_id') || localStorage.getItem('smartiq_session_id');
  if (!sessionId) {
    sessionId = 'usr_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('enigma_session_id', sessionId);
    localStorage.setItem('smartiq_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Fetches randomized questions for 'IQ', 'EQ', 'SQ', or 'AQ'.
 * Implements a 7s timeout for slow mobile networks and gracefully falls back to local questions.
 */
export async function fetchQuestions(type, limit = 10) {
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
export async function submitAnalysis(payload, token = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers,
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
 * Resolves the active access token and returns appropriate authentication headers.
 * Prefers the passed token; if missing or stale, fetches the fresh active Supabase session token.
 */
async function resolveAuthHeaders(tokenOrKey, extraHeaders = {}) {
  const headers = { ...extraHeaders };
  let token = tokenOrKey;

  if (!token && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    } catch (e) {
      console.warn('[SmartIQ Admin API] Failed retrieving active session token:', e);
    }
  }

  if (token) {
    if (typeof token === 'string' && (token.startsWith('ey') || token.length > 30)) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['X-Admin-Key'] = token;
    }
  }
  return headers;
}

/**
 * Admin API: Fetch all questions
 */
export async function fetchAdminQuestions(tokenOrKey) {
  const headers = await resolveAuthHeaders(tokenOrKey, { 'Accept': 'application/json' });
  const res = await fetch(`${API_BASE_URL}/api/admin/questions`, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[SmartIQ Admin API] Failed fetchAdminQuestions: HTTP ${res.status}`, errorText);
    throw new Error(`Unauthorized or failed to fetch questions (${res.status}): ${errorText}`);
  }
  return res.json();
}

/**
 * Admin API: Create question
 */
export async function createAdminQuestion(questionData, tokenOrKey) {
  const headers = await resolveAuthHeaders(tokenOrKey, {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  const res = await fetch(`${API_BASE_URL}/api/admin/questions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(questionData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[SmartIQ Admin API] Failed createAdminQuestion: HTTP ${res.status}`, errorText);
    throw new Error(`Failed to create question (${res.status}): ${errorText}`);
  }
  return res.json();
}

/**
 * Admin API: Update existing question (Real-time CRUD)
 */
export async function updateAdminQuestion(id, questionData, tokenOrKey) {
  const headers = await resolveAuthHeaders(tokenOrKey, {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  const res = await fetch(`${API_BASE_URL}/api/admin/questions/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(questionData),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[SmartIQ Admin API] Failed updateAdminQuestion: HTTP ${res.status}`, errorText);
    throw new Error(`Failed to update question (${res.status}): ${errorText}`);
  }
  return res.json();
}

/**
 * Admin API: Delete question
 */
export async function deleteAdminQuestion(id, tokenOrKey) {
  const headers = await resolveAuthHeaders(tokenOrKey, { 'Accept': 'application/json' });
  const res = await fetch(`${API_BASE_URL}/api/admin/questions/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[SmartIQ Admin API] Failed deleteAdminQuestion: HTTP ${res.status}`, errorText);
    throw new Error(`Failed to delete question (${res.status}): ${errorText}`);
  }
  return res.json();
}

/**
 * Admin API: Fetch platform statistics
 */
export async function fetchAdminStats(tokenOrKey) {
  const headers = await resolveAuthHeaders(tokenOrKey, { 'Accept': 'application/json' });
  const res = await fetch(`${API_BASE_URL}/api/admin/stats`, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[SmartIQ Admin API] Failed fetchAdminStats: HTTP ${res.status}`, errorText);
    throw new Error(`Unauthorized or failed to fetch stats (${res.status}): ${errorText}`);
  }
  return res.json();
}

/**
 * Deterministic local psychometric engine used when network is offline.
 * Supports IQ, EQ, SQ, AQ individual evaluations as well as holistic 4D matrix synthesis.
 */
export function computeLocalArchetype(submission) {
  const test_type = (submission.test_type || 'COMBINED').toUpperCase();
  const {
    iq_score = 100,
    eq_score = 100,
    sq_score = 100,
    aq_score = 100,
    incorrect_questions = []
  } = submission;

  let archetype = 'The Balanced 4D Integrator';
  let summary = 'You display healthy equilibrium across logic, emotional resonance, stoic grounding, and disruption agility.';
  let edge = 'Multidimensional adaptability across unpredictable intellectual, interpersonal, and situational landscapes.';
  let emotional = 'Grounded equilibrium; maintains objective neutrality while actively validating human nuances.';
  let habits = [];

  if (test_type === 'SQ') {
    if (sq_score >= 125) {
      archetype = 'The Sovereign Stoic Sage';
      summary = 'You embody exceptional spiritual resilience, finding profound existential purpose and unshakeable equanimity in the face of external storms.';
      edge = 'Epictetus-grade dichotomy of control; mastery over internal judgment, moral integrity, and deep existential grounding.';
      emotional = 'Serene emotional stillness; immune to flattery or slander, driven by cardinal virtue and inner wholeness.';
    } else if (sq_score >= 110) {
      archetype = 'The Purpose-Driven Philosopher';
      summary = 'You possess strong moral clarity, consistently aligning your actions with personal values and seeking meaningful impact over ephemeral trends.';
      edge = 'Existential meaning-making and reflective self-examination under moral ambiguity.';
      emotional = 'Grounded composure with a steady ethical compass and respect for timeless philosophical wisdom.';
    } else {
      archetype = 'The Seeking Realist';
      summary = 'You approach life with practical grounding, maintaining functional ethics while exploring deeper philosophical frameworks.';
      edge = 'Pragmatic balance between real-world constraints and moral responsibility.';
      emotional = 'Sensible and grounded; benefits from daily quietude and deeper study of classical Stoic principles.';
    }
    habits = [
      {
        habit: 'Premeditatio Malorum & Amor Fati',
        frequency: 'Daily (Morning)',
        action: 'Visualize potential obstacles without anxiety; embrace whatever unfolds as fuel for moral excellence.',
      },
      {
        habit: 'Value-Alignment Audit',
        frequency: 'Weekly (Sunday)',
        action: 'Review your weekly decisions against your core virtues: Wisdom, Courage, Justice, and Temperance.',
      },
      {
        habit: 'Contemplative Quietude',
        frequency: 'Daily (10-15 mins)',
        action: 'Unplug completely from digital noise; practice silent reflection, journaling, or classical philosophy reading.',
      },
    ];
  } else if (test_type === 'AQ') {
    if (aq_score >= 125) {
      archetype = 'The Fluid Disruption Pioneer';
      summary = 'You demonstrate peerless adaptability, operating with lightning pivot velocity, joy under ambiguity, and rapid unlearning/relearning mastery.';
      edge = "Instinctive 'What If...?' reframing, zero-latency crisis navigation, and effortless synthesis of revolutionary technologies like AI.";
      emotional = 'High psychological safety in chaos; transforms catastrophic disruption into creative breakthrough leverage.';
    } else if (aq_score >= 110) {
      archetype = 'The Agile Strategic Navigator';
      summary = 'You metabolize change smoothly, proactively adjusting strategies and embracing emerging workflows before disruption forces a pivot.';
      edge = 'Flexible mental model swapping and strong resilience during unexpected organizational shifts.';
      emotional = 'Adaptable and steady; comfortably unlearns obsolete protocols to assimilate modern paradigms.';
    } else {
      archetype = 'The Methodical Adapter';
      summary = 'You prefer structured evolution over sudden upheaval, adapting reliably once new frameworks have been tested and demonstrated.';
      edge = 'Deliberate, thorough transition management that avoids reckless over-rotation.';
      emotional = 'Grounded caution; thrives when given clear transition milestones and micro-experimental sandboxes.';
    }
    habits = [
      {
        habit: "The 'What If...?' Simulation",
        frequency: 'Daily (10 mins)',
        action: "Challenge one standard operational assumption by asking 'What if this constraint disappeared or reversed?'",
      },
      {
        habit: 'Voluntary Novelty Immersion',
        frequency: 'Weekly',
        action: 'Intentionally test an unfamiliar tool, study an alien discipline, or explore new technology to keep mental plasticity sharp.',
      },
      {
        habit: 'Rapid 48-Hour Micro-Experiment',
        frequency: 'Bi-Weekly',
        action: 'Test an emerging idea with zero-friction lean prototypes rather than debating hypotheses theoretically.',
      },
    ];
  } else if (test_type === 'IQ') {
    if (iq_score >= 125) {
      archetype = 'The Deep-System Logician';
      summary = 'Your mental architecture operates at elite analytical velocity, isolating complex relational patterns and structural syllogisms effortlessly.';
      edge = 'High-dimensional abstraction, spatial mental transformation, and rapid algorithmic fallacy elimination.';
      emotional = 'Hyper-rational and precise; excels when problem domains are clearly defined and structured.';
    } else if (iq_score >= 110) {
      archetype = 'The Deductive Architect';
      summary = 'You demonstrate sharp structural reasoning and robust mathematical modeling across complex operational environments.';
      edge = 'Methodical pattern isolation and reliable deductive risk assessment.';
      emotional = 'Clear and objective; thrives in data-rich analytical challenges.';
    } else {
      archetype = 'The Pragmatic Analyst';
      summary = 'You apply balanced, common-sense problem solving with dependable real-world analytical execution.';
      edge = 'Practical problem resolution without unnecessary theoretical convolution.';
      emotional = 'Direct and focused on tangible outcomes.';
    }
    habits = [
      {
        habit: 'Combinatorial Puzzle Training',
        frequency: 'Daily (15 mins)',
        action: 'Solve tactical chess puzzles, sudoku, or spatial matrix problems to elevate working memory capacity.',
      },
      {
        habit: 'First-Principles Mental Modeling',
        frequency: 'Weekly',
        action: 'Break down an engineering or business problem into its fundamental axioms before synthesizing solutions.',
      },
      {
        habit: 'Bayesian Probability Calibration',
        frequency: 'Weekly',
        action: 'Quantify your confidence in your predictions (e.g. 70%) and track calibration accuracy over time.',
      },
    ];
  } else if (test_type === 'EQ') {
    if (eq_score >= 125) {
      archetype = 'The Resonant Diplomat';
      summary = 'You possess extraordinary interpersonal acuity, effortlessly reading emotional undercurrents, de-escalating friction, and cultivating deep trust.';
      edge = 'Hyper-attuned affective empathy, emotional self-regulation under duress, and master-level social orchestration.';
      emotional = 'Profound psychological warmth; creates immediate safety and inspires high-retention collaboration.';
    } else if (eq_score >= 110) {
      archetype = 'The Empathetic Harmonizer';
      summary = 'You demonstrate strong situational awareness, validating others perspectives while maintaining your own emotional balance.';
      edge = 'Constructive conflict resolution and active non-verbal cue decoding.';
      emotional = 'Attentive and composed; bridges divergent personality styles with ease.';
    } else {
      archetype = 'The Practical Communicator';
      summary = 'You approach social dynamics with straightforward honesty and functional communication.';
      edge = 'Direct, unpretentious interaction focused on shared objectives.';
      emotional = 'Steady; benefits from deeper active listening and emotional journaling.';
    }
    habits = [
      {
        habit: '10-Minute Nightly Emotional Journal',
        frequency: 'Daily (Night)',
        action: 'Write down key interpersonal moments from the day, identifying somatic cues and emotional triggers.',
      },
      {
        habit: 'Active Listening Protocol',
        frequency: 'Daily (Real-time)',
        action: "In your next 3 conversations, summarize the other person's core feeling before offering any solution.",
      },
      {
        habit: 'Somatic Pause Under Pressure',
        frequency: 'When Triggered',
        action: 'Take 3 deep box breaths to prevent amygdala hijack before reacting to criticism or conflict.',
      },
    ];
  } else {
    // Combined / Holistic
    const avg = (iq_score + eq_score + sq_score + aq_score) / 4;
    if (avg >= 120 && sq_score >= 115 && aq_score >= 115) {
      archetype = 'The Transcendent Sovereign Polymath';
      summary = 'A rare multidimensional cognitive powerhouse. You synthesize analytical deduction (IQ), human resonance (EQ), stoic grounding (SQ), and fluid pivot velocity (AQ).';
      edge = 'Complete cognitive equilibrium: architecting complex systems while anchoring teams with purpose and navigating radical disruption.';
      emotional = 'Imperturbable inner peace combined with dynamic charisma and limitless adaptability.';
    } else if (iq_score >= 115 && aq_score >= 115) {
      archetype = 'The Agile Algorithmic Disruptor';
      summary = 'You excel at the convergence of pure logic and rapid adaptability, mastering new paradigms and tech shifts (AI, engineering) before others notice.';
      edge = 'Lightning-fast conceptual unlearning/relearning coupled with rigorous structural modeling.';
      emotional = 'Fast-paced, innovative, and resilient against sudden environmental shocks.';
    } else if (sq_score >= 115 && eq_score >= 115) {
      archetype = 'The Resonant Stoic Visionary';
      summary = 'You unite profound human empathy with classical stoic purpose, leading through moral authority, compassion, and existential clarity.';
      edge = 'Unshakeable values, restorative conflict mitigation, and deep cultural/philosophical stewardship.';
      emotional = 'Magnanimous and centered; an empathetic anchor in times of societal turbulence.';
    } else if (aq_score >= 115 && eq_score >= 115) {
      archetype = 'The Fluid Crisis Leader';
      summary = 'You excel when chaos strikes, maintaining high emotional safety and pivoting group strategy seamlessly under high stakes.';
      edge = 'De-escalation under acute ambiguity and rapid collective mobilization.';
      emotional = 'Inspiring and flexible; turning organizational panic into focused execution.';
    } else if (iq_score >= 115 && sq_score >= 115) {
      archetype = 'The Theoretical Moral Architect';
      summary = 'You blend first-principles logic with deep philosophical rigor, designing systems that are both mathematically sound and ethically grounded.';
      edge = 'High abstract deduction anchored in immutable cardinal virtues.';
      emotional = 'Reflective, principled, and intellectually uncompromising.';
    } else {
      archetype = 'The Balanced 4D Integrator';
      summary = 'You demonstrate healthy equilibrium across all four intelligence quotients, maintaining steady execution without severe blind spots.';
      edge = 'Well-rounded versatility across logic, emotion, existential purpose, and adaptability.';
      emotional = 'Dependable and grounded across diverse personal and professional domains.';
    }
    habits = [
      {
        habit: '4D Multidimensional Audit',
        frequency: 'Weekly',
        action: 'Assess your week across 4 pillars: Did I think clearly (IQ)? Relate deeply (EQ)? Stay grounded (SQ)? Adapt quickly (AQ)?',
      },
      {
        habit: "Stoic Premeditation & 'What If?' Synthesis",
        frequency: 'Bi-Weekly',
        action: 'Simulate a severe potential crisis: plan your tactical pivot (AQ) while anchoring your inner peace (SQ).',
      },
      {
        habit: 'Cross-Disciplinary Learning Sprints',
        frequency: 'Monthly',
        action: 'Study an intersection: e.g. AI ethics (IQ+SQ), leadership psychology (EQ+AQ), or computational linguistics.',
      },
    ];
  }

  const mistakes = incorrect_questions.map((q) => ({
    question: (q.question_text || 'Assessment item').substring(0, 90) + '...',
    why_wrong: `Selected option '${q.user_option || 'N/A'}' diverged from the verified optimal answer.`,
    cognitive_bias: 'Heuristic framing, reactive impulse, or time-pressure cognitive shortcuts.',
  }));

  if (mistakes.length === 0) {
    mistakes.push({
      question: 'Flawless Execution',
      why_wrong: 'Zero flaws detected in this assessment module.',
      cognitive_bias: 'None observed.',
    });
  }

  return {
    archetype_title: archetype,
    core_summary: summary,
    cognitive_edge: edge,
    emotional_profile: emotional,
    growth_habits: habits,
    mistake_analyses: mistakes,
  };
}

/**
 * Sends chat messages to Groq via backend /api/chat.
 * Implements mobile-safe 8s timeout with rich local cognitive engine fallback.
 */
export async function sendChatMessage(messages, userContext = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages,
        user_context: userContext
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.response) {
        return {
          response: data.response,
          model: data.model || 'Groq Llama 3.3',
          source: data.source || 'groq'
        };
      }
    }
  } catch (err) {
    console.warn(`[SmartIQ] Backend chat unavailable (${err.message}). Using local intelligence mentor engine.`);
  }

  // Local fallback response generator
  const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
  const iq = userContext.iq_score;
  const eq = userContext.eq_score;
  const sq = userContext.sq_score;
  const aq = userContext.aq_score;

  if (lastMsg.includes('aq') || lastMsg.includes('adapt') || lastMsg.includes('ai') || lastMsg.includes('pivot') || lastMsg.includes('crisis')) {
    return {
      response: `### Adaptability Quotient (AQ) • Peak 10/10 Impact\n\n**AQ is your velocity of cognitive adjustment under radical disruption.** While IQ calculates and EQ connects, AQ dictates whether you thrive when the rules of the game change.\n\n**Core Pillars of AQ:**\n- **The 'What If...?' Agility Habit:** Regularly run counter-factual simulations on your career or projects. Ask: *'If our primary tool/revenue was wiped out tomorrow, what is our pivot in 48 hours?'*\n- **Deliberate Unlearning:** Alvin Toffler famously noted: *'The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.'*\n- **Antifragile Posture (Nassim Taleb):** Don't just resist shock; design your workflows so volatility makes you smarter and more capable.\n\n${aq ? `*Your current AQ Score is **${aq}**.* ` : ''}Try the **Crisis Simulator drill** in our Cognitive Gym to train your pivot instincts!`,
      model: 'Enigma Local Mentor',
      source: 'local'
    };
  }

  if (lastMsg.includes('sq') || lastMsg.includes('stoic') || lastMsg.includes('control') || lastMsg.includes('meaning') || lastMsg.includes('epictetus')) {
    return {
      response: `### Spiritual Quotient (SQ) & Stoic Intelligence • 8/10 Impact\n\n**SQ is not about dogma; it is the capacity for existential purpose, core values, and unshakeable inner wholeness.**\n\n**Foundational Stoic Principles for SQ:**\n- **The Dichotomy of Control (Epictetus):** Divide reality into what is within your volition (opinions, virtues, choices, craft) and what is not (reputation, economy, weather, others' actions). Suffer only for your own character.\n- **Amor Fati (Loving Fate):** Don't just endure adversity; actively embrace each event as fuel for virtue and self-realization.\n- **Viktor Frankl's Logotherapy:** *'Those who have a 'why' to live, can bear with almost any 'how'.'* Clarify your moral cardinal north star before entering external chaos.\n\n${sq ? `*Your current SQ Score is **${sq}**.* ` : ''}Visit the **Stoic Sanctuary** in our Cognitive Gym to test yourself on the Dichotomy of Control Sorter!`,
      model: 'Enigma Local Mentor',
      source: 'local'
    };
  }

  if (lastMsg.includes('eq') || lastMsg.includes('empath') || lastMsg.includes('emotion') || lastMsg.includes('conflict') || lastMsg.includes('listen')) {
    return {
      response: `### Emotional Quotient (EQ) • 9.3/10 Impact\n\n**EQ is the neurobiological mastery of self-awareness, somatic regulation, and interpersonal resonance.** In high-stakes leadership, emotional composure consistently outperforms raw computational IQ.\n\n**High-Leverage EQ Protocols:**\n- **10-Minute Nightly Emotional Journal:** Note two moments where your autonomic nervous system spiked. What was the somatic sensation? What need was underneath?\n- **The Somatic Sigh:** Two quick nasal inhales followed by a prolonged, unforced mouth exhale drops heart rate and halts amygdala hijacking within 40 seconds.\n- **Active Nonviolent Listening (NVC):** Before providing a counter-argument, reflect back the other person's core emotion: *'It sounds like you're feeling anxious about the delivery timeline.'*\n\n${eq ? `*Your current EQ Score is **${eq}**.* ` : ''}Practice our **Empathy Lab scenarios** in the Cognitive Gym to refine your conflict responses!`,
      model: 'Enigma Local Mentor',
      source: 'local'
    };
  }

  if (lastMsg.includes('iq') || lastMsg.includes('logic') || lastMsg.includes('math') || lastMsg.includes('bayes') || lastMsg.includes('puzzle')) {
    return {
      response: `### Intelligence Quotient (IQ) • 9/10 Impact\n\n**IQ represents raw computational deduction, pattern mechanics, working memory, and Bayesian probability processing.**\n\n**Scientific Ways to Train IQ:**\n- **Bayesian Updating:** Continually adjust your probability confidence as new facts arrive rather than maintaining binary dogmatic beliefs.\n- **Working Memory Sprints:** Engage with timed chess tactical puzzles, sudoku, and mental arithmetic to strengthen prefrontal cortex arborization.\n- **Feynman Technique:** Can you explain the abstract concept to a 10-year-old using simple sensory analogies? If not, you don't truly grasp it.\n\n${iq ? `*Your current IQ Score is **${iq}**.* ` : ''}Try our **Rapid Deductive Math Duel** in the Cognitive Gym for a high-intensity 30-second focus sprint!`,
      model: 'Enigma Local Mentor',
      source: 'local'
    };
  }

  return {
    response: `### Enigma Cognitive Intelligence Assistant (Groq Ready)\n\nWelcome! I am your AI Intelligence Mentor, specialized in the **4 Dimensions of Human Capability**:\n\n- **IQ (Cognitive • 9/10):** Abstract reasoning, logic trees, Bayesian statistics & spatial manipulation.\n- **EQ (Emotional • 9.3/10):** Affective empathy, somatic self-regulation & nonviolent communication.\n- **SQ (Spiritual • 8/10):** Existential purpose, core values & Epictetus' Dichotomy of Control.\n- **AQ (Adaptability • 10/10):** Crisis velocity, AI paradigm assimilation & deliberate unlearning.\n\n${(iq || eq || sq || aq) ? `**Your Profile Metrics:** IQ: ${iq || '--'} • EQ: ${eq || '--'} • SQ: ${sq || '--'} • AQ: ${aq || '--'}\n\n` : ''}Ask me anything about improving a specific quotient, analyzing your scores, exploring Stoicism, or mastering crisis agility!`,
    model: 'Enigma Local Mentor',
    source: 'local'
  };
}
