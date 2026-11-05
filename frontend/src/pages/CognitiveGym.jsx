import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Brain, 
  Award, 
  Compass, 
  Zap, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ExternalLink, 
  BookOpen, 
  Video, 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Sun, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  Lightbulb,
  Gamepad2,
  Bookmark
} from 'lucide-react';

export default function CognitiveGym({ onNavigate, initialPillar = 'IQ' }) {
  const [activePillar, setActivePillar] = useState(initialPillar || 'IQ');

  useEffect(() => {
    if (initialPillar) {
      setActivePillar(initialPillar);
    }
  }, [initialPillar]);

  // =========================================================================
  // Game 1: IQ - Speed Logic & Math Duel State (10 Shuffled Challenges Sprint)
  // =========================================================================
  const iqMasterChallenges = [
    {
      q: "What is 17 × 4 - 19?",
      options: ["49", "51", "47", "53"],
      correct: 0,
      expl: "17 × 4 = 68. 68 - 19 = 49."
    },
    {
      q: "Find the next number in sequence: 3, 7, 15, 31, ?",
      options: ["63", "59", "61", "67"],
      correct: 0,
      expl: "Each term is 2n + 1 (or +4, +8, +16, +32). 31 + 32 = 63."
    },
    {
      q: "If all Zips are Zaps and no Zap is a Zop, can any Zip be a Zop?",
      options: ["Never", "Always", "Sometimes", "Undetermined"],
      correct: 0,
      expl: "Since all Zips are inside Zaps, and Zaps and Zops have no overlap, no Zip can ever be a Zop."
    },
    {
      q: "A bat and ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much is the ball?",
      options: ["$0.05", "$0.10", "$0.15", "$0.01"],
      correct: 0,
      expl: "Ball = x. Bat = x + 1.00. 2x + 1.00 = 1.10 -> 2x = 0.10 -> x = $0.05."
    },
    {
      q: "Next in pattern: 2, 6, 12, 20, 30, ?",
      options: ["42", "40", "44", "38"],
      correct: 0,
      expl: "Differences are +4, +6, +8, +10, so next is +12. 30 + 12 = 42."
    },
    {
      q: "What is 25% of 240 + 15?",
      options: ["75", "70", "65", "80"],
      correct: 0,
      expl: "25% of 240 is 60. 60 + 15 = 75."
    },
    {
      q: "Complete the sequence: 1, 4, 9, 16, 25, 36, ?",
      options: ["49", "45", "51", "64"],
      correct: 0,
      expl: "Consecutive perfect squares: 7² = 49."
    },
    {
      q: "If 5 machines take 5 minutes to make 5 widgets, how long do 100 machines take to make 100 widgets?",
      options: ["5 minutes", "100 minutes", "20 minutes", "50 minutes"],
      correct: 0,
      expl: "1 machine takes 5 minutes to make 1 widget. 100 machines making 100 widgets still take 5 minutes."
    },
    {
      q: "What is 13 × 6 - 28?",
      options: ["50", "48", "52", "46"],
      correct: 0,
      expl: "13 × 6 = 78. 78 - 28 = 50."
    },
    {
      q: "Find the missing term: 80, 40, 20, 10, ?",
      options: ["5", "2.5", "0", "8"],
      correct: 0,
      expl: "Each term is divided by 2. 10 / 2 = 5."
    },
    {
      q: "If today is Tuesday, what day of the week is 23 days from today?",
      options: ["Thursday", "Wednesday", "Friday", "Monday"],
      correct: 0,
      expl: "23 days = 3 weeks + 2 days. Tuesday + 2 days = Thursday."
    },
    {
      q: "What is 144 ÷ 12 + 19?",
      options: ["31", "29", "33", "27"],
      correct: 0,
      expl: "144 ÷ 12 = 12. 12 + 19 = 31."
    },
    {
      q: "Next in sequence: 5, 11, 23, 47, ?",
      options: ["95", "91", "99", "89"],
      correct: 0,
      expl: "Each term is 2x + 1: 47 × 2 + 1 = 95."
    },
    {
      q: "In a lake, lily pads double in size every day. It takes 48 days to cover the lake. How many days to cover half?",
      options: ["47 days", "24 days", "12 days", "40 days"],
      correct: 0,
      expl: "Since it doubles daily, on day 47 it covers half, and day 48 doubles to full."
    },
    {
      q: "What is 9 × 18 - 42?",
      options: ["120", "118", "124", "116"],
      correct: 0,
      expl: "9 × 18 = 162. 162 - 42 = 120."
    },
    {
      q: "Next in pattern: 100, 96, 88, 76, 60, ?",
      options: ["40", "44", "38", "42"],
      correct: 0,
      expl: "Differences are -4, -8, -12, -16, so next is -20. 60 - 20 = 40."
    },
    {
      q: "What is 15 × 15 - 25?",
      options: ["200", "225", "195", "210"],
      correct: 0,
      expl: "15 × 15 = 225. 225 - 25 = 200."
    },
    {
      q: "If SOME A are B, and ALL B are C, are SOME A definitely C?",
      options: ["Yes, definitely", "No, never", "Only if A = B", "Undetermined"],
      correct: 0,
      expl: "The subset of A that are B are also part of C, so some A are definitely C."
    }
  ];

  // Fisher-Yates array shuffling
  const shuffleList = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  // Generate 10 shuffled questions with shuffled options
  const generateShuffledIQChallenges = () => {
    const selected10 = shuffleList(iqMasterChallenges).slice(0, 10);
    return selected10.map((item) => {
      const correctText = item.options[item.correct];
      const shuffledOptions = shuffleList(item.options);
      return {
        ...item,
        options: shuffledOptions,
        correct: shuffledOptions.indexOf(correctText)
      };
    });
  };

  const [iqActiveChallenges, setIqActiveChallenges] = useState(() => generateShuffledIQChallenges());
  const [iqIndex, setIqIndex] = useState(0);
  const [iqScore, setIqScore] = useState(0);
  const [iqStreak, setIqStreak] = useState(0);
  const [iqFeedback, setIqFeedback] = useState(null);
  const [iqGameOver, setIqGameOver] = useState(false);
  const [iqTimer, setIqTimer] = useState(30);
  const [iqGameRunning, setIqGameRunning] = useState(false);
  const [iqCompletedAll, setIqCompletedAll] = useState(false);
  const [iqTotalAnswered, setIqTotalAnswered] = useState(0);
  const [iqUserAnswers, setIqUserAnswers] = useState([]);
  const [iqShowReview, setIqShowReview] = useState(false);

  useEffect(() => {
    let interval = null;
    if (iqGameRunning && iqTimer > 0) {
      interval = setInterval(() => {
        setIqTimer((t) => t - 1);
      }, 1000);
    } else if (iqGameRunning && iqTimer <= 0) {
      setIqGameOver(true);
      setIqGameRunning(false);
    }
    return () => clearInterval(interval);
  }, [iqGameRunning, iqTimer]);

  const handleStartIQGame = () => {
    const fresh10 = generateShuffledIQChallenges();
    setIqActiveChallenges(fresh10);
    setIqIndex(0);
    setIqScore(0);
    setIqStreak(0);
    setIqTotalAnswered(0);
    setIqCompletedAll(false);
    setIqFeedback(null);
    setIqTimer(30);
    setIqGameOver(false);
    setIqUserAnswers([]);
    setIqShowReview(false);
    setIqGameRunning(true);
  };

  const handleAnswerIQ = (optionIdx) => {
    if (!iqGameRunning || iqActiveChallenges.length === 0) return;
    const current = iqActiveChallenges[iqIndex];
    if (!current) return;

    const isCorrect = optionIdx === current.correct;
    if (isCorrect) {
      const addedPoints = 100 + iqStreak * 25;
      setIqScore((s) => s + addedPoints);
      setIqStreak((st) => st + 1);
      setIqFeedback({ correct: true, msg: `Correct! +${addedPoints} pts` });
    } else {
      setIqStreak(0);
      setIqFeedback({ correct: false, msg: `Incorrect. ${current.expl}` });
    }

    setIqTotalAnswered((prev) => prev + 1);
    setIqUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: iqIndex,
        selectedOption: optionIdx,
        isCorrect
      }
    ]);

    setTimeout(() => {
      setIqFeedback(null);
      // If user answers all 10 questions before 30 seconds are up:
      if (iqIndex + 1 < iqActiveChallenges.length) {
        setIqIndex((idx) => idx + 1);
      } else {
        // Stop sprint cleanly - DO NOT LOOP!
        setIqCompletedAll(true);
        setIqGameOver(true);
        setIqGameRunning(false);
      }
    }, 550);
  };

  // Game 2: EQ - Interpersonal Empathy & Conflict Lab
  // =========================================================================
  const eqScenarios = [
    {
      scenario: "During a critical company sprint review, your team lead abruptly says: 'This presentation is a disorganized mess. I don't even know what you spent the last 3 weeks doing.'",
      context: "Public meeting with stakeholders present. Tension is high.",
      choices: [
        {
          text: "Defend yourself immediately with timestamps and prove that the lead approved each slide.",
          score: 40,
          type: "Reactive Defensive",
          feedback: "Triggered ego response. Escalates public hostility and blinds you to the underlying stress behind the attack."
        },
        {
          text: "Acknowledge the frustration calmly: 'I hear your urgency on clarity. Let's pivot to slide 4 to focus on the key metrics right now, and review the detailed structure together right after.'",
          score: 95,
          type: "High EQ De-escalation",
          feedback: "De-escalates public conflict, validates emotional urgency without accepting unwarranted hostility, and keeps focus on the outcome."
        },
        {
          text: "Stay completely silent and disengage from speaking for the rest of the meeting.",
          score: 30,
          type: "Somatic Freeze / Withdrawal",
          feedback: "Withdrawal leaves negative assumptions unaddressed and damages team confidence."
        },
        {
          text: "Respond with sarcastic humor: 'Well, glad to see someone woke up on the wrong side of the bed today!'",
          score: 25,
          type: "Passive Aggressive",
          feedback: "Humor used defensively degrades psychological safety."
        }
      ]
    },
    {
      scenario: "Your close friend cancels on your long-planned birthday dinner 2 hours before, texting: 'Sorry, I am just so overwhelmed and cannot make it tonight.'",
      context: "You spent days organizing the dinner and feel disappointed.",
      choices: [
        {
          text: "Reply with passive guilt: 'Fine, everyone else managed to make time, but whatever.'",
          score: 35,
          type: "Guilt Tripping",
          feedback: "Prioritizes wounded pride over authentic inquiry into the friend's distress."
        },
        {
          text: "Regulate your initial disappointment, then reply: 'I will definitely miss you tonight, but I hear how heavy things are for you right now. Take care of yourself, and let me bring you lunch tomorrow when things quiet down.'",
          score: 98,
          type: "Empathetic Attunement",
          feedback: "Honors both your genuine affection and your friend's mental health without manipulative demands."
        },
        {
          text: "Leave them on 'Read' for three days to make a point.",
          score: 20,
          type: "Emotional Stonewalling",
          feedback: "Stonewalling causes relational fractures and signals low emotional regulation."
        },
        {
          text: "Demand an emergency phone call to interrogate why they can't attend for even 30 minutes.",
          score: 40,
          type: "Intrusive Boundary Violation",
          feedback: "Disregards their stated exhaustion and forces compliance."
        }
      ]
    }
  ];

  const [eqIndex, setEqIndex] = useState(0);
  const [eqSelected, setEqSelected] = useState(null);

  // =========================================================================
  // Game 3: SQ - Epictetus' Dichotomy of Control Sorter (10 Items)
  // =========================================================================
  const sqMasterItems = [
    { text: "Whether people praise or criticize your work", inControl: false, expl: "External judgment is outside your sovereign control." },
    { text: "The effort and dedication you put into your work", inControl: true, expl: "Your diligence and craft are entirely within your control." },
    { text: "A sudden macroeconomic inflation or downturn", inControl: false, expl: "Macro events belong to the universe, not your choices." },
    { text: "Your reaction and composure when plans fall apart", inControl: true, expl: "Epictetus: 'It is not events that upset us, but our judgment about them.'" },
    { text: "Past mistakes that cannot be undone", inControl: false, expl: "The past belongs to destiny (Amor Fati); focus on present action." },
    { text: "Your personal moral integrity and honesty today", inControl: true, expl: "Cardinal virtue is the only unconditional good in Stoicism." },
    { text: "The physical genetics and aging of your body", inControl: false, expl: "Biology is an external indifferents; you control your care for it." },
    { text: "Choosing not to gossip or complain", inControl: true, expl: "Your speech and voluntary restraint are 100% within your will." },
    { text: "Unforeseen transit and flight delays", inControl: false, expl: "External transit is indifferent; your patience is within your will." },
    { text: "How you choose to direct your attention and focus right now", inControl: true, expl: "Attention is the sovereign domain of the conscious mind." }
  ];

  const [sqItems, setSqItems] = useState(() => shuffleList(sqMasterItems));
  const [sqItemIndex, setSqItemIndex] = useState(0);
  const [sqScore, setSqScore] = useState(0);
  const [sqCompleted, setSqCompleted] = useState(false);
  const [sqLastResult, setSqLastResult] = useState(null);

  const handleSortSQ = (userChoiceInControl) => {
    const current = sqItems[sqItemIndex];
    const isCorrect = userChoiceInControl === current.inControl;
    if (isCorrect) {
      setSqScore((s) => s + 1);
    }
    setSqLastResult({
      correct: isCorrect,
      text: current.text,
      expl: current.expl,
      verdict: current.inControl ? "Within Your Control" : "Outside Your Control"
    });

    if (sqItemIndex + 1 < sqItems.length) {
      setSqItemIndex((i) => i + 1);
    } else {
      setSqCompleted(true);
    }
  };

  const handleResetSQ = () => {
    setSqItems(shuffleList(sqMasterItems));
    setSqItemIndex(0);
    setSqScore(0);
    setSqCompleted(false);
    setSqLastResult(null);
  };
