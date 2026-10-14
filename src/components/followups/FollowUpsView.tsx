"use client";

import React, { useState, useMemo } from 'react';
import {
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  MessageCircle,
  X,
  User,
  ArrowRight,
} from 'lucide-react';
import { Customer, FollowUpStatus, FollowUpTask, StaffMember } from '@/types/crm';

interface FollowUpsViewProps {
  followUps: FollowUpTask[];
  customers: Customer[];
  staffList: StaffMember[];
  onAddFollowUp: (task: FollowUpTask) => void;
  onUpdateStatus: (id: string, newStatus: FollowUpStatus) => void;
  onOpenCustomerProfile: (customer: Customer) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  followUps,
  customers,
  staffList,
  onAddFollowUp,
  onUpdateStatus,
  onOpenCustomerProfile,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Due Today' | 'Overdue' | 'Upcoming' | 'Completed'>('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [reason, setReason] = useState('Post-treatment 48h Check-in');
  const [dueDate, setDueDate] = useState('Tomorrow, Oct 15');
  const [assignedStaff, setAssignedStaff] = useState(staffList[0]?.name || 'Admin User');
  const [notes, setNotes] = useState('');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return followUps.filter((task) => {
      const matchStaff = staffFilter === 'All' || task.assignedStaffName === staffFilter;

      let matchFilter = true;
      if (selectedFilter === 'Overdue') {
        matchFilter = Boolean(task.isOverdue) && task.status !== 'Completed';
      } else if (selectedFilter === 'Due Today') {
        matchFilter = task.scheduledDate.toLowerCase().includes('today');
      } else if (selectedFilter === 'Upcoming') {
        matchFilter = !task.isOverdue && task.status !== 'Completed';
      } else if (selectedFilter === 'Completed') {
        matchFilter = task.status === 'Completed';
      }

      const q = searchQuery.toLowerCase();
      const matchSearch =
        task.customerName.toLowerCase().includes(q) ||
        task.phone.includes(q) ||
        task.reason.toLowerCase().includes(q) ||
        task.notes.toLowerCase().includes(q);

      return matchStaff && matchFilter && matchSearch;
    });
  }, [followUps, selectedFilter, staffFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      All: followUps.length,
      'Due Today': followUps.filter((t) => t.scheduledDate.toLowerCase().includes('today')).length,
      Overdue: followUps.filter((t) => t.isOverdue && t.status !== 'Completed').length,
      Upcoming: followUps.filter((t) => !t.isOverdue && t.status !== 'Completed').length,
      Completed: followUps.filter((t) => t.status === 'Completed').length,
    };
  }, [followUps]);

  const handleWhatsApp = (phone: string, name: string, taskReason: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hi ${name}, this is Regular CRM Salon following up regarding your ${taskReason}. How is your experience so far?`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId) || customers[0];

    const newTask: FollowUpTask = {
      id: `fol-${Date.now()}`,
      customerId: cust.id,
      customerName: cust.name,
      phone: cust.phone,
      serviceName: 'Salon Treatment',
      scheduledDate: dueDate,
      type: 'Client Retention Call',
      reason: reason.trim(),
      status: 'Pending',
      assignedStaffName: assignedStaff,
      notes: notes.trim() || 'Scheduled post-service client care follow-up.',
      isOverdue: false,
    };

    onAddFollowUp(newTask);
    setIsCreateModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Alert if Overdue items exist */}
      {counts.Overdue > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-200/80 text-rose-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Action Required: {counts.Overdue} Overdue Follow-up Tasks
              </h4>
              <p className="text-[11px] text-rose-700">
                Post-service client satisfaction calls are past due. Reach out via WhatsApp or call to ensure high retention.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFilter('Overdue')}
            className="rounded-full bg-rose-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-800"
          >
            View Overdue Tasks
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Due Today', 'Overdue', 'Upcoming', 'Completed'] as const).map((filter) => {
            const isActive = selectedFilter === filter;
            const count = counts[filter];
            const isRed = filter === 'Overdue' && count > 0;

            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isRed
                    ? 'border border-rose-300 bg-rose-50 text-rose-700'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-slate-800 text-amber-300'
                      : isRed
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Staff Filter, Search & Create Task Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="All">All Staff Handlers</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Follow-ups Tasks Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Due Date & Urgency</th>
                <th className="py-3.5 px-3">Customer Contact</th>
                <th className="py-3.5 px-3">Follow-up Reason</th>
                <th className="py-3.5 px-3">Assigned Owner</th>
                <th className="py-3.5 px-3">Notes & Protocol</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-600">
                    No follow-up tasks match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const cust = customers.find((c) => c.id === task.customerId || c.name === task.customerName);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        task.isOverdue && task.status !== 'Completed' ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Due Date & Overdue Indicator */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{task.scheduledDate}</span>
                          {task.isOverdue && task.status !== 'Completed' && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div
                          onClick={() => cust && onOpenCustomerProfile(cust)}
                          className="flex flex-col cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                            {task.customerName}
                          </span>
                          <span className="text-[11px] text-slate-600">{task.phone}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900">{task.reason}</span>
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-800">{task.assignedStaffName}</span>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <p className="text-slate-600 text-[11px] line-clamp-1">{task.notes}</p>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-3">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateStatus(task.id, e.target.value as FollowUpStatus)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold border cursor-pointer ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : task.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* WhatsApp 1-Click Action */}
                      <td className="py-3.5 pr-6 text-right">
                        <button
                          onClick={() => handleWhatsApp(task.phone, task.customerName, task.reason)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Follow-up Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <PhoneCall className="h-4.5 w-4.5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Create Follow-up Task</h2>
                  <p className="text-xs text-slate-600">Schedule customer check-in or retention task</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer *
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Reason *
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Post-Keratin 48h Check-in or Bridal Review"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Due Date
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g. Tomorrow, Oct 15"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Staff Member
                  </label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Talking Points
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Points to discuss, hair wash guidelines, or satisfaction inquiries..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
