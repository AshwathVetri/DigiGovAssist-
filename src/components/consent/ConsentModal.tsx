import React from 'react';
import { GovernmentService } from '../../types';
import { useApp } from '../../context/AppContext';
import { GovEmblem } from '../common/GovEmblem';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  User,
  Calendar,
  MapPin,
  Car,
  FileCheck2,
  Shield,
  Lock,
} from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  service: GovernmentService | null;
  onAllow: () => void;
  onCancel: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  service,
  onAllow,
  onCancel,
}) => {
  const { activeCitizen } = useApp();

  if (!isOpen || !service) return null;

  // Exact checklist requested by the prompt
  const requestedItems = [
    { label: 'Name', sub: 'Verified legal full name', value: activeCitizen.name },
    { label: 'Date of Birth', sub: 'Birth record verification', value: activeCitizen.dob },
    { label: 'Address', sub: 'Current residential address', value: `${activeCitizen.address.city}, ${activeCitizen.address.state}` },
    { label: 'Vehicle Information', sub: 'Vehicle make, model & registration', value: 'Royal Enfield Classic 350' },
    { label: 'RC', sub: 'Registration Certificate details', value: 'TN 38 BK 4920' },
    { label: 'Insurance', sub: 'Active policy record', value: 'Valid till 14 Aug 2027' },
    { label: 'PUC', sub: 'Pollution Under Control certificate', value: 'Valid till 10 Nov 2026' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a192f]/60 backdrop-blur-2xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#cbd5e1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Government Style Header */}
        <div className="bg-[#0f4477] text-white p-5 pb-4 relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/20">
              DigiGovAssist • Citizen Consent
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Permission to Use Your Information
          </h2>

          <p className="text-xs text-slate-100 mt-1 leading-relaxed">
            DigiGovAssist will use only the information required to prepare this service application.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Target Service Badge */}
          <div className="p-3 bg-[#f0f5fa] border border-[#c2d8ec] rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#64748b] uppercase">Application</span>
              <div className="font-bold text-[#0a2558]">{service.name}</div>
              <div className="text-[11px] text-[#475569]">{service.department}</div>
            </div>
            <span className="text-xs font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-1 rounded">
              DigiPro Sync
            </span>
          </div>

          {/* Requested Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0f172a] uppercase tracking-wide">
                Information requested:
              </span>
              <span className="text-[11px] text-[#046a38] font-semibold">
                Citizen: {activeCitizen.name}
              </span>
            </div>

            <div className="space-y-1.5">
              {requestedItems.map((item) => (
                <div
                  key={item.label}
                  className="p-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#046a38] shrink-0" />
                    <div>
                      <span className="font-bold text-[#0f172a]">{item.label}</span>
                      <span className="text-[11px] text-[#64748b] ml-1.5 hidden sm:inline">
                        ({item.sub})
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#0a2558] font-semibold truncate max-w-[150px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reassurance text */}
          <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-xs text-[#065f46] leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#046a38] shrink-0" />
            <p className="font-semibold">
              Your information is accessed only with your permission.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:text-[#0f172a] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onAllow}
            className="px-6 py-2 rounded-lg text-xs font-bold bg-[#0f4477] hover:bg-[#0a2558] text-white shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Allow Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};
