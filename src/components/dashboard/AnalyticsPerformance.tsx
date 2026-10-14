"use client";

import React, { useState } from 'react';
import {
  ChevronDown,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  Package,
  Users,
  ThumbsUp,
} from 'lucide-react';

export type TimeframeOption = 'This Month' | 'Last 6 Months' | 'This Year';

export const AnalyticsPerformance: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('This Month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Timeframe-specific metrics and month highlight predicate
  const timeframeMetrics: Record<
    TimeframeOption,
    {
      revenue: string;
      revenueTrend: string;
      expenses: string;
      expensesTrend: string;
      isMonthActive: (month: string, index: number) => boolean;
    }
  > = {
    'This Month': {
      revenue: 'PKR 485,000',
      revenueTrend: '3.4%',
      expenses: 'PKR 168,000',
      expensesTrend: '1.2%',
      // Highlight: Only the active current month (Oct, index 9)
      isMonthActive: (_month, index) => index === 9,
    },
    'Last 6 Months': {
      revenue: 'PKR 2,840,000',
      revenueTrend: '8.1%',
      expenses: 'PKR 980,000',
      expensesTrend: '4.5%',
      // Highlight: Last 6 months (May, Jun, Jul, Aug, Sep, Oct - indices 4 to 9)
      isMonthActive: (_month, index) => index >= 4 && index <= 9,
    },
    'This Year': {
      revenue: 'PKR 5,420,000',
      revenueTrend: '14.2%',
      expenses: 'PKR 1,890,000',
      expensesTrend: '6.8%',
      // Highlight: All 12 months render in full vibrant colors
      isMonthActive: () => true,
    },
  };

  const currentMetrics = timeframeMetrics[selectedTimeframe];

  // 12 Months data matching Cemdash reference
  const baseChartData = [
    { month: 'Jan', revenue: 1400, expenses: 1100 },
    { month: 'Feb', revenue: 1800, expenses: 1400 },
    { month: 'Mar', revenue: 2100, expenses: 1600 },
    { month: 'Apr', revenue: 2400, expenses: 1900 },
    { month: 'May', revenue: 2900, expenses: 2200 },
    { month: 'Jun', revenue: 3500, expenses: 2600 },
    { month: 'Jul', revenue: 3200, expenses: 2500 },
    { month: 'Aug', revenue: 2200, expenses: 1800 },
    { month: 'Sep', revenue: 2600, expenses: 2100 },
    { month: 'Oct', revenue: 3800, expenses: 3100 },
    { month: 'Nov', revenue: 2500, expenses: 1900 },
    { month: 'Dec', revenue: 2800, expenses: 2200 },
  ];

  const maxVal = 4200;
  const chartHeight = 170;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Card: Revenue and Expenses (8 cols on lg) */}
      <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div>
          {/* Top Row: Title on Left, Dropdown Pill + More Menu Pinned to Top Right */}
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-[15px] font-bold text-slate-900">
              Revenue and Expenses
            </h3>

            <div className="flex items-center gap-2">
              {/* Timeframe dropdown pill */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>{selectedTimeframe}</span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                      {(['This Month', 'Last 6 Months', 'This Year'] as TimeframeOption[]).map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedTimeframe(range);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            selectedTimeframe === range
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Metric summary strip: Dynamic Revenue and Expenses side-by-side */}
          <div className="mt-2 flex flex-wrap items-center gap-8 sm:gap-12 border-b border-slate-100 pb-5">
            {/* Revenue */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#D946EF]" />
                <span className="text-xs font-semibold text-slate-600">Revenue</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 transition-all duration-300">
                  {currentMetrics.revenue}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                  {currentMetrics.revenueTrend}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                Than last period
              </span>
            </div>

            {/* Expenses */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                <span className="text-xs font-semibold text-slate-600">Expenses</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 transition-all duration-300">
                  {currentMetrics.expenses}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                  {currentMetrics.expensesTrend}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                Than last period
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-6 flex">
            {/* Y-axis Ticks */}
            <div className="flex flex-col justify-between pr-3 text-[11px] font-semibold text-slate-400 h-44 text-right select-none">
              <span>PKR 400K</span>
              <span>PKR 300K</span>
              <span>PKR 200K</span>
              <span>PKR 100K</span>
              <span>0</span>
            </div>

            {/* Bars Area */}
            <div className="flex-1">
              <div className="flex items-end justify-between gap-1 sm:gap-2 h-44 border-b border-slate-100 pb-1">
                {baseChartData.map((d, index) => {
                  const isActive = currentMetrics.isMonthActive(d.month, index);
                  const revHeight = (d.revenue / maxVal) * chartHeight;
                  const expHeight = (d.expenses / maxVal) * chartHeight;

                  return (
                    <div
                      key={d.month}
                      className="group flex flex-1 flex-col items-center justify-end h-full"
                    >
                      {/* Dual Bars */}
                      <div className="flex items-end gap-1 w-full justify-center max-w-[28px]">
                        {/* Revenue Bar */}
                        <div
                          style={{ height: `${revHeight}px` }}
                          className={`w-2.5 sm:w-3 rounded-t-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-[#D946EF] shadow-xs opacity-100'
                              : 'bg-[#FCE7F3] opacity-65 group-hover:opacity-100 group-hover:bg-[#F472B6]'
                          }`}
                        />
                        {/* Expenses Bar */}
                        <div
                          style={{ height: `${expHeight}px` }}
                          className={`w-2.5 sm:w-3 rounded-t-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-[#0284C7] shadow-xs opacity-100'
                              : 'bg-[#E0F2FE] opacity-65 group-hover:opacity-100 group-hover:bg-[#38BDF8]'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis Month Labels */}
              <div className="flex items-center justify-between pt-2">
                {baseChartData.map((d, index) => {
                  const isActive = currentMetrics.isMonthActive(d.month, index);
                  return (
                    <span
                      key={d.month}
                      className={`text-[11px] transition-colors duration-300 flex-1 text-center select-none ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'
                      }`}
                    >
                      {d.month}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Performance (4 cols on lg) */}
      <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-[15px] font-bold text-slate-900">
              Performance
            </h3>
            <button className="text-slate-400 hover:text-slate-700">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-6">
            {/* Item 1: Product Sales (Service Target) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900">
                  Service Bookings
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">
                  Sales target achieved!
                </span>
                <span className="text-sm font-bold text-slate-900">82%</span>
              </div>
              {/* Green Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#10B981] transition-all duration-500"
                  style={{ width: '82%' }}
                />
              </div>
            </div>

            {/* Item 2: Team KPI */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900">
                  Team KPI
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">
                  KPI target achieved!
                </span>
                <span className="text-sm font-bold text-slate-900">74%</span>
              </div>
              {/* Pink / Fuchsia Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#D946EF] transition-all duration-500"
                  style={{ width: '74%' }}
                />
              </div>
            </div>

            {/* Item 3: Customer Satisfaction */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-900">
                  Customer Satisfaction
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">
                  Customers are very satisfied!
                </span>
                <span className="text-sm font-bold text-slate-900">96%</span>
              </div>
              {/* Electric Blue Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#0284C7] transition-all duration-500"
                  style={{ width: '96%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Target Period: Oct 2026</span>
          <span className="font-bold text-slate-700">4 Stylists Active</span>
        </div>
      </div>
    </div>
  );
};
