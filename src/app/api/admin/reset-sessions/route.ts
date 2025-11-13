import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Please ensure the backend service is running on port 3001' },
    { status: 503 }
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Please ensure the backend service is running on port 3001' },
    { status: 503 }
  )
}