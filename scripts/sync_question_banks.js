const fs = require('fs');
const path = require('path');

const assessmentBank = JSON.parse(fs.readFileSync(path.join(__dirname, '../backend/assessment_bank.json'), 'utf8'));

const iqExplanations = {
  "IQ_01": "Letter sequence skips +3, +4, +5, +6: B(2)->E(5)->I(9)->N(14)->T(20). Number sequence is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30. Next term is T30.",
  "IQ_02": "A planet is bound by and moves along an orbit; an element is positioned within and bounded by a matrix.",
  "IQ_03": "Since all C are contained in B, and no A intersects B, it is logically impossible for any A to be C (No A are C).",
  "IQ_04": "The pattern is (First * Third) - 2: (4 * 5) - 2 = 18; (6 * 5) - 2 = 28; therefore (7 * 4) - 2 = 26.",
  "IQ_05": "121 (11²), 169 (13²), and 289 (17²) are squares of prime numbers. 225 (15²) is the square of a composite number.",
  "IQ_06": "Letters correspond directly to their alphabetical positions: 20=T, 18=R, 21=U, 5=E -> TRUE.",
  "IQ_07": "Starting North (0°), turn 135° clockwise to Southeast (135°), then 225° counter-clockwise: 135° - 225° = -90° (90° counter-clockwise from North = West).",
  "IQ_08": "Differences between terms triple each step: +2, +6, +18, +54. Next difference is 54 * 3 = +162; 83 + 162 = 245.",
  "IQ_09": "All coders drink coffee. Since some artists belong to the group of coders, those specific artists must also drink coffee.",
  "IQ_10": "First letters step back by 2 (Z, X, V, T, R). Middle numbers are squares (1², 2², 3², 4², 5²=25). Last letters step forward by 2 (A, C, E, G, I). Answer: R25I.",
  "IQ_11": "Differences increase by +2 each step: +4, +6, +8, +10. Next difference is +12; 30 + 12 = 42 (also n*(n+1): 6*7 = 42).",
  "IQ_12": "A catalyst triggers or accelerates a chemical reaction; a spark triggers an ignition.",
  "IQ_13": "Formula: (a * b) + (a + b): (3*4)+(3+4)=19; (5*2)+(5+2)=17; (4*6)+(4+6)=24+10=34.",
  "IQ_14": "At 3:30, minute hand is at 180° (6 o'clock). Hour hand is halfway between 3 and 4: 3.5 * 30° = 105°. Separation angle = 180° - 105° = 75°.",
  "IQ_15": "Pairs are opposite alphabet letters: A-Z, G-T, M-N, S-H, Y-B. First letters step by +6: A(1)->G(7)->M(13)->S(19)->Y(25). Answer: SH.",
  "IQ_16": "Modus Tollens logic: 'If P then Q; Not Q; Therefore Not P'. Since the ground is dry, it did not rain.",
  "IQ_17": "The formula across rows is Left + (3 * Right) = Center: 8 + (3*4) = 20; 10 + (3*5) = 25; 12 + (3*6) = 30.",
  "IQ_18": "27 (3³), 64 (4³), and 125 (5³) are cubes of positive integers. 144 (12²) is a perfect square, not a cube.",
  "IQ_19": "Fibonacci summation: each term is the sum of the two preceding numbers: 5 + 8 = 13, then 8 + 13 = 21.",
  "IQ_20": "Sum of letter positions: S(19) + T(20) + O(15) + P(16) = 70."
};

const iqSubCategories = {
  "IQ_01": "Sequence",
  "IQ_02": "Analogy",
  "IQ_03": "Logic",
  "IQ_04": "Math",
  "IQ_05": "Math",
  "IQ_06": "Logic",
  "IQ_07": "Spatial",
  "IQ_08": "Sequence",
  "IQ_09": "Logic",
  "IQ_10": "Spatial",
  "IQ_11": "Sequence",
  "IQ_12": "Analogy",
  "IQ_13": "Math",
  "IQ_14": "Spatial",
  "IQ_15": "Sequence",
  "IQ_16": "Logic",
  "IQ_17": "Math",
  "IQ_18": "Math",
  "IQ_19": "Sequence",
  "IQ_20": "Logic"
};

const likertOptions = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree"
];

const forwardPoints = [1, 2, 3, 4, 5];
const reversePoints = [5, 4, 3, 2, 1];

const seededQuestions = [];
let idCounter = 1;

