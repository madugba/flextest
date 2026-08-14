interface ErrorWithResponse {
  response?: {
    data?: {
      error?: {
        message?: string
      }
    }
  }
}

export function getApiErrorMessage(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const message = (error as ErrorWithResponse).response?.data?.error?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  return null
}
