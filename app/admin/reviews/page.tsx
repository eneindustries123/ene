'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle,
  EyeOff,
  XCircle,
  RotateCcw,
  Trash2,
  Filter,
  RefreshCw,
  Sparkles,
  Building2,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import { Review } from '@/lib/reviews-store';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'hidden' | 'rejected' | 'featured'>('all');

  // Delete modal state
  const [deleteConfirmReview, setDeleteConfirmReview] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'featured' ? '/api/admin/reviews?featured=true' : statusFilter !== 'all' ? `/api/admin/reviews?status=${statusFilter}` : '/api/admin/reviews';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: Review['status'], isFeatured?: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, featured: isFeatured }),
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
      const res = await fetch(`/api/admin/reviews/${deleteConfirmReview.id}`, {
        method: 'DELETE',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Star className="w-4 h-4 fill-current" />
            <span>Customer Feedback & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Customer Reviews Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Moderate incoming client reviews, approve trustworthy feedback, and curate homepage featured reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-slate-700 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1 mr-2" />
        {(['all', 'pending', 'approved', 'hidden', 'rejected', 'featured'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
              statusFilter === tab
                ? 'bg-solix-green text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab === 'all' ? 'All Reviews' : tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Star className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No reviews found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No customer reviews match the selected filter category ({statusFilter}).
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Top Row: Meta info & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-solix-green font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{review.name}</span>
                      <span className="text-xs text-slate-500 font-mono">({review.email})</span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                      {review.role && <span>{review.role}</span>}
                      {review.role && review.company && <span>•</span>}
                      {review.company && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 inline" /> {review.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.featured && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>Featured Homepage</span>
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      review.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : review.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : review.status === 'hidden'
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              {/* Service Context & Star Rating */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="bg-slate-900 text-slate-300 px-3.5 py-1.5 rounded-xl font-medium border border-slate-800">
                  <span className="text-slate-500 font-semibold">Service Scope: </span>
                  <span className="text-white font-bold">{review.service}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-1">{review.rating}/5</span>
                </div>
              </div>

              {/* Review Text Quote */}
              <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-900/50 p-4 rounded-2xl border border-slate-900">
                "{review.review}"
              </blockquote>

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900">
                <span className="text-[11px] text-slate-500 font-mono">
                  Submitted: {new Date(review.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {/* Approve */}
                  {review.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'approved', review.featured)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
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
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border border-slate-700"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  {/* Reject */}
                  {review.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'rejected', false)}
                      className="inline-flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border border-rose-900/50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {/* Toggle Feature (Only when approved) */}
                  {review.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(review.id, 'approved', !review.featured)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        review.featured
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          : 'bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700'
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
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-2"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Delete Customer Review?</h2>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete feedback from <strong className="text-white">{deleteConfirmReview.name}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmReview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteReview}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-lg"
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
