'use client'

import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/widgets/dashboard/ui/DashboardHeader'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import {
  ArrowLeft,
  Upload,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Plus,
  FileText,
} from 'lucide-react'
import { useSubjectUploadPage } from '../model/useSubjectUploadPage'
import { QuestionForm } from './QuestionForm'
import { QuestionList } from './QuestionList'
import { EditQuestionDialog } from './EditQuestionDialog'
import { ImportQuestionsDialog } from './ImportQuestionsDialog'
import { DeleteQuestionDialog } from './DeleteQuestionDialog'
import { BulkDeleteConfirmDialog } from './BulkDeleteConfirmDialog'
import { PreviewGeneratedDialog } from './PreviewGeneratedDialog'
import { AiGenerateDialog } from './AiGenerateDialog'

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
        <div className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push(`/questions/upload/${sessionId}`)}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setImportDialogOpen(true)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={() => setAiGenerateDialogOpen(true)}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button
                onClick={() => loadData(true)}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subject?.name}</h1>
            <p className="text-gray-500 mt-1">
              {session?.name} • {session && new Date(session.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Uploaded</p>
              <p className="text-3xl font-bold text-blue-600">{uploadedCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Required</p>
              <p className="text-3xl font-bold text-gray-900">{requiredQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Remaining</p>
              <p
                className={`text-3xl font-bold ${
                  remainingCount === 0 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {remainingCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900">{progressPercentage.toFixed(0)}%</p>
                {progressPercentage === 100 && <CheckCircle2 className="h-7 w-7 text-green-600" />}
              </div>
            </div>
          </div>

          <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 ${
                progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="single">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 mr-2" />
              All Questions ({uploadedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <QuestionForm
              formData={formData}
              setFormData={setFormData}
              isSaving={isSaving}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="list">
            <QuestionList
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
          </TabsContent>
        </Tabs>

        <EditQuestionDialog
          open={editDialogOpen}
          isSaving={isSaving}
          error={error}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <ImportQuestionsDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          isImporting={isImporting}
          parsedRows={parsedRows}
          setParsedRows={setParsedRows}
          setImportFile={setImportFile}
          onFileSelect={handleFileSelect}
          onDownloadSample={downloadSampleExcel}
          onImport={handleImport}
        />

        <DeleteQuestionDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          isSaving={isSaving}
          onDelete={handleDelete}
        />

        <BulkDeleteConfirmDialog
          open={bulkDeleteConfirmOpen}
          onOpenChange={setBulkDeleteConfirmOpen}
          selectedCount={selectedIds.size}
          isBulkDeleting={isBulkDeleting}
          onDelete={handleBulkDelete}
        />

        <PreviewGeneratedDialog
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
          generatedQuestions={generatedQuestions}
          isSubmittingGenerated={isSubmittingGenerated}
          onSubmit={handleSubmitGenerated}
        />

        <AiGenerateDialog
          open={aiGenerateDialogOpen}
          onOpenChange={setAiGenerateDialogOpen}
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
