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
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { AlertCircle, Edit2, Save } from 'lucide-react'
import type { AnswerOption } from '@/entities/question'
import type { QuestionFormData } from '../model/types'

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

          <div className="space-y-2">
            <Label>Question *</Label>
            <RichTextEditor
              value={formData.question}
              onChange={(value) => setFormData({ ...formData, question: value })}
              placeholder="Enter question text"
              minHeight="180px"
            />
          </div>

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

          <div className="space-y-2">
            <Label>Correct Answer *</Label>
            <Select
              value={formData.answer}
              onValueChange={(value) => setFormData({ ...formData, answer: value as AnswerOption })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Option A</SelectItem>
                <SelectItem value="B">Option B</SelectItem>
                <SelectItem value="C">Option C</SelectItem>
                <SelectItem value="D">Option D</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
