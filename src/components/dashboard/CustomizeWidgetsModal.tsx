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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Sliders className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Customize Dashboard
              </h2>
              <p className="text-xs text-slate-600">
                Show or hide widgets to personalize your salon view
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

        <div className="mt-4 space-y-3">
          {widgetItems.map((item) => {
            const isEnabled = widgets[item.key];
            return (
              <div
                key={item.key}
                onClick={() => onToggleWidget(item.key)}
                className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                  isEnabled
                    ? 'border-slate-300 bg-slate-50/70'
                    : 'border-slate-200 bg-white opacity-60'
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
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
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

        <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
