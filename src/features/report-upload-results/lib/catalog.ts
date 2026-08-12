import type { Module, SchoolClass } from '../model/types'

function parseModule(item: unknown): Module | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '').trim()
  const name = String(o.name ?? '').trim()
  if (!id || !name) return null
  return { id, name }
}

/** Parses a modules response ({ data: [{id, name, ...}] }) into a flat list. */
export function extractModules(raw: unknown): Module[] {
  const arr = Array.isArray(raw) ? raw : (raw as { data?: unknown })?.data
  if (!Array.isArray(arr)) return []
  return arr.map(parseModule).filter((m): m is Module => m !== null)
}

function parseClass(item: unknown): SchoolClass | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? '').trim()
  const name = String(o.name ?? '').trim()
  const level = o.level
  if (!id || !name) return null
  return { id, name: level != null ? `${name} ${level}` : name }
}

/** Parses a classes response ({ data: [{id, name, level, ...}] }) into a flat list. */
export function extractClasses(raw: unknown): SchoolClass[] {
  const arr = Array.isArray(raw) ? raw : (raw as { data?: unknown })?.data
  if (!Array.isArray(arr)) return []
  return arr.map(parseClass).filter((c): c is SchoolClass => c !== null)
}

/**
 * flexdesk exposes fixed sibling endpoints under the same host as whichever
 * one the admin configured (/api/v1/cbt-scores, /api/v1/classes,
 * /api/v1/modules, /api/v1/users) — derive the others from its origin rather
 * than asking for yet another API configuration.
 */
function deriveUrl(configuredEndpoint: string, path: string): string {
  const origin = new URL(configuredEndpoint).origin
  return `${origin}${path}`
}

export function deriveModulesUrl(configuredEndpoint: string): string {
  return deriveUrl(configuredEndpoint, '/api/v1/modules')
}

export function deriveClassesUrl(configuredEndpoint: string): string {
  return deriveUrl(configuredEndpoint, '/api/v1/classes')
}

/** Modules API supports no `?classId=` filter — it must be scoped via this nested path. */
export function deriveClassModulesUrl(configuredEndpoint: string, classId: string): string {
  return deriveUrl(configuredEndpoint, `/api/v1/classes/${encodeURIComponent(classId)}/modules`)
}
