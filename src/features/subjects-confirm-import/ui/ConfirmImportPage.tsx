'use client'

import { useConfirmImportPage } from '../model/useConfirmImportPage'
import { ConfirmImportCard } from './ConfirmImportCard'
import { ImportEmptyState } from './ImportEmptyState'
import { ImportLoadingState } from './ImportLoadingState'

export function ConfirmImportPage() {
  const {
    subjects,
    isImporting,
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
  } = useConfirmImportPage()

  if (isLoading) {
    return <ImportLoadingState />
  }

  if (subjects.length === 0) {
    return <ImportEmptyState onBack={handleCancel} />
  }

  return (
    <ConfirmImportCard
      subjects={subjects}
      validSubjectsCount={validSubjectsCount}
      hasEmptyNames={hasEmptyNames}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      filteredSubjects={filteredSubjects}
      isImporting={isImporting}
      onNameChange={handleNameChange}
      onRemove={handleRemoveSubject}
      onConfirm={handleConfirmImport}
      onCancel={handleCancel}
    />
  )
}
