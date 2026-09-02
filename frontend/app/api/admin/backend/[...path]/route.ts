import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionCookieOptions,
  getBackendApiUrl,
  isSameOriginRequest,
} from '../../../../../lib/admin-auth';
import { FEATURED_PROJECTS_CACHE_TAG } from '../../../../../lib/projects-store';

const BACKEND_REQUEST_TIMEOUT_MS = 30000;

type RouteContext = {
  params: { path: string[] };
};

function isAllowedProtectedRoute(path: string[], method: string): boolean {
  const [resource, id] = path;

  if (resource === 'projects') {
    return (!id && method === 'POST') ||
      (path.length === 2 && Boolean(id) && ['PUT', 'PATCH', 'DELETE'].includes(method));
  }

  if (resource === 'reviews') {
    return (!id && method === 'GET') ||
      (path.length === 2 && Boolean(id) && ['PUT', 'PATCH', 'DELETE'].includes(method));
  }

  if (resource === 'enquiries' && path.length === 1) {
    return method === 'GET';
  }

  if ((resource === 'quotes' || resource === 'quote-requests') && path.length === 1) {
    return method === 'GET';
  }

  return resource === 'uploads' && path.length === 1 && method === 'POST';
}

async function forwardProtectedRequest(request: NextRequest, context: RouteContext) {
  const method = request.method.toUpperCase();
  const path = context.params.path;

  if (!isAllowedProtectedRoute(path, method)) {
    return NextResponse.json({ error: 'Admin API route not allowed.' }, { status: 404 });
  }

  if (method !== 'GET' && !isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  const backendPath = `/api/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: request.headers.get('accept') || 'application/json',
  });
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_REQUEST_TIMEOUT_MS);

  try {
    const body = method === 'GET' ? undefined : await request.arrayBuffer();
    const backendResponse = await fetch(getBackendApiUrl(backendPath), {
      method,
      headers,
      body,
      cache: 'no-store',
      signal: controller.signal,
    });

    const response = new NextResponse(await backendResponse.arrayBuffer(), {
      status: backendResponse.status,
      headers: {
        'Content-Type': backendResponse.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (backendResponse.status === 401) {
      response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
        ...getAdminSessionCookieOptions(),
        maxAge: 0,
        expires: new Date(0),
      });
    }

    // On-demand cache invalidation after confirmed successful project mutation
    if (
      backendResponse.ok &&
      path[0] === 'projects' &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      try {
        revalidateTag(FEATURED_PROJECTS_CACHE_TAG);
        revalidatePath('/');
      } catch (revalidateError) {
        console.warn('[admin-bff] Failed to revalidate featured projects cache:', revalidateError);
      }
    }

    return response;
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'Backend request timed out.' : 'Backend service unavailable.' },
      { status: timedOut ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return forwardProtectedRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return forwardProtectedRequest(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return forwardProtectedRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return forwardProtectedRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return forwardProtectedRequest(request, context);
}
