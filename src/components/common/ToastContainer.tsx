import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-gov-600 shrink-0" />,
        };

        const bgBorders = {
          success: 'bg-white border-emerald-300 text-slate-800 shadow-lg shadow-emerald-500/10',
          warning: 'bg-white border-amber-300 text-slate-800 shadow-lg shadow-amber-500/10',
          error: 'bg-white border-rose-300 text-slate-800 shadow-lg shadow-rose-500/10',
          info: 'bg-white border-gov-300 text-slate-800 shadow-lg shadow-blue-500/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${bgBorders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
