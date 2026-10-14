"use client";

import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Scissors,
  CreditCard,
  AlertCircle,
  PhoneCall,
  UserCheck,
  Clock,
  ShieldAlert,
  FileText,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { Appointment, Customer, Invoice, ComplaintTicket, FollowUpTask } from '@/types/crm';

interface CustomerProfileDrawerProps {
  customer: Customer | null;
  onClose: () => void;
  appointments: Appointment[];
  invoices: Invoice[];
  complaints: ComplaintTicket[];
  followUps: FollowUpTask[];
  onQuickBook: (customer: Customer) => void;
  onRecordPayment: (customer: Customer) => void;
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  customer,
  onClose,
  appointments,
  invoices,
  complaints,
  followUps,
  onQuickBook,
  onRecordPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'payments' | 'complaints' | 'followups'>('overview');

  if (!customer) return null;

  // Filter items specific to this customer
  const customerAppointments = appointments.filter((a) => a.customer.id === customer.id || a.customer.name === customer.name);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id || i.customerName === customer.name);
  const customerComplaints = complaints.filter((c) => c.customerId === customer.id || c.customerName === customer.name);
  const customerFollowUps = followUps.filter((f) => f.customerId === customer.id || f.customerName === customer.name);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: `Appointments (${customerAppointments.length})` },
    { id: 'services', label: 'Visits & Services' },
    { id: 'payments', label: `Invoices (${customerInvoices.length})` },
    { id: 'complaints', label: `Complaints (${customerComplaints.length})` },
    { id: 'followups', label: `Follow-ups (${customerFollowUps.length})` },
  ] as const;

  const handleWhatsApp = () => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${customer.name}, this is Regular CRM Salon. We hope you are having a wonderful day!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header Profile Bar */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      customer.category === 'VIP'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : customer.category === 'Frequent'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {customer.category} Client
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {customer.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-200/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* KPI Summary Strip */}
          <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
            <div className="text-center">
              <span className="text-[11px] font-medium text-slate-600">Lifetime Spend</span>
              <p className="text-sm font-bold text-slate-900">
                PKR {customer.totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-slate-100">
              <span className="text-[11px] font-medium text-slate-600">Total Visits</span>
              <p className="text-sm font-bold text-slate-900">{customer.visitsCount} Times</p>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-medium text-slate-600">Current Balance</span>
              <p
                className={`text-sm font-bold ${
                  customer.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                PKR {customer.outstandingBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => onQuickBook(customer)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Quick Book
            </button>
            <button
              onClick={() => onRecordPayment(customer)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
              Record Payment
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Client
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 overflow-x-auto bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Hair/Skin & Allergy Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Scissors className="h-4 w-4 text-blue-600" />
                    <span>Skin & Hair Characteristics</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {customer.skinHairNotes || 'No specific skin/hair notes recorded yet.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-100 p-4 bg-rose-50/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>Allergies & Precautions</span>
                  </div>
                  <p className="mt-2 text-xs text-rose-700 leading-relaxed">
                    {customer.allergies || 'No known product allergies.'}
                  </p>
                </div>
              </div>

              {/* Preferred Staff */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <span className="text-xs font-semibold text-slate-600">Preferred Stylist:</span>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {customer.preferredStylistName || 'Any Master Stylist'}
                </p>
                <p className="text-xs text-slate-600">Last visited on {customer.lastVisitDate}</p>
              </div>

              {/* Recent Activity Timeline */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-900 mb-3">Client Salon Timeline</h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <p className="text-xs font-semibold text-slate-900">Recent Service Visit</p>
                    <p className="text-[11px] text-slate-600">{customer.lastVisitDate} • Completed service checkout</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-xs font-semibold text-slate-900">Account Registration</p>
                    <p className="text-[11px] text-slate-600">{customer.joinedDate} • Joined Regular CRM loyalty register</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-3 animate-in fade-in">
              {customerAppointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600">
                  No appointments registered for this client.
                </div>
              ) : (
                customerAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{app.service}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {app.bookingCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {app.date} • {app.timeSlot} with {app.stylist.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">PKR {app.amount.toLocaleString()}</p>
                      <span className="inline-block mt-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. VISITS & SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Service Performed</th>
                      <th className="p-3">Staff Specialist</th>
                      <th className="p-3 text-right">Charged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerAppointments.map((app) => (
                      <tr key={app.id}>
                        <td className="p-3 font-medium text-slate-800">{app.date}</td>
                        <td className="p-3 font-medium text-slate-900">{app.service}</td>
                        <td className="p-3 text-slate-600">{app.stylist.name}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          PKR {app.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. PAYMENTS & INVOICES */}
          {activeTab === 'payments' && (
            <div className="space-y-3 animate-in fade-in">
              {customerInvoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600">
                  No payment ledger invoices found.
                </div>
              ) : (
                customerInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{inv.invoiceCode}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {inv.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {inv.serviceName} • {inv.recordedDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        PKR {inv.paidAmount.toLocaleString()} / {inv.totalAmount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          inv.dueBalance === 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {inv.dueBalance === 0 ? 'Settled' : `Due: PKR ${inv.dueBalance.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="space-y-3 animate-in fade-in">
              {customerComplaints.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-600 bg-slate-50/50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-900">Zero Active Complaints</p>
                  <p className="text-slate-600 mt-0.5">This customer has 100% satisfaction satisfaction record.</p>
                </div>
              ) : (
                customerComplaints.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{c.ticketCode}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-800">{c.issue}</p>
                    {c.resolutionNotes && (
                      <div className="mt-2 text-[11px] text-slate-600 border-t border-amber-200/60 pt-2">
                        <span className="font-semibold text-slate-700">Resolution: </span>
                        {c.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="space-y-3 animate-in fade-in">
              {customerFollowUps.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600">
                  No pending follow-ups scheduled for this client.
                </div>
              ) : (
                customerFollowUps.map((fol) => (
                  <div key={fol.id} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{fol.type}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          fol.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {fol.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{fol.notes}</p>
                    <p className="mt-2 text-[11px] font-medium text-slate-600">
                      Scheduled Date: {fol.scheduledDate}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
