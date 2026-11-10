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
                        "points": json.dumps(q.get("points", [1, 2, 3, 4] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                        "explanation": q["explanation"],
                        "image_url": q.get("image_url"),
                        "is_spatial": bool(q.get("is_spatial", False))
                    })
                    seeded_count += 1
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
                json.dumps(q.get("points", [1, 2, 3, 4] if q["category_type"] in ("EQ", "SQ", "AQ") else [0, 0, 0, 0])),
                q["explanation"],
                q.get("image_url"),
                1 if q.get("is_spatial") else 0
            ))
            seeded_count += 1
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
                    "sub_category": r.get("sub_category"),
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
            "sub_category": row["sub_category"],
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
                    "sub_category": r.get("sub_category"),
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
            "sub_category": row["sub_category"],
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
    """Computes aggregated platform metrics and performance distributions across IQ, EQ, SQ, and AQ."""
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
                        "average_iq": 100,
                        "average_eq": 100,
                        "average_sq": 100,
                        "average_aq": 100,
                        "tab_switch_rate": 0.0,
                        "pool_distribution": pool_distribution,
                        "iq_distribution": {"below_average": 0, "average": 0, "gifted": 0, "genius": 0},
                        "recent_submissions": []
                    }

                avg_row = conn.execute(text("""
                    SELECT 
                        AVG(iq_score) as avg_iq,
                        AVG(eq_score) as avg_eq,
                        AVG(sq_score) as avg_sq,
                        AVG(aq_score) as avg_aq,
                        AVG(tab_switch_count) as avg_switches
                    FROM submissions
                """)).mappings().first()

                dist_row = conn.execute(text("""
                    SELECT 
                        COALESCE(SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 90 THEN 1 ELSE 0 END), 0) as below_average,
                        COALESCE(SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 90 AND COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 115 THEN 1 ELSE 0 END), 0) as average,
                        COALESCE(SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 115 AND COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 130 THEN 1 ELSE 0 END), 0) as gifted,
                        COALESCE(SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 130 THEN 1 ELSE 0 END), 0) as genius
                    FROM submissions
                """)).mappings().first()

                recent_rows = conn.execute(text("""
                    SELECT session_id, iq_score, eq_score, sq_score, aq_score, test_type, tab_switch_count, archetype_title, created_at
                    FROM submissions
                    ORDER BY id DESC
                    LIMIT 10
                """)).mappings().all()

                return {
                    "total_tests": total_tests,
                    "average_iq": round(float(avg_row["avg_iq"] or 100), 1),
                    "average_eq": round(float(avg_row["avg_eq"] or 100), 1),
                    "average_sq": round(float(avg_row["avg_sq"] or 100), 1),
                    "average_aq": round(float(avg_row["avg_aq"] or 100), 1),
                    "tab_switch_rate": round(float(avg_row["avg_switches"] or 0.0), 2),
                    "pool_distribution": pool_distribution,
                    "iq_distribution": {
                        "below_average": int(dist_row["below_average"]),
                        "average": int(dist_row["average"]),
                        "gifted": int(dist_row["gifted"]),
                        "genius": int(dist_row["genius"])
                    },
                    "recent_submissions": [dict(r) for r in recent_rows]
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
            "average_iq": 100,
            "average_eq": 100,
            "average_sq": 100,
            "average_aq": 100,
            "tab_switch_rate": 0.0,
            "pool_distribution": pool_distribution,
            "iq_distribution": {"below_average": 0, "average": 0, "gifted": 0, "genius": 0},
            "recent_submissions": []
        }

    cursor.execute("""
        SELECT 
            AVG(iq_score) as avg_iq,
            AVG(eq_score) as avg_eq,
            AVG(sq_score) as avg_sq,
            AVG(aq_score) as avg_aq,
            AVG(tab_switch_count) as avg_switches
        FROM submissions
    """)
    stats_row = cursor.fetchone()

    cursor.execute("""
        SELECT 
            SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 90 THEN 1 ELSE 0 END) as below_average,
            SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 90 AND COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 115 THEN 1 ELSE 0 END) as average,
            SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 115 AND COALESCE(iq_score, eq_score, sq_score, aq_score, 100) < 130 THEN 1 ELSE 0 END) as gifted,
            SUM(CASE WHEN COALESCE(iq_score, eq_score, sq_score, aq_score, 100) >= 130 THEN 1 ELSE 0 END) as genius
        FROM submissions
    """)
    dist_row = cursor.fetchone()

    cursor.execute("""
        SELECT session_id, iq_score, eq_score, sq_score, aq_score, test_type, tab_switch_count, archetype_title, created_at
        FROM submissions
        ORDER BY id DESC
        LIMIT 10
    """)
    recent = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return {
        "total_tests": total_tests,
        "average_iq": round(stats_row["avg_iq"] or 100, 1) if stats_row["avg_iq"] else 100,
        "average_eq": round(stats_row["avg_eq"] or 100, 1) if stats_row["avg_eq"] else 100,
        "average_sq": round(stats_row["avg_sq"] or 100, 1) if stats_row["avg_sq"] else 100,
        "average_aq": round(stats_row["avg_aq"] or 100, 1) if stats_row["avg_aq"] else 100,
        "tab_switch_rate": round(stats_row["avg_switches"] or 0.0, 2) if stats_row["avg_switches"] else 0.0,
        "pool_distribution": pool_distribution,
        "iq_distribution": {
            "below_average": dist_row["below_average"] or 0,
            "average": dist_row["average"] or 0,
            "gifted": dist_row["gifted"] or 0,
            "genius": dist_row["genius"] or 0
        },
        "recent_submissions": recent
    }

    cursor.execute("""
        SELECT session_id, iq_score, eq_score, tab_switch_count, archetype_title, created_at
        FROM submissions
        ORDER BY id DESC
        LIMIT 10
    """)
    recent = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return {
        "total_tests": total_tests,
        "average_iq": round(stats_row["avg_iq"] or 100, 1),
        "average_eq": round(stats_row["avg_eq"] or 100, 1),
        "tab_switch_rate": round(stats_row["avg_switches"] or 0.0, 2),
        "iq_distribution": {
            "below_average": dist_row["below_average"] or 0,
            "average": dist_row["average"] or 0,
            "gifted": dist_row["gifted"] or 0,
            "genius": dist_row["genius"] or 0
        },
        "recent_submissions": recent
    }
