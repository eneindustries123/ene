'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Package,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Customer Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Products CMS', href: '/admin/products', icon: Package },
    { name: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { name: 'Global Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logos/logo-full.png"
              alt="E&E Engineering & Energy"
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-solix-green text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-900 min-w-0">
        {children}
      </main>
    </div>
  );
}
