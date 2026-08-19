'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote, Building2, CheckCircle2, Star, Plus, X } from 'lucide-react';
import { apiFetchWithTimeout, getApiUrl } from '@/lib/api-client';

interface ReviewItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  company: string;
  projectType: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: ReviewItem[] = [
  {
    id: 't-1',
    quote: 'E&E handled our commercial solar EPC project professionally from engineering design through installation and net metering commissioning. Their team delivered a structured, transparent, and high-yielding power system.',
    authorName: 'Ahmed Raza',
    authorRole: 'Project Manager',
    company: 'Logistics Complex Multan',
    projectType: '1.2MW Commercial Solar Array',
    rating: 5,
  },
  {
    id: 't-2',
    quote: 'The technical procurement and structural steel fabrication standards provided by E&E exceeded our industrial requirements. Material sourcing was on-schedule and fully compliant with project specs.',
    authorName: 'Usman Khalid',
    authorRole: 'Operations Director',
    company: 'Industrial Manufacturing Hub',
    projectType: 'Structural Fabrication & Material Supply',
    rating: 5,
  },
  {
    id: 't-3',
    quote: 'From rooftop load calculations to elevated steel shed construction and grid sync, the E&E engineering team provided responsive technical support throughout our 40KW solar transition.',
    authorName: 'Sara Ahmed',
    authorRole: 'Facilities Head',
    company: 'Retail Commercial Center',
    projectType: '40KW Elevated Solar Shed',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<ReviewItem[]>(DEFAULT_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Review submission modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    service: '',
    rating: 5,
    review: '',
    consent: true,
    honeypot: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatusMessage, setSubmitStatusMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Lock body scroll when review modal is open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSubmitModalOpen(false);
      }
    };

    if (isSubmitModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitModalOpen]);

  useEffect(() => {
    async function loadApprovedReviews() {
      try {
        const res = await apiFetchWithTimeout(getApiUrl('/api/reviews/approved'));
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.reviews || [];
          if (list.length > 0) {
            const mapped: ReviewItem[] = list.map((r: any) => ({
              id: r.id,
              quote: r.review,
              authorName: r.name,
              authorRole: r.role || 'Client Representative',
              company: r.company || 'Enterprise Client',
              projectType: r.service,
              rating: r.rating || 5,
            }));
            setTestimonials(mapped);
          }
        }
      } catch {
        // Fall back to default testimonials
      }
    }
    loadApprovedReviews();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[currentIndex] || DEFAULT_TESTIMONIALS[0];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitStatusMessage('');
    setSubmitting(true);

    try {
      const res = await apiFetchWithTimeout(getApiUrl('/api/reviews/submit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitForm),
      }, 10000);

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit review');
        setSubmitting(false);
        return;
      }

      setSubmitStatusMessage(data.message || 'Review submitted successfully!');
      setSubmitForm({
        name: '',
        email: '',
        company: '',
        role: '',
        service: '',
        rating: 5,
        review: '',
        consent: true,
        honeypot: '',
      });
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitStatusMessage('');
      }, 2500);
    } catch {
      setSubmitError('Network error while submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-x-clip">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading & Carousel Controls */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4 space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            CLIENT EXPERIENCES
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight text-balance">
            What Our Clients Say About Working With E&E.
          </h2>

          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Direct B2B client feedback on project delivery, technical execution, procurement reliability, and ongoing support across our solar, trading, and fabrication services.
          </p>

          {/* Carousel Control Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-solix-dark/30 hover:border-solix-dark flex items-center justify-center text-solix-dark hover:bg-solix-dark hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Previous Testimonial"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-solix-dark text-white flex items-center justify-center hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-md"
                aria-label="Next Testimonial"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-solix-green hover:text-emerald-700 underline"
            >
              <Plus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </motion.div>

        {/* Right Column: Credible B2B Quote Card */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix-lg space-y-6"
            >
              <div className="flex items-center justify-between border-b border-solix-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green">
                    <Quote className="w-5 h-5 rotate-180 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-solix-green uppercase tracking-wider">Project Context</span>
                    <div className="text-xs font-extrabold text-solix-dark break-words">{activeTestimonial.projectType}</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-solix-muted font-medium">
                  <CheckCircle2 className="w-4 h-4 text-solix-green" />
                  <span>Verified B2B Client</span>
                </div>
              </div>

              <blockquote className="text-base sm:text-xl text-solix-dark font-medium leading-relaxed italic">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-solix-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-base font-extrabold text-solix-dark">
                    {activeTestimonial.authorName}
                  </div>
                  <div className="text-xs text-solix-muted font-semibold">
                    {activeTestimonial.authorRole} • <span className="text-solix-dark font-bold">{activeTestimonial.company}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-solix-bg px-4 py-2 rounded-full border border-solix-border text-xs font-bold text-solix-dark">
                  <Building2 className="w-4 h-4 text-solix-green" />
                  <span>Commercial & Industrial Case Study</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* PUBLIC REVIEW SUBMISSION MODAL */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-dialog-title"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl border border-solix-border shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-solix-border flex items-center justify-between bg-solix-bg">
              <div>
                <h3 id="review-dialog-title" className="text-lg font-bold text-solix-dark">Submit Client Review</h3>
                <p className="text-xs text-solix-muted">Share your experience with E&E engineering services.</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setIsSubmitModalOpen(false)}
                aria-label="Close review form"
                className="p-2 text-solix-muted hover:text-solix-dark rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 text-xs">
              {submitError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl">
                  {submitError}
                </div>
              )}
              {submitStatusMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl">
                  {submitStatusMessage}
                </div>
              )}

              {/* Honeypot field for bot detection */}
              <input
                type="text"
                name="honeypot"
                value={submitForm.honeypot}
                onChange={(e) => setSubmitForm({ ...submitForm, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="review-name" className="font-bold text-solix-dark">Full Name *</label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    placeholder="e.g. Ahmed Raza"
                    value={submitForm.name}
                    onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-2 text-base sm:text-xs focus:outline-none focus:border-solix-green"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="review-email" className="font-bold text-solix-dark">Email Address *</label>
                  <input
                    id="review-email"
                    type="email"
                    required
                    placeholder="ahmed@company.com"
                    value={submitForm.email}
                    onChange={(e) => setSubmitForm({ ...submitForm, email: e.target.value })}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-2 text-base sm:text-xs focus:outline-none focus:border-solix-green"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="review-company" className="font-bold text-solix-dark">Company / Organization</label>
                  <input
                    id="review-company"
                    type="text"
                    placeholder="e.g. Logistics Complex"
                    value={submitForm.company}
                    onChange={(e) => setSubmitForm({ ...submitForm, company: e.target.value })}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-2 text-base sm:text-xs focus:outline-none focus:border-solix-green"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="review-role" className="font-bold text-solix-dark">Your Role</label>
                  <input
                    id="review-role"
                    type="text"
                    placeholder="e.g. Project Manager"
                    value={submitForm.role}
                    onChange={(e) => setSubmitForm({ ...submitForm, role: e.target.value })}
                    className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-2 text-base sm:text-xs focus:outline-none focus:border-solix-green"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="review-service" className="font-bold text-solix-dark">Service / Project Delivered *</label>
                <input
                  id="review-service"
                  type="text"
                  required
                  placeholder="e.g. 1.2MW Commercial Solar Array or Structural Steel Supply"
                  value={submitForm.service}
                  onChange={(e) => setSubmitForm({ ...submitForm, service: e.target.value })}
                  className="w-full bg-solix-bg border border-solix-border rounded-xl px-3 py-2 text-base sm:text-xs focus:outline-none focus:border-solix-green"
                />
              </div>

              <div className="space-y-1">
                <div id="review-rating-label" className="font-bold text-solix-dark">Rating *</div>
                <div role="group" aria-labelledby="review-rating-label" className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSubmitForm({ ...submitForm, rating: star })}
                      aria-label={`${star} star${star === 1 ? '' : 's'}`}
                      aria-pressed={star === submitForm.rating}
                      className="p-2 text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
                    >
                      <Star className={`w-5 h-5 ${star <= submitForm.rating ? 'fill-current' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="font-bold text-solix-dark ml-2">{submitForm.rating} / 5 Stars</span>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="review-feedback" className="font-bold text-solix-dark">Your Review / Feedback *</label>
                <textarea
                  id="review-feedback"
                  required
                  rows={4}
                  placeholder="Write your experience working with E&E on project delivery..."
                  value={submitForm.review}
                  onChange={(e) => setSubmitForm({ ...submitForm, review: e.target.value })}
                  className="w-full bg-solix-bg border border-solix-border rounded-xl p-3 text-base sm:text-xs focus:outline-none focus:border-solix-green leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="review-consent"
                  required
                  checked={submitForm.consent}
                  onChange={(e) => setSubmitForm({ ...submitForm, consent: e.target.checked })}
                  className="w-4 h-4 rounded text-solix-green focus:ring-emerald-500"
                />
                <label htmlFor="review-consent" className="text-solix-muted text-[11px]">
                  I consent to publishing this review on the E&E website upon administrative moderation.
                </label>
              </div>

              <div className="pt-4 border-t border-solix-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-solix-muted hover:text-solix-dark font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-solix-dark hover:bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
