import { Card } from '@/shared/ui/Card'
import type { SessionMonitoringStats } from '@/entities/monitoring'
import { StatCard } from './StatCard'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Laptop,
  UserX,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react'

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
      <Card className="p-4 hover:shadow-md transition-shadow border-2 border-blue-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Elapsed Time</p>
            <p className="text-2xl font-bold text-gray-900">
              {elapsedHms}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-between">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </Card>

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

      <Card className="p-4 hover:shadow-md transition-shadow border-2 border-purple-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-600">Connected Clients</p>
              {isSubscribed ? (
                <span title="Connected to WebSocket">
                  <Wifi className="h-3 w-3 text-green-500" />
                </span>
              ) : (
                <span title="Disconnected">
                  <WifiOff className="h-3 w-3 text-gray-400" />
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(0, connectedClients - 1)}
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Laptop className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow border-2 border-orange-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Average Progress</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow border-2 border-red-100">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-600">Flagged</p>
            <p className="text-2xl font-bold text-red-600">-</p>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </Card>
    </div>
  )
}
