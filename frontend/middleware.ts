import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  verifyAdminSessionToken,
} from './lib/admin-auth';

function clearInvalidSession(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function middleware(request: NextRequest) {
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
    const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminSessionToken(token) : { valid: false };

    // Login page handling
    if (pathname === '/admin/login') {
      if (session.valid) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      const response = NextResponse.next();
      return token ? clearInvalidSession(response) : response;
    }

    // Unauthenticated access attempt on protected admin route
    if (!session.valid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      return token ? clearInvalidSession(response) : response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/project-admin/:path*'],
};
