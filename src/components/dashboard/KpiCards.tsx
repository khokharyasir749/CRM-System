"use client";

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  CalendarCheck2,
  AlertCircle,
  Users2,
} from 'lucide-react';

interface KpiCardsProps {
  stats?: {
    totalRevenue: number;
    totalAppointments: number;
    outstandingBalances: number;
    activeCustomers: number;
  };
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  stats = {
    totalRevenue: 485000,
    totalAppointments: 342,
    outstandingBalances: 38500,
    activeCustomers: 1280,
  },
}) => {
  const cards = [
    {
      title: 'Total Revenue (MTD)',
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      trend: '+8.4%',
      isPositive: true,
      subtext: 'vs last month',
      icon: CreditCard,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Total Appointments',
      value: `${stats.totalAppointments.toLocaleString()}`,
      trend: '+5.2%',
      isPositive: true,
      subtext: '92% completion rate',
      icon: CalendarCheck2,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Outstanding Balances',
      value: `PKR ${stats.outstandingBalances.toLocaleString()}`,
      trend: '-3.1%',
      isPositive: false,
      subtext: '12 customers pending',
      icon: AlertCircle,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
      iconBg: 'bg-rose-500/10 text-rose-600',
    },
    {
      title: 'Total Active Customers',
      value: `${stats.activeCustomers.toLocaleString()}`,
      trend: '+14.2%',
      isPositive: true,
      subtext: '48 new this month',
      icon: Users2,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-indigo-500/10 text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            {/* Top row: Title and Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Value display */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </span>
            </div>

            {/* Bottom row: Trend badge and subtext */}
            <div className="mt-3.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${card.badgeColor}`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
                )}
                {card.trend}
              </span>
              <span className="text-xs text-slate-600 font-normal">
                {card.subtext}
              </span>
            </div>

            {/* Subtle background glow gradient accent */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-slate-100/50 blur-xl group-hover:bg-slate-200/50 transition-colors" />
          </div>
        );
      })}
    </div>
  );
};
