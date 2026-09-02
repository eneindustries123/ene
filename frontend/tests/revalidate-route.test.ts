import { createHmac } from 'node:crypto';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('@/lib/sanity/client', () => ({
  BLOG_QUERY_TAG: 'sanity:blog',
}));

const TEST_SECRET = 'phase-3b-test-secret-with-at-least-32-characters';

type PostHandler = (request: NextRequest) => Promise<Response>;

let POST: PostHandler;
let revalidatePath: ReturnType<typeof vi.fn>;
let revalidateTag: ReturnType<typeof vi.fn>;

function signatureFor(body: string, secret = TEST_SECRET): string {
  const timestamp = Date.now();
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('base64url');

  return `t=${timestamp},v1=${signature}`;
}

function requestFor(body: string, signature?: string): NextRequest {
  return new Request('http://localhost:3000/api/revalidate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(signature ? { 'sanity-webhook-signature': signature } : {}),
    },
    body,
  }) as NextRequest;
}

async function sendSigned(body: string, secret = TEST_SECRET): Promise<Response> {
  return POST(requestFor(body, signatureFor(body, secret)));
}

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'kjz2jmxz';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2026-09-01';
  process.env.SANITY_REVALIDATE_SECRET = TEST_SECRET;

  ({ POST } = await import('../app/api/revalidate/route'));
  ({ revalidatePath, revalidateTag } = (await import('next/cache')) as {
    revalidatePath: ReturnType<typeof vi.fn>;
    revalidateTag: ReturnType<typeof vi.fn>;
  });
});

beforeEach(() => {
  revalidatePath.mockClear();
  revalidateTag.mockClear();
});

describe('Sanity revalidation webhook', () => {
  it('rejects a request with no body or signature', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/revalidate', { method: 'POST' }) as NextRequest
    );

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects an unsigned request', async () => {
    const response = await POST(requestFor('{}'));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects a request signed with the wrong secret', async () => {
    const body = JSON.stringify({ _type: 'blogPost', slug: 'test-post' });
    const response = await POST(requestFor(body, signatureFor(body, 'wrong-secret')));

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('rejects a signed payload without a supported type', async () => {
    const response = await sendSigned(JSON.stringify({ slug: 'test-post' }));

    expect(response.status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('handles malformed signed JSON without invalidating caches', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = await sendSigned('{');

    expect(response.status).toBe(500);
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('revalidates the shared tag, listing, current slug, and previous slug', async () => {
    const body = JSON.stringify({
      _type: 'blogPost',
      slug: 'updated-blog-post',
      previousSlug: 'original-blog-post',
    });
    const response = await sendSigned(body);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      revalidated: true,
      type: 'blogPost',
      paths: ['/blogs', '/blogs/updated-blog-post', '/blogs/original-blog-post'],
    });
    expect(revalidateTag).toHaveBeenCalledWith('sanity:blog');
    expect(revalidatePath).toHaveBeenCalledWith('/blogs', 'layout');
    expect(revalidatePath).toHaveBeenCalledWith('/blogs/updated-blog-post');
    expect(revalidatePath).toHaveBeenCalledWith('/blogs/original-blog-post');
  });

  it('supports a deleted blog payload containing only the previous slug', async () => {
    const response = await sendSigned(
      JSON.stringify({ _type: 'blogPost', previousSlug: 'deleted-blog-post' })
    );

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith('/blogs/deleted-blog-post');
  });

  it.each(['author', 'category'] as const)(
    'invalidates shared blog data for %s updates',
    async (_type) => {
      const response = await sendSigned(JSON.stringify({ _type }));

      expect(response.status).toBe(200);
      expect(revalidateTag).toHaveBeenCalledWith('sanity:blog');
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith('/blogs', 'layout');
    }
  );

  it('handles a blog event without a slug by revalidating shared blog data', async () => {
    const response = await sendSigned(JSON.stringify({ _type: 'blogPost' }));

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith('sanity:blog');
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith('/blogs', 'layout');
  });
});
