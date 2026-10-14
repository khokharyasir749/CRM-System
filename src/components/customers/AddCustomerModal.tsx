"use client";

import React, { useState } from 'react';
import { X, UserPlus, User, Phone, Mail, Scissors, AlertTriangle, FileText } from 'lucide-react';
import { Customer } from '@/types/crm';
import { stylistsList } from '@/data/salonData';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [preferredStylistId, setPreferredStylistId] = useState(stylistsList[0].id);
  const [skinHairNotes, setSkinHairNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [category, setCategory] = useState<'Standard' | 'Frequent' | 'VIP'>('Standard');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stylist = stylistsList.find((s) => s.id === preferredStylistId);

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      gender,
      visitsCount: 1,
      totalSpent: 0,
      outstandingBalance: 0,
      lastVisitDate: 'Today, Oct 14',
      preferredStylistId,
      preferredStylistName: stylist?.name,
      skinHairNotes: skinHairNotes || 'Regular consultation notes.',
      allergies: allergies || 'None recorded.',
      category,
      joinedDate: 'Oct 14, 2026',
    };

    onAddCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <UserPlus className="h-4.5 w-4.5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Register New Customer
              </h2>
              <p className="text-xs text-slate-600">
                Add client profile, skin/hair preferences, and safety notes
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zara Ahmed"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="zara.ahmed@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Stylist
              </label>
              <div className="relative">
                <Scissors className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <select
                  value={preferredStylistId}
                  onChange={(e) => setPreferredStylistId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
                >
                  {stylistsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Loyalty Tier
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
              >
                <option value="Standard">Standard Client</option>
                <option value="Frequent">Frequent Visitor</option>
                <option value="VIP">VIP Client</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-slate-400"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Skin / Hair Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skin & Hair Notes
            </label>
            <input
              type="text"
              value={skinHairNotes}
              onChange={(e) => setSkinHairNotes(e.target.value)}
              placeholder="e.g. Dry curly hair, oily T-zone, prefers organic hair wash"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Allergies & Safety Precautions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 text-rose-700">
              Allergies & Contraindications
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Ammonia sensitivity, latex glove allergy, fragrance-free"
              className="w-full rounded-xl border border-rose-200 bg-rose-50/30 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-600 focus:bg-white focus:outline-hidden focus:border-rose-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              Register Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
