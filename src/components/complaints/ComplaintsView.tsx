"use client";

import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  User,
  ShieldAlert,
  Sparkles,
  X,
  FileText,
  DollarSign,
  Gift,
} from 'lucide-react';
import {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintTicket,
  Customer,
  StaffMember,
} from '@/types/crm';

interface ComplaintsViewProps {
  complaints: ComplaintTicket[];
  customers: Customer[];
  staffList: StaffMember[];
  onOpenCustomerProfile: (customer: Customer) => void;
  onAddComplaint: (newComplaint: ComplaintTicket) => void;
  onUpdateComplaint: (updated: ComplaintTicket) => void;
  onOpenLogComplaint?: () => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  customers,
  staffList,
  onOpenCustomerProfile,
  onAddComplaint,
  onUpdateComplaint,
  onOpenLogComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | ComplaintPriority>('All');
  const [staffFilter, setStaffFilter] = useState<string>('All');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState<ComplaintTicket | null>(null);

  // New Complaint Form
  const [newCustId, setNewCustId] = useState(customers[0]?.id || '');
  const [newCategory, setNewCategory] = useState<ComplaintCategory>('Service Quality');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('Medium');
  const [newIssue, setNewIssue] = useState('');
  const [newStaff, setNewStaff] = useState(staffList[0]?.name || 'Admin User');

  // Resolve Form
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [compensation, setCompensation] = useState('');

  // Top Metrics Strip
  const metrics = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter((c) => c.status === 'Open').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
    };
  }, [complaints]);

  // Filtered Tickets
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchStaff = staffFilter === 'All' || c.assignedStaffName === staffFilter;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        c.ticketCode.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.issue.toLowerCase().includes(q) ||
        c.serviceName.toLowerCase().includes(q);

      return matchStatus && matchPriority && matchStaff && matchSearch;
    });
  }, [complaints, statusFilter, priorityFilter, staffFilter, searchQuery]);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newCustId) || customers[0];

    const ticket: ComplaintTicket = {
      id: `comp-${Date.now()}`,
      ticketCode: `#CMP-${Math.floor(100 + Math.random() * 900)}`,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      serviceName: 'Salon Treatment & Consultation',
      category: newCategory,
      issue: newIssue.trim(),
      priority: newPriority,
      status: 'Open',
      assignedStaffName: newStaff,
      createdAt: 'Today, Just Now',
    };

    onAddComplaint(ticket);
    setIsLogModalOpen(false);
    setNewIssue('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;

    const updated: ComplaintTicket = {
      ...resolvingTicket,
      status: 'Resolved',
      closedAt: 'Today, Just Now',
      resolutionNotes: resolutionNotes.trim() || 'Resolved with client satisfaction call.',
      compensationGiven: compensation.trim() || undefined,
    };

    onUpdateComplaint(updated);
    setResolvingTicket(null);
    setResolutionNotes('');
    setCompensation('');
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 text-[10px] font-bold">Urgent</span>;
      case 'High':
        return <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">High</span>;
      case 'Medium':
        return <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold">Medium</span>;
      case 'Low':
        return <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">Low</span>;
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Open':
        return <span className="rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[10px] font-bold border border-rose-200">Open</span>;
      case 'In Progress':
        return <span className="rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-bold border border-amber-200">In Progress</span>;
      case 'Resolved':
        return <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">Resolved</span>;
      case 'Closed':
        return <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-bold">Closed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-600">Total Logged</span>
          <p className="mt-1 text-2xl font-bold text-slate-900">{metrics.total}</p>
          <span className="text-[11px] text-slate-600">Lifetime salon tickets</span>
        </div>
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-700">Open Issues</span>
          <p className="mt-1 text-2xl font-bold text-rose-700">{metrics.open}</p>
          <span className="text-[11px] text-rose-600">Requires manager review</span>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700">In Progress</span>
          <p className="mt-1 text-2xl font-bold text-amber-700">{metrics.inProgress}</p>
          <span className="text-[11px] text-amber-600">Stylist/Desk follow-up</span>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700">Resolved / Closed</span>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{metrics.resolved}</p>
          <span className="text-[11px] text-emerald-600">Satisfactorily closed</span>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Staff filter */}
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
        </div>

        {/* Search & Log Complaint Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket, customer, issue..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white"
            />
          </div>

          <button
            onClick={() => (onOpenLogComplaint ? onOpenLogComplaint() : setIsLogModalOpen(true))}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Complaint</span>
          </button>
        </div>
      </div>

      {/* 3. Complaints Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Ticket ID & Date</th>
                <th className="py-3.5 px-3">Linked Customer</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Issue Description</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Assigned Staff</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-600">
                    No complaints match the current filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((ticket) => {
                  const custObj = customers.find((c) => c.id === ticket.customerId || c.name === ticket.customerName);

                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Ticket Code & Date */}
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{ticket.ticketCode}</span>
                          <span className="text-[11px] text-slate-600">{ticket.createdAt}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <div
                          onClick={() => custObj && onOpenCustomerProfile(custObj)}
                          className="flex flex-col cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                            {ticket.customerName}
                          </span>
                          <span className="text-[11px] text-slate-600">{ticket.customerPhone}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {ticket.category}
                        </span>
                      </td>

                      {/* Issue & Resolution Summary */}
                      <td className="py-3.5 px-3 max-w-xs">
                        <p className="text-slate-900 font-medium line-clamp-1">{ticket.issue}</p>
                        {ticket.resolutionNotes && (
                          <p className="text-[11px] text-emerald-700 line-clamp-1 mt-0.5">
                            ✓ {ticket.resolutionNotes}
                          </p>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3">{getPriorityBadge(ticket.priority)}</td>

                      {/* Status */}
                      <td className="py-3.5 px-3">{getStatusBadge(ticket.status)}</td>

                      {/* Assigned Staff */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-800">{ticket.assignedStaffName}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' ? (
                            <button
                              onClick={() => {
                                setResolvingTicket(ticket);
                                setResolutionNotes(ticket.resolutionNotes || '');
                                setCompensation(ticket.compensationGiven || '');
                              }}
                              className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition-colors"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Resolved
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Log Complaint Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsLogModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Log Customer Complaint</h2>
                  <p className="text-xs text-slate-600">Register feedback ticket and assign an in-charge</p>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer *
                </label>
                <select
                  value={newCustId}
                  onChange={(e) => setNewCustId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ComplaintCategory)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  >
                    <option value="Service Quality">Service Quality</option>
                    <option value="Skin Irritation">Skin Irritation</option>
                    <option value="Long Wait Time">Long Wait Time</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Billing Issue">Billing Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Staff Lead
                </label>
                <select
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name} ({st.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  placeholder="Describe the complaint in detail..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Resolve Complaint Dialog */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setResolvingTicket(null)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Resolve Ticket {resolvingTicket.ticketCode}
                </h3>
              </div>
              <button
                onClick={() => setResolvingTicket(null)}
                className="rounded-full p-1 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 text-xs">
                <span className="font-semibold text-slate-700">{resolvingTicket.customerName}</span>
                <p className="text-slate-600 mt-1">{resolvingTicket.issue}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Steps taken to resolve and satisfy client..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Compensation / Discount Given (Optional)
                </label>
                <input
                  type="text"
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  placeholder="e.g. PKR 1,500 complimentary treatment voucher"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
