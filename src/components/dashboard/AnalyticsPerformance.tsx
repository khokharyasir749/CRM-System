"use client";

import React, { useState } from 'react';
import {
  ChevronDown,
  TrendingUp,
  Star,
  Users,
  Award,
  Sparkles,
  Scissors,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { monthlyChartData } from '@/data/salonData';

export const AnalyticsPerformance: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(5); // default to latest month

  // Chart calculation
  const maxRevenue = 550000;
  const chartHeight = 180;

  const currentHovered = hoveredIndex !== null ? monthlyChartData[hoveredIndex] : monthlyChartData[monthlyChartData.length - 1];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Card: Revenue & Booking Trends (7 cols on lg) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Revenue & Booking Trends
                </h3>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                  +18.5% YoY
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Gross salon service receipts vs product & staff cost
              </p>
            </div>

            {/* Timeframe dropdown & Legends */}
            <div className="flex items-center gap-3">
              {/* Legends */}
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <span className="text-slate-600 font-medium">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">Service Cost</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>{timeRange}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl ring-1 ring-black/5 z-20">
                    {['This Month', 'Last 6 Months', 'This Year'].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-1.5 text-xs font-medium ${
                          timeRange === range
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Highlight Banner */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-2.5 border border-slate-100">
            <div>
              <span className="text-[11px] font-medium text-slate-600">Selected Period:</span>
              <span className="ml-1 text-xs font-bold text-slate-900">{currentHovered.month}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-600">Revenue: </span>
                <span className="font-bold text-slate-900">PKR {currentHovered.revenue.toLocaleString()}</span>
              </div>
              <div className="hidden sm:inline-block">
                <span className="text-slate-600">Net Profit: </span>
                <span className="font-bold text-emerald-600">
                  PKR {(currentHovered.revenue - currentHovered.serviceCost).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Bookings: </span>
                <span className="font-bold text-blue-600">{currentHovered.appointments}</span>
              </div>
            </div>
          </div>

          {/* Interactive Modern Bar Chart Visualization */}
          <div className="mt-6 relative">
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-4 pb-2 border-b border-slate-100">
              {monthlyChartData.map((d, index) => {
                const revHeight = (d.revenue / maxRevenue) * chartHeight;
                const costHeight = (d.serviceCost / maxRevenue) * chartHeight;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={d.month}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-10 z-10 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in duration-100">
                        PKR {d.revenue.toLocaleString()}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    )}

                    {/* Dual Bars */}
                    <div className="flex items-end gap-1.5 w-full justify-center max-w-[42px]">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}px` }}
                        className={`w-3.5 sm:w-4.5 rounded-t-md transition-all duration-300 ${
                          isHovered
                            ? 'bg-slate-900 shadow-md ring-2 ring-slate-900/20'
                            : 'bg-slate-800/90 hover:bg-slate-900'
                        }`}
                      />
                      {/* Service Cost Bar */}
                      <div
                        style={{ height: `${costHeight}px` }}
                        className={`w-3 sm:w-3.5 rounded-t-md transition-all duration-300 ${
                          isHovered
                            ? 'bg-blue-500 shadow-sm'
                            : 'bg-blue-400/80 hover:bg-blue-500'
                        }`}
                      />
                    </div>

                    {/* X-axis label */}
                    <span
                      className={`mt-2 text-[11px] font-medium transition-colors ${
                        isHovered ? 'text-slate-900 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Background grid line indicators */}
            <div className="pointer-events-none absolute inset-x-0 top-6 border-b border-dashed border-slate-200/60" />
            <div className="pointer-events-none absolute inset-x-0 top-24 border-b border-dashed border-slate-200/60" />
          </div>
        </div>

        {/* Footer Quick Metrics */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 pt-3 border-t border-slate-100 text-center">
          <div>
            <p className="text-[11px] font-medium text-slate-600">6-Month Total Gross</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900">PKR 2,418,000</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-600">Net Operating Margin</p>
            <p className="text-xs sm:text-sm font-bold text-emerald-600">65.2%</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-600">Avg Ticket Value</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900">PKR 7,070</p>
          </div>
        </div>
      </div>

      {/* Right Card: Operations & Team Performance (5 cols on lg) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Operations & Team Performance
              </h3>
              <p className="text-xs text-slate-600">
                Live capacity tracking & stylist metrics
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Award className="h-4 w-4" />
            </div>
          </div>

          {/* Metric 1: Service Target Achieved */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Scissors className="h-3.5 w-3.5 text-blue-600" />
                <span>Service Target Achieved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">82%</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  On Pace
                </span>
              </div>
            </div>

            {/* Stylized Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              <div
                className="h-full rounded-full bg-linear-to-r from-slate-900 to-blue-600 transition-all duration-500"
                style={{ width: '82%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>PKR 485,000 billed</span>
              <span>Target: PKR 590,000</span>
            </div>
          </div>

          {/* Metric 2: Staff Workload / KPI */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                <span>Staff Workload & KPI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">74%</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                  Optimal
                </span>
              </div>
            </div>

            {/* Stylized Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: '74%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>342 slots utilized</span>
              <span className="font-medium text-slate-700">
                Top: Ayesha K. (98%)
              </span>
            </div>
          </div>

          {/* Metric 3: Customer Satisfaction Score */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Customer Satisfaction Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">96%</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/60">
                  4.9 / 5.0
                </span>
              </div>
            </div>

            {/* Stylized Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-emerald-500 transition-all duration-500"
                style={{ width: '96%' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-3 w-3 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span>218 verified reviews</span>
            </div>
          </div>
        </div>

        {/* Live Salon Status Footnote */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-700">4 Stylists Active on Floor</span>
          </div>
          <span className="text-[11px] text-slate-600">8 stations ready</span>
        </div>
      </div>
    </div>
  );
};
