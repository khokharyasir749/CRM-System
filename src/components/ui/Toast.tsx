"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  // Limit visible toasts strictly to maximum 2 at any time (newest toasts)
  const visibleToasts = toasts.slice(-2);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl ring-1 ring-black/5 animate-in slide-in-from-top-2 fade-in duration-200"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer transition-colors"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
