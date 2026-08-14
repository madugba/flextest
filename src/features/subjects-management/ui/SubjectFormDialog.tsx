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

interface SubjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  subjectName: string
  onSubjectNameChange: (value: string) => void
  isSubmitting: boolean
  submitLabel: string
  onSubmit: () => void
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  title,
  description,
  subjectName,
  onSubjectNameChange,
  isSubmitting,
  submitLabel,
  onSubmit,
}: SubjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            label="Subject Name"
            value={subjectName}
            onChange={(e) => onSubjectNameChange(e.target.value)}
            fullWidth
            required
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
