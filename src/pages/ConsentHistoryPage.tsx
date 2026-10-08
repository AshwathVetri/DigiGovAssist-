import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Lock,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const ConsentHistoryPage: React.FC = () => {
  const { consents, revokeConsent, activeCitizen } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">Citizen Consent Audit Log</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
              Consent History & Audit Log
            </h1>
            <PrototypeBadge label="Privacy Framework" size="sm" />
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Citizen data sovereignty: Review and revoke verified data access permissions granted by{' '}
            <strong>{activeCitizen.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#065f46] bg-[#f0fdf4] px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
          <ShieldCheck className="w-4 h-4 text-[#046a38]" />
          <span>DPDP Act Architecture Compliant</span>
        </div>
      </div>

      {/* 3. Privacy Assurance Explanatory Box */}
      <div className="bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] p-4 text-xs text-[#1e3a5f] space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-[#0a2558]">
          <Lock className="w-4 h-4 text-[#0f4477]" />
          <span>Explicit Permission Rule: "Your information is accessed only with your permission."</span>
        </div>
        <p className="leading-relaxed text-[#334155]">
          Government services cannot access your DigiPro information without your affirmative,
          explicit consent. Every access request is bound to a single purpose and logged below with
          an immutable timestamp. You retain the right to revoke active permissions at any moment.
        </p>
      </div>

      {/* 4. Consents List */}
      <div className="space-y-4">
        {consents.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-12 text-center text-xs text-[#64748b]">
            No consent authorizations recorded yet.
          </div>
        ) : (
          consents.map((item) => {
            const isGranted = item.status === 'Granted';

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#cbd5e1] p-5 shadow-2xs hover:border-[#0f4477] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
                  <div>
                    <span className="font-mono text-[10px] text-[#64748b] font-bold uppercase">
                      ID: {item.id}
                    </span>
                    <h3 className="text-base font-bold text-[#0a2558]">{item.serviceName}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                        isGranted
                          ? 'bg-[#f0fdf4] text-[#065f46] border-[#bbf7d0]'
                          : 'bg-[#f1f5f9] text-[#64748b] border-[#cbd5e1]'
                      }`}
                    >
                      {isGranted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#94a3b8]" />
                      )}
                      <span>{item.status}</span>
                    </span>

                    {isGranted && (
                      <button
                        onClick={() => revokeConsent(item.id)}
                        className="text-xs font-bold text-[#b91c1c] hover:text-white hover:bg-[#b91c1c] px-3 py-1 rounded-lg border border-[#fca5a5] transition-colors cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>

                {/* Purpose & Dates */}
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-[#64748b] font-bold uppercase text-[10px]">
                      Authorized Purpose:
                    </span>
                    <p className="text-[#0f172a] font-medium mt-0.5">{item.purpose}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[#64748b] pt-1 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>Granted: {item.grantedAt}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>Expires: {item.expiresAt}</span>
                    </div>
                  </div>
                </div>

                {/* Accessed Data Fields */}
                <div className="pt-2 border-t border-[#f1f5f9]">
                  <div className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider mb-2">
                    Verified Citizen Data Accessed:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.accessedData.map((field) => (
                      <span
                        key={field}
                        className="text-[11px] font-semibold text-[#0a2558] bg-[#f0f5fa] px-2.5 py-1 rounded-md border border-[#c2d8ec]"
                      >
                        ✓ {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
