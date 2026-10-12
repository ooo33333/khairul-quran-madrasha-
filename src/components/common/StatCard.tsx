import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  accentColor?: 'emerald' | 'amber' | 'blue' | 'indigo' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  accentColor = 'slate',
}) => {
  const { t } = useApp();

  const iconBgClasses = {
    emerald: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25',
    amber: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25',
    blue: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
    indigo: 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/25',
    purple: 'bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white shadow-lg shadow-purple-500/25',
    slate: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-900/25',
  }[accentColor];

  const valueColors = {
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    blue: 'text-blue-700',
    indigo: 'text-indigo-700',
    purple: 'text-purple-700',
    slate: 'text-slate-800',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`rotating-border-card p-5 cursor-pointer select-none ${
        onClick ? 'hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{t(title)}</p>
          <p className={`text-2xl font-black tracking-tight tabular-nums font-sans ${valueColors}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBgClasses}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 font-semibold pt-2 border-t border-slate-100">
          {trend && (
            <span
              className={`font-bold tabular-nums px-2 py-0.5 rounded-md ${
                trend.isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {trend.value}
            </span>
          )}
          {trend && subtitle && <span aria-hidden="true" className="text-slate-300">·</span>}
          {subtitle && <span className="truncate">{t(subtitle)}</span>}
        </div>
      )}
    </div>
  );
};
