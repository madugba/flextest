import type { Candidate } from '../model/types'

/**
 * Get candidate's full name
 */
export function getCandidateFullName(candidate: Candidate): string {
  return `${candidate.firstName} ${candidate.lastName}`
}

/**
 * Get candidate's display name (with fallback to exam names if available)
 */
export function getCandidateDisplayName(candidate: Candidate): string {
  if (candidate.surname && candidate.firstname) {
    return `${candidate.surname} ${candidate.firstname} ${candidate.othername || ''}`.trim()
  }
  return getCandidateFullName(candidate)
}

/**
 * Get candidate's initials
 */
export function getCandidateInitials(candidate: Candidate): string {
  const first = candidate.firstName?.[0] || ''
  const last = candidate.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase()
}

/**
 * Get candidate's status badge color
 */
export function getCandidateStatusColor(status?: Candidate['status']): string {
  switch (status) {
    case 'APPROVED':
      return 'green'
    case 'REJECTED':
      return 'red'
    case 'ACTIVE':
      return 'blue'
    case 'SUBMITTED':
      return 'purple'
    case 'PENDING':
    default:
      return 'yellow'
  }
}

/**
 * Get candidate's status label
 */
export function getCandidateStatusLabel(status?: Candidate['status']): string {
  switch (status) {
    case 'APPROVED':
      return 'Approved'
    case 'REJECTED':
      return 'Rejected'
    case 'ACTIVE':
      return 'Active'
    case 'SUBMITTED':
      return 'Submitted'
    case 'PENDING':
      return 'Pending'
    default:
      return 'Unknown'
  }
}

/**
 * Check if candidate is active
 */
export function isCandidateActive(candidate: Candidate): boolean {
  return candidate.isActive
}

/**
 * Check if candidate is verified
 */
export function isCandidateVerified(candidate: Candidate): boolean {
  return candidate.isVerified
}

/**
 * Get candidate's session name (if assigned)
 */
export function getCandidateSessionName(candidate: Candidate): string {
  return candidate.session?.name || 'Not assigned'
}

/**
 * Get candidate's center name (if assigned)
 */
export function getCandidateCenterName(candidate: Candidate): string {
  return candidate.session?.center?.centerName || 'Not assigned'
}

/**
 * Format candidate's last login date
 */
export function formatCandidateLastLogin(candidate: Candidate): string {
  if (!candidate.lastLoginAt) return 'Never'

  const date = new Date(candidate.lastLoginAt)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}
