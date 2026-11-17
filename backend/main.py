"""
SmartIQ Backend API
FastAPI service managing psychometric tests, anti-cheat audit logs,
AI Mind Archetype generation (Groq AI / Deterministic fallback),
Supabase PostgreSQL persistence, Supabase Auth validation, and Admin CRUD operations with RBAC.
"""

import os
import json
import re
import asyncio
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


class AssessmentAnswerItem(BaseModel):
    question_id: str
    answer: Optional[Any] = None  # string choice (IQ), integer 1-5 (Likert), or None


class AssessmentSubmissionRequest(BaseModel):
    responses: List[AssessmentAnswerItem]
    user_id: Optional[str] = None



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
def normalize_score_pct(val: Optional[int]) -> int:
    if val is None:
        return 50
    if val <= 100:
        return max(0, min(100, int(val)))
    return max(0, min(100, int(round(((val - 85) / 60.0) * 100))))


def generate_deterministic_archetype(submission: QuizSubmission) -> Dict[str, Any]:
    """
    Standardized 4-tier psychometric engine (0-39% Developing, 40-64% Balanced, 65-84% Proficient, 85-100% Exceptional).
    Delivers clear, encouraging, and actionable evaluations on the 0-100% percentage scale.
    """
    test_type = (submission.test_type or "COMBINED").upper()
    iq = normalize_score_pct(submission.iq_score)
    eq = normalize_score_pct(submission.eq_score)
    sq = normalize_score_pct(submission.sq_score)
    aq = normalize_score_pct(submission.aq_score)

    # 1. SQ Independent Evaluation (Stoic Equanimity & Meaning)
    if test_type == "SQ":
        if sq >= 85:
            archetype = "Grounded Stoic Sage"
            summary = f"With an exceptional score of {sq}%, you exhibit deep existential grounding and unshakeable inner calm. You naturally focus on what is within your control."
            edge = "Mastery of the dichotomy of control, purposeful action, and unwavering moral grounding."
            eq_style = "Profound composure; steady and centered under external volatility."
        elif sq >= 65:
            archetype = "Values-Focused Thinker"
            summary = f"With a proficient score of {sq}%, you operate comfortably above the balanced baseline. You hold clear personal values and make sound, purposeful decisions."
            edge = "Clear personal values, mindful self-awareness, and thoughtful ethical calibration."
            eq_style = "Calm under pressure with a strong, dependable moral compass."
        elif sq >= 40:
            archetype = "Balanced & Practical"
            summary = f"Your score of {sq}% places you in the Balanced tier (Baseline: 60%). You maintain reliable everyday perspective and pragmatic composure."
            edge = "Practical common sense and steady day-to-day equanimity."
            eq_style = "Generally calm; benefits from short pauses during unexpected disruptions."
        else:
            archetype = "Developing Inner Calm"
            summary = f"With a score of {sq}%, there is great opportunity to cultivate inner calm and resilience through daily reflection and Stoic workouts in the Cognitive Gym."
            edge = "Good intentions that will rapidly expand with regular mindfulness and values alignment."
            eq_style = "Can feel elevated stress under prolonged pressure."

        growth_habits = [
            {
                "habit": "Epictetian Control Audit",
                "frequency": "Daily (Evening)",
                "action": "Write down 3 events from today. Explicitly partition them into 'Within My Control' vs 'Outside My Control' to reinforce inner serenity."
            },
            {
                "habit": "Premeditatio Malorum Practice",
                "frequency": "Weekly",
                "action": "Mentally rehearse a potential adversity with calm detachment, training yourself to respond with virtue rather than reactive panic."
            },
            {
                "habit": "Values-Action Alignment Review",
                "frequency": "Weekly",
                "action": "Audit your weekly calendar against cardinal virtues (Wisdom, Courage, Justice, Temperance) to resolve friction."
            }
        ]

    # 2. AQ Independent Evaluation (Adaptability Quotient)
    elif test_type == "AQ":
        if aq >= 85:
            archetype = "Agile Paradigm Disruptor"
            summary = f"With an exceptional score of {aq}%, you adapt to volatility with impressive speed. You embrace new tools, pivot effortlessly, and learn continuously."
            edge = "Rapid unlearning, high crisis velocity, and proactive agility."
            eq_style = "Flexible and antifragile; turns unexpected disruptions into creative opportunities."
        elif aq >= 65:
            archetype = "Open-Minded & Adaptable"
            summary = f"With a proficient score of {aq}%, you adjust smoothly to new environments and unexpected changes with an open mind."
            edge = "Fast assimilation of modern tools, resilient problem-solving, and constructive pivoting."
            eq_style = "Comfortable with change, showing quick recovery after sudden shifts."
        elif aq >= 40:
            archetype = "Steady & Dependable"
            summary = f"Your score of {aq}% is in the Balanced tier (Baseline: 60%). You manage routine transitions well and benefit from structured step-by-step changes."
            edge = "Reliable execution once a clear roadmap is established."
            eq_style = "Careful and methodical; thrives best when objectives are well-defined."
        else:
            archetype = "Structured Routine Thinker"
            summary = f"With a score of {aq}%, you prefer familiar routines and clear procedures. Daily micro-disruptions in the Cognitive Gym will strengthen your flexibility."
            edge = "High fidelity to established protocols with significant opportunity to build agile instincts."
            eq_style = "Prefers predictable environments; benefits from proactive scenario rehearsals."

        growth_habits = [
            {
                "habit": "Assumption Inversion Drill",
                "frequency": "Bi-Weekly",
                "action": "Identify one habitual workflow assumption and intentionally design an alternative assuming that tool is revoked."
            },
            {
                "habit": "Deliberate Novelty Immersion",
                "frequency": "Weekly",
                "action": "Engage with an unfamiliar software tool or skill for 20 minutes to exercise neuroplastic cognitive flexibility."
            },
            {
                "habit": "Rapid Lean Prototyping",
                "frequency": "Monthly",
                "action": "Test an emerging concept with a lightweight 24-hour prototype rather than waiting for 100% certainty."
            }
        ]

    # 3. IQ Independent Evaluation (Cognitive Intelligence)
    elif test_type == "IQ":
        if iq >= 85:
            archetype = "Exceptional Analytical Strategist"
            summary = f"With an exceptional score of {iq}%, you solve complex logic puzzles and abstract patterns with outstanding speed and precision."
            edge = "Rapid pattern deduction, algorithmic decomposition, and high abstract problem solving."
            eq_style = "Objective, fact-driven, and razor-sharp under time pressure."
        elif iq >= 65:
            archetype = "Clear Logical Thinker"
            summary = f"With a proficient score of {iq}%, your logical deduction is dependable and robust, placing you comfortably above the balanced baseline."
            edge = "Strong mathematical and spatial deduction, structured reasoning, and practical logic."
            eq_style = "Organized, clear-headed, and systematic."
        elif iq >= 40:
            archetype = "Practical Problem Solver"
            summary = f"Your score of {iq}% falls in the Balanced tier (Baseline: 60%). You possess solid, practical everyday deduction for standard problem solving."
            edge = "Pragmatic, real-world reasoning and dependable standard execution."
            eq_style = "Direct and focused on tangible outcomes."
        else:
            archetype = "Hands-On Practical Learner"
            summary = f"With a score of {iq}%, you learn best through hands-on practice. Regular speed logic sprints in the Cognitive Gym will sharpen your speed and mental reflexes."
            edge = "Practical execution in familiar hands-on tasks."
            eq_style = "Prefers concrete examples over abstract theoretical logic."

        growth_habits = [
            {
                "habit": "Working Memory Puzzle Training",
                "frequency": "Daily (15 mins)",
                "action": "Train on combinatorial puzzles, mental arithmetic sprints, or chess tactics to expand working memory."
            },
            {
                "habit": "First-Principles Deconstruction",
                "frequency": "Weekly",
                "action": "Break complex dilemmas down into irreducible factual axioms before proposing solutions."
            },
            {
                "habit": "Hypothesis Falsification Drill",
                "frequency": "Weekly",
                "action": "Actively formulate one test that could disprove your primary working hypothesis."
            }
        ]

    # 4. EQ Independent Evaluation (Emotional Quotient)
    elif test_type == "EQ":
        if eq >= 85:
            archetype = "Empathetic Leader"
            summary = f"With an exceptional score of {eq}%, you possess acute emotional perception, somatic self-regulation, and natural interpersonal resonance."
            edge = "Deep empathetic listening, de-escalation of friction, and high social attunement."
            eq_style = "Warm, reassuring, and fosters psychological safety effortlessly."
        elif eq >= 65:
            archetype = "Skillful Communicator"
            summary = f"With a proficient score of {eq}%, your emotional attunement is strong and dependable, helping you communicate and collaborate smoothly."
            edge = "Attentive listening, constructive conflict resolution, and solid emotional regulation."
            eq_style = "Patient, collaborative, and easy to connect with across diverse teams."
        elif eq >= 40:
            archetype = "Warm & Relatable"
            summary = f"Your score of {eq}% is in the Balanced tier (Baseline: 60%). You cooperate well in daily settings and maintain healthy relationships."
            edge = "Good teamwork, approachable communication, and everyday empathy."
            eq_style = "Friendly and cooperative; taking a quick pause during friction keeps dialogues positive."
        else:
            archetype = "Developing Social Resonance"
            summary = f"With a score of {eq}%, tense dialogues can sometimes feel stressful. Practicing active listening and calm breathing will rapidly build your confidence."
            edge = "Direct communication with high leverage to grow through perspective-taking."
            eq_style = "Benefits from emotional pauses and somatic regulation under pressure."

        growth_habits = [
            {
                "habit": "Somatic Reset Protocol",
                "frequency": "When Triggered",
                "action": "Execute 2 physiological sighs (double nasal inhale, slow mouth exhale) to disengage fight-or-flight before speaking."
            },
            {
                "habit": "Active Empathetic Mirroring",
                "frequency": "Daily",
                "action": "In disagreement, accurately reflect the other person's emotional state before offering logical solutions."
            },
            {
                "habit": "Nightly Emotional Calibration",
                "frequency": "Daily (Night)",
                "action": "Journal for 5 minutes on today's social interactions, identifying triggers where defensiveness superseded empathy."
            }
        ]

    # 5. Holistic 4D Matrix Synthesis (Combined IQ, EQ, SQ, AQ)
    else:
        scores_dict = {"IQ": iq, "EQ": eq, "SQ": sq, "AQ": aq}
        avg_score = round(sum(scores_dict.values()) / 4.0, 1)
        spread = max(scores_dict.values()) - min(scores_dict.values())
        balance_type = "Well-Rounded Generalist" if spread <= 20 else "Spiky Specialist"
        sorted_cats = sorted(scores_dict.keys(), key=lambda k: scores_dict[k], reverse=True)
        top1, top2 = sorted_cats[0], sorted_cats[1]
        pair = frozenset([top1, top2])
        archetype_matrix = {
            frozenset(["IQ", "AQ"]): "The Resilient Strategist",
            frozenset(["IQ", "EQ"]): "The Empathetic Analyst",
            frozenset(["IQ", "SQ"]): "The Tactical Communicator",
            frozenset(["EQ", "SQ"]): "The People Catalyst",
            frozenset(["EQ", "AQ"]): "The Grounded Anchor",
            frozenset(["SQ", "AQ"]): "The Crisis Leader",
        }
        if spread <= 12:
            archetype = "The Holistic Integrator"
        else:
            archetype = archetype_matrix.get(pair, "The Holistic Integrator")

        tier_name = "Exceptional" if avg_score >= 85 else "Proficient" if avg_score >= 65 else "Balanced" if avg_score >= 40 else "Developing"

        summary = (
            f"Demonstrating a {balance_type.lower()} cognitive architecture, you achieved an overall composite score of {avg_score}% ({tier_name}). "
            f"Your leading dimension is {top1} ({scores_dict[top1]}%), while targeted development in {sorted_cats[-1]} ({scores_dict[sorted_cats[-1]]}%) "
            f"offers your highest leverage for expansion."
        )
        edge = f"Dominant Strength: {top1} ({scores_dict[top1]}%) • Balance: {balance_type} (Spread: {spread}%)"
        eq_style = f"Primary Growth Catalyst: {sorted_cats[-1]} ({scores_dict[sorted_cats[-1]]}%) • Evaluation Tier: {tier_name}"

        growth_habits = [
            {
                "habit": "4D Cognitive Audit",
                "frequency": "Weekly",
                "action": f"Track weekly progress across IQ ({iq}%), EQ ({eq}%), SQ ({sq}%), and AQ ({aq}%)."
            },
            {
                "habit": "Cognitive Gym Sprint Drill",
                "frequency": "3x Weekly",
                "action": "Complete a 10-question sprint drill in the Gym to build processing speed and working memory."
            },
            {
                "habit": "Crisis & Agility Simulation",
                "frequency": "Bi-Weekly",
                "action": "Simulate an unexpected disruption: plan your tactical pivot (AQ) while anchoring your inner peace (SQ)."
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

STANDARDIZED PERFORMANCE TIERS (0–100% SCALE):
- 85–100%: Exceptional (Rare speed, deep synthesis, fluid execution)
- 65–84%: Proficient (Strong, dependable capability across complex tasks)
- 40–64%: Balanced (Solid everyday baseline, balanced benchmark around 60%)
- 0–39%: Developing (Foundational development area; responsive to training)

USER ASSESSMENT RESULTS:
- Test Evaluated: {submission.test_type or "COMBINED"}
- IQ (Thinking & Logic): {normalize_score_pct(submission.iq_score)}%
- EQ (Emotional Awareness & Composure): {normalize_score_pct(submission.eq_score)}%
- SQ (Inner Calm & Principles): {normalize_score_pct(submission.sq_score)}%
- AQ (Adaptability & Learning from Change): {normalize_score_pct(submission.aq_score)}%
- Tab Switch Count: {submission.tab_switch_count}
- Questions Missed: {json.dumps(submission.incorrect_questions[:4])}

ARCHETYPE TITLES:
- For 4D Combined assessment, assign an archetype based on top strengths: 'The Resilient Strategist' (IQ+AQ), 'The Empathetic Analyst' (IQ+EQ), 'The Tactical Communicator' (IQ+SQ), 'The People Catalyst' (EQ+SQ), 'The Grounded Anchor' (EQ+AQ), 'The Crisis Leader' (SQ+AQ), or 'The Holistic Integrator' (if spread <= 12%).
- For single quotient, choose an inspiring title matching their tier.

WRITING STYLE GUIDELINES (VERY IMPORTANT):
1. USE SIMPLE, CLEAN, EVERYDAY ENGLISH.
2. DO NOT use complicated, intimidating academic or medical words (strictly avoid terms like 'neuroplastic', 'somatic', 'heuristic', 'dichotomy', 'psychometric', 'inertia', 'upheavals', 'unvarnished', 'paradigm').
3. Be HONEST, CLEAR, and ENCOURAGING. Reference their performance tier (Developing, Balanced, Proficient, Exceptional) and compare gently to the balanced benchmark of 60%.
4. Keep explanations warm, conversational, and direct.

Output ONLY valid JSON matching this schema:
- archetype_title: string (e.g. "The Empathetic Analyst", "The Resilient Strategist", "Clear Logical Thinker")
- core_summary: string (2-3 friendly, clear sentences explaining what their score and tier mean)
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
# 80-Question Multidimensional Assessment Pipeline (IQ, EQ, SQ, AQ)
# =============================================================================

def calculate_assessment_tier(score: float) -> str:
    """Standardized tier mapping: 0-39 Developing, 40-64 Balanced, 65-84 Proficient, 85-100 Exceptional."""
    if score < 40:
        return "Developing"
    elif score < 65:
        return "Balanced"
    elif score < 85:
        return "Proficient"
    else:
        return "Exceptional"


def generate_deterministic_assessment_report(
    raw_scores: Dict[str, float],
    composite_score: float,
    tier: str,
    balance_type: str,
    spread: float,
    top_strength: str,
    growth_area: str
) -> Dict[str, Any]:
    """100% deterministic psychometric evaluation fallback conforming strictly to required JSON schema."""
    sorted_cats = sorted(raw_scores.keys(), key=lambda k: raw_scores[k], reverse=True)
    pair = frozenset([sorted_cats[0], sorted_cats[1]]) if len(sorted_cats) >= 2 else frozenset(["IQ", "AQ"])
    archetype_matrix = {
        frozenset(["IQ", "AQ"]): "The Resilient Strategist",
        frozenset(["IQ", "EQ"]): "The Empathetic Analyst",
        frozenset(["IQ", "SQ"]): "The Tactical Communicator",
        frozenset(["EQ", "SQ"]): "The People Catalyst",
        frozenset(["EQ", "AQ"]): "The Grounded Anchor",
        frozenset(["SQ", "AQ"]): "The Crisis Leader",
    }
    if spread <= 12:
        archetype_title = "The Holistic Integrator"
    else:
        archetype_title = archetype_matrix.get(pair, "The Holistic Integrator")

    overall_summary = (
        f"Demonstrating a {balance_type.lower()} cognitive profile, you achieved an overall composite score of {composite_score}% ({tier}). "
        f"Your highest operational dimension is {top_strength} ({raw_scores[top_strength]}%), evidencing natural command in this area, "
        f"while targeted expansion in {growth_area} ({raw_scores[growth_area]}%) offers your greatest developmental leverage."
    )

    category_insights = {
        "IQ": f"Scoring {raw_scores['IQ']}% places your cognitive and logical problem solving in the {calculate_assessment_tier(raw_scores['IQ'])} tier, indicating structured deductive precision.",
        "EQ": f"At {raw_scores['EQ']}%, your interpersonal resonance and emotional regulation fall in the {calculate_assessment_tier(raw_scores['EQ'])} tier, showing solid affective awareness.",
        "SQ": f"With {raw_scores['SQ']}%, your purpose alignment and stoic equanimity rank as {calculate_assessment_tier(raw_scores['SQ'])}, reflecting grounded perspective under pressure.",
        "AQ": f"Attaining {raw_scores['AQ']}% reflects a {calculate_assessment_tier(raw_scores['AQ'])} adaptability quotient, determining your speed and flexibility when facing unexpected shifts."
    }

    advice_bank = {
        "IQ": [
            "Deconstruct complex multi-variable problems into first-principles logic trees before jumping to conclusions.",
            "Practice rapid spatial and numerical pattern recognition drills to sharpen algorithmic mental models.",
            "Challenge cognitive biases by actively formulating falsification tests for your primary hypotheses."
        ],
        "EQ": [
            "Integrate a 5-second emotional appraisal pause before responding during high-stakes conversational friction.",
            "Practice affective perspective-taking by articulating a peer's counter-argument with genuine empathy.",
            "Conduct weekly social audit reflections to monitor non-verbal cues and micro-expressions in team dynamics."
        ],
        "SQ": [
            "Adopt the Stoic Dichotomy of Control daily, delineating strictly between what is within your influence and what is not.",
            "Dedicate 10 minutes each morning to deliberate solitude and ethical priority calibration.",
            "Anchor daily actions to an overarching purpose statement to resist transient dopamine distractions."
        ],
        "AQ": [
            "Deliberately introduce micro-disruptions into habitual routines to reinforce neural plasticity.",
            "Conduct pre-mortem analyses on plans to cultivate proactive scenario pivoting and contingency readiness.",
            "Practice fast unlearning by adopting contrary methodologies when standard frameworks face friction."
        ]
    }
    actionable_advice = advice_bank.get(growth_area, advice_bank["AQ"])

    return {
        "archetypeTitle": archetype_title,
        "overallSummary": overall_summary,
        "categoryInsights": category_insights,
        "actionableAdvice": actionable_advice
    }


async def generate_assessment_ai_analysis(
    raw_scores: Dict[str, float],
    composite_score: float,
    tier: str,
    balance_type: str,
    spread: float,
    top_strength: str,
    growth_area: str
) -> tuple[Dict[str, Any], bool]:
    """
    Invokes Groq LLM (llama-3.3-70b-versatile) with strict 6.0s timeout and JSON schema validation.
    Falls back gracefully to deterministic engine if rate limited, timed out, or unavailable.
    """
    if not GROQ_API_KEY:
        return (generate_deterministic_assessment_report(raw_scores, composite_score, tier, balance_type, spread, top_strength, growth_area), True)

    prompt = f"""You are an elite psychometric intelligence analyst. Analyze this assessment profile:
Composite Score: {composite_score}%
Overall Tier: {tier}
Balance Type: {balance_type} (Spread: {spread}%)
Top Strength: {top_strength} ({raw_scores[top_strength]}%)
Primary Growth Area: {growth_area} ({raw_scores[growth_area]}%)
Detailed Scores:
- IQ (Cognitive): {raw_scores['IQ']}% ({calculate_assessment_tier(raw_scores['IQ'])})
- EQ (Emotional): {raw_scores['EQ']}% ({calculate_assessment_tier(raw_scores['EQ'])})
- SQ (Stoic/Spiritual): {raw_scores['SQ']}% ({calculate_assessment_tier(raw_scores['SQ'])})
- AQ (Adaptability): {raw_scores['AQ']}% ({calculate_assessment_tier(raw_scores['AQ'])})

ARCHETYPE MATRIX (Assign archetypeTitle using top 2 strengths, or 'The Holistic Integrator' if Spread <= 12%):
- IQ + AQ: "The Resilient Strategist"
- IQ + EQ: "The Empathetic Analyst"
- IQ + SQ: "The Tactical Communicator"
- EQ + SQ: "The People Catalyst"
- EQ + AQ: "The Grounded Anchor"
- SQ + AQ: "The Crisis Leader"
- If Spread <= 12%: "The Holistic Integrator"

Return ONLY valid JSON matching this exact schema:
{{
  "archetypeTitle": "Archetype title matching the matrix above",
  "overallSummary": "2-3 sentences synthesizing profile, balance type, and cognitive dynamics",
  "categoryInsights": {{
    "IQ": "1-2 sentence specific insight referencing score and tier",
    "EQ": "1-2 sentence specific insight referencing score and tier",
    "SQ": "1-2 sentence specific insight referencing score and tier",
    "AQ": "1-2 sentence specific insight referencing score and tier"
  }},
  "actionableAdvice": [
    "High-leverage developmental recommendation 1 tailored to {growth_area}",
    "High-leverage developmental recommendation 2 tailored to {growth_area}",
    "High-leverage developmental recommendation 3 tailored to {growth_area}"
  ]
}}"""

    async def _call_groq():
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY, timeout=4.5)
        candidate_models = [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "mixtral-8x7b-32768"
        ]
        for model_id in candidate_models:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": "You are an elite psychometric intelligence analyst. Respond with pure JSON only adhering strictly to the requested schema."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"}
                )
                content = completion.choices[0].message.content
                data = json.loads(content)
                if "archetypeTitle" in data and "overallSummary" in data and "categoryInsights" in data and "actionableAdvice" in data:
                    return data
            except Exception:
                continue
        raise ValueError("Could not complete Groq analysis across candidate models")


    try:
        data = await asyncio.wait_for(_call_groq(), timeout=6.0)
        return (data, False)
    except Exception as e:
        print(f"[Assessment AI] Groq inference notice ({e}). Using deterministic psychometric fallback.")
        return (generate_deterministic_assessment_report(raw_scores, composite_score, tier, balance_type, spread, top_strength, growth_area), True)


