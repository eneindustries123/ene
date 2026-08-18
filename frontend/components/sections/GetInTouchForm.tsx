'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitContactForm } from '@/app/actions/contact';
import { Send, CheckCircle2, ArrowUpRight } from 'lucide-react';

export function GetInTouchForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: 'Solar Energy',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    setStatus('loading');
    const res = await submitContactForm({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: `Homepage Lead (${formData.serviceType})`,
      subject: `Homepage Lead for ${formData.serviceType}`,
      message: `Service Type: ${formData.serviceType}\nMessage: ${formData.message}`,
    });

    if (res.success) {
      setStatus('success');
      setResponseMsg(res.message || 'Your project inquiry has been received! Our engineering team will contact you shortly.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        serviceType: 'Solar Energy',
        message: '',
      });
    } else {
      setStatus('error');
      setResponseMsg('Failed to send message. Please check required fields.');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-solix-border shadow-solix-lg max-w-4xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-solix-green">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-solix-dark tracking-tight">
            Discuss Your Energy & Infrastructure Requirements.
          </h2>
          <p className="text-xs sm:text-sm text-solix-muted leading-relaxed">
            Planning a solar installation, technical procurement, or structural fabrication project? Send us your key details and our technical team will reach out.
          </p>
        </div>

        {/* Short Lead Form Container */}
        {status === 'success' ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-solix-dark">Inquiry Submitted!</h3>
            <p className="text-xs sm:text-sm text-solix-muted max-w-md mx-auto">{responseMsg}</p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-solix-dark text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-black transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-solix-dark">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-xs focus:outline-none focus:border-solix-dark"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-solix-dark">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-xs focus:outline-none focus:border-solix-dark"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-solix-dark">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 0000000"
                  className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-xs focus:outline-none focus:border-solix-dark"
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-solix-dark">Service Required *</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-xs font-semibold text-solix-dark focus:outline-none focus:border-solix-dark"
              >
                <option value="Solar Energy">Solar Energy (Residential / Commercial / Industrial)</option>
                <option value="Trading & Contracting">Trading & Contracting (Procurement & Supply)</option>
                <option value="Fabrication & Design">Fabrication & Design (Steel & PEB Structures)</option>
                <option value="General Enquiry">General Engineering Enquiry</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-solix-dark">Project Details / Scope</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe system capacity, site location, or material specifications..."
                className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-xs focus:outline-none focus:border-solix-dark"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-500 font-bold">{responseMsg}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-solix-border/50">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white text-xs font-bold px-8 py-3.5 rounded-full transition-colors disabled:opacity-50 shadow-md"
              >
                <span>{status === 'loading' ? 'Submitting...' : 'Submit Project Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>

              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 text-xs font-bold text-solix-dark hover:text-solix-green transition-colors"
              >
                <span>Need a Detailed System Quote? Continue to Quote Calculator</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
