import { ConsentRecord } from '../types';

export const INITIAL_MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: 'cst-001',
    userId: 'citizen-arjun',
    serviceId: 'vehicle_ownership_transfer',
    serviceName: 'Vehicle Ownership Transfer',
    grantedAt: '08-10-2026 11:30 AM',
    expiresAt: '08-11-2026 11:30 AM',
    status: 'Granted',
    accessedData: [
      'Full Name',
      'Date of Birth',
      'Residential Address',
      'Vehicle RC (TN 38 BK 4920)',
      'Vehicle Insurance Policy',
      'PUC Certificate'
    ],
    purpose: 'Automatic population of Parivahan Form 29 & Form 30 vehicle transfer application.',
  },
  {
    id: 'cst-002',
    userId: 'citizen-arjun',
    serviceId: 'income_certificate',
    serviceName: 'Income Certificate',
    grantedAt: '05-06-2025 11:15 AM',
    expiresAt: '05-07-2025 11:15 AM',
    status: 'Expired',
    accessedData: [
      'Full Name',
      'Date of Birth',
      'Address Proof (Electricity Bill)',
      'PAN Card Details'
    ],
    purpose: 'e-Seva verification of residency and annual family gross income statement.',
  },
  {
    id: 'cst-003',
    userId: 'citizen-arjun',
    serviceId: 'learner_license',
    serviceName: "Learner's Licence (LLR)",
    grantedAt: '12-01-2023 10:10 AM',
    expiresAt: '12-02-2023 10:10 AM',
    status: 'Expired',
    accessedData: [
      'Full Name',
      'Date of Birth',
      'Aadhaar e-KYC',
      'Residential Address'
    ],
    purpose: 'Sarathi portal biometric and age proof validation for contactless learner test.',
  },
];
