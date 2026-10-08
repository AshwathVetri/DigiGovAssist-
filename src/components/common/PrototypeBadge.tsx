import React from 'react';
import { Info } from 'lucide-react';

interface PrototypeBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'amber' | 'blue' | 'slate' | 'green';
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({
  label = 'Prototype Data',
  size = 'sm',
  variant = 'amber',
}) => {
  const colorClasses = {
    amber: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    blue: 'bg-[#f0f5fa] text-[#0f4477] border-[#c2d8ec]',
    slate: 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]',
    green: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
  }[variant];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded border ${colorClasses} ${sizeClasses} select-none`}
      title="Prototype Demonstration Data — Simulated for test workflow."
    >
      <Info className="w-2.5 h-2.5" />
      <span>{label}</span>
    </span>
  );
};
