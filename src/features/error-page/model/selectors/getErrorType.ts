import type { ErrorType } from '../types'

export function getErrorType(rawType: string | undefined): ErrorType {
  if (rawType === 'timeout' || rawType === 'network' || rawType === 'server') {
    return rawType
  }
  return 'unknown'
}
