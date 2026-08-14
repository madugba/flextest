import type { ErrorSearchParams, ParsedErrorParams } from '../types'
import { getErrorType } from './getErrorType'
import { sanitize } from './sanitize'
import { toScalar } from './toScalar'

export function parseErrorParams(params?: ErrorSearchParams): ParsedErrorParams {
  const rawType = toScalar(params?.type)
  const rawMessage = toScalar(params?.message)
  const rawDetails = toScalar(params?.details)

  const type = getErrorType(rawType)
  const message = rawMessage ? sanitize(rawMessage, 300) : 'An unexpected error occurred'
  const details = rawDetails ? sanitize(rawDetails, 1200) : undefined

  return { type, message, details }
}
