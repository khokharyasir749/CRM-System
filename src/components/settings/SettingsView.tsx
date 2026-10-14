"use client";

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Clock,
  Scissors,
  Bell,
  Save,
  Plus,
  Trash2,
  Check,
  Sparkles,
  DollarSign,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { SalonProfileSettings, SalonServiceItem } from '@/types/crm';

interface SettingsViewProps {
  settings: SalonProfileSettings;
  services: SalonServiceItem[];
  onSaveSettings: (settings: SalonProfileSettings) => void;
  onAddService: (service: SalonServiceItem) => void;
  onToggleServiceStatus: (serviceId: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  services,
  onSaveSettings,
  onAddService,
  onToggleServiceStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'services' | 'notifications'>('profile');

  // Salon Profile Form State
  const [salonName, setSalonName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);

  // Operating Hours State
  const [hours, setHours] = useState(settings.operatingHours);

  // Notification Preferences State
  const [reminderTiming, setReminderTiming] = useState(settings.whatsappReminderTiming);

  // Add Service Form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCat, setNewServiceCat] = useState<'Bridal' | 'Facial & Skin' | 'Hair & Styling' | 'Nails & Spa' | 'Color & Balayage'>('Hair & Styling');
  const [newServicePrice, setNewServicePrice] = useState(8000);
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      name: salonName,
      tagline,
      phone,
      email,
      address,
      currency,
      operatingHours: hours,
      whatsappReminderTiming: reminderTiming,
    });
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const item: SalonServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      category: newServiceCat,
      price: newServicePrice,
      duration: newServiceDuration,
      status: 'Active',
    };

    onAddService(item);
    setIsAddServiceOpen(false);
    setNewServiceName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Salon Configuration & Settings</h2>
          <p className="text-xs text-slate-600">
            Branch profile, weekly operating hours, service menu pricing, and automated notifications
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs overflow-x-auto">
          {[
            { id: 'profile', label: 'Salon Profile', icon: Store },
            { id: 'hours', label: 'Operating Hours', icon: Clock },
            { id: 'services', label: 'Service Catalog', icon: Scissors },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. SALON PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Branch Identification & Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salon Legal & Brand Name
                </label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline & Subtitle
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Phone Contact
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Currency
                </label>
                <input
                  type="text"
                  disabled
                  value={currency}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 px-3 text-xs font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salon Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 2. OPERATING HOURS */}
      {activeTab === 'hours' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Operating Schedule</h3>
              <p className="text-xs text-slate-600">Defines online booking calendar slot availability</p>
            </div>
            <button
              onClick={handleProfileSubmit}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Schedule</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {hours.map((dayItem, index) => (
              <div key={dayItem.day} className="py-3 flex items-center justify-between text-xs">
                <div className="w-32 font-bold text-slate-900 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dayItem.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{dayItem.day}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Open:</span>
                    <input
                      type="text"
                      disabled={!dayItem.isOpen}
                      value={dayItem.open}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[index].open = e.target.value;
                        setHours(updated);
                      }}
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-xs text-center font-semibold"
                    />
                  </div>

                  <span className="text-slate-600">to</span>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Close:</span>
                    <input
                      type="text"
                      disabled={!dayItem.isOpen}
                      value={dayItem.close}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[index].close = e.target.value;
                        setHours(updated);
                      }}
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 py-1 px-2 text-xs text-center font-semibold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const updated = [...hours];
                    updated[index].isOpen = !updated[index].isOpen;
                    setHours(updated);
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    dayItem.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {dayItem.isOpen ? 'Active' : 'Closed'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SERVICE CATALOG */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Salon Service Catalog</h3>
              <p className="text-xs text-slate-600">Manage treatment offerings, durations, and base prices</p>
            </div>

            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Service Item</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Service Name</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Base Price (PKR)</th>
                  <th className="py-3.5 px-3">Duration</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-6 pr-3 font-bold text-slate-900">{srv.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      PKR {srv.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{srv.duration} mins</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          srv.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {srv.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 text-right">
                      <button
                        onClick={() => onToggleServiceStatus(srv.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {srv.status === 'Active' ? 'Archive' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Service Modal */}
          {isAddServiceOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-slate-900/20 transition-opacity"
                onClick={() => setIsAddServiceOpen(false)}
              />
              <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Add Salon Service</h3>
                <form onSubmit={handleCreateService} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. 24K Gold Collagen Facial"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newServiceCat}
                      onChange={(e) => setNewServiceCat(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                    >
                      <option value="Hair & Styling">Hair & Styling</option>
                      <option value="Facial & Skin">Facial & Skin</option>
                      <option value="Bridal">Bridal</option>
                      <option value="Nails & Spa">Nails & Spa</option>
                      <option value="Color & Balayage">Color & Balayage</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        value={newServiceDuration}
                        onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddServiceOpen(false)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white"
                    >
                      Create Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            WhatsApp & SMS Automation Triggers
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Reminder Dispatch Timing
            </label>
            <select
              value={reminderTiming}
              onChange={(e) => setReminderTiming(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-900 focus:bg-white"
            >
              <option value="24 hours before appointment">24 hours before scheduled appointment</option>
              <option value="12 hours before appointment">12 hours before scheduled appointment</option>
              <option value="2 hours before appointment">2 hours before scheduled appointment</option>
            </select>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-800">
            <span className="font-bold">Active Salon Automation: </span>
            <span>
              Appointment confirmation messages are sent immediately upon booking confirmation. Post-service review messages trigger 2 hours after checkout.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleProfileSubmit}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
