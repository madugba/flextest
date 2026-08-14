export function getOverallProgress(uploaded: number, required: number): number {
  return required > 0 ? (uploaded / required) * 100 : 0
}
