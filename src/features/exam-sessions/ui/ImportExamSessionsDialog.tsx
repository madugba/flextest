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
          <DialogDescription>
            Import exam sessions from an external API
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              API Configuration <span className="text-red-500">*</span>
            </label>
            <select
              aria-label="Select an API configuration"
              value={selectedConfigId}
              onChange={(e) => onConfigIdChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a saved configuration...</option>
              {apiConfigurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name}
                  {config.isSchoolPortal && ' (School Portal)'}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Configure API endpoints in{' '}
              <a href="/dashboard/settings" className="underline font-semibold">
                Settings
              </a>
            </p>
          </div>

          {selectedConfig?.isSchoolPortal && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                aria-label="Select a class"
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a class...</option>
                {/* Classes will be populated from API later */}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select the class for school portal import
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> API endpoint and authentication are configured in the selected API configuration.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
