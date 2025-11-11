import {
  getCandidateFullName,
  getCandidateDisplayName,
  getCandidateInitials,
  getCandidateStatusColor,
  getCandidateStatusLabel,
  isCandidateActive,
  isCandidateVerified,
  getCandidateSessionName,
  getCandidateCenterName,
  formatCandidateLastLogin,
} from '@/entities/candidate/lib/helpers'
import type { Candidate } from '@/entities/candidate/model/types'

const mockCandidate: Candidate = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  seatNumber: 1,
  status: 'APPROVED',
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Candidate helper functions', () => {
  describe('getCandidateFullName', () => {
    it('should return full name', () => {
      expect(getCandidateFullName(mockCandidate)).toBe('John Doe')
    })

    it('should handle missing names', () => {
      expect(getCandidateFullName({ ...mockCandidate, firstName: '', lastName: '' })).toBe(' ')
    })
  })

  describe('getCandidateDisplayName', () => {
    it('should return full name when no surname/firstname', () => {
      expect(getCandidateDisplayName(mockCandidate)).toBe('John Doe')
    })

    it('should return surname and firstname when available', () => {
      const candidateWithSurname = {
        ...mockCandidate,
        surname: 'Smith',
        firstname: 'Jane',
        othername: 'Marie',
      }
      expect(getCandidateDisplayName(candidateWithSurname)).toBe('Smith Jane Marie')
    })

    it('should handle missing othername', () => {
      const candidateWithSurname = {
        ...mockCandidate,
        surname: 'Smith',
        firstname: 'Jane',
      }
      expect(getCandidateDisplayName(candidateWithSurname)).toBe('Smith Jane')
    })
  })

  describe('getCandidateInitials', () => {
    it('should return uppercase initials', () => {
      expect(getCandidateInitials(mockCandidate)).toBe('JD')
    })

    it('should handle missing names', () => {
      expect(getCandidateInitials({ ...mockCandidate, firstName: '', lastName: '' })).toBe('')
    })
  })

  describe('getCandidateStatusColor', () => {
    it('should return correct color for APPROVED', () => {
      expect(getCandidateStatusColor('APPROVED')).toBe('green')
    })

    it('should return correct color for REJECTED', () => {
      expect(getCandidateStatusColor('REJECTED')).toBe('red')
    })

    it('should return correct color for ACTIVE', () => {
      expect(getCandidateStatusColor('ACTIVE')).toBe('blue')
    })

    it('should return correct color for SUBMITTED', () => {
      expect(getCandidateStatusColor('SUBMITTED')).toBe('purple')
    })

    it('should return default color for PENDING', () => {
      expect(getCandidateStatusColor('PENDING')).toBe('yellow')
    })

    it('should return default color for undefined', () => {
      expect(getCandidateStatusColor(undefined)).toBe('yellow')
    })
  })

  describe('getCandidateStatusLabel', () => {
    it('should return correct label for each status', () => {
      expect(getCandidateStatusLabel('APPROVED')).toBe('Approved')
      expect(getCandidateStatusLabel('REJECTED')).toBe('Rejected')
      expect(getCandidateStatusLabel('ACTIVE')).toBe('Active')
      expect(getCandidateStatusLabel('SUBMITTED')).toBe('Submitted')
      expect(getCandidateStatusLabel('PENDING')).toBe('Pending')
      expect(getCandidateStatusLabel(undefined)).toBe('Unknown')
    })
  })

  describe('isCandidateActive', () => {
    it('should return true for active candidate', () => {
      expect(isCandidateActive(mockCandidate)).toBe(true)
    })

    it('should return false for inactive candidate', () => {
      expect(isCandidateActive({ ...mockCandidate, isActive: false })).toBe(false)
    })
  })

  describe('isCandidateVerified', () => {
    it('should return true for verified candidate', () => {
      expect(isCandidateVerified(mockCandidate)).toBe(true)
    })

    it('should return false for unverified candidate', () => {
      expect(isCandidateVerified({ ...mockCandidate, isVerified: false })).toBe(false)
    })
  })

  describe('getCandidateSessionName', () => {
    it('should return session name when available', () => {
      const candidateWithSession = {
        ...mockCandidate,
        session: { id: '1', name: 'Math Exam 2024' },
      }
      expect(getCandidateSessionName(candidateWithSession)).toBe('Math Exam 2024')
    })

    it('should return default when no session', () => {
      expect(getCandidateSessionName(mockCandidate)).toBe('Not assigned')
    })
  })

  describe('getCandidateCenterName', () => {
    it('should return center name when available', () => {
      const candidateWithCenter = {
        ...mockCandidate,
        session: {
          id: '1',
          name: 'Math Exam 2024',
          center: { id: '1', centerName: 'Main Center' },
        },
      }
      expect(getCandidateCenterName(candidateWithCenter)).toBe('Main Center')
    })

    it('should return default when no center', () => {
      expect(getCandidateCenterName(mockCandidate)).toBe('Not assigned')
    })
  })

  describe('formatCandidateLastLogin', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should return "Never" when lastLoginAt is null', () => {
      expect(formatCandidateLastLogin({ ...mockCandidate, lastLoginAt: null })).toBe('Never')
    })

    it('should return "Just now" for recent login', () => {
      const candidate = {
        ...mockCandidate,
        lastLoginAt: new Date('2024-01-15T11:59:30Z').toISOString(),
      }
      expect(formatCandidateLastLogin(candidate)).toBe('Just now')
    })

    it('should return minutes ago for login within an hour', () => {
      const candidate = {
        ...mockCandidate,
        lastLoginAt: new Date('2024-01-15T11:30:00Z').toISOString(),
      }
      expect(formatCandidateLastLogin(candidate)).toBe('30m ago')
    })

    it('should return hours ago for login within a day', () => {
      const candidate = {
        ...mockCandidate,
        lastLoginAt: new Date('2024-01-15T08:00:00Z').toISOString(),
      }
      expect(formatCandidateLastLogin(candidate)).toBe('4h ago')
    })

    it('should return days ago for login within a week', () => {
      const candidate = {
        ...mockCandidate,
        lastLoginAt: new Date('2024-01-12T12:00:00Z').toISOString(),
      }
      expect(formatCandidateLastLogin(candidate)).toBe('3d ago')
    })

    it('should return formatted date for older login', () => {
      const candidate = {
        ...mockCandidate,
        lastLoginAt: new Date('2024-01-01T12:00:00Z').toISOString(),
      }
      const result = formatCandidateLastLogin(candidate)
      // Date format varies by locale, just check it's a formatted string
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result).not.toBe('Never')
      expect(result).not.toMatch(/ago$/)
    })
  })
})

