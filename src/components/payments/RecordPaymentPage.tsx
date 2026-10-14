"use client";

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  User,
  FileText,
  CheckCircle2,
  Printer,
  Sparkles,
  Building,
  Check,
} from 'lucide-react';
import { Customer, Invoice, PaymentMethod } from '@/types/crm';

interface RecordPaymentPageProps {
  onBack: () => void;
  customers: Customer[];
  invoices: Invoice[];
  preselectedCustomerId?: string | null;
  preselectedInvoiceId?: string | null;
  onSavePayment: (
    customerId: string,
    invoiceId: string | null,
    amountPaying: number,
    paymentMethod: PaymentMethod,
    notes: string
  ) => void;
  onViewReceipt?: (invoice: Invoice) => void;
}

export const RecordPaymentPage: React.FC<RecordPaymentPageProps> = ({
  onBack,
  customers,
  invoices,
  preselectedCustomerId,
  preselectedInvoiceId,
  onSavePayment,
  onViewReceipt,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomerId || customers[0]?.id || ''
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    preselectedInvoiceId || 'custom'
  );
  const [paymentMode, setPaymentMode] = useState<'Full' | 'Partial' | 'Custom'>('Full');
  const [totalBill, setTotalBill] = useState<number>(10000);
  const [amountPaying, setAmountPaying] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Auto-select invoice or balance
  useEffect(() => {
    if (preselectedInvoiceId) {
      const inv = invoices.find((i) => i.id === preselectedInvoiceId);
      if (inv) {
        setSelectedInvoiceId(inv.id);
        setSelectedCustomerId(inv.customerId);
        setTotalBill(inv.dueBalance > 0 ? inv.dueBalance : inv.totalAmount);
        setAmountPaying(inv.dueBalance > 0 ? inv.dueBalance : inv.totalAmount);
        return;
      }
    }

    if (preselectedCustomerId) {
      setSelectedCustomerId(preselectedCustomerId);
      const pendingInvoice = invoices.find(
        (i) => i.customerId === preselectedCustomerId && i.dueBalance > 0
      );
      if (pendingInvoice) {
        setSelectedInvoiceId(pendingInvoice.id);
        setTotalBill(pendingInvoice.dueBalance);
        setAmountPaying(pendingInvoice.dueBalance);
      } else {
        const cust = customers.find((c) => c.id === preselectedCustomerId);
        const bal = cust?.outstandingBalance || 5000;
        setTotalBill(bal);
        setAmountPaying(bal);
      }
    }
  }, [preselectedCustomerId, preselectedInvoiceId, invoices, customers]);

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const targetCust = customers.find((c) => c.id === custId);
    const pending = invoices.find((i) => i.customerId === custId && i.dueBalance > 0);

    if (pending) {
      setSelectedInvoiceId(pending.id);
      setTotalBill(pending.dueBalance);
      setAmountPaying(pending.dueBalance);
    } else if (targetCust && targetCust.outstandingBalance > 0) {
      setSelectedInvoiceId('custom');
      setTotalBill(targetCust.outstandingBalance);
      setAmountPaying(targetCust.outstandingBalance);
    } else {
      setSelectedInvoiceId('custom');
      setTotalBill(5000);
      setAmountPaying(5000);
    }
  };

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    if (invId !== 'custom') {
      const inv = invoices.find((i) => i.id === invId);
      if (inv) {
        const due = inv.dueBalance > 0 ? inv.dueBalance : inv.totalAmount;
        setTotalBill(due);
        setAmountPaying(due);
      }
    }
  };

  const handleModeChange = (mode: 'Full' | 'Partial' | 'Custom') => {
    setPaymentMode(mode);
    if (mode === 'Full') {
      setAmountPaying(totalBill);
    } else if (mode === 'Partial') {
      setAmountPaying(Math.floor(totalBill / 2));
    }
  };

  const remainingBalance = Math.max(0, totalBill - amountPaying);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPaying <= 0) return;

    onSavePayment(
      selectedCustomerId,
      selectedInvoiceId === 'custom' ? null : selectedInvoiceId,
      amountPaying,
      paymentMethod,
      notes.trim() || 'Settlement completed at counter'
    );
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
            title="Back to Payments"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>Payments</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 font-semibold">Record Payment</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Settle Balance & Record Transaction
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
            <span>Complete & Record Payment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Form Column (65%) & Right Sticky Summary Column (35%) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Client & Invoice Selection */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">1. Client & Invoice Target</h2>
                <p className="text-xs text-slate-400">Select recipient account and active due bill</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Client Account
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Balance: PKR {c.outstandingBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Associated Invoice
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                >
                  <option value="custom">General Dues / Advance Settlement</option>
                  {invoices
                    .filter((inv) => inv.customerId === selectedCustomerId)
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceCode} — {inv.serviceName} (Due: PKR {inv.dueBalance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Client Snapshot Card */}
            {currentCustomer && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={currentCustomer.avatar}
                    alt={currentCustomer.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{currentCustomer.name}</span>
                    <span className="text-[11px] text-slate-400 block">{currentCustomer.phone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Outstanding Balance
                  </span>
                  <span className="text-base font-bold text-rose-600 block">
                    PKR {currentCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Payment Amount & Modes */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">2. Payment Calculation</h2>
                <p className="text-xs text-slate-400">Choose settlement fraction or enter custom payment</p>
              </div>
            </div>

            {/* Quick Mode Buttons */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { id: 'Full', label: '100% Full Payment', desc: `PKR ${totalBill.toLocaleString()}` },
                {
                  id: 'Partial',
                  label: '50% Advance',
                  desc: `PKR ${Math.floor(totalBill / 2).toLocaleString()}`,
                },
                { id: 'Custom', label: 'Custom Amount', desc: 'Enter manually' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleModeChange(opt.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-center transition-all ${
                    paymentMode === opt.id
                      ? 'border-slate-900 bg-slate-50/80 shadow-2xs ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">{opt.label}</span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{opt.desc}</span>
                </div>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount Paying (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">PKR</span>
                  <input
                    type="number"
                    min="1"
                    value={amountPaying}
                    onChange={(e) => {
                      setPaymentMode('Custom');
                      setAmountPaying(Number(e.target.value));
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-slate-400 focus:outline-hidden shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Remaining Balance After Payment
                </label>
                <div className="rounded-xl bg-slate-100 p-2.5 text-sm font-bold text-slate-800">
                  PKR {remainingBalance.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment Method & Reference */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">3. Payment Channel & Notes</h2>
                <p className="text-xs text-slate-400">Specify transaction method for ledger records</p>
              </div>
            </div>

            {/* Method Grid */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Cash', 'POS Terminal', 'Bank Transfer', 'Card'] as const).map((m) => (
                <div
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    paymentMethod === m
                      ? 'border-slate-900 bg-slate-50/80 shadow-2xs ring-1 ring-slate-900 font-bold text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{m}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Receipt Reference / Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Visa Debit Card ending in 4192, verified at counter..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-hidden shadow-2xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Column (4 cols on lg - Sticky Card) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Financial Ledger
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Receipt Summary</h3>
            </div>

            {/* Summary Lines */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Selected Customer:</span>
                <span className="font-semibold text-slate-900">{currentCustomer?.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Target Due Bill:</span>
                <span className="font-semibold text-slate-900">PKR {totalBill.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-semibold text-slate-900">{paymentMode}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-900">{paymentMethod}</span>
              </div>
            </div>

            {/* Amount Banner */}
            <div className="rounded-xl bg-slate-900 p-4 text-white space-y-1">
              <span className="text-[11px] font-medium text-slate-400">Total Amount Collected</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-slate-400">PKR</span>
                <span className="text-2xl font-bold tracking-tight text-white">
                  {amountPaying.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 pt-1">
                Remaining client balance will be: PKR {remainingBalance.toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Confirm & Record Settlement
              </button>

              {currentInvoice && onViewReceipt && (
                <button
                  type="button"
                  onClick={() => onViewReceipt(currentInvoice)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Preview Receipt</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBack}
                className="w-full rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
