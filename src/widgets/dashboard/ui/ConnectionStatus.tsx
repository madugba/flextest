'use client'

import { StatusBadge } from './StatusBadge'
import { formatLastUpdate } from '../lib/formatLastUpdate'

interface ConnectionStatusProps {
  serverStatus?: 'healthy' | 'degraded' | 'down' | 'unknown'
  lastUpdate?: Date | null
  connected?: boolean
}

export function ConnectionStatus({
  serverStatus = 'healthy',
  lastUpdate = null,
  connected = true,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center space-x-3">
      <StatusBadge status={serverStatus} showDot={true} />
      <span className="text-xs text-gray-500 hidden sm:block">
        {connected ? <>Updated {formatLastUpdate(lastUpdate)}</> : <>Reconnecting...</>}
      </span>
    </div>
  )
}
