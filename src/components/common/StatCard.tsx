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

  const accentBorders = {
    emerald: 'border-l-4 border-emerald-500 shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/15',
    amber: 'border-l-4 border-amber-500 shadow-md shadow-amber-500/5 hover:shadow-amber-500/15',
    blue: 'border-l-4 border-blue-600 shadow-md shadow-blue-600/5 hover:shadow-blue-600/15',
    indigo: 'border-l-4 border-indigo-600 shadow-md shadow-indigo-600/5 hover:shadow-indigo-600/15',
    purple: 'border-l-4 border-purple-600 shadow-md shadow-purple-600/5 hover:shadow-purple-600/15',
    slate: 'border-l-4 border-slate-700 shadow-md shadow-slate-900/5 hover:shadow-slate-900/15',
  }[accentColor];

  const iconBgClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-600 border border-amber-200/60',
    blue: 'bg-blue-50 text-blue-600 border border-blue-200/60',
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
    purple: 'bg-purple-50 text-purple-600 border border-purple-200/60',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 transition-all duration-300 transform hover:-translate-y-0.5 ${accentBorders} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t(title)}</p>
          <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums font-sans">
            {value}
          </p>
        </div>
        {icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs ${iconBgClasses}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
          {trend && (
            <span
              className={`font-semibold tabular-nums ${
                trend.isPositive ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {trend && subtitle && <span aria-hidden="true">·</span>}
          {subtitle && <span>{t(subtitle)}</span>}
        </div>
      )}
    </div>
  );
};
