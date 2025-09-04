"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface QuizData {
  questions: Array<{
    question: string
    choices: string[]
    answer: number
    explanation: string
  }>
}

interface QuizContextType {
  quizData: QuizData | null
  setQuizData: (data: QuizData | null) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}