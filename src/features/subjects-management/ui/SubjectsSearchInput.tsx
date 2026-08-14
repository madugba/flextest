import { Input } from '@/shared/ui/Input'

interface SubjectsSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SubjectsSearchInput({ value, onChange }: SubjectsSearchInputProps) {
  return (
    <div className="max-w-md">
      <Input
        placeholder="Search subjects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
    </div>
  )
}
