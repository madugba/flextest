'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Label } from '@/shared/ui/label'
import { RichTextEditor } from '@/shared/ui/RichTextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Save } from 'lucide-react'
import type { AnswerOption } from '@/entities/question'
import type { QuestionFormData } from '../model/types'

interface QuestionFormProps {
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  isSaving: boolean
  onSubmit: (e: FormEvent) => Promise<void>
}

export function QuestionForm({ formData, setFormData, isSaving, onSubmit }: QuestionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
        <CardDescription>
          Enter question and options. Supports HTML and mathematical formulas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <RichTextEditor
              value={formData.question}
              onChange={(value) => setFormData({ ...formData, question: value })}
              placeholder="Enter question text (supports formatting and mathematical formulas)"
              minHeight="200px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['A', 'B', 'C', 'D'] as const).map((option) => (
              <div key={option} className="space-y-2">
                <Label htmlFor={`option${option}`}>Option {option} *</Label>
                <RichTextEditor
                  value={formData[`option${option}`]}
                  onChange={(value) => setFormData({ ...formData, [`option${option}`]: value })}
                  placeholder={`Enter option ${option}`}
                  minHeight="120px"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Correct Answer *</Label>
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

          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Save Question
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
