"""
SmartIQ Backend API
FastAPI service managing psychometric tests, anti-cheat audit logs,
AI Mind Archetype generation (Groq AI / Deterministic fallback),
Supabase PostgreSQL persistence, Supabase Auth validation, and Admin CRUD operations with RBAC.
"""

import os
import json
import re
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

import database
import auth

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database (Supabase PostgreSQL if DATABASE_URL present, else local SQLite)
    database.init_db()
    yield


app = FastAPI(
    title="Enigma API",
    description="4D Multidimensional Intelligence Matrix & AI Mind Archetype Analytics with Supabase RBAC",
    version="1.1.0",
    lifespan=lifespan
)

# CORS configuration - Permissive origin regex to prevent mobile browser cross-origin blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Pydantic Schemas
# =============================================================================
class QuizSubmission(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    test_type: Optional[str] = "COMBINED"  # 'IQ', 'EQ', 'SQ', 'AQ', or 'COMBINED'
    iq_score: Optional[int] = None
    iq_breakdown: Dict[str, int] = Field(default_factory=dict)
    eq_score: Optional[int] = None
    eq_breakdown: Dict[str, int] = Field(default_factory=dict)
    sq_score: Optional[int] = None
    sq_breakdown: Dict[str, int] = Field(default_factory=dict)
    aq_score: Optional[int] = None
    aq_breakdown: Dict[str, int] = Field(default_factory=dict)
    incorrect_questions: List[Dict[str, Any]] = Field(default_factory=list)
    tab_switch_count: int = 0


class AdminQuestion(BaseModel):
    id: Optional[int] = None
    category_type: str
    sub_category: str
    question_text: str
    options: List[str]
    correct_answer_index: int
    explanation: str
    diagram_svg: Optional[str] = None
    points: Optional[List[int]] = None


class HabitItem(BaseModel):
    habit: str
    frequency: str
    action: str


class MistakeAnalysis(BaseModel):
    question: str
    why_wrong: str
    cognitive_bias: str


class ArchetypeAnalysis(BaseModel):
    archetype_title: str
    core_summary: str
    cognitive_edge: str
    emotional_profile: str
    growth_habits: List[HabitItem]
    mistake_analyses: List[MistakeAnalysis]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_context: Optional[Dict[str, Any]] = None


# =============================================================================
# Local Deterministic Fallback Engine (IQ, EQ, SQ, AQ & 4D Synthesis)
# =============================================================================
def generate_deterministic_archetype(submission: QuizSubmission) -> Dict[str, Any]:
    """
    Fallback deterministic psychometric calculation engine.
    Supports individual independent evaluations (IQ, EQ, SQ, AQ) and holistic 4D synthesis.
    """
    test_type = (submission.test_type or "COMBINED").upper()
    iq = submission.iq_score or 100
    eq = submission.eq_score or 100
    sq = submission.sq_score or 100
    aq = submission.aq_score or 100

    # 1. SQ Independent Evaluation
    if test_type == "SQ":
        if sq >= 125:
            archetype = "The Sovereign Stoic Sage"
            summary = "You embody exceptional spiritual resilience, finding profound existential purpose and unshakeable equanimity in the face of external storms."
            edge = "Epictetus-grade dichotomy of control; mastery over internal judgment, moral integrity, and deep existential grounding."
            eq_style = "Serene emotional stillness; immune to flattery or slander, driven by cardinal virtue and inner wholeness."
        elif sq >= 110:
            archetype = "The Purpose-Driven Philosopher"
            summary = "You possess strong moral clarity, consistently aligning your actions with personal values and seeking meaningful impact over ephemeral trends."
            edge = "Existential meaning-making and reflective self-examination under moral ambiguity."
            eq_style = "Grounded composure with a steady ethical compass and respect for timeless philosophical wisdom."
        else:
            archetype = "The Seeking Realist"
            summary = "You approach life with practical grounding, maintaining functional ethics while exploring deeper philosophical frameworks."
            edge = "Pragmatic balance between real-world constraints and moral responsibility."
            eq_style = "Sensible and grounded; benefits from daily quietude and deeper study of classical Stoic principles."

        growth_habits = [
            {
                "habit": "Premeditatio Malorum & Amor Fati",
                "frequency": "Daily (Morning)",
                "action": "Visualize potential obstacles without anxiety; embrace whatever unfolds as fuel for moral excellence."
            },
            {
                "habit": "Value-Alignment Audit",
                "frequency": "Weekly (Sunday)",
                "action": "Review your weekly decisions against your core virtues: Wisdom, Courage, Justice, and Temperance."
            },
            {
                "habit": "Contemplative Quietude",
                "frequency": "Daily (10-15 mins)",
                "action": "Unplug completely from digital noise; practice silent reflection, journaling, or classical philosophy reading."
            }
        ]

    # 2. AQ Independent Evaluation
    elif test_type == "AQ":
        if aq >= 125:
            archetype = "The Fluid Disruption Pioneer"
            summary = "You demonstrate peerless adaptability, operating with lightning pivot velocity, joy under ambiguity, and rapid unlearning/relearning mastery."
            edge = "Instinctive 'What If...?' reframing, zero-latency crisis navigation, and effortless synthesis of revolutionary technologies like AI."
            eq_style = "High psychological safety in chaos; transforms catastrophic disruption into creative breakthrough leverage."
        elif aq >= 110:
            archetype = "The Agile Strategic Navigator"
            summary = "You metabolize change smoothly, proactively adjusting strategies and embracing emerging workflows before disruption forces a pivot."
            edge = "Flexible mental model swapping and strong resilience during unexpected organizational shifts."
            eq_style = "Adaptable and steady; comfortably unlearns obsolete protocols to assimilate modern paradigms."
        else:
            archetype = "The Methodical Adapter"
            summary = "You prefer structured evolution over sudden upheaval, adapting reliably once new frameworks have been tested and demonstrated."
            edge = "Deliberate, thorough transition management that avoids reckless over-rotation."
            eq_style = "Grounded caution; thrives when given clear transition milestones and micro-experimental sandboxes."

        growth_habits = [
            {
                "habit": "The 'What If...?' Simulation",
                "frequency": "Daily (10 mins)",
                "action": "Challenge one standard operational assumption by asking 'What if this constraint disappeared or reversed?'"
            },
            {
                "habit": "Voluntary Novelty Immersion",
                "frequency": "Weekly",
                "action": "Intentionally test an unfamiliar tool, study an alien discipline, or explore new technology to keep mental plasticity sharp."
            },
            {
                "habit": "Rapid 48-Hour Micro-Experiment",
                "frequency": "Bi-Weekly",
                "action": "Test an emerging idea with zero-friction lean prototypes rather than debating hypotheses theoretically."
            }
        ]

    # 3. IQ Independent Evaluation
    elif test_type == "IQ":
        if iq >= 125:
            archetype = "The Deep-System Logician"
            summary = "Your mental architecture operates at elite analytical velocity, isolating complex relational patterns and structural syllogisms effortlessly."
            edge = "High-dimensional abstraction, spatial mental transformation, and rapid algorithmic fallacy elimination."
            eq_style = "Hyper-rational and precise; excels when problem domains are clearly defined and structured."
        elif iq >= 110:
            archetype = "The Deductive Architect"
            summary = "You demonstrate sharp structural reasoning and robust mathematical modeling across complex operational environments."
            edge = "Methodical pattern isolation and reliable deductive risk assessment."
            eq_style = "Clear and objective; thrives in data-rich analytical challenges."
        else:
            archetype = "The Pragmatic Analyst"
            summary = "You apply balanced, common-sense problem solving with dependable real-world analytical execution."
            edge = "Practical problem resolution without unnecessary theoretical convolution."
            eq_style = "Direct and focused on tangible outcomes."

        growth_habits = [
            {
                "habit": "Combinatorial Puzzle Training",
                "frequency": "Daily (15 mins)",
                "action": "Solve tactical chess puzzles, sudoku, or spatial matrix problems to elevate working memory capacity."
            },
            {
                "habit": "First-Principles Mental Modeling",
                "frequency": "Weekly",
                "action": "Break down an engineering or business problem into its fundamental axioms before synthesizing solutions."
            },
            {
                "habit": "Bayesian Probability Calibration",
                "frequency": "Weekly",
                "action": "Quantify your confidence in your predictions (e.g. 70%) and track calibration accuracy over time."
            }
        ]

    # 4. EQ Independent Evaluation
    elif test_type == "EQ":
        if eq >= 125:
            archetype = "The Resonant Diplomat"
            summary = "You possess extraordinary interpersonal acuity, effortlessly reading emotional undercurrents, de-escalating friction, and cultivating deep trust."
            edge = "Hyper-attuned affective empathy, emotional self-regulation under duress, and master-level social orchestration."
            eq_style = "Profound psychological warmth; creates immediate safety and inspires high-retention collaboration."
        elif eq >= 110:
            archetype = "The Empathetic Harmonizer"
            summary = "You demonstrate strong situational awareness, validating others' perspectives while maintaining your own emotional balance."
            edge = "Constructive conflict resolution and active non-verbal cue decoding."
            eq_style = "Attentive and composed; bridges divergent personality styles with ease."
        else:
            archetype = "The Practical Communicator"
            summary = "You approach social dynamics with straightforward honesty and functional communication."
            edge = "Direct, unpretentious interaction focused on shared objectives."
            eq_style = "Steady; benefits from deeper active listening and emotional journaling."

        growth_habits = [
            {
                "habit": "10-Minute Nightly Emotional Journal",
                "frequency": "Daily (Night)",
                "action": "Write down key interpersonal moments from the day, identifying somatic cues and emotional triggers."
            },
            {
                "habit": "Active Listening Protocol",
                "frequency": "Daily (Real-time)",
                "action": "In your next 3 conversations, summarize the other person's core feeling before offering any solution."
            },
            {
                "habit": "Somatic Pause Under Pressure",
                "frequency": "When Triggered",
                "action": "Take 3 deep box breaths to prevent amygdala hijack before reacting to criticism or conflict."
            }
        ]

    # 5. Holistic 4D Matrix Synthesis (Combined)
    else:
        avg_score = (iq + eq + sq + aq) / 4
        if avg_score >= 120 and (sq >= 115 and aq >= 115):
            archetype = "The Transcendent Sovereign Polymath"
            summary = "A rare multidimensional cognitive powerhouse. You synthesize analytical deduction (IQ), human resonance (EQ), stoic grounding (SQ), and fluid pivot velocity (AQ)."
            edge = "Complete cognitive equilibrium: architecting complex systems while anchoring teams with purpose and navigating radical disruption."
            eq_style = "Imperturbable inner peace combined with dynamic charisma and limitless adaptability."
        elif iq >= 115 and aq >= 115:
            archetype = "The Agile Algorithmic Disruptor"
            summary = "You excel at the convergence of pure logic and rapid adaptability, mastering new paradigms and tech shifts (AI, engineering) before others notice."
            edge = "Lightning-fast conceptual unlearning/relearning coupled with rigorous structural modeling."
            eq_style = "Fast-paced, innovative, and resilient against sudden environmental shocks."
        elif sq >= 115 and eq >= 115:
            archetype = "The Resonant Stoic Visionary"
            summary = "You unite profound human empathy with classical stoic purpose, leading through moral authority, compassion, and existential clarity."
            edge = "Unshakeable values, restorative conflict mitigation, and deep cultural/philosophical stewardship."
            eq_style = "Magnanimous and centered; an empathetic anchor in times of societal turbulence."
        elif aq >= 115 and eq >= 115:
            archetype = "The Fluid Crisis Leader"
            summary = "You excel when chaos strikes, maintaining high emotional safety and pivoting group strategy seamlessly under high stakes."
            edge = "De-escalation under acute ambiguity and rapid collective mobilization."
            eq_style = "Inspiring and flexible; turning organizational panic into focused execution."
        elif iq >= 115 and sq >= 115:
            archetype = "The Theoretical Moral Architect"
            summary = "You blend first-principles logic with deep philosophical rigor, designing systems that are both mathematically sound and ethically grounded."
            edge = "High abstract deduction anchored in immutable cardinal virtues."
            eq_style = "Reflective, principled, and intellectually uncompromising."
        else:
            archetype = "The Balanced 4D Integrator"
            summary = "You demonstrate healthy equilibrium across all four intelligence quotients, maintaining steady execution without severe blind spots."
            edge = "Well-rounded versatility across logic, emotion, existential purpose, and adaptability."
            eq_style = "Dependable and grounded across diverse personal and professional domains."

        growth_habits = [
            {
                "habit": "4D Multidimensional Audit",
                "frequency": "Weekly",
                "action": "Assess your week across 4 pillars: Did I think clearly (IQ)? Relate deeply (EQ)? Stay grounded (SQ)? Adapt quickly (AQ)?"
            },
            {
                "habit": "Stoic Premeditation & 'What If?' Synthesis",
                "frequency": "Bi-Weekly",
                "action": "Simulate a severe potential crisis: plan your tactical pivot (AQ) while anchoring your inner peace (SQ)."
            },
            {
                "habit": "Cross-Disciplinary Learning Sprints",
                "frequency": "Monthly",
                "action": "Study an intersection: e.g. AI ethics (IQ+SQ), leadership psychology (EQ+AQ), or computational linguistics."
            }
        ]

    mistakes = []
    for item in submission.incorrect_questions:
        q_text = item.get("question_text", "Assessment Item")
        u_opt = item.get("user_option", "Selected Answer")
        c_opt = item.get("correct_option", "True Answer")
        mistakes.append({
            "question": q_text[:90] + ("..." if len(q_text) > 90 else ""),
            "why_wrong": f"You selected '{u_opt}', whereas the verified optimal answer is '{c_opt}'.",
            "cognitive_bias": "Heuristic shortcut, reactive emotional framing, or time pressure miscalculation."
        })

    if not mistakes:
        mistakes.append({
            "question": "Flawless Performance",
            "why_wrong": "Zero errors detected in this assessment session.",
            "cognitive_bias": "None; exceptional calibration and psychological composure."
        })

    return {
        "archetype_title": archetype,
        "core_summary": summary,
        "cognitive_edge": edge,
        "emotional_profile": eq_style,
        "growth_habits": growth_habits,
        "mistake_analyses": mistakes
    }


# =============================================================================
# LLM AI Engine (Groq -> Local Deterministic Fallback)
# =============================================================================
def parse_ai_json(raw_text: str) -> Optional[Dict[str, Any]]:
    """Cleans markdown fencing and extracts valid JSON dictionary."""
    clean = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", clean)
    if match:
        clean = match.group(1).strip()
    try:
        data = json.loads(clean)
        if "archetype_title" in data and "core_summary" in data and "growth_habits" in data:
            return data
    except Exception:
        pass
    return None


async def analyze_with_groq(submission: QuizSubmission) -> Optional[Dict[str, Any]]:
    if not GROQ_API_KEY:
        return None
    try:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""
Analyze this user's psychometric assessment across the 4 Dimensions of Intelligence:
Test Type Evaluated: {submission.test_type or "COMBINED"}
- IQ (Cognitive Intelligence): {submission.iq_score or "N/A"} (Breakdown: {submission.iq_breakdown})
- EQ (Emotional Quotient): {submission.eq_score or "N/A"} (Breakdown: {submission.eq_breakdown})
- SQ (Spiritual Quotient & Stoicism): {submission.sq_score or "N/A"} (Breakdown: {submission.sq_breakdown})
- AQ (Adaptability Quotient & Crisis Velocity): {submission.aq_score or "N/A"} (Breakdown: {submission.aq_breakdown})
Tab Switch Count: {submission.tab_switch_count}
Incorrect Questions Sample: {json.dumps(submission.incorrect_questions[:4])}

Output ONLY valid JSON with keys:
- archetype_title: string (compelling archetype title)
- core_summary: string (3-4 sentences synthesizing their unique strengths)
- cognitive_edge: string (their sharpest intellectual/tactical differentiator)
- emotional_profile: string (their emotional, spiritual, and adaptability demeanor)
- growth_habits: array of {{"habit": string, "frequency": string, "action": string}} (3 tailored habits inspired by the 4 intelligence principles)
- mistake_analyses: array of {{"question": string, "why_wrong": string, "cognitive_bias": string}}
"""
        for model_id in [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "mixtral-8x7b-32768",
            "openai/gpt-oss-20b",
            "qwen/qwen3.8-27b"
        ]:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": "You are a world-class psychometrics analyst and cognitive scientist. Respond with pure JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                content = completion.choices[0].message.content
                if content:
                    parsed = parse_ai_json(content)
                    if parsed:
                        return parsed
            except Exception:
                continue
    except Exception as e:
        print(f"[SmartIQ] Groq inference failed or bypassed: {e}")
    return None


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/")
def read_root():
    return {
        "platform": "Enigma",
        "status": "operational",
        "version": "1.1.0",
        "database": "PostgreSQL (Supabase)" if database._use_postgres else "SQLite (Local Fallback)",
        "ai_providers": {
            "groq_active": bool(GROQ_API_KEY),
            "deterministic_fallback": True
        }
    }


@app.get("/api/auth/me")
async def get_me(user: Dict[str, Any] = Depends(auth.get_current_user)):
    """Returns the authenticated user's profile and RBAC role."""
    return {"status": "success", "user": user}


@app.get("/api/questions")
def get_questions(
    type: Optional[str] = Query(None, description="Quiz module type: 'IQ', 'EQ', 'SQ', or 'AQ'"),
    limit: Optional[int] = Query(10, description="Number of questions to return")
):
    """
    Fetches randomized active questions for the test session.
    Pool queries PostgreSQL or SQLite fallback.
    """
    questions = database.get_active_questions(category_type=type, limit=limit, randomize=True)
    return {"status": "success", "count": len(questions), "data": questions}


@app.post("/api/analyze")
async def analyze_submission(submission: QuizSubmission):
    """
    Processes test scores, queries Groq -> Local Deterministic Engine,
    and records the session data into PostgreSQL / SQLite.
    """
    # 1. Attempt Groq
    result = await analyze_with_groq(submission)

    # 2. Fallback to local deterministic psychometric engine
    if not result:
        result = generate_deterministic_archetype(submission)

    # Save to database
    try:
        database.record_submission(
            session_id=submission.session_id,
            user_id=submission.user_id,
            iq_score=submission.iq_score,
            iq_breakdown=submission.iq_breakdown,
            eq_score=submission.eq_score,
            eq_breakdown=submission.eq_breakdown,
            sq_score=submission.sq_score,
            sq_breakdown=submission.sq_breakdown,
            aq_score=submission.aq_score,
            aq_breakdown=submission.aq_breakdown,
            test_type=submission.test_type,
            tab_switch_count=submission.tab_switch_count,
            archetype_title=result.get("archetype_title")
        )
    except Exception as e:
        print(f"[SmartIQ] Failed to record submission: {e}")

    return {
        "status": "success",
        "data": result
    }


# =============================================================================
# Direct Chatbot Endpoint (Powered by Groq LLM with Resilient Local Engine)
# =============================================================================
def generate_smart_chat_fallback(query: str, context: Optional[Dict[str, Any]] = None) -> str:
    """Local high-intellect fallback responses when Groq API key is absent or offline."""
    q = (query or "").lower()
    ctx = context or {}
    iq = ctx.get("iq_score")
    eq = ctx.get("eq_score")
    sq = ctx.get("sq_score")
    aq = ctx.get("aq_score")

    if any(k in q for k in ["aq", "adaptability", "disruption", "unlearn", "pivot", "crisis", "ai"]):
        return (
            "### Adaptability Quotient (AQ) • Peak 10/10 Impact\n\n"
            "**AQ is your velocity of cognitive adjustment under radical disruption.** While IQ calculates and EQ connects, AQ dictates whether you thrive when the rules of the game change.\n\n"
            "**Core Pillars of AQ:**\n"
            "- **The 'What If...?' Agility Habit:** Regularly run counter-factual simulations on your career or projects. Ask: *'If our primary tool/revenue was wiped out tomorrow, what is our pivot in 48 hours?'*\n"
            "- **Deliberate Unlearning:** Alvin Toffler famously noted: *'The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.'*\n"
            "- **Antifragile Posture (Nassim Taleb):** Don't just resist shock (robustness); design your workflows so volatility makes you smarter and more capable.\n\n"
            + (f"*Your current recorded AQ Score is **{aq}**.* " if aq else "")
            + "Try the **Crisis Simulator drill** in our Cognitive Gym to train your pivot instincts!"
        )

    if any(k in q for k in ["sq", "stoic", "spiritual", "meaning", "epictetus", "control", "amor fati", "frankl"]):
        return (
            "### Spiritual Quotient (SQ) & Stoic Intelligence • 8/10 Impact\n\n"
            "**SQ is not about dogma; it is the capacity for existential purpose, core values, and unshakeable inner wholeness.**\n\n"
            "**Foundational Stoic Principles for SQ:**\n"
            "- **The Dichotomy of Control (Epictetus):** Divide reality into what is within your volition (opinions, virtues, choices, craft) and what is not (reputation, economy, weather, others' actions). Suffer only for your own character.\n"
            "- **Amor Fati (Loving Fate):** Don't just endure adversity; actively embrace each event as fuel for virtue and self-realization.\n"
            "- **Viktor Frankl's Logotherapy:** *'Those who have a 'why' to live, can bear with almost any 'how'.'* Clarify your moral cardinal north star before entering external chaos.\n\n"
            + (f"*Your current recorded SQ Score is **{sq}**.* " if sq else "")
            + "Visit the **Stoic Sanctuary** in our Cognitive Gym to test yourself on the Dichotomy of Control Sorter!"
        )

    if any(k in q for k in ["eq", "empathy", "emotion", "feeling", "listen", "relationship", "conflict"]):
        return (
            "### Emotional Quotient (EQ) • 9.3/10 Impact\n\n"
            "**EQ is the neurobiological mastery of self-awareness, somatic regulation, and interpersonal resonance.** In high-stakes leadership, emotional composure consistently outperforms raw computational IQ.\n\n"
            "**High-Leverage EQ Protocols:**\n"
            "- **10-Minute Nightly Emotional Journal:** Note two moments where your autonomic nervous system spiked. What was the somatic sensation? What need was underneath?\n"
            "- **The Somatic Sigh (Physiological Regulation):** Two quick nasal inhales followed by a prolonged, unforced mouth exhale drops heart rate and halts amygdala hijacking within 40 seconds.\n"
            "- **Active Nonviolent Listening (NVC):** Before providing a counter-argument, reflect back the other person's core emotion: *'It sounds like you're feeling anxious about the delivery timeline.'*\n\n"
            + (f"*Your current recorded EQ Score is **{eq}**.* " if eq else "")
            + "Practice our **Empathy Lab scenarios** in the Cognitive Gym to refine your conflict responses!"
        )

    if any(k in q for k in ["iq", "logic", "math", "pattern", "spatial", "bayes", "chess", "sudoku", "puzzle"]):
        return (
            "### Intelligence Quotient (IQ) • 9/10 Impact\n\n"
            "**IQ represents raw computational deduction, pattern mechanics, working memory, and Bayesian probability processing.**\n\n"
            "**Scientific Ways to Train IQ:**\n"
            "- **Bayesian Updating:** Continually adjust your probability confidence as new facts arrive rather than maintaining binary dogmatic beliefs.\n"
            "- **Working Memory Sprints:** Engage with timed chess tactical puzzles, sudoku, and mental arithmetic to strengthen prefrontal cortex arborization.\n"
            "- **Feynman Technique:** Can you explain the abstract concept to a 10-year-old using simple sensory analogies? If not, you don't truly grasp it.\n\n"
            + (f"*Your current recorded IQ Score is **{iq}**.* " if iq else "")
            + "Try our **Rapid Deductive Math Duel** in the Cognitive Gym for a high-intensity 30-second focus sprint!"
        )

    if any(k in q for k in ["routine", "gym", "train", "improve", "daily", "exercise", "habit"]):
        return (
            "### The 4D Daily Cognitive Protocol\n\n"
            "Here is the daily 20-minute master routine derived from our psychometric research:\n\n"
            "1. **Morning (SQ • 5 mins):** Epictetus audit. Write down 3 looming tasks and label what is strictly within your control vs what is external.\n"
            "2. **Midday (IQ & AQ • 10 mins):** Run a 30-second logic sprint in our Cognitive Gym, followed by one 'What If...?' scenario regarding your current industry.\n"
            "3. **Night (EQ • 5 mins):** Nightly emotional reflection journal. Review interpersonal conversations and note where you maintained non-defensive empathy.\n\n"
            "Consistency compounds neuroplasticity. Which of the 4 quotients would you like to target first today?"
        )

    return (
        "### Enigma Cognitive Intelligence Assistant\n\n"
        "Welcome! I am your AI Intelligence Mentor powered by Groq, specialized in the **4 Dimensions of Human Capability**:\n\n"
        "- **IQ (Cognitive • 9/10):** Abstract reasoning, logic trees, Bayesian statistics & spatial manipulation.\n"
        "- **EQ (Emotional • 9.3/10):** Affective empathy, somatic self-regulation & nonviolent communication.\n"
        "- **SQ (Spiritual • 8/10):** Existential purpose, core values & Epictetus' Dichotomy of Control.\n"
        "- **AQ (Adaptability • 10/10):** Crisis velocity, AI paradigm assimilation & deliberate unlearning.\n\n"
        + (f"**Your Current Metrics:** IQ: {iq or '--'} • EQ: {eq or '--'} • SQ: {sq or '--'} • AQ: {aq or '--'}\n\n" if (iq or eq or sq or aq) else "")
        + "Ask me anything about improving a specific quotient, analyzing your scores, exploring Stoicism, or mastering crisis agility!"
    )


@app.post("/api/chat")
async def chat_with_intelligence_ai(request: ChatRequest):
    """
    Direct Groq chat endpoint for Intelligence & Cognition guidance.
    Provides expert insights on IQ, EQ, SQ, AQ, neuroplasticity, and mental training.
    """
    system_prompt = (
        "You are Enigma AI, an elite, articulate, and scientifically grounded cognitive mentor and intelligence scientist powered by Groq. "
        "You specialize in the 4 Dimensions of Human Intelligence:\n"
        "1. IQ (Cognitive Intelligence): Logic, deductive reasoning, mathematical patterns, spatial visualization, Bayesian thinking. (Impact: 9/10)\n"
        "2. EQ (Emotional Quotient): Self-awareness, somatic regulation, active listening, nonviolent communication, empathetic resonance. (Impact: 9.3/10)\n"
        "3. SQ (Spiritual Quotient & Stoicism): Finding existential meaning, inner wholeness, core moral values, and Epictetus' Dichotomy of Control (separating what is in your power from what is not, Amor Fati). (Impact: 8/10)\n"
        "4. AQ (Adaptability Quotient): Crisis velocity, psychological resilience, AI & tech disruption assimilation, rapid unlearning and relearning, OODA loops, and Nassim Taleb's Antifragile mindset. (Impact: 10/10 Peak)\n\n"
        "Instructions:\n"
        "- Deliver clear, inspiring, practical, and intellectually engaging answers.\n"
        "- Use markdown formatting (bolding key concepts, bullet lists) for readability.\n"
        "- If user context is provided with their scores or archetype, tailor your insights directly to their metrics.\n"
        "- If asked for exercises, provide concrete, actionable drills from the Cognitive Gym.\n"
        "- Keep answers punchy and focused (typically 2-4 structured paragraphs or concise bullet points)."
    )

    if request.user_context:
        ctx = request.user_context
        system_prompt += (
            f"\n\nActive User Profile Context:\n"
            f"- IQ Score: {ctx.get('iq_score', 'Not tested')}\n"
            f"- EQ Score: {ctx.get('eq_score', 'Not tested')}\n"
            f"- SQ Score: {ctx.get('sq_score', 'Not tested')}\n"
            f"- AQ Score: {ctx.get('aq_score', 'Not tested')}\n"
            f"- Current Archetype: {ctx.get('archetype_title', 'Exploring Dimensions')}"
        )

    # 1. Attempt Groq
    if GROQ_API_KEY:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)

            groq_messages = [{"role": "system", "content": system_prompt}]
            for m in request.messages[-8:]:
                groq_messages.append({"role": m.role, "content": m.content})

            models = [
                "llama-3.3-70b-versatile",
                "llama-3.1-8b-instant",
                "llama3-70b-8192",
                "mixtral-8x7b-32768"
            ]

            for model_id in models:
                try:
                    completion = client.chat.completions.create(
                        model=model_id,
                        messages=groq_messages,
                        max_tokens=800,
                        temperature=0.7
                    )
                    reply = completion.choices[0].message.content
                    if reply and reply.strip():
                        return {
                            "status": "success",
                            "response": reply.strip(),
                            "model": model_id,
                            "source": "groq"
                        }
                except Exception as inner_err:
                    print(f"[SmartIQ Chat] Model {model_id} error: {inner_err}")
                    continue
        except Exception as e:
            print(f"[SmartIQ Chat] Groq client failed: {e}")

    # 2. Resilient Intelligent Fallback (if Groq down or no key)
    user_query = request.messages[-1].content if request.messages else ""
    fallback_reply = generate_smart_chat_fallback(user_query, request.user_context)
    return {
        "status": "success",
        "response": fallback_reply,
        "model": "enigma-cognitive-engine",
        "source": "local-fallback"
    }


