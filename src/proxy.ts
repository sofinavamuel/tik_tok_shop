import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — check for authentication
  if (pathname.startsWith('/admin')) {
    // TODO: Check for valid session cookie / token
    // If no session, redirect to login:
    // const session = request.cookies.get('session');
    // if (!session) {
    //   return NextResponse.redirect(new URL('/shop/auth/login', request.url));
    // }
  }

  // Auth pages — redirect to shop if already authenticated
  if (
    pathname.startsWith('/shop/auth/login') ||
    pathname.startsWith('/shop/auth/register')
  ) {
    // TODO: If session exists, redirect to /shop
    // const session = request.cookies.get('session');
    // if (session) {
    //   return NextResponse.redirect(new URL('/shop', request.url));
    // }
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
