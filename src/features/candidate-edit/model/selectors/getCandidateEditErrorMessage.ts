import { ApiError } from '@/shared/api/client'

export function getCandidateEditErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message
  return err instanceof Error ? err.message : fallback
}
