'use client'

import type { Dispatch, SetStateAction } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/Button'
import { Loader2 } from 'lucide-react'

interface BulkDeleteConfirmDialogProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  selectedCount: number
  isBulkDeleting: boolean
  onDelete: () => Promise<void>
}

export function BulkDeleteConfirmDialog({
  open,
  onOpenChange,
  selectedCount,
  isBulkDeleting,
  onDelete,
}: BulkDeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {selectedCount} Question{selectedCount !== 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            This will permanently delete{' '}
            {selectedCount === 1 ? 'this question' : `all ${selectedCount} selected questions`}. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isBulkDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isBulkDeleting}>
            {isBulkDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                Delete {selectedCount} question{selectedCount !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
