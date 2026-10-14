"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  CreditCard,
  MessageCircle,
  Eye,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Customer } from '@/types/crm';

interface CustomerListViewProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenAddModal: () => void;
  onQuickBook: (customer: Customer) => void;
  onRecordPayment: (customer: Customer) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onSelectCustomer,
  onOpenAddModal,
  onQuickBook,
  onRecordPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'VIP' | 'Frequent' | 'Has Balance'>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Category / condition filter
      const matchesFilter =
        selectedFilter === 'All'
          ? true
          : selectedFilter === 'Has Balance'
          ? c.outstandingBalance > 0
          : c.category === selectedFilter;

      // Search query
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [customers, selectedFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      All: customers.length,
      VIP: customers.filter((c) => c.category === 'VIP').length,
      Frequent: customers.filter((c) => c.category === 'Frequent').length,
      'Has Balance': customers.filter((c) => c.outstandingBalance > 0).length,
    };
  }, [customers]);

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hi ${name}, greeting from Regular CRM Salon!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Salon Client Directory</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {filteredCustomers.length} Clients
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Track client visit histories, skin/hair profiles, and outstanding balances
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'VIP', 'Frequent', 'Has Balance'] as const).map((tab) => {
          const isActive = selectedFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customers Data Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Customer Information</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Visits & Last Visit</th>
                <th className="py-3.5 px-3">Lifetime Spend</th>
                <th className="py-3.5 px-3">Outstanding Balance</th>
                <th className="py-3.5 px-3">Preferred Stylist</th>
                <th className="py-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Search className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      No matching clients found
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Try searching with a different name or clear current filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const isMenuOpen = openMenuId === customer.id;

                  return (
                    <tr
                      key={customer.id}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shadow-2xs cursor-pointer"
                            onClick={() => onSelectCustomer(customer)}
                          />
                          <div className="flex flex-col">
                            <span
                              onClick={() => onSelectCustomer(customer)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs"
                            >
                              {customer.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-600">
                              <span>{customer.phone}</span>
                              <span className="hidden sm:inline">• {customer.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            customer.category === 'VIP'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300/80'
                              : customer.category === 'Frequent'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {customer.category}
                        </span>
                      </td>

                      {/* Visits & Last Date */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {customer.visitsCount} Visits
                          </span>
                          <span className="text-[11px] text-slate-600">
                            Last: {customer.lastVisitDate}
                          </span>
                        </div>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900">
                          PKR {customer.totalSpent.toLocaleString()}
                        </span>
                      </td>

                      {/* Outstanding Balance */}
                      <td className="py-3.5 px-3">
                        {customer.outstandingBalance > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            PKR {customer.outstandingBalance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                            PKR 0
                          </span>
                        )}
                      </td>

                      {/* Preferred Stylist */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-800">
                          {customer.preferredStylistName || 'Any Master Stylist'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-6 text-right relative">
                        <button
                          onClick={() => setOpenMenuId(isMenuOpen ? null : customer.id)}
                          className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200/80 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown */}
                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-6 top-10 z-40 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100 text-left">
                              <button
                                onClick={() => {
                                  onSelectCustomer(customer);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-600" />
                                View 360° Profile
                              </button>

                              <button
                                onClick={() => {
                                  onQuickBook(customer);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <Scissors className="h-3.5 w-3.5 text-slate-600" />
                                Quick Book Service
                              </button>

                              <button
                                onClick={() => {
                                  onRecordPayment(customer);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                Record Payment
                              </button>

                              <button
                                onClick={() => {
                                  handleWhatsApp(customer.phone, customer.name);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp Action
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

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
          <span>Showing {filteredCustomers.length} of {customers.length} registered clients</span>
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
    </div>
  );
};
