import { NextResponse } from 'next/server';
import { getApprovedFeaturedReviews } from '@/lib/reviews-store';

export async function GET() {
  const reviews = await getApprovedFeaturedReviews();
  return NextResponse.json({ reviews });
}
