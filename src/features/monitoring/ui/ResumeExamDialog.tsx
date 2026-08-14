import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

interface ResumeExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isControlling: boolean
  onConfirm: () => void
}

export function ResumeExamDialog({
  open,
  onOpenChange,
  isControlling,
  onConfirm,
}: ResumeExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resume Exam</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to resume the exam? All candidates will be able to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isControlling}>
            {isControlling ? 'Resuming...' : 'Resume Exam'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
