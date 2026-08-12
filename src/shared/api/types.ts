export interface ApiResponse<T = unknown> {
  success: boolean
  status: number
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  meta?: {
    timestamp: string
    requestId?: string
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}
