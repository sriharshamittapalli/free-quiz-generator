"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuizData } from "@/types/quiz"

type QuizDisplayProps = {
  quizData: QuizData | null
}

const EmptyState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to Quiz Generator</h2>
      <p className="text-gray-600">
        Use the sidebar to generate a quiz prompt, then paste the JSON response to see your quiz here.
      </p>
    </div>
  </div>
)

type ChoicesListProps = {
  choices: string[]
  correctAnswer: number
  selectedAnswer: number | undefined
  onSelect: (choiceIndex: number) => void
  showAnswers: boolean
}

const ChoicesList = ({ choices, correctAnswer, selectedAnswer, onSelect, showAnswers }: ChoicesListProps) => {
  const getChoiceStyles = (choiceIndex: number) => {
    const isSelected = selectedAnswer === choiceIndex
    const isCorrect = correctAnswer === choiceIndex
    const isWrong = showAnswers && isSelected && !isCorrect
    const shouldHighlight = showAnswers && isCorrect

    if (isSelected && isWrong) return "bg-red-100 border-red-300 text-red-800"
    if (isSelected) return "bg-blue-100 border-blue-300 text-blue-800"
    if (shouldHighlight) return "bg-green-100 border-green-300 text-green-800"
    return "bg-gray-50 border-gray-200 hover:bg-gray-100"
  }

  return (
    <div className="space-y-2">
      {choices.map((choice, choiceIndex) => (
        <button
          key={choiceIndex}
          onClick={() => onSelect(choiceIndex)}
          className={`w-full p-3 text-left rounded-md border transition-colors ${
            getChoiceStyles(choiceIndex)
          } ${showAnswers ? "cursor-default" : "cursor-pointer"}`}
          disabled={showAnswers}
        >
          <span className="font-medium mr-2">
            {String.fromCharCode(65 + choiceIndex)}.
          </span>
          {choice}
        </button>
      ))}
    </div>
  )
}

export function QuizDisplay({ quizData }: QuizDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showAnswers, setShowAnswers] = useState(false)

  if (!quizData?.questions) {
    return <EmptyState />
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleRestartQuiz = () => {
    setSelectedAnswers({})
    setShowAnswers(false)
  }

  const getScore = () => {
    return quizData.questions.reduce((correct, question, index) => {
      return selectedAnswers[index] === question.answer ? correct + 1 : correct
    }, 0)
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
            {Array.isArray(question.choices) ? (
              <ChoicesList 
                choices={question.choices}
                correctAnswer={question.answer}
                selectedAnswer={selectedAnswers[questionIndex]}
                onSelect={(choiceIndex) => handleAnswerSelect(questionIndex, choiceIndex)}
                showAnswers={showAnswers}
              />
            ) : (
              <div className="p-3 text-center text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md">
                Invalid question format: choices must be an array
              </div>
            )}
            
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