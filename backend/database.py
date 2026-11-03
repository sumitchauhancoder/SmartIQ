"""
Database management module for SmartIQ.
Uses SQLite for zero-configuration, reliable persistence of questions, test sessions, and psychometric metrics.
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from questions_seed import SEEDED_QUESTIONS

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "smartiq.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes SQLite tables and seeds default psychometric questions if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    # Questions Table
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Submissions / Analytics Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            iq_score INTEGER NOT NULL,
            iq_breakdown_json TEXT NOT NULL,
            eq_score INTEGER NOT NULL,
            eq_breakdown_json TEXT NOT NULL,
            tab_switch_count INTEGER DEFAULT 0,
            archetype_title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Check if questions exist
    cursor.execute("SELECT COUNT(*) as count FROM questions")
    count = cursor.fetchone()["count"]

    if count == 0:
        for q in SEEDED_QUESTIONS:
            cursor.execute("""
                INSERT INTO questions (
                    category_type, sub_category, question_text, diagram_svg,
                    options_json, correct_answer_index, points_json, explanation, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                q["category_type"],
                q["sub_category"],
                q["question_text"],
                q.get("diagram_svg"),
                json.dumps(q["options"]),
                q["correct_answer_index"],
                json.dumps(q.get("points", [1, 2, 3, 4] if q["category_type"] == "EQ" else [0, 0, 0, 0])),
                q["explanation"]
            ))
        conn.commit()

    conn.close()


def get_active_questions(category_type: Optional[str] = None, limit: Optional[int] = None, randomize: bool = True) -> List[Dict[str, Any]]:
    """Fetches active questions, optionally filtered by IQ/EQ and randomized."""
    conn = get_connection()
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
            "explanation": row["explanation"]
        })
    return questions


def get_all_questions_admin() -> List[Dict[str, Any]]:
    """Fetches all questions for administrative review."""
    conn = get_connection()
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
            "is_active": bool(row["is_active"]),
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
    points: Optional[List[int]] = None
) -> int:
    """Inserts a new question into the pool."""
    conn = get_connection()
    cursor = conn.cursor()

    if points is None:
        points = [1, 2, 3, 4] if category_type.upper() == "EQ" else [0, 0, 0, 0]

    cursor.execute("""
        INSERT INTO questions (
            category_type, sub_category, question_text, diagram_svg,
            options_json, correct_answer_index, points_json, explanation, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    """, (
        category_type.upper(),
        sub_category,
        question_text,
        diagram_svg,
        json.dumps(options),
        correct_answer_index,
        json.dumps(points),
        explanation
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def delete_admin_question(question_id: int) -> bool:
    """Soft deletes or removes question from the pool."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM questions WHERE id = ?", (question_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def record_submission(
    session_id: str,
    iq_score: int,
    iq_breakdown: Dict[str, int],
    eq_score: int,
    eq_breakdown: Dict[str, int],
    tab_switch_count: int,
    archetype_title: Optional[str] = None
) -> int:
    """Records an anonymized completed test submission for metrics."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO submissions (
            session_id, iq_score, iq_breakdown_json, eq_score, eq_breakdown_json, tab_switch_count, archetype_title
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        session_id,
        iq_score,
        json.dumps(iq_breakdown),
        eq_score,
        json.dumps(eq_breakdown),
        tab_switch_count,
        archetype_title
    ))
    conn.commit()
    sub_id = cursor.lastrowid
    conn.close()
    return sub_id


def get_admin_stats() -> Dict[str, Any]:
    """Computes aggregated platform metrics and performance distributions."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM submissions")
    total_tests = cursor.fetchone()["total"]

    if total_tests == 0:
        conn.close()
        return {
            "total_tests": 0,
            "average_iq": 100,
            "average_eq": 100,
            "tab_switch_rate": 0.0,
            "iq_distribution": {"below_average": 0, "average": 0, "gifted": 0, "genius": 0},
            "recent_submissions": []
        }

    cursor.execute("""
        SELECT 
            AVG(iq_score) as avg_iq,
            AVG(eq_score) as avg_eq,
            AVG(tab_switch_count) as avg_switches
        FROM submissions
    """)
    stats_row = cursor.fetchone()

    # IQ Distribution buckets (Normalized score range ~ 85 - 145)
    cursor.execute("""
        SELECT 
            SUM(CASE WHEN iq_score < 90 THEN 1 ELSE 0 END) as below_average,
            SUM(CASE WHEN iq_score >= 90 AND iq_score < 115 THEN 1 ELSE 0 END) as average,
            SUM(CASE WHEN iq_score >= 115 AND iq_score < 130 THEN 1 ELSE 0 END) as gifted,
            SUM(CASE WHEN iq_score >= 130 THEN 1 ELSE 0 END) as genius
        FROM submissions
    """)
    dist_row = cursor.fetchone()

    # Recent submissions
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
