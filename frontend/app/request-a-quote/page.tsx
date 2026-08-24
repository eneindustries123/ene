'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { submitQuoteRequest } from '@/app/actions/contact';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RequestQuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: 'Pakistan',
    solutionType: 'solar',
    projectType: 'commercial',
    estimatedCapacity: '1 MW - 5 MW',
    estimatedBudget: 'PKR 5M - 20M',
    timeline: '3 - 6 months',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') !== 'solar_bill_analyzer') return;

    const recommendedSystem = params.get('recommendedSystem');
    const recommendedPvKw = params.get('recommendedPvKw');
    const recommendedInverterKw = params.get('recommendedInverterKw');
    const recommendedBatteryRange = params.get('recommendedBatteryRange');
    const annualConsumptionKwh = params.get('annualConsumptionKwh');
    const averageMonthlyConsumptionKwh = params.get('averageMonthlyConsumptionKwh');
    const city = params.get('city');
    const billAnalysisConfidence = params.get('billAnalysisConfidence');
    const analyzerContext = [
      'Source: ENE Solar Bill Analyzer',
      recommendedSystem && recommendedPvKw
        ? `Preliminary recommendation: ${recommendedPvKw} kWp ${recommendedSystem}`
        : null,
      recommendedInverterKw ? `Preliminary inverter: ${recommendedInverterKw} kW` : null,
      recommendedBatteryRange ? `Preliminary battery range: ${recommendedBatteryRange}` : null,
      annualConsumptionKwh ? `Verified annual consumption: ${annualConsumptionKwh} kWh` : null,
      averageMonthlyConsumptionKwh
        ? `Verified average monthly consumption: ${averageMonthlyConsumptionKwh} kWh`
        : null,
      city ? `Installation city: ${city}` : null,
      billAnalysisConfidence
        ? `Bill analysis confidence: ${billAnalysisConfidence}`
        : null,
      'Please verify this preliminary recommendation through a site and load assessment.',
    ].filter(Boolean).join('\n');

    setFormData((current) => ({
      ...current,
      solutionType: 'solar',
      estimatedCapacity: recommendedPvKw
        ? `${recommendedPvKw} kWp preliminary recommendation`
        : current.estimatedCapacity,
      country: city ? `${city}, Pakistan` : current.country,
      message: analyzerContext,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitQuoteRequest(formData);
    setLoading(false);
    if (res.success) {
      router.push('/thank-you');
    }
  };

  return (
    <main className="min-h-screen bg-solix-bg flex flex-col justify-between">
      <Header />

      <section className="pt-36 pb-20 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-block px-4 py-1 rounded-full border border-solix-border text-solix-muted text-xs font-semibold uppercase tracking-wider bg-white">
            Engineering Estimator
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-solix-dark tracking-tight">
            Request Custom Quotation
          </h1>
          <p className="text-xs sm:text-sm text-solix-muted max-w-xl mx-auto leading-relaxed">
            Complete our multi-step engineering wizard to receive a comprehensive project estimate and technical layout proposal.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-solix-dark' : 'text-solix-muted'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-solix-dark text-white' : 'bg-solix-border text-solix-muted'}`}>1</span>
            <span>Solution Scope</span>
          </div>
          <div className="w-12 h-px bg-solix-border" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-solix-dark' : 'text-solix-muted'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-solix-dark text-white' : 'bg-solix-border text-solix-muted'}`}>2</span>
            <span>Contact Details</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-solix-border shadow-solix">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-solix-dark">Step 1: Select Solution &amp; Capacity Requirements</h3>

                <div className="space-y-3">
                  <div id="quote-solution-label" className="text-xs font-bold text-solix-dark">Technology Type *</div>
                  <div role="group" aria-labelledby="quote-solution-label" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['solar', 'wind', 'hybrid', 'maintenance'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={formData.solutionType === type}
                        onClick={() => setFormData({ ...formData, solutionType: type })}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-bold capitalize transition-all ${
                          formData.solutionType === type
                            ? 'bg-solix-dark text-white border-solix-dark shadow-md'
                            : 'bg-solix-bg text-solix-dark border-solix-border hover:border-solix-dark'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div id="quote-project-type-label" className="text-xs font-bold text-solix-dark">Project Environment *</div>
                  <div role="group" aria-labelledby="quote-project-type-label" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['commercial', 'industrial', 'residential', 'utility'].map((env) => (
                      <button
                        key={env}
                        type="button"
                        aria-pressed={formData.projectType === env}
                        onClick={() => setFormData({ ...formData, projectType: env })}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-bold capitalize transition-all ${
                          formData.projectType === env
                            ? 'bg-solix-dark text-white border-solix-dark shadow-md'
                            : 'bg-solix-bg text-solix-dark border-solix-border hover:border-solix-dark'
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="quote-capacity" className="text-xs font-bold text-solix-dark">Estimated Capacity Target</label>
                    <select
                      id="quote-capacity"
                      value={formData.estimatedCapacity}
                      onChange={(e) => setFormData({ ...formData, estimatedCapacity: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs font-semibold text-solix-dark focus:outline-none focus:border-solix-dark"
                    >
                      {!['< 500 kW', '500 kW - 1 MW', '1 MW - 5 MW', '5 MW - 20 MW', '> 20 MW Utility Scale'].includes(formData.estimatedCapacity) && (
                        <option value={formData.estimatedCapacity}>{formData.estimatedCapacity}</option>
                      )}
                      <option>&lt; 500 kW</option>
                      <option>500 kW - 1 MW</option>
                      <option>1 MW - 5 MW</option>
                      <option>5 MW - 20 MW</option>
                      <option>&gt; 20 MW Utility Scale</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="quote-timeline" className="text-xs font-bold text-solix-dark">Deployment Timeline</label>
                    <select
                      id="quote-timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs font-semibold text-solix-dark focus:outline-none focus:border-solix-dark"
                    >
                      <option>Immediate (&lt; 1 month)</option>
                      <option>1 - 3 months</option>
                      <option>3 - 6 months</option>
                      <option>6 - 12 months</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-solix-dark text-white text-xs font-bold px-6 py-3.5 rounded-full hover:bg-black transition-colors"
                  >
                    <span>Next: Contact Information</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-solix-dark">Step 2: Contact &amp; Facility Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="quote-full-name" className="text-xs font-bold text-solix-dark">Full Name *</label>
                    <input
                      id="quote-full-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="quote-email" className="text-xs font-bold text-solix-dark">Business Email *</label>
                    <input
                      id="quote-email"
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
                    <label htmlFor="quote-phone" className="text-xs font-bold text-solix-dark">Phone Number *</label>
                    <input
                      id="quote-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="quote-country" className="text-xs font-bold text-solix-dark">Country / Region *</label>
                    <input
                      id="quote-country"
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. Lahore, Pakistan"
                      className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="quote-message" className="text-xs font-bold text-solix-dark">Additional Project Scope Notes</label>
                  <textarea
                    id="quote-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify roof surface area, grid connection requirements, or existing battery backup systems..."
                    className="w-full px-4 py-3 rounded-xl bg-solix-bg border border-solix-border text-base sm:text-xs focus:outline-none focus:border-solix-dark"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 border border-solix-border text-solix-dark text-xs font-bold px-6 py-3.5 rounded-full hover:bg-solix-bg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-solix-dark hover:bg-black text-white text-xs font-bold px-8 py-3.5 rounded-full transition-colors disabled:opacity-50 shadow-md"
                  >
                    <span>{loading ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
