export function sanitize(value: string, maxLen: number): string {
  const withoutControlChars = value.replace(/[\u0000-\u001F\u007F]/g, '')
  const trimmed = withoutControlChars.trim()
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen)}…` : trimmed
}
