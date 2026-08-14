import { Card } from '@/shared/ui/Card'
import { Laptop, Wifi, WifiOff } from 'lucide-react'

interface ConnectedClientsCardProps {
  isSubscribed: boolean
  connectedClients: number
}

export function ConnectedClientsCard({ isSubscribed, connectedClients }: ConnectedClientsCardProps) {
  return (
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
          <p className="text-2xl font-bold text-gray-900">{Math.max(0, connectedClients - 1)}</p>
        </div>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Laptop className="h-5 w-5 text-purple-600" />
        </div>
      </div>
    </Card>
  )
}
