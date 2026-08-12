import { ApiClient, ApiError } from './client'
import { config } from '@/shared/config'

export type {
  Admin,
  CreateAdminRequest,
  UpdateAdminRequest,
  UpdatePasswordRequest,
} from '@/entities/admin/model/types'

export interface ResetPreviewCounts {
  sessions: number
  candidates: number
  questions: number
  answers: number
  results: number
  lastSession?: { name: string; date: string } | null
}

export interface ResetSessionsBody {
  confirmationPhrase: string
  includeStudents?: boolean
}

class AdminApi {
  private client: ApiClient

  constructor(baseUrl: string) {
    this.client = new ApiClient(`${baseUrl}/admins`)
  }

  async getResetSessionsPreview(): Promise<ResetPreviewCounts> {
    const res = await this.client.get<ResetPreviewCounts>('/reset-sessions/preview')
    if (!res.success || !res.data) {
      throw new ApiError(res.error?.message || 'Failed to load reset preview', res.error?.code, res.status)
    }
    return res.data
  }

  async resetAllSessions(body: ResetSessionsBody): Promise<{ message: string; deletedCounts?: unknown; timestamp?: string }> {
    const res = await this.client.post<{ message: string; deletedCounts?: unknown; timestamp?: string }>(
      '/reset-sessions',
      body
    )
    if (!res.success || !res.data) {
      throw new ApiError(res.error?.message || 'Failed to reset sessions', res.error?.code, res.status)
    }
    return res.data
  }
}

export const adminApi = new AdminApi(config.apiBaseUrl)