// Game 4: AQ - Crisis Pivot 'What If...?' Agility Simulator
  // =========================================================================
  const aqScenarios = [
    {
      title: "Generative AI Disrupts Your Core Deliverable",
      shock: "A new autonomous AI platform is released that produces 80% of your department's core work in 30 seconds for $5/month. Clients are inquiring about rate cuts.",
      options: [
        {
          title: "Resist & Petition",
          desc: "Write letters warning of AI safety and advise clients to avoid it due to copyright nuances.",
          aqScore: 35,
          analysis: "Low AQ: Denial and protective lobbying. Disruption will bypass you as competitors adapt."
        },
        {
          title: "Supercharged Orchestrator",
          desc: "Master the new AI tools immediately. Shift business positioning from manual execution to high-level strategic architecture and verification.",
          aqScore: 98,
          analysis: "Peak AQ: Unlearn manual tasks, assimilate the disruptive wave, and climb to higher cognitive abstraction."
        },
        {
          title: "Wait and Observe",
          desc: "Continue standard operations and wait 6 months to see if client churn actually occurs.",
          aqScore: 50,
          analysis: "Moderate AQ: Wait-and-see posture loses the first-mover adaptation advantage."
        }
      ]
    },
    {
      title: "The Critical Infrastructure Blackout",
      shock: "Your primary cloud provider suffers a regional data corruption blackout 48 hours before an investor demo. Backups are intact but offline.",
      options: [
        {
          title: "Rapid Lightweight Prototype",
          desc: "Spin up a static local mock demo in 4 hours on a separate provider with live mock data to demonstrate full UX and vision.",
          aqScore: 95,
          analysis: "High AQ: Focuses on core value proposition rather than rigid perfection under acute crisis."
        },
        {
          title: "Cancel Demo",
          desc: "Reschedule the demo 2 weeks later and blame the cloud outage.",
          aqScore: 40,
          analysis: "Low AQ: Crisis paralysis. Signals lack of resilience to prospective backers."
        }
      ]
    }
  ];

  const [aqIndex, setAqIndex] = useState(0);
  const [aqChoice, setAqChoice] = useState(null);

  // =========================================================================
  // Curated Video Masterclasses Bank
  // =========================================================================
  const videoMasterclasses = {
    IQ: [
      {
        title: "The Essence of Calculus & Visual Mathematical Thinking",
        creator: "3Blue1Brown (Grant Sanderson)",
        duration: "21 mins",
        url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
        takeaway: "How to develop visual geometric intuition for abstract equations instead of rote memorization."
      },
      {
        title: "The Science of Thinking & Cognitive Illusion Traps",
        creator: "Veritasium",
        duration: "18 mins",
        url: "https://www.youtube.com/watch?v=UBVV8pch1Rs",
        takeaway: "Why human brains default to cognitive shortcuts and how to engage Kahneman's System 2 deliberate reasoning."
      },
      {
        title: "How to Optimize Focus, Working Memory & Neuroplasticity",
        creator: "Dr. Andrew Huberman (Huberman Lab)",
        duration: "28 mins",
        url: "https://www.youtube.com/watch?v=LG53Vxum0as",
        takeaway: "Dopamine dynamics, focused attention intervals, and physiological protocols to enhance cognitive endurance."
      }
    ],
    EQ: [
      {
        title: "Emotional Intelligence: Why It Can Matter More Than IQ",
        creator: "Daniel Goleman",
        duration: "24 mins",
        url: "https://www.youtube.com/watch?v=Y7m9eNoB3NU",
        takeaway: "The 4 core pillars of emotional quotient: self-awareness, self-management, social awareness, and relationship management."
      },
      {
        title: "The Power of Vulnerability & Empathetic Connection",
        creator: "Dr. Brené Brown (TED)",
        duration: "20 mins",
        url: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
        takeaway: "Why emotional authenticity and non-defensive vulnerability are the foundation of deep trust and influence."
      },
      {
        title: "Nonviolent Communication (NVC) Framework",
        creator: "Marshall Rosenberg",
        duration: "32 mins",
        url: "https://www.youtube.com/watch?v=l7TONauJGfc",
        takeaway: "The 4-step framework: Observations, Feelings, Needs, and Requests to dissolve interpersonal defensiveness."
      }
    ],
    SQ: [
      {
        title: "Marcus Aurelius: The Stoic Art of Inner Peace & Duty",
        creator: "The Daily Stoic (Ryan Holiday)",
        duration: "19 mins",
        url: "https://www.youtube.com/watch?v=5897dMWJiSM",
        takeaway: "How Roman Emperor Marcus Aurelius managed wars, betrayal, and plague using daily Stoic journaling and cardinal virtue."
      },
      {
        title: "Man's Search for Meaning: Viktor Frankl's Core Principle",
        creator: "Logotherapy Masterclass",
        duration: "15 mins",
        url: "https://www.youtube.com/watch?v=crfvU_52-3k",
        takeaway: "Those who have a 'why' to live can bear almost any 'how'. Finding purpose in inevitable suffering."
      },
      {
        title: "The Wisdom of Insecurity & Finding Inner Wholeness",
        creator: "Alan Watts",
        duration: "22 mins",
        url: "https://www.youtube.com/watch?v=bLhb_eKjUu8",
        takeaway: "Releasing neurotic control and discovering equanimity by embracing reality as it is."
      }
    ],
    AQ: [
      {
        title: "3 Ways to Measure and Improve Your Adaptability Quotient (AQ)",
        creator: "Natalie Fratto (TED)",
        duration: "12 mins",
        url: "https://www.youtube.com/watch?v=h_7Z5pZ41x8",
        takeaway: "The 3 metrics of high AQ: Asking 'What If...?', Deliberate unlearning, and proactive exploration of novel territory."
      },
      {
        title: "Day 1 Mentality & High-Velocity Decision Making",
        creator: "Jeff Bezos (Amazon Principles)",
        duration: "17 mins",
        url: "https://www.youtube.com/watch?v=4YmI-3k5mvg",
        takeaway: "Type 1 vs Type 2 decisions: how to avoid decision paralysis and pivot before 100% of information is available."
      },
      {
        title: "The Illiterate of the 21st Century: Learn, Unlearn, Relearn",
        creator: "Alvin Toffler Framework",
        duration: "14 mins",
        url: "https://www.youtube.com/watch?v=wX78iKhInsc",
        takeaway: "Why old expertise becomes obsolete and how rapid unlearning is the ultimate meta-skill of the modern era."
      }
    ]
  };

  // =========================================================================
  // Curated Articles & Scientific Reading Bank
  // =========================================================================
  const articleLibrary = {
    IQ: [
      {
        title: "Bayesian Updating: How to Think Like a Superforecaster",
        author: "Farnam Street (Shane Parrish)",
        readTime: "9 min read",
        summary: "Learn how to dynamically revise your beliefs as new evidence arrives instead of stubbornly defending initial assumptions.",
        link: "https://fs.blog/bayes-theorem/"
      },
      {
        title: "The Feynman Technique for Accelerated Conceptual Mastery",
        author: "Richard Feynman Institute",
        readTime: "7 min read",
        summary: "The 4-step mental algorithm to test true comprehension: simplify, explain to a 12-year-old, pinpoint gaps, and re-synthesize.",
        link: "https://fs.blog/feynman-technique/"
      },
      {
        title: "Mental Models Index: First Principles & Inversion",
        author: "Cognitive Science Review",
        readTime: "12 min read",
        summary: "Master Charlie Munger's mental model latticework to solve complex engineering and logical problems.",
        link: "https://fs.blog/mental-models/"
      }
    ],
    EQ: [
      {
        title: "The SCARF Model: Brain-Based Approaches to Collaboration",
        author: "Dr. David Rock (NeuroLeadership Institute)",
        readTime: "8 min read",
        summary: "The 5 social triggers that activate threat vs reward neurobiology: Status, Certainty, Autonomy, Relatedness, and Fairness.",
        link: "https://neuroleadership.com/your-brain-at-work/scarf-model-overview/"
      },
      {
        title: "Somatic Self-Regulation: The Physiological Sigh Protocol",
        author: "Huberman Neurobiology Review",
        readTime: "6 min read",
        summary: "How double-inhale followed by extended exhale activates the parasympathetic nervous system to drop heart rate in 40 seconds.",
        link: "https://www.hubermanlab.com/"
      },
      {
        title: "The Art of Active Empathetic Listening in High-Stakes Conflict",
        author: "Harvard Business Review",
        readTime: "10 min read",
        summary: "Moving beyond superficial nodding to mirror emotions, label underlying anxieties, and co-create psychological safety.",
        link: "https://hbr.org/2018/01/how-to-become-a-better-listener"
      }
    ],
    SQ: [
      {
        title: "The Enchiridion of Epictetus: A Manual for Living with Serenity",
        author: "Epictetus / Stoic Classics",
        readTime: "14 min read",
        summary: "The definitive ancient guide to mastering the dichotomy of control, enduring slander with equanimity, and valuing virtue above all else.",
        link: "https://dailystoic.com/epictetus-quotes/"
      },
      {
        title: "Amor Fati: The Art of Loving Everything That Happens",
        author: "Friedrich Nietzsche & Daily Stoic",
        readTime: "7 min read",
        summary: "Not merely tolerating adversity, but enthusiastically loving whatever occurs as fuel for moral character and growth.",
        link: "https://dailystoic.com/amor-fati/"
      },
      {
        title: "Logotherapy & The Will to Meaning",
        author: "Viktor E. Frankl",
        readTime: "11 min read",
        summary: "How human beings can discover purpose in work, love, and courage in the face of unavoidable suffering.",
        link: "https://www.psychologytoday.com/us/therapy-types/logotherapy"
      }
    ],
    AQ: [
      {
        title: "Antifragile: Things That Gain from Disorder",
        author: "Nassim Nicholas Taleb",
        readTime: "15 min read",
        summary: "The difference between fragile (shatters under stress), robust (resists stress), and antifragile (thrives and grows stronger from volatility).",
        link: "https://fs.blog/antifragile-a-definition/"
      },
      {
        title: "The OODA Loop: Rapid Decision Cycles in Fluid Disruption",
        author: "Col. John Boyd & Defense Strategy",
        readTime: "10 min read",
        summary: "Observe, Orient, Decide, Act: how to operate at higher tempo than the environment changes to maintain tactical initiative.",
        link: "https://fs.blog/john-boyd-ooda-loop/"
      },
      {
        title: "The Habit of Voluntary Discomfort: Hardening Adaptability",
        author: "Seneca & Modern Resilience Science",
        readTime: "8 min read",
        summary: "Practicing controlled novelty and physical/cognitive discomfort regularly so unpredictable crises never catch you off-guard.",
        link: "https://dailystoic.com/voluntary-discomfort/"
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/30 relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-rose-500/10 via-amber-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-indigo-300 text-xs font-semibold mb-3">
              <Dumbbell className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cognitive Gym & Neuro-Performance Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Intelligence Training & Growth
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Sharpen your mind with real-time interactive games, masterclass video lectures, and science-backed cognitive protocols across all 4 intelligence dimensions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('results')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <span>View 4D Matrix</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <span>Take Assessments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillar Selection Tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className="glass-panel p-1.5 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 max-w-full overflow-x-auto">
          <button
            onClick={() => setActivePillar('IQ')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePillar === 'IQ'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-blue-300 hover:bg-slate-900'
            }`}
          >
            <Brain className="w-4 h-4 text-blue-400" />
            <span>IQ Cognitive Gym (Logic & Math)</span>
          </button>

          <button
            onClick={() => setActivePillar('EQ')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePillar === 'EQ'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-rose-400" />
            <span>EQ Empathy Chamber</span>
          </button>

          <button
            onClick={() => setActivePillar('SQ')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePillar === 'SQ'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>SQ Stoic Sanctuary</span>
          </button>

          <button
            onClick={() => setActivePillar('AQ')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activePillar === 'AQ'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>AQ Agility & Pivot Arena</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: INTERACTIVE DRILLS / MINI-GAMES
          ===================================================================== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <span>Interactive Real-Time Cognitive Drill</span>
            </h2>
            <p className="text-xs text-slate-400">
              Engage with playable exercises calibrated to strengthen your mental endurance
            </p>
          </div>
        </div>

        {/* 1. IQ Interactive Drill */}
        {activePillar === 'IQ' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800/50 mb-1 inline-block">
                  Playable Drill • 10 Shuffled Questions • 30s Rapid Sprint
                </span>
                <h3 className="text-lg font-bold text-white">Rapid Deductive Logic & Speed Math Duel</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Timer</span>
                  <span className={`text-base font-black font-mono ${iqTimer <= 5 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {iqTimer}s
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Score</span>
                  <span className="text-base font-black text-indigo-400 font-mono">{iqScore}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Streak</span>
                  <span className="text-base font-black text-amber-400 font-mono">🔥 {iqStreak}</span>
                </div>
              </div>
            </div>

            {!iqGameRunning && !iqGameOver ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 mx-auto mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Test Your Analytical Speed Under Time Pressure</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                  Complete 10 randomized logic and arithmetic challenges before the 30-second timer expires. Questions and options are shuffled each sprint!
                </p>
                <button
                  onClick={handleStartIQGame}
                  className="px-8 py-3.5 rounded-2xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start 10-Question Sprint</span>
                </button>
              </div>
            ) : iqGameOver ? (
              <div className="text-center py-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  iqCompletedAll ? 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-400' : 'bg-indigo-950/80 border border-indigo-800/60 text-indigo-400'
                }`}>
                  {iqCompletedAll ? <Award className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                </div>
                <h4 className="text-xl font-black text-white mb-1">
                  {iqCompletedAll ? 'Sprint Cleared! All 10 Questions Answered! ⚡' : 'Time Expired! (30s Sprint Finished)'}
                </h4>
                <p className="text-sm text-slate-300 mb-2">
                  Final Score: <span className="font-mono font-bold text-indigo-400">{iqScore} points</span> • Answered: <span className="font-bold text-white">{iqTotalAnswered} / {iqActiveChallenges.length}</span>
                </p>
                <p className="text-xs text-slate-400 mb-6">
                  {iqCompletedAll 
                    ? `Exceptional velocity! You cleared all 10 shuffled questions with ${iqTimer}s remaining on the clock.` 
                    : iqScore >= 400 
                      ? '⚡ Exceptional Speed! Outstanding working memory and arithmetic velocity.' 
                      : 'Good effort! Daily 30s sprints build neuroplastic processing speed.'
                  }
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
                  <button
                    onClick={handleStartIQGame}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play New Shuffled 10-Question Sprint</span>
                  </button>

                  <button
                    onClick={() => setIqShowReview((prev) => !prev)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-all inline-flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>{iqShowReview ? 'Hide Answer Review' : 'Review Answers & Explanations (10 Qs)'}</span>
                  </button>
                </div>

                {/* Detailed Review Section for all 10 Questions */}
                {iqShowReview && (
                  <div className="mt-8 text-left border-t border-slate-800 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h5 className="text-base font-bold text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-indigo-400" />
                          <span>Sprint Answer Review & Cognitive Explanations</span>
                        </h5>
                        <p className="text-xs text-slate-400">
                          Review all 10 questions, your selected responses, correct answers, and mathematical/logical solutions.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                          ✓ {iqUserAnswers.filter((a) => a.isCorrect).length} Correct
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                          ✗ {iqUserAnswers.filter((a) => !a.isCorrect).length} Incorrect
                        </span>
                        {iqActiveChallenges.length - iqUserAnswers.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-slate-400 border border-slate-800">
                            ⏱ {iqActiveChallenges.length - iqUserAnswers.length} Timed Out
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                      {iqActiveChallenges.map((challenge, qIdx) => {
                        const userAns = iqUserAnswers.find((a) => a.questionIndex === qIdx);
                        const wasAnswered = Boolean(userAns);
                        const wasCorrect = wasAnswered && userAns.isCorrect;

                        return (
                          <div
                            key={qIdx}
                            className={`p-5 rounded-2xl border transition-all ${
                              !wasAnswered
                                ? 'bg-slate-900/60 border-slate-800'
                                : wasCorrect
                                ? 'bg-emerald-950/20 border-emerald-800/50'
                                : 'bg-rose-950/20 border-rose-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                                Question {qIdx + 1} of {iqActiveChallenges.length}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                                  !wasAnswered
                                    ? 'bg-slate-900 text-slate-400 border-slate-700'
                                    : wasCorrect
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                                    : 'bg-rose-950 text-rose-300 border-rose-800/60'
                                }`}
                              >
                                {!wasAnswered ? (
                                  <>
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>Unanswered (Time Expired)</span>
                                  </>
                                ) : wasCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Correct</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Incorrect</span>
                                  </>
                                )}
                              </span>
                            </div>

                            <h6 className="text-sm font-bold text-white mb-3 leading-relaxed">
                              {challenge.q}
                            </h6>

                            {/* Options display with visual indicators */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                              {challenge.options.map((opt, optIdx) => {
                                const isCorrectOption = optIdx === challenge.correct;
                                const isUserChoice = wasAnswered && userAns.selectedOption === optIdx;

                                let optClass = 'bg-slate-900/60 border-slate-800 text-slate-400';
                                if (isCorrectOption) {
                                  optClass = 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200 font-semibold';
                                } else if (isUserChoice && !wasCorrect) {
                                  optClass = 'bg-rose-950/60 border-rose-600/70 text-rose-200 line-through';
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optClass}`}
                                  >
                                    <span>{opt}</span>
                                    {isCorrectOption && (
                                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Correct
                                      </span>
                                    )}
                                    {isUserChoice && !isCorrectOption && (
                                      <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                                        <XCircle className="w-3 h-3" /> Your Choice
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation card */}
                            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-white">Explanation: </span>
                                <span>{challenge.expl}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-indigo-400 font-mono uppercase tracking-wider">
                    Question {iqIndex + 1} of {iqActiveChallenges.length}
                  </p>
                  <span className="text-xs text-slate-500 font-mono">
                    {iqActiveChallenges.length - (iqIndex + 1)} remaining
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-4">
                  {iqActiveChallenges[iqIndex]?.q}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {iqActiveChallenges[iqIndex]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerIQ(idx)}
                      disabled={Boolean(iqFeedback)}
                      className="p-3.5 rounded-xl text-left text-xs font-semibold bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/60 text-slate-200 transition-all disabled:opacity-60"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {iqFeedback && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    iqFeedback.correct ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                  }`}>
                    {iqFeedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{iqFeedback.msg}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. EQ Interactive Drill */}
        {activePillar === 'EQ' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 relative overflow-hidden shadow-xl">
            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800/50 mb-1 inline-block">
                Interactive Empathy Lab • Scenario {eqIndex + 1}/{eqScenarios.length}
              </span>
              <h3 className="text-lg font-bold text-white">Interpersonal Tension & Non-Defensive Communication</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Context</span>
              <p className="text-xs text-slate-400 mb-3">{eqScenarios[eqIndex].context}</p>
              <h4 className="text-sm font-semibold text-white leading-relaxed">
                "{eqScenarios[eqIndex].scenario}"
              </h4>
            </div>

            <div className="space-y-3 mb-6">
              {eqScenarios[eqIndex].choices.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setEqSelected(c)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs ${
                    eqSelected === c
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block mb-1 text-slate-200">Option {String.fromCharCode(65 + idx)}:</span>
                  {c.text}
                </button>
              ))}
            </div>

            {eqSelected && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Empathy Rating: {eqSelected.score} / 100
                  </span>
                  <span className="text-[11px] font-semibold text-slate-300 px-2 py-0.5 rounded bg-slate-800">
                    Style: {eqSelected.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {eqSelected.feedback}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setEqSelected(null);
                  setEqIndex((i) => (i + 1) % eqScenarios.length);
                }}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Next Scenario →
              </button>
            </div>
          </div>
        )}

        {/* 3. SQ Interactive Drill */}
        {activePillar === 'SQ' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800/50 mb-1 inline-block">
                  Stoic Practice Drill • Epictetus Enchiridion
                </span>
                <h3 className="text-lg font-bold text-white">Dichotomy of Control Rapid Sorter</h3>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Accuracy</span>
                <span className="text-base font-black text-amber-400 font-mono">{sqScore} / {sqItems.length}</span>
              </div>
            </div>

            {!sqCompleted ? (
              <div>
                <p className="text-xs text-slate-400 mb-2">Item {sqItemIndex + 1} of {sqItems.length}:</p>
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center mb-6">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    "{sqItems[sqItemIndex].text}"
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleSortSQ(true)}
                    className="p-4 rounded-2xl font-bold text-xs bg-emerald-950/50 border border-emerald-700/60 hover:bg-emerald-900/50 text-emerald-300 transition-all text-center flex flex-col items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Within My Direct Control</span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">My judgment, intent, effort & virtue</span>
                  </button>

                  <button
                    onClick={() => handleSortSQ(false)}
                    className="p-4 rounded-2xl font-bold text-xs bg-amber-950/50 border border-amber-700/60 hover:bg-amber-900/50 text-amber-300 transition-all text-center flex flex-col items-center justify-center gap-1"
                  >
                    <Compass className="w-5 h-5" />
                    <span>Outside My Direct Control</span>
                    <span className="text-[10px] text-amber-400/80 font-normal">Reputation, outcomes, past & externalities</span>
                  </button>
                </div>

                {sqLastResult && (
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    sqLastResult.correct ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-200' : 'bg-rose-950/60 border border-rose-800/60 text-rose-200'
                  }`}>
                    <p className="font-bold">{sqLastResult.correct ? '✓ Correct Stoic Alignment' : '✗ Stoic Blindspot'}: "{sqLastResult.text}" is {sqLastResult.verdict}.</p>
                    <p className="text-slate-300 text-[11px]">{sqLastResult.expl}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400 mx-auto mb-3">
                  <Sun className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Dichotomy Completed</h4>
                <p className="text-xs text-slate-300 mb-4">
                  Final Mastery: <span className="text-amber-400 font-mono font-bold">{sqScore} / {sqItems.length}</span> ({Math.round((sqScore / sqItems.length) * 100)}% Stoic Equanimity)
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 italic">
                  "Make the best use of what is in your power, and take the rest as it happens." — Epictetus
                </p>
                <button
                  onClick={handleResetSQ}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-700 text-slate-200 hover:text-white transition-all inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Drill</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. AQ Interactive Drill */}
        {activePillar === 'AQ' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-xl">
            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/50 mb-1 inline-block">
                Crisis Simulator • Scenario {aqIndex + 1}/{aqScenarios.length}
              </span>
              <h3 className="text-lg font-bold text-white">{aqScenarios[aqIndex].title}</h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Disruption Shock</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {aqScenarios[aqIndex].shock}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {aqScenarios[aqIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setAqChoice(opt)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs ${
                    aqChoice === opt
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-slate-100 block mb-1 text-sm">{opt.title}</span>
                  <p className="text-slate-400">{opt.desc}</p>
                </button>
              ))}
            </div>

            {aqChoice && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Adaptability Score: {aqChoice.aqScore} / 100
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aqChoice.analysis}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setAqChoice(null);
                  setAqIndex((i) => (i + 1) % aqScenarios.length);
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Next Disruption Scenario →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 2: CURATED VIDEO MASTERCLASSES
          ===================================================================== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-400" />
              <span>Curated Video Masterclasses ({activePillar})</span>
            </h2>
            <p className="text-xs text-slate-400">
              World-class lectures and breakdowns from leading cognitive scientists and thinkers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(videoMasterclasses[activePillar] || []).map((vid, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{vid.creator}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {vid.duration}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-indigo-400 transition-colors">
                  {vid.title}
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {vid.takeaway}
                </p>
              </div>

              <a
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: SCIENCE-BACKED ARTICLES & COGNITIVE GUIDES
          ===================================================================== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Foundational Literature & Frameworks ({activePillar})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Essential reading to deepen theoretical understanding and mental models
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(articleLibrary[activePillar] || []).map((art, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                  <span className="text-indigo-400 font-bold">{art.author}</span>
                  <span className="text-[11px] text-slate-500">{art.readTime}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors">
                  {art.title}
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <a
                href={art.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          SECTION 4: INFOGRAPHIC DAILY ACTIONABLE TRAINING HABITS
          ===================================================================== */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Infographic Daily Training Protocols</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/40">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">IQ Training</span>
            <p className="text-xs font-semibold text-white mb-1">Chess, Sudoku & Probability</p>
            <p className="text-[11px] text-slate-400">
              Solve 2 chess tactics or spatial puzzles daily. Review Bayes' Theorem to calibrate statistical reasoning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/40">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">EQ Training</span>
            <p className="text-xs font-semibold text-white mb-1">10-Min Nightly Emotional Journal</p>
            <p className="text-[11px] text-slate-400">
              Reflect nightly on 2 emotional moments: What triggered you somaticly? Where did you practice active empathy?
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/40">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">SQ Training</span>
            <p className="text-xs font-semibold text-white mb-1">Morning Dichotomy of Control</p>
            <p className="text-[11px] text-slate-400">
              Write down 3 things worrying you. Separate what is within your control (your actions) from what is not (externalities).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">AQ Training</span>
            <p className="text-xs font-semibold text-white mb-1">'What If...?' Voluntary Novelty</p>
            <p className="text-[11px] text-slate-400">
              Run a 'What If...?' simulation daily on your career. Deliberately try one new unfamiliar tool, language, or path weekly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
