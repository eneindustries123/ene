import React from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Star,
  FileText,
  MessageSquare,
  Users,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { getAllProjects } from '@/lib/projects-store';
import { getAllReviews } from '@/lib/reviews-store';

export default async function AdminDashboardOverview() {
  const projects = await getAllProjects();
  const reviews = await getAllReviews();

  const publishedProjectsCount = projects.filter((p) => p.status === 'published' || p.status === undefined).length;
  const featuredProjectsCount = projects.filter((p) => p.isFeatured).length;

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedReviewsCount = reviews.filter((r) => r.status === 'approved').length;
  const featuredReviewsCount = reviews.filter((r) => r.featured).length;

  const stats = [
    { name: 'Published Projects', value: `${publishedProjectsCount}`, change: `${featuredProjectsCount} featured`, icon: FolderKanban, color: 'text-emerald-400', href: '/admin/projects' },
    { name: 'Approved Reviews', value: `${approvedReviewsCount}`, change: `${featuredReviewsCount} featured`, icon: Star, color: 'text-amber-400', href: '/admin/reviews' },
    { name: 'Pending Reviews Moderation', value: `${pendingReviewsCount}`, change: pendingReviewsCount > 0 ? 'Requires action' : 'All moderated', icon: MessageSquare, color: 'text-blue-400', href: '/admin/reviews?status=pending' },
    { name: 'System Security', value: '100%', change: 'HttpOnly Session Active', icon: FileText, color: 'text-purple-400', href: '/admin' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage project deployments, client review moderation, and system settings.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 bg-solix-green text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors shadow-md"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Moderate Reviews</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md hover:border-slate-700 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">{stat.name}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Projects Module Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Projects Management</h3>
                <p className="text-xs text-slate-400">Published, draft, and archived case studies</p>
              </div>
            </div>

            <Link
              href="/admin/projects"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Open CMS</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800/80">
              <span className="text-slate-300">Total Projects in Portfolio:</span>
              <span className="font-mono font-bold text-white">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800/80">
              <span className="text-slate-300">Featured Projects (Homepage):</span>
              <span className="font-mono font-bold text-emerald-400">{featuredProjectsCount}</span>
            </div>
          </div>
        </div>

        {/* Reviews Moderation Module Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Customer Reviews Moderation</h3>
                <p className="text-xs text-slate-400">Client feedback, approvals, & featured quotes</p>
              </div>
            </div>

            <Link
              href="/admin/reviews"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Open Moderation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800/80">
              <span className="text-slate-300">Pending Reviews Needing Approval:</span>
              <span className="font-mono font-bold text-amber-400">{pendingReviewsCount}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-2xl border border-slate-800/80">
              <span className="text-slate-300">Approved Featured Reviews:</span>
              <span className="font-mono font-bold text-emerald-400">{featuredReviewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
