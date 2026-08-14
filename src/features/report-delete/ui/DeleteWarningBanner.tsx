import { AlertTriangle } from 'lucide-react'

interface DeleteWarningBannerProps {
  sessionName?: string
}

export function DeleteWarningBanner({ sessionName }: DeleteWarningBannerProps) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-red-800">
        <p className="font-semibold mb-1">Warning: This action cannot be undone!</p>
        <p>
          This will permanently delete the exam session
          {sessionName && <span className="font-semibold"> &quot;{sessionName}&quot;</span>} and all associated data:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>All exam questions</li>
          <li>All candidate registrations</li>
          <li>All candidate answers</li>
          <li>All exam results</li>
          <li>All session logs</li>
        </ul>
      </div>
    </div>
  )
}
