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
    iq_score: int
    iq_breakdown: Dict[str, int] = Field(default_factory=dict)
    eq_score: int
    eq_breakdown: Dict[str, int] = Field(default_factory=dict)
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
# Local Deterministic Fallback Engine
# =============================================================================
def generate_deterministic_archetype(submission: QuizSubmission) -> Dict[str, Any]:
    """
    Fallback deterministic psychometric calculation engine.
    Ensures 100% operational uptime if external AI keys are unavailable or throttled.
    """
    iq = submission.iq_score
    eq = submission.eq_score

    if iq >= 120 and eq >= 115:
        archetype = "The Mastermind Diplomat"
        summary = "You demonstrate rare dual-hemisphere mastery, effortlessly synthesizing complex analytical problem-solving with high-empathy leadership."
        cog_edge = "Hyper-rapid conceptual modeling and deductive pattern isolation under ambiguous conditions."
        eq_style = "High emotional equilibrium with an intuitive ability to de-escalate friction and inspire consensus."
    elif iq >= 120 and eq < 115:
        archetype = "The Deep-System Architect"
        summary = "Your cognition excels at structural mechanics, logic trees, and technical precision, often outpacing social nuances."
        cog_edge = "Uncompromising algorithmic clarity and razor-sharp elimination of fallacies."
        eq_style = "Pragmatic and task-focused; benefits from actively factoring human emotional dynamics into technical roadmaps."
    elif iq < 120 and eq >= 115:
        archetype = "The Intuitive Catalyst"
        summary = "You possess exceptional interpersonal resonance, instinctive emotional radar, and profound group orchestration abilities."
        cog_edge = "Holistic intuitive problem-solving driven by contextual understanding rather than rigid formulas."
        eq_style = "Empathetic anchoring; master of psychological safety, team morale, and restorative conflict resolution."
    else:
        archetype = "The Pragmatic Integrator"
        summary = "You exhibit balanced, grounded problem-solving capabilities, steadily bridging common-sense execution with solid emotional steadiness."
        cog_edge = "Methodical step-by-step reasoning with practical risk assessment."
        eq_style = "Steady and reliable emotional demeanor, avoiding reactive impulses during sudden disruptions."

    growth_habits = [
        {
            "habit": "Dual-N-Back Working Memory Protocol",
            "frequency": "Daily (15 mins)",
            "action": "Train mental working memory buffers to elevate sequence retention and spatial transformation speed."
        },
        {
            "habit": "Emotional Trigger Deconstruction",
            "frequency": "Daily (Evening)",
            "action": "Journal two moments where you felt micro-frustration; identify the underlying somatic cue and decouple impulse from response."
        },
        {
            "habit": "Devil's Advocate Argumentation",
            "frequency": "Weekly",
            "action": "Choose a topic you feel passionate about and write down the top 3 strongest arguments for the exact opposite stance."
        }
    ]

    mistakes = []
    for item in submission.incorrect_questions:
        q_text = item.get("question_text", "Logic Problem")
        u_opt = item.get("user_option", "Selected Answer")
        c_opt = item.get("correct_option", "True Answer")
        mistakes.append({
            "question": q_text[:90] + ("..." if len(q_text) > 90 else ""),
            "why_wrong": f"You selected '{u_opt}', whereas the objective deduction proves '{c_opt}'.",
            "cognitive_bias": "Confirmation bias or heuristic misattribution under countdown pressure."
        })

    if not mistakes:
        mistakes.append({
            "question": "Perfect Scoring Performance",
            "why_wrong": "No errors detected across all tested cognitive dimensions.",
            "cognitive_bias": "None; exceptional calibration and error mitigation."
        })

    return {
        "archetype_title": archetype,
        "core_summary": summary,
        "cognitive_edge": cog_edge,
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
Analyze this user's psychometric scores:
IQ Score: {submission.iq_score} (Breakdown: {submission.iq_breakdown})
EQ Score: {submission.eq_score} (Breakdown: {submission.eq_breakdown})
Tab Switch Count: {submission.tab_switch_count}
Incorrect Questions: {json.dumps(submission.incorrect_questions[:4])}

Output ONLY valid JSON with keys: archetype_title, core_summary, cognitive_edge, emotional_profile, growth_habits (array of {{"habit", "frequency", "action"}}), mistake_analyses (array of {{"question", "why_wrong", "cognitive_bias"}}).
"""
        for model_id in ["openai/gpt-oss-20b", "qwen/qwen3.8-27b"]:
            try:
                completion = client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": "You are a professional psychometrics analyst. Respond with pure JSON only."},
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
    type: Optional[str] = Query(None, description="Quiz module type: 'IQ' or 'EQ'"),
    limit: Optional[int] = Query(5, description="Number of questions to return")
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
