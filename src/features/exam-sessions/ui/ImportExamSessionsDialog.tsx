import { Button } from '@/shared/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import type { APIConfiguration } from '@/entities/api-configuration'
import { ImportApiConfigSelect } from './ImportApiConfigSelect'
import { ImportClassSelect } from './ImportClassSelect'

interface ImportExamSessionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiConfigurations: APIConfiguration[]
  selectedConfigId: string
  onConfigIdChange: (value: string) => void
  selectedConfig: APIConfiguration | null
  selectedClass: string
  onClassChange: (value: string) => void
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: () => void
}

export function ImportExamSessionsDialog({
  open,
  onOpenChange,
  apiConfigurations,
  selectedConfigId,
  onConfigIdChange,
  selectedConfig,
  selectedClass,
  onClassChange,
  isSubmitting,
  onCancel,
  onSubmit,
}: ImportExamSessionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Exam Sessions</DialogTitle>
          <DialogDescription>Import exam sessions from an external API</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <ImportApiConfigSelect
            apiConfigurations={apiConfigurations}
            selectedConfigId={selectedConfigId}
            onConfigIdChange={onConfigIdChange}
          />

          {selectedConfig?.isSchoolPortal && (
            <ImportClassSelect selectedClass={selectedClass} onClassChange={onClassChange} />
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> API endpoint and authentication are configured in the selected
              API configuration.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Importing...' : 'Import from API'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
