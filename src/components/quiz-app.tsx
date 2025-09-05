"use client"

import { useState } from "react"
import { SidebarProvider, Sidebar, SidebarHeader, SidebarInset } from "@/components/ui/sidebar"
import { QuizForm } from "@/components/quiz-form"
import { QuizDisplay } from "@/components/quiz-display"
import { QuizData } from "@/types/quiz"

export function QuizApp() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)

  const handleQuizDataChange = (data: QuizData | null) => {
    setQuizData(data)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <QuizForm onQuizDataChange={handleQuizDataChange} />
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen">
          <QuizDisplay quizData={quizData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}