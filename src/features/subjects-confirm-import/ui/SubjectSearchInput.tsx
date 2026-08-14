import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/Input'

interface SubjectSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SubjectSearchInput({ value, onChange }: SubjectSearchInputProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
