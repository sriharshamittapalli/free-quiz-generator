"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import { formatTextForMarkdown } from "@/utils/text-formatter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChoicesList } from "@/components/choices-list"
import { QuizData } from "@/types/quiz"

type QuizDisplayProps = {
  quizData: QuizData | null
}

const EmptyState = () => (
  <div className="flex items-center justify-center min-h-[500px]">
    <div className="text-center max-w-lg">
      <h2 className="text-3xl font-bold mb-4">Welcome to Quiz Generator</h2>
      <p className="text-gray-600 text-lg">
        Use the form panel to generate a quiz prompt, then paste the JSON response to see your quiz here.
      </p>
    </div>
  </div>
)


export function QuizDisplay({ quizData }: QuizDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  if (!quizData?.questions) {
    return <EmptyState />
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const currentSelectedAnswer = selectedAnswers[currentQuestionIndex]
  const hasAnsweredCurrent = currentSelectedAnswer !== undefined
  const isCurrentAnswerCorrect = currentSelectedAnswer === currentQuestion.answer

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleRestartQuiz = () => {
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
  }

  const getScore = () => {
    return quizData.questions.reduce((correct, question, index) => {
      return selectedAnswers[index] === question.answer ? correct + 1 : correct
    }, 0)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz Questions</h1>
        <div className="flex gap-2">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </Badge>
          <Badge variant={getScore() === quizData.questions.length ? "default" : "secondary"}>
            Score: {getScore()}/{quizData.questions.length}
          </Badge>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <span>Question {currentQuestionIndex + 1}</span>
            {hasAnsweredCurrent && (
              <Badge variant={isCurrentAnswerCorrect ? "default" : "destructive"}>
                {isCurrentAnswerCorrect ? "Correct" : "Wrong"}
              </Badge>
            )}
          </CardTitle>
          <div className="text-lg prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {formatTextForMarkdown(currentQuestion.question)}
            </ReactMarkdown>
          </div>
        </CardHeader>
        <CardContent>
          {Array.isArray(currentQuestion.choices) ? (
            <ChoicesList 
              choices={currentQuestion.choices}
              correctAnswer={currentQuestion.answer}
              selectedAnswer={currentSelectedAnswer}
              onSelect={(choiceIndex) => handleAnswerSelect(currentQuestionIndex, choiceIndex)}
              showAnswers={hasAnsweredCurrent}
            />
          ) : (
            <div className="p-3 text-center text-gray-500 bg-yellow-50 border border-yellow-200 rounded-md">
              Invalid question format: choices must be an array
            </div>
          )}
          
          {hasAnsweredCurrent && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
              <h4 className="font-semibold text-sm mb-2">Explanation:</h4>
              <div className="text-sm text-gray-700 leading-relaxed prose prose-slate prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                  {formatTextForMarkdown(currentQuestion.explanation)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <Button
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="px-8"
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
          disabled={currentQuestionIndex === quizData.questions.length - 1}
          variant="outline"
          className="px-8"
        >
          Next
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
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