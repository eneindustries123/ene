'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setErrorMessage('An unexpected network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-solix-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-solix-border rounded-3xl p-8 sm:p-10 shadow-solix-lg space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-solix-dark flex items-center justify-center mx-auto shadow-md p-3">
            <Image
              src="/logos/symbol.png"
              alt="E&E Symbol"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full border border-solix-border text-[11px] font-bold text-solix-green uppercase tracking-wider bg-solix-bg mb-2">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-2xl font-extrabold text-solix-dark tracking-tight">
              Project Management Portal
            </h1>
            <p className="text-xs text-solix-muted mt-1 leading-relaxed">
              Authenticated private access for E&E administrative staff
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" autoComplete="on">
          <div className="space-y-2">
            <label htmlFor="admin-email" className="text-xs font-bold text-solix-dark">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-solix-muted absolute left-4 top-3.5" />
              <input
                id="admin-email"
                name="username"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-solix-bg border border-solix-border rounded-2xl pl-11 pr-4 py-3 text-xs text-solix-dark placeholder:text-solix-muted/60 focus:outline-none focus:border-solix-green focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-xs font-bold text-solix-dark">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-solix-muted absolute left-4 top-3.5" />
              <input
                id="admin-password"
                name="current-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-solix-bg border border-solix-border rounded-2xl pl-11 pr-11 py-3 text-xs text-solix-dark placeholder:text-solix-muted/60 focus:outline-none focus:border-solix-green focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-solix-muted hover:text-solix-dark transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-solix-dark hover:bg-black disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
