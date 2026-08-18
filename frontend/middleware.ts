import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'solix_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle /project-admin alias route
  if (pathname === '/project-admin' || pathname === '/project-admin/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (pathname === '/project-admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const hasSessionCookie = Boolean(sessionCookie && sessionCookie.value && sessionCookie.value.includes('.'));

    // Login page handling
    if (pathname === '/admin/login') {
      if (hasSessionCookie) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated access attempt on protected admin route
    if (!hasSessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/project-admin/:path*'],
};
