export type ErrorType = 'timeout' | 'network' | 'server' | 'unknown'

export type ErrorSearchParams = Record<string, string | string[] | undefined>

export interface ParsedErrorParams {
  type: ErrorType
  message: string
  details?: string
}
