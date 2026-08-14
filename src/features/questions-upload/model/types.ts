import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react'
import type { AnswerOption } from '@/entities/question'
import type { GeneratedQuestion } from '@/shared/services/ai-generation.service'
import type { AIModelConfiguration } from '@/entities/ai-model'
import type { Subject } from '@/entities/subject'

export type ValidParsedRow = {
  rowNumber: number
  valid: true
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption
}

export type InvalidParsedRow = {
  rowNumber: number
  valid: false
  errors: string[]
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
}

export type ParsedRow = ValidParsedRow | InvalidParsedRow

export interface QuestionFormData {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: AnswerOption | ''
}

export interface AiGenerateFormData {
  modelId: string
  numQuestions: number
  difficultyLevel: 'easy' | 'medium' | 'hard'
  extraPrompt: string
}

export interface PageDialogsProps {
  editDialogOpen: boolean
  isSaving: boolean
  error: string | null
  formData: QuestionFormData
  setFormData: Dispatch<SetStateAction<QuestionFormData>>
  onSubmitEdit: (e: FormEvent) => Promise<void>
  onCancelEdit: () => void
  importDialogOpen: boolean
  setImportDialogOpen: Dispatch<SetStateAction<boolean>>
  isImporting: boolean
  parsedRows: ParsedRow[]
  setParsedRows: Dispatch<SetStateAction<ParsedRow[]>>
  setImportFile: Dispatch<SetStateAction<File | null>>
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
  onDownloadSample: () => void
  onImport: () => Promise<void>
  deleteDialogOpen: boolean
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>
  onDelete: () => Promise<void>
  bulkDeleteConfirmOpen: boolean
  setBulkDeleteConfirmOpen: Dispatch<SetStateAction<boolean>>
  selectedCount: number
  isBulkDeleting: boolean
  onBulkDelete: () => Promise<void>
  previewDialogOpen: boolean
  setPreviewDialogOpen: Dispatch<SetStateAction<boolean>>
  generatedQuestions: GeneratedQuestion[]
  isSubmittingGenerated: boolean
  onSubmitGenerated: () => Promise<void>
  aiGenerateDialogOpen: boolean
  setAiGenerateDialogOpen: Dispatch<SetStateAction<boolean>>
  currentQuestionCount: number
  subject: Subject | null
  aiModels: AIModelConfiguration[]
  aiGenerateFormData: AiGenerateFormData
  setAiGenerateFormData: Dispatch<SetStateAction<AiGenerateFormData>>
  isGenerating: boolean
  onGenerate: () => Promise<void>
}
