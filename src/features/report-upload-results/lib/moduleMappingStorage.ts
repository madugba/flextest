import type { SubjectModuleMapping } from '../model/types'

const STORAGE_KEY = 'flextest:score-push:subject-module-mapping'

export function loadModuleMapping(): SubjectModuleMapping {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as SubjectModuleMapping
  } catch {
    return {}
  }
}

export function saveModuleMapping(mapping: SubjectModuleMapping): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapping))
}
