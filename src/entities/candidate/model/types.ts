export type CandidateStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Candidate {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  profileUrl?: string
  isVerified: boolean
  isActive: boolean
  lastLoginAt?: string
  picture?: string
  surname?: string
  firstname?: string
  othername?: string
  sessionId?: string
  status?: CandidateStatus
  createdAt: string
  updatedAt: string
  session?: {
    id: string
    name: string
    center?: {
      id: string
      centerName: string
      address: string
    }
  }
}

export interface CreateCandidateRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  profileUrl?: string
}

export interface UpdateCandidateRequest {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  profileUrl?: string
  isActive?: boolean
}

export interface CandidatePaginationResponse {
  candidates: Candidate[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CandidateFilters {
  page?: number
  limit?: number
  search?: string
  status?: CandidateStatus
  sessionId?: string
}

export interface ImportCandidatesRequest {
  candidates: Array<{
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    profileUrl?: string
  }>
}
