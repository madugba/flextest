import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

interface AnswerOptionSelectProps {
  value: string
  onChange: (value: string) => void
}

export function AnswerOptionSelect({ value, onChange }: AnswerOptionSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Correct Answer *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select correct answer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A">Option A</SelectItem>
          <SelectItem value="B">Option B</SelectItem>
          <SelectItem value="C">Option C</SelectItem>
          <SelectItem value="D">Option D</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
