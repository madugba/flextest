import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface MonitoringAlertsProps {
  error: unknown
  controlError: unknown
  isLoading: boolean
  sessionId: string | null
  selectedSession: { name?: string } | null
}

function AlertBanner({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <p className="font-medium">{title}</p>
      <p className="text-sm">{children}</p>
    </div>
  )
}

export function MonitoringAlerts({
  error,
  controlError,
  isLoading,
  sessionId,
  selectedSession,
}: MonitoringAlertsProps) {
  return (
    <>
      {error && (
        <AlertBanner title="Error loading monitoring data">
          {error instanceof Error ? error.message : 'Unknown error'}
        </AlertBanner>
      )}

      {controlError && (
        <AlertBanner title="Error controlling session">
          {controlError instanceof Error ? controlError.message : 'Unknown error'}
        </AlertBanner>
      )}

      {isLoading && !selectedSession && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && !sessionId && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p className="font-medium">No session ID provided</p>
          <p className="text-sm">
            Please provide a session ID in the URL query parameter: ?session=SESSION_ID
          </p>
        </div>
      )}

      {!isLoading && sessionId && !selectedSession && (
        <AlertBanner title="Session not found">
          The session with ID &quot;{sessionId}&quot; could not be found
        </AlertBanner>
      )}
    </>
  )
}
