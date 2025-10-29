import { AlertCircle, WifiOff, Clock, ServerCrash } from 'lucide-react'

type ErrorType = 'timeout' | 'network' | 'server' | 'unknown'

interface ErrorIconProps {
  type?: ErrorType
}

const iconConfig = {
  timeout: {
    Icon: Clock,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    ringColor: 'ring-amber-100',
  },
  network: {
    Icon: WifiOff,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    ringColor: 'ring-blue-100',
  },
  server: {
    Icon: ServerCrash,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    ringColor: 'ring-red-100',
  },
  unknown: {
    Icon: AlertCircle,
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600',
    ringColor: 'ring-gray-100',
  },
}

export function ErrorIcon({ type = 'unknown' }: ErrorIconProps) {
  const config = iconConfig[type]
  const { Icon, bgColor, iconColor, ringColor } = config

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 ${bgColor} opacity-20 rounded-full blur-xl animate-pulse`}
        aria-hidden="true"
      />
      <div
        className={`relative w-20 h-20 ${bgColor} rounded-full flex items-center justify-center ring-4 ${ringColor} transition-all duration-300`}
      >
        <Icon className={`w-10 h-10 ${iconColor}`} strokeWidth={2} />
      </div>
    </div>
  )
}
