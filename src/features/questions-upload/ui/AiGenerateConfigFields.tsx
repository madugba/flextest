import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import type { AiGenerateFormData } from '../model/types'

interface AiGenerateConfigFieldsProps {
  aiGenerateFormData: AiGenerateFormData
  onNumQuestionsChange: (value: number) => void
  onDifficultyChange: (value: string) => void
}

export function AiGenerateConfigFields({
  aiGenerateFormData,
  onNumQuestionsChange,
  onDifficultyChange,
}: AiGenerateConfigFieldsProps) {
  return (
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
            onNumQuestionsChange(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
          }
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty" className="text-sm font-medium">
          Difficulty Level
        </Label>
        <Select value={aiGenerateFormData.difficultyLevel} onValueChange={onDifficultyChange}>
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
  )
}
