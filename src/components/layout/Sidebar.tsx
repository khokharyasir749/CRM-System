"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  AlertCircle,
  PhoneCall,
  MessageSquareQuote,
  UserCog,
  BarChart3,
  Settings,
  Sparkles,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  UserCheck,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { RoleMode } from '@/types/crm';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  roleMode?: RoleMode;
  onToggleRoleMode?: (newMode: RoleMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  roleMode = 'admin',
  onToggleRoleMode,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'follow-ups', label: 'Follow-ups', icon: PhoneCall },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquareQuote,
      badge: 'Pending Scope',
    },
    { id: 'staff', label: 'Staff & Roles', icon: UserCog },
    { id: 'reports', label: 'Report & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-200/90 bg-white px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Regular CRM
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                  Salon Suite
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100/90 text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-slate-900 stroke-[2.5]'
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      title="Pending Scope Approval"
                      className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tight ${
                        isActive
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Card */}
        <div className="relative pt-4 border-t border-slate-100">
          {userDropdownOpen && (
            <div className="absolute bottom-20 left-1 right-1 z-50 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">
                  {roleMode === 'admin' ? 'Administrator' : 'Staff Stylist'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">admin@regularsalon.pk</p>
              </div>

              {onToggleRoleMode && (
                <button
                  onClick={() => {
                    onToggleRoleMode(roleMode === 'admin' ? 'staff' : 'admin');
                    setUserDropdownOpen(false);
                  }}
                  className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    {roleMode === 'admin' ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
                    )}
                    <span>Switch Role View</span>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold">
                    {roleMode === 'admin' ? 'Staff' : 'Admin'}
                  </span>
                </button>
              )}

              <button
                onClick={() => setUserDropdownOpen(false)}
                className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                Salon Profile & Branch
              </button>
              <button
                onClick={() => setUserDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                Preferences
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => setUserDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}

          <div
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-2.5 hover:bg-slate-50 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Admin User"
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Admin User
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  {roleMode === 'admin' ? 'admin@regularsalon.pk' : 'Stylist Account'}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                userDropdownOpen ? 'rotate-180 text-slate-700' : ''
              }`}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
