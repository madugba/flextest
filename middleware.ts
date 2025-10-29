import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getClientIP, isServerIP, getCenterExists } from '@/shared/lib'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/candidate_login' ||
    pathname.startsWith('/onboarding') ||
    pathname === '/error'
  ) {
    return NextResponse.next()
  }

  const clientIP = getClientIP(request.headers)

  if (!isServerIP(clientIP)) {
    return NextResponse.redirect(new URL('/candidate_login', request.url))
  }

  const centerExists = await getCenterExists()

  if (!centerExists) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
