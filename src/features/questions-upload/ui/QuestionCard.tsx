import type { Dispatch, SetStateAction } from 'react'
import { Card, CardContent } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { Checkbox } from '@/shared/ui/checkbox'
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import type { Question } from '@/entities/question'

interface QuestionCardProps {
  question: Question
  originalIndex: number
  selected: boolean
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  onEdit: (question: Question) => void
  onRequestDelete: (question: Question) => void
}

export function QuestionCard({
  question,
  originalIndex,
  selected,
  setSelectedIds,
  onEdit,
  onRequestDelete,
}: QuestionCardProps) {
  return (
    <Card
      className={`border-2 transition-colors ${
        selected ? 'border-primary/50 bg-primary/5' : ''
      }`}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) => {
                  setSelectedIds((prev) => {
                    const next = new Set(prev)
                    if (checked) next.add(question.id)
                    else next.delete(question.id)
                    return next
                  })
                }}
              />
              <Badge variant="outline" className="text-base px-3 py-1">
                Question {originalIndex + 1}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(question)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onRequestDelete(question)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 mb-2">Question:</p>
            <div
              className="text-gray-900 bg-gray-50 p-3 rounded"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionKey = `option${option}` as keyof Question
              const isCorrect = question.answer === option

              return (
                <div
                  key={option}
                  className={`p-3 rounded border-2 ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Badge variant={isCorrect ? 'default' : 'outline'} className="shrink-0">{option}</Badge>
                    <div
                      className="flex-1 text-sm"
                      dangerouslySetInnerHTML={{
                        __html: question[optionKey] as string,
                      }}
                    />
                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
