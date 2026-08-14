import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'

interface DeleteConfirmInputProps {
  sessionName?: string
  value: string
  onChange: (value: string) => void
}

export function DeleteConfirmInput({ sessionName, value, onChange }: DeleteConfirmInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="confirm-text" className="text-sm font-medium">
        {sessionName 
          ? `Type the session name "${sessionName}" to confirm:` 
          : 'Type DELETE to confirm:'}
      </Label>
      <Input
        id="confirm-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={sessionName || 'DELETE'}
        className="font-mono"
        autoComplete="off"
      />
    </div>
  )
}
