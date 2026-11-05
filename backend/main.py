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
    title="SmartIQ API",
    description="Psychometric Assessment & AI Mind Archetype Analytics with Supabase RBAC",
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
        for model_id in ["openai/gpt-oss-20b", "qwen/qwen3.8-27b"]:
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
        "platform": "SmartIQ",
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
