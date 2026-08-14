import { useState } from 'react'

export function useQuestionSelectionState() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  return {
    selectedIds,
    setSelectedIds,
    isBulkDeleting,
    setIsBulkDeleting,
    bulkDeleteConfirmOpen,
    setBulkDeleteConfirmOpen,
  }
}
