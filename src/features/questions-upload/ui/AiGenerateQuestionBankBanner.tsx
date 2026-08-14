import { FileText } from 'lucide-react'

interface AiGenerateQuestionBankBannerProps {
  currentQuestionCount: number
  subjectName?: string
}

export function AiGenerateQuestionBankBanner({
  currentQuestionCount,
  subjectName,
}: AiGenerateQuestionBankBannerProps) {
  return (
    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Current Question Bank
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            {currentQuestionCount} question{currentQuestionCount !== 1 ? 's' : ''} currently
            uploaded for <span className="font-medium">{subjectName}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
