import { useState } from 'react'

export function useDialogState() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  return {
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isImportDialogOpen,
    setIsImportDialogOpen,
  }
}
