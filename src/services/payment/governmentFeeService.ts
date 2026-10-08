import { ServiceFeeSchedule, FeeBreakdownItem } from './types';
import { getSupabaseClient } from '../supabase/supabaseClient';

export const GOVERNMENT_FEE_DISCLAIMER =
  'Fees shown are indicative and may vary depending on the state, department, service, or applicable government rules. Verify the final amount with the concerned government authority.';

export const INDICATIVE_FEE_LABEL = 'Indicative Government Fee';

/**
 * Static baseline catalog of indicative government fees derived from official
 * gazette schedules (Central Motor Vehicles Rules 1989, State Revenue portals, etc.).
 * Configurable and independent from any payment gateway.
 */
const DEFAULT_FEE_SCHEDULES: Record<string, ServiceFeeSchedule> = {
  vehicle_ownership_transfer: {
    serviceId: 'vehicle_ownership_transfer',
    serviceName: 'Vehicle Ownership Transfer',
    department: 'Ministry of Road Transport & Highways (Parivahan)',
    state: 'All India / Central (CMVR Rule 81)',
    currency: 'INR',
    totalFee: 530,
    convenienceFee: 0,
    indicativeNotice: 'Fee varies by state/service — based on Central Motor Vehicles Rule 81 standard schedule.',
    ruleCitation: 'Rule 81, Central Motor Vehicles Rules 1989',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'rc_smart_card',
        name: 'Issue of Fresh Certificate of Registration (Smart Card)',
        amount: 200,
        description: 'Electronic chip card RC under Form 23A',
        category: 'smart_card',
      },
      {
        id: 'transfer_fee',
        name: 'Transfer of Ownership Statutory Fee',
        amount: 300,
        description: 'Notice of transfer under Form 29 & Form 30',
        category: 'statutory',
      },
      {
        id: 'speed_post',
        name: 'Postal Dispatch (Department to Citizen)',
        amount: 30,
        description: 'Secured India Post Speed Post delivery of physical smart card',
        category: 'postal',
      },
    ],
  },
  learner_license: {
    serviceId: 'learner_license',
    serviceName: "Learner's Licence (LLR)",
    department: 'Ministry of Road Transport & Highways (Sarathi)',
    state: 'All India / Central (CMVR Rule 81)',
    currency: 'INR',
    totalFee: 200,
    convenienceFee: 0,
    indicativeNotice: "Official Ministry schedule: ₹150 for licence issue + ₹50 for computerised test.",
    ruleCitation: 'Rule 81, Central Motor Vehicles Rules 1989',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'll_issue',
        name: "Learner's Licence Statutory Fee",
        amount: 150,
        description: "Statutory fee for grant or renewal of learner's licence",
        category: 'statutory',
      },
      {
        id: 'll_test',
        name: "Learner's Licence Online Test Fee",
        amount: 50,
        description: "Online computer-based road regulations test fee",
        category: 'test',
      },
    ],
  },
  driving_license: {
    serviceId: 'driving_license',
    serviceName: 'Permanent Driving Licence (DL)',
    department: 'Ministry of Road Transport & Highways (Sarathi)',
    state: 'All India / Central (CMVR Rule 81)',
    currency: 'INR',
    totalFee: 500,
    convenienceFee: 0,
    indicativeNotice: "Official Ministry schedule: ₹200 for driving licence smart card + ₹300 for competence test.",
    ruleCitation: 'Rule 81, Central Motor Vehicles Rules 1989',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'dl_card',
        name: 'Driving Licence Smart Card Fee',
        amount: 200,
        description: 'Polycarbonate optical chip driving licence card',
        category: 'smart_card',
      },
      {
        id: 'dl_test',
        name: 'Practical Driving Competence Test Fee',
        amount: 300,
        description: 'Track examination fee conducted by Motor Vehicle Inspector',
        category: 'test',
      },
    ],
  },
  income_certificate: {
    serviceId: 'income_certificate',
    serviceName: 'Income Certificate',
    department: 'State Revenue & Disaster Management Department',
    state: 'State Revenue / e-District',
    currency: 'INR',
    totalFee: 60,
    convenienceFee: 0,
    indicativeNotice: 'Fee varies by state/service — indicative e-District citizen facilitation schedule.',
    ruleCitation: 'State Citizen Service Right to Services Act',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'rev_statutory',
        name: 'Statutory Revenue Verification Charge',
        amount: 30,
        description: 'Village Administrative Officer & Revenue Inspector inquiry verification',
        category: 'statutory',
      },
      {
        id: 'csc_user',
        name: 'CSC User / Digital Gateway Facilitation',
        amount: 30,
        description: 'Citizen Service Center digitization and biometric verification',
        category: 'facilitation',
      },
    ],
  },
  residence_certificate: {
    serviceId: 'residence_certificate',
    serviceName: 'Residence / Domicile Certificate',
    department: 'State Revenue Department',
    state: 'State Revenue / e-District',
    currency: 'INR',
    totalFee: 60,
    convenienceFee: 0,
    indicativeNotice: 'Fee varies by state/service — indicative e-District fee.',
    ruleCitation: 'State Right to Services Rules',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'res_statutory',
        name: 'Revenue Processing Fee',
        amount: 60,
        description: 'Digital Nativity verification and digitally signed extract',
        category: 'statutory',
      },
    ],
  },
  birth_certificate: {
    serviceId: 'birth_certificate',
    serviceName: 'Birth Certificate Certified Copy',
    department: 'Directorate of Municipal Administration',
    state: 'Urban Local Bodies / Municipal Corporation',
    currency: 'INR',
    totalFee: 50,
    convenienceFee: 0,
    indicativeNotice: 'Registration of Births and Deaths Act schedule.',
    ruleCitation: 'RBD Act, 1969',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'birth_extract',
        name: 'Certified Digital Copy Fee',
        amount: 50,
        description: 'Official seal search and tamper-evident QR certified certificate',
        category: 'statutory',
      },
    ],
  },
  business_registration: {
    serviceId: 'business_registration',
    serviceName: 'MSME Business Registration (Udyam)',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    state: 'Government of India (Central)',
    currency: 'INR',
    totalFee: 0,
    convenienceFee: 0,
    indicativeNotice: 'Nil (Official Udyam portal registration is completely free of charge).',
    ruleCitation: 'MSMED Act 2006 Notification',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'udyam_zero',
        name: 'Government Portal Charge',
        amount: 0,
        description: 'No government fee is payable for MSME registration on Udyam',
        category: 'statutory',
      },
    ],
  },
  vehicle_rc_verification: {
    serviceId: 'vehicle_rc_verification',
    serviceName: 'Vehicle RC Status Verification',
    department: 'Ministry of Road Transport & Highways (Parivahan)',
    state: 'All India / Central',
    currency: 'INR',
    totalFee: 0,
    convenienceFee: 0,
    indicativeNotice: 'Free public search service under Parivahan citizen portal.',
    ruleCitation: 'MoRTH Open Data Directive',
    effectiveFrom: '01-01-2026',
    breakdown: [
      {
        id: 'free_check',
        name: 'Public Database Query',
        amount: 0,
        description: 'Free citizen informational lookup',
        category: 'statutory',
      },
    ],
  },
};

