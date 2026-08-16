'use client'

import { useCallback } from 'react'
import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} from '@/entities/subject'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import type { useDialogState } from './state/useDialogState'
import type { useSearchState } from './state/useSearchState'
import type { useSubjectFormState } from './state/useSubjectFormState'

export function useSubjectsPageActions(
  searchState: ReturnType<typeof useSearchState>,
  dialogState: ReturnType<typeof useDialogState>,
  formState: ReturnType<typeof useSubjectFormState>,
  createMutation: ReturnType<typeof useCreateSubjectMutation>,
  updateMutation: ReturnType<typeof useUpdateSubjectMutation>,
  deleteMutation: ReturnType<typeof useDeleteSubjectMutation>
) {
  const { setSearch } = searchState
  const { setShowCreateDialog, setShowEditDialog, setShowDeleteDialog } = dialogState
  const { selectedSubject, setSelectedSubject, subjectName, setSubjectName } = formState

  const handleCreate = useCallback(
    () =>
      createHandleCreate({
        subjectName,
        setSubjectName,
        setShowCreateDialog,
        setSearch,
        createMutation,
      })(),
    [subjectName, setSubjectName, setShowCreateDialog, setSearch, createMutation]
  )

  const handleEdit = useCallback(
    () =>
      createHandleEdit({
        selectedSubject,
        subjectName,
        setSubjectName,
        setShowEditDialog,
        setSelectedSubject,
        updateMutation,
      })(),
    [
      selectedSubject,
      subjectName,
      setSubjectName,
      setShowEditDialog,
      setSelectedSubject,
      updateMutation,
    ]
  )

  const handleDelete = useCallback(
    () =>
      createHandleDelete({
        selectedSubject,
        setShowDeleteDialog,
        setSelectedSubject,
        deleteMutation,
      })(),
    [selectedSubject, setShowDeleteDialog, setSelectedSubject, deleteMutation]
  )

  return {
    handleCreate,
    handleEdit,
    handleDelete,
  }
}
