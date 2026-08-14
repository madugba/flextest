import { Button } from '@/shared/ui/Button'
import { DialogFooter } from '@/shared/ui/dialog'

export function ImportDialogFooter({
  isLoading,
  onCancel,
  onImport,
  importTab,
}: {
  isLoading: boolean
  onCancel: () => void
  onImport: () => void
  importTab: string
}) {
  return (
    <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button onClick={onImport} disabled={isLoading}>
          {isLoading ? 'Importing…' : `Import from ${importTab === 'json' ? 'JSON' : importTab === 'api' ? 'API' : 'Excel'}`}
        </Button>
      </DialogFooter>
    </div>
  )
}
