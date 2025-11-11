// This file is deprecated - the actual API is implemented in flextest-backend
// Keep this file for fallback when backend is not available

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Please ensure the backend service is running on port 3001' },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Please ensure the backend service is running on port 3001' },
    { status: 503 }
  )
}