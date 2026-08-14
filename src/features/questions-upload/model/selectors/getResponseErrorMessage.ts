export function getResponseErrorMessage(err: unknown, fallback: string): string {
  const message = err instanceof Error ? err.message : undefined
  const responseMessage =
    typeof err === 'object' && err !== null && 'response' in err
      ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
  return message || responseMessage || fallback
}
