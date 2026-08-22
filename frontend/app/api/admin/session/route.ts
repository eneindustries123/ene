import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  verifyAdminSessionToken,
} from '../../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifyAdminSessionToken(token);
  if (!session.valid) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
      ...getAdminSessionCookieOptions(),
      maxAge: 0,
      expires: new Date(0),
    });
    return response;
  }

  return NextResponse.json({ authenticated: true, email: session.email });
}
