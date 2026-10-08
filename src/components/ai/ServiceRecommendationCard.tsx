import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GovernmentService, DigiProProfile } from '../../types';
import { ServiceRequirementEngine } from '../../services/government/requirementEngine';
import {
  Clock,
  Coins,
  ArrowRight,
  CheckCircle2,
  Building2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface ServiceRecommendationCardProps {
  service: GovernmentService;
  profile: DigiProProfile | null;
  onStartService: (service: GovernmentService) => void;
  index?: number;
}

export const ServiceRecommendationCard: React.FC<ServiceRecommendationCardProps> = ({
  service,
  profile,
  onStartService,
  index = 0,
}) => {
  const navigate = useNavigate();
  const readiness = ServiceRequirementEngine.calculate(service, profile);

  // Determine if this is a primary application service or a verification check
  const isPrimaryApplication =
    service.id === 'vehicle_ownership_transfer' ||
    service.id === 'driving_license' ||
    service.id === 'income_certificate' ||
    service.id === 'business_registration' ||
    service.id === 'learner_license' ||
    service.id === 'birth_certificate' ||
    service.id === 'residence_certificate';

  // Standard official requirements list mapping
  const requiredInfoList = [
    { label: 'Identity', isAvailable: true },
    { label: 'Address', isAvailable: true },
    { label: 'RC', isAvailable: service.required_documents.includes('Vehicle RC') },
    { label: 'Insurance', isAvailable: service.required_documents.includes('Insurance') },
    { label: 'PUC', isAvailable: service.required_documents.includes('PUC') },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#cbd5e1] shadow-2xs hover:border-[#0f4477] transition-all overflow-hidden flex flex-col justify-between">
      {/* Official Government Card Header */}
      <div className="p-5 pb-4 border-b border-[#e2e8f0] space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#f0f5fa] text-[#0f4477] border border-[#c2d8ec] text-[11px] font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <span className="text-[11px] font-bold text-[#0f4477] uppercase tracking-wider">
              {service.department.includes('Transport') ? 'Transport Department' : service.department}
            </span>
          </div>

          {service.badge && (
            <span className="text-[10px] font-bold text-[#92400e] bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded uppercase">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[#0a2558] leading-snug">
          {service.name}
        </h3>

        <p className="text-xs text-[#334155] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Structured Details Section */}
      <div className="p-5 pt-4 space-y-4 flex-1 text-xs">
        {isPrimaryApplication ? (
          <>
            {/* Required Information Checklist */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                Required Information:
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {requiredInfoList.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs text-[#1e293b] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Readiness Indicator */}
            <div className="p-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#065f46] uppercase tracking-wider">
                  Application Readiness
                </div>
                <div className="text-xs font-bold text-[#046a38] mt-0.5">
                  Ready for submission
                </div>
              </div>
              <div className="text-lg font-extrabold text-[#046a38]">
                {readiness.percentage}%
              </div>
            </div>

            {/* Quick Fee & Time Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#475569]">
              <div className="bg-[#f8fafc] p-2 rounded border border-[#e2e8f0]">
                <span className="text-[#64748b]">Government Fee:</span>{' '}
                <strong className="text-[#0f172a]">{service.fee}</strong>
              </div>
              <div className="bg-[#f8fafc] p-2 rounded border border-[#e2e8f0]">
                <span className="text-[#64748b]">Processing Time:</span>{' '}
                <strong className="text-[#0f172a]">{service.processing_time}</strong>
              </div>
            </div>
          </>
        ) : (
          /* Verification / Companion Service Card Body */
          <div className="space-y-3">
            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#64748b]">
                Service Specification
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">Mode:</span>
                <span className="font-bold text-[#046a38]">Online Instant Verification</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">Fee:</span>
                <span className="font-semibold text-[#0f172a]">{service.fee}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">Turnaround:</span>
                <span className="font-semibold text-[#0f172a]">{service.processing_time}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#046a38] font-semibold bg-[#f0fdf4] p-2 rounded border border-[#bbf7d0]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DigiPro citizen record verified for this service</span>
            </div>
          </div>
        )}
      </div>

      {/* Official Government Card Action Footer */}
      <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(`/services/${service.id}`)}
          className="text-xs text-[#0f4477] hover:text-[#0a2558] font-bold px-2 py-1.5 rounded transition-colors cursor-pointer"
        >
          [Check Details]
        </button>

        {isPrimaryApplication && (
          <button
            type="button"
            onClick={() => onStartService(service)}
            className="px-4 py-2 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
