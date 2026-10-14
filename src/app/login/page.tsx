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
  TrendingUp,
  Clock,
  Users,
  Shield,
  Star,
  Check,
} from 'lucide-react';
import { PRECONFIGURED_USERS, UserRole } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@regularsalon.pk');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('admin');
  const [feedbackNotice, setFeedbackNotice] = useState<string>('Demo credentials loaded: Administrator');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDemoRole = (role: UserRole) => {
    setSelectedDemoRole(role);
    const cred = PRECONFIGURED_USERS[role];
    setEmail(cred.email);
    setPassword(cred.password);
    setErrorMsg('');
    setFeedbackNotice(`Autofilled: ${cred.name} (${cred.roleTitle})`);
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
      setErrorMsg('Invalid email or password. Select an interactive demo role above for instant login.');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] grid grid-cols-1 lg:grid-cols-2 antialiased font-sans">
      {/* =========================================
          LEFT SIDE: LUXURY BRANDING & SHOWCASE
         ========================================= */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] text-white border-r border-slate-800">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        {/* Ambient Salon Watermark Graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        {/* Top Header: Brand Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 backdrop-blur-md shadow-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Regular CRM</span>
            <span className="h-3 w-px bg-slate-700" />
            <span className="text-[11px] font-semibold text-amber-300 tracking-wider uppercase">
              Luxury Salon Suite
            </span>
          </div>
        </div>

        {/* Center: Value Proposition & Social Proof Metrics */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto">
          <div className="space-y-3">
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              Next-Generation Salon Operations
            </p>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Elevate every client journey with precision and poise.
            </h1>
            <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal">
              Empowering premium salons with seamless appointment scheduling, financial tracking, and elevated client care.
            </p>
          </div>

          {/* Social Proof Metric Overlay Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Reliability</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">99.4%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">On-time Appointments</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Revenue</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">PKR 480K+</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Managed Monthly</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                <Shield className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Access</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">10 Staff</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Limit Protected</p>
            </div>
          </div>

          {/* Testimonial Quote Glass Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4.5 backdrop-blur-md flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Salon Director"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-400/30 shrink-0"
            />
            <div className="text-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-200 font-medium italic">
                &ldquo;Regular CRM transformed our salon chair efficiency and VIP client retention within 30 days.&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                Farah Qureshi • Creative Director, Regular Lahore
              </p>
            </div>
          </div>
        </div>

        {/* Left Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          <span>Enterprise Salon Edition • v2.4</span>
          <span>© 2026 Regular Salon Suite</span>
        </div>
      </div>

      {/* =========================================
          RIGHT SIDE: CRISP, HIGH-END LOGIN FORM
         ========================================= */}
      <div className="flex flex-col justify-between bg-white px-6 sm:px-12 xl:px-18 py-10 sm:py-12 min-h-screen">
        {/* Mobile Header Brand (Visible on mobile screens) */}
        <div className="lg:hidden flex items-center gap-2.5 pb-6 border-b border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regular CRM</h2>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Luxury Salon Suite
            </p>
          </div>
        </div>

        {/* Main Form Center Container */}
        <div className="w-full max-w-md mx-auto my-auto py-6 space-y-7">
          {/* Welcome Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Sign in to manage your salon operations and client ledger
            </p>
          </div>

          {/* Interactive Demo Access Switcher */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Instant Demo Access
              </span>
              <span className="text-[10px] text-slate-400">One-click autofill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Demo Admin Card */}
              <button
                type="button"
                onClick={() => handleSelectDemoRole('admin')}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  selectedDemoRole === 'admin'
                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Admin User</p>
                    <p className="text-[10px] text-slate-500 truncate">Administrator (Full Access)</p>
                  </div>
                </div>
                {selectedDemoRole === 'admin' && (
                  <Check className="h-4 w-4 text-slate-900 shrink-0 ml-1" />
                )}
              </button>

              {/* Demo Staff Card */}
              <button
                type="button"
                onClick={() => handleSelectDemoRole('staff')}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  selectedDemoRole === 'staff'
                    ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-sm'
                    : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Ayesha Khan</p>
                    <p className="text-[10px] text-slate-500 truncate">Staff Stylist (Restricted)</p>
                  </div>
                </div>
                {selectedDemoRole === 'staff' && (
                  <Check className="h-4 w-4 text-slate-900 shrink-0 ml-1" />
                )}
              </button>
            </div>

            {feedbackNotice && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{feedbackNotice}</span>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="name@regularsalon.pk"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setFeedbackNotice('Password recovery: Demo passwords are "admin123" and "staff123".');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder-slate-400 transition-all focus:border-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Credentials Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs text-slate-600 font-medium">Remember credentials</span>
              </label>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Salon Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Salon Suite</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper Tip */}
          <div className="pt-2 text-center text-xs text-slate-400">
            Need staff credentials setup? Contact Salon Administration.
          </div>
        </div>

        {/* Right Bottom Footer */}
        <div className="pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Secure SSL encrypted session • Regular CRM Enterprise v2.4
        </div>
      </div>
    </div>
  );
}
