'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogFooter } from '@/shared/ui/dialog'
import type { Subject } from '@/entities/subject'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { AiGenerateFormData } from '../model/types'
import { DEFAULT_AI_GENERATE_FORM } from '../model/state/useQuestionAiState'
import { AiGenerateDialogHeader } from './AiGenerateDialogHeader'
import { AiGenerateQuestionBankBanner } from './AiGenerateQuestionBankBanner'
import { AiModelSelector } from './AiModelSelector'
import { AiGenerateConfigFields } from './AiGenerateConfigFields'
import { AiGenerateExtraPrompt } from './AiGenerateExtraPrompt'
import { AiGenerateFooter } from './AiGenerateFooter'

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
  const handleCancel = () => {
    setAiGenerateFormData(DEFAULT_AI_GENERATE_FORM)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <AiGenerateDialogHeader />

        <div className="space-y-6 py-4">
          <AiGenerateQuestionBankBanner
            currentQuestionCount={currentQuestionCount}
            subjectName={subject?.name}
          />

          <AiModelSelector
            aiModels={aiModels}
            modelId={aiGenerateFormData.modelId}
            onModelIdChange={(value) =>
              setAiGenerateFormData({ ...aiGenerateFormData, modelId: value })
            }
          />

          <AiGenerateConfigFields
            aiGenerateFormData={aiGenerateFormData}
            onNumQuestionsChange={(value) =>
              setAiGenerateFormData({ ...aiGenerateFormData, numQuestions: value })
            }
            onDifficultyChange={(value) =>
              setAiGenerateFormData({
                ...aiGenerateFormData,
                difficultyLevel: value as 'easy' | 'medium' | 'hard',
              })
            }
          />

          <AiGenerateExtraPrompt
            extraPrompt={aiGenerateFormData.extraPrompt}
            onExtraPromptChange={(value) =>
              setAiGenerateFormData({ ...aiGenerateFormData, extraPrompt: value })
            }
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <AiGenerateFooter
            isGenerating={isGenerating}
            modelId={aiGenerateFormData.modelId}
            numQuestions={aiGenerateFormData.numQuestions}
            onCancel={handleCancel}
            onGenerate={onGenerate}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
