'use client'

import { useSubjectsPageActions } from './useSubjectsPageActions'
import { useSubjectsPageDialogActions } from './useSubjectsPageDialogActions'
import { useDialogState } from './state/useDialogState'
import { useSearchState } from './state/useSearchState'
import { useSubjectFormState } from './state/useSubjectFormState'
import { useSubjectsListState } from './state/useSubjectsListState'

export function useSubjectsPage() {
  const listState = useSubjectsListState()
  const searchState = useSearchState()
  const dialogState = useDialogState()
  const formState = useSubjectFormState()

  const { handleCreate, handleEdit, handleDelete } = useSubjectsPageActions(
    listState,
    searchState,
    dialogState,
    formState
  )
  const { openEditDialog, openDeleteDialog } = useSubjectsPageDialogActions(dialogState, formState)

  return {
    subjects: listState.subjects,
    loading: listState.loading,
    search: searchState.search,
    setSearch: searchState.setSearch,
    showCreateDialog: dialogState.showCreateDialog,
    setShowCreateDialog: dialogState.setShowCreateDialog,
    showEditDialog: dialogState.showEditDialog,
    setShowEditDialog: dialogState.setShowEditDialog,
    showDeleteDialog: dialogState.showDeleteDialog,
    setShowDeleteDialog: dialogState.setShowDeleteDialog,
    isImportDialogOpen: dialogState.isImportDialogOpen,
    setIsImportDialogOpen: dialogState.setIsImportDialogOpen,
    selectedSubject: formState.selectedSubject,
    subjectName: formState.subjectName,
    setSubjectName: formState.setSubjectName,
    isSubmitting: formState.isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  }
}
