import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import { formatTextForMarkdown } from "@/utils/text-formatter"

type ChoicesListProps = {
  choices: string[]
  correctAnswer: number
  selectedAnswer: number | undefined
  onSelect: (choiceIndex: number) => void
  showAnswers: boolean
}

export function ChoicesList({ choices, correctAnswer, selectedAnswer, onSelect, showAnswers }: ChoicesListProps) {
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
          <ReactMarkdown 
            remarkPlugins={[remarkBreaks]}
            components={{
              p: ({ children }) => <span>{children}</span>
            }}
          >{formatTextForMarkdown(choice)}</ReactMarkdown>
        </button>
      ))}
    </div>
  )
}