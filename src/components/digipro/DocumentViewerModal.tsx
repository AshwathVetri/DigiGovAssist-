import React from 'react';
import { DigiProDocument } from '../../types';
import { GovEmblem } from '../common/GovEmblem';
import { PrototypeBadge } from '../common/PrototypeBadge';
import { X, ShieldCheck, FileText, CheckCircle2, Hash, Calendar, Check } from 'lucide-react';

interface DocumentViewerModalProps {
  document: DigiProDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a192f]/60 backdrop-blur-2xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#cbd5e1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0f4477] text-white p-5 flex items-center justify-between border-b border-[#0a2558]">
          <div className="flex items-center gap-2.5">
            <GovEmblem size="sm" showSealBorder={false} />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">
                {document.document_type}
              </div>
              <h3 className="text-sm font-bold text-white">{document.document_name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Issuer & Status */}
          <div className="flex items-center justify-between gap-3 p-3.5 bg-[#f8fafc] rounded-xl border border-[#cbd5e1]">
            <div>
              <div className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">
                Issuing Authority
              </div>
              <div className="text-xs font-bold text-[#0a2558]">{document.issuer}</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#046a38] bg-[#f0fdf4] px-2.5 py-1 rounded-md border border-[#bbf7d0]">
              <Check className="w-3.5 h-3.5" />
              <span>{document.verification_status}</span>
            </div>
          </div>

          {/* Meta specs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <span className="text-[10px] text-[#64748b] font-bold flex items-center gap-1">
                <Hash className="w-3 h-3 text-[#0f4477]" />
                Document Number
              </span>
              <div className="font-mono font-bold text-[#0f172a] text-sm">
                {document.masked_number}
              </div>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <span className="text-[10px] text-[#64748b] font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0f4477]" />
                Issue Date
              </span>
              <div className="font-semibold text-[#0f172a] text-sm">{document.issue_date}</div>
            </div>
          </div>

          {/* Extracted Data Fields */}
          <div>
            <h4 className="text-xs font-bold text-[#0a2558] uppercase tracking-wider mb-2">
              Extracted Data Fields (DigiPro Verified)
            </h4>
            <div className="border border-[#cbd5e1] rounded-xl overflow-hidden divide-y divide-[#e2e8f0] text-xs">
              {Object.entries(document.available_fields).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2.5 bg-white">
                  <span className="text-[#64748b] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-semibold text-[#0f172a] font-mono text-right max-w-[220px] truncate">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Notice */}
          <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b45309]" />
              <span className="font-medium text-[11px]">
                Simulated DigiPro Prototype Layer
              </span>
            </div>
            <PrototypeBadge label="Prototype Data" size="sm" variant="amber" />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0f4477] hover:bg-[#0a2558] text-white transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
