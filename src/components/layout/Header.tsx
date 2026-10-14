"use client";

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sliders,
  Plus,
  Download,
  Menu,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Share2,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { RoleMode } from '@/types/crm';

interface HeaderProps {
  title?: string;
  onOpenMobileMenu: () => void;
  onNewAppointment: () => void;
  onCustomizeWidgets: () => void;
  onExport: (format: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleMode?: RoleMode;
  onToggleRoleMode?: (newMode: RoleMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  onOpenMobileMenu,
  onNewAppointment,
  onCustomizeWidgets,
  onExport,
  searchQuery,
  onSearchChange,
  roleMode = 'admin',
  onToggleRoleMode,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Booking Confirmed",
      desc: "Mahnoor Farooq booked Bridal Makeup for 11:30 AM",
      time: "10 mins ago",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      id: 2,
      title: "Pending Balance Alert",
      desc: "Dr. Fatima Siddiqui partial balance PKR 6,000",
      time: "45 mins ago",
      icon: AlertTriangle,
      color: "text-amber-500 bg-amber-50",
    },
    {
      id: 3,
      title: "Stylist Check-in",
      desc: "Ayesha Khan started workstation prep",
      time: "1 hour ago",
      icon: Clock,
      color: "text-blue-500 bg-blue-50",
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-slate-200/90 bg-white/95 px-6 py-3.5 backdrop-blur-md transition-all">
      {/* Top Header Row (matching Cemdash) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
        </div>

        {/* Top Right: Notifications, Search Something, Share */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Bell className="h-4 w-4 text-slate-700" />
              <span className="absolute 1 top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                    3 New
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1 max-h-72 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className={`mt-0.5 rounded-lg p-1.5 ${n.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{n.desc}</p>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search Something Input */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search something"
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-1.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Share Button */}
          <button
            onClick={() => onExport('CSV')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Share2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Secondary Controls Bar (matching Cemdash row with Customize Widget, Last update, Imports, Exports) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        {/* Left: Customize Widget Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCustomizeWidgets}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-700" />
            <span>Customize Widget</span>
          </button>

          {/* Role Simulator Tag */}
          {onToggleRoleMode && (
            <button
              onClick={() => onToggleRoleMode(roleMode === 'admin' ? 'staff' : 'admin')}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                roleMode === 'admin'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-blue-200 bg-blue-50 text-blue-800'
              }`}
            >
              {roleMode === 'admin' ? (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
              )}
              <span>{roleMode === 'admin' ? 'Admin Role' : 'Staff Mode'}</span>
            </button>
          )}
        </div>

        {/* Right: Last Update, Imports, Exports, + New Appointment */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Last update 24 minutes ago</span>
          </span>

          {/* Imports Pill */}
          <button
            onClick={() => onExport('CSV')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5 text-slate-600" />
            <span>Imports</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Exports Pill (Solid Black as in Cemdash) */}
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exports</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                <button
                  onClick={() => {
                    onExport('CSV');
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Export as CSV (.csv)</span>
                </button>
                <button
                  onClick={() => {
                    onExport('PDF');
                    setExportOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>Export as PDF Report</span>
                </button>
              </div>
            )}
          </div>

          {/* + New Appointment */}
          <button
            onClick={onNewAppointment}
            className="flex items-center gap-1.5 rounded-full border border-slate-900 bg-white px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
