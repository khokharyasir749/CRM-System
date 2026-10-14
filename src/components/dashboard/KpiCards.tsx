"use client";

import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
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
    totalRevenue: 416500,
    totalAppointments: 342,
    outstandingBalances: 38500,
    activeCustomers: 1280,
  },
}) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      trend: '8.4%',
      isPositive: true,
      subtext: 'Than last week',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
    {
      title: 'Total Appointments',
      value: `${stats.totalAppointments.toLocaleString()}`,
      trend: '5.2%',
      isPositive: true,
      subtext: 'Than last week',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
    {
      title: 'Outstanding Balances',
      value: `PKR ${stats.outstandingBalances.toLocaleString()}`,
      trend: '2.9%',
      isPositive: false,
      subtext: 'Than last week',
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200/80',
    },
    {
      title: 'Total Active Customers',
      value: `${stats.activeCustomers.toLocaleString()}`,
      trend: '14.2%',
      isPositive: true,
      subtext: 'Than last week',
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, idx) => {
        return (
          <div
            key={idx}
            className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
          >
            {/* Top row: Title and MoreHorizontal menu */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <button className="text-slate-400 hover:text-slate-700 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Value display + Trend pill side-by-side on baseline */}
            <div className="mt-3 flex items-center justify-between gap-2">
              {card.value.startsWith('PKR ') ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-slate-500">PKR</span>
                  <span className="text-[26px] font-bold tracking-tight text-slate-900 leading-none">
                    {card.value.replace('PKR ', '')}
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-[26px] font-bold tracking-tight text-slate-900 leading-none">
                    {card.value}
                  </span>
                </div>
              )}

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border shrink-0 ${card.badgeColor}`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
                )}
                {card.trend}
              </span>
            </div>

            {/* Subtext */}
            <div className="mt-2">
              <span className="text-[11px] font-medium text-slate-400">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
