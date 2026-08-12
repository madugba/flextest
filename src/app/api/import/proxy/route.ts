import { NextRequest, NextResponse } from 'next/server'

// A single hung upstream request shouldn't be able to stall a batch of
// thousands of pushes indefinitely — cap each outgoing call.
const EXTERNAL_FETCH_TIMEOUT_MS = 30_000

/** Pulls a human-readable message out of a parsed error body, whatever key the API used. */
function extractUpstreamMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const o = data as Record<string, unknown>
  const candidate = o.error ?? o.message ?? o.detail ?? o.msg
  return typeof candidate === 'string' ? candidate : undefined
}

/**
 * Server-side proxy for external API calls made during import/export flows
 * (subject/class import, score push, etc.). Browser requests to external
 * school-portal APIs are blocked by CORS; routing them through here avoids
 * that since the fetch happens server-side.
 *
 * POST body: { url: string, apiKey?: string, method?: 'GET' | 'POST', body?: unknown }
 * `method` defaults to 'GET' for backward compatibility. `body` is only
 * forwarded when `method` is 'POST'.
 */
export async function POST(request: NextRequest) {
  let url: string
  let apiKey: string | undefined
  let method: 'GET' | 'POST'
  let outgoingBody: unknown

  try {
    const parsed = (await request.json()) as {
      url?: unknown
      apiKey?: unknown
      method?: unknown
      body?: unknown
    }
    url          = typeof parsed.url    === 'string' ? parsed.url.trim()    : ''
    apiKey       = typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : undefined
    method       = parsed.method === 'POST' ? 'POST' : 'GET'
    outgoingBody = parsed.body
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  // Build the Authorization header.
  // Accept keys with or without the "Bearer " prefix already included.
  const authHeader = apiKey
    ? apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`
    : undefined

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      ...(method === 'POST' && { body: JSON.stringify(outgoingBody ?? {}) }),
      signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
    })

    const text = await response.text()

    let data: unknown
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      return NextResponse.json(
        {
          error: `External API returned non-JSON response (status ${response.status} ${response.statusText}): ${text.slice(0, 300)}`,
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      const upstreamMessage = extractUpstreamMessage(data)
      return NextResponse.json(
        {
          error: upstreamMessage
            ? `${upstreamMessage} (${response.status})`
            : `External API error: ${response.status} ${response.statusText}`,
          details: data,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return NextResponse.json(
        { error: `External API timed out after ${EXTERNAL_FETCH_TIMEOUT_MS / 1000}s` },
        { status: 504 }
      )
    }
    const cause = err instanceof Error && err.cause instanceof Error ? ` (${err.cause.message})` : ''
    return NextResponse.json(
      { error: `Failed to reach external API: ${err instanceof Error ? err.message : 'unknown error'}${cause}` },
      { status: 502 }
    )
  }
}