# =============================================================================
# Admin Endpoints (Protected via Supabase RBAC or X-Admin-Key)
# =============================================================================

@app.get("/api/admin/questions")
def get_admin_questions(admin: Dict[str, Any] = Depends(auth.require_admin)):
    """Returns the full master question pool for administrator management."""
    questions = database.get_all_questions_admin()
    return {"status": "success", "count": len(questions), "data": questions}


@app.post("/api/admin/questions")
def create_question(question: AdminQuestion, admin: Dict[str, Any] = Depends(auth.require_admin)):
    """Inserts a new question into the pool."""
    new_id = database.add_admin_question(
        category_type=question.category_type,
        sub_category=question.sub_category,
        question_text=question.question_text,
        options=question.options,
        correct_answer_index=question.correct_answer_index,
        explanation=question.explanation,
        diagram_svg=question.diagram_svg,
        points=question.points
    )
    return {"status": "success", "id": new_id, "message": "Question added successfully"}


@app.put("/api/admin/questions/{question_id}")
def update_question(
    question_id: int,
    question: AdminQuestion,
    admin: Dict[str, Any] = Depends(auth.require_admin)
):
    """Updates an existing question in the pool."""
    updated = database.update_admin_question(
        question_id=question_id,
        category_type=question.category_type,
        sub_category=question.sub_category,
        question_text=question.question_text,
        options=question.options,
        correct_answer_index=question.correct_answer_index,
        explanation=question.explanation,
        diagram_svg=question.diagram_svg,
        points=question.points
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "success", "message": "Question updated successfully"}


@app.delete("/api/admin/questions/{question_id}")
def delete_question(question_id: int, admin: Dict[str, Any] = Depends(auth.require_admin)):
    """Deletes a question from the pool."""
    deleted = database.delete_admin_question(question_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "success", "message": "Question deleted successfully"}


@app.get("/api/admin/stats")
def get_admin_stats(admin: Dict[str, Any] = Depends(auth.require_admin)):
    """Returns aggregated platform metrics, distributions, and tab switch frequencies."""
    stats = database.get_admin_stats()
    return {"status": "success", "data": stats}
