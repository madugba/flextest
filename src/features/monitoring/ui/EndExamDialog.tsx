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

interface EndExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isControlling: boolean
  onConfirm: () => void
}

export function EndExamDialog({
  open,
  onOpenChange,
  isControlling,
  onConfirm,
}: EndExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Exam</AlertDialogTitle>
          <AlertDialogDescription className="text-red-600 font-medium">
            Do you want to end the exam? This action cannot be undone. All candidates will be automatically submitted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isControlling}
            className="bg-red-600 hover:bg-red-700"
          >
            {isControlling ? 'Ending...' : 'End Exam'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
