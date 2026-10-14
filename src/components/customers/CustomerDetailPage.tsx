"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Scissors,
  CreditCard,
  AlertCircle,
  PhoneCall,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Plus,
  ShieldAlert,
  FileText,
  User,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { Appointment, Customer, Invoice, ComplaintTicket, FollowUpTask } from '@/types/crm';

interface CustomerDetailPageProps {
  customer: Customer;
  onBack: () => void;
  appointments: Appointment[];
  invoices: Invoice[];
  complaints: ComplaintTicket[];
  followUps: FollowUpTask[];
  onBookAppointment: (customer: Customer) => void;
  onRecordPayment: (customer: Customer) => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
  onBack,
  appointments,
  invoices,
  complaints,
  followUps,
  onBookAppointment,
  onRecordPayment,
  onViewAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'payments' | 'complaints' | 'followups'>('overview');

  // Filter items specific to this customer
  const customerAppointments = appointments.filter(
    (a) => a.customer.id === customer.id || a.customer.name === customer.name
  );
  const customerInvoices = invoices.filter(
    (i) => i.customerId === customer.id || i.customerName === customer.name
  );
  const customerComplaints = complaints.filter(
    (c) => c.customerId === customer.id || c.customerName === customer.name
  );
  const customerFollowUps = followUps.filter(
    (f) => f.customerId === customer.id || f.customerName === customer.name
  );

  const tabs = [
    { id: 'overview', label: 'Client Overview' },
    { id: 'appointments', label: `Appointments (${customerAppointments.length})` },
    { id: 'services', label: 'Visits & Services' },
    { id: 'payments', label: `Invoices & Ledger (${customerInvoices.length})` },
    { id: 'complaints', label: `Complaints (${customerComplaints.length})` },
    { id: 'followups', label: `Client Care (${customerFollowUps.length})` },
  ] as const;

  const handleWhatsApp = () => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${customer.name}, this is Regular CRM Salon. We hope you are having a wonderful day!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Back to Directory"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Customers</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">{customer.name}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Customer 360° Profile
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp Client</span>
          </button>
          <button
            onClick={() => onRecordPayment(customer)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <CreditCard className="h-3.5 w-3.5 text-slate-500" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => onBookAppointment(customer)}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{customer.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    customer.category === 'VIP'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : customer.category === 'Frequent'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {customer.category} Client
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Member since {customer.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <div className="rounded-xl bg-slate-50 p-3 text-center min-w-[100px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Spent</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                PKR {customer.totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center min-w-[90px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Visits</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.visitsCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center min-w-[100px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Balance</span>
              <p
                className={`text-sm font-bold mt-0.5 ${
                  customer.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                PKR {customer.outstandingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Client Overview Panel */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hair & Skin Beauty Consultation Notes */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Scissors className="h-4 w-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Beauty & Stylist Profile</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-400 block mb-0.5">Skin & Hair Texture Notes:</span>
                <p className="font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {customer.skinHairNotes}
                </p>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Preferred Stylist:</span>
                <span className="font-bold text-slate-900">{customer.preferredStylistName || 'None assigned'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Last Visit Date:</span>
                <span className="font-bold text-slate-900">{customer.lastVisitDate}</span>
              </div>
            </div>
          </div>

          {/* Safety & Allergies Card */}
          <div className="rounded-2xl border border-rose-200/70 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-rose-100 pb-3">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Allergies & Medical Precautions</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3.5 text-rose-900 leading-relaxed font-medium">
                {customer.allergies}
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Always confirm with the client prior to applying chemical perms, bleach, or active peel treatments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customer Appointments List */}
      {activeTab === 'appointments' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Booking History</h3>
            <button
              onClick={() => onBookAppointment(customer)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Appointment</span>
            </button>
          </div>

          {customerAppointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No appointments found for this client.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Stylist</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Charges</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerAppointments.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => onViewAppointment?.(app)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">{app.bookingCode}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{app.service}</td>
                      <td className="py-3 px-4 text-slate-600">{app.stylist.name}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {app.date} • {app.timeSlot}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                        PKR {app.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Visits & Services History */}
      {activeTab === 'services' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Treatments & Service Records
          </h3>
          <div className="space-y-3">
            {customerAppointments.map((app) => (
              <div
                key={app.id}
                onClick={() => onViewAppointment?.(app)}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{app.service}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Stylist: {app.stylist.name} • {app.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">PKR {app.amount.toLocaleString()}</span>
                  <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Invoices & Ledger */}
      {activeTab === 'payments' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Billing & Payment Ledger</h3>
            <button
              onClick={() => onRecordPayment(customer)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Record Payment</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{inv.invoiceCode}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.recordedDate}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{inv.serviceName}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      PKR {inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold tabular-nums">
                      PKR {inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600 tabular-nums">
                      PKR {inv.dueBalance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inv.paymentStatus === 'Partial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Complaints History */}
      {activeTab === 'complaints' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Client Feedback & Tickets
          </h3>
          {customerComplaints.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No complaints recorded for this customer.</p>
          ) : (
            <div className="space-y-3">
              {customerComplaints.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.ticketCode} — {c.category}</span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{c.issue}</p>
                  {c.resolutionNotes && (
                    <p className="text-emerald-700 font-medium text-[11px] pt-1">
                      Resolution: {c.resolutionNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Follow-ups History */}
      {activeTab === 'followups' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Client Retention & Follow-up Calls
          </h3>
          {customerFollowUps.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active care tasks for this customer.</p>
          ) : (
            <div className="space-y-3">
              {customerFollowUps.map((f) => (
                <div key={f.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{f.reason}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Scheduled: {f.scheduledDate} • Assigned: {f.assignedStaffName}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
