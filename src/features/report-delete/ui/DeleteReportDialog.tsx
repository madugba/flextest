'use client'

import { useState } from 'react'
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
import { useReportDelete } from '../model/useReportDelete'
import { Trash2 } from 'lucide-react'
import { DeleteWarningBanner } from './DeleteWarningBanner'
import { DeleteConfirmInput } from './DeleteConfirmInput'

interface DeleteReportDialogProps {
  open: boolean
  onClose: () => void
  sessionId: string | null
  sessionName?: string
  onSuccess?: () => void
}

export function DeleteReportDialog({
  open,
  onClose,
  sessionId,
  sessionName,
  onSuccess,
}: DeleteReportDialogProps) {
  const { deleteReport, loading, error } = useReportDelete(() => {
    onSuccess?.()
    onClose()
  })

  const [confirmText, setConfirmText] = useState('')
  const isConfirmed = sessionName ? confirmText === sessionName : confirmText === 'DELETE'

  const handleDelete = async () => {
    if (!sessionId || !isConfirmed) return
    await deleteReport(sessionId)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmText('')
      onClose()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Exam Session
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <DeleteWarningBanner sessionName={sessionName} />
            <DeleteConfirmInput sessionName={sessionName} value={confirmText} onChange={setConfirmText} />

            {error && (
              <Alert variant="destructive">{error}</Alert>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmed || loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? 'Deleting...' : 'Delete Session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
