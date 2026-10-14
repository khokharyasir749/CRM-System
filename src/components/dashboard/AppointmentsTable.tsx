"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  UserCheck,
  CreditCard,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, PaymentStatus } from '@/types/crm';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onViewCustomer?: (customer: Customer) => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
  onUpdatePayment: (id: string, paymentStatus: PaymentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onExport: () => void;
  isLoading?: boolean;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onViewDetails,
  onViewCustomer,
  onUpdateStatus,
  onUpdatePayment,
  onDeleteAppointment,
  onExport,
  isLoading = false,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Checked-in' | 'Pending Payment'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Pending Payment'
          ? item.paymentStatus === 'Unpaid' || item.paymentStatus === 'Partial' || item.status === 'Pending Payment'
          : item.status === statusFilter;

      const q = searchFilter.toLowerCase();
      const matchesSearch =
        item.bookingCode.toLowerCase().includes(q) ||
        item.customer.name.toLowerCase().includes(q) ||
        item.customer.email.toLowerCase().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.stylist.name.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [appointments, statusFilter, searchFilter]);

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

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Title Header with ... menu (matching Cemdash) */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h3 className="text-[15px] font-bold text-slate-900">
          Sales Deals & Recent Visits
        </h3>
        <button className="text-slate-400 hover:text-slate-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Filter & Action Row inside Card */}
      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pill Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search something"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Right Action Buttons: Filter & Exports (Cemdash exact layout) */}
          <div className="flex items-center gap-2.5">
            {/* Filter Pill */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Filter className="h-3.5 w-3.5 text-slate-600" />
                <span>Filter</span>
                {statusFilter !== 'All' && (
                  <span className="rounded-full bg-slate-900 px-1.5 py-0.2 text-[9px] font-bold text-white">
                    {statusFilter}
                  </span>
                )}
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20">
                  {(['All', 'Confirmed', 'Checked-in', 'Pending Payment'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setStatusFilter(tab);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold ${
                        statusFilter === tab
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Exports Solid Black Pill */}
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exports</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border-t border-slate-100">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="py-3.5 pl-6 pr-3 w-10">
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
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>ID Deal</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Customer Name</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Customer Email</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Product/Service</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Deal Value</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 px-3">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Close Date</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-300" />
                </div>
              </th>
              <th className="py-3.5 pr-6 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              const isMenuOpen = openActionMenuId === app.id;

              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-slate-50' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 pl-6 pr-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(app.id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                  </td>

                  {/* ID Deal (Bold black) */}
                  <td className="py-3.5 px-3 font-bold text-slate-900 text-xs">
                    {app.bookingCode.replace('#', '')}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.customer.avatar}
                        alt={app.customer.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-100"
                      />
                      <span
                        onClick={() => (onViewCustomer ? onViewCustomer(app.customer) : onViewDetails(app))}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs"
                      >
                        {app.customer.name}
                      </span>
                    </div>
                  </td>

                  {/* Customer Email */}
                  <td className="py-3.5 px-3 text-slate-500 font-medium text-xs">
                    {app.customer.email}
                  </td>

                  {/* Product/Service */}
                  <td className="py-3.5 px-3 text-slate-800 font-semibold text-xs">
                    {app.service}
                  </td>

                  {/* Deal Value */}
                  <td className="py-3.5 px-3 text-sm font-semibold text-slate-900 tabular-nums">
                    PKR {app.amount.toLocaleString()}
                  </td>

                  {/* Close Date */}
                  <td className="py-3.5 px-3 text-slate-500 font-medium text-xs">
                    {app.date}
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 pr-6 text-right relative">
                    <button
                      onClick={() => setOpenActionMenuId(isMenuOpen ? null : app.id)}
                      className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setOpenActionMenuId(null)}
                        />
                        <div className="absolute right-6 top-10 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100 text-left">
                          <button
                            onClick={() => {
                              onViewDetails(app);
                              setOpenActionMenuId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            View Details
                          </button>

                          {app.status !== 'Checked-in' && (
                            <button
                              onClick={() => {
                                onUpdateStatus(app.id, 'Checked-in');
                                setOpenActionMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
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
                              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
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
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
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
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-white text-xs font-medium text-slate-400">
        <span>Showing {filteredAppointments.length} of {appointments.length} records</span>
        <div className="flex items-center gap-1">
          <button disabled className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center opacity-40">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            1
          </span>
          <button disabled className="h-7 w-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center opacity-40">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
