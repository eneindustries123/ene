import { NextResponse } from 'next/server';
import { submitPublicReview } from '@/lib/reviews-store';
import { publicReviewSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = publicReviewSchema.parse(body);

    const result = await submitPublicReview(parsed);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to submit review' }, { status: 500 });
  }
}
