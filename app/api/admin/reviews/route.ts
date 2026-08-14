import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getAllReviews, updateReviewStatus } from '@/lib/reviews-store';
import { updateReviewSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const featuredOnly = searchParams.get('featured') === 'true';

  let reviews = await getAllReviews();

  if (statusFilter && ['pending', 'approved', 'hidden', 'rejected'].includes(statusFilter)) {
    reviews = reviews.filter((r) => r.status === statusFilter);
  }

  if (featuredOnly) {
    reviews = reviews.filter((r) => r.featured);
  }

  return NextResponse.json({ reviews });
}

export async function PUT(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateReviewSchema.parse(body);

    const updated = await updateReviewStatus(parsed.id, parsed.status, parsed.featured);
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update review status' }, { status: 500 });
  }
}
