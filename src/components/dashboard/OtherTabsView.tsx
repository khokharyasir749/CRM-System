"use client";

import React from 'react';
import {
  CalendarDays,
  Users,
  CreditCard,
  AlertCircle,
  PhoneCall,
  MessageSquareQuote,
  UserCog,
  BarChart3,
  Settings,
  Sparkles,
  ArrowLeft,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface OtherTabsViewProps {
  currentTab: string;
  onBackToDashboard: () => void;
}

export const OtherTabsView: React.FC<OtherTabsViewProps> = ({
  currentTab,
  onBackToDashboard,
}) => {
  const tabDetails: Record<
    string,
    { title: string; desc: string; icon: any; note?: string }
  > = {
    appointments: {
      title: 'Full Appointments Calendar & Schedule',
      desc: 'Daily timeline view, stylist bay management, and automated client SMS reminders.',
      icon: CalendarDays,
    },
    customers: {
      title: 'Customer Directory & VIP Loyalty Program',
      desc: '1,280 active salon clients, history of treatments, allergen records, and loyalty reward tiers.',
      icon: Users,
    },
    payments: {
      title: 'Salon Payments & Cash Register',
      desc: 'Card transactions, cash ledger, split billing, stylist commission calculation, and daily reconciliation.',
      icon: CreditCard,
    },
    complaints: {
      title: 'Client Feedback & Quality Resolution',
      desc: 'Service audit tickets, escalation tracking, and satisfaction follow-up workflows.',
      icon: AlertCircle,
    },
    'follow-ups': {
      title: 'Client Retention & Post-Service Follow-ups',
      desc: 'Automated 48-hour post-facial check-ins, color refresh reminders, and feedback surveys.',
      icon: PhoneCall,
    },
    messages: {
      title: 'Messages & Marketing Templates',
      desc: 'WhatsApp & SMS salon campaign manager for festival offers and bridal bookings.',
      icon: MessageSquareQuote,
      note: 'Scope Approval Pending: Integration with Twilio/WhatsApp Business API is slated for Step 2.',
    },
    staff: {
      title: 'Staff Roster & Stylist Performance',
      desc: 'Chair assignments, working shifts, commission percentages, and specialty certifications.',
      icon: UserCog,
    },
    reports: {
      title: 'Salon Financial & Performance Reports',
      desc: 'Comprehensive P&L, service category revenue breakdown, and inventory consumption audits.',
      icon: BarChart3,
    },
    settings: {
      title: 'Salon Configuration & Service Menu',
      desc: 'Service pricing catalog, tax rates, business hours, and multi-branch management.',
      icon: Settings,
    },
  };

  const current = tabDetails[currentTab] || {
    title: 'Salon Module',
    desc: 'Regular CRM module view.',
    icon: Sparkles,
  };

  const Icon = current.icon;

  return (
    <div className="space-y-6">
      {/* Navigation Return Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Main Dashboard</span>
        </button>
      </div>

      {/* Module Overview Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs text-center max-w-2xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
          <Icon className="h-8 w-8 text-amber-300" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          {current.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {current.desc}
        </p>

        {current.note && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-800 flex items-start gap-3 text-left">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pending Scope Approval</p>
              <p className="mt-0.5 text-amber-700">{current.note}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
