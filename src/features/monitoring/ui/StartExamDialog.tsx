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

interface StartExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duration: number
  isControlling: boolean
  onConfirm: () => void
}

export function StartExamDialog({
  open,
  onOpenChange,
  duration,
  isControlling,
  onConfirm,
}: StartExamDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start Exam</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-gray-600">
              <p>All candidates will be able to begin once started.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                <p className="font-semibold text-blue-800">Timer breakdown</p>
                <div className="flex justify-between text-blue-700">
                  <span>Original duration</span>
                  <span className="font-medium tabular-nums">
                    {duration} min
                  </span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Admin preparation buffer</span>
                  <span className="font-medium tabular-nums">+ 30 min</span>
                </div>
                <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-200 pt-1 mt-1">
                  <span>Total timer</span>
                  <span className="tabular-nums">
                    {duration + 30} min
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                The 30-minute buffer gives candidates time to settle before the exam counts down.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isControlling}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isControlling}>
            {isControlling ? 'Starting...' : 'Start Exam'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
