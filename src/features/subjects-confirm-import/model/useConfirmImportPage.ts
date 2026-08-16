'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfirmImportSubjectsMutation } from '@/entities/subject'
import type { PendingSubject } from './types'
import { createHandleCancel } from './handlers/createHandleCancel'
import { createHandleConfirmImport } from './handlers/createHandleConfirmImport'
import { createHandleNameChange } from './handlers/createHandleNameChange'
import { createHandleRemoveSubject } from './handlers/createHandleRemoveSubject'
import { createLoadPendingImport } from './handlers/createLoadPendingImport'
import { getFilteredSubjectRows } from './selectors/getFilteredSubjectRows'
import { getValidSubjectsCount } from './selectors/getValidSubjectsCount'
import { hasEmptySubjectNames } from './selectors/hasEmptySubjectNames'

export function useConfirmImportPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<PendingSubject[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const confirmMutation = useConfirmImportSubjectsMutation()

  const loadPendingImport = useCallback(
    () => createLoadPendingImport({ router, setSubjects, setIsLoading })(),
    [router, setSubjects, setIsLoading]
  )

  useEffect(() => {
    loadPendingImport()
  }, [loadPendingImport])

  const handleNameChange = useCallback(
    (index: number, newName: string) => createHandleNameChange({ setSubjects })(index, newName),
    [setSubjects]
  )

  const handleRemoveSubject = useCallback(
    (index: number) => createHandleRemoveSubject({ setSubjects })(index),
    [setSubjects]
  )

  const handleConfirmImport = useCallback(
    () => createHandleConfirmImport({ subjects, router, confirmMutation })(),
    [subjects, router, confirmMutation]
  )

  const handleCancel = useCallback(() => createHandleCancel({ router })(), [router])

  const filteredSubjects = useMemo(
    () => getFilteredSubjectRows(subjects, searchQuery),
    [subjects, searchQuery]
  )

  const validSubjectsCount = useMemo(() => getValidSubjectsCount(subjects), [subjects])

  const hasEmptyNames = useMemo(() => hasEmptySubjectNames(subjects), [subjects])

  return {
    subjects,
    isImporting: confirmMutation.isPending,
    searchQuery,
    setSearchQuery,
    isLoading,
    filteredSubjects,
    validSubjectsCount,
    hasEmptyNames,
    handleNameChange,
    handleRemoveSubject,
    handleConfirmImport,
    handleCancel,
  }
}
