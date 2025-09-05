"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { LANGUAGE_TOPICS, FORM_OPTIONS, DEFAULT_FORM_VALUES } from "@/config/quiz-options"
import { QuizData, Question } from "@/types/quiz"

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
      
      // Process and validate questions - handle both array and object choices formats
      const processedQuestions = parsedData.questions.map((q: unknown, index: number) => {
        // Type guard for question object
        const question = q as { question?: string, choices?: unknown, answer?: unknown, explanation?: string }
        
        if (!question.question || !question.choices || typeof question.answer !== 'number' || !question.explanation) {
          setJsonError(`Question ${index + 1}: Missing required fields (question, choices, answer, explanation)`)
          return null
        }
        
        // Handle choices as either array or object (A, B, C, D format)
        let choicesArray: string[]
        if (Array.isArray(question.choices)) {
          choicesArray = question.choices
        } else if (typeof question.choices === 'object' && question.choices !== null) {
          // Convert object format {A: "...", B: "...", C: "...", D: "..."} to array
          const choicesObj = question.choices as Record<string, unknown>
          choicesArray = [choicesObj.A, choicesObj.B, choicesObj.C, choicesObj.D].filter(choice => typeof choice === 'string') as string[]
        } else {
          setJsonError(`Question ${index + 1}: Choices must be an array or object with A,B,C,D keys`)
          return null
        }

        return {
          question: question.question as string,
          choices: choicesArray,
          answer: question.answer as number,
          explanation: question.explanation as string
        }
      })

      const isValid = processedQuestions.every((q: Question | null) => q !== null)
      
      if (isValid) {
        setJsonError("")
        onQuizDataChange({ questions: processedQuestions })
        setJsonInput("")
      }
    } catch {
      setJsonError("Invalid JSON format. Please check your input.")
    }
  }

  return (
    <div className="p-4 w-full max-w-sm overflow-hidden" style={{ maxWidth: '384px', width: '100%' }}>
      <h2 className="text-lg font-semibold mb-4">Quiz Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">LANGUAGE</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">TOPIC</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">DIFFICULTY</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"># OF QUESTIONS</label>
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

        <Button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700">
          GENERATE QUIZ
        </Button>
        {copyFeedback && (
          <p className="text-center text-sm text-green-600 mt-2 font-medium">
            {copyFeedback}
          </p>
        )}
      </form>

      <div className="mt-8 border-t pt-4">
        <h3 className="text-md font-semibold mb-4">Paste Quiz JSON</h3>
        <div className="space-y-4 max-w-full overflow-hidden" style={{ maxWidth: '320px' }}>
          <Textarea
            placeholder="Paste the JSON response from Claude here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="resize-none h-32 overflow-y-auto overflow-x-hidden"
            style={{ width: '100%', maxWidth: '320px', minWidth: '0' }}
          />
          {jsonError && (
            <p className="text-red-500 text-sm">{jsonError}</p>
          )}
          <Button 
            onClick={handleJsonSubmit}
            className="w-full"
          >
            LOAD QUIZ
          </Button>
        </div>
      </div>
    </div>
  )
}