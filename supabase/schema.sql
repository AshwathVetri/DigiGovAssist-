-- ====================================================
-- DigiGovAssist Database Schema (PostgreSQL / Supabase)
-- ====================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    mobile TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. DigiPro Profiles (Verified citizen metadata layer)
CREATE TABLE IF NOT EXISTS digipro_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_completeness INT DEFAULT 100,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    is_prototype_data BOOLEAN DEFAULT true
);

-- 3. DigiPro Documents (Simulated verified documents)
CREATE TABLE IF NOT EXISTS digipro_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    document_number TEXT NOT NULL,
    masked_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    verification_status TEXT DEFAULT 'Verified' CHECK (verification_status IN ('Verified', 'Pending', 'Not Available')),
    available_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
    source TEXT DEFAULT 'DigiPro Prototype',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Government Services Catalog
CREATE TABLE IF NOT EXISTS government_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Transport', 'Certificates', 'Education', 'Business', 'Personal Documents')),
    eligibility TEXT NOT NULL,
    fee TEXT NOT NULL,
    processing_time TEXT NOT NULL,
    required_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    application_url TEXT,
    api_available BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'Active'
);

-- 5. Applications
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES government_services(id),
    service_name TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Draft', 'Submitted', 'In Review', 'Verification Pending', 'Approved', 'Completed', 'Rejected')),
    readiness_score INT NOT NULL,
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    autofilled_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_prototype_submission BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Application Timeline Events
CREATE TABLE IF NOT EXISTS application_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT REFERENCES applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Citizen Consents
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES government_services(id),
    service_name TEXT NOT NULL,
    status TEXT DEFAULT 'Granted' CHECK (status IN ('Granted', 'Revoked', 'Expired')),
    accessed_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    purpose TEXT NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 8. AI Conversations & Intent Audit
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_prompt TEXT NOT NULL,
    intent_detected TEXT NOT NULL,
    confidence NUMERIC(4,3),
    recommended_services JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Government Service Fees Catalog (Configurable government fee database)
CREATE TABLE IF NOT EXISTS service_fees (
    id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    fee_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    department TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'All India / Central',
    effective_from DATE DEFAULT CURRENT_DATE,
    notes TEXT
);

-- 10. Payments Table (Razorpay test integration & fee settlement)
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('created', 'pending', 'paid', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);
