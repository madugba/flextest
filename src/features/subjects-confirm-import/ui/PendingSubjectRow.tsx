import { X } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import type { PendingSubject } from '../model/types'
import { getSubjectName } from '../model/selectors/getSubjectName'

interface PendingSubjectRowProps {
  index: number
  subject: PendingSubject
  isImporting: boolean
  onNameChange: (index: number, newName: string) => void
  onRemove: (index: number) => void
}

export function PendingSubjectRow({
  index,
  subject,
  isImporting,
  onNameChange,
  onRemove,
}: PendingSubjectRowProps) {
  const subjectName = getSubjectName(subject)
  const subjectId = subject?.subjectid
  const isEmpty = subjectName.trim().length === 0

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-md ${
        isEmpty ? 'bg-destructive/10 border border-destructive/20' : 'hover:bg-muted'
      }`}
    >
      <span className="text-sm text-muted-foreground w-8 flex-shrink-0">{index + 1}.</span>
      {subjectId && (
        <span className="text-xs text-muted-foreground w-24 flex-shrink-0 font-mono">
          ID: {subjectId}
        </span>
      )}
      <Input
        value={subjectName}
        onChange={(e) => onNameChange(index, e.target.value)}
        placeholder="Subject name"
        className={isEmpty ? 'border-destructive' : ''}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        disabled={isImporting}
        className="flex-shrink-0"
        aria-label="Remove subject"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