// 1. Process IQ Questions (IDs 1-20)
assessmentBank.IQ.forEach((q) => {
  const cleanQuestion = q.question.replace(/\s+/g, ' ').replace('counter- clockwise', 'counter-clockwise').trim();
  const points = [0, 0, 0, 0];
  points[q.correctIndex] = 1;

  seededQuestions.push({
    id: idCounter++,
    category_type: "IQ",
    sub_category: iqSubCategories[q.id] || "Logic",
    question_text: cleanQuestion,
    options: q.options,
    correct_answer_index: q.correctIndex,
    explanation: iqExplanations[q.id] || `The correct answer is ${q.options[q.correctIndex]}.`,
    is_spatial: ["IQ_07", "IQ_10", "IQ_14"].includes(q.id),
    image_url: null,
    diagram_svg: null,
    points: points
  });
});

// 2. Process EQ Questions (IDs 21-40)
const eqSubCategories = {
  "EQ_01": "Self-Awareness",
  "EQ_02": "Self-Regulation",
  "EQ_03": "Empathy",
  "EQ_04": "Self-Regulation",
  "EQ_05": "Self-Regulation",
  "EQ_06": "Self-Awareness",
  "EQ_07": "Empathy",
  "EQ_08": "Self-Regulation",
  "EQ_09": "Self-Awareness",
  "EQ_10": "Self-Awareness",
  "EQ_11": "Self-Regulation",
  "EQ_12": "Self-Regulation",
  "EQ_13": "Self-Regulation",
  "EQ_14": "Self-Regulation",
  "EQ_15": "Self-Awareness",
  "EQ_16": "Empathy",
  "EQ_17": "Self-Awareness",
  "EQ_18": "Empathy",
  "EQ_19": "Empathy",
  "EQ_20": "Self-Regulation"
};

assessmentBank.EQ.forEach((q) => {
  const isRev = !!q.isReverse;
  seededQuestions.push({
    id: idCounter++,
    category_type: "EQ",
    sub_category: eqSubCategories[q.id] || "Emotional Intelligence",
    question_text: q.statement.trim(),
    options: likertOptions,
    correct_answer_index: isRev ? 0 : 4,
    explanation: isRev 
      ? "Lower agreement indicates higher emotional resilience and mature self-regulation."
      : "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    is_spatial: false,
    image_url: null,
    diagram_svg: null,
    points: isRev ? [...reversePoints] : [...forwardPoints]
  });
});

// 3. Process SQ Questions (IDs 41-60)
const sqSubCategories = {
  "SQ_01": "Social Navigation",
  "SQ_02": "Social Navigation",
  "SQ_03": "Interpersonal Influence",
  "SQ_04": "Active Listening & Empathy",
  "SQ_05": "Social Navigation",
  "SQ_06": "Interpersonal Influence",
  "SQ_07": "Interpersonal Influence",
  "SQ_08": "Active Listening & Empathy",
  "SQ_09": "Interpersonal Influence",
  "SQ_10": "Social Navigation",
  "SQ_11": "Social Navigation",
  "SQ_12": "Active Listening & Empathy",
  "SQ_13": "Social Navigation",
  "SQ_14": "Active Listening & Empathy",
  "SQ_15": "Active Listening & Empathy",
  "SQ_16": "Interpersonal Influence",
  "SQ_17": "Interpersonal Influence",
  "SQ_18": "Social Navigation",
  "SQ_19": "Active Listening & Empathy",
  "SQ_20": "Interpersonal Influence"
};

assessmentBank.SQ.forEach((q) => {
  const isRev = !!q.isReverse;
  seededQuestions.push({
    id: idCounter++,
    category_type: "SQ",
    sub_category: sqSubCategories[q.id] || "Social Intelligence",
    question_text: q.statement.trim(),
    options: likertOptions,
    correct_answer_index: isRev ? 0 : 4,
    explanation: isRev 
      ? "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings."
      : "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    is_spatial: false,
    image_url: null,
    diagram_svg: null,
    points: isRev ? [...reversePoints] : [...forwardPoints]
  });
});

// 4. Process AQ Questions (IDs 61-80)
const aqSubCategories = {
  "AQ_01": "Resilience & Tenacity",
  "AQ_02": "Resilience & Tenacity",
  "AQ_03": "Crisis Ownership",
  "AQ_04": "Agility & Adaptability",
  "AQ_05": "Resilience & Tenacity",
  "AQ_06": "Agility & Adaptability",
  "AQ_07": "Crisis Ownership",
  "AQ_08": "Crisis Ownership",
  "AQ_09": "Resilience & Tenacity",
  "AQ_10": "Agility & Adaptability",
  "AQ_11": "Resilience & Tenacity",
  "AQ_12": "Resilience & Tenacity",
  "AQ_13": "Crisis Ownership",
  "AQ_14": "Resilience & Tenacity",
  "AQ_15": "Resilience & Tenacity",
  "AQ_16": "Crisis Ownership",
  "AQ_17": "Agility & Adaptability",
  "AQ_18": "Agility & Adaptability",
  "AQ_19": "Resilience & Tenacity",
  "AQ_20": "Crisis Ownership"
};

