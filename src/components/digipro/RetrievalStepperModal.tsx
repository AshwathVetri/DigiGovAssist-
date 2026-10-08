import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PrototypeBadge } from '../common/PrototypeBadge';
import { GovEmblem } from '../common/GovEmblem';
import { GovernmentService } from '../../types';

interface RetrievalStepperModalProps {
  isOpen: boolean;
  service: GovernmentService;
  onFinished: () => void;
}

export const RetrievalStepperModal: React.FC<RetrievalStepperModalProps> = ({
  isOpen,
  service,
  onFinished,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const steps = [
    'Connecting to DigiPro verified data layer...',
    'Checking available verified citizen information...',
    'Matching requirements against service registry...',
    'Preparing auto-filled application draft...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
      return;
    }

    const timer1 = setTimeout(() => setCurrentStep(1), 500);
    const timer2 = setTimeout(() => setCurrentStep(2), 1000);
    const timer3 = setTimeout(() => setCurrentStep(3), 1500);
    const timer4 = setTimeout(() => {
      setIsCompleted(true);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a192f]/60 backdrop-blur-2xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#cbd5e1] shadow-2xl overflow-hidden p-6 text-center">
        {!isCompleted ? (
          /* Progress State */
          <div className="py-6 space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#f0f5fa] border border-[#c2d8ec] text-[#0f4477] mx-auto flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-[#0f4477] animate-spin" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <GovEmblem size="sm" showSealBorder={false} />
                <PrototypeBadge label="DigiPro Data Layer" size="sm" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2558]">Retrieving Verified Data</h3>
              <p className="text-xs text-[#64748b] mt-1">Connecting to simulated citizen repository...</p>
            </div>

            {/* Stepper Steps List */}
            <div className="space-y-2.5 text-left max-w-sm mx-auto bg-[#f8fafc] p-4 rounded-xl border border-[#cbd5e1]">
              {steps.map((text, idx) => {
                const isPast = currentStep > idx;
                const isCurrent = currentStep === idx;
                return (
                  <div key={text} className="flex items-center gap-3 text-xs">
                    {isPast ? (
                      <Check className="w-4 h-4 text-[#046a38] shrink-0 font-bold" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#0f4477] animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#cbd5e1] shrink-0" />
                    )}
                    <span
                      className={`font-medium ${
                        isPast ? 'text-[#334155]' : isCurrent ? 'text-[#0a2558] font-bold' : 'text-[#94a3b8]'
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Completed Success Screen */
          <div className="py-4 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#046a38] mx-auto flex items-center justify-center">
              <Check className="w-7 h-7 text-[#046a38] stroke-[3]" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <PrototypeBadge label="Prototype Data Retrieved" size="sm" variant="green" />
              </div>
              <h3 className="text-lg font-bold text-[#0a2558]">Information Retrieved</h3>
              <p className="text-xs text-[#475569] mt-1 max-w-md mx-auto">
                DigiPro has verified the required fields and documents for{' '}
                <strong className="text-[#0f172a]">{service.name}</strong>.
              </p>
            </div>

            {/* Retrieved checklist */}
            <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 text-left space-y-2 max-w-md mx-auto text-xs">
              <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">
                Verified Records Linked:
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#e2e8f0]">
                <span className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#046a38]" />
                  Applicant Details
                </span>
                <span className="text-[11px] text-[#046a38] font-bold">100% Ready</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#e2e8f0]">
                <span className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#046a38]" />
                  Address Details
                </span>
                <span className="text-[11px] text-[#046a38] font-bold">Verified</span>
              </div>

              {service.id.includes('vehicle') && (
                <>
                  <div className="flex items-center justify-between py-1 border-b border-[#e2e8f0]">
                    <span className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#046a38]" />
                      Vehicle Details & RC
                    </span>
                    <span className="text-[11px] text-[#046a38] font-bold">Parivahan Verified</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#046a38]" />
                      Insurance & PUC Compliance
                    </span>
                    <span className="text-[11px] text-[#046a38] font-bold">Active</span>
                  </div>
                </>
              )}
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onFinished}
                className="w-full py-3 px-6 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Official Application Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
