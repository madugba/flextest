'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { AlertCircle, Edit2, Save } from 'lucide-react'
import type { AnswerOption } from '@/entities/question'
import type { QuestionFormData } from '../model/types'
import { QuestionTextEditor } from './QuestionTextEditor'
import { QuestionOptionFields } from './QuestionOptionFields'
import { AnswerOptionSelect } from './AnswerOptionSelect'

interface EditQuestionDialogProps {
  open: boolean
  isSaving: boolean
  error: string | null
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  onSubmit: (e: FormEvent) => Promise<void>
  onCancel: () => void
}

export function EditQuestionDialog({
  open,
  isSaving,
  error,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: EditQuestionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSaving && !nextOpen) onCancel()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Question
          </DialogTitle>
          <DialogDescription>
            Update the question text, options, and correct answer below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </Alert>
          )}

          <QuestionTextEditor formData={formData} setFormData={setFormData} />

          <QuestionOptionFields formData={formData} setFormData={setFormData} />

          <AnswerOptionSelect
            value={formData.answer}
            onChange={(value) => setFormData({ ...formData, answer: value as AnswerOption })}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
