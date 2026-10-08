import React from 'react';
import { ApplicationEvent } from '../../types';
import { Check, Clock } from 'lucide-react';

interface TimelineProps {
  events: ApplicationEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-[#cbd5e1] font-sans">
      {events.map((event, idx) => {
        const isCompleted = event.status === 'completed';
        const isInProgress = event.status === 'in_progress';
        const isPending = event.status === 'pending' || (!isCompleted && !isInProgress);

        return (
          <div key={event.id || idx} className="relative">
            {/* Timeline Marker: ✓ for completed, ● for in_progress, ○ for pending */}
            <div
              className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all ${
                isCompleted
                  ? 'border-[#046a38] bg-[#046a38] text-white'
                  : isInProgress
                  ? 'border-[#0f4477] bg-white text-[#0f4477]'
                  : 'border-[#94a3b8] bg-white text-[#94a3b8]'
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : isInProgress ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#0f4477] block" />
              ) : (
                <span className="w-2 h-2 rounded-full border border-[#94a3b8] bg-transparent block" />
              )}
            </div>

            {/* Event Content Box */}
            <div
              className={`p-4 rounded-xl border text-xs transition-all ${
                isCompleted
                  ? 'bg-white border-[#cbd5e1] shadow-2xs'
                  : isInProgress
                  ? 'bg-[#f0f5fa] border-[#0f4477] shadow-2xs'
                  : 'bg-[#f8fafc] border-[#e2e8f0] opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-bold ${
                      isCompleted
                        ? 'text-[#0f172a]'
                        : isInProgress
                        ? 'text-[#0a2558]'
                        : 'text-[#64748b]'
                    }`}
                  >
                    {event.title}
                  </h4>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                      Completed
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-[10px] font-bold text-[#0f4477] bg-[#e1ecf6] px-1.5 py-0.2 rounded border border-[#c2d8ec]">
                      Current Stage
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#64748b] font-mono">
                  <Clock className="w-3 h-3 text-[#94a3b8]" />
                  <span>{event.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed mt-1">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
