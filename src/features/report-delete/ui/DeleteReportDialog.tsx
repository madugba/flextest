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
import { Input } from '@/shared/ui/Input'
import { Label } from '@/shared/ui/label'
import { Alert } from '@/shared/ui/Alert'
import { useReportDelete } from '../model/useReportDelete'
import { Trash2, AlertTriangle } from 'lucide-react'

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
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Warning: This action cannot be undone!</p>
                <p>
                  This will permanently delete the exam session
                  {sessionName && <span className="font-semibold"> &quot;{sessionName}&quot;</span>} and all associated data:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All exam questions</li>
                  <li>All candidate registrations</li>
                  <li>All candidate answers</li>
                  <li>All exam results</li>
                  <li>All session logs</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                {sessionName 
                  ? `Type the session name "${sessionName}" to confirm:` 
                  : 'Type DELETE to confirm:'}
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={sessionName || 'DELETE'}
                className="font-mono"
                autoComplete="off"
              />
            </div>

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

