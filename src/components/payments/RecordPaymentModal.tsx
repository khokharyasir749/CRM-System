"use client";

import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, User, FileText, CheckCircle2 } from 'lucide-react';
import { Customer, Invoice, PaymentMethod } from '@/types/crm';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  invoices: Invoice[];
  preselectedCustomer?: Customer | null;
  onSavePayment: (
    customerId: string,
    invoiceId: string | null,
    amountPaying: number,
    paymentMethod: PaymentMethod,
    notes: string
  ) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  customers,
  invoices,
  preselectedCustomer,
  onSavePayment,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomer ? preselectedCustomer.id : customers[0]?.id || ''
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('custom');
  const [paymentMode, setPaymentMode] = useState<'Full' | 'Partial'>('Full');
  const [totalBill, setTotalBill] = useState<number>(10000);
  const [amountPaying, setAmountPaying] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  // Update when preselectedCustomer changes
  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomerId(preselectedCustomer.id);
      const pendingInvoice = invoices.find(
        (i) => i.customerId === preselectedCustomer.id && i.dueBalance > 0
      );
      if (pendingInvoice) {
        setSelectedInvoiceId(pendingInvoice.id);
        setTotalBill(pendingInvoice.dueBalance);
        setAmountPaying(pendingInvoice.dueBalance);
      } else {
        setTotalBill(preselectedCustomer.outstandingBalance || 5000);
        setAmountPaying(preselectedCustomer.outstandingBalance || 5000);
      }
    }
  }, [preselectedCustomer, invoices]);

  // When customer changes
  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const targetCust = customers.find((c) => c.id === custId);
    const pendingInvoice = invoices.find((i) => i.customerId === custId && i.dueBalance > 0);

    if (pendingInvoice) {
      setSelectedInvoiceId(pendingInvoice.id);
      setTotalBill(pendingInvoice.dueBalance);
      setAmountPaying(pendingInvoice.dueBalance);
    } else if (targetCust && targetCust.outstandingBalance > 0) {
      setSelectedInvoiceId('custom');
      setTotalBill(targetCust.outstandingBalance);
      setAmountPaying(targetCust.outstandingBalance);
    }
  };

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    if (invId !== 'custom') {
      const inv = invoices.find((i) => i.id === invId);
      if (inv) {
        setTotalBill(inv.dueBalance > 0 ? inv.dueBalance : inv.totalAmount);
        setAmountPaying(inv.dueBalance > 0 ? inv.dueBalance : inv.totalAmount);
      }
    }
  };

  const handleModeChange = (mode: 'Full' | 'Partial') => {
    setPaymentMode(mode);
    if (mode === 'Full') {
      setAmountPaying(totalBill);
    } else {
      setAmountPaying(Math.floor(totalBill / 2));
    }
  };

  const remainingBalance = Math.max(0, totalBill - amountPaying);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(
      selectedCustomerId,
      selectedInvoiceId === 'custom' ? null : selectedInvoiceId,
      amountPaying,
      paymentMethod,
      notes || `Payment recorded via counter: ${paymentMethod}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <CreditCard className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Salon Payment</h2>
              <p className="text-xs text-slate-600">
                Settle customer dues or log counter receipt transaction
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
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Client *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) • Outstanding: PKR {c.outstandingBalance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice or Custom Bill selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Bill / Open Invoice
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            >
              <option value="custom">General Account Settlement (Custom)</option>
              {invoices
                .filter((inv) => inv.customerId === selectedCustomerId)
                .map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceCode} - {inv.serviceName} (Due: PKR {inv.dueBalance.toLocaleString()})
                  </option>
                ))}
            </select>
          </div>

          {/* Payment Mode (Full vs Partial) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Type
              </label>
              <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleModeChange('Full')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    paymentMode === 'Full'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  Full Settle
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('Partial')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    paymentMode === 'Partial'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  Partial Advance
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
              >
                <option value="Cash">Cash (Register)</option>
                <option value="Card">Card (Debit/Credit)</option>
                <option value="Bank Transfer">Bank Transfer (Raast / IBFT)</option>
                <option value="POS Terminal">POS Card Machine</option>
              </select>
            </div>
          </div>

          {/* Amount Paying Now */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Bill / Due
              </label>
              <input
                type="number"
                value={totalBill}
                onChange={(e) => setTotalBill(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 text-emerald-700">
                Amount Paying Now (PKR) *
              </label>
              <input
                type="number"
                required
                value={amountPaying}
                onChange={(e) => setAmountPaying(Number(e.target.value))}
                className="w-full rounded-xl border border-emerald-300 bg-emerald-50/40 py-2 px-3 text-xs font-bold text-emerald-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Remaining Balance Indicator */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600">Remaining Balance:</span>
              <p
                className={`text-sm font-bold ${
                  remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                PKR {remainingBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-600">Collected By:</span>
              <p className="font-semibold text-slate-800">Admin User (Salon Desk)</p>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Billing Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Counter cash received, invoice reference or discount voucher"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
            />
          </div>

          {/* Actions */}
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
              Save & Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
