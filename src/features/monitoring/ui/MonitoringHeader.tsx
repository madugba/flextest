import { Button } from '@/shared/ui/Button'
import { AlertTriangle, Pause, Play, RefreshCw } from 'lucide-react'

interface MonitoringHeaderProps {
  isAutoRefresh: boolean
  isControlling: boolean
  canStart: boolean
  canPause: boolean
  canResume: boolean
  canEnd: boolean
  onToggleAutoRefresh: () => void
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
}

export function MonitoringHeader({
  isAutoRefresh,
  isControlling,
  canStart,
  canPause,
  canResume,
  canEnd,
  onToggleAutoRefresh,
  onStart,
  onPause,
  onResume,
  onEnd,
}: MonitoringHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Exam Monitoring</h1>

      <div className="flex items-center gap-3">
        <Button
          variant={isAutoRefresh ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleAutoRefresh}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
          {isAutoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
        </Button>

        {canStart && (
          <Button
            size="sm"
            variant="default"
            className="gap-2"
            onClick={onStart}
            disabled={isControlling}
          >
            <Play className="h-4 w-4" />
            {isControlling ? 'Starting...' : 'Start Exam'}
          </Button>
        )}

        {canResume && (
          <Button
            size="sm"
            variant="default"
            className="gap-2"
            onClick={onResume}
            disabled={isControlling}
          >
            <Play className="h-4 w-4" />
            {isControlling ? 'Resuming...' : 'Resume Exam'}
          </Button>
        )}

        {canPause && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={onPause}
            disabled={isControlling}
          >
            <Pause className="h-4 w-4" />
            {isControlling ? 'Pausing...' : 'Pause Exam'}
          </Button>
        )}

        {canEnd && (
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={onEnd}
            disabled={isControlling}
          >
            <AlertTriangle className="h-4 w-4" />
            {isControlling ? 'Ending...' : 'End Exam'}
          </Button>
        )}
      </div>
    </div>
  )
}
