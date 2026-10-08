import { GovernmentService } from '../types';

export const MOCK_GOVERNMENT_SERVICES: GovernmentService[] = [
  {
    id: 'vehicle_ownership_transfer',
    name: 'Vehicle Ownership Transfer',
    department: 'Ministry of Road Transport & Highways (Parivahan)',
    description: 'Transfer vehicle registration certificate (RC) legally from seller to buyer under Form 29 & Form 30.',
    category: 'Transport',
    eligibility: 'Buyer with valid identity proof, original RC, valid insurance, and active PUC certificate.',
    fee: '₹ 530 (Smart Card RC + Transfer Fee)',
    processing_time: '7 - 10 working days',
    required_fields: [
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Residential Address',
      'Vehicle Registration Number',
      'Vehicle Make',
      'Vehicle Model',
      'Chassis Number'
    ],
    required_documents: [
      'Vehicle RC',
      'Insurance',
      'PUC',
      'Aadhaar'
    ],
    application_url: 'https://parivahan.gov.in/parivahan/en/content/transfer-ownership',
    api_available: true,
    status: 'Active',
    why_needed: 'Legal requirement within 30 days of purchasing a used vehicle to transfer liability and ownership.',
    badge: 'High Priority',
  },
  {
    id: 'vehicle_rc_verification',
    name: 'Vehicle RC Status Verification',
    department: 'Parivahan Sewa / National Register',
    description: 'Instant digital verification of motor vehicle registration status, hypothecation, blacklisting, and fitness validity.',
    category: 'Transport',
    eligibility: 'Any citizen checking vehicle details prior to financial transaction.',
    fee: 'Nil (Free Public Service)',
    processing_time: 'Instant / Real-time',
    required_fields: [
      'Vehicle Registration Number',
      'Mobile Number'
    ],
    required_documents: [
      'Vehicle RC'
    ],
    application_url: 'https://vahan.parivahan.gov.in/nrservices/',
    api_available: true,
    status: 'Active',
    why_needed: 'Check if the vehicle has pending challans, loan hypothecation, or theft FIRs before purchase.',
    badge: 'Instant Check',
  },
  {
    id: 'vehicle_insurance_verification',
    name: 'Vehicle Insurance Verification',
    department: 'Insurance Regulatory and Development Authority of India (IRDAI) / IIB',
    description: 'Verify 3rd party or comprehensive motor policy validity from central Insurance Information Bureau.',
    category: 'Transport',
    eligibility: 'Registered vehicle owner or prospective buyer.',
    fee: 'Nil (Free Public Service)',
    processing_time: 'Instant / Real-time',
    required_fields: [
      'Vehicle Registration Number',
      'Mobile Number'
    ],
    required_documents: [
      'Insurance'
    ],
    application_url: 'https://iib.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Mandatory by law to ensure the bike is insured before riding on public roads.',
    badge: 'Mandatory',
  },
  {
    id: 'vehicle_puc_verification',
    name: 'Vehicle PUC Check & Renewal',
    department: 'Automated Vehicle Emission Testing / MoRTH',
    description: 'Check validity of Pollution Under Control (PUC) certificate and locate nearest certified test center.',
    category: 'Transport',
    eligibility: 'All motor vehicles operational on Indian roads.',
    fee: '₹ 80 (For Two Wheelers at test center)',
    processing_time: 'Instant verification / 15 mins test',
    required_fields: [
      'Vehicle Registration Number',
      'Mobile Number'
    ],
    required_documents: [
      'PUC'
    ],
    application_url: 'https://vahan.parivahan.gov.in/puc/',
    api_available: true,
    status: 'Active',
    why_needed: 'Avoid heavy traffic fines (up to ₹10,000 under Motor Vehicles Act) for expired emission compliance.',
    badge: 'Mandatory',
  },
  {
    id: 'learner_license',
    name: "Learner's Licence (LLR)",
    department: 'State Transport Department / Sarathi Parivahan',
    description: 'Apply online for contactless computer-based learner licence test from home using Aadhaar authentication.',
    category: 'Transport',
    eligibility: 'Age 16+ for gearless 50cc two-wheeler; Age 18+ for light motor vehicle (LMV).',
    fee: '₹ 200 per vehicle class',
    processing_time: 'Same day (upon passing online test)',
    required_fields: [
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Residential Address',
      'Blood Group'
    ],
    required_documents: [
      'Aadhaar',
      'Address Proof'
    ],
    application_url: 'https://sarathi.parivahan.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'First mandatory legal step to learn driving before taking permanent Driving Licence test.',
    badge: 'Aadhaar e-KYC',
  },
  {
    id: 'driving_license',
    name: 'Permanent Driving Licence (DL)',
    department: 'State Transport Department / Sarathi Parivahan',
    description: 'Book driving skill test slot and convert active Learner Licence into permanent Driving Licence card.',
    category: 'Transport',
    eligibility: 'Must hold valid Learner Licence for at least 30 days and within 180 days of issue.',
    fee: '₹ 700 (Test fee + Smart card)',
    processing_time: '15 working days post practical test',
    required_fields: [
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Residential Address'
    ],
    required_documents: [
      'Aadhaar',
      'Address Proof',
      'Driving Licence'
    ],
    application_url: 'https://sarathi.parivahan.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Legal authorization to drive motor vehicles independently anywhere in India.',
    badge: 'Card Service',
  },
  {
    id: 'income_certificate',
    name: 'Income Certificate',
    department: 'Revenue Administration & Disaster Management Department',
    description: 'Official revenue document certifying family annual gross income for scholarships, fee concessions, and welfare schemes.',
    category: 'Certificates',
    eligibility: 'Permanent resident of the state needing financial proof for education or subsidies.',
    fee: '₹ 60 (e-Seva portal charge)',
    processing_time: '7 - 15 working days',
    required_fields: [
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Residential Address',
      'Occupation',
      'Annual Income'
    ],
    required_documents: [
      'Aadhaar',
      'PAN',
      'Address Proof',
      'Income Certificate'
    ],
    application_url: 'https://edistrict.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Essential for college admission scholarships, fee waivers, and government welfare benefits.',
    badge: 'Digital Signed',
  },
  {
    id: 'residence_certificate',
    name: 'Residence / Domicile Certificate',
    department: 'District Collectorate / Revenue Department',
    description: 'Certifies that an individual has been residing in a specific state/district for specified qualifying years.',
    category: 'Certificates',
    eligibility: 'Citizen residing in the state for minimum resident period (typically 5+ years).',
    fee: '₹ 60',
    processing_time: '10 - 14 working days',
    required_fields: [
      'Full Name',
      'Date of Birth',
      'Mobile Number',
      'Residential Address'
    ],
    required_documents: [
      'Aadhaar',
      'Address Proof',
      'Birth Certificate'
    ],
    application_url: 'https://edistrict.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Required for state government job quotas, local college admissions, and utility connections.',
    badge: 'Legal Proof',
  },
  {
    id: 'birth_certificate',
    name: 'Birth Certificate (Registration / Extract)',
    department: 'Civil Registration System (CRS) / Municipal Corporation',
    description: 'Official vital record certifying date, time, and parentage of birth issued by Registrar of Births and Deaths.',
    category: 'Certificates',
    eligibility: 'Parents or legal guardians of newborn or citizen seeking certified extract.',
    fee: '₹ 50 (Free within 21 days of birth)',
    processing_time: '3 - 7 working days',
    required_fields: [
      'Child Name',
      'Date of Birth',
      'Place of Birth',
      "Father's Name",
      "Mother's Name",
      'Permanent Address'
    ],
    required_documents: [
      'Aadhaar',
      'Address Proof'
    ],
    application_url: 'https://crsorgi.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Foundational legal identity proof for school admission, passport issuance, and citizenship records.',
    badge: 'Vital Record',
  },
  {
    id: 'business_registration',
    name: 'Small Business Registration (Udyam MSME)',
    department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    description: 'Instant paperless online registration for micro, small, and medium enterprises with zero government fees.',
    category: 'Business',
    eligibility: 'Any individual, proprietor, partnership, or private firm starting a commercial enterprise.',
    fee: '₹ 0 (Completely Free on official portal)',
    processing_time: 'Instant digital certificate',
    required_fields: [
      'Applicant Name',
      'Aadhaar Number',
      'PAN Number',
      'Business Name',
      'Business Address',
      'Bank Account Number'
    ],
    required_documents: [
      'Aadhaar',
      'PAN',
      'Address Proof'
    ],
    application_url: 'https://udyamregistration.gov.in',
    api_available: true,
    status: 'Active',
    why_needed: 'Avail collateral-free bank loans (CGTMSE), lower electricity tariffs, and MSME subsidy benefits.',
    badge: 'Zero Fee',
  },
];
