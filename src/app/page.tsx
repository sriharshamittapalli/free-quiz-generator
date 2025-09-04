"use client"

import { QuizDisplay } from "@/components/quiz-display"
import { useQuiz } from "@/contexts/quiz-context"

export default function Home() {
  const { quizData } = useQuiz()

  return (
    <div className="min-h-screen">
      <QuizDisplay quizData={quizData} />
    </div>
  );
}
