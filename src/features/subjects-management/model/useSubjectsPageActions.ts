'use client'

import { useCallback, useEffect } from 'react'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import type { useDialogState } from './state/useDialogState'
import type { useSearchState } from './state/useSearchState'
import type { useSubjectFormState } from './state/useSubjectFormState'
import type { useSubjectsListState } from './state/useSubjectsListState'

export function useSubjectsPageActions(
  listState: ReturnType<typeof useSubjectsListState>,
  searchState: ReturnType<typeof useSearchState>,
  dialogState: ReturnType<typeof useDialogState>,
  formState: ReturnType<typeof useSubjectFormState>
) {
  const { fetchSubjects } = listState
  const { search, setSearch } = searchState
  const { setShowCreateDialog, setShowEditDialog, setShowDeleteDialog } = dialogState
  const {
    selectedSubject,
    setSelectedSubject,
    subjectName,
    setSubjectName,
    setIsSubmitting,
  } = formState

  useEffect(() => {
    void fetchSubjects(search)
  }, [fetchSubjects, search])

  const handleCreate = useCallback(
    () =>
      createHandleCreate({
        subjectName,
        setSubjectName,
        setShowCreateDialog,
        setSearch,
        setIsSubmitting,
        fetchSubjects,
      })(),
    [subjectName, setSubjectName, setShowCreateDialog, setSearch, setIsSubmitting, fetchSubjects]
  )

  const handleEdit = useCallback(
    () =>
      createHandleEdit({
        selectedSubject,
        subjectName,
        search,
        setSubjectName,
        setShowEditDialog,
        setSelectedSubject,
        setIsSubmitting,
        fetchSubjects,
      })(),
    [
      selectedSubject,
      subjectName,
      search,
      setSubjectName,
      setShowEditDialog,
      setSelectedSubject,
      setIsSubmitting,
      fetchSubjects,
    ]
  )

  const handleDelete = useCallback(
    () =>
      createHandleDelete({
        selectedSubject,
        search,
        setShowDeleteDialog,
        setSelectedSubject,
        setIsSubmitting,
        fetchSubjects,
      })(),
    [
      selectedSubject,
      search,
      setShowDeleteDialog,
      setSelectedSubject,
      setIsSubmitting,
      fetchSubjects,
    ]
  )

  return {
    handleCreate,
    handleEdit,
    handleDelete,
  }
}
