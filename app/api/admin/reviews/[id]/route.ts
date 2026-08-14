import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getReviewById, deleteReview } from '@/lib/reviews-store';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const existing = await getReviewById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  await deleteReview(id);
  return NextResponse.json({ success: true, message: 'Review deleted successfully' });
}
