/**
 * Offline & Mobile Fallback Question Bank for SmartIQ / Enigma
 * Contains 80 user-friendly, relatable aptitude & practical dilemmas across IQ, EQ, SQ, and AQ.
 * Features 40 Core questions from project specification + 40 expanded scenarios.
 * Supports visual spatial diagrams and image URLs.
 */

export const FALLBACK_QUESTIONS = [
  {
    "category_type": "IQ",
    "sub_category": "Pattern Logic",
    "question_text": "What number comes next in the sequence: 3, 6, 11, 18, 27, ___?",
    "options": [
      "34",
      "36",
      "38",
      "40"
    ],
    "correct_answer_index": 2,
    "explanation": "The differences between consecutive numbers are +3, +5, +7, +9. The next difference is +11, so 27 + 11 = 38.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 1,
    "points": [
      0,
      0,
      1,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Word Analogy",
    "question_text": "Light is to Glint as Sound is to ___.",
    "options": [
      "Silence",
      "Echo",
      "Noise",
      "Voice"
    ],
    "correct_answer_index": 1,
    "explanation": "A glint is a reflected flash of light; an echo is a reflected sound wave.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 2,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Coding Logic",
    "question_text": "If BCA is coded as 231 and PROJECT is coded as 161815105320, what is the code for GROQ?",
    "options": [
      "7181517",
      "7191517",
      "8181517",
      "7181417"
    ],
    "correct_answer_index": 0,
    "explanation": "Each letter is represented by its alphabetical position: G=7, R=18, O=15, Q=17 -> 7181517.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 3,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Directional Sense",
    "question_text": "You walk 10m North, turn right and walk 10m, then turn left and walk 5m. Which direction are you facing?",
    "options": [
      "North",
      "East",
      "South",
      "West"
    ],
    "correct_answer_index": 0,
    "explanation": "Starting facing North -> turning right faces East -> turning left from East faces North again.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 4,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Fast Arithmetic",
    "question_text": "A bat and a ball cost ₹110 in total. The bat costs ₹100 more than the ball. How much does the ball cost?",
    "options": [
      "₹5",
      "₹10",
      "₹15",
      "₹20"
    ],
    "correct_answer_index": 0,
    "explanation": "Ball = x, Bat = x + ₹100. Total: x + (x + 100) = 110 -> 2x = 10 -> x = ₹5.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 5,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Odd One Out",
    "question_text": "Which number does not belong in this group: 27, 64, 125, 144, 216?",
    "options": [
      "64",
      "125",
      "144",
      "216"
    ],
    "correct_answer_index": 2,
    "explanation": "27=3³, 64=4³, 125=5³, and 216=6³ are all perfect cubes. 144 is 12² (a square, not a cube).",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 6,
    "points": [
      0,
      0,
      1,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Letter Patterns",
    "question_text": "Complete the sequence: AZ, CX, EV, GT, ___.",
    "options": [
      "HS",
      "IR",
      "KP",
      "JQ"
    ],
    "correct_answer_index": 1,
    "explanation": "The first letter advances by +2 (A, C, E, G, I). The second letter moves backward by -2 from Z (Z, X, V, T, R). Hence, IR.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 7,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial & Dice Logic",
    "question_text": "A standard dice is rolled. What is the value directly opposite to the face showing 4?",
    "options": [
      "2",
      "3",
      "5",
      "6"
    ],
    "correct_answer_index": 1,
    "explanation": "On any standard gaming die, opposite faces always sum to 7. 7 - 4 = 3.",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": "<svg viewBox=\"0 0 160 160\" width=\"130\" height=\"130\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"15\" y=\"15\" width=\"130\" height=\"130\" rx=\"20\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"3\"/><circle cx=\"50\" cy=\"50\" r=\"12\" fill=\"#38bdf8\"/><circle cx=\"110\" cy=\"50\" r=\"12\" fill=\"#38bdf8\"/><circle cx=\"50\" cy=\"110\" r=\"12\" fill=\"#38bdf8\"/><circle cx=\"110\" cy=\"110\" r=\"12\" fill=\"#38bdf8\"/></svg>",
    "id": 8,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Blood Relations",
    "question_text": "Pointing to a man, a girl says, 'He is the only son of my grandfather's only child.' How is the man related to the girl?",
    "options": [
      "Brother",
      "Father",
      "Cousin",
      "Uncle"
    ],
    "correct_answer_index": 0,
    "explanation": "The grandfather's only child is the girl's father. The only son of her father is her brother.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 9,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial / Symbol Logic",
    "question_text": "A square paper is folded in half from left to right, then a small triangle hole is punched right in the center fold crease. When unfolded, what shape is formed in the middle?",
    "options": [
      "One Triangle",
      "A Diamond",
      "Two separate circles",
      "A Square"
    ],
    "correct_answer_index": 1,
    "explanation": "When folded, cutting a triangle along the crease produces a symmetric mirrored shape upon unfolding. Two identical triangles base-to-base form a diamond.",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": "<svg viewBox=\"0 0 340 115\" width=\"320\" height=\"110\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"70\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#64748b\" stroke-width=\"2\"/><line x1=\"45\" y1=\"10\" x2=\"45\" y2=\"80\" stroke=\"#38bdf8\" stroke-dasharray=\"4,4\" stroke-width=\"2\"/><path d=\"M 30 45 Q 45 32 60 45\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><polygon points=\"58,40 64,47 56,49\" fill=\"#38bdf8\"/><text x=\"45\" y=\"100\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"sans-serif\" font-weight=\"600\" text-anchor=\"middle\">1. Fold in Half</text><path d=\"M 95 45 L 115 45\" stroke=\"#475569\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><polygon points=\"113,40 122,45 113,50\" fill=\"#475569\"/><rect x=\"135\" y=\"10\" width=\"35\" height=\"70\" rx=\"6\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><polygon points=\"135,35 152,45 135,55\" fill=\"#f43f5e\"/><text x=\"152\" y=\"100\" fill=\"#94a3b8\" font-size=\"10\" font-family=\"sans-serif\" font-weight=\"600\" text-anchor=\"middle\">2. Punch Crease</text><path d=\"M 185 45 L 205 45\" stroke=\"#475569\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><polygon points=\"203,40 212,45 203,50\" fill=\"#475569\"/><rect x=\"225\" y=\"10\" width=\"70\" height=\"70\" rx=\"8\" fill=\"#0f172a\" stroke=\"#a855f7\" stroke-width=\"2\" stroke-dasharray=\"3,3\"/><text x=\"260\" y=\"55\" fill=\"#a855f7\" font-size=\"28\" font-family=\"sans-serif\" font-weight=\"bold\" text-anchor=\"middle\">?</text><text x=\"260\" y=\"100\" fill=\"#a855f7\" font-size=\"10\" font-family=\"sans-serif\" font-weight=\"600\" text-anchor=\"middle\">3. Unfolded Result</text></svg>",
    "id": 10,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial Reasoning",
    "question_text": "In a flat cross-shaped cube net, which pairs of square faces end up parallel and directly opposite each other when folded into a 3D box?",
    "options": [
      "Faces separated by exactly one square along the fold line",
      "Faces that share a common edge",
      "Any two corner squares",
      "Faces adjacent to the central square"
    ],
    "correct_answer_index": 0,
    "explanation": "In cube net topology, faces separated by one square fold upward to become opposite, parallel faces that never share an edge.",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": "<svg viewBox=\"0 0 160 170\" width=\"130\" height=\"140\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"62\" y=\"8\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"80\" y=\"32\" fill=\"#e2e8f0\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">1</text><rect x=\"24\" y=\"46\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"42\" y=\"70\" fill=\"#e2e8f0\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">2</text><rect x=\"62\" y=\"46\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"80\" y=\"70\" fill=\"#38bdf8\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">3</text><rect x=\"100\" y=\"46\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"118\" y=\"70\" fill=\"#e2e8f0\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">4</text><rect x=\"62\" y=\"84\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"80\" y=\"108\" fill=\"#e2e8f0\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">5</text><rect x=\"62\" y=\"122\" width=\"36\" height=\"36\" rx=\"4\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"80\" y=\"146\" fill=\"#e2e8f0\" font-size=\"15\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">6</text></svg>",
    "id": 11,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Mechanical & Spatial",
    "question_text": "Gear A turns clockwise and meshes directly with Gear B. Gear B meshes directly with Gear C. Which direction does Gear C turn?",
    "options": [
      "Clockwise",
      "Counter-clockwise",
      "It remains stationary",
      "It reverses every second"
    ],
    "correct_answer_index": 0,
    "explanation": "Adjacent meshed gears turn in opposite directions: Gear A (Clockwise) -> Gear B (Counter-clockwise) -> Gear C (Clockwise).",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": "<svg viewBox=\"0 0 250 85\" width=\"230\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"42\" cy=\"42\" r=\"30\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"42\" cy=\"42\" r=\"13\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><text x=\"42\" y=\"39\" fill=\"#38bdf8\" font-size=\"10\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Gear A</text><text x=\"42\" y=\"51\" fill=\"#94a3b8\" font-size=\"8\" font-family=\"sans-serif\" text-anchor=\"middle\">↻ CW</text><circle cx=\"110\" cy=\"42\" r=\"30\" fill=\"#0f172a\" stroke=\"#f43f5e\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"110\" cy=\"42\" r=\"13\" fill=\"#1e293b\" stroke=\"#f43f5e\" stroke-width=\"1.5\"/><text x=\"110\" y=\"46\" fill=\"#f43f5e\" font-size=\"10\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Gear B</text><circle cx=\"178\" cy=\"42\" r=\"30\" fill=\"#0f172a\" stroke=\"#10b981\" stroke-width=\"2.5\" stroke-dasharray=\"6,4\"/><circle cx=\"178\" cy=\"42\" r=\"13\" fill=\"#1e293b\" stroke=\"#10b981\" stroke-width=\"1.5\"/><text x=\"178\" y=\"39\" fill=\"#10b981\" font-size=\"10\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">Gear C</text><text x=\"178\" y=\"52\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\" font-family=\"sans-serif\" text-anchor=\"middle\">?</text></svg>",
    "id": 12,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial Symmetry",
    "question_text": "If a vertical flat mirror is placed to the right of the capital word 'CODE', which single letter looks identical to its reflection?",
    "options": [
      "C",
      "O",
      "D",
      "E"
    ],
    "correct_answer_index": 1,
    "explanation": "The letter 'O' has vertical line symmetry, meaning its left-to-right mirror reflection is indistinguishable from the original letter.",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": null,
    "id": 13,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Fast Arithmetic",
    "question_text": "An electric scooter covers 60 km in exactly 45 minutes at constant speed. What is its average speed in km/h?",
    "options": [
      "75 km/h",
      "80 km/h",
      "85 km/h",
      "90 km/h"
    ],
    "correct_answer_index": 1,
    "explanation": "45 minutes = 3/4 hour. Speed = Distance / Time = 60 / (3/4) = 60 * (4/3) = 80 km/h.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 14,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial & Geometry",
    "question_text": "At exactly 3:00, what is the angle formed between the minute hand and the hour hand of an analog clock?",
    "options": [
      "60 degrees",
      "90 degrees",
      "120 degrees",
      "45 degrees"
    ],
    "correct_answer_index": 1,
    "explanation": "The clock face is 360° divided into 12 hours (30° per hour). At 3:00, the minute hand is at 12 and hour hand at 3. 3 * 30° = 90° (right angle).",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": "<svg viewBox=\"0 0 120 120\" width=\"105\" height=\"105\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"60\" cy=\"60\" r=\"50\" fill=\"#0f172a\" stroke=\"#38bdf8\" stroke-width=\"2.5\"/><line x1=\"60\" y1=\"14\" x2=\"60\" y2=\"20\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"106\" y1=\"60\" x2=\"100\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"60\" y1=\"106\" x2=\"60\" y2=\"100\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"14\" y1=\"60\" x2=\"20\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><text x=\"60\" y=\"28\" fill=\"#94a3b8\" font-size=\"8\" font-family=\"sans-serif\" text-anchor=\"middle\">12</text><text x=\"96\" y=\"63\" fill=\"#94a3b8\" font-size=\"8\" font-family=\"sans-serif\" text-anchor=\"middle\">3</text><text x=\"60\" y=\"98\" fill=\"#94a3b8\" font-size=\"8\" font-family=\"sans-serif\" text-anchor=\"middle\">6</text><text x=\"24\" y=\"63\" fill=\"#94a3b8\" font-size=\"8\" font-family=\"sans-serif\" text-anchor=\"middle\">9</text><line x1=\"60\" y1=\"60\" x2=\"60\" y2=\"28\" stroke=\"#38bdf8\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"60\" y1=\"60\" x2=\"88\" y2=\"60\" stroke=\"#f43f5e\" stroke-width=\"3.5\" stroke-linecap=\"round\"/><circle cx=\"60\" cy=\"60\" r=\"4\" fill=\"#e2e8f0\"/><path d=\"M 60 45 A 15 15 0 0 1 75 60\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2\" stroke-dasharray=\"2,2\"/><text x=\"71\" y=\"47\" fill=\"#fbbf24\" font-size=\"9\" font-family=\"sans-serif\" font-weight=\"bold\">θ = ?</text></svg>",
    "id": 15,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Deductive Logic",
    "question_text": "In a coding club of 50 students, 30 build with Python, 25 build with React, and 10 build with both. How many students build with neither?",
    "options": [
      "5",
      "10",
      "15",
      "0"
    ],
    "correct_answer_index": 0,
    "explanation": "Using set theory: Union = 30 + 25 - 10 = 45 students using at least one. Students using neither = 50 - 45 = 5.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 16,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Pattern Logic",
    "question_text": "Find the next number in the pattern: 2, 5, 10, 17, 26, ___?",
    "options": [
      "35",
      "37",
      "39",
      "40"
    ],
    "correct_answer_index": 1,
    "explanation": "Pattern formula is n² + 1: 1²+1=2, 2²+1=5, 3²+1=10, 4²+1=17, 5²+1=26, 6²+1=37.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 17,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Word Analogy",
    "question_text": "Architect is to Building as Composer is to ___.",
    "options": [
      "Symphony",
      "Instrument",
      "Stage",
      "Orchestra"
    ],
    "correct_answer_index": 0,
    "explanation": "An architect creates and designs a building; a composer creates and writes a symphony.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 18,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Spatial Reasoning",
    "question_text": "A 3x3x3 wooden cube is painted blue on all 6 outer sides and cut into 27 equal 1x1x1 small cubes. How many small cubes have blue paint on EXACTLY one face?",
    "options": [
      "6",
      "8",
      "12",
      "1"
    ],
    "correct_answer_index": 0,
    "explanation": "Only the single center cube on each of the 6 outer faces has paint on exactly one side. 6 faces * 1 = 6 cubes.",
    "is_spatial": true,
    "image_url": null,
    "diagram_svg": null,
    "id": 19,
    "points": [
      1,
      0,
      0,
      0
    ]
  },
  {
    "category_type": "IQ",
    "sub_category": "Deductive Logic",
    "question_text": "If all laptops are computers, and some computers are portable workstations, which conclusion is definitely TRUE?",
    "options": [
      "All laptops are portable workstations",
      "At least some computers are laptops",
      "No laptops are portable workstations",
      "All computers are laptops"
    ],
    "correct_answer_index": 1,
    "explanation": "Since all laptops are computers, it is logically guaranteed that at least some computers are laptops.",
    "is_spatial": false,
    "image_url": null,
    "diagram_svg": null,
    "id": 20,
    "points": [
      0,
      1,
      0,
      0
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "You receive an aggressive, unfair email from a teammate. What do you do?",
    "options": [
      "Reply immediately with a sharp defense.",
      "Wait 30 minutes to calm down, then reply professionally.",
      "Ignore the email completely.",
      "Forward it to the manager immediately."
    ],
    "correct_answer_index": 1,
    "explanation": "Pausing allows your physiological stress reaction to subside so you can de-escalate tension and resolve issues constructively.",
    "is_spatial": false,
    "image_url": null,
    "id": 21,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Active Empathy",
    "question_text": "A close friend is venting about their bad day. Your best response is to:",
    "options": [
      "Tell them how they can fix their problems.",
      "Remind them that other people have it worse.",
      "Listen actively and validate their feelings without interrupting.",
      "Change the topic to something happier."
    ],
    "correct_answer_index": 2,
    "explanation": "Empathetic active listening gives people space to be heard before jumping to advice or unsolicited solutions.",
    "is_spatial": false,
    "image_url": null,
    "id": 22,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Conflict Resolution",
    "question_text": "Two of your group project members are fighting about design elements. You should:",
    "options": [
      "Side with the person you like better.",
      "Tell them to fix it themselves.",
      "Help them find a compromise that incorporates elements from both designs.",
      "Redo the design yourself to avoid the drama."
    ],
    "correct_answer_index": 2,
    "explanation": "Constructive mediation bridges divergent viewpoints, maintaining project velocity and team cohesion.",
    "is_spatial": false,
    "image_url": null,
    "id": 23,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "You feel overwhelmed and highly anxious right before your project presentation. You:",
    "options": [
      "Cancel or try to postpone the presentation.",
      "Force yourself to suppress it and pretend nothing is wrong.",
      "Acknowledge the anxiety, take a few deep breaths, and focus on preparation.",
      "Complain loudly to your classmates."
    ],
    "correct_answer_index": 2,
    "explanation": "Recognizing physical signs of anxiety and using deep breathing redirects nervous energy into focused performance.",
    "is_spatial": false,
    "image_url": null,
    "id": 24,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Social Awareness",
    "question_text": "You notice a peer sitting alone and looking excluded at a networking event. You:",
    "options": [
      "Ignore them so you don't make it awkward.",
      "Approach them, introduce yourself, and invite them into your circle.",
      "Post about it on social media.",
      "Look at them with pity from afar."
    ],
    "correct_answer_index": 1,
    "explanation": "High emotional intelligence involves proactive inclusion, helping others feel welcome and comfortable.",
    "is_spatial": false,
    "image_url": null,
    "id": 25,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Receiving Feedback",
    "question_text": "Your evaluator tells you your code is messy and unoptimized. You:",
    "options": [
      "Get defensive and explain why your way is better.",
      "Accept the feedback objectively and ask for specific optimization tips.",
      "Feel discouraged and think you're bad at programming.",
      "Agree verbally but make no changes later."
    ],
    "correct_answer_index": 1,
    "explanation": "Separating your self-worth from technical feedback turns critique into a growth roadmap.",
    "is_spatial": false,
    "image_url": null,
    "id": 26,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Influence & Persuasion",
    "question_text": "You need to convince your team to use an unfamiliar open-source tool. You:",
    "options": [
      "Demand they use it because you are the team leader.",
      "Present a quick demo showing how it saves time and reduces bugs.",
      "Implement it secretly without telling them.",
      "Drop the idea if anyone shows slight resistance."
    ],
    "correct_answer_index": 1,
    "explanation": "Persuasion works through practical demonstrations of value rather than authority or coercion.",
    "is_spatial": false,
    "image_url": null,
    "id": 27,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Non-Verbal Decoding",
    "question_text": "Your teammate is saying 'Yes, I can take on more work,' but their arms are crossed, and they are sighing heavily. You:",
    "options": [
      "Take them at their word and assign the task.",
      "Pause and ask if they genuinely have the bandwidth right now.",
      "Tell them they look lazy.",
      "Assign the task to someone else without talking to them."
    ],
    "correct_answer_index": 1,
    "explanation": "Noticing body language and sighs helps you uncover unspoken limits before burnout occurs.",
    "is_spatial": false,
    "image_url": null,
    "id": 28,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Accountability",
    "question_text": "You accidentally pushed a bug that broke the staging environment. You:",
    "options": [
      "Wait silently to see if anyone notices.",
      "Blame the automated deployment script.",
      "Inform the team immediately, take ownership, and work on a fix.",
      "Delete your git history commit."
    ],
    "correct_answer_index": 2,
    "explanation": "Immediate transparent ownership builds immense professional trust and speeds up resolution.",
    "is_spatial": false,
    "image_url": null,
    "id": 29,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Resilience & Mindset",
    "question_text": "You failed to secure a highly competitive internship you prepared months for. Your mindset is:",
    "options": [
      "'The system is rigged against me.'",
      "'It hurts, but I can review where I fell short and improve for the next application.'",
      "'I will stop applying for internships completely.'",
      "'I will just settle for a lower-tier position.'"
    ],
    "correct_answer_index": 1,
    "explanation": "Acknowledging disappointment while conducting an honest post-mortem drives continuous self-improvement.",
    "is_spatial": false,
    "image_url": null,
    "id": 30,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Team Collaboration",
    "question_text": "A team member misses an agreed deadline on a shared assignment. Your most productive first response is to:",
    "options": [
      "Remove them from the group chat immediately.",
      "Ask privately if they encountered an obstacle and how you can help unblock it.",
      "Complain to the instructor without speaking to them.",
      "Silently complete their work and hold a grudge."
    ],
    "correct_answer_index": 1,
    "explanation": "Direct, empathetic communication resolves root bottlenecks without creating defensive interpersonal conflict.",
    "is_spatial": false,
    "image_url": null,
    "id": 31,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Self-Regulation",
    "question_text": "You receive an unexpectedly low score on an exam you studied hard for. You:",
    "options": [
      "Accuse the evaluator of biased grading.",
      "Review your incorrect answers calmly to understand which concepts you misunderstood.",
      "Tear up the paper in frustration.",
      "Decide studying is useless and stop trying."
    ],
    "correct_answer_index": 1,
    "explanation": "Emotional self-regulation directs energy toward learning from errors rather than blaming external circumstances.",
    "is_spatial": false,
    "image_url": null,
    "id": 32,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Empathy & Inclusion",
    "question_text": "During a group discussion, a quiet teammate tries to speak but gets interrupted by louder peers. You:",
    "options": [
      "Let the louder members dominate to finish faster.",
      "Speak up gently: 'Let's pause a second and hear what they were about to share.'",
      "Interrupt the speaker too.",
      "Stay silent and check your phone."
    ],
    "correct_answer_index": 1,
    "explanation": "Advocating for quieter contributors ensures all valuable perspectives are heard and strengthens team dynamics.",
    "is_spatial": false,
    "image_url": null,
    "id": 33,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Humility & Teamwork",
    "question_text": "A professor publicly praises your group project presentation. You:",
    "options": [
      "Take all the credit for yourself.",
      "Thank the professor and highlight the specific contributions made by your teammates.",
      "Belittle the work and say it wasn't good.",
      "Ignore your teammates afterwards."
    ],
    "correct_answer_index": 1,
    "explanation": "Generous credit-sharing reinforces trust and inspires teammates to continue delivering their best work.",
    "is_spatial": false,
    "image_url": null,
    "id": 34,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Constructive Dialogue",
    "question_text": "A peer strongly disagrees with your proposed technical approach during a debate. You:",
    "options": [
      "Take it personally and raise your voice.",
      "Ask them to explain their logic so you can evaluate the trade-offs together.",
      "Leave the discussion abruptly.",
      "Pretend to agree while secretly rejecting their input."
    ],
    "correct_answer_index": 1,
    "explanation": "Curiosity about differing viewpoints turns technical debates into collaborative problem solving.",
    "is_spatial": false,
    "image_url": null,
    "id": 35,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Peer Support",
    "question_text": "You notice a close classmate is withdrawing, missing classes, and looking unusually exhausted. You:",
    "options": [
      "Assume they became unmotivated.",
      "Check in privately: 'Hey, I noticed you seem stressed lately. I'm here if you want to talk.'",
      "Post about it in a campus group.",
      "Avoid talking to them."
    ],
    "correct_answer_index": 1,
    "explanation": "Low-pressure, caring check-ins signal safety and provide crucial social support during hard times.",
    "is_spatial": false,
    "image_url": null,
    "id": 36,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Constructive Criticism",
    "question_text": "When a peer gives you friendly feedback on your public speaking style, your primary instinct is:",
    "options": [
      "Assume they are trying to put you down.",
      "Recognize this as a chance to identify blind spots and sharpen your communication.",
      "Feel angry that anyone would judge you.",
      "Politely smile but make no effort to improve."
    ],
    "correct_answer_index": 1,
    "explanation": "Viewing feedback as data rather than judgment is a hallmark of emotional maturity.",
    "is_spatial": false,
    "image_url": null,
    "id": 37,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Self-Awareness",
    "question_text": "You catch yourself feeling irritable and snapping at your family after a stressful day. You:",
    "options": [
      "Blame them for annoying you.",
      "Acknowledge your fatigue, step away for a 10-minute reset, and apologize for snapping.",
      "Continue venting your frustration.",
      "Suppress the feelings until you explode."
    ],
    "correct_answer_index": 1,
    "explanation": "Emotional self-awareness allows you to halt the automatic transfer of outside stress onto loved ones.",
    "is_spatial": false,
    "image_url": null,
    "id": 38,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Active Listening",
    "question_text": "When someone is sharing a vulnerable personal struggle with you, the most supportive action is to:",
    "options": [
      "Immediately compare it to an even worse problem you experienced.",
      "Listen attentively, nod, and validate their feelings before suggesting any action.",
      "Tell them to stop worrying because it's not a big deal.",
      "Look at your smartwatch while they speak."
    ],
    "correct_answer_index": 1,
    "explanation": "Validation and non-judgmental presence are far more healing than immediate comparisons or dismissals.",
    "is_spatial": false,
    "image_url": null,
    "id": 39,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "EQ",
    "sub_category": "Integrity Under Pressure",
    "question_text": "You find an unmonitored shortcut that would let you finish an assignment without actually doing the work. You:",
    "options": [
      "Take the shortcut to get quick marks.",
      "Do the work honestly because mastering the skill matters far more than a shortcut.",
      "Share the loophole with friends.",
      "Brag about finding a way around the system."
    ],
    "correct_answer_index": 1,
    "explanation": "High EQ individuals prioritize genuine competence and long-term self-respect over short-term gains.",
    "is_spatial": false,
    "image_url": null,
    "id": 40,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Dichotomy of Control",
    "question_text": "Your final project presentation is delayed by an hour due to an electricity failure. Your internal reaction is:",
    "options": [
      "Anger at the college infrastructure.",
      "Acceptance that the delay is out of your control, using the time to practice quietly.",
      "Panic that this will ruin your grade.",
      "Leaving the venue out of frustration."
    ],
    "correct_answer_index": 1,
    "explanation": "Focusing exclusively on what is within your direct control preserves peace of mind when external events go wrong.",
    "is_spatial": false,
    "image_url": null,
    "id": 41,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Material Perspective",
    "question_text": "You lose your expensive smartphone. A stoic mindset suggests:",
    "options": [
      "Letting it completely ruin your week.",
      "Buying the exact same model immediately on credit.",
      "Accepting the loss as a temporary separation from a material object.",
      "Constantly complaining to your peers."
    ],
    "correct_answer_index": 2,
    "explanation": "Material objects are external and temporary; maintaining inner poise is what guards your true well-being.",
    "is_spatial": false,
    "image_url": null,
    "id": 42,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Purpose & Values",
    "question_text": "Why do you want to build a successful career?",
    "options": [
      "Solely to show off wealth to my relatives.",
      "Because I am afraid of being a failure.",
      "To cultivate my skills, provide value, and build a meaningful life.",
      "Just to get through life with minimal effort."
    ],
    "correct_answer_index": 2,
    "explanation": "Intrinsic motivations focused on skill mastery and contributing to others create enduring, sustainable drive.",
    "is_spatial": false,
    "image_url": null,
    "id": 43,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Humility & Grounding",
    "question_text": "Your professor praises your project in front of the entire class. You:",
    "options": [
      "Let it go to your head and feel superior to others.",
      "Appreciate the validation but remain grounded and focused on continuous learning.",
      "Feel anxious that you now have to be perfect.",
      "Brag about it on social media instantly."
    ],
    "correct_answer_index": 1,
    "explanation": "True self-worth is stable; external praise is appreciated without inflating ego or generating anxiety.",
    "is_spatial": false,
    "image_url": null,
    "id": 44,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Reframing Obstacles",
    "question_text": "When facing a massive personal setback, you remind yourself that:",
    "options": [
      "Life is inherently unfair to you.",
      "Everything will magically fix itself without effort.",
      "Obstacles are opportunities to practice resilience and virtue.",
      "It is better to ignore the setback completely."
    ],
    "correct_answer_index": 2,
    "explanation": "As the Stoics taught, obstacles provide the exact raw material needed to develop courage and resilience.",
    "is_spatial": false,
    "image_url": null,
    "id": 45,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Self-Comparison",
    "question_text": "A classmate who works less hard than you lands a high-paying job. You:",
    "options": [
      "Feel bitter and try to point out their flaws.",
      "Congratulate them genuinely and stay focused on your own path.",
      "Assume they used unfair means.",
      "Feel depressed about your own worth."
    ],
    "correct_answer_index": 1,
    "explanation": "Comparing your journey to others fosters envy; celebrating peers while running your own race preserves purpose.",
    "is_spatial": false,
    "image_url": null,
    "id": 46,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Mindfulness & Presence",
    "question_text": "When you eat a meal or sit in class, your mind is usually:",
    "options": [
      "Replaying embarrassing moments from 3 years ago.",
      "Anxiously planning out the next month.",
      "Anchored in the present moment, experiencing what is happening right now.",
      "Completely blank and zoning out."
    ],
    "correct_answer_index": 2,
    "explanation": "Mindful presence grounds your mental energy in the here and now, minimizing anxious time travel into the past or future.",
    "is_spatial": false,
    "image_url": null,
    "id": 47,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Equanimity Under Criticism",
    "question_text": "Someone calls your hard-earned project 'garbage.' You:",
    "options": [
      "Fire back with a personal insult.",
      "Realize their opinion says more about them than your project, and remain calm.",
      "Delete your project code in a fit of rage.",
      "Obsess over why they hate you."
    ],
    "correct_answer_index": 1,
    "explanation": "Rude opinions reflect the speaker's internal state. Maintaining composure prevents other people from controlling your mood.",
    "is_spatial": false,
    "image_url": null,
    "id": 48,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Interconnectedness",
    "question_text": "When writing code or collaborating, you view your peers as:",
    "options": [
      "Rivals who must be defeated.",
      "Tools to help you get a better grade.",
      "Fellow human beings working toward shared growth.",
      "Minor obstacles in your path."
    ],
    "correct_answer_index": 2,
    "explanation": "Recognizing shared humanity creates meaningful camaraderie and replaces toxic competition with mutual uplift.",
    "is_spatial": false,
    "image_url": null,
    "id": 49,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Impermanence",
    "question_text": "Reminding yourself that 'this too shall pass' makes you feel:",
    "options": [
      "Hopeless and unmotivated.",
      "Balanced, helping you enjoy the good times and endure the bad.",
      "Terrified of the future.",
      "Reckless and irresponsible."
    ],
    "correct_answer_index": 1,
    "explanation": "Awareness of impermanence keeps you humble in victory and courageous and patient in hardship.",
    "is_spatial": false,
    "image_url": null,
    "id": 50,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Dichotomy of Control",
    "question_text": "You are stuck in heavy traffic on the way to a significant event. A grounded reaction is to:",
    "options": [
      "Honk aggressively and curse the traffic.",
      "Accept that traffic is beyond your control, notify people calmly, and use the time to listen to something insightful.",
      "Abandon your vehicle in anger.",
      "Panic and let it ruin your entire day."
    ],
    "correct_answer_index": 1,
    "explanation": "You cannot control road traffic, but you have 100% control over how you spend your attention while waiting.",
    "is_spatial": false,
    "image_url": null,
    "id": 51,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Living by Principles",
    "question_text": "Offered an easy chance to gain popularity by spreading a humiliating rumor about a peer, you:",
    "options": [
      "Spread the rumor to fit in with the group.",
      "Refuse, because speaking truthfully and treating others with dignity is an unshakable core principle.",
      "Hint at the rumor without saying names.",
      "Use the rumor to manipulate someone."
    ],
    "correct_answer_index": 1,
    "explanation": "Core ethical values are non-negotiable boundaries that protect self-respect against peer pressure.",
    "is_spatial": false,
    "image_url": null,
    "id": 52,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Perspective in Failure",
    "question_text": "After weeks of hard work, an application you built crashes in front of users. You tell yourself:",
    "options": [
      "'I am a total failure and should quit.'",
      "'The setback is a valuable teacher that highlights exactly where the system must be strengthened.'",
      "'Someone intentionally sabotaged my work.'",
      "'I will never show my work to anyone again.'"
    ],
    "correct_answer_index": 1,
    "explanation": "A spiritual mindset perceives failures as necessary stepping stones toward durable excellence.",
    "is_spatial": false,
    "image_url": null,
    "id": 53,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Solitude & Reflection",
    "question_text": "When you spend an evening in quiet solitude without phone notifications, you feel:",
    "options": [
      "Overwhelmed by boredom and dread.",
      "Grounded and centered, appreciating time for quiet reflection, reading, and recharging.",
      "Anxious that the world has forgotten you.",
      "Irritable that nothing exciting is happening."
    ],
    "correct_answer_index": 1,
    "explanation": "Being at ease in your own quiet presence demonstrates internal wholeness independent of external validation.",
    "is_spatial": false,
    "image_url": null,
    "id": 54,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Generosity",
    "question_text": "A junior student asks you for help with a basic concept you learned long ago. You:",
    "options": [
      "Tell them to read the documentation and walk away.",
      "Patiently guide them through the logic, remembering how it felt when you were first starting out.",
      "Make fun of them for not knowing basic concepts.",
      "Demand a favor in return before helping."
    ],
    "correct_answer_index": 1,
    "explanation": "Generously lifting others up enriches your own understanding and builds a supportive community.",
    "is_spatial": false,
    "image_url": null,
    "id": 55,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Gratitude",
    "question_text": "At the end of an ordinary, uneventful day, your typical reflection is:",
    "options": [
      "Frustration that you didn't become famous today.",
      "Gratitude for health, peace, the ability to learn, and the basic comforts you enjoy.",
      "Anger that life is boring.",
      "Obsession over what went wrong."
    ],
    "correct_answer_index": 1,
    "explanation": "Practicing daily gratitude anchors your perspective in life's foundational gifts rather than superficial desires.",
    "is_spatial": false,
    "image_url": null,
    "id": 56,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Internal vs External Worth",
    "question_text": "You see peers flaunting luxury gadgets and lifestyle photos online. Your internal reaction is:",
    "options": [
      "Feeling inadequate and desiring to borrow money to match them.",
      "Remembering that your worth is measured by character, knowledge, and actions—not material displays.",
      "Feeling jealous and resentful toward them.",
      "Judging your own life as a failure."
    ],
    "correct_answer_index": 1,
    "explanation": "Rooting your value in personal character insulates you from endless consumerist comparison.",
    "is_spatial": false,
    "image_url": null,
    "id": 57,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Forgiveness",
    "question_text": "A classmate makes an honest mistake that damages a shared assignment. You:",
    "options": [
      "Hold a grudge and refuse to speak with them again.",
      "Recognize that humans make mistakes, focus on fixing the issue, and maintain your working relationship.",
      "Attempt to humiliate them in public.",
      "Complain endlessly to mutual friends."
    ],
    "correct_answer_index": 1,
    "explanation": "Forgiveness frees your mental bandwidth from lingering resentment and preserves cooperative partnerships.",
    "is_spatial": false,
    "image_url": null,
    "id": 58,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Integrity Over Expediency",
    "question_text": "You notice an error in a grading sheet where you were accidentally given 15 bonus marks. You:",
    "options": [
      "Stay quiet and celebrate the unearned marks.",
      "Notify the teacher honestly to correct the record.",
      "Brag to your friends that you tricked the system.",
      "Argue that you deserved the extra marks anyway."
    ],
    "correct_answer_index": 1,
    "explanation": "Honesty in small matters preserves the integrity that underpins your entire character.",
    "is_spatial": false,
    "image_url": null,
    "id": 59,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "SQ",
    "sub_category": "Living Intentionally",
    "question_text": "When making major decisions about your future studies or career, your guiding compass is:",
    "options": [
      "Whatever impresses people the most on social media.",
      "Alignment with your authentic interests, values, and how you can deliver genuine value to society.",
      "The option that requires the least effort possible.",
      "Copying whatever your neighbor is doing."
    ],
    "correct_answer_index": 1,
    "explanation": "Living with intentional purpose leads to lasting fulfillment far beyond chasing external expectations.",
    "is_spatial": false,
    "image_url": null,
    "id": 60,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Framework Agility",
    "question_text": "Your project guide suddenly asks you to change your project backend from Node.js to Python. You:",
    "options": [
      "Argue aggressively against it.",
      "Assess the learning curve and quickly start exploring Python frameworks.",
      "Ask to switch to a different guide.",
      "Stick to Node.js and hope they don't notice."
    ],
    "correct_answer_index": 1,
    "explanation": "Embracing a sudden tech shift broadens your versatile engineering toolkit and demonstrates agility.",
    "is_spatial": false,
    "image_url": null,
    "id": 61,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Graceful Fallbacks",
    "question_text": "During your live project demo, the Groq API key limits drop or time out. You:",
    "options": [
      "Freeze up and panic in front of the external examiner.",
      "End the demo immediately and blame the internet.",
      "Gracefully explain the API limit and smoothly switch to your pre-coded local mock fallback data.",
      "Restart your laptop multiple times."
    ],
    "correct_answer_index": 2,
    "explanation": "Anticipating failure modes with resilient local fallbacks demonstrates high professional maturity under live pressure.",
    "is_spatial": false,
    "image_url": null,
    "id": 62,
    "points": [
      1,
      1,
      4,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Ambiguity Tolerance",
    "question_text": "You are given a project requirement document that is incredibly vague. You:",
    "options": [
      "Do nothing until you are given explicit instructions.",
      "Build a quick, minimal prototype based on reasonable assumptions and ask for early feedback.",
      "Complain that the project guidelines are terrible.",
      "Copy a project from GitHub that looks close enough."
    ],
    "correct_answer_index": 1,
    "explanation": "Action clarifies ambiguity; rapid minimal prototypes create concrete baselines for alignment.",
    "is_spatial": false,
    "image_url": null,
    "id": 63,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Unlearning Legacy Habits",
    "question_text": "You find out a coding pattern you've used for years is now considered insecure legacy code. You:",
    "options": [
      "Keep using it because 'it works for me.'",
      "Actively unlearn it and study the modern, secure best practices.",
      "Argue that the new security rules are unnecessary.",
      "Only change it if forced by a compiler error."
    ],
    "correct_answer_index": 1,
    "explanation": "The willingness to rapidly discard obsolete practices and embrace modern standards defines high adaptability.",
    "is_spatial": false,
    "image_url": null,
    "id": 64,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Pivoting Under Disruption",
    "question_text": "A core library your app depends on is suddenly deprecated and taken offline. You:",
    "options": [
      "Give up on the project entirely.",
      "Research alternative open-source packages that can act as a drop-in replacement.",
      "Keep trying to install the broken package.",
      "Write the entire complex library from scratch yourself."
    ],
    "correct_answer_index": 1,
    "explanation": "Agile engineers quickly identify modular drop-in alternatives rather than despairing when dependencies break.",
    "is_spatial": false,
    "image_url": null,
    "id": 65,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Debugging Resilience",
    "question_text": "You are stuck on a difficult code bug for 3 hours. Your sequence of action is:",
    "options": [
      "Stare at the screen and get increasingly frustrated.",
      "Check error logs, look up documentation, search tech forums, and cleanly prompt an AI tool.",
      "Immediately message your friend to write the code for you.",
      "Delete the feature entirely."
    ],
    "correct_answer_index": 1,
    "explanation": "Systematic debugging alternates between inspecting logs, official docs, and targeted tool querying.",
    "is_spatial": false,
    "image_url": null,
    "id": 66,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Remote & Async Agility",
    "question_text": "Your team has to move from offline meetings to a fully remote, asynchronous setup. You:",
    "options": [
      "Insist on offline meetings anyway.",
      "Read up on async documentation standards and start logging updates clearly on GitHub/Trello.",
      "Skip the remote updates since nobody is watching you in person.",
      "Complain that productivity is impossible now."
    ],
    "correct_answer_index": 1,
    "explanation": "Thriving in remote environments requires adopting clear written communication and transparent tracking.",
    "is_spatial": false,
    "image_url": null,
    "id": 67,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "User-Centric Pivoting",
    "question_text": "Your early beta testers hate your web app's navigation layout. You:",
    "options": [
      "Assume the users are not tech-savvy enough.",
      "Analyze their behavior patterns and redesign the UI for simpler user flows.",
      "Put up an instructions page forcing them to learn your way.",
      "Ignore the feedback because it's too close to the submission date."
    ],
    "correct_answer_index": 1,
    "explanation": "High AQ developers value user feedback over personal pride, iterating rapidly to solve user friction.",
    "is_spatial": false,
    "image_url": null,
    "id": 68,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Crisis Prioritization",
    "question_text": "You have three deadlines falling on the exact same day. Your approach is to:",
    "options": [
      "Multitask randomly across all three and finish none.",
      "Prioritize tasks by impact, break them into micro-steps, and execute them systematically.",
      "Panic and take the day off to sleep.",
      "Ask for extensions on all of them without trying."
    ],
    "correct_answer_index": 1,
    "explanation": "Triage and single-task execution prevent cognitive overload when multiple pressures converge.",
    "is_spatial": false,
    "image_url": null,
    "id": 69,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Novel Problem Solving",
    "question_text": "When your standard debugging method fails to find a memory leak, you:",
    "options": [
      "Try alternative profiling and memory monitoring tools you haven't used before.",
      "Keep running the same print statements hoping for a different result.",
      "Assume the framework has a bug and give up.",
      "Postpone fixing it until the deployment fails."
    ],
    "correct_answer_index": 0,
    "explanation": "When familiar tools fail, adapting your toolkit to specialized profilers uncovers the root cause.",
    "is_spatial": false,
    "image_url": null,
    "id": 70,
    "points": [
      4,
      1,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "AI Tool Integration",
    "question_text": "A new AI coding tool is released that automates repetitive boilerplate code. You:",
    "options": [
      "Refuse to touch it because 'real developers write every line by hand.'",
      "Experiment with it to see how it can speed up your repetitive work and elevate your focus to high-level architecture.",
      "Assume developers are obsolete and panic.",
      "Ignore it completely."
    ],
    "correct_answer_index": 1,
    "explanation": "Adaptable professionals leverage new AI tools to multiply their leverage rather than fearing disruption.",
    "is_spatial": false,
    "image_url": null,
    "id": 71,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Rapid Upskilling",
    "question_text": "You join an internship and find the company uses a database technology you never studied in college. You:",
    "options": [
      "Complain that college didn't prepare you properly.",
      "Spend the weekend reading the official documentation and building a sample CRUD app to get comfortable.",
      "Hide the fact that you don't know it and hope no one notices.",
      "Ask to be moved to a non-technical role."
    ],
    "correct_answer_index": 1,
    "explanation": "Fast self-directed learning bridges real-world skill gaps without waiting for structured courses.",
    "is_spatial": false,
    "image_url": null,
    "id": 72,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Scope Adjustment",
    "question_text": "Two weeks before product launch, you realize the original scope is too large for the remaining time. You:",
    "options": [
      "Rush through every feature with messy, broken code.",
      "Cut the scope to a rock-solid, polished core MVP and defer the non-essential features to Phase 2.",
      "Hide the delay and miss the launch date.",
      "Give up on the launch entirely."
    ],
    "correct_answer_index": 1,
    "explanation": "Pruning scope to deliver a polished, reliable core product is the hallmark of agile execution.",
    "is_spatial": false,
    "image_url": null,
    "id": 73,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Adapting Communication",
    "question_text": "You are presenting technical software results to non-technical business stakeholders. You:",
    "options": [
      "Use heavy technical jargon, acronyms, and raw SQL queries to sound smart.",
      "Translate technical outcomes into simple business metrics: speed, reliability, and user benefits.",
      "Refuse to present to people who don't code.",
      "Read code line-by-line off the screen."
    ],
    "correct_answer_index": 1,
    "explanation": "Communicative adaptability tailors the message to the audience's context and needs.",
    "is_spatial": false,
    "image_url": null,
    "id": 74,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Crisis Pivoting",
    "question_text": "Your team's scheduled presentation laptop won't connect to the projector 5 minutes before the pitch. You:",
    "options": [
      "Cancel the pitch and blame the audio-visual staff.",
      "Quickly share the presentation slides to everyone's mobile phones and deliver the pitch enthusiastically.",
      "Sit in silence and wait for someone to fix the cable.",
      "Argue with the technician."
    ],
    "correct_answer_index": 1,
    "explanation": "Resourcefulness under technical failure saves critical opportunities without losing momentum.",
    "is_spatial": false,
    "image_url": null,
    "id": 75,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Role Flexibility",
    "question_text": "Your team's UI designer falls sick right before a hackathon deadline. You:",
    "options": [
      "Give up because you are primarily a backend developer.",
      "Step up, use clean component libraries or templates, and build a clean, usable interface yourself.",
      "Submit the project with no UI at all.",
      "Wait for the designer to recover before doing any work."
    ],
    "correct_answer_index": 1,
    "explanation": "Cross-functional flexibility keeps teams resilient when unexpected skill voids appear.",
    "is_spatial": false,
    "image_url": null,
    "id": 76,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Iterative Learning",
    "question_text": "A code review flags 12 suggestions on a pull request you were confident in. You:",
    "options": [
      "Take offense and argue on every single comment.",
      "Carefully review each suggestion, appreciate the senior insights, and update the pull request systematically.",
      "Close the pull request and throw away your code.",
      "Approve your own code and ignore the review."
    ],
    "correct_answer_index": 1,
    "explanation": "Constructive code reviews are the fastest acceleration engine for an adaptive developer.",
    "is_spatial": false,
    "image_url": null,
    "id": 77,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Testing New Environments",
    "question_text": "Your university switches from local servers to a cloud infrastructure platform (Render / Vercel). You:",
    "options": [
      "Complain that local servers were easier.",
      "Embrace the change, learn environment variable setups, build scripts, and modern cloud deployment flows.",
      "Refuse to deploy your apps.",
      "Ask classmates to deploy everything for you."
    ],
    "correct_answer_index": 1,
    "explanation": "Mastering modern CI/CD and cloud hosting transforms you into an industry-ready engineer.",
    "is_spatial": false,
    "image_url": null,
    "id": 78,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Resilience Under Interruption",
    "question_text": "An unexpected power cut closes your computer lab right in the middle of a project sprint. You:",
    "options": [
      "Waste the rest of the day waiting.",
      "Use the time to whiteboard the system architecture, write down test cases on paper, and plan next sprint tasks.",
      "Complain angrily to the lab coordinator.",
      "Go home and abandon the day's goals."
    ],
    "correct_answer_index": 1,
    "explanation": "Agile thinking switches between digital execution and analog planning when physical tools are interrupted.",
    "is_spatial": false,
    "image_url": null,
    "id": 79,
    "points": [
      1,
      4,
      1,
      1
    ]
  },
  {
    "category_type": "AQ",
    "sub_category": "Thriving in Ambiguity",
    "question_text": "When you are asked to solve an open-ended problem with no existing documentation or stackoverflow answers, your instinct is:",
    "options": [
      "Conclude that it cannot be solved.",
      "Break down the problem to first principles, formulate testable hypotheses, and experiment rapidly.",
      "Wait for someone else to solve it first.",
      "Pretend you never received the assignment."
    ],
    "correct_answer_index": 1,
    "explanation": "Confidence in experimental problem solving is the peak characteristic of a high Adaptability Quotient.",
    "is_spatial": false,
    "image_url": null,
    "id": 80,
    "points": [
      1,
      4,
      1,
      1
    ]
  }
];

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
