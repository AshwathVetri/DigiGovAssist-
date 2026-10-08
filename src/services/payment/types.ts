import { PaymentRecord, PaymentStatus, ServiceFeeRecord } from '../../types';

export interface FeeBreakdownItem {
  id: string;
  name: string;
  amount: number;
  description?: string;
  category?: 'statutory' | 'test' | 'smart_card' | 'postal' | 'facilitation';
}

export interface ServiceFeeSchedule {
  serviceId: string;
  serviceName: string;
  department: string;
  state: string;
  currency: string;
  totalFee: number;
  breakdown: FeeBreakdownItem[];
  indicativeNotice: string;
  ruleCitation?: string;
  effectiveFrom: string;
  convenienceFee: number;
}

export interface CreateOrderParams {
  applicationId: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  currency?: string;
  citizenName?: string;
  citizenMobile?: string;
  citizenEmail?: string;
}

export interface CreateOrderResult {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isTestMode: boolean;
  isSimulated?: boolean;
  error?: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
  isSimulated?: boolean;
}

export interface VerifyPaymentResult {
  verified: boolean;
  orderId?: string;
  paymentId?: string;
  message?: string;
  error?: string;
  isTestMode?: boolean;
}

export interface PaymentReceiptData {
  receiptNumber: string;
  paymentId: string;
  orderId: string;
  applicationId: string;
  serviceName: string;
  department: string;
  applicantName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentStatus: 'Payment Confirmed' | 'Payment Pending' | 'Payment Failed';
  paymentMethod: string;
  gateway: 'Razorpay Test Gateway';
  isTestMode: boolean;
}
