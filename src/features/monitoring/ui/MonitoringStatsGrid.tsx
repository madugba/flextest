import type { SessionMonitoringStats } from '@/entities/monitoring'
import { Activity, AlertTriangle, CheckCircle, Eye, UserX, Users } from 'lucide-react'
import { StatCard } from './StatCard'
import { ElapsedTimeCard } from './ElapsedTimeCard'
import { ConnectedClientsCard } from './ConnectedClientsCard'
import { PlaceholderStatCard } from './PlaceholderStatCard'

interface MonitoringStatsGridProps {
  elapsedHms: string
  stats: SessionMonitoringStats['statistics']
  isSubscribed: boolean
  connectedClients: number
}

export function MonitoringStatsGrid({
  elapsedHms,
  stats,
  isSubscribed,
  connectedClients,
}: MonitoringStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ElapsedTimeCard elapsedHms={elapsedHms} />

      <StatCard
        title="Active Candidates"
        value={stats.active}
        icon={<Users className="h-5 w-5" />}
        borderColor="border-2 border-green-100"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        title="Scheduled"
        value={stats.scheduled}
        icon={<Eye className="h-5 w-5" />}
        iconBgColor="bg-cyan-100"
        iconColor="text-cyan-600"
      />

      <StatCard
        title="Absent"
        value={stats.absent}
        icon={<UserX className="h-5 w-5" />}
        iconBgColor="bg-gray-100"
        iconColor="text-gray-600"
      />

      <StatCard
        title="Submitted"
        value={stats.submitted}
        icon={<CheckCircle className="h-5 w-5" />}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <ConnectedClientsCard isSubscribed={isSubscribed} connectedClients={connectedClients} />

      <PlaceholderStatCard
        label="Average Progress"
        value="-"
        valueClassName="text-gray-900"
        borderColor="border-orange-100"
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        icon={<Activity className="h-5 w-5" />}
      />

      <PlaceholderStatCard
        label="Flagged"
        value="-"
        valueClassName="text-red-600"
        borderColor="border-red-100"
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
        icon={<AlertTriangle className="h-5 w-5" />}
      />
    </div>
  )
}
