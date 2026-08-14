import { Button } from '@/shared/ui/Button'
import { ArrowLeft, RefreshCw, Sparkles, Upload } from 'lucide-react'
import type { ExamSession } from '@/entities/exam-session'
import type { Subject } from '@/entities/subject'

interface PageHeaderProps {
  subject: Subject | null
  session: ExamSession | null
  isLoading: boolean
  onBack: () => void
  onImport: () => void
  onGenerate: () => void
  onRefresh: () => void
}

export function PageHeader({
  subject,
  session,
  isLoading,
  onBack,
  onImport,
  onGenerate,
  onRefresh,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onImport} variant="outline" size="sm" className="shrink-0">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={onGenerate} variant="outline" size="sm" className="shrink-0">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm" disabled={isLoading} className="shrink-0">
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
  )
}
