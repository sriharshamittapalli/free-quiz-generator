"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { QuizData } from "@/types/quiz"
import { normalizeQuizData } from "@/utils/quiz-normalizer"

type QuizFormProps = {
  onQuizDataChange: (data: QuizData | null) => void
}

type FormData = {
  language: string
  topic: string
  difficulty: string
  questions: string
}

export function QuizForm({ onQuizDataChange }: QuizFormProps) {
  const [formData, setFormData] = useState<FormData>({
    language: "Python",
    topic: "Variables & Data Types",
    difficulty: "intermediate",
    questions: "5",
  })
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const [copyFeedback, setCopyFeedback] = useState("")

  const generatePrompt = () => {
    return `Give me ${formData.questions} multiple choice questions about ${formData.topic} in the ${formData.language} programming language/framework. 
The questions should be at an ${formData.difficulty} level. 
Return your answer only in the form of a JSON object. 
The JSON object should have a key named "questions" which is an array of all the questions. 
Each question should have: "question" (string), "choices" (array of 4 strings), "answer" (number index of correct choice 0-3), and "explanation" (string). 
Example format: {"questions": [{"question": "What is...", "choices": ["option1", "option2", "option3", "option4"], "answer": 1, "explanation": "Because..."}]}`
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.language.trim()) errors.language = "Please enter a language."
    if (!formData.topic.trim()) errors.topic = "Please enter a topic."
    if (!formData.difficulty.trim()) errors.difficulty = "Please enter a difficulty."
    if (!formData.questions.trim()) errors.questions = "Please enter number of questions."
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback("Prompt copied to clipboard! ✓")
    } catch {
      setCopyFeedback("Failed to copy prompt")
    }
    setTimeout(() => setCopyFeedback(""), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    const prompt = generatePrompt()
    copyToClipboard(prompt)
  }

  const handleJsonSubmit = () => {
    if (!jsonInput.trim()) {
      setJsonError("Please paste some JSON data first.")
      return
    }

    try {
      const parsedData = JSON.parse(jsonInput)
      
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        setJsonError("Invalid JSON format. Expected 'questions' array.")
        return
      }
      
      const normalizedData = normalizeQuizData(parsedData)
      setJsonError("")
      onQuizDataChange(normalizedData)
      setJsonInput("")
    } catch {
      setJsonError("Invalid JSON format. Please check your input.")
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
        Quiz Settings
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Language
          </label>
          <Input
            type="text"
            placeholder="e.g., Python, JavaScript, React, FastAPI..."
            value={formData.language}
            onChange={(e) => updateFormData('language', e.target.value)}
          />
          {formErrors.language && (
            <p className="text-sm font-medium text-destructive">
              {formErrors.language}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Topic
          </label>
          <Input
            type="text"
            placeholder="e.g., Variables & Data Types, Async/Await, Hooks..."
            value={formData.topic}
            onChange={(e) => updateFormData('topic', e.target.value)}
          />
          {formErrors.topic && (
            <p className="text-sm font-medium text-destructive">
              {formErrors.topic}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Difficulty
          </label>
          <Input
            type="text"
            placeholder="e.g., beginner, intermediate, advanced..."
            value={formData.difficulty}
            onChange={(e) => updateFormData('difficulty', e.target.value)}
          />
          {formErrors.difficulty && (
            <p className="text-sm font-medium text-destructive">
              {formErrors.difficulty}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            # of Questions
          </label>
          <Input
            type="number"
            placeholder="e.g., 5, 10, 15..."
            value={formData.questions}
            onChange={(e) => updateFormData('questions', e.target.value)}
            min="1"
            max="50"
          />
          {formErrors.questions && (
            <p className="text-sm font-medium text-destructive">
              {formErrors.questions}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-sm">
          Generate Quiz
        </Button>
        {copyFeedback && (
          <p className="text-center text-sm text-green-600 mt-2 font-medium">
            {copyFeedback}
          </p>
        )}
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Paste Quiz JSON</h3>
        <div className="space-y-3">
          <Textarea
            placeholder="Paste the JSON response from Claude here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="resize-none h-24 w-full text-sm"
          />
          {jsonError && (
            <p className="text-red-500 text-xs">{jsonError}</p>
          )}
          <Button 
            onClick={handleJsonSubmit}
            className="w-full text-sm"
          >
            Load Quiz
          </Button>
        </div>
      </div>
    </div>
  )
}