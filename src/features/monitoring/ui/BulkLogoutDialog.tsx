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
import type { DisplayCandidate } from '../model/selectors/formatCandidateForDisplay'

interface BulkLogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCandidates: Set<string>
  candidates: DisplayCandidate[]
  isPending: boolean
  onConfirm: () => void
}

export function BulkLogoutDialog({
  open,
  onOpenChange,
  selectedCandidates,
  candidates,
  isPending,
  onConfirm,
}: BulkLogoutDialogProps) {
  const selectedCount = selectedCandidates.size
  const selectedList = candidates.filter(c => selectedCandidates.has(c.id))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Bulk Logout Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3">
              <p className="font-medium text-red-600">
                You are about to logout {selectedCount} selected candidate{selectedCount > 1 ? 's' : ''}.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action will:
                </p>
                <ul className="mt-2 ml-4 text-sm text-yellow-700 list-disc">
                  <li>End their current exam sessions</li>
                  <li>Require them to log in again to continue</li>
                  <li>May affect their exam progress if not saved</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Selected candidates:
              </p>
              <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md">
                <ul className="text-sm text-gray-700">
                  {selectedList.map(c => (
                    <li key={c.id} className="py-1">
                      • {c.name} ({c.registrationNumber})
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm font-semibold">
                Are you sure you want to proceed with this bulk logout operation?
              </p>
            </div>
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
                Processing...
              </>
            ) : (
              `Logout ${selectedCount} Candidate${selectedCount > 1 ? 's' : ''}`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
