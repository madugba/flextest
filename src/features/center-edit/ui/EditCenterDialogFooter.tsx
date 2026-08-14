import { Button } from '@/shared/ui/Button'

interface EditCenterDialogFooterProps {
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}

export function EditCenterDialogFooter({ isLoading, onClose, onSubmit }: EditCenterDialogFooterProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
