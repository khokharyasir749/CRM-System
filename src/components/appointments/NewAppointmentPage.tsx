"use client";

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
  AlertTriangle,
  Check,
  Plus,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, PaymentStatus, Stylist } from '@/types/crm';
import { availableServices, stylistsList } from '@/data/salonData';

interface NewAppointmentPageProps {
  onBack: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  customers: Customer[];
  existingAppointments: Appointment[];
  preselectedCustomerId?: string | null;
  onNavigateAddCustomer?: () => void;
}

export const NewAppointmentPage: React.FC<NewAppointmentPageProps> = ({
  onBack,
  onAddAppointment,
  customers,
  existingAppointments,
  preselectedCustomerId,
  onNavigateAddCustomer,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomerId || customers[0]?.id || ''
  );
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([availableServices[0].name]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedStylistId, setSelectedStylistId] = useState<string>(stylistsList[0].id);
  const [date, setDate] = useState('Today, Oct 14');
  const [startTime, setStartTime] = useState('14:00');
  const [paymentOption, setPaymentOption] = useState<'Full' | 'Partial' | 'Checkout'>('Full');
  const [notes, setNotes] = useState('');

  // Filter customers for dropdown/search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  const currentCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const currentStylist = useMemo(() => {
    return stylistsList.find((s) => s.id === selectedStylistId) || stylistsList[0];
  }, [selectedStylistId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(availableServices.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, []);

  const displayedServices = useMemo(() => {
    if (activeCategory === 'All') return availableServices;
    return availableServices.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  // Selected service objects
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

  const timeSlotFormatted = `${startTime} - ${computedEndTime}`;

  // Overlap conflict detection
  const conflictingAppointment = useMemo(() => {
    const [h1, m1] = startTime.split(':').map(Number);
    const s1 = h1 * 60 + m1;
    const e1 = s1 + totalDuration;

    return existingAppointments.find((app) => {
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

  const toggleService = (name: string) => {
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

    const paymentStatus: PaymentStatus =
      paymentOption === 'Full' ? 'Paid' : paymentOption === 'Partial' ? 'Partial' : 'Unpaid';
    const paidAmount =
      paymentOption === 'Full' ? totalBill : paymentOption === 'Partial' ? Math.floor(totalBill / 2) : 0;

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      bookingCode: `#BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: currentCustomer,
      service: selectedServices.join(' + '),
      category: (selectedServiceObjects[0]?.category as any) || 'Hair & Styling',
      stylist: currentStylist,
      date,
      timeSlot: timeSlotFormatted,
      startTime,
      endTime: computedEndTime,
      durationMinutes: totalDuration,
      amount: totalBill,
      paidAmount,
      status: 'Confirmed',
      paymentStatus,
      notes: notes.trim() || undefined,
    };

    onAddAppointment(newApp);
    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Back to Schedule"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Appointments</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Book New Appointment</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Schedule Salon Appointment
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Confirm & Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (65%) & Right Column (35%) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Client Selection */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">1. Client Selection</h2>
                  <p className="text-xs text-slate-400">Choose an existing client or register a new walk-in</p>
                </div>
              </div>

              {onNavigateAddCustomer && (
                <button
                  type="button"
                  onClick={onNavigateAddCustomer}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Client</span>
                </button>
              )}
            </div>

            {/* Client Search / Selector */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Registered Client
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Customer Active Card Preview */}
              {currentCustomer && (
                <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <img
                    src={currentCustomer.avatar}
                    alt={currentCustomer.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {currentCustomer.name}
                      </span>
                      <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold text-slate-700 uppercase">
                        {currentCustomer.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{currentCustomer.phone}</p>
                    {currentCustomer.outstandingBalance > 0 && (
                      <span className="text-[10px] font-bold text-rose-600">
                        Pending: PKR {currentCustomer.outstandingBalance.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Interactive Services Multi-Select Bundle */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Scissors className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">2. Select Services (Multi-Bundle)</h2>
                  <p className="text-xs text-slate-400">Click to bundle multiple salon treatments into a single visit</p>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayedServices.map((service) => {
                const isSelected = selectedServices.includes(service.name);

                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.name)}
                    className={`flex items-start justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/80 shadow-2xs ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{service.name}</span>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {service.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {service.duration} mins
                        </span>
                        <span className="font-bold text-slate-900">
                          PKR {service.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Stylist Assignment & Overlap Conflict Warning */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">3. Stylist & Workstation</h2>
                  <p className="text-xs text-slate-400">Assign master stylist or color specialist</p>
                </div>
              </div>
            </div>

            {/* Conflict Warning Banner */}
            {conflictingAppointment && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">Schedule Overlap Alert for {currentStylist.name}</p>
                  <p className="mt-0.5 text-amber-800">
                    This stylist already has a confirmed booking ({conflictingAppointment.bookingCode} for{' '}
                    {conflictingAppointment.customer.name} at {conflictingAppointment.timeSlot}). Booking will create an intentional double-booking slot.
                  </p>
                </div>
              </div>
            )}

            {/* Stylists Selection Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stylistsList.map((stylist) => {
                const isSelected = selectedStylistId === stylist.id;

                return (
                  <div
                    key={stylist.id}
                    onClick={() => setSelectedStylistId(stylist.id)}
                    className={`flex flex-col items-center p-3 text-center rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/80 shadow-2xs ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <span className="text-xs font-bold text-slate-900 mt-2 truncate w-full">
                      {stylist.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                      {stylist.specialty}
                    </span>
                    <span className="mt-1 text-[10px] font-bold text-amber-600">
                      ★ {stylist.rating}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Date, Time & Notes */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">4. Date, Time & Instructions</h2>
                <p className="text-xs text-slate-400">Set appointment slot and client preference remarks</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Appointment Date
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="Today, Oct 14">Today, Oct 14, 2026</option>
                  <option value="Tomorrow, Oct 15">Tomorrow, Oct 15, 2026</option>
                  <option value="Friday, Oct 16">Friday, Oct 16, 2026</option>
                  <option value="Saturday, Oct 17">Saturday, Oct 17, 2026</option>
                  <option value="Sunday, Oct 18">Sunday, Oct 18, 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="19:00">07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Client Notes / Allergies / Preparation
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sensitive scalp, requested ammonia-free dye, complimentary iced tea on arrival..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Column (4 cols on lg - Sticky Card) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Booking Summary
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Live Breakdown</h3>
            </div>

            {/* Client Snapshot */}
            <div className="rounded-xl bg-slate-50 p-3 flex items-center gap-3">
              <img
                src={currentCustomer?.avatar}
                alt={currentCustomer?.name}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {currentCustomer?.name}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  Stylist: {currentStylist?.name}
                </span>
              </div>
            </div>

            {/* Slot & Time */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-semibold text-slate-900">{date}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Time Slot:</span>
                <span className="font-semibold text-slate-900">{timeSlotFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Duration:</span>
                <span className="font-bold text-slate-900">{totalDuration} Minutes</span>
              </div>
            </div>

            {/* Selected Services Itemized */}
            <div className="space-y-2.5 border-b border-slate-100 pb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Itemized Services ({selectedServiceObjects.length})
              </span>
              {selectedServiceObjects.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="font-bold text-slate-900">PKR {s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Total Charges Banner */}
            <div className="rounded-xl bg-slate-900 p-4 text-white space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Total Charges</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-slate-400">PKR</span>
                <span className="text-2xl font-bold tracking-tight text-white">
                  {totalBill.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Payment Collection Option
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Full', label: '100% Full' },
                  { id: 'Partial', label: '50% Deposit' },
                  { id: 'Checkout', label: 'At Salon' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentOption(opt.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                      paymentOption === opt.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Final Action Button */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Confirm & Book Appointment
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
