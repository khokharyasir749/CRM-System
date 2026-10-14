"use client";

import React, { useState, useMemo } from 'react';
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
  User,
  Scissors,
  Receipt,
  Calendar,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { Appointment, Customer, Invoice, RoleMode } from '@/types/crm';

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
  customers?: Customer[];
  appointments?: Appointment[];
  invoices?: Invoice[];
  onSelectCustomer?: (customer: Customer) => void;
  onSelectAppointment?: (appointment: Appointment) => void;
  onSelectInvoice?: (invoice: Invoice) => void;
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
  customers = [],
  appointments = [],
  invoices = [],
  onSelectCustomer,
  onSelectAppointment,
  onSelectInvoice,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // Dynamic Search Results across Customers, Bookings, and Invoices
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;

    const matchedCustomers = (customers || [])
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedAppointments = (appointments || [])
      .filter(
        (a) =>
          a.bookingCode.toLowerCase().includes(q) ||
          a.customer.name.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedInvoices = (invoices || [])
      .filter(
        (i) =>
          i.invoiceCode.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.serviceName.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const totalCount =
      matchedCustomers.length + matchedAppointments.length + matchedInvoices.length;

    return {
      customers: matchedCustomers,
      appointments: matchedAppointments,
      invoices: matchedInvoices,
      totalCount,
    };
  }, [searchQuery, customers, appointments, invoices]);

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

          {/* Interactive Global Search Input & Dropdown */}
          <div className="relative w-48 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchFocused(false);
              }}
              placeholder="Search something"
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-1.5 pl-10 pr-8 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden transition-all shadow-2xs"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Quick Command & Search Dropdown Results */}
            {isSearchFocused && searchResults && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Search className="h-3.5 w-3.5 text-slate-500" />
                    <span>Quick Search Results</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {searchResults.totalCount} Found
                  </span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {/* Category 1: Customers */}
                  {searchResults.customers.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                        Clients & Directory
                      </span>
                      {searchResults.customers.map((c) => (
                        <div
                          key={c.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onSelectCustomer?.(c);
                            setIsSearchFocused(false);
                            onSearchChange('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-slate-400">{c.phone}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[9px] font-semibold">
                            {c.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category 2: Appointments */}
                  {searchResults.appointments.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                        Appointments & Bookings
                      </span>
                      {searchResults.appointments.map((a) => (
                        <div
                          key={a.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onSelectAppointment?.(a);
                            setIsSearchFocused(false);
                            onSearchChange('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                              <Scissors className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                {a.bookingCode} • {a.customer.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                {a.service} ({a.timeSlot})
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[9px] font-semibold">
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category 3: Invoices */}
                  {searchResults.invoices.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                        Invoices & Receipts
                      </span>
                      {searchResults.invoices.map((inv) => (
                        <div
                          key={inv.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onSelectInvoice?.(inv);
                            setIsSearchFocused(false);
                            onSearchChange('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <Receipt className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                {inv.invoiceCode} • {inv.customerName}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                PKR {inv.totalAmount.toLocaleString()} ({inv.paymentMethod})
                              </p>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              inv.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.totalCount === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No records match "{searchQuery}"
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 px-2">
                  <span>Press Esc to close</span>
                  <span>Click record to jump</span>
                </div>
              </div>
            )}
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

          {/* Static Non-Clickable Role Status Badge */}
          {roleMode === 'admin' ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold select-none cursor-default">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Admin Role</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full text-xs font-semibold select-none cursor-default">
              <ShieldAlert className="h-3.5 w-3.5 text-sky-600" />
              <span>Staff Role</span>
            </div>
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
