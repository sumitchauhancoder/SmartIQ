"""
Database management module for SmartIQ.
Supports both Supabase PostgreSQL (via DATABASE_URL) and local SQLite fallback.
Provides persistent CRUD for questions, user profile RBAC checks, and submission metrics.
"""

import os
import json
import sqlite3
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from questions_seed import SEEDED_QUESTIONS

load_dotenv()

# The 12 Canonical 4D Sub-Categories (Strictly 3 per category)
CANONICAL_SUBCATEGORIES = {
    "IQ": ["Logic", "Math", "Spatial"],
    "EQ": ["Self-Awareness", "Self-Regulation", "Empathy"],
    "SQ": ["Philosophy & Stoicism", "Purpose & Meaning", "Core Values & Wholeness"],
    "AQ": ["Crisis Management & Resilience", "AI & Tech Disruption", "Unlearning & Agility"]
}

def normalize_sub_category(category_type: str, sub_category: str) -> str:
    cat = (category_type or "").upper()
    valid_subs = CANONICAL_SUBCATEGORIES.get(cat, [])
    if sub_category in valid_subs:
        return sub_category
    
    sub_lower = (sub_category or "").lower()
    if cat == "IQ":
        if "spatial" in sub_lower or "dice" in sub_lower or "geometry" in sub_lower or "symmetry" in sub_lower:
            return "Spatial"
        if "arithmetic" in sub_lower or "math" in sub_lower or "number" in sub_lower:
            return "Math"
        return "Logic"
    elif cat == "EQ":
        if any(w in sub_lower for w in ["empathy", "listening", "peer", "social", "inclusion", "team", "conflict"]):
            return "Empathy"
        if any(w in sub_lower for w in ["regulation", "feedback", "criticism", "dialogue", "resilience"]):
            return "Self-Regulation"
        return "Self-Awareness"
    elif cat == "SQ":
        if any(w in sub_lower for w in ["stoic", "control", "equanimity", "impermanence", "obstacle", "perspective", "failure"]):
            return "Philosophy & Stoicism"
        if any(w in sub_lower for w in ["purpose", "solitude", "gratitude", "intention", "expediency"]):
            return "Purpose & Meaning"
        return "Core Values & Wholeness"
    elif cat == "AQ":
        if any(w in sub_lower for w in ["crisis", "resilience", "fallback", "interruption", "prioritization", "ambiguity", "disruption"]):
            return "Crisis Management & Resilience"
        if any(w in sub_lower for w in ["ai", "tech", "environment", "upskilling", "cloud", "novel"]):
            return "AI & Tech Disruption"
        return "Unlearning & Agility"
    return sub_category or "Logic"

DATABASE_URL = os.getenv("DATABASE_URL", "")

# Normalize connection string for SQLAlchemy to explicitly use the installed psycopg2 driver
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

_engine = None
_use_postgres = False

if DATABASE_URL:
    try:
        from sqlalchemy import create_engine, text
        # Connection pooling configuration for Render / Supabase (pool_pre_ping checks stale connections)
        _engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10
        )
        _use_postgres = True
        print("[SmartIQ Database] Connected to Supabase PostgreSQL.")
    except Exception as e:
        print(f"[SmartIQ Database] Warning: Could not initialize PostgreSQL engine ({e}). Falling back to SQLite.")
        _use_postgres = False

SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "smartiq.db")


