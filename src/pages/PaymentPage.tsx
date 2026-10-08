import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { applicationService } from '../services/application';
import { governmentFeeService, GOVERNMENT_FEE_DISCLAIMER, INDICATIVE_FEE_LABEL } from '../services/payment/governmentFeeService';
import { razorpayService } from '../services/payment/razorpayService';
import { paymentService } from '../services/payment/paymentService';
import { ServiceFeeSchedule } from '../services/payment/types';
import { Application, PaymentRecord } from '../types';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { PaymentConfirmationReceipt } from '../components/payment/PaymentConfirmationReceipt';
import {
  ShieldCheck,
  Lock,
  ChevronLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  Building2,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { activeCitizen, markApplicationPaid, showToast } = useApp();

  const [application, setApplication] = useState<Application | null>(null);
  const [feeSchedule, setFeeSchedule] = useState<ServiceFeeSchedule | null>(null);
  const [existingPayment, setExistingPayment] = useState<PaymentRecord | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    paymentId: string;
    orderId: string;
    amount: number;
    paidAt: string;
  } | null>(null);

  // Load application and government fee schedule
  useEffect(() => {
    async function loadData() {
      if (!applicationId) return;
      setLoading(true);
      try {
        const app = await applicationService.getApplicationById(applicationId);
        setApplication(app);

        if (app) {
          const fees = await governmentFeeService.getFeeForService(app.serviceId);
          setFeeSchedule(fees);

          // Check if already paid
          const payment = await paymentService.getPaymentByApplicationId(app.id);
          if (payment) {
            setExistingPayment(payment);
            if (payment.status === 'paid') {
              setPaymentCompleted(true);
              setSuccessReceipt({
                paymentId: payment.razorpay_payment_id || payment.id,
                orderId: payment.razorpay_order_id || 'order_historical',
                amount: payment.amount,
                paidAt: payment.paid_at || payment.created_at,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error loading payment data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [applicationId]);

  // Handle "Proceed to Secure Payment"
  const handleProceedToPayment = async () => {
    if (!application || !feeSchedule) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const payableAmount = feeSchedule.totalFee;

      // 1. Frontend requests backend to create Razorpay order
      const order = await razorpayService.createOrder({
        applicationId: application.id,
        serviceId: application.serviceId,
        serviceName: application.serviceName,
        amount: payableAmount,
        currency: 'INR',
        citizenName: activeCitizen.name,
        citizenMobile: activeCitizen.mobile,
        citizenEmail: activeCitizen.email,
      });

      if (!order.success || !order.orderId) {
        setPaymentError(order.error || 'Unable to initialize secure payment order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 2. Save / update order ID in payments table
      let activePaymentRecord = existingPayment;
      if (!activePaymentRecord || activePaymentRecord.status !== 'pending') {
        activePaymentRecord = await paymentService.createPayment({
          application_id: application.id,
          user_id: activeCitizen.id,
          service_id: application.serviceId,
          service_name: application.serviceName,
          razorpay_order_id: order.orderId,
          amount: payableAmount,
          currency: 'INR',
          status: 'pending',
          notes: `${application.serviceName} statutory fee`,
        });
        setExistingPayment(activePaymentRecord);
      }

      // 3. Open Razorpay Checkout modal
      await razorpayService.openCheckout({
        order,
        serviceName: application.serviceName,
        applicationId: application.id,
        citizenName: activeCitizen.name,
        citizenEmail: activeCitizen.email,
        citizenMobile: activeCitizen.mobile,
        onSuccess: async (rzpResponse) => {
          // 4. Verify Razorpay payment signature on backend
          const verifyResult = await razorpayService.verifyPayment({
            orderId: rzpResponse.razorpay_order_id,
            paymentId: rzpResponse.razorpay_payment_id,
            signature: rzpResponse.razorpay_signature,
            isSimulated: order.isSimulated,
          });

          if (!verifyResult.verified) {
            setPaymentError('Payment verification failed on server. Transaction rejected.');
            if (activePaymentRecord) {
              await paymentService.updatePaymentStatus(activePaymentRecord.id, 'failed');
            }
            setIsProcessing(false);
            return;
          }

          // 5. Update payment record to paid
          const nowFormatted = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          if (activePaymentRecord) {
            await paymentService.updatePaymentStatus(activePaymentRecord.id, 'paid', {
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            });
          }

          // 6. Update application status
          await markApplicationPaid(application.id, rzpResponse.razorpay_payment_id, payableAmount);

          // 7. Show payment success page
          setSuccessReceipt({
            paymentId: rzpResponse.razorpay_payment_id,
            orderId: rzpResponse.razorpay_order_id,
            amount: payableAmount,
            paidAt: nowFormatted,
          });
          setPaymentCompleted(true);
          setIsProcessing(false);
          showToast('Government fee payment confirmed successfully.', 'success');
        },
        onFailure: async (errorMsg) => {
          setIsProcessing(false);
          setPaymentError('Payment was not completed. ' + (errorMsg || 'Transaction cancelled by user.'));
          if (activePaymentRecord) {
            await paymentService.updatePaymentStatus(activePaymentRecord.id, 'failed');
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      console.error('Payment checkout exception:', err);
      setIsProcessing(false);
      setPaymentError(err?.message || 'An error occurred during payment processing.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f4477] mx-auto" />
        <p className="text-xs text-[#64748b] font-medium">
          Loading official payment gateway...
        </p>
      </div>
    );
  }

  if (!application || !feeSchedule) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-xl border border-[#cbd5e1] p-8 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-[#0a2558]">Application or Fee Not Found</h2>
        <p className="text-xs text-[#64748b]">
          Could not find payment schedule for application: {applicationId}
        </p>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f4477] text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  // If payment is already completed, show Confirmation Receipt
  if (paymentCompleted && successReceipt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
          <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link to="/applications" className="text-[#0f4477] font-semibold hover:underline">
            Applications
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#1e293b] font-bold">Payment Confirmation</span>
        </nav>

        <PaymentConfirmationReceipt
          paymentId={successReceipt.paymentId}
          orderId={successReceipt.orderId}
          applicationId={application.id}
          serviceName={application.serviceName}
          department={application.department}
          applicantName={activeCitizen.name}
          amount={successReceipt.amount}
          currency="INR"
          paidAt={successReceipt.paidAt}
          onContinue={() => navigate(`/applications/${application.id}`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link to="/applications" className="text-[#0f4477] font-semibold hover:underline">
            Applications
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#1e293b] font-bold">Government Service Payment</span>
        </div>

        <Link
          to={`/applications/${application.id}`}
          className="text-xs font-semibold text-[#0f4477] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Application</span>
        </Link>
      </nav>

      {/* 2. Official Government Header Card */}
      <div className="bg-white rounded-2xl border border-[#cbd5e1] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <GovEmblem size="sm" showSealBorder={false} />
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
                Government Service Payment
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Test Mode
              </span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Official statutory fee remittance gateway under National e-Governance standards.
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 shrink-0">
            <div className="text-[10px] font-bold text-[#64748b] uppercase">Application ID</div>
            <div className="font-mono text-xs font-bold text-[#0a2558] bg-[#f0f5fa] px-2.5 py-1 rounded border border-[#c2d8ec]">
              {application.id}
            </div>
            <div className="text-[11px] font-bold text-amber-700 flex items-center sm:justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Status: Payment Pending</span>
            </div>
          </div>
        </div>

        {/* 3. Service & Applicant Identification Banner */}
        <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#cbd5e1] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Selected Service
            </span>
            <div className="font-bold text-[#0a2558] text-sm mt-0.5">
              {application.serviceName}
            </div>
            <div className="text-[11px] text-[#475569] flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#0f4477] shrink-0" />
              <span>{application.department}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
              Citizen Applicant
            </span>
            <div className="font-bold text-[#0f172a] text-sm mt-0.5">
              {activeCitizen.name}
            </div>
            <div className="text-[11px] text-[#046a38] font-semibold mt-0.5">
              DigiPro Verified Citizen (100% Document Readiness) ✓
            </div>
          </div>
        </div>

        {/* 4. Statutory Fee Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0a2558] uppercase tracking-wider">
              Statutory Fee Breakdown
            </h2>
            <span className="text-[10px] font-bold text-[#0f4477] bg-[#f0f5fa] px-2 py-0.5 rounded border border-[#c2d8ec]">
              {INDICATIVE_FEE_LABEL}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#cbd5e1] overflow-hidden text-xs shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f5fa] border-b border-[#cbd5e1] text-[#0a2558]">
                  <th className="py-2.5 px-4 font-bold">Item Description</th>
                  <th className="py-2.5 px-4 font-bold text-center w-28">Category</th>
                  <th className="py-2.5 px-4 font-bold text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {feeSchedule.breakdown.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8fafc]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0f172a]">{item.name}</div>
                      {item.description && (
                        <div className="text-[11px] text-[#64748b] mt-0.5">{item.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize border border-slate-200">
                        {item.category || 'statutory'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#0f172a]">
                      ₹ {item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Payment Summary Box */}
            <div className="bg-[#f8fafc] border-t-2 border-[#cbd5e1] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Government Service Fee</span>
                <span className="font-mono font-semibold">₹ {feeSchedule.totalFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Convenience Fee (National Portal Promotion)</span>
                <span className="font-mono font-semibold text-[#046a38]">₹ 0</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#cbd5e1] text-sm font-bold text-[#0a2558]">
                <span>Total Payable</span>
                <span className="font-mono text-base font-black text-[#046a38]">
                  ₹ {feeSchedule.totalFee.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Error Alert (When payment fails) */}
        {paymentError && (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-800 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Payment was not completed.</span>
            </div>
            <p className="leading-relaxed pl-6">{paymentError}</p>
            <div className="pl-6 pt-1">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Security Notice & Mandated Disclaimers */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#f0f5fa] border border-[#c2d8ec] text-xs text-[#0f4477] flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#0f4477] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Secure Processing Notice:</strong> Payment is being processed through{' '}
              <strong>Razorpay Test Mode</strong>. No real credit card or bank balance will be charged.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
            <div>
              <strong>Government Fee Disclaimer:</strong> {GOVERNMENT_FEE_DISCLAIMER}
            </div>
          </div>
        </div>

        {/* 7. Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e2e8f0]">
          <Link
            to={`/applications/${application.id}`}
            className="text-xs font-semibold text-[#64748b] hover:text-[#0a2558] transition-colors order-2 sm:order-1"
          >
            Cancel and Return to Application
          </Link>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleProceedToPayment}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0f4477] hover:bg-[#0a2558] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer order-1 sm:order-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Connecting to Payment Gateway...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Secure Payment (₹ {feeSchedule.totalFee.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
