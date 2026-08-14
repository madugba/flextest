import { Button } from '@/shared/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import type { Center } from '@/entities/center'
import type { Subject } from '@/entities/subject'
import type { ExamSessionFormData } from '../model/types'
import { ExamSessionFormFields } from './ExamSessionFormFields'

interface EditExamSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: ExamSessionFormData
  onFieldChange: (field: keyof ExamSessionFormData, value: string) => void
  centers: Center[]
  subjects: Subject[]
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function EditExamSessionDialog({
  open,
  onOpenChange,
  formData,
  onFieldChange,
  centers,
  subjects,
  isSubmitting,
  onCancel,
  onSubmit,
}: EditExamSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam Session</DialogTitle>
          <DialogDescription>
            Update the exam session details
          </DialogDescription>
        </DialogHeader>
        <ExamSessionFormFields
          formData={formData}
          onFieldChange={onFieldChange}
          centers={centers}
          subjects={subjects}
        />
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
