"use client";

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Lock,
  Scissors,
} from 'lucide-react';
import { RoleMode, StaffMember } from '@/types/crm';

interface ReportsViewProps {
  staffList: StaffMember[];
  roleMode: RoleMode;
  onExport: (format: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  staffList,
  roleMode,
  onExport,
}) => {
  const [dateRange, setDateRange] = useState<'Today' | 'Last 7 Days' | 'This Month' | 'Last Month'>('This Month');

  // If in Staff Mode, financial reports are protected
  if (roleMode === 'staff') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Lock className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Financial Analytics Restricted
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Salon Revenue, Gross Margins, and Business P&L are restricted to Administrator / Owner accounts.
            Stylists may view their personal workstation schedule on the Appointments calendar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Salon Performance Reports</h2>
          <p className="text-xs text-slate-600">
            Executive revenue breakdown, stylist KPIs, and client retention audits
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs">
            {(['Today', 'Last 7 Days', 'This Month', 'Last Month'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`rounded-full px-3 py-1 font-medium transition-all ${
                  dateRange === r
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => onExport('CSV')}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Appointment Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Booking Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">92.4%</p>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Completed:</span>
              <span className="font-bold text-emerald-700">316 Bookings</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Cancelled / Rescheduled:</span>
              <span className="font-bold text-amber-700">18 Bookings</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">No-Show Rate:</span>
              <span className="font-bold text-rose-700">8 Bookings (2.3%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue vs Outstanding */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Collections Summary</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">PKR 485,000</p>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Net Settled Cash/Card:</span>
              <span className="font-bold text-emerald-700">PKR 446,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Unsettled Outstanding:</span>
              <span className="font-bold text-rose-700">PKR 38,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Collection Efficiency:</span>
              <span className="font-bold text-slate-900">92.1%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Customer Retention */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Client Retention</span>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">78.5%</p>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Returning Repeat Clients:</span>
              <span className="font-bold text-purple-700">1,005 Clients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">New First-Time Clients:</span>
              <span className="font-bold text-blue-700">275 Clients</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">VIP Conversion Rate:</span>
              <span className="font-bold text-slate-900">14.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Productivity & Revenue Contribution Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Stylist Productivity & Station Billings</h3>
            <p className="text-xs text-slate-600">Performance rankings based on client appointments and reviews</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            Top Performer: Ayesha Khan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-600 uppercase">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Stylist Specialist</th>
                <th className="py-3.5 px-3">Specialization</th>
                <th className="py-3.5 px-3">Completed Sessions</th>
                <th className="py-3.5 px-3">Total Revenue Generated</th>
                <th className="py-3.5 px-3">Average Client Rating</th>
                <th className="py-3.5 pr-6 text-right">Commission Tier</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {staffList
                .filter((st) => st.role.includes('Stylist') || st.assignedAppointmentsCount > 0)
                .map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-6 pr-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">{st.specialization}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{st.assignedAppointmentsCount}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-700">
                      PKR {st.revenueGenerated.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{st.rating.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-6 text-right font-semibold text-slate-700">
                      Tier 1 (25% Commission)
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