@app.get("/api/assessment/start")
def get_assessment_start():
    """
    Fetches 10 randomly sampled questions per category (40 questions total).
    Strips correct_answer and is_reverse for security.
    Shuffles options for IQ MCQs.
    """
    questions = database.get_assessment_questions_for_start()
    return {
        "status": "success",
        "count": len(questions),
        "questions": questions
    }


@app.post("/api/assessment/submit")
async def submit_assessment(payload: AssessmentSubmissionRequest):
    """
    Server-side evaluation of the 40-question psychometric assessment bank.
    Scoring:
    - IQ: 1 point if answer matches correct_answer, 0 for wrong/null -> (raw / 10) * 100
    - EQ/SQ/AQ: Likert (1-5, null -> 3, inverted if is_reverse) -> ((sum - 10) / 40) * 100
    - Overall composite: mean of 4 categories
    - Tiers: 0-39 Developing, 40-64 Balanced, 65-84 Proficient, 85-100 Exceptional
    - Balance type: Spread <= 20 -> Well-Rounded Generalist else Spiky Specialist
    - AI narrative with 6.0s Groq timeout + deterministic fallback
    - Persists to assessment_results table
    """
    bank_map = database.get_assessment_bank_dict()

    user_answers = {r.question_id: r.answer for r in payload.responses}

    # Group responses by category
    iq_raw = 0
    iq_count = 0

    category_likert_sums = {"EQ": 0, "SQ": 0, "AQ": 0}
    category_counts = {"EQ": 0, "SQ": 0, "AQ": 0}

    for qid, q in bank_map.items():
        if qid not in user_answers:
            continue
        ans = user_answers[qid]
        cat = q["category"]

        if cat == "IQ":
            iq_count += 1
            corr = q.get("correct_answer")
            if ans is not None and corr is not None:
                if str(ans).strip().lower() == str(corr).strip().lower():
                    iq_raw += 1
        elif cat in category_likert_sums:
            category_counts[cat] += 1
            if ans is None:
                val = 3
            else:
                try:
                    ans_int = int(ans)
                except (ValueError, TypeError):
                    ans_int = 3
                ans_int = max(1, min(5, ans_int))
                val = (6 - ans_int) if q.get("is_reverse") else ans_int
            category_likert_sums[cat] += val

    # Normalization formulas:
    iq_total = max(1, iq_count if iq_count > 0 else 10)
    iq_percent = round((iq_raw / float(iq_total)) * 100.0)
    iq_percent = max(0, min(100, iq_percent))

    scores = {"IQ": float(iq_percent)}

    for cat in ["EQ", "SQ", "AQ"]:
        raw_sum = category_likert_sums[cat]
        cnt = category_counts[cat] if category_counts[cat] > 0 else 10
        min_possible = cnt * 1
        max_possible = cnt * 5
        range_possible = max_possible - min_possible
        if range_possible <= 0:
            pct = 50.0
        else:
            pct = round(((raw_sum - min_possible) / float(range_possible)) * 100.0)
        scores[cat] = float(max(0, min(100, pct)))

    composite_score = round(sum(scores.values()) / 4.0, 1)
    tier = calculate_assessment_tier(composite_score)

    spread = round(max(scores.values()) - min(scores.values()), 1)
    balance_type = "Well-Rounded Generalist" if spread <= 20 else "Spiky Specialist"

    top_strength = max(scores, key=scores.get)
    growth_area = min(scores, key=scores.get)

    ai_analysis, is_fallback = await generate_assessment_ai_analysis(
        raw_scores=scores,
        composite_score=composite_score,
        tier=tier,
        balance_type=balance_type,
        spread=spread,
        top_strength=top_strength,
        growth_area=growth_area
    )

    # Persist in assessment_results table
    responses_log = [{"question_id": r.question_id, "answer": r.answer} for r in payload.responses]
    record_id = database.save_assessment_submission(
        user_id=payload.user_id,
        raw_scores=scores,
        composite_score=composite_score,
        tier=tier,
        ai_analysis=ai_analysis,
        responses=responses_log
    )

    from datetime import datetime, timezone
    created_at = datetime.now(timezone.utc).isoformat()

    return {
        "status": "success",
        "id": record_id,
        "compositeScore": composite_score,
        "tier": tier,
        "balanceType": balance_type,
        "spread": spread,
        "topStrength": top_strength,
        "growthArea": growth_area,
        "rawScores": scores,
        "aiAnalysis": ai_analysis,
        "isFallback": is_fallback,
        "createdAt": created_at
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
