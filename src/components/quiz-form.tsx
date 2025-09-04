"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { useQuiz } from "@/contexts/quiz-context"

// Language-specific topics based on official documentation
const languageTopics = {
  python: [
    { value: "variables-data-types", label: "Variables & Data Types" },
    { value: "control-flow", label: "Control Flow (if/else, loops)" },
    { value: "functions", label: "Functions & Parameters" },
    { value: "data-structures", label: "Data Structures (lists, dicts)" },
    { value: "oop", label: "Object-Oriented Programming" },
    { value: "error-handling", label: "Error Handling & Exceptions" },
    { value: "modules-packages", label: "Modules & Packages" },
    { value: "file-io", label: "File I/O Operations" },
    { value: "libraries", label: "Popular Libraries (pandas, numpy)" }
  ],
  fastapi: [
    { value: "basic-setup", label: "Basic Setup & Installation" },
    { value: "path-operations", label: "Path Operations & Routing" },
    { value: "request-response", label: "Request & Response Models" },
    { value: "pydantic-models", label: "Pydantic Data Validation" },
    { value: "dependency-injection", label: "Dependency Injection System" },
    { value: "authentication", label: "Authentication & Security" },
    { value: "async-await", label: "Async/Await & Performance" },
    { value: "database-integration", label: "Database Integration" },
    { value: "testing-debugging", label: "Testing & Debugging" }
  ],
  nextjs: [
    { value: "app-router", label: "App Router & Routing" },
    { value: "server-components", label: "Server & Client Components" },
    { value: "rendering", label: "SSR, SSG & ISR" },
    { value: "api-routes", label: "API Routes & Route Handlers" },
    { value: "data-fetching", label: "Data Fetching Strategies" },
    { value: "styling", label: "Styling (CSS, Tailwind)" },
    { value: "image-optimization", label: "Image & Performance Optimization" },
    { value: "middleware", label: "Middleware & Authentication" },
    { value: "deployment", label: "Deployment & Production" }
  ],
  react: [
    { value: "components-jsx", label: "Components & JSX" },
    { value: "hooks", label: "React Hooks (useState, useEffect)" },
    { value: "state-management", label: "State Management" },
    { value: "props-context", label: "Props & Context API" },
    { value: "event-handling", label: "Event Handling" },
    { value: "lifecycle", label: "Component Lifecycle" },
    { value: "forms-controlled", label: "Forms & Controlled Components" },
    { value: "performance", label: "Performance Optimization" },
    { value: "testing", label: "Testing React Components" }
  ],
  typescript: [
    { value: "basic-types", label: "Basic Types & Type Annotations" },
    { value: "interfaces", label: "Interfaces & Object Types" },
    { value: "functions", label: "Function Types & Parameters" },
    { value: "generics", label: "Generics & Type Parameters" },
    { value: "union-intersection", label: "Union & Intersection Types" },
    { value: "classes", label: "Classes & Inheritance" },
    { value: "modules", label: "Modules & Namespaces" },
    { value: "utility-types", label: "Utility Types & Mapped Types" },
    { value: "type-guards", label: "Type Guards & Type Narrowing" }
  ]
}

// Language options
const languageOptions = [
  { value: "python", label: "Python" },
  { value: "fastapi", label: "FastAPI" },
  { value: "nextjs", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" }
]

// Question count options
const questionOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "30", label: "30" }
]

const formSchema = z.object({
  language: z.string().min(1, "Please select a language."),
  topic: z.string().min(1, "Please select a topic."),
  difficulty: z.string().min(1, "Please select a difficulty."),
  questions: z.string().min(1, "Please select number of questions."),
})

