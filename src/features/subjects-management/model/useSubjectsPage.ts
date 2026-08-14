import { useCallback, useEffect, useState } from 'react'
import type { Subject } from '@/entities/subject'
import { createFetchSubjects } from './handlers/createFetchSubjects'
import { createHandleCreate } from './handlers/createHandleCreate'
import { createHandleDelete } from './handlers/createHandleDelete'
import { createHandleEdit } from './handlers/createHandleEdit'
import { createOpenDeleteDialog } from './handlers/createOpenDeleteDialog'
import { createOpenEditDialog } from './handlers/createOpenEditDialog'

export function useSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSubjects = useCallback(
    (searchQuery?: string) => createFetchSubjects(setSubjects, setLoading)(searchQuery),
    [setSubjects, setLoading]
  )

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
    subjects,
    loading,
    search,
    setSearch,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isImportDialogOpen,
    setIsImportDialogOpen,
    selectedSubject,
    subjectName,
    setSubjectName,
    isSubmitting,
    handleCreate,
    handleEdit,
    handleDelete,
    openEditDialog,
    openDeleteDialog,
  }
}
