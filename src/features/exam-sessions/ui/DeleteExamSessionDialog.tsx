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

interface DeleteExamSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionName: string | null
  isSubmitting: boolean
  onConfirm: () => void
}

export function DeleteExamSessionDialog({
  open,
  onOpenChange,
  sessionName,
  isSubmitting,
  onConfirm,
}: DeleteExamSessionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Exam Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{sessionName}&quot;? This action cannot be undone and will affect all associated candidates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
