import type { ProxyFetchOptions } from '../model/types'

/** Routes external API calls through the server-side proxy to avoid CORS. */
export async function proxyFetch(url: string, options: ProxyFetchOptions = {}): Promise<unknown> {
  const { method = 'GET', apiKey, body } = options

  const response = await fetch('/api/import/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, apiKey, method, body }),
  })

  const data = (await response.json()) as { error?: string }
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`)
  return data
}
