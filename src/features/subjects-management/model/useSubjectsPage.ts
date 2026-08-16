'use client'

import {
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useSubjectsQuery,
  useUpdateSubjectMutation,
} from '@/entities/subject'
import { useSubjectsPageActions } from './useSubjectsPageActions'
import { useSubjectsPageDialogActions } from './useSubjectsPageDialogActions'
import { useDialogState } from './state/useDialogState'
import { useSearchState } from './state/useSearchState'
import { useSubjectFormState } from './state/useSubjectFormState'

export function useSubjectsPage() {
  const searchState = useSearchState()
  const dialogState = useDialogState()
  const formState = useSubjectFormState()

  const subjectsQuery = useSubjectsQuery(searchState.search)
  const createMutation = useCreateSubjectMutation()
  const updateMutation = useUpdateSubjectMutation()
  const deleteMutation = useDeleteSubjectMutation()

  const subjects = subjectsQuery.data ?? []
  const loading = subjectsQuery.isLoading

  const { handleCreate, handleEdit, handleDelete } = useSubjectsPageActions(
    searchState,
    dialogState,
    formState,
    createMutation,
    updateMutation,
    deleteMutation
  )
  const { openEditDialog, openDeleteDialog } = useSubjectsPageDialogActions(dialogState, formState)

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return {
    subjects,
    loading,
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
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  }
}
