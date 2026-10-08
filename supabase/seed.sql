-- ====================================================
-- DigiGovAssist Seed Data
-- ====================================================

-- Demo User: Arjun Kumar
INSERT INTO users (id, full_name, dob, gender, mobile, email, address_line, city, state, pincode)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Arjun Kumar',
    '2004-08-15',
    'Male',
    '9876543210',
    'arjun@example.com',
    '12, Anna Nagar',
    'Coimbatore',
    'Tamil Nadu',
    '641001'
) ON CONFLICT (mobile) DO NOTHING;

-- DigiPro Profile
INSERT INTO digipro_profiles (user_id, profile_completeness, is_prototype_data)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    100,
    true
) ON CONFLICT DO NOTHING;

-- Verified Documents for Arjun
INSERT INTO digipro_documents (user_id, document_type, document_name, issuer, document_number, masked_number, issue_date, available_fields, source)
VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Aadhaar',
    'Aadhaar Card (UIDAI)',
    'Unique Identification Authority of India',
    '918237461902',
    'XXXX-XXXX-1902',
    '2015-09-10',
    '{"fullName": "Arjun Kumar", "dob": "15-08-2004", "gender": "Male", "addressLine": "12, Anna Nagar", "city": "Coimbatore", "state": "Tamil Nadu", "pincode": "641001"}'::jsonb,
    'DigiPro Prototype'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Vehicle RC',
    'Certificate of Registration (Parivahan)',
    'Ministry of Road Transport and Highways (MoRTH)',
    'TN 38 BK 4920',
    'TN 38 BK 4920',
    '2021-04-12',
    '{"registrationNumber": "TN 38 BK 4920", "vehicleMake": "Royal Enfield", "vehicleModel": "Classic 350 Dual Channel ABS", "chassisNumberMasked": "ME3U3S5C1M1029XXX", "engineNumberMasked": "UCE350E1029XXX"}'::jsonb,
    'DigiPro Prototype'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Insurance',
    'Motor Vehicle Comprehensive Insurance Policy',
    'HDFC ERGO General Insurance Company Ltd',
    'POL-98234-MOT-01',
    'POL-XXXX4-MOT-01',
    '2024-04-12',
    '{"policyNumber": "POL-98234-MOT-01", "insuredVehicle": "TN 38 BK 4920", "validTill": "11-04-2027", "status": "Active"}'::jsonb,
    'DigiPro Prototype'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'PUC',
    'Pollution Under Control (PUC) Certificate',
    'Transport Department Automated Emission Center',
    'PUC-COIM-99124',
    'PUC-XXXX-99124',
    '2026-05-15',
    '{"pucNumber": "PUC-COIM-99124", "vehicleNumber": "TN 38 BK 4920", "emissionStatus": "Pass", "validTill": "14-11-2026"}'::jsonb,
    'DigiPro Prototype'
);

-- Initial Indicative Government Service Fees
INSERT INTO service_fees (id, service_id, fee_name, amount, currency, department, state, effective_from, notes)
VALUES
(
    'fee-vahan-transfer',
    'vehicle_ownership_transfer',
    'Vehicle Ownership Transfer Fee (Smart Card RC + Postal Dispatch)',
    530.00,
    'INR',
    'Ministry of Road Transport & Highways (Parivahan)',
    'All India / Central (Rule 81 CMV Rules)',
    '2026-01-01',
    'Smart Card RC fee: ₹200, Transfer fee: ₹300, Speed post dispatch: ₹30'
),
(
    'fee-sarathi-ll',
    'learner_license',
    'Learner Licence Issue & Online Test Fee',
    200.00,
    'INR',
    'Ministry of Road Transport & Highways (Sarathi)',
    'All India / Central (Rule 81 CMV Rules)',
    '2026-01-01',
    'Learner Licence fee: ₹150, Online test fee: ₹50'
),
(
    'fee-sarathi-dl',
    'driving_license',
    'Driving Licence Issue & Practical Driving Test Fee',
    500.00,
    'INR',
    'Ministry of Road Transport & Highways (Sarathi)',
    'All India / Central (Rule 81 CMV Rules)',
    '2026-01-01',
    'Driving Licence fee: ₹200, Driving competence test fee: ₹300'
),
(
    'fee-edistrict-income',
    'income_certificate',
    'Revenue Department Processing & CSC User Charge',
    60.00,
    'INR',
    'State Revenue & Disaster Management Department',
    'State Revenue / e-District',
    '2026-01-01',
    'Statutory government fee: ₹30, CSC user facilitation: ₹30'
),
(
    'fee-edistrict-residence',
    'residence_certificate',
    'Nativity / Domicile Certificate Statutory Processing',
    60.00,
    'INR',
    'State Revenue Department',
    'State Revenue / e-District',
    '2026-01-01',
    'Statutory revenue verification charge'
),
(
    'fee-corp-birth',
    'birth_certificate',
    'Municipal Corporation Birth Search & Digitized Copy Fee',
    50.00,
    'INR',
    'Directorate of Municipal Administration',
    'Urban Local Bodies / Municipal Corporation',
    '2026-01-01',
    'Digital copy search and certified extract fee'
),
(
    'fee-udyam-msme',
    'business_registration',
    'Udyam National MSME Registration Portal Charge',
    0.00,
    'INR',
    'Ministry of Micro, Small and Medium Enterprises',
    'Government of India (Free Portal)',
    '2026-01-01',
    'Nil (Official Udyam portal registration is completely free of charge)'
)
ON CONFLICT (id) DO NOTHING;
