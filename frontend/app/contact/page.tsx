'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { submitContactForm } from '@/app/actions/contact';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    serviceRequired: '',
    monthlyBill: 'PKR 50,000 – 100,000 / month',
    solarType: 'On-Grid Net Metering',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const isSolarSelected = formData.serviceRequired === 'Solar Energy';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceRequired) {
      setStatus('error');
      setResponseMsg('Please select a service before submitting.');
      return;
    }

    setStatus('loading');
    const res = await submitContactForm({
      ...formData,
      subject: formData.subject || `Enquiry for ${formData.serviceRequired}`,
    });
    if (res.success) {
      setStatus('success');
      setResponseMsg(res.message || 'Submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        serviceRequired: '',
        monthlyBill: 'PKR 50,000 – 100,000 / month',
        solarType: 'On-Grid Net Metering',
        subject: '',
        message: '',
      });
    } else {
      setStatus('error');
      setResponseMsg('Failed to send message. Please check required fields.');
    }
  };

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
                Connect With E&amp;E
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-solix-dark tracking-tight leading-tight">
                Let&apos;s Discuss Your Next Project
              </h1>
              <p className="text-sm text-solix-muted leading-relaxed">
                Whether you are planning a solar installation, sourcing engineering materials, or developing a structural fabrication project, our team can help evaluate your requirements.
              </p>
            </div>

            <div className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-solix-border shadow-solix">
              {/* Head Office Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-solix-dark">Head Office</h4>
                  <p className="text-xs text-solix-muted leading-relaxed">
                    183B Iqbal Avenue 1, Lahore, Pakistan
                  </p>
                </div>
              </div>

              {/* Direct Phone */}
              <div className="flex items-start gap-4 pt-4 border-t border-solix-border/50">
                <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-solix-dark">Direct Phone</h4>
                  <p className="text-xs text-solix-muted">
                    <a
                      href="tel:+923063999363"
                      className="hover:text-solix-green font-semibold transition-colors"
                    >
                      +92 306 3999363
                    </a>
                  </p>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-solix-border/50">
                <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-solix-dark">Official Email</h4>
                  <div className="text-xs text-solix-muted space-y-0.5">
                    <div>
                      <a
                        href="mailto:sales@eneindustries.com"
                        className="hover:text-solix-green font-medium transition-colors"
                      >
                        sales@eneindustries.com
                      </a>
                    </div>
                    <div>
                      <a
                        href="mailto:marketing@eneindustries.com"
                        className="hover:text-solix-green font-medium transition-colors"
                      >
                        marketing@eneindustries.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-solix-border/50">
                <div className="w-10 h-10 rounded-xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-solix-dark">Office Hours</h4>
                  <p className="text-xs text-solix-muted">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form with Neutral Placeholders & Conditional Logic */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-solix-border shadow-solix">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-solix-dark">Enquiry Submitted!</h3>
                <p className="text-sm text-solix-muted max-w-md mx-auto">{responseMsg}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-solix-dark text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-black transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-solix-dark">Send Us a Direct Enquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-full-name" className="text-xs font-bold text-solix-dark">Full Name *</label>
                    <input
                      id="contact-full-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold text-solix-dark">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-bold text-solix-dark">Phone Number *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-city" className="text-xs font-bold text-solix-dark">City / Location</label>
                    <input
                      id="contact-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Lahore, Punjab"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>
                </div>

                {/* Service Required Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-service" className="text-xs font-bold text-solix-dark">Service Required *</label>
                  <select
                    id="contact-service"
                    required
                    value={formData.serviceRequired}
                    onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs font-semibold text-solix-dark focus:outline-none focus:border-solix-dark"
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Trading & Contracting">Trading &amp; Contracting</option>
                    <option value="Fabrication & Design">Fabrication &amp; Design</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                {/* CONDITIONAL FIELDS: Show only when Solar Energy is selected */}
                {isSolarSelected && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-solix-bg/70 rounded-2xl border border-solix-border/70 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-monthly-bill" className="text-xs font-bold text-solix-dark">Monthly Electricity Bill</label>
                      <select
                        id="contact-monthly-bill"
                        value={formData.monthlyBill}
                        onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-solix-border text-base sm:text-xs text-solix-dark"
                      >
                        <option value="Under PKR 25,000 / month">Under PKR 25,000 / month</option>
                        <option value="PKR 25,000 – 50,000 / month">PKR 25,000 – 50,000 / month</option>
                        <option value="PKR 50,000 – 100,000 / month">PKR 50,000 – 100,000 / month</option>
                        <option value="PKR 100,000 – 250,000 / month">PKR 100,000 – 250,000 / month</option>
                        <option value="PKR 250,000+ / month">PKR 250,000+ / month</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-solar-type" className="text-xs font-bold text-solix-dark">Solar System Type</label>
                      <select
                        id="contact-solar-type"
                        value={formData.solarType}
                        onChange={(e) => setFormData({ ...formData, solarType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-solix-border text-base sm:text-xs text-solix-dark"
                      >
                        <option value="On-Grid Net Metering">On-Grid Net Metering</option>
                        <option value="Hybrid (Battery Storage + Grid)">Hybrid (Battery Storage + Grid)</option>
                        <option value="Off-Grid Standalone System">Off-Grid Standalone System</option>
                        <option value="Agricultural Solar Tubewell">Agricultural Solar Tubewell</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-solix-dark">Project Details / Message *</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your project requirements, capacity, location, or material specifications..."
                    className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-rose-500 font-bold">{responseMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white text-xs font-bold py-4 rounded-full transition-colors disabled:opacity-50 shadow-md"
                >
                  <span>{status === 'loading' ? 'Sending Enquiry...' : 'Submit Project Enquiry'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
