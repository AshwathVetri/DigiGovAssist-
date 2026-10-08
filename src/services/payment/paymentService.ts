import { PaymentRecord, PaymentStatus } from '../../types';
import { getSupabaseClient } from '../supabase/supabaseClient';

const STORAGE_KEY = 'digigov_payments';

const INITIAL_MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_rec_001',
    application_id: 'DGA-2026-00124',
    user_id: 'citizen-arjun',
    service_id: 'vehicle_ownership_transfer',
    service_name: 'Vehicle Ownership Transfer',
    razorpay_order_id: 'order_PQt9182371',
    razorpay_payment_id: 'pay_PQt9182371_ok',
    amount: 530,
    currency: 'INR',
    status: 'paid',
    created_at: '08-10-2026 10:15 AM',
    paid_at: '08-10-2026 10:18 AM',
    notes: 'Smart Card RC + Ownership Transfer Statutory Fee',
    is_test_mode: true,
  },
  {
    id: 'pay_rec_002',
    application_id: 'DGA-2026-00109',
    user_id: 'citizen-arjun',
    service_id: 'driving_license',
    service_name: 'Driving Licence (DL)',
    razorpay_order_id: 'order_DL0029124',
    razorpay_payment_id: 'pay_DL0029124_ok',
    amount: 500,
    currency: 'INR',
    status: 'paid',
    created_at: '01-10-2026 02:30 PM',
    paid_at: '01-10-2026 02:32 PM',
    notes: 'DL Smart Card + Practical Competence Test Fee',
    is_test_mode: true,
  },
];

export class PaymentService {
  private localPayments: PaymentRecord[];

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.localPayments = JSON.parse(saved);
      } catch {
        this.localPayments = [...INITIAL_MOCK_PAYMENTS];
      }
    } else {
      this.localPayments = [...INITIAL_MOCK_PAYMENTS];
      this.saveLocal();
    }
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localPayments));
    } catch (e) {
      console.warn('LocalStorage save failed for payments:', e);
    }
  }

  /**
   * Create a new payment record in database / prototype storage.
   */
  public async createPayment(record: Omit<PaymentRecord, 'id' | 'created_at'>): Promise<PaymentRecord> {
    const id = `pay_rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newPayment: PaymentRecord = {
      ...record,
      id,
      created_at: formattedDate,
      is_test_mode: true,
    };

    // 1. Try persisting to Supabase payments table
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('payments').insert({
          id: newPayment.id,
          application_id: newPayment.application_id,
          user_id: newPayment.user_id,
          service_id: newPayment.service_id,
          razorpay_order_id: newPayment.razorpay_order_id,
          razorpay_payment_id: newPayment.razorpay_payment_id,
          amount: newPayment.amount,
          currency: newPayment.currency,
          status: newPayment.status,
          created_at: new Date().toISOString(),
          paid_at: newPayment.paid_at ? new Date().toISOString() : null,
        });
      } catch (err) {
        console.warn('Supabase payments insert error (falling back to local cache):', err);
      }
    }

    // 2. Persist in local storage
    this.localPayments.unshift(newPayment);
    this.saveLocal();

    return newPayment;
  }

  /**
   * Update payment status (e.g. to 'paid', 'failed', 'cancelled').
   */
  public async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    details?: {
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }
  ): Promise<PaymentRecord | null> {
    const target = this.localPayments.find((p) => p.id === id || p.razorpay_order_id === id);
    if (!target) return null;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    target.status = status;
    if (status === 'paid') {
      target.paid_at = formattedDate;
    }
    if (details?.razorpay_payment_id) {
      target.razorpay_payment_id = details.razorpay_payment_id;
    }
    if (details?.razorpay_order_id) {
      target.razorpay_order_id = details.razorpay_order_id;
    }
    if (details?.razorpay_signature) {
      target.razorpay_signature = details.razorpay_signature;
    }

    // Update in Supabase if connected
    const client = getSupabaseClient();
    if (client) {
      try {
        await client
          .from('payments')
          .update({
            status,
            paid_at: status === 'paid' ? new Date().toISOString() : null,
            razorpay_payment_id: target.razorpay_payment_id,
          })
          .eq('id', target.id);
      } catch (err) {
        console.warn('Supabase payment update error:', err);
      }
    }

    this.saveLocal();
    return target;
  }

  /**
   * Get payment by Application ID
   */
  public async getPaymentByApplicationId(applicationId: string): Promise<PaymentRecord | null> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('payments')
          .select('*')
          .eq('application_id', applicationId)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            application_id: data.application_id,
            user_id: data.user_id,
            service_id: data.service_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            amount: Number(data.amount),
            currency: data.currency || 'INR',
            status: data.status,
            created_at: data.created_at,
            paid_at: data.paid_at,
            is_test_mode: true,
          };
        }
      } catch (err) {
        console.warn('Supabase payment query failed:', err);
      }
    }

    return this.localPayments.find((p) => p.application_id === applicationId) || null;
  }

  /**
   * Get all payments for a citizen user
   */
  public async getPaymentsForUser(userId: string): Promise<PaymentRecord[]> {
    return this.localPayments.filter((p) => p.user_id === userId);
  }

  /**
   * Get all payments across the portal
   */
  public async getAllPayments(): Promise<PaymentRecord[]> {
    return [...this.localPayments];
  }
}

export const paymentService = new PaymentService();
