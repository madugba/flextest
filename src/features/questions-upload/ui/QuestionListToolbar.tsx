import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Trash2 } from 'lucide-react'
import type { Question } from '@/entities/question'

interface QuestionListToolbarProps {
  filteredQuestions: Question[]
  selectedIds: Set<string>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  onRequestBulkDelete: () => void
}

export function QuestionListToolbar({
  filteredQuestions,
  selectedIds,
  setSelectedIds,
  onRequestBulkDelete,
}: QuestionListToolbarProps) {
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Checkbox
          checked={
            filteredQuestions.length > 0 && filteredQuestions.every((q) => selectedIds.has(q.id))
          }
          onCheckedChange={(checked) => {
            setSelectedIds((prev) => {
              const next = new Set(prev)
              filteredQuestions.forEach((q) => {
                if (checked) next.add(q.id)
                else next.delete(q.id)
              })
              return next
            })
          }}
        />
        <span className="text-sm text-muted-foreground">
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${filteredQuestions.length} selected`
            : 'Select all'}
        </span>
      </label>

      {selectedIds.size > 0 && (
        <Button size="sm" variant="destructive" onClick={onRequestBulkDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  )
}
