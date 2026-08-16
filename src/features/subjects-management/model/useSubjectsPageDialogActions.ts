'use client'

import { useCallback } from 'react'
import type { Subject } from '@/entities/subject'
import { createOpenDeleteDialog } from './handlers/createOpenDeleteDialog'
import { createOpenEditDialog } from './handlers/createOpenEditDialog'
import type { useDialogState } from './state/useDialogState'
import type { useSubjectFormState } from './state/useSubjectFormState'

export function useSubjectsPageDialogActions(
  dialogState: ReturnType<typeof useDialogState>,
  formState: ReturnType<typeof useSubjectFormState>
) {
  const { setShowEditDialog, setShowDeleteDialog } = dialogState
  const { setSelectedSubject, setSubjectName } = formState

  const openEditDialog = useCallback(
    (subject: Subject) =>
      createOpenEditDialog({ setSelectedSubject, setSubjectName, setShowEditDialog })(subject),
    [setSelectedSubject, setSubjectName, setShowEditDialog]
  )

  const openDeleteDialog = useCallback(
    (subject: Subject) =>
      createOpenDeleteDialog({ setSelectedSubject, setShowDeleteDialog })(subject),
    [setSelectedSubject, setShowDeleteDialog]
  )

  return {
    openEditDialog,
    openDeleteDialog,
  }
}
