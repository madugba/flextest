import { Button } from '@/shared/ui/Button'

interface FormActionsProps {
  isLoading: boolean
  onCancel?: () => void
  onSubmit: () => void
}

export function FormActions({ isLoading, onCancel, onSubmit }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register Candidate'}
      </Button>
    </div>
  )
}
