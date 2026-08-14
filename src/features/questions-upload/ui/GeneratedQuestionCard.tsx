import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import { CheckCircle2 } from 'lucide-react'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'

interface GeneratedQuestionCardProps {
  question: GeneratedQuestion
  index: number
}

export function GeneratedQuestionCard({ question, index }: GeneratedQuestionCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0">
              Q{index + 1}
            </Badge>
            <div
              className="flex-1 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 ml-11">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionKey = `option${option}` as keyof typeof question
            const isCorrect = question.answer === option
            return (
              <div
                key={option}
                className={`flex items-start gap-2 p-3 rounded-lg border ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
                }`}
              >
                <span className="shrink-0 font-medium text-sm min-w-[20px]">{option}.</span>
                <span
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: question[optionKey] as string }}
                />
                {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
