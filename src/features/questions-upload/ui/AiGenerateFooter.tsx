import { Button } from '@/shared/ui/Button'
import { Loader2, Sparkles } from 'lucide-react'

interface AiGenerateFooterProps {
  isGenerating: boolean
  modelId: string
  numQuestions: number
  onCancel: () => void
  onGenerate: () => void
}

export function AiGenerateFooter({
  isGenerating,
  modelId,
  numQuestions,
  onCancel,
  onGenerate,
}: AiGenerateFooterProps) {
  return (
    <>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onGenerate}
        disabled={!modelId || isGenerating}
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
            Generate {numQuestions} Question
            {numQuestions !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </>
  )
}