export function QuizForm() {
  const [jsonInput, setJsonInput] = useState("")
  const [jsonError, setJsonError] = useState("")
  const [copyFeedback, setCopyFeedback] = useState("")
  const [availableTopics, setAvailableTopics] = useState<{value: string, label: string}[]>(languageTopics.python)
  const { setQuizData } = useQuiz()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "python",
      topic: "variables-data-types",
      difficulty: "intermediate",
      questions: "5",
    },
  })

  // Watch for language changes
  const watchedLanguage = form.watch("language")

  // Update available topics when language changes
  useEffect(() => {
    if (watchedLanguage && languageTopics[watchedLanguage as keyof typeof languageTopics]) {
      const newTopics = languageTopics[watchedLanguage as keyof typeof languageTopics]
      setAvailableTopics(newTopics)
      // Reset topic to first available topic when language changes
      form.setValue("topic", newTopics[0].value)
    }
  }, [watchedLanguage, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const prompt = `Give me ${values.questions} multiple choice questions about ${values.topic} in the ${values.language} programming language/framework. The questions should be at an ${values.difficulty} level. Return your answer only in the form of a JSON object. The JSON object should have a key named "questions" which is an array of all the questions. Each question should have: "question" (string), "choices" (array of 4 strings), "answer" (number index of correct choice 0-3), and "explanation" (string). Example format: {"questions": [{"question": "What is...", "choices": ["option1", "option2", "option3", "option4"], "answer": 1, "explanation": "Because..."}]}`
    
    navigator.clipboard.writeText(prompt).then(() => {
      setCopyFeedback("Prompt copied to clipboard! ✓")
      setTimeout(() => setCopyFeedback(""), 3000)
    }).catch(() => {
      setCopyFeedback("Failed to copy prompt")
      setTimeout(() => setCopyFeedback(""), 3000)
    })
  }

  function handleJsonSubmit() {
    try {
      const parsedData = JSON.parse(jsonInput)
      if (parsedData.questions && Array.isArray(parsedData.questions)) {
        // Validate and normalize each question structure
        const normalizedQuestions = parsedData.questions.map((q: unknown, index: number) => {
          // Type guard to ensure q is an object with the expected properties
          if (typeof q !== 'object' || q === null) {
            setJsonError(`Question ${index + 1}: Invalid question format`)
            return null
          }
          
          const question = q as Record<string, unknown>
          
          if (!question.question || typeof question.question !== 'string') {
            setJsonError(`Question ${index + 1}: Missing or invalid 'question' field`)
            return null
          }
          
          // Handle both array and object formats for choices
          let choices: string[]
          if (Array.isArray(question.choices)) {
            choices = question.choices
          } else if (question.choices && typeof question.choices === 'object') {
            // Convert object format {A: "...", B: "...", C: "...", D: "..."} to array
            const choicesObj = question.choices as Record<string, unknown>
            choices = [choicesObj.A, choicesObj.B, choicesObj.C, choicesObj.D].filter((choice): choice is string => typeof choice === 'string')
          } else {
            setJsonError(`Question ${index + 1}: 'choices' must be an array or object with A,B,C,D keys`)
            return null
          }
          
          if (choices.length === 0) {
            setJsonError(`Question ${index + 1}: No valid choices found`)
            return null
          }
          
          if (typeof question.answer !== 'number' || question.answer < 0 || question.answer >= choices.length) {
            setJsonError(`Question ${index + 1}: Invalid 'answer' index`)
            return null
          }
          
          if (!question.explanation || typeof question.explanation !== 'string') {
            setJsonError(`Question ${index + 1}: Missing or invalid 'explanation' field`)
            return null
          }
          
          return {
            question: question.question,
            choices,
            answer: question.answer,
            explanation: question.explanation
          }
        })
        
        const isValidStructure = normalizedQuestions.every((q: unknown) => q !== null)
        
        if (isValidStructure) {
          setJsonError("")
          setQuizData({ questions: normalizedQuestions })
          setJsonInput("") // Clear the input after successful load
        }
      } else {
        setJsonError("Invalid JSON format. Expected 'questions' array.")
      }
    } catch {
      setJsonError("Invalid JSON format. Please check your input.")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Quiz Settings</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LANGUAGE</FormLabel>
                <FormControl>
                  <Combobox
                    options={languageOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select or type a language..."
                    searchPlaceholder="Search or type language..."
                    emptyText="Type your custom language"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TOPIC</FormLabel>
                <FormControl>
                  <Combobox
                    options={availableTopics}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select or type a topic..."
                    searchPlaceholder="Search or type topic..."
                    emptyText="Type your custom topic"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DIFFICULTY</FormLabel>
                <FormControl>
                  <Combobox
                    options={[
                      { value: "beginner", label: "Beginner" },
                      { value: "intermediate", label: "Intermediate" },
                      { value: "advanced", label: "Advanced" }
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select or type difficulty..."
                    searchPlaceholder="Search or type difficulty..."
                    emptyText="Type your custom difficulty"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel># OF QUESTIONS</FormLabel>
                <FormControl>
                  <Combobox
                    options={questionOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select or type number of questions..."
                    searchPlaceholder="Search or type number..."
                    emptyText="Type your custom number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700">
            GENERATE QUIZ
          </Button>
          {copyFeedback && (
            <p className="text-center text-sm text-green-600 mt-2 font-medium">
              {copyFeedback}
            </p>
          )}
        </form>
      </Form>

      <div className="mt-8 border-t pt-4">
        <h3 className="text-md font-semibold mb-4">Paste Quiz JSON</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste the JSON response from Claude here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="resize-none h-32 overflow-y-auto"
          />
          {jsonError && (
            <p className="text-red-500 text-sm">{jsonError}</p>
          )}
          <Button 
            onClick={handleJsonSubmit}
            className="w-full"
            disabled={!jsonInput.trim()}
          >
            LOAD QUIZ
          </Button>
        </div>
      </div>
    </div>
  )
}