def get_sqlite_conn():
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes tables and seeds default psychometric questions if empty."""
    if _use_postgres and _engine:
        init_postgres_db()
    else:
        init_sqlite_db()
    init_assessment_tables()


def init_postgres_db():
    """Verifies PostgreSQL schema and seeds questions across IQ, EQ, SQ, and AQ if not already present."""
    from sqlalchemy import text
    try:
        with _engine.begin() as conn:
            # Ensure optional columns diagram_svg & points exist gracefully without breaking existing schema
            conn.execute(text("ALTER TABLE questions ADD COLUMN IF NOT EXISTS diagram_svg TEXT;"))
            conn.execute(text("ALTER TABLE questions ADD COLUMN IF NOT EXISTS points JSONB;"))
            conn.execute(text("ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;"))
            conn.execute(text("ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_spatial BOOLEAN DEFAULT FALSE;"))
            conn.execute(text("ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_images JSONB;"))

            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS recommendations (
                    id SERIAL PRIMARY KEY,
                    category VARCHAR(50) NOT NULL,
                    resource_type VARCHAR(20) NOT NULL,
                    title TEXT NOT NULL,
                    link TEXT NOT NULL
                );
            """))

            # Update category_type check constraint to accommodate all 4 intelligences: IQ, EQ, SQ, AQ
            try:
                conn.execute(text("ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_category_type_check;"))
                conn.execute(text("ALTER TABLE questions ADD CONSTRAINT questions_category_type_check CHECK (category_type IN ('IQ', 'EQ', 'SQ', 'AQ'));"))
            except Exception as cat_err:
                print(f"[SmartIQ Database] Category constraint update notice: {cat_err}")

            # Ensure submissions table exists for multidimensional performance analytics
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS submissions (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(100) NOT NULL,
                    user_id UUID,
                    iq_score INTEGER,
                    iq_breakdown JSONB,
                    eq_score INTEGER,
                    eq_breakdown JSONB,
                    sq_score INTEGER,
                    sq_breakdown JSONB,
                    aq_score INTEGER,
                    aq_breakdown JSONB,
                    test_type VARCHAR(50) DEFAULT 'COMBINED',
                    tab_switch_count INTEGER DEFAULT 0,
                    archetype_title VARCHAR(200),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Ensure newly added quotient columns exist in existing table installations
            conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS sq_score INTEGER;"))
            conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS sq_breakdown JSONB;"))
            conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS aq_score INTEGER;"))
            conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS aq_breakdown JSONB;"))
            conn.execute(text("ALTER TABLE submissions ADD COLUMN IF NOT EXISTS test_type VARCHAR(50) DEFAULT 'COMBINED';"))
            try:
                conn.execute(text("ALTER TABLE submissions ALTER COLUMN iq_score DROP NOT NULL;"))
                conn.execute(text("ALTER TABLE submissions ALTER COLUMN iq_breakdown DROP NOT NULL;"))
                conn.execute(text("ALTER TABLE submissions ALTER COLUMN eq_score DROP NOT NULL;"))
                conn.execute(text("ALTER TABLE submissions ALTER COLUMN eq_breakdown DROP NOT NULL;"))
            except Exception:
                pass

            # Synchronize admin privileges for superadmin in PostgreSQL profiles table
            try:
                conn.execute(text("UPDATE profiles SET role = 'admin' WHERE LOWER(email) = 'sumitchauhancoder@gmail.com';"))
            except Exception as admin_err:
                print(f"[SmartIQ Database] Notice on superadmin role sync: {admin_err}")

            # Purge legacy / deprecated questions not in the approved 80 SEEDED_QUESTIONS pool
            approved_texts = [q["question_text"] for q in SEEDED_QUESTIONS]
            if approved_texts:
                try:
                    conn.execute(
                        text("DELETE FROM questions WHERE question_text NOT IN :approved_texts"),
                        {"approved_texts": tuple(approved_texts)}
                    )
                except Exception as purge_err:
                    print(f"[SmartIQ Database] Notice on legacy question purge: {purge_err}")

            # Seed questions that don't already exist in the pool
            insert_stmt = text("""
                INSERT INTO questions (
                    category_type, sub_category, question_text, diagram_svg,
                    options, correct_answer_index, points, explanation, image_url, is_spatial
                ) VALUES (
                    :category_type, :sub_category, :question_text, :diagram_svg,
                    :options, :correct_answer_index, :points, :explanation, :image_url, :is_spatial
                )
            """)
            seeded_count = 0
            for q in SEEDED_QUESTIONS:
                exists = conn.execute(
                    text("SELECT 1 FROM questions WHERE question_text = :qtext LIMIT 1"),
                    {"qtext": q["question_text"]}
                ).scalar()
                if not exists:
                    conn.execute(insert_stmt, {
                        "category_type": q["category_type"],
                        "sub_category": q["sub_category"],
                        "question_text": q["question_text"],
                        "diagram_svg": q.get("diagram_svg"),
                        "options": json.dumps(q["options"]),
                        "correct_answer_index": q["correct_answer_index"],
                        "points": json.dumps(q.get("points", [1, 2, 3, 4, 5] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                        "explanation": q["explanation"],
                        "image_url": q.get("image_url"),
                        "is_spatial": bool(q.get("is_spatial", False))
                    })
                    seeded_count += 1
                else:
                    # Update existing questions so diagrams, image URLs and options stay in sync with latest fixes
                    conn.execute(text("""
                        UPDATE questions SET
                            sub_category = :sub_category,
                            diagram_svg = :diagram_svg,
                            image_url = :image_url,
                            is_spatial = :is_spatial,
                            options = :options,
                            correct_answer_index = :correct_answer_index,
                            points = :points,
                            explanation = :explanation
                        WHERE question_text = :question_text
                    """), {
                        "question_text": q["question_text"],
                        "diagram_svg": q.get("diagram_svg"),
                        "image_url": q.get("image_url"),
                        "is_spatial": bool(q.get("is_spatial", False)),
                        "options": json.dumps(q["options"]),
                        "correct_answer_index": q["correct_answer_index"],
                        "points": json.dumps(q.get("points", [1, 2, 3, 4] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                        "explanation": q["explanation"]
                    })
            if seeded_count > 0:
                print(f"[SmartIQ Database] Seeded {seeded_count} new questions into PostgreSQL.")
    except Exception as e:
        print(f"[SmartIQ Database] PostgreSQL initialization error: {e}")


def init_sqlite_db():
    """Initializes local SQLite database with 4-dimensional intelligence support."""
    conn = get_sqlite_conn()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_type TEXT NOT NULL,
            sub_category TEXT NOT NULL,
            question_text TEXT NOT NULL,
            diagram_svg TEXT,
            options_json TEXT NOT NULL,
            correct_answer_index INTEGER NOT NULL,
            points_json TEXT,
            explanation TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            image_url TEXT,
            is_spatial INTEGER DEFAULT 0,
            option_images_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            title TEXT NOT NULL,
            link TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            user_id TEXT,
            iq_score INTEGER,
            iq_breakdown_json TEXT,
            eq_score INTEGER,
            eq_breakdown_json TEXT,
            sq_score INTEGER,
            sq_breakdown_json TEXT,
            aq_score INTEGER,
            aq_breakdown_json TEXT,
            test_type TEXT DEFAULT 'COMBINED',
            tab_switch_count INTEGER DEFAULT 0,
            archetype_title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Ensure missing columns in existing SQLite submissions table
    try:
        cursor.execute("ALTER TABLE submissions ADD COLUMN sq_score INTEGER")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE submissions ADD COLUMN sq_breakdown_json TEXT")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE submissions ADD COLUMN aq_score INTEGER")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE submissions ADD COLUMN aq_breakdown_json TEXT")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE submissions ADD COLUMN test_type TEXT DEFAULT 'COMBINED'")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN image_url TEXT")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN is_spatial INTEGER DEFAULT 0")
    except Exception:
        pass
    try:
        cursor.execute("ALTER TABLE questions ADD COLUMN option_images_json TEXT")
    except Exception:
        pass
    conn.commit()

    seeded_count = 0
    for q in SEEDED_QUESTIONS:
        cursor.execute("SELECT 1 FROM questions WHERE question_text = ? LIMIT 1", (q["question_text"],))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO questions (
                    category_type, sub_category, question_text, diagram_svg,
                    options_json, correct_answer_index, points_json, explanation, is_active,
                    image_url, is_spatial
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            """, (
                q["category_type"],
                q["sub_category"],
                q["question_text"],
                q.get("diagram_svg"),
                json.dumps(q["options"]),
                q["correct_answer_index"],
                json.dumps(q.get("points", [1, 2, 3, 4, 5] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                q["explanation"],
                q.get("image_url"),
                1 if q.get("is_spatial") else 0
            ))
            seeded_count += 1
        else:
            cursor.execute("""
                UPDATE questions SET
                    sub_category = ?,
                    diagram_svg = ?,
                    options_json = ?,
                    correct_answer_index = ?,
                    points_json = ?,
                    explanation = ?,
                    image_url = ?,
                    is_spatial = ?
                WHERE question_text = ?
            """, (
                q["sub_category"],
                q.get("diagram_svg"),
                json.dumps(q["options"]),
                q["correct_answer_index"],
                json.dumps(q.get("points", [1, 2, 3, 4] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                q["explanation"],
                q.get("image_url"),
                1 if q.get("is_spatial") else 0,
                q["question_text"]
            ))
    if seeded_count > 0:
        conn.commit()
        print(f"[SmartIQ Database] Seeded {seeded_count} new questions into SQLite.")

    conn.close()


def get_active_questions(category_type: Optional[str] = None, limit: Optional[int] = None, randomize: bool = True) -> List[Dict[str, Any]]:
    """Fetches questions from PostgreSQL or SQLite."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        query = "SELECT * FROM questions WHERE 1=1"
        params = {}
        if category_type:
            query += " AND UPPER(category_type) = :cat"
            params["cat"] = category_type.upper()
        if randomize:
            query += " ORDER BY RANDOM()"
        else:
            query += " ORDER BY id ASC"
        if limit and limit > 0:
            query += f" LIMIT {int(limit)}"

        with _engine.connect() as conn:
            rows = conn.execute(text(query), params).mappings().all()
            questions = []
            for r in rows:
                opts = r.get("options")
                if isinstance(opts, str):
                    try:
                        opts = json.loads(opts)
                    except Exception:
                        pass
                pts = r.get("points")
                if isinstance(pts, str):
                    try:
                        pts = json.loads(pts)
                    except Exception:
                        pass
                questions.append({
                    "id": r.get("id"),
                    "category_type": r.get("category_type"),
                    "sub_category": normalize_sub_category(r.get("category_type"), r.get("sub_category")),
                    "question_text": r.get("question_text"),
                    "diagram_svg": r.get("diagram_svg"),
                    "options": opts,
                    "correct_answer_index": r.get("correct_answer_index"),
                    "points": pts,
                    "explanation": r.get("explanation"),
                    "image_url": r.get("image_url"),
                    "is_spatial": bool(r.get("is_spatial", False)),
                    "option_images": json.loads(r.get("option_images")) if isinstance(r.get("option_images"), str) else r.get("option_images")
                })
            return questions

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    query = "SELECT * FROM questions WHERE is_active = 1"
    params = []
    if category_type:
        query += " AND category_type = ?"
        params.append(category_type.upper())
    if randomize:
        query += " ORDER BY RANDOM()"
    else:
        query += " ORDER BY id ASC"
    if limit and limit > 0:
        query += " LIMIT ?"
        params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    questions = []
    for row in rows:
        questions.append({
            "id": row["id"],
            "category_type": row["category_type"],
            "sub_category": normalize_sub_category(row["category_type"], row["sub_category"]),
            "question_text": row["question_text"],
            "diagram_svg": row["diagram_svg"],
            "options": json.loads(row["options_json"]),
            "correct_answer_index": row["correct_answer_index"],
            "points": json.loads(row["points_json"]) if row["points_json"] else None,
            "explanation": row["explanation"],
            "image_url": row["image_url"] if "image_url" in row.keys() else None,
            "is_spatial": bool(row["is_spatial"]) if "is_spatial" in row.keys() else False,
            "option_images": json.loads(row["option_images_json"]) if ("option_images_json" in row.keys() and row["option_images_json"]) else None
        })
    return questions


def get_all_questions_admin() -> List[Dict[str, Any]]:
    """Returns all questions for administrative review."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        with _engine.connect() as conn:
            rows = conn.execute(text("SELECT * FROM questions ORDER BY id DESC")).mappings().all()
            questions = []
            for r in rows:
                opts = r.get("options")
                if isinstance(opts, str):
                    try:
                        opts = json.loads(opts)
                    except Exception:
                        pass
                pts = r.get("points")
                if isinstance(pts, str):
                    try:
                        pts = json.loads(pts)
                    except Exception:
                        pass
                questions.append({
                    "id": r.get("id"),
                    "category_type": r.get("category_type"),
                    "sub_category": normalize_sub_category(r.get("category_type"), r.get("sub_category")),
                    "question_text": r.get("question_text"),
                    "diagram_svg": r.get("diagram_svg"),
                    "options": opts,
                    "correct_answer_index": r.get("correct_answer_index"),
                    "points": pts,
                    "explanation": r.get("explanation"),
                    "image_url": r.get("image_url"),
                    "is_spatial": bool(r.get("is_spatial", False)),
                    "option_images": json.loads(r.get("option_images")) if isinstance(r.get("option_images"), str) else r.get("option_images"),
                    "created_at": str(r.get("created_at")) if r.get("created_at") else None
                })
            return questions

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM questions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    questions = []
    for row in rows:
        questions.append({
            "id": row["id"],
            "category_type": row["category_type"],
            "sub_category": normalize_sub_category(row["category_type"], row["sub_category"]),
            "question_text": row["question_text"],
            "diagram_svg": row["diagram_svg"],
            "options": json.loads(row["options_json"]),
            "correct_answer_index": row["correct_answer_index"],
            "points": json.loads(row["points_json"]) if row["points_json"] else None,
            "explanation": row["explanation"],
            "image_url": row["image_url"] if "image_url" in row.keys() else None,
            "is_spatial": bool(row["is_spatial"]) if "is_spatial" in row.keys() else False,
            "option_images": json.loads(row["option_images_json"]) if ("option_images_json" in row.keys() and row["option_images_json"]) else None,
            "created_at": str(row["created_at"])
        })
    return questions


def add_admin_question(
    category_type: str,
    sub_category: str,
    question_text: str,
    options: List[str],
    correct_answer_index: int,
    explanation: str,
    diagram_svg: Optional[str] = None,
    image_url: Optional[str] = None,
    is_spatial: Optional[bool] = False,
    option_images: Optional[List[str]] = None,
    points: Optional[List[int]] = None
) -> int:
    """Inserts a new question into the pool."""
    if points is None:
        points = [1, 2, 3, 4] if category_type.upper() in ("EQ", "SQ", "AQ") else [0, 0, 0, 0]

    if _use_postgres and _engine:
        from sqlalchemy import text
        stmt = text("""
            INSERT INTO questions (
                category_type, sub_category, question_text, diagram_svg,
                options, correct_answer_index, points, explanation,
                image_url, is_spatial, option_images
            ) VALUES (
                :category_type, :sub_category, :question_text, :diagram_svg,
                :options, :correct_answer_index, :points, :explanation,
                :image_url, :is_spatial, :option_images
            ) RETURNING id
        """)
        with _engine.begin() as conn:
            result = conn.execute(stmt, {
                "category_type": category_type.upper(),
                "sub_category": sub_category,
                "question_text": question_text,
                "diagram_svg": diagram_svg,
                "options": json.dumps(options),
                "correct_answer_index": correct_answer_index,
                "points": json.dumps(points),
                "explanation": explanation,
                "image_url": image_url,
                "is_spatial": bool(is_spatial),
                "option_images": json.dumps(option_images) if option_images else None
            })
            new_id = result.scalar()
            return new_id

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO questions (
            category_type, sub_category, question_text, diagram_svg,
            options_json, correct_answer_index, points_json, explanation, is_active,
            image_url, is_spatial, option_images_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    """, (
        category_type.upper(),
        sub_category,
        question_text,
        diagram_svg,
        json.dumps(options),
        correct_answer_index,
        json.dumps(points),
        explanation,
        image_url,
        1 if is_spatial else 0,
        json.dumps(option_images) if option_images else None
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def update_admin_question(
    question_id: int,
    category_type: str,
    sub_category: str,
    question_text: str,
    options: List[str],
    correct_answer_index: int,
    explanation: str,
    diagram_svg: Optional[str] = None,
    image_url: Optional[str] = None,
    is_spatial: Optional[bool] = False,
    option_images: Optional[List[str]] = None,
    points: Optional[List[int]] = None
) -> bool:
    """Updates an existing question in the pool."""
    if points is None:
        points = [1, 2, 3, 4] if category_type.upper() in ("EQ", "SQ", "AQ") else [0, 0, 0, 0]

    if _use_postgres and _engine:
        from sqlalchemy import text
        stmt = text("""
            UPDATE questions SET
                category_type = :category_type,
                sub_category = :sub_category,
                question_text = :question_text,
                diagram_svg = :diagram_svg,
                options = :options,
                correct_answer_index = :correct_answer_index,
                points = :points,
                explanation = :explanation,
                image_url = :image_url,
                is_spatial = :is_spatial,
                option_images = :option_images
            WHERE id = :id
        """)
        with _engine.begin() as conn:
            res = conn.execute(stmt, {
                "id": question_id,
                "category_type": category_type.upper(),
                "sub_category": sub_category,
                "question_text": question_text,
                "diagram_svg": diagram_svg,
                "options": json.dumps(options),
                "correct_answer_index": correct_answer_index,
                "points": json.dumps(points),
                "explanation": explanation,
                "image_url": image_url,
                "is_spatial": bool(is_spatial),
                "option_images": json.dumps(option_images) if option_images else None
            })
            return res.rowcount > 0

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE questions SET
            category_type = ?,
            sub_category = ?,
            question_text = ?,
            diagram_svg = ?,
            options_json = ?,
            correct_answer_index = ?,
            points_json = ?,
            explanation = ?,
            image_url = ?,
            is_spatial = ?,
            option_images_json = ?
        WHERE id = ?
    """, (
        category_type.upper(),
        sub_category,
        question_text,
        diagram_svg,
        json.dumps(options),
        correct_answer_index,
        json.dumps(points),
        explanation,
        image_url,
        1 if is_spatial else 0,
        json.dumps(option_images) if option_images else None,
        question_id
    ))
    conn.commit()
    updated = cursor.rowcount > 0
    conn.close()
    return updated


def delete_admin_question(question_id: int) -> bool:
    """Deletes question from the pool."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        with _engine.begin() as conn:
            res = conn.execute(text("DELETE FROM questions WHERE id = :id"), {"id": question_id})
            return res.rowcount > 0

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions WHERE id = ?", (question_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def get_user_profile_role(user_id: Optional[str] = None, email: Optional[str] = None) -> str:
    """Checks the user role in public.profiles ('admin' or 'user')."""
    # Explicit superadmin override
    if email and email.lower().strip() == "sumitchauhancoder@gmail.com":
        print(f"[SmartIQ Database] Superadmin match for {email} -> role: admin")
        return "admin"

    if _use_postgres and _engine:
        from sqlalchemy import text
        # 1. Try querying profiles by id with text comparison to prevent UUID operator error
        if user_id:
            try:
                with _engine.connect() as conn:
                    res = conn.execute(
                        text("SELECT role FROM profiles WHERE id::text = :uid_str LIMIT 1"),
                        {"uid_str": str(user_id).strip()}
                    ).mappings().first()
                    if res and res.get("role"):
                        role = str(res["role"]).lower().strip()
                        print(f"[SmartIQ Database] get_user_profile_role by user_id={user_id} -> {role}")
                        return role
            except Exception as e:
                print(f"[SmartIQ Database] Profile role query by id error (uid: {user_id}): {e}")

        # 2. Fallback: Query profiles by email
        if email:
            try:
                with _engine.connect() as conn:
                    res = conn.execute(
                        text("SELECT role FROM profiles WHERE LOWER(email) = LOWER(:email) LIMIT 1"),
                        {"email": str(email).strip()}
                    ).mappings().first()
                    if res and res.get("role"):
                        role = str(res["role"]).lower().strip()
                        print(f"[SmartIQ Database] get_user_profile_role by email={email} -> {role}")
                        return role
            except Exception as e:
                print(f"[SmartIQ Database] Profile role query by email error (email: {email}): {e}")

    # Fallback to local SQLite if applicable
    try:
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT role FROM profiles WHERE id = ?", (str(user_id),))
            row = cursor.fetchone()
            if row and row["role"]:
                conn.close()
                return str(row["role"]).lower().strip()
        if email:
            cursor.execute("SELECT role FROM profiles WHERE LOWER(email) = LOWER(?)", (str(email).strip(),))
            row = cursor.fetchone()
            if row and row["role"]:
                conn.close()
                return str(row["role"]).lower().strip()
        conn.close()
    except Exception:
        pass

    print(f"[SmartIQ Database] get_user_profile_role defaulted to 'user' for uid={user_id}, email={email}")
    return "user"


def record_submission(
    session_id: str,
    iq_score: Optional[int] = None,
    iq_breakdown: Optional[Dict[str, int]] = None,
    eq_score: Optional[int] = None,
    eq_breakdown: Optional[Dict[str, int]] = None,
    sq_score: Optional[int] = None,
    sq_breakdown: Optional[Dict[str, int]] = None,
    aq_score: Optional[int] = None,
    aq_breakdown: Optional[Dict[str, int]] = None,
    test_type: Optional[str] = "COMBINED",
    tab_switch_count: int = 0,
    archetype_title: Optional[str] = None,
    user_id: Optional[str] = None
) -> int:
    """Records an anonymized completed test submission for metrics across any of the 4 intelligences."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        stmt = text("""
            INSERT INTO submissions (
                session_id, user_id, 
                iq_score, iq_breakdown, 
                eq_score, eq_breakdown, 
                sq_score, sq_breakdown, 
                aq_score, aq_breakdown, 
                test_type, tab_switch_count, archetype_title
            ) VALUES (
                :session_id, :user_id, 
                :iq_score, :iq_breakdown, 
                :eq_score, :eq_breakdown, 
                :sq_score, :sq_breakdown, 
                :aq_score, :aq_breakdown, 
                :test_type, :tab_switch_count, :archetype_title
            ) RETURNING id
        """)
        try:
            with _engine.begin() as conn:
                res = conn.execute(stmt, {
                    "session_id": session_id,
                    "user_id": user_id,
                    "iq_score": iq_score,
                    "iq_breakdown": json.dumps(iq_breakdown) if iq_breakdown else None,
                    "eq_score": eq_score,
                    "eq_breakdown": json.dumps(eq_breakdown) if eq_breakdown else None,
                    "sq_score": sq_score,
                    "sq_breakdown": json.dumps(sq_breakdown) if sq_breakdown else None,
                    "aq_score": aq_score,
                    "aq_breakdown": json.dumps(aq_breakdown) if aq_breakdown else None,
                    "test_type": test_type or "COMBINED",
                    "tab_switch_count": tab_switch_count,
                    "archetype_title": archetype_title
                })
                return res.scalar() or 0
        except Exception as e:
            print(f"[SmartIQ Database] Failed recording submission in Postgres: {e}")
            return 0

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO submissions (
            session_id, user_id, 
            iq_score, iq_breakdown_json, 
            eq_score, eq_breakdown_json, 
            sq_score, sq_breakdown_json, 
            aq_score, aq_breakdown_json, 
            test_type, tab_switch_count, archetype_title
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        session_id,
        user_id,
        iq_score,
        json.dumps(iq_breakdown) if iq_breakdown else None,
        eq_score,
        json.dumps(eq_breakdown) if eq_breakdown else None,
        sq_score,
        json.dumps(sq_breakdown) if sq_breakdown else None,
        aq_score,
        json.dumps(aq_breakdown) if aq_breakdown else None,
        test_type or "COMBINED",
        tab_switch_count,
        archetype_title
    ))
    conn.commit()
    sub_id = cursor.lastrowid
    conn.close()
    return sub_id


def get_admin_stats() -> Dict[str, Any]:
    """Computes aggregated platform metrics and performance distributions across IQ, EQ, SQ, and AQ normalized to 0-100%."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        try:
            with _engine.connect() as conn:
                total_tests = conn.execute(text("SELECT COUNT(*) FROM submissions")).scalar() or 0
                
                # Question counts per category
                q_counts = conn.execute(text("""
                    SELECT category_type, COUNT(*) as count 
                    FROM questions 
                    GROUP BY category_type
                """)).mappings().all()
                pool_distribution = {str(r["category_type"]).upper(): int(r["count"]) for r in q_counts}

                if total_tests == 0:
                    return {
                        "total_tests": 0,
                        "average_iq": 60.0,
                        "average_eq": 60.0,
                        "average_sq": 60.0,
                        "average_aq": 60.0,
                        "tab_switch_rate": 0.0,
                        "pool_distribution": pool_distribution,
                        "iq_distribution": {"below_average": 0, "average": 0, "gifted": 0, "genius": 0},
                        "recent_submissions": []
                    }

                avg_row = conn.execute(text("""
                    SELECT 
                        AVG(CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE iq_score END) as avg_iq,
                        AVG(CASE WHEN eq_score > 100 THEN ((eq_score - 70.0) / 75.0) * 100.0 ELSE eq_score END) as avg_eq,
                        AVG(CASE WHEN sq_score > 100 THEN ((sq_score - 70.0) / 75.0) * 100.0 ELSE sq_score END) as avg_sq,
                        AVG(CASE WHEN aq_score > 100 THEN ((aq_score - 70.0) / 75.0) * 100.0 ELSE aq_score END) as avg_aq,
                        AVG(tab_switch_count) as avg_switches
                    FROM submissions
                """)).mappings().first()

                dist_row = conn.execute(text("""
                    SELECT 
                        COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 40 THEN 1 ELSE 0 END), 0) as developing,
                        COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 40 AND (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 65 THEN 1 ELSE 0 END), 0) as balanced,
                        COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 65 AND (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 85 THEN 1 ELSE 0 END), 0) as proficient,
                        COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 85 THEN 1 ELSE 0 END), 0) as exceptional
                    FROM submissions
                """)).mappings().first()

                recent_rows = conn.execute(text("""
                    SELECT session_id, iq_score, eq_score, sq_score, aq_score, test_type, tab_switch_count, archetype_title, created_at
                    FROM submissions
                    ORDER BY id DESC
                    LIMIT 10
                """)).mappings().all()

                norm_recent = []
                for r in recent_rows:
                    item = dict(r)
                    for k in ["iq_score", "eq_score", "sq_score", "aq_score"]:
                        val = item.get(k)
                        if val is not None:
                            if val > 100:
                                item[k] = max(0, min(100, round(((val - 70.0) / 75.0) * 100.0)))
                            else:
                                item[k] = max(0, min(100, round(float(val))))
                    norm_recent.append(item)

                return {
                    "total_tests": total_tests,
                    "average_iq": round(float(avg_row["avg_iq"] or 60.0), 1),
                    "average_eq": round(float(avg_row["avg_eq"] or 60.0), 1),
                    "average_sq": round(float(avg_row["avg_sq"] or 60.0), 1),
                    "average_aq": round(float(avg_row["avg_aq"] or 60.0), 1),
                    "tab_switch_rate": round(float(avg_row["avg_switches"] or 0.0), 2),
                    "pool_distribution": pool_distribution,
                    "iq_distribution": {
                        "below_average": int(dist_row["developing"] if dist_row else 0),
                        "average": int(dist_row["balanced"] if dist_row else 0),
                        "gifted": int(dist_row["proficient"] if dist_row else 0),
                        "genius": int(dist_row["exceptional"] if dist_row else 0)
                    },
                    "recent_submissions": norm_recent
                }
        except Exception as e:
            print(f"[SmartIQ Database] Error getting Postgres stats ({e}). Using SQLite fallback.")

    # SQLite Fallback
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM submissions")
    total_tests = cursor.fetchone()["total"]

    cursor.execute("SELECT category_type, COUNT(*) as count FROM questions GROUP BY category_type")
    q_counts = cursor.fetchall()
    pool_distribution = {str(r["category_type"]).upper(): int(r["count"]) for r in q_counts}

    if total_tests == 0:
        conn.close()
        return {
            "total_tests": 0,
            "average_iq": 60.0,
            "average_eq": 60.0,
            "average_sq": 60.0,
            "average_aq": 60.0,
            "tab_switch_rate": 0.0,
            "pool_distribution": pool_distribution,
            "iq_distribution": {"below_average": 0, "average": 0, "gifted": 0, "genius": 0},
            "recent_submissions": []
        }

    cursor.execute("""
        SELECT 
            AVG(CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE iq_score END) as avg_iq,
            AVG(CASE WHEN eq_score > 100 THEN ((eq_score - 70.0) / 75.0) * 100.0 ELSE eq_score END) as avg_eq,
            AVG(CASE WHEN sq_score > 100 THEN ((sq_score - 70.0) / 75.0) * 100.0 ELSE sq_score END) as avg_sq,
            AVG(CASE WHEN aq_score > 100 THEN ((aq_score - 70.0) / 75.0) * 100.0 ELSE aq_score END) as avg_aq,
            AVG(tab_switch_count) as avg_switches
        FROM submissions
    """)
    stats_row = cursor.fetchone()

    cursor.execute("""
        SELECT 
            COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 40 THEN 1 ELSE 0 END), 0) as developing,
            COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 40 AND (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 65 THEN 1 ELSE 0 END), 0) as balanced,
            COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 65 AND (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) < 85 THEN 1 ELSE 0 END), 0) as proficient,
            COALESCE(SUM(CASE WHEN (CASE WHEN iq_score > 100 THEN ((iq_score - 70.0) / 75.0) * 100.0 ELSE COALESCE(iq_score, 60) END) >= 85 THEN 1 ELSE 0 END), 0) as exceptional
        FROM submissions
    """)
    dist_row = cursor.fetchone()

    cursor.execute("""
        SELECT session_id, iq_score, eq_score, sq_score, aq_score, test_type, tab_switch_count, archetype_title, created_at
        FROM submissions
        ORDER BY id DESC
        LIMIT 10
    """)
    recent = []
    for r in cursor.fetchall():
        item = dict(r)
        for k in ["iq_score", "eq_score", "sq_score", "aq_score"]:
            val = item.get(k)
            if val is not None:
                if val > 100:
                    item[k] = max(0, min(100, round(((val - 70.0) / 75.0) * 100.0)))
                else:
                    item[k] = max(0, min(100, round(float(val))))
        recent.append(item)
    conn.close()

    return {
        "total_tests": total_tests,
        "average_iq": round(float(stats_row["avg_iq"] or 60.0), 1) if stats_row["avg_iq"] else 60.0,
        "average_eq": round(float(stats_row["avg_eq"] or 60.0), 1) if stats_row["avg_eq"] else 60.0,
        "average_sq": round(float(stats_row["avg_sq"] or 60.0), 1) if stats_row["avg_sq"] else 60.0,
        "average_aq": round(float(stats_row["avg_aq"] or 60.0), 1) if stats_row["avg_aq"] else 60.0,
        "tab_switch_rate": round(float(stats_row["avg_switches"] or 0.0), 2) if stats_row["avg_switches"] else 0.0,
        "pool_distribution": pool_distribution,
        "iq_distribution": {
            "below_average": int(dist_row["developing"] if dist_row else 0),
            "average": int(dist_row["balanced"] if dist_row else 0),
            "gifted": int(dist_row["proficient"] if dist_row else 0),
            "genius": int(dist_row["exceptional"] if dist_row else 0)
        },
        "recent_submissions": recent
    }

def reset_pool_to_seed() -> bool:
    """Wipes obsolete questions and strictly synchronizes the question pool to the 80 SEEDED_QUESTIONS."""
    if _use_postgres and _engine:
        from sqlalchemy import text
        with _engine.begin() as conn:
            conn.execute(text("TRUNCATE TABLE questions RESTART IDENTITY CASCADE;"))
            insert_stmt = text("""
                INSERT INTO questions (
                    category_type, sub_category, question_text, diagram_svg,
                    options, correct_answer_index, points, explanation, image_url, is_spatial
                ) VALUES (
                    :category_type, :sub_category, :question_text, :diagram_svg,
                    :options, :correct_answer_index, :points, :explanation, :image_url, :is_spatial
                )
            """)
            for q in SEEDED_QUESTIONS:
                conn.execute(insert_stmt, {
                    "category_type": q["category_type"],
                    "sub_category": q["sub_category"],
                    "question_text": q["question_text"],
                    "diagram_svg": q.get("diagram_svg"),
                    "options": json.dumps(q["options"]),
                    "correct_answer_index": q["correct_answer_index"],
                    "points": json.dumps(q.get("points", [1, 2, 3, 4, 5] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                    "explanation": q["explanation"],
                    "image_url": q.get("image_url"),
                    "is_spatial": bool(q.get("is_spatial", False))
                })
        return True

    # SQLite
    conn = get_sqlite_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions")
    for q in SEEDED_QUESTIONS:
        cursor.execute("""
            INSERT INTO questions (
                category_type, sub_category, question_text, diagram_svg,
                options_json, correct_answer_index, points_json, explanation, is_active,
                image_url, is_spatial, option_images_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
        """, (
            q["category_type"].upper(),
            q["sub_category"],
            q["question_text"],
            q.get("diagram_svg"),
            json.dumps(q["options"]),
            q["correct_answer_index"],
            json.dumps(q.get("points", [1, 2, 3, 4, 5] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
            q["explanation"],
            q.get("image_url"),
            1 if q.get("is_spatial") else 0,
            json.dumps(q.get("option_images")) if q.get("option_images") else None
        ))
    conn.commit()
    conn.close()
    return True


# =============================================================================
# 80-Question Psychometric Assessment Bank Database Functions
# =============================================================================

def init_assessment_tables():
    """Initializes tables for the 80-question assessment bank and seeds them if empty."""
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assessment_bank.json")
    bank_data = {}
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                bank_data = json.load(f)
        except Exception as e:
            print(f"[Assessment DB] Could not read assessment_bank.json: {e}")

    if _use_postgres and _engine:
        from sqlalchemy import text
        try:
            with _engine.begin() as conn:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS assessment_questions (
                        id TEXT PRIMARY KEY,
                        category TEXT NOT NULL CHECK (category IN ('IQ', 'EQ', 'SQ', 'AQ')),
                        question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'likert')),
                        prompt_text TEXT NOT NULL,
                        options JSONB,
                        correct_answer TEXT,
                        is_reverse BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """))
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS assessment_results (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        user_id UUID,
                        raw_scores JSONB NOT NULL,
                        composite_score FLOAT NOT NULL,
                        tier TEXT NOT NULL,
                        ai_analysis JSONB NOT NULL,
                        responses JSONB,
                        created_at TIMESTAMPTZ DEFAULT NOW()
                    );
                """))

                count = conn.execute(text("SELECT COUNT(*) FROM assessment_questions")).scalar()
                if count == 0 and bank_data:
                    insert_stmt = text("""
                        INSERT INTO assessment_questions (id, category, question_type, prompt_text, options, correct_answer, is_reverse)
                        VALUES (:id, :category, :question_type, :prompt_text, :options, :correct_answer, :is_reverse)
                        ON CONFLICT (id) DO NOTHING
                    """)
                    for item in bank_data.get("IQ", []):
                        correct_str = item["options"][item.get("correctIndex", 0)]
                        conn.execute(insert_stmt, {
                            "id": item["id"],
                            "category": "IQ",
                            "question_type": "mcq",
                            "prompt_text": item["question"],
                            "options": json.dumps(item["options"]),
                            "correct_answer": correct_str,
                            "is_reverse": False
                        })
                    for cat in ["EQ", "SQ", "AQ"]:
                        for item in bank_data.get(cat, []):
                            conn.execute(insert_stmt, {
                                "id": item["id"],
                                "category": cat,
                                "question_type": "likert",
                                "prompt_text": item["statement"],
                                "options": None,
                                "correct_answer": None,
                                "is_reverse": bool(item.get("isReverse", False))
                            })
                    print("[Assessment DB] Seeded 80 questions into PostgreSQL assessment_questions.")
        except Exception as e:
            print(f"[Assessment DB] Error initializing PostgreSQL assessment tables: {e}")
    else:
        conn = get_sqlite_conn()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS assessment_questions (
                id TEXT PRIMARY KEY,
                category TEXT NOT NULL,
                question_type TEXT NOT NULL,
                prompt_text TEXT NOT NULL,
                options TEXT,
                correct_answer TEXT,
                is_reverse INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS assessment_results (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                raw_scores TEXT NOT NULL,
                composite_score REAL NOT NULL,
                tier TEXT NOT NULL,
                ai_analysis TEXT NOT NULL,
                responses TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("PRAGMA table_info(assessment_results)")
        res_cols = [c[1] for c in cur.fetchall()]
        if "raw_scores" not in res_cols:
            cur.execute("DROP TABLE IF EXISTS assessment_results")
            cur.execute("""
                CREATE TABLE assessment_results (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    raw_scores TEXT NOT NULL,
                    composite_score REAL NOT NULL,
                    tier TEXT NOT NULL,
                    ai_analysis TEXT NOT NULL,
                    responses TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
        conn.commit()


        cur.execute("SELECT COUNT(*) FROM assessment_questions")
        row = cur.fetchone()
        count = row[0] if row else 0
        if count == 0 and bank_data:
            for item in bank_data.get("IQ", []):
                correct_str = item["options"][item.get("correctIndex", 0)]
                cur.execute("""
                    INSERT OR REPLACE INTO assessment_questions (id, category, question_type, prompt_text, options, correct_answer, is_reverse)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (item["id"], "IQ", "mcq", item["question"], json.dumps(item["options"]), correct_str, 0))
            for cat in ["EQ", "SQ", "AQ"]:
                for item in bank_data.get(cat, []):
                    cur.execute("""
                        INSERT OR REPLACE INTO assessment_questions (id, category, question_type, prompt_text, options, correct_answer, is_reverse)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (item["id"], cat, "likert", item["statement"], None, None, 1 if item.get("isReverse", False) else 0))
            conn.commit()
            print("[Assessment DB] Seeded 80 questions into SQLite assessment_questions.")
        conn.close()


def get_assessment_questions_for_start() -> List[Dict[str, Any]]:
    """Fetches 10 randomly sampled questions per category (40 total) with correct_answer and is_reverse stripped and IQ options shuffled."""
    import random
    categories = ["IQ", "EQ", "SQ", "AQ"]
    result_questions = []

    if _use_postgres and _engine:
        from sqlalchemy import text
        with _engine.connect() as conn:
            for cat in categories:
                rows = conn.execute(
                    text("SELECT id, category, question_type, prompt_text, options FROM assessment_questions WHERE category = :cat ORDER BY RANDOM() LIMIT 10"),
                    {"cat": cat}
                ).fetchall()
                for r in rows:
                    opts = r[4]
                    if isinstance(opts, str):
                        try:
                            opts = json.loads(opts)
                        except Exception:
                            pass
                    if r[1] == "IQ" and isinstance(opts, list):
                        opts = list(opts)
                        random.shuffle(opts)
                    result_questions.append({
                        "id": r[0],
                        "category": r[1],
                        "question_type": r[2],
                        "prompt_text": r[3],
                        "options": opts
                    })
    else:
        conn = get_sqlite_conn()
        cur = conn.cursor()
        for cat in categories:
            cur.execute(
                "SELECT id, category, question_type, prompt_text, options FROM assessment_questions WHERE category = ? ORDER BY RANDOM() LIMIT 10",
                (cat,)
            )
            rows = cur.fetchall()
            for r in rows:
                opts = None
                if r["options"]:
                    try:
                        opts = json.loads(r["options"])
                    except Exception:
                        opts = r["options"]
                if r["category"] == "IQ" and isinstance(opts, list):
                    opts = list(opts)
                    random.shuffle(opts)
                result_questions.append({
                    "id": r["id"],
                    "category": r["category"],
                    "question_type": r["question_type"],
                    "prompt_text": r["prompt_text"],
                    "options": opts
                })
        conn.close()

    return result_questions


def get_assessment_bank_dict() -> Dict[str, Dict[str, Any]]:
    """Returns all assessment questions mapped by id for scoring."""
    bank_map = {}
    if _use_postgres and _engine:
        from sqlalchemy import text
        with _engine.connect() as conn:
            rows = conn.execute(
                text("SELECT id, category, question_type, prompt_text, options, correct_answer, is_reverse FROM assessment_questions")
            ).fetchall()
            for r in rows:
                bank_map[r[0]] = {
                    "id": r[0],
                    "category": r[1],
                    "question_type": r[2],
                    "prompt_text": r[3],
                    "options": r[4],
                    "correct_answer": r[5],
                    "is_reverse": bool(r[6])
                }
    else:
        conn = get_sqlite_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, category, question_type, prompt_text, options, correct_answer, is_reverse FROM assessment_questions")
        rows = cur.fetchall()
        for r in rows:
            bank_map[r["id"]] = {
                "id": r["id"],
                "category": r["category"],
                "question_type": r["question_type"],
                "prompt_text": r["prompt_text"],
                "options": r["options"],
                "correct_answer": r["correct_answer"],
                "is_reverse": bool(r["is_reverse"])
            }
        conn.close()
    return bank_map


def save_assessment_submission(user_id: Optional[str], raw_scores: Dict[str, float], composite_score: float, tier: str, ai_analysis: Dict[str, Any], responses: List[Dict[str, Any]]) -> str:
    """Saves assessment result and returns the record ID."""
    import uuid
    record_id = str(uuid.uuid4())

    if _use_postgres and _engine:
        from sqlalchemy import text
        try:
            with _engine.begin() as conn:
                conn.execute(
                    text("""
                        INSERT INTO assessment_results (id, user_id, raw_scores, composite_score, tier, ai_analysis, responses)
                        VALUES (:id, :user_id, :raw_scores, :composite_score, :tier, :ai_analysis, :responses)
                    """),
                    {
                        "id": record_id,
                        "user_id": user_id if user_id else None,
                        "raw_scores": json.dumps(raw_scores),
                        "composite_score": composite_score,
                        "tier": tier,
                        "ai_analysis": json.dumps(ai_analysis),
                        "responses": json.dumps(responses)
                    }
                )
        except Exception as e:
            print(f"[Assessment DB] Error saving to PostgreSQL: {e}")

    # SQLite
    else:
        conn = get_sqlite_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO assessment_results (id, user_id, raw_scores, composite_score, tier, ai_analysis, responses)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            record_id,
            user_id,
            json.dumps(raw_scores),
            composite_score,
            tier,
            json.dumps(ai_analysis),
            json.dumps(responses)
        ))
        conn.commit()
        conn.close()

    # Dual-record into submissions table for unified platform metrics
    try:
        record_submission(
            session_id=record_id,
            user_id=user_id,
            iq_score=round(raw_scores.get("IQ", 60.0)),
            eq_score=round(raw_scores.get("EQ", 60.0)),
            sq_score=round(raw_scores.get("SQ", 60.0)),
            aq_score=round(raw_scores.get("AQ", 60.0)),
            test_type="ASSESSMENT_4D",
            archetype_title=ai_analysis.get("archetypeTitle") if isinstance(ai_analysis, dict) else None
        )
    except Exception as e:
        print(f"[Assessment DB] Dual-record to submissions notice: {e}")

    return record_id

