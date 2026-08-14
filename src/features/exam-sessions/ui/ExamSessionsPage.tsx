'use client'

import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { useExamSessionsPage } from '../model/useExamSessionsPage'
import { ExamSessionsHeader } from './ExamSessionsHeader'
import { ExamSessionsFilters } from './ExamSessionsFilters'
import { ExamSessionsTable } from './ExamSessionsTable'
import { CreateExamSessionDialog } from './CreateExamSessionDialog'
import { EditExamSessionDialog } from './EditExamSessionDialog'
import { ImportExamSessionsDialog } from './ImportExamSessionsDialog'
import { DeleteExamSessionDialog } from './DeleteExamSessionDialog'
import { RescheduleExamSessionDialog } from './RescheduleExamSessionDialog'
import { DuplicateExamSessionDialog } from './DuplicateExamSessionDialog'

export function ExamSessionsPage() {
  const router = useRouter()

  const {
    filteredSessions,
    centers,
    subjects,
    apiConfigurations,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showImportDialog,
    setShowImportDialog,
    showRescheduleDialog,
    setShowRescheduleDialog,
    showDuplicateDialog,
    setShowDuplicateDialog,
    formData,
    updateFormField,
    resetForm,
    selectedSession,
    setSelectedSession,
    isSubmitting,
    confirmSessionName,
    setConfirmSessionName,
    selectedConfigId,
    setSelectedConfigId,
    selectedConfig,
    selectedClass,
    setSelectedClass,
    loadAPIConfig,
    resetImportForm,
    duplicateName,
    setDuplicateName,
    duplicateSelectedSubjects,
    setDuplicateSelectedSubjects,
    duplicateSourceSubjects,
    isDuplicateLoading,
    openEditDialog,
    openDeleteDialog,
    openRescheduleDialog,
    openDuplicateDialog,
    toggleDuplicateSubject,
    handleCreate,
    handleEdit,
    handleDelete,
    handleImportFromApi,
    handleDuplicate,
    handleReschedule,
  } = useExamSessionsPage()

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <DashboardHeader serverStatus="healthy" lastUpdate={new Date()} connected={true} />

      <div className="p-6 max-w-7xl mx-auto space-y-6 pb-12">
        <ExamSessionsHeader
          onImport={() => setShowImportDialog(true)}
          onCreate={() => setShowCreateDialog(true)}
        />

        <ExamSessionsFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <ExamSessionsTable
          sessions={filteredSessions}
          loading={loading}
          search={search}
          onStart={(sessionId) => router.push(`/dashboard/monitoring?session=${sessionId}`)}
          onUploadQuestions={(sessionId) => router.push(`/questions/upload/${sessionId}`)}
          onReschedule={openRescheduleDialog}
          onDuplicate={(session) => { void openDuplicateDialog(session) }}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

        <CreateExamSessionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          formData={formData}
          onFieldChange={updateFormField}
          centers={centers}
          subjects={subjects}
          isSubmitting={isSubmitting}
          onCancel={() => { setShowCreateDialog(false); resetForm() }}
          onSubmit={() => { void handleCreate() }}
        />

        <EditExamSessionDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          formData={formData}
          onFieldChange={updateFormField}
          centers={centers}
          subjects={subjects}
          isSubmitting={isSubmitting}
          onCancel={() => { setShowEditDialog(false); resetForm(); setSelectedSession(null) }}
          onSubmit={() => { void handleEdit() }}
        />

        <ImportExamSessionsDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          apiConfigurations={apiConfigurations}
          selectedConfigId={selectedConfigId}
          onConfigIdChange={(value) => { setSelectedConfigId(value); loadAPIConfig(value) }}
          selectedConfig={selectedConfig}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          isSubmitting={isSubmitting}
          onCancel={() => { setShowImportDialog(false); resetImportForm() }}
          onSubmit={() => { void handleImportFromApi() }}
        />

        <DeleteExamSessionDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          sessionName={selectedSession?.name ?? null}
          isSubmitting={isSubmitting}
          onConfirm={() => { void handleDelete() }}
        />

        <RescheduleExamSessionDialog
          open={showRescheduleDialog}
          onOpenChange={setShowRescheduleDialog}
          sessionName={selectedSession?.name ?? null}
          confirmValue={confirmSessionName}
          onConfirmValueChange={setConfirmSessionName}
          isSubmitting={isSubmitting}
          onCancel={() => setConfirmSessionName('')}
          onConfirm={() => { void handleReschedule() }}
        />

        <DuplicateExamSessionDialog
          open={showDuplicateDialog}
          onOpenChange={(open) => { if (!isSubmitting) setShowDuplicateDialog(open) }}
          sessionName={selectedSession?.name ?? null}
          duplicateName={duplicateName}
          onDuplicateNameChange={setDuplicateName}
          sourceSubjects={duplicateSourceSubjects}
          selectedSubjectIds={duplicateSelectedSubjects}
          onToggleSubject={toggleDuplicateSubject}
          onSelectAll={() => setDuplicateSelectedSubjects(duplicateSourceSubjects.map((s) => s.id))}
          onDeselectAll={() => setDuplicateSelectedSubjects([])}
          isDuplicateLoading={isDuplicateLoading}
          isSubmitting={isSubmitting}
          onCancel={() => setShowDuplicateDialog(false)}
          onSubmit={() => { void handleDuplicate() }}
        />
      </div>
    </div>
  )
}
