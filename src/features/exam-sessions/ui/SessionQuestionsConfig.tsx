import { Input } from '@/shared/ui/Input'
import type { ExamSessionFormData } from '../model/types'

interface SessionQuestionsConfigProps {
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
}

export function SessionQuestionsConfig({
  formData,
  onFieldChange,
}: SessionQuestionsConfigProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Hall Capacity"
          type="number"
          placeholder="e.g., 100"
          value={formData.hallCapacity}
          onChange={(e) => onFieldChange('hallCapacity', e.target.value)}
          fullWidth
        />

        <Input
          label="Total Questions"
          type="number"
          placeholder="e.g., 180"
          value={formData.totalQuestion}
          onChange={(e) => onFieldChange('totalQuestion', e.target.value)}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Compulsory Questions"
          type="number"
          placeholder="e.g., 60"
          value={formData.totalCompulsoryQuestion}
          onChange={(e) => onFieldChange('totalCompulsoryQuestion', e.target.value)}
          fullWidth
        />

        <Input
          label="Other Questions"
          type="number"
          placeholder="e.g., 120"
          value={formData.totalOtherQuestions}
          onChange={(e) => onFieldChange('totalOtherQuestions', e.target.value)}
          fullWidth
        />
      </div>
    </>
  )
}
