"use client";

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Sparkles,
  Scissors,
  AlertTriangle,
  FileText,
  Check,
  Calendar,
  Crown,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import { Customer } from '@/types/crm';
import { stylistsList } from '@/data/salonData';

interface AddCustomerPageProps {
  onBack: () => void;
  onAddCustomer: (customer: Customer) => void;
}

export const AddCustomerPage: React.FC<AddCustomerPageProps> = ({ onBack, onAddCustomer }) => {
  // Personal & Contact Info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 3');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [birthday, setBirthday] = useState('1996-05-18');

  // Beauty & Salon Profile
  const [skinType, setSkinType] = useState('Combination (T-Zone)');
  const [hairTexture, setHairTexture] = useState('Type 2 Wavy (Medium Porosity)');
  const [preferredStylistId, setPreferredStylistId] = useState(stylistsList[0].id);

  // Safety & Contraindications
  const [allergies, setAllergies] = useState('Sensitive to ammonia and strong perfumes');
  const [chemicalSensitivities, setChemicalSensitivities] = useState('Requires formaldehyde-free keratin treatments only');
  const [scalpNotes, setScalpNotes] = useState('Dry scalp during winter months; prefers sulphate-free shampoos');

  // Loyalty & Tags
  const [category, setCategory] = useState<'VIP' | 'Frequent' | 'Standard'>('Standard');
  const [specialRemarks, setSpecialRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stylist = stylistsList.find((s) => s.id === preferredStylistId);

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      avatar:
        gender === 'Male'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      gender,
      visitsCount: 1,
      totalSpent: 0,
      outstandingBalance: 0,
      lastVisitDate: 'Today, Oct 14',
      preferredStylistId,
      preferredStylistName: stylist?.name,
      skinHairNotes: `${hairTexture} • ${skinType}`,
      allergies: `${allergies}. ${chemicalSensitivities}`,
      category,
      joinedDate: 'Oct 14, 2026',
    };

    onAddCustomer(newCustomer);
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
            title="Back to Directory"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Customers</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Register Client</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Add New Client Profile
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
            <span>Save Customer Profile</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Card Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Primary Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Personal & Contact Information */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">1. Personal & Contact Information</h2>
                <p className="text-xs text-slate-400">Primary contact credentials and identity</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mahnoor Farooq"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. client@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Hair, Skin & Beauty Profile */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">2. Hair, Skin & Beauty Profile</h2>
                <p className="text-xs text-slate-400">Customized treatment consultation records</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skin Type & Conditions
                </label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="Combination (T-Zone)">Combination (T-Zone)</option>
                  <option value="Dry & Sensitive">Dry & Sensitive</option>
                  <option value="Oily / Acne Prone">Oily / Acne Prone</option>
                  <option value="Normal Balanced">Normal Balanced</option>
                  <option value="Mature / Anti-Aging Focus">Mature / Anti-Aging Focus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hair Texture & Porosity
                </label>
                <select
                  value={hairTexture}
                  onChange={(e) => setHairTexture(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="Type 2 Wavy (Medium Porosity)">Type 2 Wavy (Medium Porosity)</option>
                  <option value="Type 3 Curly (High Porosity)">Type 3 Curly (High Porosity)</option>
                  <option value="Fine Straight (Low Porosity)">Fine Straight (Low Porosity)</option>
                  <option value="Keratin / Chemically Treated">Keratin / Chemically Treated</option>
                  <option value="Bleached / High Lift Color">Bleached / High Lift Color</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Stylist / Esthetician
                </label>
                <select
                  value={preferredStylistId}
                  onChange={(e) => setPreferredStylistId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  {stylistsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.specialty} (★ {st.rating})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Safety, Allergies & Contraindications */}
          <div className="rounded-2xl border border-rose-200/70 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-rose-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">3. Safety, Allergies & Health Notes</h2>
                <p className="text-xs text-rose-600 font-medium">Critical for chemical services and facials</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Known Cosmetic & Fragrance Allergies
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Sensitive to ammonia, strong fragrance, AHA acids..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chemical Service Restrictions & Contraindications
                </label>
                <input
                  type="text"
                  value={chemicalSensitivities}
                  onChange={(e) => setChemicalSensitivities(e.target.value)}
                  placeholder="e.g. Formaldehyde-free keratin only, patch test required..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Loyalty Tier & Card Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Loyalty Tier & Status */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Classification
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Loyalty Tier & Tag</h3>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Client Category
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'VIP',
                    label: 'VIP Suite Client',
                    desc: 'Priority booking, complimentary refresh, dedicated stylist lock',
                    color: 'border-amber-300 bg-amber-50/60 text-amber-900',
                  },
                  {
                    id: 'Frequent',
                    label: 'Frequent Visitor',
                    desc: 'Regular monthly hair/facial client',
                    color: 'border-blue-200 bg-blue-50/60 text-blue-900',
                  },
                  {
                    id: 'Standard',
                    label: 'Standard Client',
                    desc: 'Walk-in or occasional salon service guest',
                    color: 'border-slate-200 bg-slate-50 text-slate-800',
                  },
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setCategory(tier.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      category === tier.id
                        ? `${tier.color} shadow-2xs ring-1 ring-slate-900`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{tier.label}</span>
                      {category === tier.id && <Check className="h-4 w-4" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Front Desk Concierge Remarks
              </label>
              <textarea
                rows={3}
                value={specialRemarks}
                onChange={(e) => setSpecialRemarks(e.target.value)}
                placeholder="e.g. Prefers quiet appointments, weekend slots only..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Action Button Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              Save Customer Profile
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
