import type { SessionStatus } from '@/entities/exam-session'

export function getStatusBadgeColor(status: SessionStatus) {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800'
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
