import type { PageDialogsProps } from '../model/types'
import { EditQuestionDialog } from './EditQuestionDialog'
import { ImportQuestionsDialog } from './ImportQuestionsDialog'
import { DeleteQuestionDialog } from './DeleteQuestionDialog'
import { BulkDeleteConfirmDialog } from './BulkDeleteConfirmDialog'
import { PreviewGeneratedDialog } from './PreviewGeneratedDialog'
import { AiGenerateDialog } from './AiGenerateDialog'

export function PageDialogs(props: PageDialogsProps) {
  return (
    <>
      <EditQuestionDialog
        open={props.editDialogOpen}
        isSaving={props.isSaving}
        error={props.error}
        formData={props.formData}
        setFormData={props.setFormData}
        onSubmit={props.onSubmitEdit}
        onCancel={props.onCancelEdit}
      />

      <ImportQuestionsDialog
        open={props.importDialogOpen}
        onOpenChange={props.setImportDialogOpen}
        isImporting={props.isImporting}
        parsedRows={props.parsedRows}
        setParsedRows={props.setParsedRows}
        setImportFile={props.setImportFile}
        onFileSelect={props.onFileSelect}
        onDownloadSample={props.onDownloadSample}
        onImport={props.onImport}
      />

      <DeleteQuestionDialog
        open={props.deleteDialogOpen}
        onOpenChange={props.setDeleteDialogOpen}
        isSaving={props.isSaving}
        onDelete={props.onDelete}
      />

      <BulkDeleteConfirmDialog
        open={props.bulkDeleteConfirmOpen}
        onOpenChange={props.setBulkDeleteConfirmOpen}
        selectedCount={props.selectedCount}
        isBulkDeleting={props.isBulkDeleting}
        onDelete={props.onBulkDelete}
      />

      <PreviewGeneratedDialog
        open={props.previewDialogOpen}
        onOpenChange={props.setPreviewDialogOpen}
        generatedQuestions={props.generatedQuestions}
        isSubmittingGenerated={props.isSubmittingGenerated}
        onSubmit={props.onSubmitGenerated}
      />

      <AiGenerateDialog
        open={props.aiGenerateDialogOpen}
        onOpenChange={props.setAiGenerateDialogOpen}
        currentQuestionCount={props.currentQuestionCount}
        subject={props.subject}
        aiModels={props.aiModels}
        aiGenerateFormData={props.aiGenerateFormData}
        setAiGenerateFormData={props.setAiGenerateFormData}
        isGenerating={props.isGenerating}
        onGenerate={props.onGenerate}
      />
    </>
  )
}
