"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Scissors,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  UserCheck,
  Sparkles,
  Printer,
  ExternalLink,
  ShieldAlert,
  FileText,
  BadgeCheck,
  MessageSquare,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, PaymentStatus } from '@/types/crm';

interface AppointmentDetailPageProps {
  appointment: Appointment;
  onBack: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onUpdatePayment: (id: string, payment: PaymentStatus) => void;
  onViewCustomer?: (customer: Customer) => void;
  onPrintReceipt?: (appointment: Appointment) => void;
  onSettleBalance?: (appointment: Appointment) => void;
}

export const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({
  appointment,
  onBack,
  onUpdateStatus,
  onUpdatePayment,
  onViewCustomer,
  onPrintReceipt,
  onSettleBalance,
}) => {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>(appointment.status);
  const [activePaymentStatus, setActivePaymentStatus] = useState<PaymentStatus>(
    appointment.paymentStatus
  );

  const balanceDue = Math.max(0, appointment.amount - appointment.paidAmount);

  const handleMarkCheckedIn = () => {
    setActiveStatus('Checked-in');
    onUpdateStatus(appointment.id, 'Checked-in');
  };

  const handleMarkAsPaid = () => {
    setActivePaymentStatus('Paid');
    onUpdatePayment(appointment.id, 'Paid');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Checked-in':
        return (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            Checked-in
          </span>
        );
      case 'Confirmed':
        return (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white border border-slate-900">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      case 'No-show':
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            No-show
          </span>
        );
      case 'Pending Payment':
        return (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            Pending Payment
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Breadcrumb & Action Strip */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Appointments</span>
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">
              Booking {appointment.bookingCode}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-white tracking-wider">
              {appointment.bookingCode}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Salon Booking Details
            </h1>
            {getStatusBadge(activeStatus)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeStatus !== 'Checked-in' && activeStatus !== 'Completed' && (
            <button
              onClick={handleMarkCheckedIn}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Mark Checked-in</span>
            </button>
          )}

          {activePaymentStatus !== 'Paid' && (
            <button
              onClick={handleMarkAsPaid}
              className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Mark as Paid</span>
            </button>
          )}

          <button
            onClick={() => onPrintReceipt?.(appointment)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Full-width Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Client Snapshot, Service Details, Stylist, Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Client Snapshot */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Client Snapshot</h2>
              </div>
              {onViewCustomer && (
                <button
                  onClick={() => onViewCustomer(appointment.customer)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View 360° Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={appointment.customer.avatar}
                alt={appointment.customer.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {appointment.customer.name}
                  </h3>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                    {appointment.customer.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    {appointment.customer.visitsCount} Past Visits
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {appointment.customer.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {appointment.customer.email}
                  </span>
                </div>

                {appointment.customer.outstandingBalance > 0 && (
                  <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 pt-1">
                    <AlertTriangle className="h-3 w-3" />
                    Client has existing account balance of PKR{' '}
                    {appointment.customer.outstandingBalance.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Service Details & Schedule */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Scissors className="h-4 w-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Service & Schedule Details</h2>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Selected Treatment
                </span>
                <p className="text-sm font-bold text-slate-900">{appointment.service}</p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold">
                    {appointment.category}
                  </span>
                  <span>•</span>
                  <span>{appointment.durationMinutes} Minutes Expected</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Schedule Slot
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{appointment.timeSlot}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Assigned Stylist Info */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <UserCheck className="h-4 w-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Assigned Stylist / Specialist</h2>
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <img
                src={appointment.stylist.avatar}
                alt={appointment.stylist.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {appointment.stylist.name}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                    Active On-Duty
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {appointment.stylist.specialty}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Client Notes & Requests */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <FileText className="h-4 w-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Client Notes & Instructions</h2>
            </div>

            <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/40 p-4">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {appointment.notes ||
                  'No special notes recorded. Standard consultation and styling procedure applies.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Service Base Charge, Payment Status Badge, Settlement */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Payment Status Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Payment Status</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  activePaymentStatus === 'Paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : activePaymentStatus === 'Partial'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {activePaymentStatus}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Service Base Charge</span>
                <span className="font-bold text-slate-900">
                  PKR {appointment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-bold text-emerald-600">
                  PKR {appointment.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Balance Settlement Due</span>
                <span
                  className={`font-extrabold ${
                    balanceDue > 0 ? 'text-rose-600 text-base' : 'text-slate-900'
                  }`}
                >
                  PKR {balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Settle Balance button */}
            {balanceDue > 0 ? (
              <div className="pt-2">
                <button
                  onClick={() => onSettleBalance?.(appointment)}
                  className="w-full rounded-full bg-slate-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Settle Balance (PKR {balanceDue.toLocaleString()})</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/70 p-3 text-xs font-semibold text-emerald-800">
                <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Account fully cleared. No outstanding balance.</span>
              </div>
            )}
          </div>

          {/* 2. Booking Metadata & Quick Audit */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">
              Booking Audit & History
            </h3>
            <div className="flex justify-between text-slate-500">
              <span>Booking Reference</span>
              <span className="font-mono font-semibold text-slate-900">
                {appointment.bookingCode}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Appointment ID</span>
              <span className="font-mono text-slate-700">{appointment.id}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Booking Channel</span>
              <span className="font-semibold text-slate-900">Salon Desk / POS</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Client Check-in</span>
              <span className="font-semibold text-slate-900">
                {activeStatus === 'Checked-in' ? 'Verified Today' : 'Awaiting Arrival'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
