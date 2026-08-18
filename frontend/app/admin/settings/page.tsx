import React from 'react';
import { Save, Globe, Shield, Bell, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-solix-border pb-6">
        <div>
          <span className="text-xs font-bold text-solix-green uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-solix-border">
            System Configuration
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-solix-dark tracking-tight mt-2">
            Global Website Settings
          </h1>
          <p className="text-xs text-solix-muted mt-1">
            Manage corporate branding, headquarters contact, API integrations, and security controls.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 bg-solix-green hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-full transition-all shadow-md shrink-0"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl shadow-solix">
        <h3 className="text-base font-bold text-solix-dark border-b border-solix-border pb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-solix-green" />
          <span>Corporate Branding & Contact</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-solix-dark">Company Legal Name</label>
            <input
              type="text"
              defaultValue="E&E Industries"
              className="w-full bg-solix-bg border border-solix-border rounded-2xl px-4 py-3 text-xs text-solix-dark font-medium placeholder:text-solix-muted/60 focus:outline-none focus:border-solix-green focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-solix-dark">Main Support Email</label>
            <input
              type="email"
              defaultValue="sales@eneindustries.com"
              className="w-full bg-solix-bg border border-solix-border rounded-2xl px-4 py-3 text-xs text-solix-dark font-medium placeholder:text-solix-muted/60 focus:outline-none focus:border-solix-green focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="text-xs font-bold text-solix-dark">Global Headquarters Address</label>
          <input
            type="text"
            defaultValue="183B Iqbal Avenue 1, Lahore, Pakistan"
            className="w-full bg-solix-bg border border-solix-border rounded-2xl px-4 py-3 text-xs text-solix-dark font-medium placeholder:text-solix-muted/60 focus:outline-none focus:border-solix-green focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
}
