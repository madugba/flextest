import { Clock, Hash, Monitor, Timer } from 'lucide-react'

interface CandidateActivityPanelProps {
  lastSeenLabel: string
  seatNumber: number | null
  clientInfo: string
}

export function CandidateActivityPanel({
  lastSeenLabel,
  seatNumber,
  clientInfo,
}: CandidateActivityPanelProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <Timer className="h-3.5 w-3.5" />
        Activity
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            Last seen
          </div>
          <span className="text-sm font-medium text-gray-900">{lastSeenLabel}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="h-4 w-4 text-gray-400" />
            Seat number
          </div>
          <span className="text-sm font-medium text-gray-900">{seatNumber || '—'}</span>
        </div>
        {clientInfo && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Monitor className="h-4 w-4 text-gray-400" />
              Device
            </div>
            <span
              className="text-sm font-medium text-gray-900 text-right max-w-[180px] truncate"
              title={clientInfo}
            >
              {clientInfo}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
