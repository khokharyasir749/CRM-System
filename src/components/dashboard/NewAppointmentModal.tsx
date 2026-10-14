"use client";

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
  FileText,
  AlertTriangle,
  Check,
  Plus,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, PaymentStatus, Stylist } from '@/types/crm';
import { availableServices, stylistsList } from '@/data/salonData';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  customers: Customer[];
  existingAppointments: Appointment[];
  preselectedCustomer?: Customer | null;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
  customers,
  existingAppointments,
  preselectedCustomer,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomer ? preselectedCustomer.id : customers[0]?.id || 'cust-1'
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([availableServices[0].name]);
  const [selectedStylistId, setSelectedStylistId] = useState<string>(stylistsList[0].id);
  const [date, setDate] = useState('Today, Oct 14');
  const [startTime, setStartTime] = useState('14:00');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [status, setStatus] = useState<BookingStatus>('Confirmed');
  const [notes, setNotes] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Calculate totals from multi-selected services
  const selectedServiceObjects = useMemo(() => {
    return availableServices.filter((s) => selectedServices.includes(s.name));
  }, [selectedServices]);

  const totalBill = useMemo(() => {
    return selectedServiceObjects.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedServiceObjects]);

  const totalDuration = useMemo(() => {
    return selectedServiceObjects.reduce((acc, curr) => acc + curr.duration, 0);
  }, [selectedServiceObjects]);

  // Compute end time based on start time + totalDuration minutes
  const computedEndTime = useMemo(() => {
    const [h, m] = startTime.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + totalDuration;
    const endH = Math.floor(endMins / 60) % 24;
    const endM = endMins % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  }, [startTime, totalDuration]);

  const timeSlotFormatted = useMemo(() => {
    return `${startTime} - ${computedEndTime}`;
  }, [startTime, computedEndTime]);

  // Real-time double-booking warning check for selected stylist and time
  const hasConflict = useMemo(() => {
    const [h1, m1] = startTime.split(':').map(Number);
    const s1 = h1 * 60 + m1;
    const e1 = s1 + totalDuration;

    return existingAppointments.some((app) => {
      if (app.stylist.id === selectedStylistId && app.status !== 'Cancelled') {
        const [appH, appM] = (app.startTime || '11:00').split(':').map(Number);
        const [appEndH, appEndM] = (app.endTime || '12:30').split(':').map(Number);
        const s2 = appH * 60 + appM;
        const e2 = appEndH * 60 + appEndM;
        return s1 < e2 && s2 < e1;
      }
      return false;
    });
  }, [selectedStylistId, startTime, totalDuration, existingAppointments]);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentStylist = stylistsList.find((s) => s.id === selectedStylistId) || stylistsList[0];

  const handleToggleService = (name: string) => {
    if (selectedServices.includes(name)) {
      if (selectedServices.length > 1) {
        setSelectedServices((prev) => prev.filter((s) => s !== name));
      }
    } else {
      setSelectedServices((prev) => [...prev, name]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      bookingCode: `#BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: currentCustomer,
      service: selectedServices.join(' + '),
      category: selectedServiceObjects[0]?.category as any || 'Hair & Styling',
      stylist: currentStylist,
      date: date,
      timeSlot: timeSlotFormatted,
      startTime: startTime,
      endTime: computedEndTime,
      amount: totalBill,
      paidAmount: paymentStatus === 'Paid' ? totalBill : paymentStatus === 'Partial' ? totalBill / 2 : 0,
      paymentStatus: paymentStatus,
      status: status,
      durationMinutes: totalDuration,
      notes: notes || 'Booked via Regular CRM',
    };

    onAddAppointment(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Sparkles className="h-4.5 w-4.5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Book Salon Appointment
              </h2>
              <p className="text-xs text-slate-600">
                Select client, bundled services, time slot & stylist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Real-time Conflict Alert */}
        {hasConflict && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">⚠️ Staff Overlap Warning: </span>
              <span>
                {currentStylist.name} already has a booking during {timeSlotFormatted}. You may still proceed or switch stylist.
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Salon Client *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) • {c.category} • Balance: PKR {c.outstandingBalance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Service Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Services (Multi-Select Bundle)
              </label>
              <span className="text-[11px] text-blue-600 font-semibold">
                {selectedServices.length} selected ({totalDuration} mins)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {availableServices.map((service) => {
                const isSelected = selectedServices.includes(service.name);
                return (
                  <div
                    key={service.name}
                    onClick={() => handleToggleService(service.name)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold line-clamp-1">{service.name}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {service.category} • {service.duration}m
                      </p>
                    </div>
                    <span className="font-bold shrink-0 ml-2">
                      PKR {service.price.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stylist & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Stylist
              </label>
              <select
                value={selectedStylistId}
                onChange={(e) => setSelectedStylistId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
              >
                {stylistsList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-in">Checked-in</option>
                <option value="Pending Payment">Pending Payment</option>
              </select>
            </div>
          </div>

          {/* Date, Start Time & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Option
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
              >
                <option value="Paid">Full Payment</option>
                <option value="Partial">Partial Advance</option>
                <option value="Unpaid">Unpaid / Pay Later</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client & Styling Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hydration serum, soft curls, tea preference"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
            />
          </div>

          {/* Bill Calculation Summary Strip */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600">Calculated Bill:</span>
              <p className="text-base font-bold text-slate-900">
                PKR {totalBill.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-600">Time Window:</span>
              <p className="font-bold text-slate-800">
                {timeSlotFormatted} ({totalDuration} mins)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
