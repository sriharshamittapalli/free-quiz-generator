export type Question = {
  question: string
  choices: string[]
  answer: number
  explanation: string
}

export type QuizData = {
  questions: Question[]
}