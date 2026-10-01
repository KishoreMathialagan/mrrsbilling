import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicRoute = path === '/login';

  // Ensure static files are accessible
  if (path.startsWith('/_next') || path.startsWith('/static') || path === '/favicon.ico') {
      return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  const parsedSession = session ? await decrypt(session) : null;

  if (!isPublicRoute && !parsedSession) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicRoute && parsedSession) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (path === '/') {
    return NextResponse.redirect(new URL(parsedSession ? '/dashboard' : '/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
