import type { MonitoringCandidate } from '@/entities/monitoring'

export interface DisplayCandidate {
  id: string
  registrationNumber: string
  name: string
  initials: string
  clientInfo: string
  attempted: number
  totalQuestions: number
  status: string
  lastActivity: Date | null
}

export function formatCandidateForDisplay(candidate: MonitoringCandidate): DisplayCandidate {
  const registrationNumber = candidate.id
  const name = `${candidate.firstName} ${candidate.lastName}`
  const initials = `${candidate.firstName[0]}${candidate.lastName[0]}`
  const statusMap: Record<string, string> = {
    'PENDING': 'absent',
    'ACTIVE': 'active',
    'ACTIVATE': 'active',
    'SUBMITTED': 'submitted',
  }
  const displayStatus = statusMap[candidate.status] || 'absent'

  return {
    id: candidate.id,
    registrationNumber,
    name,
    initials,
    clientInfo: candidate.clientInfo,
    attempted: candidate.attempted || 0,
    totalQuestions: candidate.totalQuestions || 0,
    status: displayStatus,
    lastActivity: candidate.lastLoginAt ? new Date(candidate.lastLoginAt) : null,
  }
}
