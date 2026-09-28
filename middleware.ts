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
        const res = NextResponse.redirect(new URL('/admin', request.url));
        res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        return res;
      }
      const res = NextResponse.next();
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    // For all other /admin routes:
    if (!hasValidSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return res;
    }

    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // Handle Arabic routes (/ar, /ar/...)
  const isArabic = pathname === '/ar' || pathname.startsWith('/ar/');
  if (isArabic) {
    let targetPath = pathname === '/ar' ? '/' : pathname.slice(3);
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', 'ar');
    requestHeaders.set('x-pathname', pathname);

    const rewriteUrl = new URL(targetPath + request.nextUrl.search, request.url);
    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  }

  // If user preferred Arabic language via cookie and visits an English public route, redirect to Arabic equivalent
  const preferredLang = request.cookies.get('preferred_language')?.value;
  if (preferredLang === 'ar' && !pathname.startsWith('/admin')) {
    const arTarget = `/ar${pathname === '/' ? '' : pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(new URL(arTarget, request.url));
  }

  // Default English route
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', 'en');
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap*.xml, robots.txt, asset files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)).*)',
  ],
};
