import type { ErrorType } from '../types'

const TITLE_BY_TYPE: Record<ErrorType, string> = {
  timeout: 'Connection Timeout',
  network: 'Network Error',
  server: 'Server Error',
  unknown: 'Connection Error',
}

const DESCRIPTION_BY_TYPE: Record<ErrorType, string> = {
  timeout:
    'The server took too long to respond. This might be due to a slow connection or the server being busy.',
  network: 'Unable to reach the server. Please check your internet connection.',
  server: 'The server encountered an error while processing your request.',
  unknown: 'We encountered an issue while connecting to the backend service.',
}

export function getErrorContent(type: ErrorType): { title: string; description: string } {
  return {
    title: TITLE_BY_TYPE[type],
    description: DESCRIPTION_BY_TYPE[type],
  }
}
