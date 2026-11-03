import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Quiz from "./components/Quiz";
import Loading from "./components/Loading";
import Results from "./components/Results";

const QUESTIONS = [
  {
    id: 1,
    question: "Which number comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "48"],
    answer: "42",
  },
  {
    id: 2,
    question:
      "If all Bloops are Razzies, and all Razzies are Lizzies, are all Bloops definitely Lizzies?",
    options: ["Yes", "No", "Cannot be determined", "Only on weekends"],
    answer: "Yes",
  },
  {
    id: 3,
    question:
      "Which direction logically replaces the question mark in this rotation sequence: Up -> Right -> Down -> ?",
    options: ["Left", "Up", "Right", "Down"],
    answer: "Left",
  },
  {
    id: 4,
    question: "Find the odd one out: 8, 27, 64, 125, 216, 350",
    options: ["64", "125", "216", "350"],
    answer: "350",
  },
  {
    id: 5,
    question:
      "A clock shows 3:15. What is the exact angle between the hour and minute hands?",
    options: ["0 degrees", "7.5 degrees", "15 degrees", "22.5 degrees"],
    answer: "7.5 degrees",
  },
];

export default function App() {
  const [step, setStep] = useState("dashboard"); // 'dashboard' | 'quiz' | 'loading' | 'results'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const startTest = () => {
    setStep("quiz");
    setStartTime(Date.now());
    setCurrentIndex(0);
    setSelectedAnswers({});
    setResults(null);
    setError(null);
  };

  const handleSelectOption = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [QUESTIONS[currentIndex].id]: {
        question: QUESTIONS[currentIndex].question,
        selected: option,
        correct: QUESTIONS[currentIndex].answer,
        isCorrect: option === QUESTIONS[currentIndex].answer,
      },
    });
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setTotalTime(elapsedTime);
    setStep("loading");

    const answersPayload = QUESTIONS.map((q) => ({
      question_id: q.id,
      question: q.question,
      user_choice: selectedAnswers[q.id]?.selected || "None",
      correct_choice: q.answer,
      is_correct: selectedAnswers[q.id]?.isCorrect || false,
    }));

    try {
      const response = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersPayload,
          total_time_seconds: elapsedTime,
        }),
      });

      if (!response.ok)
        throw new Error("Failed to fetch AI evaluation from backend.");

      const data = await response.json();
      setResults(data);
      setStep("results");
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to backend server. Make sure FastAPI is running on port 8000.",
      );
      setStep("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-10">
        {step === "dashboard" && (
          <Dashboard onStart={startTest} error={error} />
        )}

        {step === "quiz" && (
          <Quiz
            question={QUESTIONS[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={QUESTIONS.length}
            selectedOption={
              selectedAnswers[QUESTIONS[currentIndex].id]?.selected
            }
            onSelectOption={handleSelectOption}
            onNext={handleNext}
          />
        )}

        {step === "loading" && <Loading />}

        {step === "results" && results && (
          <Results
            results={results}
            totalTime={totalTime}
            onRetake={() => setStep("dashboard")}
          />
        )}
      </div>
    </div>
  );
}
