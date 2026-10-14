"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  User,
  ShieldAlert,
  Sparkles,
  Check,
  FileText,
} from 'lucide-react';
import { ComplaintCategory, ComplaintPriority, ComplaintTicket, Customer, StaffMember } from '@/types/crm';

interface LogComplaintPageProps {
  onBack: () => void;
  customers: Customer[];
  staffList: StaffMember[];
  onAddComplaint: (ticket: ComplaintTicket) => void;
  preselectedCustomerId?: string | null;
}

export const LogComplaintPage: React.FC<LogComplaintPageProps> = ({
  onBack,
  customers,
  staffList,
  onAddComplaint,
  preselectedCustomerId,
}) => {
  const [customerId, setCustomerId] = useState(preselectedCustomerId || customers[0]?.id || '');
  const [category, setCategory] = useState<ComplaintCategory>('Service Quality');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [issue, setIssue] = useState('');
  const [assignedStaff, setAssignedStaff] = useState(staffList[0]?.name || 'Admin User');
  const [serviceName, setServiceName] = useState('Hair & Styling Consultation');

  const currentCustomer = customers.find((c) => c.id === customerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    const ticket: ComplaintTicket = {
      id: `comp-${Date.now()}`,
      ticketCode: `#CMP-${Math.floor(100 + Math.random() * 900)}`,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      serviceName,
      category,
      issue: issue.trim(),
      priority,
      status: 'Open',
      assignedStaffName: assignedStaff,
      createdAt: 'Today, Just Now',
    };

    onAddComplaint(ticket);
    onBack();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Back to Complaints"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Complaints</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Log Complaint Ticket</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Customer Complaint & Incident Report
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Form Cards */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Incident Details</h2>
                <p className="text-xs text-slate-400">Specify client issue, category, and affected service</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Client Involved *
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Service Encountered
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Complaint Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  >
                    <option value="Service Quality">Service Quality</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Hygiene & Cleanliness">Hygiene & Cleanliness</option>
                    <option value="Waiting Time">Waiting Time</option>
                    <option value="Billing & Pricing">Billing & Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assign Staff Lead
                  </label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Incident Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe client concerns, stylist involved, workstation conditions, or corrective action requested..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Priority & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Severity Level
            </h3>

            <div className="space-y-2">
              {(['Urgent', 'High', 'Medium', 'Low'] as const).map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => setPriority(lvl)}
                  className={`p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                    priority === lvl
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lvl} Priority
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Log Ticket to Board
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
