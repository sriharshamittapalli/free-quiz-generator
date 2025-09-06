import { Input } from "@/components/ui/input"

type FormData = {
  language: string
  topic: string
  difficulty: string
  questions: string
}

type FormFieldsProps = {
  formData: FormData
  formErrors: Record<string, string>
  onUpdate: (field: keyof FormData, value: string) => void
}

export function FormFields({ formData, formErrors, onUpdate }: FormFieldsProps) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Language
        </label>
        <Input
          type="text"
          placeholder="e.g., Python, JavaScript, React, FastAPI..."
          value={formData.language}
          onChange={(event) => onUpdate('language', event.target.value)}
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
          onChange={(event) => onUpdate('topic', event.target.value)}
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
          onChange={(event) => onUpdate('difficulty', event.target.value)}
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
          onChange={(event) => onUpdate('questions', event.target.value)}
          min="1"
          max="50"
        />
        {formErrors.questions && (
          <p className="text-sm font-medium text-destructive">
            {formErrors.questions}
          </p>
        )}
      </div>
    </>
  )
}