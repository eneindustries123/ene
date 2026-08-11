'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  MessageSquare,
  FileText,
  Users,
  Settings,
  SunMedium,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products CMS', href: '/admin/products', icon: Package },
    { name: 'Projects CMS', href: '/admin/projects', icon: FolderKanban },
    { name: 'Customer Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-solix-green flex items-center justify-center text-white">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">Solix Admin</span>
              <div className="text-[10px] text-emerald-400 font-mono uppercase">Control Center</div>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-solix-green text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-900">
        {children}
      </main>
    </div>
  );
}
