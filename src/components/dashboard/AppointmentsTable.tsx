"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Eye,
  UserCheck,
  CreditCard,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Appointment, BookingStatus, PaymentStatus } from '@/types/crm';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
  onUpdatePayment: (id: string, paymentStatus: PaymentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onExport: () => void;
  isLoading?: boolean;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onViewDetails,
  onUpdateStatus,
  onUpdatePayment,
  onDeleteAppointment,
  onExport,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'Checked-in' | 'Pending Payment'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      // Tab filter
      const matchesTab =
        activeTab === 'All'
          ? true
          : activeTab === 'Pending Payment'
          ? item.paymentStatus === 'Unpaid' || item.paymentStatus === 'Partial' || item.status === 'Pending Payment'
          : item.status === activeTab;

      // Search filter
      const q = searchFilter.toLowerCase();
      const matchesSearch =
        item.bookingCode.toLowerCase().includes(q) ||
        item.customer.name.toLowerCase().includes(q) ||
        item.customer.phone.includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.stylist.name.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchFilter]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: appointments.length,
      Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
      'Checked-in': appointments.filter((a) => a.status === 'Checked-in').length,
      'Pending Payment': appointments.filter(
        (a) => a.paymentStatus === 'Unpaid' || a.paymentStatus === 'Partial' || a.status === 'Pending Payment'
      ).length,
    };
  }, [appointments]);

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredAppointments.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'Partial':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Partial
          </span>
        );
      case 'Unpaid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Unpaid
          </span>
        );
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Checked-in':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-200/60">
            <UserCheck className="h-3 w-3" />
            Checked-in
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200/70">
            <Clock className="h-3 w-3 text-slate-600" />
            Confirmed
          </span>
        );
      case 'Pending Payment':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200/60">
            Pending Payment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Upcoming Appointments & Recent Visits
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {filteredAppointments.length} Bookings
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Manage client check-ins, stylist assignments, and outstanding balances
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-600" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-slate-100/80 p-1 border border-slate-200/60">
            {(['All', 'Confirmed', 'Checked-in', 'Pending Payment'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const count = tabCounts[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search within table */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by client, stylist, id..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
            />
          </div>
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-2 text-white animate-in fade-in">
            <span className="text-xs font-medium">
              {selectedIds.length} appointments selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  selectedIds.forEach((id) => onUpdatePayment(id, 'Paid'));
                  setSelectedIds([]);
                }}
                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => {
                  selectedIds.forEach((id) => onUpdateStatus(id, 'Checked-in'));
                  setSelectedIds([]);
                }}
                className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-500"
              >
                Mark Checked-in
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredAppointments.length > 0 &&
                    selectedIds.length === filteredAppointments.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
              </th>
              <th className="py-3.5 px-3">Booking ID</th>
              <th className="py-3.5 px-3">Customer</th>
              <th className="py-3.5 px-3">Service Booked</th>
              <th className="py-3.5 px-3">Assigned Stylist</th>
              <th className="py-3.5 px-3">Date & Time Slot</th>
              <th className="py-3.5 px-3">Amount & Payment</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 pl-5 pr-3">
                    <div className="h-4 w-4 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 rounded bg-slate-200" />
                        <div className="h-2 w-16 rounded bg-slate-200" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <div className="h-4 w-6 ml-auto rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : filteredAppointments.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <Search className="h-6 w-6" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-slate-800">
                    No matching salon appointments found
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 max-w-sm mx-auto">
                    Try adjusting your search terms or switch to another filter tab to view bookings.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('All');
                      setSearchFilter('');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset Filters
                  </button>
                </td>
              </tr>
            ) : (
              // Data Rows
              filteredAppointments.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                const isMenuOpen = openActionMenuId === app.id;

                return (
                  <tr
                    key={app.id}
                    className={`group hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-slate-50/90' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-5 pr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(app.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </td>

                    {/* Booking ID */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">
                          {app.bookingCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(app.bookingCode)}
                          className="rounded p-1 text-slate-600 hover:bg-slate-200/80 transition-colors"
                          title="Copy Booking ID"
                        >
                          {copiedId === app.bookingCode ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={app.customer.avatar}
                          alt={app.customer.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => onViewDetails(app)}>
                            {app.customer.name}
                          </span>
                          <span className="text-[11px] text-slate-600">
                            {app.customer.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Service Booked */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {app.service}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {app.category}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {app.durationMinutes} mins
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={app.stylist.avatar}
                          alt={app.stylist.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">
                            {app.stylist.name}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {app.stylist.specialty}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time Slot */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {app.date}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {app.timeSlot}
                        </span>
                      </div>
                    </td>

                    {/* Total Amount & Payment Status */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-slate-900">
                          PKR {app.amount.toLocaleString()}
                        </span>
                        {getPaymentBadge(app.paymentStatus)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(app.status)}
                    </td>

                    {/* Action Menu */}
                    <td className="py-3.5 pr-5 text-right relative">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(isMenuOpen ? null : app.id)
                        }
                        className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200/80 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setOpenActionMenuId(null)}
                          />
                          <div className="absolute right-5 top-10 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100 text-left">
                            <button
                              onClick={() => {
                                onViewDetails(app);
                                setOpenActionMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-600" />
                              View Details
                            </button>

                            {app.status !== 'Checked-in' && (
                              <button
                                onClick={() => {
                                  onUpdateStatus(app.id, 'Checked-in');
                                  setOpenActionMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                Check-in Client
                              </button>
                            )}

                            {app.paymentStatus !== 'Paid' && (
                              <button
                                onClick={() => {
                                  onUpdatePayment(app.id, 'Paid');
                                  setOpenActionMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                Mark as Paid
                              </button>
                            )}

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() => {
                                onDeleteAppointment(app.id);
                                setOpenActionMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Cancel Booking
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Summary Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <span className="text-xs text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredAppointments.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{appointments.length}</span> salon appointments
        </span>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            disabled
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
            1
          </span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