/**
 * Modular Government Fee Service
 * Isolates government fee calculations and catalogs from payment providers (Razorpay).
 * Can be swapped with live e-District / Bharatkosh / Parivahan Fee APIs in production.
 */
export class GovernmentFeeService {
  /**
   * Retrieves the comprehensive fee schedule for a given service.
   */
  public async getFeeForService(serviceId: string): Promise<ServiceFeeSchedule> {
    // 1. Try fetching from Supabase service_fees table if configured
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('service_fees')
          .select('*')
          .eq('service_id', serviceId);

        if (!error && data && data.length > 0) {
          const firstRow = data[0];
          const total = data.reduce((acc, row) => acc + Number(row.amount || 0), 0);
          const breakdown: FeeBreakdownItem[] = data.map((row) => ({
            id: row.id,
            name: row.fee_name,
            amount: Number(row.amount),
            description: row.notes,
            category: 'statutory',
          }));

          return {
            serviceId,
            serviceName: firstRow.fee_name,
            department: firstRow.department || 'Government Department',
            state: firstRow.state || 'All India',
            currency: firstRow.currency || 'INR',
            totalFee: total,
            convenienceFee: 0,
            indicativeNotice: INDICATIVE_FEE_LABEL,
            effectiveFrom: firstRow.effective_from || '01-01-2026',
            breakdown,
          };
        }
      } catch (err) {
        console.warn('Supabase service_fees lookup failed, falling back to local catalog:', err);
      }
    }

    // 2. Fall back to local catalog
    const schedule = DEFAULT_FEE_SCHEDULES[serviceId];
    if (schedule) {
      return schedule;
    }

    // 3. Fallback for unknown / generic service
    return {
      serviceId,
      serviceName: 'Government Service',
      department: 'Concerned Government Department',
      state: 'State / Central',
      currency: 'INR',
      totalFee: 100,
      convenienceFee: 0,
      indicativeNotice: 'Fee varies by state/service — indicative demo amount.',
      effectiveFrom: '01-01-2026',
      breakdown: [
        {
          id: 'standard_processing',
          name: 'Statutory Application Processing Fee',
          amount: 100,
          description: 'Standard departmental application fee',
          category: 'statutory',
        },
      ],
    };
  }

  /**
   * Get all registered service fee schedules
   */
  public async getAllFeeSchedules(): Promise<ServiceFeeSchedule[]> {
    return Object.values(DEFAULT_FEE_SCHEDULES);
  }

  /**
   * Formats fee amount to Indian Currency format (e.g. ₹ 530)
   */
  public formatCurrency(amount: number): string {
    return `₹ ${amount.toLocaleString('en-IN')}`;
  }
}

export const governmentFeeService = new GovernmentFeeService();
