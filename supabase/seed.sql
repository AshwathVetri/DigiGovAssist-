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
