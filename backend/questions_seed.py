"""
Pre-seeded Question Pool for SmartIQ / Enigma
Official 80-Item Psychometric Assessment Bank from psychometric_assessment_bank.pdf
20 IQ Multiple-Choice Questions + 60 EQ/SQ/AQ Likert Statements
"""
import json

SEEDED_QUESTIONS = [
  {
    "id": 1,
    "category_type": "IQ",
    "sub_category": "Sequence",
    "question_text": "Sequence: B2, E6, I12, N20, ?",
    "options": [
      "T30",
      "S30",
      "T28",
      "U30"
    ],
    "correct_answer_index": 0,
    "explanation": "Letter sequence skips +3, +4, +5, +6: B(2)->E(5)->I(9)->N(14)->T(20). Number sequence is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30. Next term is T30.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 2,
    "category_type": "IQ",
    "sub_category": "Analogy",
    "question_text": "Analogy: ORBIT : PLANET :: MATRIX : ?",
    "options": [
      "ELEMENT",
      "NUMBER",
      "SPACE",
      "GRID"
    ],
    "correct_answer_index": 0,
    "explanation": "A planet is bound by and moves along an orbit; an element is positioned within and bounded by a matrix.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 3,
    "category_type": "IQ",
    "sub_category": "Logic",
    "question_text": "Logic: No A are B. All C are B. Which statement must be true?",
    "options": [
      "No A are C",
      "Some A are C",
      "All B are C",
      "Some C are A"
    ],
    "correct_answer_index": 0,
    "explanation": "Since all C are contained in B, and no A intersects B, it is logically impossible for any A to be C (No A are C).",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 4,
    "category_type": "IQ",
    "sub_category": "Math",
    "question_text": "Number Pattern: 4 (18) 5 | 6 (28) 5 | 7 (?) 4",
    "options": [
      "26",
      "28",
      "30",
      "24"
    ],
    "correct_answer_index": 0,
    "explanation": "The pattern is (First * Third) - 2: (4 * 5) - 2 = 18; (6 * 5) - 2 = 28; therefore (7 * 4) - 2 = 26.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 5,
    "category_type": "IQ",
    "sub_category": "Math",
    "question_text": "Odd One Out: 121, 169, 225, 289",
    "options": [
      "225",
      "121",
      "169",
      "289"
    ],
    "correct_answer_index": 0,
    "explanation": "121 (11²), 169 (13²), and 289 (17²) are squares of prime numbers. 225 (15²) is the square of a composite number.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 6,
    "category_type": "IQ",
    "sub_category": "Logic",
    "question_text": "Code: If MIND = 13-9-14-4, what word is 20-18-21-5?",
    "options": [
      "TRUE",
      "TREE",
      "TUNE",
      "TIRE"
    ],
    "correct_answer_index": 0,
    "explanation": "Letters correspond directly to their alphabetical positions: 20=T, 18=R, 21=U, 5=E -> TRUE.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 7,
    "category_type": "IQ",
    "sub_category": "Spatial",
    "question_text": "Direction: Face North, turn 135° clockwise, then 225° counter-clockwise. Final direction?",
    "options": [
      "West",
      "East",
      "South-West",
      "North-West"
    ],
    "correct_answer_index": 0,
    "explanation": "Starting North (0°), turn 135° clockwise to Southeast (135°), then 225° counter-clockwise: 135° - 225° = -90° (90° counter-clockwise from North = West).",
    "is_spatial": True,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 8,
    "category_type": "IQ",
    "sub_category": "Sequence",
    "question_text": "Sequence: 3, 5, 11, 29, 83, ?",
    "options": [
      "245",
      "249",
      "241",
      "253"
    ],
    "correct_answer_index": 0,
    "explanation": "Differences between terms triple each step: +2, +6, +18, +54. Next difference is 54 * 3 = +162; 83 + 162 = 245.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 9,
    "category_type": "IQ",
    "sub_category": "Logic",
    "question_text": "Logic: All coders drink coffee. Some artists are coders. Therefore:",
    "options": [
      "Some artists drink coffee",
      "All coffee drinkers are artists",
      "All artists drink coffee",
      "No artists drink coffee"
    ],
    "correct_answer_index": 0,
    "explanation": "All coders drink coffee. Since some artists belong to the group of coders, those specific artists must also drink coffee.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 10,
    "category_type": "IQ",
    "sub_category": "Spatial",
    "question_text": "Pattern: Z1A, X4C, V9E, T16G, ?",
    "options": [
      "R25I",
      "S25I",
      "R25H",
      "Q25I"
    ],
    "correct_answer_index": 0,
    "explanation": "First letters step back by 2 (Z, X, V, T, R). Middle numbers are squares (1², 2², 3², 4², 5²=25). Last letters step forward by 2 (A, C, E, G, I). Answer: R25I.",
    "is_spatial": True,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 11,
    "category_type": "IQ",
    "sub_category": "Sequence",
    "question_text": "Sequence: 2, 6, 12, 20, 30, ?",
    "options": [
      "42",
      "40",
      "44",
      "36"
    ],
    "correct_answer_index": 0,
    "explanation": "Differences increase by +2 each step: +4, +6, +8, +10. Next difference is +12; 30 + 12 = 42 (also n*(n+1): 6*7 = 42).",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 12,
    "category_type": "IQ",
    "sub_category": "Analogy",
    "question_text": "Analogy: CATALYST : REACTION :: SPARK : ?",
    "options": [
      "IGNITION",
      "FLAME",
      "SMOKE",
      "HEAT"
    ],
    "correct_answer_index": 0,
    "explanation": "A catalyst triggers or accelerates a chemical reaction; a spark triggers an ignition.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 13,
    "category_type": "IQ",
    "sub_category": "Math",
    "question_text": "Math Logic: If 3 * 4 = 19 and 5 * 2 = 17, what is 4 * 6?",
    "options": [
      "34",
      "24",
      "30",
      "28"
    ],
    "correct_answer_index": 0,
    "explanation": "Formula: (a * b) + (a + b): (3*4)+(3+4)=19; (5*2)+(5+2)=17; (4*6)+(4+6)=24+10=34.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 14,
    "category_type": "IQ",
    "sub_category": "Spatial",
    "question_text": "Clock Logic: What is the smaller angle between clock hands at 3:30?",
    "options": [
      "75°",
      "90°",
      "60°",
      "80°"
    ],
    "correct_answer_index": 0,
    "explanation": "At 3:30, minute hand is at 180° (6 o'clock). Hour hand is halfway between 3 and 4: 3.5 * 30° = 105°. Separation angle = 180° - 105° = 75°.",
    "is_spatial": True,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 15,
    "category_type": "IQ",
    "sub_category": "Sequence",
    "question_text": "Series: AZ, GT, MN, ?, YB",
    "options": [
      "SH",
      "RI",
      "TH",
      "SG"
    ],
    "correct_answer_index": 0,
    "explanation": "Pairs are opposite alphabet letters: A-Z, G-T, M-N, S-H, Y-B. First letters step by +6: A(1)->G(7)->M(13)->S(19)->Y(25). Answer: SH.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 16,
    "category_type": "IQ",
    "sub_category": "Logic",
    "question_text": "Logic: If it rains, the ground gets wet. The ground is dry. Therefore:",
    "options": [
      "It did not rain",
      "It rained lightly",
      "It will rain soon",
      "Cannot be determined"
    ],
    "correct_answer_index": 0,
    "explanation": "Modus Tollens logic: 'If P then Q; Not Q; Therefore Not P'. Since the ground is dry, it did not rain.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 17,
    "category_type": "IQ",
    "sub_category": "Math",
    "question_text": "Number Grid: 8 (20) 4 | 10 (25) 5 | 12 (?) 6",
    "options": [
      "30",
      "28",
      "36",
      "24"
    ],
    "correct_answer_index": 0,
    "explanation": "The formula across rows is Left + (3 * Right) = Center: 8 + (3*4) = 20; 10 + (3*5) = 25; 12 + (3*6) = 30.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 18,
    "category_type": "IQ",
    "sub_category": "Math",
    "question_text": "Odd One Out: 27, 64, 125, 144",
    "options": [
      "144",
      "27",
      "64",
      "125"
    ],
    "correct_answer_index": 0,
    "explanation": "27 (3³), 64 (4³), and 125 (5³) are cubes of positive integers. 144 (12²) is a perfect square, not a cube.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 19,
    "category_type": "IQ",
    "sub_category": "Sequence",
    "question_text": "Sequence: 1, 1, 2, 3, 5, 8, 13, ?",
    "options": [
      "21",
      "19",
      "24",
      "20"
    ],
    "correct_answer_index": 0,
    "explanation": "Fibonacci summation: each term is the sum of the two preceding numbers: 5 + 8 = 13, then 8 + 13 = 21.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 20,
    "category_type": "IQ",
    "sub_category": "Logic",
    "question_text": "Code: If FAST = 43 and SLOW = 69, what is STOP?",
    "options": [
      "70",
      "68",
      "72",
      "66"
    ],
    "correct_answer_index": 0,
    "explanation": "Sum of letter positions: S(19) + T(20) + O(15) + P(16) = 70.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "id": 21,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "I know exactly why my mood changes.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 22,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I stay calm when others around me panic.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 23,
    "category_type": "EQ",
    "sub_category": "Empathy",
    "question_text": "I easily sense what others are feeling.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 24,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I separate harsh tone from useful feedback.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 25,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I pause and think before reacting when angry.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 26,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "I admit my mistakes openly without defensiveness.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 27,
    "category_type": "EQ",
    "sub_category": "Empathy",
    "question_text": "I notice subtle shifts in a friend's tone of voice.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 28,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I stay composed during heated disagreements.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 29,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "I understand how my stress affects people around me.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 30,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "I can name the exact emotion I am feeling in tough moments.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement indicates strong emotional clarity, empathy, and constructive self-control.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 31,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I get irritated easily when plans go wrong.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 32,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I often say things I regret when upset.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 33,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I take constructive criticism personally.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 34,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I find it hard to calm down once I feel frustrated.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 35,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "I often ignore my feelings until they overwhelm me.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 36,
    "category_type": "EQ",
    "sub_category": "Empathy",
    "question_text": "I struggle to understand why people get emotional.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 37,
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "My mood swings frequently without a clear reason.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 38,
    "category_type": "EQ",
    "sub_category": "Empathy",
    "question_text": "I hold onto resentment long after an argument ends.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 39,
    "category_type": "EQ",
    "sub_category": "Empathy",
    "question_text": "I shut down emotionally during difficult conversations.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 40,
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "I let minor inconveniences ruin my entire day.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates higher emotional resilience and mature self-regulation.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 41,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I make strangers feel comfortable right away.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 42,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I adapt easily to different social groups.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 43,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I know how to defuse awkward group tension.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 44,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I notice immediately when someone feels excluded in a group.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 45,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I remember small personal details about people I meet.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 46,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I can bridge disagreements between two opposing people.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 47,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I read the unwritten social rules of a new environment fast.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 48,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I ask open questions that keep conversations flowing naturally.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 49,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I tailor my communication style to match my audience.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 50,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I build genuine trust across different types of people.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects natural social presence, perspective-taking, and high communicative rapport.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 51,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I find it hard to start conversations with new people.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 52,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I often miss subtle social hints from others.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 53,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I feel awkward in large group gatherings.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 54,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I struggle to keep small talk going.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 55,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I often realize too late that I said the wrong thing socially.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 56,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I prefer working alone rather than navigating group dynamics.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 57,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I find it difficult to persuade skeptical people.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 58,
    "category_type": "SQ",
    "sub_category": "Social Navigation",
    "question_text": "I avoid networking events whenever possible.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 59,
    "category_type": "SQ",
    "sub_category": "Active Listening & Empathy",
    "question_text": "I rarely notice when someone is losing interest in a conversation.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 60,
    "category_type": "SQ",
    "sub_category": "Interpersonal Influence",
    "question_text": "I find group politics confusing and exhausting.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates ease in navigating unfamiliar social dynamics and group settings.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 61,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "Setbacks motivate me to work smarter.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 62,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I bounce back quickly after a major failure.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 63,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "I stay focused on solutions during a crisis.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 64,
    "category_type": "AQ",
    "sub_category": "Agility & Adaptability",
    "question_text": "I adapt quickly when rules or plans change suddenly.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 65,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I keep a setback contained so it does not ruin other areas of life.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 66,
    "category_type": "AQ",
    "sub_category": "Agility & Adaptability",
    "question_text": "I perform well under tight deadlines and high pressure.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 67,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "I view difficult obstacles as temporary challenges to solve.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 68,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "I take full ownership of fixing problems even if I did not cause them.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 69,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I stay persistent on long goals even when progress feels slow.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 70,
    "category_type": "AQ",
    "sub_category": "Agility & Adaptability",
    "question_text": "I extract practical lessons immediately after a rejection.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 4,
    "explanation": "Higher agreement reflects high grit, rapid pivot mindset, and solution-driven optimism in crisis.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": 71,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "Unexpected obstacles easily discourage me.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 72,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I dwell on mistakes long after they happen.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 73,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "I feel overwhelmed when multiple problems happen at once.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 74,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "One major failure makes me doubt my overall abilities.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 75,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I struggle to regain momentum after a project gets canceled.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 76,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "I procrastinate when a task feels overly complex or uncertain.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 77,
    "category_type": "AQ",
    "sub_category": "Agility & Adaptability",
    "question_text": "Sudden changes to my routine stress me out significantly.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 78,
    "category_type": "AQ",
    "sub_category": "Agility & Adaptability",
    "question_text": "I tend to expect the worst outcome during uncertain times.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 79,
    "category_type": "AQ",
    "sub_category": "Resilience & Tenacity",
    "question_text": "I lose motivation quickly if I do not see fast results.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  },
  {
    "id": 80,
    "category_type": "AQ",
    "sub_category": "Crisis Ownership",
    "question_text": "High-pressure situations make it hard for me to think clearly.",
    "options": [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ],
    "correct_answer_index": 0,
    "explanation": "Lower agreement indicates high composure and steady focus under unforeseen disruption.",
    "is_spatial": False,
    "image_url": None,
    "diagram_svg": None,
    "points": [
      5,
      4,
      3,
      2,
      1
    ]
  }
]
