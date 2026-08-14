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

interface PauseExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isControlling: boolean
  onConfirm: () => void
}

export function PauseExamDialog({
  open,
  onOpenChange,
  isControlling,
  onConfirm,
}: PauseExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pause Exam</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to pause the exam? All candidates will be temporarily stopped.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isControlling}>
            {isControlling ? 'Pausing...' : 'Pause Exam'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
