"use client";

import React from 'react';
import { X, Printer, Sparkles, Scissors, CheckCircle2 } from 'lucide-react';
import { Invoice } from '@/types/crm';

interface ReceiptModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/20 transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Salon Branding Header */}
        <div className="text-center border-b border-dashed border-slate-200 pb-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white mb-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Regular CRM Salon</h2>
          <p className="text-[11px] text-slate-600">Luxury Hair, Skin & Bridal Suite</p>
          <p className="text-[10px] text-slate-600">Main Boulevard, DHA Phase 5 • Ph: +92 42 3589 1000</p>
        </div>

        {/* Invoice Meta */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-b border-dashed border-slate-200 pb-3">
          <div>
            <p className="font-bold text-slate-900">{invoice.invoiceCode}</p>
            <p>{invoice.recordedDate}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-800">{invoice.customerName}</p>
            <p>{invoice.customerPhone}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-4 space-y-2 border-b border-dashed border-slate-200 pb-4 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>{invoice.serviceName}</span>
            <span>PKR {invoice.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>Payment Method: {invoice.paymentMethod}</span>
            <span className="text-emerald-600 font-semibold">Paid: PKR {invoice.paidAmount.toLocaleString()}</span>
          </div>
          {invoice.dueBalance > 0 && (
            <div className="flex items-center justify-between text-[11px] text-rose-600 font-bold">
              <span>Remaining Balance</span>
              <span>PKR {invoice.dueBalance.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Total Summary */}
        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
            <span>Total Settled:</span>
            <span>PKR {invoice.paidAmount.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1">Staff In-Charge: {invoice.staffName}</p>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-center text-[10px] text-slate-600">
          Thank you for choosing Regular CRM Salon. We value your beauty & wellness!
        </p>

        {/* Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
