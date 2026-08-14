import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
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
import { AlertTriangle, CalendarClock } from 'lucide-react'

interface RescheduleExamSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionName: string | null
  confirmValue: string
  onConfirmValueChange: (value: string) => void
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function RescheduleExamSessionDialog({
  open,
  onOpenChange,
  sessionName,
  confirmValue,
  onConfirmValueChange,
  isSubmitting,
  onCancel,
  onConfirm,
}: RescheduleExamSessionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-yellow-600">
            <CalendarClock className="h-5 w-5" />
            Reschedule Exam Session
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reschedule &quot;{sessionName}&quot;? This will reset all progress and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <div className="font-semibold mb-1">Warning: This action will reset the exam session!</div>
                <div className="mb-2">This will permanently remove:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>All candidate progress (timer data)</li>
                  <li>All submitted answers</li>
                  <li>All exam results</li>
                  <li>Session status will be reset to SCHEDULED</li>
                  <li>All candidates will be set to PENDING</li>
                </ul>
                <div className="mt-2 font-semibold">This action cannot be undone!</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-session-name">
              Type the session name &quot;{sessionName}&quot; to confirm:
            </Label>
            <Input
              id="confirm-session-name"
              value={confirmValue}
              onChange={(e) => onConfirmValueChange(e.target.value)}
              placeholder={sessionName ?? ''}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={confirmValue !== sessionName || isSubmitting}
            className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600"
          >
            {isSubmitting ? 'Rescheduling...' : 'Reschedule Session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
