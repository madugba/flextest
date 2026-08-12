import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Server-side proxy for question PATCH requests.
 * Routes browser requests through the Next.js server to avoid cross-origin
 * network errors that can occur when the browser directly calls the backend.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authorization = request.headers.get('authorization')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid request body' } },
      { status: 400 }
    )
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1/api'

  try {
    const response = await fetch(`${backendUrl}/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { Authorization: authorization }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error('[/api/questions/[id] PATCH]', err)
    return NextResponse.json(
      { success: false, error: { message: 'Failed to reach backend server', code: 'NETWORK_ERROR' } },
      { status: 502 }
    )
  }
}
