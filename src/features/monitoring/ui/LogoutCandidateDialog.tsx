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
import { Loader2 } from 'lucide-react'

interface LogoutCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateName: string | null
  isPending: boolean
  onConfirm: () => void
}

export function LogoutCandidateDialog({
  open,
  onOpenChange,
  candidateName,
  isPending,
  onConfirm,
}: LogoutCandidateDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout Candidate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout{' '}
            <span className="font-semibold text-gray-900">
              {candidateName}
            </span>{' '}
            from the exam? This will end their current session and they will need to log in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
