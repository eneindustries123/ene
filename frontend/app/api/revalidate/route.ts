import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { BLOG_QUERY_TAG } from '@/lib/sanity/client';

type SanityWebhookBody = {
  _type?: 'blogPost' | 'author' | 'category';
  slug?: string;
  previousSlug?: string;
};

const SUPPORTED_TYPES = new Set(['blogPost', 'author', 'category']);
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    console.error('SANITY_REVALIDATE_SECRET is not configured.');
    return NextResponse.json(
      { message: 'Revalidation is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<SanityWebhookBody>(
      request,
      secret,
      true
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
    }

    if (!body?._type || !SUPPORTED_TYPES.has(body._type)) {
      return NextResponse.json({ message: 'Unsupported webhook payload.' }, { status: 400 });
    }

    revalidateTag(BLOG_QUERY_TAG);
    revalidatePath('/blogs', 'layout');

    const revalidatedPaths = new Set(['/blogs']);

    if (body._type === 'blogPost') {
      for (const slug of [body.slug, body.previousSlug]) {
        if (slug && SAFE_SLUG.test(slug)) {
          const path = `/blogs/${slug}`;
          revalidatePath(path);
          revalidatedPaths.add(path);
        }
      }
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      paths: Array.from(revalidatedPaths),
    });
  } catch (error) {
    console.error('Sanity webhook revalidation failed.', error);
    return NextResponse.json({ message: 'Revalidation failed.' }, { status: 500 });
  }
}

