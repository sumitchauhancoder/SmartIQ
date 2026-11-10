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
        "https://smart-iq-sable.vercel.app/",
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
    image_url: Optional[str] = None
    is_spatial: Optional[bool] = False
    option_images: Optional[List[Optional[str]]] = None


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
    Empirical psychometric calculation engine grounded in standardized Gaussian norms (mu=100, sigma=15).
    Delivers honest, unvarnished scientific evaluations without subjective flattery or unfounded assumptions.
    """
    test_type = (submission.test_type or "COMBINED").upper()
    iq = submission.iq_score or 100
    eq = submission.eq_score or 100
    sq = submission.sq_score or 100
    aq = submission.aq_score or 100

    def calc_z(val: float) -> str:
        z = (val - 100) / 15.0
        return f"+{z:.2f}σ" if z >= 0 else f"{z:.2f}σ"

    # 1. SQ Independent Evaluation (Zohar-Marshall & Epictetian Stoic Norms)
    if test_type == "SQ":
        z_str = calc_z(sq)
        if sq >= 125:
            archetype = "Grounded & Purpose-Driven"
            summary = f"With a score of {sq} (Top 5% worldwide), you have outstanding inner calm and strong principles. You focus on what you can control and stay steady even when things around you are chaotic."
            edge = "Focusing on what you can control, staying true to your values, and making calm, thoughtful choices."
            eq_style = "Strong inner calm; not easily shaken by praise or criticism."
        elif sq >= 110:
            archetype = "Values-Focused Thinker"
            summary = f"With a score of {sq} (Top 25% worldwide), you are well above the global average of 100. You have clear personal values and a strong sense of purpose that helps you make sound choices."
            edge = "Clear personal values, self-awareness, and thoughtful decision-making."
            eq_style = "Calm under pressure with a steady sense of right and wrong."
        elif sq >= 90:
            archetype = "Balanced & Practical"
            summary = f"Your score of {sq} is right in the healthy world average range (World Average: 100). You have practical common sense. When unexpected stress hits, taking a short pause helps you stay calm and centered."
            edge = "Practical common sense and everyday reliability."
            eq_style = "Generally calm, but can feel stressed when outside conditions change suddenly."
        else:
            archetype = "Developing Inner Calm"
            summary = f"With a score of {sq}, there is great room to build inner calm. You may sometimes feel stressed by sudden changes. Simple daily reflection will help you feel much more grounded."
            edge = "Good intentions that will benefit from practicing daily mindfulness and calm."
            eq_style = "Can feel stressed or frustrated under long periods of pressure."

        growth_habits = [
            {
                "habit": "Epictetian Control Audit",
                "frequency": "Daily (Evening)",
                "action": "Write down 3 events from today. Explicitly partition them into 'Within My Will' vs 'Outside My Will' to reinforce internal sovereignty."
            },
            {
                "habit": "Premeditatio Malorum Practice",
                "frequency": "Weekly",
                "action": "Mentally rehearse a potential adversity without anxiety, training your psyche to respond with virtue rather than reactive panic."
            },
            {
                "habit": "Values-Action Alignment Review",
                "frequency": "Weekly (Sunday)",
                "action": "Audit your weekly calendar against cardinal virtues (Wisdom, Courage, Justice, Temperance) to identify moral friction."
            }
        ]

    # 2. AQ Independent Evaluation (Paul Stoltz CORE & Antifragility Models)
    elif test_type == "AQ":
        z_str = calc_z(aq)
        if aq >= 125:
            archetype = "Quick & Flexible Thinker"
            summary = f"With a score of {aq} (Top 5% worldwide), you adapt to changes with impressive speed and confidence. You bounce back from surprises easily and enjoy learning new ways of doing things."
            edge = "Quickly learning new skills, letting go of outdated methods, and staying flexible."
            eq_style = "Naturally flexible and resilient; turns unexpected changes into positive opportunities."
        elif aq >= 110:
            archetype = "Open-Minded & Adaptable"
            summary = f"With a score of {aq} (Top 25% worldwide), you are well above the global average of 100. You adjust smoothly to new tools and unexpected changes with an open mind."
            edge = "Easily adapting to new tools and workflows with an open mind."
            eq_style = "Comfortable with change, with minor hesitation when leaving familiar routines."
        elif aq >= 90:
            archetype = "Steady & Dependable"
            summary = f"Your score of {aq} is right in the healthy world average range (World Average: 100). You handle everyday updates comfortably. In sudden surprises, you prefer taking a steady, step-by-step approach."
            edge = "Reliable and steady once a clear plan is in place."
            eq_style = "Careful and steady; doing well when steps are clear and organized."
        else:
            archetype = "Structured & Routine-Focused"
            summary = f"With a score of {aq}, you prefer familiar routines and clear instructions. When sudden changes happen, you might feel a bit hesitant. Practicing small daily changes will build your flexibility."
            edge = "High fidelity to rigid, established workflows, but vulnerable to technological or market obsolescence."
            eq_style = "Paralysis and defensive resistance when forced to operate outside established routines."

        growth_habits = [
            {
                "habit": "Assumption Inversion Drill",
                "frequency": "Bi-Weekly",
                "action": "Identify one core workflow assumption and intentionally design a viable alternative assuming that rule is completely revoked."
            },
            {
                "habit": "Deliberate Novelty Immersion",
                "frequency": "Weekly",
                "action": "Engage with an unfamiliar software tool or intellectual domain for 30 minutes to exercise neuroplastic cognitive flexibility."
            },
            {
                "habit": "Rapid Lean Prototyping",
                "frequency": "Monthly",
                "action": "Test an emerging concept with a zero-cost 24-hour prototype rather than waiting for 100% data certainty."
            }
        ]

    # 3. IQ Independent Evaluation (Cattell-Horn-Carroll Gf & Gq Theory)
    elif test_type == "IQ":
        z_str = calc_z(iq)
        if iq >= 125:
            archetype = "Sharp Problem Solver"
            summary = f"With a score of {iq} (Top 5% worldwide), you solve tricky logic puzzles and spot number patterns with exceptional speed. You think clearly and reason through tough problems with ease."
            edge = "Spotting patterns quickly, solving math problems, and thinking through steps logically."
            eq_style = "Clear, logical, and focused on facts."
        elif iq >= 110:
            archetype = "Clear Logical Thinker"
            summary = f"With a score of {iq} (Top 25% worldwide), your logical thinking is well above the global average of 100. You are dependable at solving problems and analyzing facts clearly."
            edge = "Good with numbers, logical puzzles, and practical analysis."
            eq_style = "Organized, clear-headed, and practical."
        elif iq >= 90:
            archetype = "Practical Everyday Thinker"
            summary = f"Your score of {iq} is right in the healthy world average range (World Average: 100). You have solid, practical problem-solving skills for everyday tasks."
            edge = "Pragmatic, real-world reasoning and dependable standard execution."
            eq_style = "Direct and focused on tangible outcomes; vulnerable to heuristic cognitive shortcuts under strain."
        else:
            archetype = "Hands-On Practical Thinker"
            summary = f"With a score of {iq}, you learn best through hands-on practice rather than fast abstract puzzles. Doing a few fun math drills in our Cognitive Gym will sharpen your speed."
            edge = "Practical execution in familiar hands-on tasks with minimal theoretical convolution."
            eq_style = "Prefers concrete examples over abstract symbolic logic."

        growth_habits = [
            {
                "habit": "Working Memory Matrix Training",
                "frequency": "Daily (15 mins)",
                "action": "Train on combinatorial puzzles, dual n-back exercises, or chess endgames to expand working memory capacity."
            },
            {
                "habit": "First-Principles Deconstruction",
                "frequency": "Weekly",
                "action": "Break one complex problem down into its irreducible factual axioms before generating prospective solutions."
            },
            {
                "habit": "Bayesian Calibration Audit",
                "frequency": "Weekly",
                "action": "Assign numerical confidence percentages (e.g. 80%) to your weekly analytical forecasts and track accuracy against outcomes."
            }
        ]

    # 4. EQ Independent Evaluation (Mayer-Salovey-Caruso & Bar-On EQ-i)
    elif test_type == "EQ":
        z_str = calc_z(eq)
        if eq >= 125:
            archetype = "Empathetic Leader"
            summary = f"With a score of {eq} (Top 5% worldwide), you have outstanding emotional awareness. You listen deeply, understand how people feel, and naturally calm tense situations."
            edge = "Great at reading people, listening with care, and calming tense conversations."
            eq_style = "Warm, reassuring, and helps others feel comfortable and supported."
        elif eq >= 110:
            archetype = "Great Communicator"
            summary = f"With a score of {eq} (Top 25% worldwide), your emotional skills are well above the global average of 100. You communicate clearly, listen actively, and build trust easily."
            edge = "Attentive listening, resolving disagreements peacefully, and understanding others."
            eq_style = "Patient, friendly, and easy to work with across different teams."
        elif eq >= 90:
            archetype = "Warm & Relatable"
            summary = f"Your score of {eq} is right in the healthy world average range (World Average: 100). You get along well with others in daily life. Taking a calm pause during disagreements will keep conversations smooth."
            edge = "Good teamwork and everyday helpfulness in comfortable settings."
            eq_style = "Friendly and cooperative; can sometimes feel defensive when criticized, which improves with a quick pause."
        else:
            archetype = "Developing Social Confidence"
            summary = f"With a score of {eq}, you may sometimes feel defensive or stressed during tense conversations. Practicing active listening and calm breathing will help you feel much more confident."
            edge = "Direct communication, but requires active training in somatic regulation and perspective-taking."
            eq_style = "Prone to reactive defensiveness, guilt-tripping, or emotional stonewalling under pressure."

        growth_habits = [
            {
                "habit": "Somatic Reset Protocol",
                "frequency": "When Triggered",
                "action": "Execute 3 physiological sighs (double inhale, slow exhale) to disengage the sympathetic fight-or-flight response before speaking."
            },
            {
                "habit": "Active Empathetic Mirroring",
                "frequency": "Daily",
                "action": "In conflict, accurately reflect the other party's emotional state ('It sounds like you are feeling overwhelmed...') before offering logic."
            },
            {
                "habit": "Nightly Emotional Calibration",
                "frequency": "Daily (Night)",
                "action": "Journal for 10 minutes on today's social interactions, identifying triggers where ego defensiveness superseded empathy."
            }
        ]

    # 5. Holistic 4D Matrix Synthesis (Combined IQ, EQ, SQ, AQ)
    else:
        avg_score = (iq + eq + sq + aq) / 4.0
        z_str = calc_z(avg_score)

        if avg_score >= 120 and (sq >= 115 and aq >= 115):
            archetype = "Well-Rounded Thinker"
            summary = f"With an overall composite score of {avg_score:.1f} (Top 9% worldwide), you have a strong, well-balanced mind. You combine sharp thinking (IQ: {iq}), emotional warmth (EQ: {eq}), inner calm (SQ: {sq}), and quick adaptability (AQ: {aq})."
            edge = "Great balance across all areas: clear thinking, emotional warmth, inner calm, and quick learning."
            eq_style = "Calm, well-rounded, and adaptable in almost any situation."
        elif avg_score >= 110:
            archetype = "Balanced Problem Solver"
            summary = f"With an overall composite score of {avg_score:.1f} (Top 25% worldwide), you are comfortably above the global average of 100. You are dependable, clear-headed, and handle new situations with confidence."
            edge = "Disciplined structural deduction and constructive operational adaptability across varying conditions."
            eq_style = "Consistently composed with solid situational awareness and grounded ethical alignment."
        elif avg_score >= 90:
            archetype = "Balanced Everyday Thinker"
            summary = f"Your overall score of {avg_score:.1f} is right in the healthy world average range (World Average: 100). You have reliable everyday abilities across thinking, relating to others, and adapting to change. Daily drills in our Cognitive Gym will help you level up even further."
            edge = "Dependable common-sense problem solving and steady execution within established, predictable domains."
            eq_style = "Functionally steady in standard conditions; prone to cognitive fatigue, defensive reactivity, or pivot latency under severe volatility."
        else:
            archetype = "Curious Explorer"
            summary = f"With an overall score of {avg_score:.1f}, you have plenty of room to grow. Practice makes all the difference! Try a few speed drills in the Cognitive Gym to build your speed, confidence, and mental reflexes."
            edge = "Practical hands-on execution that requires systematic cognitive and emotional fortification."
            eq_style = "Elevated reactivity and stress vulnerability when operational or interpersonal demands escalate."

        growth_habits = [
            {
                "habit": "4D Cognitive Audit",
                "frequency": "Weekly",
                "action": "Evaluate your week across 4 metrics: Logic accuracy (IQ), Empathic regulation (EQ), Stoic control (SQ), and Pivot velocity (AQ)."
            },
            {
                "habit": "Cognitive Gym Sprint Drill",
                "frequency": "3x Weekly",
                "action": "Complete the 10-question shuffled sprint in the Gym to build neuroplastic processing speed and working memory."
            },
            {
                "habit": "Stoic Crisis Simulation",
                "frequency": "Bi-Weekly",
                "action": "Simulate a severe potential disruption: plan your tactical pivot (AQ) while anchoring your inner peace (SQ)."
            }
        ]

    mistakes = []
    for item in submission.incorrect_questions:
        q_text = item.get("question_text", "Assessment Item")
        u_opt = item.get("user_option", "Selected Answer")
        c_opt = item.get("correct_option", "True Answer")
        mistakes.append({
            "question": q_text[:90] + ("..." if len(q_text) > 90 else ""),
            "why_wrong": f"You selected '{u_opt}', whereas empirical psychometric standards verify '{c_opt}' as the optimal solution.",
            "cognitive_bias": "Heuristic availability shortcut, premature conclusion under time constraint, or emotional framing bias."
        })

    if not mistakes:
        mistakes.append({
            "question": "Zero Errors Detected",
            "why_wrong": "All 10 items resolved with verified psychometric accuracy.",
            "cognitive_bias": "None; exceptional calibration and psychological composure under time constraint."
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
You are a helpful and honest cognitive mentor analyzing the user's test scores across IQ, EQ, SQ, and AQ.

POPULATION BENCHMARKS:
- World Average: 100 (Most people score between 90 and 110)
- Scores 110-119: Above Average (Solid, noticeable strength)
- Scores 120-129: High Ability (Top 10% in the world)
- Scores 130+: Exceptional (Top 2% in the world)
- Scores 80-89: A bit below average (Room to improve with practice)
- Scores under 80: Needs practice in the Cognitive Gym

USER ASSESSMENT RESULTS:
- Test Evaluated: {submission.test_type or "COMBINED"}
- IQ (Thinking & Logic): {submission.iq_score or "N/A"}
- EQ (Emotional Awareness & Composure): {submission.eq_score or "N/A"}
- SQ (Inner Calm & Principles): {submission.sq_score or "N/A"}
- AQ (Adaptability & Learning from Change): {submission.aq_score or "N/A"}
- Tab Switch Count: {submission.tab_switch_count}
- Questions Missed: {json.dumps(submission.incorrect_questions[:4])}

WRITING STYLE GUIDELINES (VERY IMPORTANT):
1. USE SIMPLE, CLEAN, EVERYDAY ENGLISH.
2. DO NOT use complicated, intimidating academic or medical words (strictly avoid terms like 'neuroplastic', 'somatic', 'heuristic', 'dichotomy', 'psychometric', 'inertia', 'upheavals', 'unvarnished', 'paradigm').
3. Be HONEST, CLEAR, and ENCOURAGING. Compare their score simply to the average score of 100.
4. If a score is average (90-110), say in plain words that it is healthy and normal, and give 1 or 2 practical tips to improve.
5. Keep explanations warm, conversational, and direct.

Output ONLY valid JSON matching this schema:
- archetype_title: string (Friendly, inspiring title, e.g. "Practical Problem Solver", "Calm & Thoughtful Thinker", "Quick Learner & Explorer", "Steady Leader")
- core_summary: string (3 friendly, clear sentences explaining what their score means compared to the average of 100)
- cognitive_edge: string (Their key mental strengths in plain, everyday English)
- emotional_profile: string (How they handle stress, change, and people in simple words)
- growth_habits: array of {{"habit": string, "frequency": string, "action": string}} (3 simple daily habits anyone can easily follow)
- mistake_analyses: array of {{"question": string, "why_wrong": string, "cognitive_bias": string}}
"""
        for model_id in [
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "mixtral-8x7b-32768"
        ]:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": "You are a professional psychometrician and cognitive psychologist. Analyze the following 4D intelligence profile consisting of IQ (Cognitive), EQ (Emotional), SQ (Spiritual/Values), and AQ (Adaptability/Resilience). Provide a warm, constructive, and highly personalized assessment that highlights key strengths, identifies areas for growth, and suggests practical, actionable daily habits for holistic personal development. Respond with pure JSON only."},
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


