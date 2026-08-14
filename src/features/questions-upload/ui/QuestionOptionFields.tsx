import type { Dispatch, SetStateAction } from 'react'
import { Label } from '@/shared/ui/label'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import type { QuestionFormData } from '../model/types'

interface QuestionOptionFieldsProps {
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
}

export function QuestionOptionFields({ formData, setFormData }: QuestionOptionFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(['A', 'B', 'C', 'D'] as const).map((option) => (
        <div key={option} className="space-y-2">
          <Label>
            Option {option}
            {formData.answer === option && (
              <span className="ml-2 text-xs font-normal text-green-600">(correct)</span>
            )}
          </Label>
          <RichTextEditor
            value={formData[`option${option}`]}
            onChange={(value) => setFormData({ ...formData, [`option${option}`]: value })}
            placeholder={`Enter option ${option}`}
            minHeight="100px"
          />
        </div>
      ))}
    </div>
  )
}
