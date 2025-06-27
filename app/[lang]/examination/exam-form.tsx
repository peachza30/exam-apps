"use client";
import { useState, useEffect } from "react";
import Head from "next/head";

import originalQuestions from "@/data/questions";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ExaminationForm() {
  const [questions, setQuestions] = useState<typeof originalQuestions>([]);
  const [isClient, setIsClient] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(originalQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState<boolean[]>(Array(originalQuestions.length).fill(false));

  // shuffle only on client
  useEffect(() => {
    setQuestions(shuffleArray(originalQuestions));
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const updatedAnswers = [...answers];
    const updatedSubmitted = [...submitted];

    updatedAnswers[currentQuestionIndex] = selectedChoice;
    updatedSubmitted[currentQuestionIndex] = true;

    setAnswers(updatedAnswers);
    setSubmitted(updatedSubmitted);

    if (selectedChoice === currentQuestion.correct_answer) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleNext = () => {
    const next = currentQuestionIndex + 1;
    if (next < questions.length) {
      setCurrentQuestionIndex(next);
      setSelectedChoice(null);
      setShowResult(false);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setQuestions(shuffleArray(originalQuestions));
    setCurrentQuestionIndex(0);
    setSelectedChoice(null);
    setShowResult(false);
    setScore(0);
    setShowSummary(false);
  };

  return (
    <>
      <Head>
        <title>Examination App</title>
      </Head>
      <div className="flex p-6 max-w-4xl mx-auto">
        {/* Main question area */}
        <main className="flex-1 pr-6">
          {!showSummary ? (
            <>
              <h1 className="text-2xl font-bold mb-4">ข้อที่ {currentQuestionIndex + 1}</h1>
              <p className="mb-4">{currentQuestion.question}</p>
              <div className="space-y-2">
                {Object.entries(currentQuestion.choices).map(([key, value]) => (
                  <label key={key} className={`block p-2 border rounded cursor-pointer transition ${selectedChoice === key ? "bg-blue-100" : "hover:bg-gray-50"}`}>
                    <input type="radio" name="choice" value={key} className="mr-2" onChange={() => setSelectedChoice(key)} checked={selectedChoice === key} />({key}) {value}
                  </label>
                ))}
              </div>

              {!showResult ? (
                <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!selectedChoice}>
                  ตรวจคำตอบ
                </button>
              ) : (
                <>
                  <div className="mt-4 p-4 border rounded bg-gray-50">
                    {selectedChoice === currentQuestion.correct_answer ? (
                      <p className="text-green-600 font-bold">✅ ตอบถูกต้อง</p>
                    ) : (
                      <>
                        <p className="text-red-600 font-bold">❌ ตอบผิด</p>
                        <p className="mt-2">
                          คำตอบที่ถูกต้อง: ({currentQuestion.correct_answer}) {currentQuestion.choices[currentQuestion.correct_answer]}
                        </p>
                      </>
                    )}
                    <p className="mt-2 text-sm text-gray-700">{currentQuestion.explanation}</p>
                  </div>
                  <button onClick={handleNext} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
                    {currentQuestionIndex < questions.length - 1 ? "ข้อถัดไป" : "ดูสรุปผล"}
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🎉 คุณทำแบบทดสอบเสร็จแล้ว!</h2>
              <p className="text-xl">
                คะแนนของคุณ: {score} / {questions.length}
              </p>
              <button onClick={handleRestart} className="mt-6 px-6 py-2 bg-purple-600 text-white rounded">
                🔁 เริ่มใหม่และสุ่มข้อสอบ
              </button>
            </div>
          )}
        </main>

        {/* Sidebar question list */}
        <aside className="w-40 md:w-48 border-l pl-4 overflow-y-auto max-h-[80vh] sticky top-20">
          <h2 className="font-semibold mb-2">รายการข้อสอบ</h2>
          <ul className="space-y-1 text-sm pr-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isSubmitted = submitted[idx];
              const userAnswer = answers[idx];

              let className = "bg-gray-100 hover:bg-gray-200"; // default
              if (isCurrent) {
                className = "bg-blue-500 text-white"; // current question
              } else if (isSubmitted) {
                if (userAnswer === q.correct_answer) {
                  className = "bg-green-200"; // correct answer
                } else {
                  className = "bg-red-200"; // wrong answer
                }
              }

              return (
                <li key={idx}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded transition ${className}`}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setSelectedChoice(answers[idx]);
                      setShowResult(submitted[idx]);
                      setShowSummary(false);
                    }}
                  >
                    ข้อ {idx + 1}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </>
  );
}
