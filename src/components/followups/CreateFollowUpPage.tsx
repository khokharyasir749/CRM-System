"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  Calendar,
  Clock,
  User,
  Check,
  FileText,
} from 'lucide-react';
import { Customer, FollowUpTask, StaffMember } from '@/types/crm';

interface CreateFollowUpPageProps {
  onBack: () => void;
  customers: Customer[];
  staffList: StaffMember[];
  onAddFollowUp: (task: FollowUpTask) => void;
  preselectedCustomerId?: string | null;
}

export const CreateFollowUpPage: React.FC<CreateFollowUpPageProps> = ({
  onBack,
  customers,
  staffList,
  onAddFollowUp,
  preselectedCustomerId,
}) => {
  const [customerId, setCustomerId] = useState(preselectedCustomerId || customers[0]?.id || '');
  const [reason, setReason] = useState('Post-treatment 48h Care & Retention Check-in');
  const [type, setType] = useState<'Post-Treatment Satisfaction' | 'Color Maintenance Reminder' | 'Client Retention Call'>('Post-Treatment Satisfaction');
  const [dueDate, setDueDate] = useState('Tomorrow, Oct 15');
  const [assignedStaff, setAssignedStaff] = useState(staffList[0]?.name || 'Admin User');
  const [notes, setNotes] = useState('');

  const currentCustomer = customers.find((c) => c.id === customerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: FollowUpTask = {
      id: `fol-${Date.now()}`,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      phone: currentCustomer.phone,
      serviceName: 'Salon Treatment',
      scheduledDate: dueDate,
      type,
      reason: reason.trim(),
      status: 'Pending',
      assignedStaffName: assignedStaff,
      notes: notes.trim() || 'Scheduled post-service client care follow-up.',
      isOverdue: false,
    };

    onAddFollowUp(newTask);
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
            title="Back to Follow-ups"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Follow-ups</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Schedule Care Task</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Schedule Client Retention Follow-up
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
            <span>Create Care Task</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Task Information</h2>
                <p className="text-xs text-slate-400">Set check-in reason, scheduled date, and assigned concierge</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Client *
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
                    Follow-up Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  >
                    <option value="Post-Treatment Satisfaction">Post-Treatment Satisfaction</option>
                    <option value="Color Maintenance Reminder">Color Maintenance Reminder</option>
                    <option value="Client Retention Call">Client Retention Call</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Scheduled Due Date
                  </label>
                  <select
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  >
                    <option value="Today, Oct 14">Today, Oct 14</option>
                    <option value="Tomorrow, Oct 15">Tomorrow, Oct 15</option>
                    <option value="Friday, Oct 16">Friday, Oct 16</option>
                    <option value="Saturday, Oct 17">Saturday, Oct 17</option>
                    <option value="Next Week, Oct 21">Next Week, Oct 21</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assigned Staff Lead
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
                  Check-in Goal / Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Guidance Notes for Staff
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ask how the keratin finish feels after 48h, check if sulfate-free conditioner was used..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Client Snapshot
            </h3>

            {currentCustomer && (
              <div className="flex items-center gap-3">
                <img
                  src={currentCustomer.avatar}
                  alt={currentCustomer.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-white"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{currentCustomer.name}</span>
                  <span className="text-[11px] text-slate-400 block">{currentCustomer.phone}</span>
                </div>
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
