import type { ValueKey } from '../model/types'

export async function proxyFetch(url: string, apiKey?: string): Promise<unknown> {
  const response = await fetch('/api/import/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, apiKey }),
  })
  const data = (await response.json()) as { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`)
  }
  return data
}

export const SELECT_CLS =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed'

export function extractPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((m) => m[1])
}

export function buildEndpoint(
  template: string,
  map: Record<string, ValueKey>,
  runtimeValues: Record<ValueKey, string>
): string {
  const placeholders = extractPlaceholders(template)

  if (placeholders.length === 0) {
    return `${template}/${encodeURIComponent(runtimeValues.classId)}`
  }

  let url = template
  for (const placeholder of placeholders) {
    const valueKey = map[placeholder]
    if (valueKey && runtimeValues[valueKey]) {
      url = url.replace(`{${placeholder}}`, encodeURIComponent(runtimeValues[valueKey]))
    }
  }
  return url
}

export function parseSubject(item: unknown): { subjectid?: string; subjectname: string } {
  if (typeof item === 'string') return { subjectname: item }
  if (typeof item !== 'object' || item === null) return { subjectname: String(item) }
  const obj = item as Record<string, unknown>
  if (obj.subjectid !== undefined || obj.subjectname !== undefined) {
    return {
      subjectid: typeof obj.subjectid === 'string' ? obj.subjectid : undefined,
      subjectname: typeof obj.subjectname === 'string' ? obj.subjectname : '',
    }
  }
  return {
    subjectid: typeof obj.id === 'string' ? obj.id : undefined,
    subjectname: typeof obj.name === 'string' ? obj.name : '',
  }
}
