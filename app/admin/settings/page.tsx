import React from 'react';
import { Save, Globe, Shield, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Website Settings</h1>
          <p className="text-xs text-slate-400">Manage site metadata, corporate address, API integrations, and security controls.</p>
        </div>

        <button className="flex items-center gap-2 bg-solix-green text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 max-w-3xl">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-5 h-5 text-solix-green" /> Corporate Branding & Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Company Legal Name</label>
            <input
              type="text"
              defaultValue="Solix Energy Group International Ltd."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-solix-green"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-semibold">Main Support Email</label>
            <input
              type="email"
              defaultValue="contact@solix-energy.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-solix-green"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="text-slate-400 font-semibold">Global Headquarters Address</label>
          <input
            type="text"
            defaultValue="475 Cherry Dr, Troy, Michigan 46546 United States"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-solix-green"
          />
        </div>
      </div>
    </div>
  );
}
