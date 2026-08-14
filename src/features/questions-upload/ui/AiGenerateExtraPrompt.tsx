import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'

interface AiGenerateExtraPromptProps {
  extraPrompt: string
  onExtraPromptChange: (value: string) => void
}

export function AiGenerateExtraPrompt({ extraPrompt, onExtraPromptChange }: AiGenerateExtraPromptProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="extra-prompt" className="text-sm font-medium">
        Additional Instructions <span className="text-gray-400">(Optional)</span>
      </Label>
      <Textarea
        id="extra-prompt"
        placeholder="e.g., Focus on specific topics, include diagrams, add real-world examples..."
        value={extraPrompt}
        onChange={(e) => onExtraPromptChange(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <p className="text-xs text-gray-500">
        Provide specific guidance to customize the generated questions
      </p>
    </div>
  )
}
