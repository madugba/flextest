const PENDING_IMPORT_KEY = 'pending_subject_import'

export function readPendingImport(): unknown {
  const raw = sessionStorage.getItem(PENDING_IMPORT_KEY)
  if (raw === null) return null
  return JSON.parse(raw)
}

export function writePendingImport(subjects: unknown): void {
  sessionStorage.setItem(PENDING_IMPORT_KEY, JSON.stringify(subjects))
}

export function clearPendingImport(): void {
  sessionStorage.removeItem(PENDING_IMPORT_KEY)
}
