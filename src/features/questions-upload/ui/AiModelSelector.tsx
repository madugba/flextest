import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import type { AIModelConfiguration } from '@/entities/ai-model'

interface AiModelSelectorProps {
  aiModels: AIModelConfiguration[]
  modelId: string
  onModelIdChange: (value: string) => void
}

export function AiModelSelector({ aiModels, modelId, onModelIdChange }: AiModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ai-model" className="text-sm font-medium">
        AI Model <span className="text-red-500">*</span>
      </Label>
      <Select value={modelId} onValueChange={onModelIdChange}>
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
                  {model.modelName && <span className="text-gray-500">- {model.modelName}</span>}
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
  )
}
