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
import type { Subject } from '@/entities/subject'
import { Copy } from 'lucide-react'

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
  const selectedQuestionCount = sourceSubjects
    .filter((s) => selectedSubjectIds.includes(s.id))
    .reduce((sum, s) => sum + s.questionCount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Exam Session
          </DialogTitle>
          <DialogDescription>
            Create a new session based on &quot;{sessionName}&quot;. Choose a name and select which subjects (and their questions) to carry over.
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Subjects to Include
            </label>

            {isDuplicateLoading ? (
              <div className="border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
                Loading subjects…
              </div>
            ) : sourceSubjects.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  No subjects with questions found in this session. You can still duplicate the session shell without questions.
                </p>
              </div>
            ) : (
              <>
                <div className="border border-gray-300 rounded-lg divide-y divide-gray-100 max-h-56 overflow-y-auto bg-gray-50">
                  {sourceSubjects.map((subject) => (
                    <label
                      key={subject.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjectIds.includes(subject.id)}
                        onChange={() => onToggleSubject(subject.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="flex-1 text-sm text-gray-700">{subject.name}</span>
                      <span className="text-xs text-gray-400 tabular-nums">
                        {subject.questionCount} question{subject.questionCount !== 1 ? 's' : ''}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-1.5">
                  <button
                    type="button"
                    className="text-xs text-primary underline hover:no-underline"
                    onClick={onSelectAll}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="text-xs text-gray-500 underline hover:no-underline"
                    onClick={onDeselectAll}
                  >
                    Deselect all
                  </button>
                </div>
              </>
            )}

            {selectedSubjectIds.length > 0 && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-800">
                  {selectedSubjectIds.length} subject{selectedSubjectIds.length !== 1 ? 's' : ''}
                  {' — '}
                  {selectedQuestionCount} question{selectedQuestionCount !== 1 ? 's' : ''} will be copied to the new session
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
