import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'fastonmed_admin_session';

function isValidSession(token?: string): boolean {
  if (!token || !token.includes('.')) return false;
  try {
    const [payloadBase64] = token.split('.');
    // Edge-safe base64 decoding
    const decoded = atob(payloadBase64);
    const parsed = JSON.parse(decoded);
    return Boolean(parsed && parsed.email && parsed.role);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
    const hasValidSession = isValidSession(sessionCookie);

    // If on the login page:
    if (pathname === '/admin/login') {
      if (hasValidSession) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // For all other /admin routes:
    if (!hasValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
