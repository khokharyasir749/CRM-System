"use client";

import React, { useState } from 'react';
import { X, Sliders, Check, Eye, EyeOff } from 'lucide-react';

interface CustomizeWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: {
    kpiCards: boolean;
    revenueTrends: boolean;
    operationsTeam: boolean;
    appointmentsTable: boolean;
  };
  onToggleWidget: (key: 'kpiCards' | 'revenueTrends' | 'operationsTeam' | 'appointmentsTable') => void;
}

export const CustomizeWidgetsModal: React.FC<CustomizeWidgetsModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
}) => {
  if (!isOpen) return null;

  const widgetItems = [
    {
      key: 'kpiCards' as const,
      name: 'Top KPI Metrics (4 Cards Grid)',
      description: 'Total Revenue, Total Appointments, Outstanding Balances, Active Customers',
    },
    {
      key: 'revenueTrends' as const,
      name: 'Revenue & Booking Trends Chart',
      description: 'Monthly receipts vs staff/product costs with interactive tooltips',
    },
    {
      key: 'operationsTeam' as const,
      name: 'Operations & Team Performance',
      description: 'Service Target Achieved, Staff Workload/KPI, Customer Satisfaction Score',
    },
    {
      key: 'appointmentsTable' as const,
      name: 'Upcoming Appointments & Recent Visits',
      description: 'Real-time bookings table with check-in, search, filter, and action menus',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Subtle backdrop with zero blur */}
      <div
        className="fixed inset-0 bg-slate-900/15 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer from Right */}
      <div className="relative z-10 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Customize Dashboard
              </h2>
              <p className="text-xs text-slate-500">
                Show or hide widgets to personalize your salon view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {widgetItems.map((item) => {
            const isEnabled = widgets[item.key];
            return (
              <div
                key={item.key}
                onClick={() => onToggleWidget(item.key)}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                  isEnabled
                    ? 'border-slate-300 bg-slate-50/80 shadow-xs'
                    : 'border-slate-200 bg-white opacity-60 hover:opacity-80'
                }`}
              >
                <div className="pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {item.name}
                    </span>
                    {isEnabled ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                        Visible
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors ${
                    isEnabled ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-xs text-slate-400">Settings save automatically</p>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