# API Endpoints
# =============================================================================

@app.api_route("/", methods=["GET", "HEAD"])
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

    if any(k in q for k in ["aq", "adaptability", "change", "pivot", "unlearn", "crisis"]):
        return (
            "**Adaptability (AQ)** is your ability to bounce back and stay flexible when unexpected changes happen.\n\n"
            "• **Quick tip:** When plans change suddenly, pause for 10 seconds and ask: *'What is one practical step I can take right now?'*\n"
            "• **Practice:** Try the **Crisis Simulator** in our Cognitive Gym to train your quick-thinking instincts!"
            + (f" *(Your AQ score: {aq})*" if aq else "")
        )

    if any(k in q for k in ["sq", "spiritual", "stoic", "meaning", "values", "calm", "peace"]):
        return (
            "**Spiritual Quotient (SQ)** is about staying calm, grounded, and focused on what you can actually control.\n\n"
            "• **Quick tip:** Whenever something stresses you out, ask: *'Is this within my control?'* If not, let it go and focus on your own actions.\n"
            "• **Practice:** Visit the **Stoic Sanctuary** in our Cognitive Gym for quick daily grounding!"
            + (f" *(Your SQ score: {sq})*" if sq else "")
        )

    if any(k in q for k in ["eq", "emotion", "empathy", "feeling", "listen", "stress", "relationship"]):
        return (
            "**Emotional Quotient (EQ)** helps you handle pressure, stay calm, and communicate with empathy.\n\n"
            "• **Quick tip:** Take two slow, deep breaths before reacting to any tense conversation. It calms your heart rate in seconds.\n"
            "• **Practice:** Try our **Empathy Lab** in the Cognitive Gym to practice real-life scenario responses!"
            + (f" *(Your EQ score: {eq})*" if eq else "")
        )

    if any(k in q for k in ["iq", "logic", "math", "pattern", "puzzle", "brain", "think"]):
        return (
            "**Cognitive Intelligence (IQ)** is your skill at solving problems, spotting patterns, and thinking clearly.\n\n"
            "• **Quick tip:** Spend 5 minutes daily on logic puzzles, chess tactics, or mental math to build sharp mental habits.\n"
            "• **Practice:** Play our **Rapid Deductive Math Duel** in the Cognitive Gym for a quick 30-second sprint!"
            + (f" *(Your IQ score: {iq})*" if iq else "")
        )

    if any(k in q for k in ["routine", "gym", "habit", "daily", "improve"]):
        return (
            "Here is a simple **5-minute daily mental habit**:\n\n"
            "1. **Morning (1 min - SQ):** Name 1 thing you can control today and let go of what you can't.\n"
            "2. **Midday (3 mins - IQ & AQ):** Do a quick puzzle or try one new way to solve a task.\n"
            "3. **Evening (1 min - EQ):** Take 3 slow breaths and reflect on one positive interaction."
        )

    return (
        "Hi! I'm here to give you quick, direct tips to build your mind:\n\n"
        "• **IQ**: Smart problem solving\n"
        "• **EQ**: Handling stress & staying patient\n"
        "• **SQ**: Inner calm & core values\n"
        "• **AQ**: Adapting to change fast\n\n"
        "What specific question or skill would you like help with today?"
    )


