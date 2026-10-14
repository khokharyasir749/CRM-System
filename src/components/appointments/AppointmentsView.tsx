"use client";

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ListFilter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Scissors,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  UserCheck,
  CreditCard,
  Eye,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, Stylist } from '@/types/crm';
import { initialCustomers, stylistsList } from '@/data/salonData';

interface AppointmentsViewProps {
  appointments: Appointment[];
  customers: Customer[];
  onOpenNewAppointment: () => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
  onViewCustomer?: (customer: Customer) => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  customers,
  onOpenNewAppointment,
  onViewAppointmentDetails,
  onViewCustomer,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [calendarScope, setCalendarScope] = useState<'day' | 'week' | 'month'>('day');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentDateIndex, setCurrentDateIndex] = useState(1); // 1 = Wednesday Oct 14
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Time slots for Day Calendar view: 09:00 AM to 08:00 PM
  const timeSlots = [
    { label: '09:00 AM', time: '09:00' },
    { label: '10:00 AM', time: '10:00' },
    { label: '11:00 AM', time: '11:00' },
    { label: '12:00 PM', time: '12:00' },
    { label: '01:00 PM', time: '13:00' },
    { label: '02:00 PM', time: '14:00' },
    { label: '03:00 PM', time: '15:00' },
    { label: '04:00 PM', time: '16:00' },
    { label: '05:00 PM', time: '17:00' },
    { label: '06:00 PM', time: '18:00' },
    { label: '07:00 PM', time: '19:00' },
    { label: '08:00 PM', time: '20:00' },
  ];

  // Helper to parse "HH:mm" to minutes
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  // Conflict Detection: check if any appointments share the same staff and have overlapping time
  const conflicts = useMemo(() => {
    const conflictList: { app1: Appointment; app2: Appointment; staffName: string }[] = [];
    for (let i = 0; i < appointments.length; i++) {
      for (let j = i + 1; j < appointments.length; j++) {
        const a1 = appointments[i];
        const a2 = appointments[j];

        if (
          a1.stylist.id === a2.stylist.id &&
          a1.status !== 'Cancelled' &&
          a2.status !== 'Cancelled'
        ) {
          const s1 = timeToMinutes(a1.startTime || '11:00');
          const e1 = timeToMinutes(a1.endTime || '12:30');
          const s2 = timeToMinutes(a2.startTime || '11:30');
          const e2 = timeToMinutes(a2.endTime || '13:00');

          if (s1 < e2 && s2 < e1) {
            conflictList.push({ app1: a1, app2: a2, staffName: a1.stylist.name });
          }
        }
      }
    }
    return conflictList;
  }, [appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchStaff = selectedStaffId === 'all' || app.stylist.id === selectedStaffId;
      const matchStatus = selectedStatus === 'all' || app.status === selectedStatus;
      const matchCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchStaff && matchStatus && matchCategory;
    });
  }, [appointments, selectedStaffId, selectedStatus, selectedCategory]);

  const isConflicting = (appId: string) => {
    return conflicts.some((c) => c.app1.id === appId || c.app2.id === appId);
  };

  // Date Navigation strings
  const dayLabels = [
    'Tuesday, Oct 13, 2026',
    'Wednesday, Oct 14, 2026',
    'Thursday, Oct 15, 2026',
  ];

  const getDateDisplayLabel = () => {
    if (calendarScope === 'day') {
      return dayLabels[currentDateIndex] || 'Wednesday, Oct 14, 2026';
    }
    if (calendarScope === 'week') {
      return 'Week 42 • Oct 12 – Oct 18, 2026';
    }
    return 'October 2026';
  };

  const handlePrevDate = () => {
    if (calendarScope === 'day') {
      setCurrentDateIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextDate = () => {
    if (calendarScope === 'day') {
      setCurrentDateIndex((prev) => Math.min(dayLabels.length - 1, prev + 1));
    }
  };

  // 7-day week schedule definition (Monday Oct 12 to Sunday Oct 18, 2026)
  const weekDays = [
    { dayName: 'Mon', dateNum: 12, label: 'Oct 12', isToday: false },
    { dayName: 'Tue', dateNum: 13, label: 'Oct 13', isToday: false },
    { dayName: 'Wed', dateNum: 14, label: 'Oct 14', isToday: true },
    { dayName: 'Thu', dateNum: 15, label: 'Oct 15', isToday: false },
    { dayName: 'Fri', dateNum: 16, label: 'Oct 16', isToday: false },
    { dayName: 'Sat', dateNum: 17, label: 'Oct 17', isToday: false },
    { dayName: 'Sun', dateNum: 18, label: 'Oct 18', isToday: false },
  ];

  // Distribute appointments across the week for realistic multi-column scheduling
  const weekScheduleMap = useMemo(() => {
    const map: Record<number, Appointment[]> = {
      12: [
        {
          id: 'app-w-1',
          bookingCode: '#BK-1038',
          customer: initialCustomers[6] || initialCustomers[0],
          service: 'Luxury Blowdry & Hair Polish',
          category: 'Hair & Styling',
          stylist: stylistsList[2],
          date: 'Mon, Oct 12',
          timeSlot: '02:00 PM - 03:00 PM',
          startTime: '14:00',
          endTime: '15:00',
          amount: 6500,
          paidAmount: 6500,
          paymentStatus: 'Paid',
          status: 'Completed',
          durationMinutes: 60,
        },
      ],
      13: [
        {
          id: 'app-w-2',
          bookingCode: '#BK-1040',
          customer: initialCustomers[4] || initialCustomers[0],
          service: 'Hydra Skin Booster & Consultation',
          category: 'Facial & Skin',
          stylist: stylistsList[1],
          date: 'Tue, Oct 13',
          timeSlot: '04:00 PM - 05:15 PM',
          startTime: '16:00',
          endTime: '17:15',
          amount: 14000,
          paidAmount: 14000,
          paymentStatus: 'Paid',
          status: 'Completed',
          durationMinutes: 75,
        },
      ],
      14: filteredAppointments, // Today's dynamic appointments
      15: [
        {
          id: 'app-w-3',
          bookingCode: '#BK-1050',
          customer: initialCustomers[3] || initialCustomers[0],
          service: 'Gel Extensions Refill & Nail Art',
          category: 'Nails & Spa',
          stylist: stylistsList[3],
          date: 'Thu, Oct 15',
          timeSlot: '11:30 AM - 01:00 PM',
          startTime: '11:30',
          endTime: '13:00',
          amount: 8500,
          paidAmount: 0,
          paymentStatus: 'Unpaid',
          status: 'Confirmed',
          durationMinutes: 90,
        },
        {
          id: 'app-w-4',
          bookingCode: '#BK-1051',
          customer: initialCustomers[1] || initialCustomers[0],
          service: 'Bridal Henna & Organic Polish',
          category: 'Bridal',
          stylist: stylistsList[0],
          date: 'Thu, Oct 15',
          timeSlot: '03:00 PM - 05:00 PM',
          startTime: '15:00',
          endTime: '17:00',
          amount: 18000,
          paidAmount: 18000,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          durationMinutes: 120,
        },
      ],
      16: [
        {
          id: 'app-w-5',
          bookingCode: '#BK-1052',
          customer: initialCustomers[2] || initialCustomers[0],
          service: 'Keratin Smoothing Touch-up',
          category: 'Hair & Styling',
          stylist: stylistsList[2],
          date: 'Fri, Oct 16',
          timeSlot: '01:00 PM - 03:00 PM',
          startTime: '13:00',
          endTime: '15:00',
          amount: 16000,
          paidAmount: 8000,
          paymentStatus: 'Partial',
          status: 'Confirmed',
          durationMinutes: 120,
        },
      ],
      17: [
        {
          id: 'app-w-6',
          bookingCode: '#BK-1053',
          customer: initialCustomers[0],
          service: 'Signature Deluxe Bridal Makeup',
          category: 'Bridal',
          stylist: stylistsList[0],
          date: 'Sat, Oct 17',
          timeSlot: '12:00 PM - 03:30 PM',
          startTime: '12:00',
          endTime: '15:30',
          amount: 45000,
          paidAmount: 45000,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          durationMinutes: 210,
        },
        {
          id: 'app-w-7',
          bookingCode: '#BK-1054',
          customer: initialCustomers[5] || initialCustomers[0],
          service: 'Oxy-Hydra Glow Facial',
          category: 'Facial & Skin',
          stylist: stylistsList[1],
          date: 'Sat, Oct 17',
          timeSlot: '04:00 PM - 05:00 PM',
          startTime: '16:00',
          endTime: '17:00',
          amount: 12000,
          paidAmount: 0,
          paymentStatus: 'Unpaid',
          status: 'Pending Payment',
          durationMinutes: 60,
        },
      ],
      18: [
        {
          id: 'app-w-8',
          bookingCode: '#BK-1055',
          customer: initialCustomers[4] || initialCustomers[0],
          service: 'Aromatherapy Hair Spa & Scalp Detox',
          category: 'Hair & Styling',
          stylist: stylistsList[2],
          date: 'Sun, Oct 18',
          timeSlot: '02:00 PM - 03:30 PM',
          startTime: '14:00',
          endTime: '15:30',
          amount: 9500,
          paidAmount: 9500,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          durationMinutes: 90,
        },
      ],
    };
    return map;
  }, [filteredAppointments]);

  // Month days builder (October 2026: 1 to 31, starting on Thursday, so 3 leading days from Sep)
  const monthDays = useMemo(() => {
    const days: { dayNumber: number; isCurrentMonth: boolean; isToday: boolean; count: number }[] = [];
    // Sep 28, 29, 30
    days.push({ dayNumber: 28, isCurrentMonth: false, isToday: false, count: 0 });
    days.push({ dayNumber: 29, isCurrentMonth: false, isToday: false, count: 0 });
    days.push({ dayNumber: 30, isCurrentMonth: false, isToday: false, count: 1 });

    // Oct 1 to Oct 31
    for (let d = 1; d <= 31; d++) {
      let count = 0;
      if (d === 14) count = filteredAppointments.length;
      else if (d === 12 || d === 13 || d === 16 || d === 18) count = 1;
      else if (d === 15 || d === 17) count = 2;
      else if (d === 3 || d === 7 || d === 10 || d === 21 || d === 24 || d === 28) count = Math.floor((d % 3) + 1);

      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        isToday: d === 14,
        count,
      });
    }

    // Nov 1
    days.push({ dayNumber: 1, isCurrentMonth: false, isToday: false, count: 0 });

    return days;
  }, [filteredAppointments]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Schedule Conflict Alert Banner */}
      {conflicts.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50/90 p-4 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                ⚠️ Schedule Conflict: Staff Double-Booked
              </h4>
              <p className="text-[11px] text-amber-800">
                {conflicts[0].staffName} is assigned to overlapping appointments (
                {conflicts[0].app1.bookingCode} & {conflicts[0].app2.bookingCode}). Reassign a stylist or reschedule.
              </p>
            </div>
          </div>
          <button
            onClick={() => onViewAppointmentDetails(conflicts[0].app2)}
            className="rounded-full bg-amber-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors"
          >
            Review Conflict
          </button>
        </div>
      )}

      {/* Top Controls & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        {/* Left Side: View Toggle + Date Navigator + Day/Week/Month Tabs + Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Calendar vs List Mode */}
          <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Table List</span>
            </button>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-2 py-1">
            <button
              onClick={handlePrevDate}
              className="rounded-full p-1 text-slate-600 hover:bg-slate-200/80 transition-colors"
              title="Previous Date"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-900 min-w-[140px] text-center">
              {getDateDisplayLabel()}
            </span>
            <button
              onClick={handleNextDate}
              className="rounded-full p-1 text-slate-600 hover:bg-slate-200/80 transition-colors"
              title="Next Date"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day / Week / Month Pill Tabs - Visible in Calendar Mode */}
          {viewMode === 'calendar' && (
            <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs">
              {(['day', 'week', 'month'] as const).map((scope) => {
                const isActive = calendarScope === scope;
                return (
                  <button
                    key={scope}
                    onClick={() => setCalendarScope(scope)}
                    className={`rounded-full px-3 py-1 text-xs capitalize transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    {scope}
                  </button>
                );
              })}
            </div>
          )}

          {/* Stylist Filter */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-white focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Stylists ({stylistsList.length})</option>
            {stylistsList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.specialty})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-white focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Far Right: + New Appointment Button */}
        <div className="ml-auto shrink-0">
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {/* Subview 1A: DAY VIEW */}
          {calendarScope === 'day' && (
            <div>
              {/* Day Calendar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Salon Chair Schedule • Today&apos;s Grid (09:00 AM – 08:00 PM)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Checked-in
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    Confirmed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Conflict / Pending
                  </span>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="divide-y divide-slate-100">
                {timeSlots.map((slot) => {
                  const slotHour = parseInt(slot.time.split(':')[0], 10);
                  const matchingApps = filteredAppointments.filter((app) => {
                    const appHour = parseInt((app.startTime || '11:00').split(':')[0], 10);
                    return appHour === slotHour;
                  });

                  return (
                    <div key={slot.time} className="flex min-h-[90px] group hover:bg-slate-50/40">
                      {/* Left Time label */}
                      <div className="w-24 sm:w-28 shrink-0 border-r border-slate-100 p-3 text-right">
                        <span className="text-xs font-semibold text-slate-600">{slot.label}</span>
                      </div>

                      {/* Right Appointment Slots container */}
                      <div className="flex-1 p-2 flex flex-wrap gap-2.5 items-center">
                        {matchingApps.length === 0 ? (
                          <div
                            onClick={onOpenNewAppointment}
                            className="text-[11px] text-slate-300 italic pl-2 hover:text-slate-600 cursor-pointer transition-colors"
                          >
                            + Available Station Slot
                          </div>
                        ) : (
                          matchingApps.map((app) => {
                            const conflict = isConflicting(app.id);

                            return (
                              <div
                                key={app.id}
                                onClick={() => onViewAppointmentDetails(app)}
                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border p-3 cursor-pointer transition-all duration-150 max-w-md flex-1 ${
                                  conflict
                                    ? 'border-amber-300 bg-amber-50/90 shadow-sm ring-1 ring-amber-300'
                                    : app.status === 'Checked-in'
                                    ? 'border-blue-200 bg-blue-50/60 hover:bg-blue-50'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={app.stylist.avatar}
                                    alt={app.stylist.name}
                                    className="h-8 w-8 rounded-full object-cover ring-1 ring-white"
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900">
                                        {app.customer.name}
                                      </span>
                                      {conflict && (
                                        <span className="rounded-full bg-amber-200 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">
                                          Conflict
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium">
                                      {app.service}
                                    </p>
                                    <span className="text-[10px] text-slate-500">
                                      Stylist: {app.stylist.name} • {app.timeSlot}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1">
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                      app.status === 'Checked-in'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900">
                                    PKR {app.amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subview 1B: WEEK VIEW (Multi-column 7-Day Grid) */}
          {calendarScope === 'week' && (
            <div>
              {/* Week Calendar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Weekly Schedule Grid • Oct 12 – Oct 18, 2026 (Mon – Sun)
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Showing 7 salon service days
                </div>
              </div>

              {/* 7-Column Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-[580px]">
                {weekDays.map((day) => {
                  const dayApps = weekScheduleMap[day.dateNum] || [];

                  return (
                    <div
                      key={day.dayName}
                      className={`flex flex-col p-3 transition-colors ${
                        day.isToday ? 'bg-slate-50/70' : 'bg-white'
                      }`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {day.dayName}
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {day.label}
                          </p>
                        </div>
                        {day.isToday && (
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white tracking-wide">
                            Today
                          </span>
                        )}
                      </div>

                      {/* Day Appointments List */}
                      <div className="flex-1 space-y-2.5 overflow-y-auto">
                        {dayApps.length === 0 ? (
                          <div className="py-8 text-center text-[11px] text-slate-300 italic">
                            No bookings
                          </div>
                        ) : (
                          dayApps.map((app) => (
                            <div
                              key={app.id}
                              onClick={() => onViewAppointmentDetails(app)}
                              className="group rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer text-left"
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-900">
                                  {app.timeSlot.split('-')[0].trim()}
                                </span>
                                <span
                                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${
                                    app.status === 'Checked-in'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {app.customer.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {app.service}
                              </p>
                              <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
                                <span className="text-slate-400 truncate">
                                  {app.stylist.name.split(' ')[0]}
                                </span>
                                <span className="font-bold text-slate-900">
                                  PKR {app.amount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Quick Add Slot */}
                      <button
                        type="button"
                        onClick={onOpenNewAppointment}
                        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 py-1.5 text-[11px] font-semibold text-slate-400 hover:border-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Book Slot</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subview 1C: MONTH VIEW (Full Monthly Calendar Overview Grid) */}
          {calendarScope === 'month' && (
            <div>
              {/* Month Calendar Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Monthly Salon Overview • October 2026
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  31 Days • {filteredAppointments.length} Active Bookings Today
                </div>
              </div>

              {/* 7 Days of Week Header */}
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/40 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* 35 Calendar Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                {monthDays.map((cell, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cell.isToday) setCalendarScope('day');
                      else onOpenNewAppointment();
                    }}
                    className={`min-h-[96px] p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                      !cell.isCurrentMonth
                        ? 'bg-slate-50/30 text-slate-300'
                        : cell.isToday
                        ? 'bg-blue-50/30'
                        : 'bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Top Row: Date number & Today Pill */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ${
                          cell.isToday
                            ? 'bg-slate-900 text-white font-bold'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                      {cell.count > 0 && (
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                          {cell.count} appts
                        </span>
                      )}
                    </div>

                    {/* Bottom: Mini appointment chips */}
                    <div className="mt-1 space-y-1">
                      {cell.isToday ? (
                        <>
                          <div className="rounded-md bg-blue-100/80 px-1.5 py-0.5 text-[9px] font-semibold text-blue-900 truncate">
                            11:00 Mahnoor F.
                          </div>
                          <div className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-800 truncate">
                            12:00 Zoya A.
                          </div>
                          {filteredAppointments.length > 2 && (
                            <div className="text-[9px] font-bold text-slate-400 pl-1">
                              +{filteredAppointments.length - 2} more
                            </div>
                          )}
                        </>
                      ) : cell.count > 0 ? (
                        <div className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700 truncate">
                          {cell.count} Booked
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TABLE LIST VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Booking ID</th>
                  <th className="py-3.5 px-3">Date & Time Slot</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Service Details</th>
                  <th className="py-3.5 px-3">Duration</th>
                  <th className="py-3.5 px-3">Assigned Staff</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Payment</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-slate-600">
                      No salon appointments match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const isMenuOpen = openMenuId === app.id;
                    const conflict = isConflicting(app.id);

                    return (
                      <tr
                        key={app.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          conflict ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 pl-6 pr-3 font-semibold text-slate-900">
                          {app.bookingCode}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{app.date}</span>
                            <span className="text-[11px] text-slate-600">{app.timeSlot}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={app.customer.avatar}
                              alt={app.customer.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                            <div
                              onClick={() => onViewCustomer && onViewCustomer(app.customer)}
                              className={onViewCustomer ? 'cursor-pointer group' : ''}
                            >
                              <p className={`font-semibold text-slate-900 ${onViewCustomer ? 'group-hover:text-blue-600' : ''}`}>
                                {app.customer.name}
                              </p>
                              <p className="text-[10px] text-slate-600">{app.customer.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-slate-800">{app.service}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-slate-600 font-medium">
                            {app.durationMinutes} mins
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-800">{app.stylist.name}</span>
                            {conflict && (
                              <span
                                title="Staff double-booked"
                                className="rounded-full bg-amber-200 px-1.5 py-0.2 text-[9px] font-bold text-amber-900"
                              >
                                Conflict
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              app.status === 'Checked-in'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">
                              PKR {app.amount.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${
                                app.paymentStatus === 'Paid'
                                  ? 'text-emerald-600'
                                  : app.paymentStatus === 'Partial'
                                  ? 'text-amber-600'
                                  : 'text-rose-600'
                              }`}
                            >
                              {app.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-6 text-right relative">
                          <button
                            onClick={() => setOpenMenuId(isMenuOpen ? null : app.id)}
                            className="rounded-full p-1.5 text-slate-600 hover:bg-slate-200/80"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-6 top-10 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100 text-left">
                                <button
                                  onClick={() => {
                                    onViewAppointmentDetails(app);
                                    setOpenMenuId(null);
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
                                      setOpenMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                  >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Mark Checked-in
                                  </button>
                                )}
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
        </div>
      )}
    </div>
  );
};
