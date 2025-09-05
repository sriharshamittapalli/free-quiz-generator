import { QuizData, Question } from "@/types/quiz"

type RawQuestion = {
  question: string
  choices: string[] | { A: string; B: string; C: string; D: string; [key: string]: string }
  answer: number
  explanation: string
}

type RawQuizData = {
  questions: RawQuestion[]
}

export function normalizeQuizData(rawData: RawQuizData): QuizData {
  const normalizedQuestions: Question[] = rawData.questions.map(question => {
    let normalizedChoices: string[]
    
    if (Array.isArray(question.choices)) {
      normalizedChoices = question.choices
    } else {
      const choicesObj = question.choices as { [key: string]: string }
      const keys = Object.keys(choicesObj).sort()
      normalizedChoices = keys.map(key => choicesObj[key])
    }

    return {
      question: question.question,
      choices: normalizedChoices,
      answer: question.answer,
      explanation: question.explanation
    }
  })

  return {
    questions: normalizedQuestions
  }
}