assessmentBank.AQ.forEach((q) => {
  const isRev = !!q.isReverse;
  seededQuestions.push({
    id: idCounter++,
    category_type: "AQ",
    sub_category: aqSubCategories[q.id] || "Adversity Quotient",
    question_text: q.statement.trim(),
    options: likertOptions,
    correct_answer_index: isRev ? 0 : 4,
    explanation: isRev 
      ? "Lower agreement indicates high composure and steady focus under unforeseen disruption."
      : "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    is_spatial: false,
    image_url: null,
    diagram_svg: null,
    points: isRev ? [...reversePoints] : [...forwardPoints]
  });
});

console.log(`Generated ${seededQuestions.length} total questions:`);
console.log(`- IQ: ${seededQuestions.filter(q => q.category_type === 'IQ').length}`);
console.log(`- EQ: ${seededQuestions.filter(q => q.category_type === 'EQ').length}`);
console.log(`- SQ: ${seededQuestions.filter(q => q.category_type === 'SQ').length}`);
console.log(`- AQ: ${seededQuestions.filter(q => q.category_type === 'AQ').length}`);

// Write backend/questions_seed.py
const pyContent = `"""
Pre-seeded Question Pool for SmartIQ / Enigma
Official 80-Item Psychometric Assessment Bank from psychometric_assessment_bank.pdf
20 IQ Multiple-Choice Questions + 60 EQ/SQ/AQ Likert Statements
"""
import json

SEEDED_QUESTIONS = ${JSON.stringify(seededQuestions, null, 2).replace(/: false/g, ': False').replace(/: true/g, ': True').replace(/: null/g, ': None')}
`;
fs.writeFileSync(path.join(__dirname, '../backend/questions_seed.py'), pyContent, 'utf8');
console.log("Successfully wrote backend/questions_seed.py");

// Write frontend/src/data/fallbackQuestions.js
const jsContent = `/**
 * Offline & Mobile Fallback Question Bank for SmartIQ / Enigma
 * Official 80-Item Psychometric Assessment Bank (20 IQ, 20 EQ, 20 SQ, 20 AQ)
 * Sourced directly from psychometric_assessment_bank.pdf
 */

export const FALLBACK_QUESTIONS = ${JSON.stringify(seededQuestions, null, 2)};

/**
 * Returns a randomized subset of questions for any test category ('IQ', 'EQ', 'SQ', 'AQ').
 * Shuffles questions so users receive a fresh set of 10 questions on every attempt.
 */
export function getFallbackQuestions(type, limit = 10) {
  const filtered = FALLBACK_QUESTIONS.filter(
    (q) => !type || q.category_type.toUpperCase() === type.toUpperCase()
  );
  // True Fisher-Yates / random shuffle
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}
`;
fs.writeFileSync(path.join(__dirname, '../frontend/src/data/fallbackQuestions.js'), jsContent, 'utf8');
console.log("Successfully wrote frontend/src/data/fallbackQuestions.js");

// Write backend/supabase_sync_questions.sql
let sql = `-- =========================================================================
-- SQL Migration Script: Synchronize 'questions' Table with Official 80-Item Psychometric Assessment Bank
-- Run this script in the Supabase SQL Editor to wipe legacy questions and insert the official 80 questions.
-- =========================================================================

TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (
    category_type, sub_category, question_text, diagram_svg,
    options, correct_answer_index, points, explanation, image_url, is_spatial
) VALUES
`;

const sqlValues = seededQuestions.map((q) => {
  const cat = `'${q.category_type}'`;
  const sub = `'${q.sub_category.replace(/'/g, "''")}'`;
  const text = `'${q.question_text.replace(/'/g, "''")}'`;
  const svg = 'NULL';
  const opts = `'${JSON.stringify(q.options).replace(/'/g, "''")}'::jsonb`;
  const correct = q.correct_answer_index;
  const pts = `'${JSON.stringify(q.points)}'::jsonb`;
  const exp = `'${q.explanation.replace(/'/g, "''")}'`;
  const img = 'NULL';
  const spatial = q.is_spatial ? 'TRUE' : 'FALSE';

  return `(${cat}, ${sub}, ${text}, ${svg}, ${opts}, ${correct}, ${pts}, ${exp}, ${img}, ${spatial})`;
});

sql += sqlValues.join(',\n') + ';\n';

fs.writeFileSync(path.join(__dirname, '../backend/supabase_sync_questions.sql'), sql, 'utf8');
console.log("Successfully wrote backend/supabase_sync_questions.sql");
