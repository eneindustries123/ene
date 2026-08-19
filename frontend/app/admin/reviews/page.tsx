'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  Star,
  CheckCircle,
  EyeOff,
  XCircle,
  Trash2,
  Filter,
  RefreshCw,
  Sparkles,
  Building2,
} from 'lucide-react';
import { Review } from '@/lib/reviews-store';
import { getApiUrl } from '@/lib/api-client';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'hidden' | 'rejected' | 'featured'>('all');

  // Delete modal state
  const [deleteConfirmReview, setDeleteConfirmReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const path =
        statusFilter === 'featured'
          ? '/api/reviews?featured=true'
          : statusFilter !== 'all'
          ? `/api/reviews?status=${statusFilter}`
          : '/api/reviews';
      const res = await fetch(getApiUrl(path), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleUpdateStatus = async (id: string, newStatus: Review['status'], isFeatured?: boolean) => {
    try {
      const res = await fetch(getApiUrl(`/api/reviews/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, featured: isFeatured }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch {
      // Ignore
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteConfirmReview) return;
    setDeleting(true);

    try {
      const res = await fetch(getApiUrl(`/api/reviews/${deleteConfirmReview.id}`), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setDeleteConfirmReview(null);
        fetchReviews();
      }
    } catch {
      // Ignore
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-solix-border pb-6">
        <div>
          <span className="text-xs font-bold text-solix-green uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-solix-border">
            Feedback Moderation
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-solix-dark tracking-tight mt-2">
            Customer Reviews Management
          </h1>
          <p className="text-xs text-solix-muted mt-1">
            Moderate incoming client reviews, approve trustworthy feedback, and curate homepage featured reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-solix-bg text-solix-dark text-xs font-bold px-5 py-3 rounded-full transition-all border border-solix-border shadow-sm shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-solix-border/60">
        <Filter className="w-4 h-4 text-solix-muted shrink-0 ml-1 mr-2" />
        {(['all', 'pending', 'approved', 'hidden', 'rejected', 'featured'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-solix-dark text-white shadow-md'
                : 'bg-white text-solix-muted border border-solix-border hover:text-solix-dark'
            }`}
          >
            {tab === 'all' ? 'All Reviews' : tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white border border-solix-border rounded-3xl p-12 text-center text-solix-muted text-xs shadow-solix">
          Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-solix-border rounded-3xl p-12 text-center space-y-3 shadow-solix">
          <Star className="w-10 h-10 text-solix-muted mx-auto" />
          <h3 className="text-base font-bold text-solix-dark">No reviews found</h3>
          <p className="text-xs text-solix-muted max-w-sm mx-auto">
            No customer reviews match the selected filter category ({statusFilter}).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-solix hover:shadow-solix-lg transition-all"
            >
              {/* Top Row: Meta info & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-solix-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-solix-dark text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-solix-dark">{review.name}</span>
                      <span className="text-xs text-solix-muted font-mono">({review.email})</span>
                    </div>

                    <div className="text-xs text-solix-muted font-medium flex items-center gap-2 mt-0.5">
                      {review.role && <span>{review.role}</span>}
                      {review.role && review.company && <span>•</span>}
                      {review.company && (
                        <span className="text-solix-green font-bold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 inline" /> {review.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.featured && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 fill-current text-amber-500" />
                      <span>Featured Homepage</span>
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      review.status === 'approved'
                        ? 'bg-solix-green text-white'
                        : review.status === 'pending'
                        ? 'bg-amber-500 text-solix-dark'
                        : review.status === 'hidden'
                        ? 'bg-solix-bg text-solix-muted border border-solix-border'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              {/* Service Context & Star Rating */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="bg-solix-bg text-solix-dark px-3.5 py-1.5 rounded-full font-bold border border-solix-border">
                  <span className="text-solix-muted font-semibold">Service Scope: </span>
                  <span>{review.service}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-solix-dark ml-1">{review.rating}/5 Stars</span>
                </div>
              </div>

              {/* Review Text Quote */}
              <blockquote className="text-xs sm:text-sm text-solix-dark font-medium leading-relaxed italic bg-solix-bg/60 p-4 rounded-2xl border border-solix-border/60">
                &ldquo;{review.review}&rdquo;
              </blockquote>

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-solix-border/60">
                <span className="text-[11px] text-solix-muted font-mono">
                  Submitted: {new Date(review.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {/* Approve */}
                  {review.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'approved', review.featured)}
                      className="inline-flex items-center gap-1.5 bg-solix-green hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {/* Hide */}
                  {review.status !== 'hidden' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'hidden', false)}
                      className="inline-flex items-center gap-1.5 bg-solix-bg hover:bg-white text-solix-dark text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-solix-border"
                    >
                      <EyeOff className="w-3.5 h-3.5 text-solix-muted" />
                      <span>Hide</span>
                    </button>
                  )}

                  {/* Reject */}
                  {review.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'rejected', false)}
                      className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-rose-200"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {/* Toggle Feature */}
                  {review.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'approved', !review.featured)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                        review.featured
                          ? 'bg-amber-500 text-solix-dark hover:bg-amber-400 shadow-sm'
                          : 'bg-solix-bg text-amber-700 hover:bg-white border border-solix-border'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{review.featured ? 'Unfeature' : 'Feature on Homepage'}</span>
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmReview(review)}
                    className="p-1.5 text-solix-muted hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors ml-2"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Review Modal */}
      {deleteConfirmReview && (
        <div className="fixed inset-0 z-50 bg-solix-dark/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-solix-dark">Delete Customer Review?</h2>
              <p className="text-xs text-solix-muted">
                Are you sure you want to permanently delete feedback from <strong className="text-solix-dark">{deleteConfirmReview.name}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmReview(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-solix-muted hover:text-solix-dark"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteReview}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-colors shadow-md"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
