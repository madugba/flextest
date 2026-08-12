import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/sessions/[sessionId]/force-submit
// Body: { candidateIds: string[] }
// Calls POST /candidates/submit-exam for each candidate using the admin token,
// so that the DB reflects SUBMITTED status when the examiner ends the exam.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const authorization = request.headers.get('authorization')

  let candidateIds: string[]
  try {
    const body = (await request.json()) as { candidateIds?: unknown }
    if (!Array.isArray(body.candidateIds) || body.candidateIds.length === 0) {
      return NextResponse.json({ success: false, error: 'candidateIds array required' }, { status: 400 })
    }
    candidateIds = body.candidateIds as string[]
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authorization) headers['Authorization'] = authorization

  const results = await Promise.allSettled(
    candidateIds.map(candidateId =>
      fetch(`${backendUrl}/candidates/submit-exam`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ candidateId, sessionId }),
      }).then(async res => {
        const data = await res.json() as { success?: boolean; message?: string; error?: string }
        // 409 means already submitted — treat as success
        if (!res.ok && res.status !== 409) {
          throw new Error(data.message ?? data.error ?? `HTTP ${res.status}`)
        }
        return candidateId
      })
    )
  )

  const succeeded = results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map(r => r.value)

  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r, i) => ({ candidateId: candidateIds[i]!, error: String(r.reason) }))

  return NextResponse.json({ success: true, succeeded, failed })
}
