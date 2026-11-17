import json
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "smartiq.db")
JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assessment_bank.json")

def seed():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Create assessment_questions table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS assessment_questions (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            question_type TEXT NOT NULL,
            prompt_text TEXT NOT NULL,
            options TEXT,
            correct_answer TEXT,
            is_reverse INTEGER DEFAULT 0
        )
    """)

    # Create assessment_results table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS assessment_results (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            scores TEXT NOT NULL,
            tiers TEXT NOT NULL,
            report_data TEXT NOT NULL,
            is_fallback INTEGER DEFAULT 0,
            timeout_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    total_inserted = 0
    # 1. Seed IQ
    for item in bank.get("IQ", []):
        correct_str = item["options"][item.get("correctIndex", 0)]
        cur.execute("""
            INSERT OR REPLACE INTO assessment_questions (id, category, question_type, prompt_text, options, correct_answer, is_reverse)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            item["id"],
            "IQ",
            "mcq",
            item["question"],
            json.dumps(item["options"]),
            correct_str,
            0
        ))
        total_inserted += 1

    # 2. Seed EQ, SQ, AQ
    for cat in ["EQ", "SQ", "AQ"]:
        for item in bank.get(cat, []):
            cur.execute("""
                INSERT OR REPLACE INTO assessment_questions (id, category, question_type, prompt_text, options, correct_answer, is_reverse)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                item["id"],
                cat,
                "likert",
                item["statement"],
                None,
                None,
                1 if item.get("isReverse", False) else 0
            ))
            total_inserted += 1

    conn.commit()
    conn.close()
    print(f"Successfully seeded {total_inserted} questions into assessment_questions table in {DB_PATH}")

if __name__ == "__main__":
    seed()
