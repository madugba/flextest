import { Button } from '@/shared/ui/Button'

interface ExamSessionsHeaderProps {
  onImport: () => void
  onCreate: () => void
}

export function ExamSessionsHeader({ onImport, onCreate }: ExamSessionsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Exam Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Manage examination sessions and schedules
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onImport} variant="outline">
          Import Exam Sessions
        </Button>
        <Button onClick={onCreate}>
          Create Exam Session
        </Button>
      </div>
    </div>
  )
}
