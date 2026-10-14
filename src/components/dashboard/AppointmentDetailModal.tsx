"use client";

import React from 'react';
import {
  X,
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
} from 'lucide-react';
import { Appointment, BookingStatus, PaymentStatus } from '@/types/crm';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onUpdatePayment: (id: string, payment: PaymentStatus) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  onUpdatePayment,
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer / Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white tracking-wider">
              {appointment.bookingCode}
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Salon Booking Details
              </h2>
              <span className="text-[11px] text-slate-600">
                Registered in Regular CRM System
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Customer Profile Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <img
                src={appointment.customer.avatar}
                alt={appointment.customer.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {appointment.customer.name}
                  </h3>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {appointment.customer.visitsCount} Past Visits
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {appointment.customer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {appointment.customer.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service & Stylist Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200/80 p-3.5">
              <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                <Scissors className="h-3 w-3 text-blue-600" />
                Service Booked
              </span>
              <p className="mt-1 text-xs font-bold text-slate-900">
                {appointment.service}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-600">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium">
                  {appointment.category}
                </span>
                <span>{appointment.durationMinutes} Minutes</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 p-3.5">
              <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-emerald-600" />
                Assigned Stylist
              </span>
              <div className="mt-1 flex items-center gap-2">
                <img
                  src={appointment.stylist.avatar}
                  alt={appointment.stylist.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {appointment.stylist.name}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {appointment.stylist.specialty}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Timing */}
          <div className="rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-slate-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {appointment.date}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointment.timeSlot}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-600">Status:</span>
              <p className="text-xs font-bold text-slate-900">{appointment.status}</p>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
              <span className="text-slate-600">Service Base Charge</span>
              <span className="font-semibold text-slate-900">
                PKR {appointment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-600">Payment Status</span>
              <span
                className={`font-bold ${
                  appointment.paymentStatus === 'Paid'
                    ? 'text-emerald-600'
                    : appointment.paymentStatus === 'Partial'
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {appointment.paymentStatus} (PKR {appointment.paidAmount.toLocaleString()} paid)
              </span>
            </div>
          </div>

          {/* Client Notes */}
          {appointment.notes && (
            <div className="rounded-2xl border border-slate-200/80 p-3.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 block mb-0.5">
                Styling & Client Notes:
              </span>
              <p>{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {appointment.status !== 'Checked-in' && (
                <button
                  onClick={() => {
                    onUpdateStatus(appointment.id, 'Checked-in');
                    onClose();
                  }}
                  className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Mark Checked-in
                </button>
              )}

              {appointment.paymentStatus !== 'Paid' && (
                <button
                  onClick={() => {
                    onUpdatePayment(appointment.id, 'Paid');
                    onClose();
                  }}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                >
                  Mark as Paid
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
