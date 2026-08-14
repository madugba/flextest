export function formatLastSeen(lastLoginAt: string | null | undefined): string {
  if (!lastLoginAt) return '—'
  const minutesAgo = Math.floor((Date.now() - new Date(lastLoginAt).getTime()) / 60000)
  if (minutesAgo === 0) return 'Just now'
  if (minutesAgo === 1) return '1 min ago'
  return `${minutesAgo} mins ago`
}
