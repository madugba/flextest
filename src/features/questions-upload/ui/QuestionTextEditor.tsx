import type { Dispatch, SetStateAction } from 'react'
import { Label } from '@/shared/ui/label'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import type { QuestionFormData } from '../model/types'

interface QuestionTextEditorProps {
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
}

export function QuestionTextEditor({ formData, setFormData }: QuestionTextEditorProps) {
  return (
    <div className="space-y-2">
      <Label>Question *</Label>
      <RichTextEditor
        value={formData.question}
        onChange={(value) => setFormData({ ...formData, question: value })}
        placeholder="Enter question text"
        minHeight="180px"
      />
    </div>
  )
}
