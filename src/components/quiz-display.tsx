"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Question {
  question: string
  choices: string[]
  answer: number
  explanation: string
}

interface QuizData {
  questions: Question[]
}

interface QuizDisplayProps {
  quizData: QuizData | null
}

export function QuizDisplay({ quizData }: QuizDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({})
  const [showAnswers, setShowAnswers] = useState(false)

  const handleRestartQuiz = () => {
    setSelectedAnswers({})
    setShowAnswers(false)
  }

  if (!quizData || !quizData.questions) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Quiz Generator</h2>
          <p className="text-gray-600">
            Use the sidebar to generate a quiz prompt, then paste the JSON response to see your quiz here.
          </p>
        </div>
      </div>
    )
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const getScore = () => {
    let correct = 0
    quizData.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correct++
      }
    })
    return correct
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz Questions</h1>
        <div className="flex gap-2">
          <Badge variant="outline">
            {quizData.questions.length} Questions
          </Badge>
          {showAnswers && (
            <Badge variant={getScore() === quizData.questions.length ? "default" : "secondary"}>
              Score: {getScore()}/{quizData.questions.length}
            </Badge>
          )}
        </div>
      </div>

      {quizData.questions.map((question, questionIndex) => (
        <Card key={questionIndex} className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span>Question {questionIndex + 1}</span>
              {showAnswers && (
                <Badge 
                  variant={selectedAnswers[questionIndex] === question.answer ? "default" : "destructive"}
                >
                  {selectedAnswers[questionIndex] === question.answer ? "Correct" : "Wrong"}
                </Badge>
              )}
            </CardTitle>
            <p className="text-lg">{question.question}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {question.choices.map((choice, choiceIndex) => {
                const isSelected = selectedAnswers[questionIndex] === choiceIndex
                const isCorrect = question.answer === choiceIndex
                const isWrong = showAnswers && isSelected && !isCorrect
                const shouldHighlight = showAnswers && isCorrect

                return (
                  <button
                    key={choiceIndex}
                    onClick={() => handleAnswerSelect(questionIndex, choiceIndex)}
                    className={`w-full p-3 text-left rounded-md border transition-colors cursor-pointer ${
                      isSelected
                        ? isWrong
                          ? "bg-red-100 border-red-300 text-red-800"
                          : "bg-blue-100 border-blue-300 text-blue-800"
                        : shouldHighlight
                        ? "bg-green-100 border-green-300 text-green-800"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    } ${showAnswers ? "cursor-default" : ""}`}
                    disabled={showAnswers}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + choiceIndex)}.
                    </span>
                    {choice}
                  </button>
                )
              })}
            </div>
            
            {showAnswers && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold text-sm mb-2">Explanation:</h4>
                <p className="text-sm text-gray-700">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center gap-4">
        <Button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-8"
        >
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Button>
        {Object.keys(selectedAnswers).length > 0 && (
          <Button
            onClick={handleRestartQuiz}
            variant="outline"
            className="px-8"
          >
            Restart Quiz
          </Button>
        )}
      </div>
    </div>
  )
}