import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
          info: <Info className="h-5 w-5 text-sky-600 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
          error: 'border-red-200 bg-red-50/90 text-red-950',
          warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
          info: 'border-sky-200 bg-sky-50/90 text-sky-950',
        };

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-xs transition-all animate-in slide-in-from-top-2 duration-200 ${borders[n.type]}`}
          >
            {icons[n.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold">{n.title}</p>
              {n.message && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{n.message}</p>}
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
