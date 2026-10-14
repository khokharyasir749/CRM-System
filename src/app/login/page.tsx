"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PRECONFIGURED_USERS, UserRole } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFillDemo = (role: UserRole) => {
    const cred = PRECONFIGURED_USERS[role];
    setEmail(cred.email);
    setPassword(cred.password);
    setErrorMsg('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Validate credentials against preconfigured users
      if (
        email.toLowerCase() === PRECONFIGURED_USERS.admin.email.toLowerCase() &&
        password === PRECONFIGURED_USERS.admin.password
      ) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('crm_active_user', 'admin');
        }
        router.push('/');
        return;
      }

      if (
        email.toLowerCase() === PRECONFIGURED_USERS.staff.email.toLowerCase() &&
        password === PRECONFIGURED_USERS.staff.password
      ) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('crm_active_user', 'staff');
        }
        router.push('/');
        return;
      }

      setIsLoading(false);
      setErrorMsg('Invalid email or password. Use demo chips below for instant access.');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 antialiased font-sans">
      {/* Background Subtle Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-slate-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <Sparkles className="h-6 w-6 text-amber-300" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Regular CRM
          </h1>
          <p className="mt-1 text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Salon Suite & Customer Operations
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xl shadow-slate-900/5">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a demo role or enter your salon credentials
            </p>
          </div>

          {/* Quick Demo Credentials Strip */}
          <div className="mb-6 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Quick Demo Access:
              </span>
              <span className="text-[10px] text-slate-400">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-left hover:border-emerald-300 hover:bg-emerald-50/40 transition-all shadow-2xs group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
                  <p className="text-[10px] text-slate-400">Full Access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('staff')}
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-left hover:border-blue-300 hover:bg-blue-50/40 transition-all shadow-2xs group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                  <ShieldAlert className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 leading-tight">Ayesha Khan</p>
                  <p className="text-[10px] text-slate-400">Staff Stylist</p>
                </div>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@regularsalon.pk"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Demo: admin123 / staff123</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-300 text-slate-900 focus:ring-slate-900/20"
                />
                <span className="text-xs text-slate-600">Remember credentials</span>
              </label>

              <span className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all disabled:opacity-60"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400 space-y-1">
          <p>Regular CRM • Enterprise Salon Suite v2.4</p>
          <p className="text-[11px]">Authorized personnel only. Sessions encrypted.</p>
        </div>
      </div>
    </div>
  );
}
