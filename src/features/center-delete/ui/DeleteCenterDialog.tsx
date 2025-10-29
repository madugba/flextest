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
import type { Center } from '@/entities/center'
import { useDeleteCenter } from '../model/useDeleteCenter'

interface DeleteCenterDialogProps {
  onSuccess?: () => void
  children: (props: { onDelete: (center: Center) => void }) => React.ReactNode
}

export function DeleteCenterDialog({ onSuccess, children }: DeleteCenterDialogProps) {
  const {
    isOpen,
    isLoading,
    error,
    currentCenter,
    handleOpen,
    handleClose,
    handleDelete,
  } = useDeleteCenter(onSuccess)

  return (
    <>
      {children({ onDelete: handleOpen })}
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Center</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{currentCenter?.centerName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && <Alert variant="destructive">{error}</Alert>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
