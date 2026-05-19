import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(svg|png|jpg|jpeg|gif|webp|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check for InsForge session cookie
  const sessionCookie =
    request.cookies.get('insforge_refresh_token') ??
    request.cookies.get('insforge_session');

  const isAuthenticated = !!sessionCookie;

  // Admin routes — require authentication
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/shop/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth pages — redirect to shop if already authenticated
  if (
    pathname.startsWith('/shop/auth/login') ||
    pathname.startsWith('/shop/auth/register')
  ) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/shop', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
