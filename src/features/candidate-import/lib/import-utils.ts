import type { ClassEntry, ImportValueKey, SchoolPortalStudent } from '../model/types'

export async function proxyFetch(url: string, apiKey?: string): Promise<unknown> {
  const response = await fetch('/api/import/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, apiKey }),
  })
  const data = (await response.json()) as { error?: string }
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`)
  return data
}

export function extractPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
}

export function buildEndpoint(
  template: string,
  map: Record<string, ImportValueKey>,
  values: Record<ImportValueKey, string>
): string {
  if (!extractPlaceholders(template).length) return template
  let url = template
  for (const [p, key] of Object.entries(map)) {
    if (values[key]) url = url.replace(`{${p}}`, encodeURIComponent(values[key]))
  }
  return url
}

export function smartAutoMap(
  placeholders: string[],
  contextDefault: ImportValueKey
): Record<string, ImportValueKey> {
  const map: Record<string, ImportValueKey> = {}
  for (const p of placeholders) {
    if (p.toLowerCase().includes('class')) map[p] = 'classId'
  }
  if (placeholders.length === 1 && !map[placeholders[0]]) {
    map[placeholders[0]] = contextDefault
  }
  return map
}

export function parseStudent(item: unknown): SchoolPortalStudent | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const studentid = String(
    o.userCode ?? o.user_code ?? o.studentid ?? o.studentId ?? o.student_id ?? o.id ?? ''
  ).trim()
  const surname = String(o.surname ?? o.lastName ?? o.last_name ?? '').trim()
  const firstname = String(o.firstname ?? o.firstName ?? o.first_name ?? '').trim()
  if (!surname && !firstname) return null
  const pickStr = (...candidates: unknown[]) =>
    candidates.find((v) => v != null && v !== '')?.toString().trim() || undefined

  const stream = typeof o.stream === 'object' && o.stream !== null ? (o.stream as Record<string, unknown>) : null
  const streamId = String(stream?.id ?? o.streamId ?? o.stream_id ?? '').trim() || undefined
  const streamName = String(stream?.name ?? o.streamName ?? o.stream_name ?? '').trim() || undefined
  const classId = String(o.classId ?? o.class_id ?? stream?.classId ?? '').trim() || undefined

  return {
    studentid: studentid || `${surname}_${firstname}`,
    surname,
    firstname,
    othername: pickStr(o.othername, o.otherName, o.middleName, o.other_name),
    picture: pickStr(o.picture, o.photo, o.avatar),
    streamId,
    streamName,
    classId,
  }
}

export function parseClass(item: unknown): ClassEntry | null {
  if (typeof item !== 'object' || item === null) return null
  const o = item as Record<string, unknown>
  const id = String(o.id ?? o.classid ?? '').trim()
  const name = String(o.name ?? o.classname ?? '').trim()
  if (!id || !name) return null
  return { classid: id, classname: o.level != null ? `${name} ${o.level}` : name }
}

export function extractDataArray(response: unknown): unknown[] {
  if (Array.isArray(response)) return response
  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>
    if (Array.isArray(r.data)) return r.data
    if (Array.isArray(r.students)) return r.students
    if (Array.isArray(r.items)) return r.items
    if (Array.isArray(r.results)) return r.results
  }
  return []
}
