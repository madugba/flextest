'use client'

import { memo } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { ConnectionStatus } from './ConnectionStatus'
import { NotificationsBell } from './NotificationsBell'
import { UserMenu } from './UserMenu'

interface DashboardHeaderProps {
  serverStatus?: 'healthy' | 'degraded' | 'down' | 'unknown'
  lastUpdate?: Date | null
  connected?: boolean
}

export const DashboardHeader = memo(function DashboardHeader({
  serverStatus = 'healthy',
  lastUpdate = new Date(),
  connected = true,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center space-x-4">
            <ConnectionStatus serverStatus={serverStatus} lastUpdate={lastUpdate} connected={connected} />
          </div>

          <div className="flex items-center space-x-4">
            <NotificationsBell />
            <UserMenu user={user} onLogout={logout} />
          </div>
        </div>
      </div>
    </header>
  )
})
