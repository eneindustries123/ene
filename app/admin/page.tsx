import React from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Star,
  FileText,
  MessageSquare,
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
    { name: 'Published Projects', value: `${publishedProjectsCount}`, change: `${featuredProjectsCount} featured`, icon: FolderKanban, color: 'text-solix-green', href: '/admin/projects' },
    { name: 'Approved Reviews', value: `${approvedReviewsCount}`, change: `${featuredReviewsCount} featured`, icon: Star, color: 'text-amber-500', href: '/admin/reviews' },
    { name: 'Pending Moderation', value: `${pendingReviewsCount}`, change: pendingReviewsCount > 0 ? 'Requires review' : 'All clear', icon: MessageSquare, color: 'text-blue-600', href: '/admin/reviews?status=pending' },
    { name: 'System Security', value: '100%', change: 'HttpOnly Active', icon: FileText, color: 'text-emerald-700', href: '/admin' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-solix-border pb-6">
        <div>
          <span className="text-xs font-bold text-solix-green uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-solix-border">
            Executive Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-solix-dark tracking-tight mt-2">
            Control Center Dashboard
          </h1>
          <p className="text-xs text-solix-muted mt-1">Manage project deployments, client review moderation, and system settings.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 bg-solix-dark text-white text-xs font-bold px-5 py-3 rounded-full hover:bg-black transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 bg-white text-solix-dark border border-solix-border text-xs font-bold px-5 py-3 rounded-full hover:bg-solix-bg transition-colors shadow-sm"
          >
            <Star className="w-4 h-4 fill-current text-amber-500" />
            <span>Moderate Reviews</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href} className="bg-white border border-solix-border rounded-3xl p-6 space-y-4 shadow-solix hover:shadow-solix-lg transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-solix-muted group-hover:text-solix-dark transition-colors">{stat.name}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-solix-dark">{stat.value}</div>
                <div className="text-[11px] text-solix-green font-bold flex items-center gap-1 mt-1">
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
        <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-solix">
          <div className="flex items-center justify-between border-b border-solix-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-solix-green">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-solix-dark">Projects Management</h3>
                <p className="text-xs text-solix-muted">Published, draft, and archived case studies</p>
              </div>
            </div>

            <Link
              href="/admin/projects"
              className="text-xs font-bold text-solix-green hover:underline flex items-center gap-1"
            >
              <span>Open CMS</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-solix-bg rounded-2xl border border-solix-border">
              <span className="text-solix-muted font-medium">Total Projects in Portfolio:</span>
              <span className="font-mono font-extrabold text-solix-dark">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-solix-bg rounded-2xl border border-solix-border">
              <span className="text-solix-muted font-medium">Featured Projects (Homepage):</span>
              <span className="font-mono font-extrabold text-solix-green">{featuredProjectsCount}</span>
            </div>
          </div>
        </div>

        {/* Reviews Moderation Module Card */}
        <div className="bg-white border border-solix-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-solix">
          <div className="flex items-center justify-between border-b border-solix-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-solix-bg border border-solix-border flex items-center justify-center text-amber-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-solix-dark">Customer Reviews Moderation</h3>
                <p className="text-xs text-solix-muted">Client feedback, approvals, & featured quotes</p>
              </div>
            </div>

            <Link
              href="/admin/reviews"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              <span>Open Moderation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-solix-bg rounded-2xl border border-solix-border">
              <span className="text-solix-muted font-medium">Pending Reviews Needing Approval:</span>
              <span className="font-mono font-extrabold text-amber-600">{pendingReviewsCount}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-solix-bg rounded-2xl border border-solix-border">
              <span className="text-solix-muted font-medium">Approved Featured Reviews:</span>
              <span className="font-mono font-extrabold text-solix-green">{featuredReviewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
