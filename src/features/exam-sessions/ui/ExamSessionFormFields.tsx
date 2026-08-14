import { Input } from '@/shared/ui/Input'
import type { Center } from '@/entities/center'
import type { Subject } from '@/entities/subject'
import type { ExamSessionFormData } from '../model/types'
import { SessionDateTimeCenterFields } from './SessionDateTimeCenterFields'
import { CompulsorySubjectSelect } from './CompulsorySubjectSelect'
import { SessionQuestionsConfig } from './SessionQuestionsConfig'

interface ExamSessionFormFieldsProps {
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
  centers: Center[]
  subjects: Subject[]
}

export function ExamSessionFormFields({
  formData,
  onFieldChange,
  centers,
  subjects,
}: ExamSessionFormFieldsProps) {
  return (
    <div className="space-y-4 mt-2">
      <Input
        label="Session Name"
        placeholder="e.g., UTME 2024 First Sitting"
        value={formData.name}
        onChange={(e) => onFieldChange('name', e.target.value)}
        fullWidth
        required
      />

      <SessionDateTimeCenterFields
        formData={formData}
        onFieldChange={onFieldChange}
        centers={centers}
      />

      <Input
        label="Duration (minutes)"
        type="number"
        placeholder="e.g., 60 (default 1 hour)"
        value={formData.duration}
        onChange={(e) => onFieldChange('duration', e.target.value)}
        fullWidth
        required
      />

      <CompulsorySubjectSelect
        formData={formData}
        onFieldChange={onFieldChange}
        subjects={subjects}
      />

      <SessionQuestionsConfig formData={formData} onFieldChange={onFieldChange} />
    </div>
  )
}
