import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ReadinessBarProps {
  percentage: number;
  availableCount?: number;
  totalCount?: number;
  compact?: boolean;
}

export const ReadinessBar: React.FC<ReadinessBarProps> = ({
  percentage,
  availableCount,
  totalCount,
  compact = false,
}) => {
  const getColors = () => {
    if (percentage === 100) {
      return {
        bar: 'bg-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
      };
    }
    if (percentage >= 70) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertTriangle,
      };
    }
    return {
      bar: 'bg-rose-500',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: HelpCircle,
    };
  };

  const style = getColors();
  const Icon = style.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${style.bar} transition-all duration-500 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${style.text}`}>{percentage}%</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-3 border ${style.bg} border-slate-200/80`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${style.text}`} />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Application Readiness</span>
        </div>
        <div className="flex items-center gap-2">
          {availableCount !== undefined && totalCount !== undefined && (
            <span className="text-xs text-slate-500 font-medium">
              {availableCount}/{totalCount} Requirements
            </span>
          )}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
            {percentage}%
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-200/90 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${style.bar} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
