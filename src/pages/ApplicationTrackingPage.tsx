import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { applicationService } from '../services/application';
import { Application } from '../types';
import { GovEmblem } from '../components/common/GovEmblem';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { Timeline } from '../components/common/Timeline';
import { ReadinessBar } from '../components/common/ReadinessBar';
import {
  ChevronLeft,
  Printer,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileText,
  QrCode,
  Info,
} from 'lucide-react';

export const ApplicationTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast, activeCitizen } = useApp();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadApp() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await applicationService.getApplicationById(id);
        setApplication(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [id]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadAck = () => {
    showToast('Official application acknowledgment slip generated.', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f4477] mx-auto" />
        <p className="text-xs text-[#64748b] font-medium">
          Retrieving official application tracking record...
        </p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-xl border border-[#cbd5e1] p-8 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-[#0a2558]">Application Record Not Found</h2>
        <p className="text-xs text-[#64748b]">
          No record found in central tracking repository for identifier: {id}
        </p>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f4477] text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Applications</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
          <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link to="/applications" className="text-[#0f4477] font-semibold hover:underline">
            Applications
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#1e293b] font-bold font-mono">{application.id}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAck}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#f8fafc] text-[#0f4477] font-bold text-xs border border-[#cbd5e1] shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Slip</span>
          </button>
          <button
            onClick={handlePrintReceipt}
            className="px-3.5 py-2 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* 2. Official Application Tracking Header Card */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GovEmblem size="sm" showSealBorder={false} />
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
                Application Status
              </h1>
              <PrototypeBadge label="Tracking Gateway" size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono text-xs font-bold text-[#0a2558] bg-[#f0f5fa] px-3 py-1 rounded border border-[#c2d8ec]">
                Application ID: {application.id}
              </span>
              {application.paymentStatus === 'pending' || application.status === 'Payment Pending' ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Payment Pending: ₹ {application.feeAmount || 530}</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#046a38]"></span>
                  <span>Payment Completed ✓ (Ready for Government Submission)</span>
                </span>
              )}
            </div>

            <div className="text-lg font-bold text-[#0f172a] pt-1">
              {application.serviceName}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0f4477]" />
                <span>{application.department}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#64748b]" />
                <span>{application.submittedAt ? `Submitted: ${application.submittedAt}` : `Updated: ${application.updatedAt}`}</span>
              </div>
              {application.paymentStatus === 'paid' && (
                <>
                  <span>•</span>
                  <Link
                    to={`/payment/${application.id}`}
                    className="text-xs font-bold text-[#0f4477] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Payment Confirmation</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Action Box / QR Simulation */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {application.paymentStatus === 'pending' || application.status === 'Payment Pending' ? (
              <Link
                to={`/payment/${application.id}`}
                className="px-4 py-2.5 rounded-xl bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Pay Fee Now (Razorpay Test Mode)</span>
              </Link>
            ) : null}

            <div className="bg-[#f8fafc] border border-[#cbd5e1] p-3 rounded-xl flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-[#cbd5e1] rounded p-1 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-[#0a2558]" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-[10px] font-bold text-[#64748b] uppercase">Verification Token</div>
                <div className="font-mono text-xs font-bold text-[#0a2558]">{application.id}</div>
                <div className="text-[10px] text-[#046a38] font-semibold">DigiPro Verified ✓</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Formal Government Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Official Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <h2 className="text-xs font-bold text-[#0a2558] uppercase tracking-wider">
                Official Application Timeline
              </h2>
              <span className="text-[11px] text-[#046a38] font-bold">
                Live State Tracking
              </span>
            </div>

            <Timeline events={application.events} />
          </div>

          {/* Right Column: Submitted Information & Acknowledgment Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="border-b border-[#e2e8f0] pb-2">
              <h2 className="text-xs font-bold text-[#0a2558] uppercase tracking-wider">
                Verified Information Snapshot
              </h2>
            </div>

            <div className="bg-[#f8fafc] rounded-xl border border-[#cbd5e1] p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <span className="font-bold text-[#0f172a]">Applicant Data</span>
                <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                  Verified via DigiPro
                </span>
              </div>

              {Object.entries(application.formData).map(([key, val]) => {
                if (key === 'declarationAccepted') return null;
                return (
                  <div key={key} className="flex items-start justify-between gap-2">
                    <span className="text-[#64748b] capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="font-semibold text-[#0f172a] text-right font-mono truncate max-w-[190px]">
                      {String(val)}
                    </span>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px]">
                <span className="text-[#64748b]">Auto-filled Fields:</span>
                <span className="font-bold text-[#0f4477]">
                  {application.autofilledFields.length} verified fields
                </span>
              </div>
            </div>

            {/* Prototype Notice */}
            <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
              <div>
                <strong>Prototype Notice:</strong> This submission was simulated and registered in
                the local prototype repository for demonstration. In production, Parivahan / e-District
                direct APIs will process this payload.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
