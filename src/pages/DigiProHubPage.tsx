import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiProDocument } from '../types';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { DocumentViewerModal } from '../components/digipro/DocumentViewerModal';
import {
  FolderLock,
  CheckCircle2,
  FileText,
  User,
  Car,
  ShieldCheck,
  Calendar,
  Eye,
  Building2,
  ExternalLink,
  Info,
  Lock,
  MapPin,
  Check,
} from 'lucide-react';

export const DigiProHubPage: React.FC = () => {
  const { activeCitizen, activeProfile } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DigiProDocument | null>(null);

  if (!activeProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#64748b] font-sans">
        Loading DigiPro verified profile...
      </div>
    );
  }

  const { documents, vehicles, profileCompleteness, lastSync } = activeProfile;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <span className="text-[#0f4477] font-semibold">Home</span>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">DigiPro Verified Data Layer</span>
      </nav>

      {/* 2. Official Header Section */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <GovEmblem size="sm" showSealBorder={false} />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2558] tracking-tight">
                DigiPro
              </h1>
              <span className="text-xs font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                Verified Data Layer
              </span>
            </div>
            <p className="text-sm font-bold text-[#0f4477]">
              "Verified Citizen Information"
            </p>
            <p className="text-xs text-[#475569] max-w-2xl leading-relaxed">
              A government-backed citizen verification layer that aggregates and verifies your
              identity, transport, and revenue credentials with explicit consent. Enables immediate
              application preparation without repetitive uploads.
            </p>
          </div>

          {/* Prototype Data Callout Badge */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-xl text-left md:text-right space-y-1">
              <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold text-[#92400e]">
                <Info className="w-3.5 h-3.5 text-[#b45309]" />
                <span>Prototype Data</span>
              </div>
              <p className="text-[11px] text-[#78350f] max-w-xs leading-tight">
                This version uses simulated mock data to demonstrate automatic application
                preparation. In production, real DigiLocker and API Setu endpoints connect here.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Status Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Data Completeness</span>
            <div className="text-lg font-extrabold text-[#046a38] mt-0.5">{profileCompleteness}%</div>
          </div>
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Verified Citizen</span>
            <div className="font-bold text-[#0f172a] mt-0.5">{activeCitizen.name}</div>
          </div>
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Linked Documents</span>
            <div className="font-bold text-[#0f4477] mt-0.5">{documents.length} Records Active</div>
          </div>
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <span className="text-[#64748b] text-[10px] uppercase font-bold">Last Synchronization</span>
            <div className="font-bold text-[#475569] mt-0.5">{lastSync}</div>
          </div>
        </div>
      </div>

      {/* 3. Government-Style Verification Panel */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-6">
        <div className="border-b border-[#e2e8f0] pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0a2558] uppercase tracking-wide">
            Verified Citizen Information Panel
          </h2>
          <span className="text-xs text-[#046a38] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#046a38]" />
            <span>Authenticated via e-Pramaan / DigiPro</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Citizen Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Citizen Information
            </h3>

            <div className="space-y-2 text-xs">
              {/* Name */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-[#64748b] text-[10px] uppercase font-bold">Name</div>
                  <div className="text-sm font-bold text-[#0f172a]">{activeCitizen.name}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-[#64748b] text-[10px] uppercase font-bold">Date of Birth</div>
                  <div className="text-sm font-semibold text-[#0f172a]">{activeCitizen.dob}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Address */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-[#64748b] text-[10px] uppercase font-bold">Address</div>
                  <div className="text-sm font-semibold text-[#0f172a]">
                    {activeCitizen.address.city}, {activeCitizen.address.state}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {activeCitizen.address.line} - {activeCitizen.address.pincode}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Documents Availability Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Documents
            </h3>

            <div className="space-y-2 text-xs">
              {/* Aadhaar */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">Aadhaar</div>
                  <div className="text-[10px] text-[#64748b]">Unique Identification Authority of India</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2.5 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available</span>
                </div>
              </div>

              {/* Vehicle RC */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">Vehicle RC</div>
                  <div className="text-[10px] text-[#64748b]">MoRTH Parivahan Sewa (TN 38 BK 4920)</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2.5 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available</span>
                </div>
              </div>

              {/* Insurance */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">Insurance</div>
                  <div className="text-[10px] text-[#64748b]">IRDAI / Insurance Information Bureau</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2.5 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available</span>
                </div>
              </div>

              {/* PUC */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0f172a]">PUC</div>
                  <div className="text-[10px] text-[#64748b]">Automated Emission Center Portal</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2.5 py-1 rounded border border-[#bbf7d0]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Verified Document Cards Repository */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0a2558] uppercase tracking-wide">
              Document Credentials Repository ({documents.length})
            </h2>
            <p className="text-xs text-[#64748b]">
              Official credentials pulled into the DigiPro verified layer with citizen consent.
            </p>
          </div>
          <PrototypeBadge label="Prototype Data" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs hover:border-[#0f4477] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4477] bg-[#f0f5fa] px-2 py-0.5 rounded border border-[#c2d8ec]">
                    {doc.document_type}
                  </span>
                  <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0] flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    Verified
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0f172a]">{doc.document_name}</h3>

                <div className="text-xs font-mono font-semibold text-[#0a2558] bg-[#f8fafc] px-2.5 py-1 rounded border border-[#e2e8f0]">
                  {doc.masked_number}
                </div>

                <div className="text-[11px] text-[#64748b] truncate">{doc.issuer}</div>
              </div>

              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between">
                <span className="text-[10px] text-[#94a3b8]">Issued: {doc.issue_date}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="px-2.5 py-1 rounded-lg bg-[#f0f5fa] hover:bg-[#e1ecf6] text-[#0f4477] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Registered Motor Vehicles Panel */}
      {vehicles && vehicles.length > 0 && (
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#0f4477]" />
              <h2 className="text-base font-bold text-[#0a2558] uppercase tracking-wide">
                Registered Motor Vehicles ({vehicles.length})
              </h2>
            </div>
            <span className="text-xs text-[#046a38] font-bold">Parivahan Sync Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {vehicles.map((v) => (
              <React.Fragment key={v.registrationNumber}>
                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748b]">Registration</div>
                  <div className="font-bold text-[#0a2558] font-mono text-sm">{v.registrationNumber}</div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748b]">Make & Model</div>
                  <div className="font-semibold text-[#0f172a] text-sm">{v.make} {v.model}</div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748b]">Insurance Expiry</div>
                  <div className="font-semibold text-[#046a38]">{v.insuranceValidTill} (Active)</div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748b]">PUC Validity</div>
                  <div className="font-semibold text-[#046a38]">{v.pucValidTill} (Valid)</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Document Inspector Modal */}
      <DocumentViewerModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
};
