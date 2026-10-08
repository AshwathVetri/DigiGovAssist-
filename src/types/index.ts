// ====================================================
// Citizen & DigiPro Types
// ====================================================

export interface Address {
  line: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Citizen {
  id: string;
  name: string;
  dob: string; // DD-MM-YYYY
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  address: Address;
  occupation?: string;
  guardianName?: string;
}

export interface DigiProDocument {
  id: string;
  document_type: string;
  document_name: string;
  issuer: string;
  document_number: string;
  masked_number: string;
  issue_date: string;
  expiry_date?: string;
  verification_status: 'Verified' | 'Pending' | 'Not Available';
  available_fields: Record<string, string | number | boolean>;
  source: 'DigiPro Prototype';
}

export interface DigiProProfile {
  userId: string;
  profileCompleteness: number; // e.g. 95%
  verifiedAt: string;
  lastSync: string;
  documents: DigiProDocument[];
  citizen: Citizen;
  vehicles?: {
    registrationNumber: string;
    make: string;
    model: string;
    type: string;
    chassisNumberMasked: string;
    engineNumberMasked: string;
    rcValidTill: string;
    insurancePolicyNumber: string;
    insuranceValidTill: string;
    pucCertificateNumber: string;
    pucValidTill: string;
  }[];
}

// ====================================================
// Government Service & Requirements Types
// ====================================================

export type ServiceCategory = 
  | 'Transport' 
  | 'Certificates' 
  | 'Education' 
  | 'Business' 
  | 'Personal Documents';

export interface GovernmentService {
  id: string;
  name: string;
  department: string;
  description: string;
  category: ServiceCategory;
  eligibility: string;
  fee: string;
  processing_time: string;
  required_fields: string[];
  required_documents: string[];
  application_url?: string;
  api_available: boolean;
  status: 'Active' | 'Beta' | 'Maintenance';
  why_needed?: string;
  badge?: string;
}

export interface RequirementCheck {
  key: string;
  label: string;
  isDocument: boolean;
  isAvailable: boolean;
  sourceDocument?: string;
  valueSnippet?: string;
}

export interface ServiceReadiness {
  serviceId: string;
  totalRequirements: number;
  availableRequirements: number;
  percentage: number;
  checks: RequirementCheck[];
  missingItems: string[];
}

// ====================================================
// Consent Types
// ====================================================

export interface ConsentRequest {
  serviceId: string;
  serviceName: string;
  department: string;
  requestedFields: {
    key: string;
    label: string;
    category: string;
    description: string;
  }[];
  requestedDocuments: string[];
  purpose: string;
  validityDuration: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  grantedAt: string;
  expiresAt: string;
  status: 'Granted' | 'Revoked' | 'Expired';
  accessedData: string[];
  purpose: string;
}

// ====================================================
// Application & Timeline Types
// ====================================================

export type ApplicationStatus = 
  | 'Draft'
  | 'Payment Pending'
  | 'Submitted'
  | 'In Review'
  | 'Verification Pending'
  | 'Approved'
  | 'Completed'
  | 'Rejected';

export type PaymentStatus = 
  | 'created' 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'cancelled';

export interface PaymentRecord {
  id: string; // e.g. pay_rec_xxx
  application_id: string;
  user_id: string;
  service_id: string;
  service_name?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  paid_at?: string;
  notes?: string;
  is_test_mode?: boolean;
}

export interface ServiceFeeRecord {
  id: string;
  service_id: string;
  fee_name: string;
  amount: number;
  currency: string;
  department: string;
  state: string;
  effective_from: string;
  notes: string;
}

export interface ApplicationEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Application {
  id: string; // e.g. DGA-2026-00124
  userId: string;
  serviceId: string;
  serviceName: string;
  department: string;
  status: ApplicationStatus;
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  feeAmount?: number;
  readinessScore: number;
  submittedAt?: string;
  updatedAt: string;
  formData: Record<string, any>;
  autofilledFields: string[];
  events: ApplicationEvent[];
  isPrototypeSubmission: boolean;
  notes?: string;
}

// ====================================================
// AI Intent & Chat Types
// ====================================================

export interface AIIntent {
  intentKey: string;
  confidence: number;
  situationTitle: string;
  explanation: string;
  recommendedServiceIds: string[];
  follow_up_required?: boolean;
  followUpPrompt?: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: AIIntent;
}
