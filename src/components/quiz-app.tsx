"use client"

import { useState } from "react"
import { QuizForm } from "@/components/quiz-form"
import { QuizDisplay } from "@/components/quiz-display"
import { QuizData } from "@/types/quiz"

export function QuizApp() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  const handleQuizDataChange = (data: QuizData | null) => {
    setQuizData(data)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      {/* Centered Container with Border - like wireframe */}
      <div className="w-full max-w-7xl bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden">
        <div className="flex h-[700px]">
          {/* Left Form Section */}
          <div className="w-96 bg-white p-8 border-r border-gray-300 overflow-y-auto">
            <QuizForm onQuizDataChange={handleQuizDataChange} />
          </div>
          
          {/* Right Quiz Section */}
          <div className="flex-1 bg-white overflow-y-auto">
            <QuizDisplay quizData={quizData} />
          </div>
        </div>
      </div>
    </div>
  )
}