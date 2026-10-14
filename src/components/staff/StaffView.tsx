"use client";

import React, { useState } from 'react';
import {
  UserCog,
  Users,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  Scissors,
  Phone,
  Mail,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { RoleMode, StaffMember } from '@/types/crm';

interface StaffViewProps {
  staffList: StaffMember[];
  roleMode: RoleMode;
  onToggleRoleMode: (newMode: RoleMode) => void;
  onAddStaff: (newStaff: StaffMember) => void;
  onToggleStaffStatus: (staffId: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  roleMode,
  onToggleRoleMode,
  onAddStaff,
  onToggleStaffStatus,
}) => {
  const maxStaffLimit = 10;
  const isLimitReached = staffList.length >= maxStaffLimit;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Administrator / Owner' | 'Staff Stylist / Front Desk'>('Staff Stylist / Front Desk');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [specialization, setSpecialization] = useState('Senior Hair Stylist');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached || !name.trim()) return;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@regularsalon.pk`,
      phone: phone.trim(),
      specialization: specialization.trim(),
      status: 'Active',
      assignedAppointmentsCount: 0,
      revenueGenerated: 0,
      rating: 5.0,
      joinedDate: 'Oct 14, 2026',
    };

    onAddStaff(newStaff);
    setIsInviteModalOpen(false);
    setName('');
    setEmail('');
    setPhone('+92 3');
  };

  // If in Staff Mode, show the Role Restriction Simulation screen!
  if (roleMode === 'staff') {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Role Simulator Banner */}
        <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-blue-900">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-bold text-blue-900">
                Simulating View Mode: Staff Stylist / Front Desk
              </p>
              <p className="text-[11px] text-blue-700">
                Administrative staff management, owner salaries, and sensitive financials are restricted.
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggleRoleMode('admin')}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Switch to Administrator View
          </button>
        </div>

        {/* Restricted State Card */}
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Lock className="h-7 w-7 text-slate-500" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            Access Restricted to Administrators
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Staff directory modifications, seat allocations, and role assignment matrices require{' '}
            <span className="font-semibold text-slate-900">Administrator / Owner</span> privileges.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onToggleRoleMode('admin')}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Elevate to Administrator Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls & Seat Counter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Staff & Roles Management</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isLimitReached
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {staffList.length} / {maxStaffLimit} Staff Seats Used
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Manage stylist bay assignments, staff roles, and seat license constraints
          </p>
        </div>

        {/* Role Simulator Switcher & Add Staff Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Preview Switcher */}
          <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs">
            <button
              onClick={() => onToggleRoleMode('admin')}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all bg-slate-900 text-white shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Admin Mode</span>
            </button>
            <button
              onClick={() => onToggleRoleMode('staff')}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-all text-slate-600 hover:text-slate-900"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Simulate Staff Mode</span>
            </button>
          </div>

          {/* Add Staff Button */}
          <button
            disabled={isLimitReached}
            onClick={() => setIsInviteModalOpen(true)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors shrink-0 ${
              isLimitReached
                ? 'bg-slate-400 cursor-not-allowed opacity-60'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Invite / Add Staff</span>
          </button>
        </div>
      </div>

      {/* Warning banner if approaching or reached limit */}
      {isLimitReached ? (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-900">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">License Limit Reached (10/10 Seats): </span>
            <span>
              Your salon subscription is capped at 10 staff accounts. Upgrade to Enterprise Package to add more staff stations.
            </span>
          </div>
        </div>
      ) : staffList.length >= 8 ? (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            Notice: Only {maxStaffLimit - staffList.length} staff seat(s) remaining under the 10-account limit.
          </span>
        </div>
      ) : null}

      {/* Staff Members Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Staff Member</th>
                <th className="py-3.5 px-3">Role & Permissions</th>
                <th className="py-3.5 px-3">Specialization</th>
                <th className="py-3.5 px-3">Completed Bookings</th>
                <th className="py-3.5 px-3">Total Billed</th>
                <th className="py-3.5 px-3">Stylist Rating</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Staff Info */}
                  <td className="py-3.5 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{st.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span>{st.phone}</span>
                          <span>• {st.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        st.role === 'Administrator / Owner'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {st.role}
                    </span>
                  </td>

                  {/* Specialization */}
                  <td className="py-3.5 px-3 font-medium text-slate-800">
                    {st.specialization}
                  </td>

                  {/* Bookings */}
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {st.assignedAppointmentsCount} Bookings
                  </td>

                  {/* Billed */}
                  <td className="py-3.5 px-3 font-bold text-emerald-700">
                    PKR {st.revenueGenerated.toLocaleString()}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span>{st.rating.toFixed(2)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => onToggleStaffStatus(st.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-colors ${
                        st.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          st.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {st.status}
                    </button>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 pr-6 text-right">
                    <button
                      onClick={() => onToggleStaffStatus(st.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      {st.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Invite Staff Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsInviteModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <UserCog className="h-4.5 w-4.5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Add Staff Account</h2>
                  <p className="text-xs text-slate-600">
                    Seat {staffList.length + 1} of {maxStaffLimit} maximum allowed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Farhan Ali"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role & Access *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  >
                    <option value="Staff Stylist / Front Desk">Staff Stylist / Front Desk</option>
                    <option value="Administrator / Owner">Administrator / Owner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salon Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@regularsalon.pk"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specialization & Station
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Senior Colorist / Makeup Specialist"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
