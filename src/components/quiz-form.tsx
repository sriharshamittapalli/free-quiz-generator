"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { LANGUAGE_TOPICS, FORM_OPTIONS, DEFAULT_FORM_VALUES } from "@/config/quiz-options"
import { QuizData, Question } from "@/types/quiz"
import { normalizeQuizData } from "@/utils/quiz-normalizer"

type QuizFormProps = {
  onQuizDataChange: (data: QuizData | null) => void
}

export function QuizForm({ onQuizDataChange }: QuizFormProps) {
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const [copyFeedback, setCopyFeedback] = useState("")
  const [availableTopics, setAvailableTopics] = useState<{value: string, label: string}[]>([...LANGUAGE_TOPICS.python])
  const [formData, setFormData] = useState({
    language: DEFAULT_FORM_VALUES.language,
    topic: DEFAULT_FORM_VALUES.topic,
    difficulty: DEFAULT_FORM_VALUES.difficulty,
    questions: DEFAULT_FORM_VALUES.questions,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (formData.language && LANGUAGE_TOPICS[formData.language as keyof typeof LANGUAGE_TOPICS]) {
      const newTopics = LANGUAGE_TOPICS[formData.language as keyof typeof LANGUAGE_TOPICS]
      setAvailableTopics([...newTopics])
      setFormData(prev => ({ ...prev, topic: newTopics[0]?.value || "" }))
    }
  }, [formData.language])

  const generatePrompt = () => {
    return `Give me ${formData.questions} multiple choice questions about ${formData.topic} in the ${formData.language} programming language/framework. The questions should be at an ${formData.difficulty} level. Return your answer only in the form of a JSON object. The JSON object should have a key named "questions" which is an array of all the questions. Each question should have: "question" (string), "choices" (array of 4 strings), "answer" (number index of correct choice 0-3), and "explanation" (string). Example format: {"questions": [{"question": "What is...", "choices": ["option1", "option2", "option3", "option4"], "answer": 1, "explanation": "Because..."}]}`
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.language) errors.language = "Please select a language."
    if (!formData.topic) errors.topic = "Please select a topic."
    if (!formData.difficulty) errors.difficulty = "Please select a difficulty."
    if (!formData.questions) errors.questions = "Please select number of questions."
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
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
      <h2 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">Quiz Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Language</label>
          <Combobox
            options={FORM_OPTIONS.languages}
            value={formData.language}
            onValueChange={(value) => updateFormData('language', value)}
            placeholder="Select or type a language..."
            searchPlaceholder="Search or type language..."
            emptyText="Type your custom language"
          />
          {formErrors.language && (
            <p className="text-sm font-medium text-destructive">{formErrors.language}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Topic</label>
          <Combobox
            options={[...availableTopics]}
            value={formData.topic}
            onValueChange={(value) => updateFormData('topic', value)}
            placeholder="Select or type a topic..."
            searchPlaceholder="Search or type topic..."
            emptyText="Type your custom topic"
          />
          {formErrors.topic && (
            <p className="text-sm font-medium text-destructive">{formErrors.topic}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Difficulty</label>
          <Combobox
            options={FORM_OPTIONS.difficulties}
            value={formData.difficulty}
            onValueChange={(value) => updateFormData('difficulty', value)}
            placeholder="Select or type difficulty..."
            searchPlaceholder="Search or type difficulty..."
            emptyText="Type your custom difficulty"
          />
          {formErrors.difficulty && (
            <p className="text-sm font-medium text-destructive">{formErrors.difficulty}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide"># of Questions</label>
          <Combobox
            options={FORM_OPTIONS.questionCounts}
            value={formData.questions}
            onValueChange={(value) => updateFormData('questions', value)}
            placeholder="Select or type number of questions..."
            searchPlaceholder="Search or type number..."
            emptyText="Type your custom number"
          />
          {formErrors.questions && (
            <p className="text-sm font-medium text-destructive">{formErrors.questions}</p>
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