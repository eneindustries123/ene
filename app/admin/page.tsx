import React from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const stats = [
    { name: 'Pending Quote Requests', value: '18', change: '+12% this week', icon: FileText, color: 'text-amber-400' },
    { name: 'New Enquiries', value: '42', change: '+24% this week', icon: MessageSquare, color: 'text-emerald-400' },
    { name: 'Active Newsletter Subscribers', value: '1,420', change: '+85 new', icon: Users, color: 'text-blue-400' },
    { name: 'Published Products', value: '3', change: 'All active', icon: Package, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400">Overview of incoming project leads, CMS updates, and system health.</p>
        </div>

        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 bg-solix-green text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <span>Review New Quotes</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{stat.name}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Recent Quote Submissions</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <div className="font-bold text-white">Vattenfall Energy Group</div>
                <div className="text-slate-400">10 MW Wind Array Scope • Denmark</div>
              </div>
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">Pending Review</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <div className="font-bold text-white">Siemens Logistics Facility</div>
                <div className="text-slate-400">2.5 MW Rooftop Solar Array • Germany</div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">Approved Quote</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Belmo.io Worker Status</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">App Server Cluster</span>
              <span className="text-emerald-400 font-mono font-bold">100% Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Background Lead Sync</span>
              <span className="text-emerald-400 font-mono font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sanity CMS Webhook</span>
              <span className="text-emerald-400 font-mono font-bold">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
