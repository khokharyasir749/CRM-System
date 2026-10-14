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
  Copy,
  Check,
  Eye,
  Filter,
} from 'lucide-react';
import { Appointment, BookingStatus, Customer, Stylist } from '@/types/crm';
import { availableServices, stylistsList } from '@/data/salonData';

interface AppointmentsViewProps {
  appointments: Appointment[];
  customers: Customer[];
  onOpenNewAppointment: () => void;
  onViewAppointmentDetails: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, newStatus: BookingStatus) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  customers,
  onOpenNewAppointment,
  onViewAppointmentDetails,
  onUpdateStatus,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [calendarScope, setCalendarScope] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentDateLabel, setCurrentDateLabel] = useState('Wednesday, Oct 14, 2026');
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
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Left: View Mode Toggle & Date Navigator */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Calendar vs List Mode */}
          <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
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
              onClick={() => setCurrentDateLabel('Tuesday, Oct 13, 2026')}
              className="rounded-full p-1 text-slate-600 hover:bg-slate-200/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-900">
              {currentDateLabel}
            </span>
            <button
              onClick={() => setCurrentDateLabel('Thursday, Oct 15, 2026')}
              className="rounded-full p-1 text-slate-600 hover:bg-slate-200/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day / Week / Month switcher */}
          <div className="hidden sm:flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs">
            {(['Day', 'Week', 'Month'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => setCalendarScope(scope)}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  calendarScope === scope
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Staff & Status Filters + Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Staff Filter */}
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
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
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-900">
                Salon Chair Schedule • Today&apos;s Grid
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
              // Find appointments starting around this slot
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
                      <div className="text-[11px] text-slate-300 italic pl-2">
                        Available Station Slot
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
                                <span className="text-[10px] text-slate-600">
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
                            <div>
                              <p className="font-semibold text-slate-900">{app.customer.name}</p>
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
