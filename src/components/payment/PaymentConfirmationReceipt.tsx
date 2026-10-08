import React from 'react';
import { Link } from 'react-router-dom';
import { GovEmblem } from '../common/GovEmblem';
import { PrototypeBadge } from '../common/PrototypeBadge';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  FileCheck2,
  QrCode,
  Info,
} from 'lucide-react';

export interface PaymentReceiptProps {
  paymentId: string;
  orderId: string;
  applicationId: string;
  serviceName: string;
  department: string;
  applicantName: string;
  amount: number;
  currency: string;
  paidAt: string;
  onContinue: () => void;
}

export const PaymentConfirmationReceipt: React.FC<PaymentReceiptProps> = ({
  paymentId,
  orderId,
  applicationId,
  serviceName,
  department,
  applicantName,
  amount,
  currency,
  paidAt,
  onContinue,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto font-sans animate-in fade-in duration-200">
      {/* 1. Official Success Banner */}
      <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-[#046a38] text-white mx-auto flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#046a38] uppercase">
            Payment Confirmed ✓
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#064e3b] tracking-tight mt-1">
            Payment Successful
          </h1>
          <p className="text-xs sm:text-sm text-[#065f46] mt-1 font-medium">
            Your statutory government service fee has been received and authenticated.
          </p>
        </div>

        {/* Mandated Test Mode Banner */}
        <div className="inline-block mx-auto mt-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
          TEST TRANSACTION — NO REAL MONEY WAS CHARGED
        </div>
      </div>

      {/* 2. Formal Government Payment Confirmation Document */}
      <div className="bg-white rounded-2xl border border-[#cbd5e1] shadow-2xs overflow-hidden">
        {/* Document Header */}
        <div className="bg-[#0a2558] text-white p-6 border-b border-[#082046] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GovEmblem size="sm" showSealBorder={false} />
            <div>
              <div className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                Digital e-Governance Gateway
              </div>
              <h2 className="text-lg font-bold">Payment Confirmation</h2>
              <p className="text-[11px] text-slate-300">
                Official Treasury e-Receipt Token
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-0.5">
            <div className="text-[10px] text-slate-300">Status</div>
            <div className="font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Payment Confirmed</span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono">Gateway: Razorpay Test Mode</div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Identification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-6 border-b border-[#e2e8f0]">
            <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-1">
              <span className="text-[11px] font-medium text-[#64748b]">Service Details:</span>
              <div className="font-bold text-[#0a2558] text-sm">{serviceName}</div>
              <div className="text-[11px] text-[#475569]">{department}</div>
            </div>

            <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] space-y-1">
              <span className="text-[11px] font-medium text-[#64748b]">Applicant Name:</span>
              <div className="font-bold text-[#0f172a] text-sm">{applicantName}</div>
              <div className="text-[11px] text-[#046a38] font-semibold">DigiPro Verified Citizen ✓</div>
            </div>
          </div>

          {/* Transaction Metadata Table */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-[#0a2558] text-xs uppercase tracking-wider">
              Transaction Details
            </h3>

            <div className="bg-[#f8fafc] rounded-xl border border-[#cbd5e1] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-[#e2e8f0]">
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#64748b] w-1/3">Application ID</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#0a2558]">{applicationId}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#64748b]">Payment ID</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-[#0f172a]">{paymentId}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#64748b]">Razorpay Order ID</td>
                    <td className="py-2.5 px-4 font-mono text-[#334155]">{orderId}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#64748b]">Payment Date & Time</td>
                    <td className="py-2.5 px-4 font-medium text-[#334155]">{paidAt}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-[#64748b]">Payment Method</td>
                    <td className="py-2.5 px-4 font-medium text-[#334155]">
                      Razorpay Test Mode (Simulated NetBanking / UPI)
                    </td>
                  </tr>
                  <tr className="bg-[#f0f5fa]">
                    <td className="py-3 px-4 font-bold text-[#0a2558] text-sm">Amount Paid</td>
                    <td className="py-3 px-4 font-extrabold text-[#046a38] text-base font-mono">
                      ₹ {amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QR Code and Verification Seal */}
          <div className="p-4 bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white border border-[#cbd5e1] rounded-lg p-1 flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-[#0a2558]" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="text-[10px] font-bold text-[#64748b] uppercase">Verification Token</div>
                <div className="font-mono text-xs font-bold text-[#0a2558]">{paymentId}</div>
                <div className="text-[11px] text-[#475569]">
                  Digitally certified for application filing under DigiGovAssist.
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e8f2fa] text-[#0f4477] border border-[#c2d8ec] text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Backend</span>
              </div>
            </div>
          </div>

          {/* Prototype Legal Disclaimer */}
          <div className="text-[11px] text-[#64748b] leading-relaxed border-t border-[#e2e8f0] pt-4">
            <p>
              <strong>Disclaimer:</strong> This is a prototype confirmation of payment generated in Razorpay Test Mode.
              In a full production deployment, funds would be credited directly to the state/central treasury consolidated fund
              (e-Treasury / Bharatkosh / State RTO receipts).
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-[#f8fafc] border-t border-[#cbd5e1] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-[#f1f5f9] text-[#0f4477] font-bold text-xs border border-[#cbd5e1] shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Confirmation</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
