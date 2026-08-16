'use client'

import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Alert } from '@/shared/ui/Alert'
import { AlertCircle } from 'lucide-react'
import { useSubjectUploadPage } from '../model/useSubjectUploadPage'
import { PageHeader } from './PageHeader'
import { PageLoadingState } from './PageLoadingState'
import { UploadProgressCard } from './UploadProgressCard'
import { QuestionTabs } from './QuestionTabs'
import { PageDialogs } from './PageDialogs'

export function SubjectQuestionUploadPage() {
  const router = useRouter()
  const {
    sessionId,
    subject,
    session,
    questions,
    isLoading,
    isSaving,
    error,
    formData,
    setFormData,
    deleteDialogOpen,
    setDeleteDialogOpen,
    setQuestionToDelete,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    editDialogOpen,
    selectedIds,
    setSelectedIds,
    isBulkDeleting,
    bulkDeleteConfirmOpen,
    setBulkDeleteConfirmOpen,
    importDialogOpen,
    setImportDialogOpen,
    setImportFile,
    parsedRows,
    setParsedRows,
    isImporting,
    aiGenerateDialogOpen,
    setAiGenerateDialogOpen,
    aiModels,
    aiGenerateFormData,
    setAiGenerateFormData,
    isGenerating,
    previewDialogOpen,
    setPreviewDialogOpen,
    generatedQuestions,
    isSubmittingGenerated,
    currentQuestionCount,
    requiredQuestions,
    uploadedCount,
    remainingCount,
    progressPercentage,
    filteredQuestions,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    downloadSampleExcel,
    handleFileSelect,
    handleImport,
    handleGenerateQuestions,
    handleSubmitGenerated,
    loadData,
  } = useSubjectUploadPage()

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader />
        <PageLoadingState />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <PageHeader
          subject={subject}
          session={session}
          isLoading={isLoading}
          onBack={() => router.push(`/questions/upload/${sessionId}`)}
          onImport={() => setImportDialogOpen(true)}
          onGenerate={() => setAiGenerateDialogOpen(true)}
          onRefresh={() => void loadData()}
        />

        <UploadProgressCard
          uploadedCount={uploadedCount}
          requiredQuestions={requiredQuestions}
          remainingCount={remainingCount}
          progressPercentage={progressPercentage}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        <QuestionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          uploadedCount={uploadedCount}
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          questions={questions}
          filteredQuestions={filteredQuestions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEdit={handleEdit}
          onRequestDelete={(question) => {
            setQuestionToDelete(question)
            setDeleteDialogOpen(true)
          }}
          onRequestBulkDelete={() => setBulkDeleteConfirmOpen(true)}
        />

        <PageDialogs
          editDialogOpen={editDialogOpen}
          isSaving={isSaving}
          error={error}
          formData={formData}
          setFormData={setFormData}
          onSubmitEdit={handleSubmit}
          onCancelEdit={resetForm}
          importDialogOpen={importDialogOpen}
          setImportDialogOpen={setImportDialogOpen}
          isImporting={isImporting}
          parsedRows={parsedRows}
          setParsedRows={setParsedRows}
          setImportFile={setImportFile}
          onFileSelect={handleFileSelect}
          onDownloadSample={downloadSampleExcel}
          onImport={handleImport}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onDelete={handleDelete}
          bulkDeleteConfirmOpen={bulkDeleteConfirmOpen}
          setBulkDeleteConfirmOpen={setBulkDeleteConfirmOpen}
          selectedCount={selectedIds.size}
          isBulkDeleting={isBulkDeleting}
          onBulkDelete={handleBulkDelete}
          previewDialogOpen={previewDialogOpen}
          setPreviewDialogOpen={setPreviewDialogOpen}
          generatedQuestions={generatedQuestions}
          isSubmittingGenerated={isSubmittingGenerated}
          onSubmitGenerated={handleSubmitGenerated}
          aiGenerateDialogOpen={aiGenerateDialogOpen}
          setAiGenerateDialogOpen={setAiGenerateDialogOpen}
          currentQuestionCount={currentQuestionCount}
          subject={subject}
          aiModels={aiModels}
          aiGenerateFormData={aiGenerateFormData}
          setAiGenerateFormData={setAiGenerateFormData}
          isGenerating={isGenerating}
          onGenerate={handleGenerateQuestions}
        />
      </div>
    </div>
  )
}
