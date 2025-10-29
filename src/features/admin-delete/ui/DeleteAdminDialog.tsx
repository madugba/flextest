'use client'

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
import { Alert } from '@/shared/ui/Alert'
import { getAdminFullName, type Admin } from '@/entities/admin'
import { useDeleteAdmin } from '../model/useDeleteAdmin'

interface DeleteAdminDialogProps {
  onSuccess?: () => void
  children: (props: { onDelete: (admin: Admin) => void }) => React.ReactNode
}

export function DeleteAdminDialog({ onSuccess, children }: DeleteAdminDialogProps) {
  const { isOpen, isLoading, error, selectedAdmin, handleOpen, handleClose, handleConfirm } =
    useDeleteAdmin(onSuccess)

  return (
    <>
      {children({ onDelete: handleOpen })}

      <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the admin account for{' '}
              <strong>{selectedAdmin && getAdminFullName(selectedAdmin)}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-2">
              {error}
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