@app.post("/api/chat")
async def chat_with_intelligence_ai(request: ChatRequest):
    """
    Direct Groq chat endpoint for Intelligence & Cognition guidance.
    Provides expert insights on IQ, EQ, SQ, AQ, neuroplasticity, and mental training.
    """
    system_prompt = (
        "You are Enigma AI, a friendly, concise, and helpful intelligence coach powered by Groq.\n\n"
        "STRICT GUIDELINES FOR YOUR ANSWERS:\n"
        "1. BE BRIEF AND DIRECT: Answer the user's specific question directly. Keep answers to 2-4 short sentences or 2-3 quick bullet points maximum. Never write long essays or rambling preambles.\n"
        "2. SIMPLE, EVERYDAY ENGLISH: Talk like a helpful, supportive friend. Never use academic, psychological, or medical jargon (no words like 'somatic', 'OODA loop', 'Bayesian', 'antifragile', 'neurobiological', 'volition').\n"
        "3. HIGHLY ACTIONABLE: Provide 1 simple, practical step the user can immediately try.\n"
        "4. SCORE CONTEXT: If the user asks about their score, acknowledge it warmly with a simple, encouraging tip.\n"
        "5. NO FILLER: Get straight to the point without introductory fluff like 'Certainly!' or 'In conclusion'."
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
                "qwen/qwen3.8-27b",
                "openai/gpt-oss-120b",
                "openai/gpt-oss-20b",
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
                        max_tokens=250,
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
        points=question.points,
        image_url=question.image_url,
        is_spatial=question.is_spatial,
        option_images=question.option_images
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
        points=question.points,
        image_url=question.image_url,
        is_spatial=question.is_spatial,
        option_images=question.option_images
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

@app.post("/api/admin/questions/reset-seed")
def reset_questions_to_seed(admin: Dict[str, Any] = Depends(auth.require_admin)):
    """Wipes legacy questions and synchronizes the question pool to the approved 80 project questions."""
    database.reset_pool_to_seed()
    return {"status": "success", "message": "Question pool synchronized to 80 project questions successfully"}
