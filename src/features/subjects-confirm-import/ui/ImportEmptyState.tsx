import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Card, CardContent } from '@/shared/ui/Card'

interface ImportEmptyStateProps {
  onBack: () => void
}

export function ImportEmptyState({ onBack }: ImportEmptyStateProps) {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No subjects to import</p>
        </CardContent>
      </Card>
    </div>
  )
}
