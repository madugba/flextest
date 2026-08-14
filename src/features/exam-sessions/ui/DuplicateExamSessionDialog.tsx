import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Copy } from 'lucide-react'
import type { Subject } from '@/entities/subject'
import { DuplicateSubjectList } from './DuplicateSubjectList'

interface DuplicateExamSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionName: string | null
  duplicateName: string
  onDuplicateNameChange: (value: string) => void
  sourceSubjects: Array<Subject & { questionCount: number }>
  selectedSubjectIds: string[]
  onToggleSubject: (subjectId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  isDuplicateLoading: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function DuplicateExamSessionDialog({
  open,
  onOpenChange,
  sessionName,
  duplicateName,
  onDuplicateNameChange,
  sourceSubjects,
  selectedSubjectIds,
  onToggleSubject,
  onSelectAll,
  onDeselectAll,
  isDuplicateLoading,
  isSubmitting,
  onCancel,
  onSubmit,
}: DuplicateExamSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Exam Session
          </DialogTitle>
          <DialogDescription>
            Create a new session based on &quot;{sessionName}&quot;. Choose a name and select which
            subjects (and their questions) to carry over.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            label="New Session Name"
            placeholder="e.g., Copy of UTME 2024"
            value={duplicateName}
            onChange={(e) => onDuplicateNameChange(e.target.value)}
            fullWidth
            required
          />

          <DuplicateSubjectList
            sourceSubjects={sourceSubjects}
            selectedSubjectIds={selectedSubjectIds}
            onToggleSubject={onToggleSubject}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            isDuplicateLoading={isDuplicateLoading}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || isDuplicateLoading || !duplicateName.trim()}
          >
            {isSubmitting ? 'Duplicating…' : 'Duplicate Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
