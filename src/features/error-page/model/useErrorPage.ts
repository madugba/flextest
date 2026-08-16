'use client'

import type { ErrorSearchParams } from './types'
import { getErrorContent } from './selectors/getErrorContent'
import { parseErrorParams } from './selectors/parseErrorParams'

export function useErrorPage(searchParams?: ErrorSearchParams) {
  const { type, message, details } = parseErrorParams(searchParams)
  const { title, description } = getErrorContent(type)

  return { type, title, description, message, details }
}
