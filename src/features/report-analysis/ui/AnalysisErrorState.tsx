import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'

interface AnalysisErrorStateProps {
  error: string
  onRetry: () => void
}

export function AnalysisErrorState({ error, onRetry }: AnalysisErrorStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">{error}</Alert>
      <Button onClick={onRetry} variant="outline">
        Retry
      </Button>
    </div>
  )
}
