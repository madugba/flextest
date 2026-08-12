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
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { FileText, Loader2, Sparkles } from 'lucide-react'
import type { Subject } from '@/entities/subject'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { AiGenerateFormData } from '../model/types'

interface AiGenerateDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  currentQuestionCount: number
  subject: Subject | null
  aiModels: AIModelConfiguration[]
  aiGenerateFormData: AiGenerateFormData
  setAiGenerateFormData: Dispatch<SetStateAction<AiGenerateFormData>>
  isGenerating: boolean
  onGenerate: () => Promise<void>
}

const DEFAULT_AI_FORM: AiGenerateFormData = {
  modelId: '',
  numQuestions: 5,
  difficultyLevel: 'medium',
  extraPrompt: '',
}

export function AiGenerateDialog({
  open,
  onOpenChange,
  currentQuestionCount,
  subject,
  aiModels,
  aiGenerateFormData,
  setAiGenerateFormData,
  isGenerating,
  onGenerate,
}: AiGenerateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Generate Questions with AI</DialogTitle>
              <DialogDescription className="text-sm">
                Configure AI settings to automatically generate questions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current Question Bank
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {currentQuestionCount} question{currentQuestionCount !== 1 ? 's' : ''} currently
                  uploaded for <span className="font-medium">{subject?.name}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-model" className="text-sm font-medium">
              AI Model <span className="text-red-500">*</span>
            </Label>
            <Select
              value={aiGenerateFormData.modelId}
              onValueChange={(value) =>
                setAiGenerateFormData({ ...aiGenerateFormData, modelId: value })
              }
            >
              <SelectTrigger id="ai-model" className="w-full">
                <SelectValue placeholder="Select an AI model..." />
              </SelectTrigger>
              <SelectContent>
                {aiModels.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No AI models configured
                  </SelectItem>
                ) : (
                  aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.provider}</span>
                        {model.modelName && (
                          <span className="text-gray-500">- {model.modelName}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {aiModels.length === 0 && (
              <p className="text-xs text-gray-500">
                Configure AI models in settings to enable generation
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="num-questions" className="text-sm font-medium">
                Number of Questions
              </Label>
              <Input
                id="num-questions"
                type="number"
                min="1"
                max="20"
                value={aiGenerateFormData.numQuestions}
                onChange={(e) =>
                  setAiGenerateFormData({
                    ...aiGenerateFormData,
                    numQuestions: Math.min(20, Math.max(1, parseInt(e.target.value) || 1)),
                  })
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-sm font-medium">
                Difficulty Level
              </Label>
              <Select
                value={aiGenerateFormData.difficultyLevel}
                onValueChange={(value: 'easy' | 'medium' | 'hard') =>
                  setAiGenerateFormData({ ...aiGenerateFormData, difficultyLevel: value })
                }
              >
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Easy
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      Hard
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra-prompt" className="text-sm font-medium">
              Additional Instructions <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="extra-prompt"
              placeholder="e.g., Focus on specific topics, include diagrams, add real-world examples..."
              value={aiGenerateFormData.extraPrompt}
              onChange={(e) =>
                setAiGenerateFormData({ ...aiGenerateFormData, extraPrompt: e.target.value })
              }
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Provide specific guidance to customize the generated questions
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              setAiGenerateFormData(DEFAULT_AI_FORM)
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onGenerate}
            disabled={!aiGenerateFormData.modelId || isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {aiGenerateFormData.numQuestions} Question
                {aiGenerateFormData.numQuestions !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
