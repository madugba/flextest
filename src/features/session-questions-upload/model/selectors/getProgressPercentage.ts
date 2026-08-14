export function getProgressPercentage(uploaded: number, required: number): number {
  if (required === 0) return 0
  return Math.min((uploaded / required) * 100, 100)
}
