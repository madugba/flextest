'use client'

import type { Dispatch, SetStateAction } from 'react'
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
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import { CheckCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'

interface PreviewGeneratedDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  generatedQuestions: GeneratedQuestion[]
  isSubmittingGenerated: boolean
  onSubmit: () => Promise<void>
}

export function PreviewGeneratedDialog({
  open,
  onOpenChange,
  generatedQuestions,
  isSubmittingGenerated,
  onSubmit,
}: PreviewGeneratedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Review Generated Questions</DialogTitle>
          <DialogDescription>
            Review the AI-generated questions before adding them to your question bank
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <div className="ml-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {generatedQuestions.length} questions generated successfully
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Please review each question carefully before submitting to ensure quality and accuracy
              </p>
            </div>
          </Alert>

          <div className="space-y-6">
            {generatedQuestions.map((q, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="shrink-0">
                        Q{index + 1}
                      </Badge>
                      <div
                        className="flex-1 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: q.question }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 ml-11">
                    {['A', 'B', 'C', 'D'].map((option) => {
                      const optionKey = `option${option}` as keyof typeof q
                      const isCorrect = q.answer === option
                      return (
                        <div
                          key={option}
                          className={`flex items-start gap-2 p-3 rounded-lg border ${
                            isCorrect
                              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                              : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
                          }`}
                        >
                          <span className="shrink-0 font-medium text-sm min-w-[20px]">
                            {option}.
                          </span>
                          <span
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: q[optionKey] as string }}
                          />
                          {isCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmittingGenerated}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmittingGenerated}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmittingGenerated ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Add {generatedQuestions.length} Questions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
