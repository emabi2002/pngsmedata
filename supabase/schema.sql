-- SMEC MSME Registry Database Schema
-- PNG National MSME Database Platform - Climate FIRST Initiative
-- Version: 1.0
-- Created: February 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE ownership_type AS ENUM ('sole_proprietor', 'partnership', 'company', 'cooperative', 'association');
CREATE TYPE business_size AS ENUM ('micro', 'small', 'medium');
CREATE TYPE msme_status AS ENUM ('draft', 'submitted', 'under_review', 'verified', 'active', 'suspended', 'inactive');
CREATE TYPE green_category AS ENUM ('emerging', 'transitioning', 'green_ready', 'green_certified');
CREATE TYPE energy_source AS ENUM ('grid', 'solar', 'diesel', 'hydro', 'mixed', 'none');
CREATE TYPE waste_management AS ENUM ('none', 'basic', 'recycling', 'comprehensive');
CREATE TYPE water_management AS ENUM ('none', 'basic', 'conservation', 'recycling');
CREATE TYPE climate_risk AS ENUM ('low', 'medium', 'high');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE id_type AS ENUM ('national_id', 'passport', 'drivers_license');
CREATE TYPE document_type AS ENUM ('ipa_certificate', 'irc_certificate', 'tin_certificate', 'business_license', 'owner_id', 'bank_statement', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE account_type AS ENUM ('savings', 'current', 'business');
CREATE TYPE program_type AS ENUM ('training', 'incubation', 'grant', 'mentorship', 'market_linkage', 'technical_assistance');
CREATE TYPE program_status AS ENUM ('planned', 'active', 'completed', 'cancelled');
CREATE TYPE participation_status AS ENUM ('enrolled', 'active', 'completed', 'dropped');
CREATE TYPE finance_product AS ENUM ('loan', 'grant', 'equity', 'guarantee', 'green_finance');
CREATE TYPE finance_status AS ENUM ('referred', 'in_progress', 'approved', 'disbursed', 'rejected');
CREATE TYPE readiness_rating AS ENUM ('not_ready', 'developing', 'ready', 'bankable');
CREATE TYPE user_role AS ENUM ('admin', 'smec_officer', 'provincial_officer', 'partner', 'readonly');
CREATE TYPE audit_action AS ENUM ('created', 'updated', 'status_changed', 'document_added', 'verified', 'program_enrolled');
CREATE TYPE finance_type AS ENUM ('working_capital', 'equipment', 'expansion', 'startup');
CREATE TYPE market_access_type AS ENUM ('local', 'provincial', 'national', 'export');

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'readonly',
    province_id TEXT,
    organization_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MSMES TABLE (Core Registry)
-- =====================================================

CREATE TABLE msmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number TEXT UNIQUE NOT NULL,

    -- Basic Information
    business_name TEXT NOT NULL,
    trading_name TEXT,
    ownership_type ownership_type NOT NULL,
    date_established DATE,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Registration Numbers
    ipa_number TEXT,
    irc_number TEXT,
    tin_number TEXT,
    smec_membership_number TEXT,

    -- Classification
    sector_id TEXT NOT NULL,
    sector_name TEXT NOT NULL,
    sub_sector_id TEXT,
    sub_sector_name TEXT,
    products_services TEXT[] NOT NULL DEFAULT '{}',
    business_size business_size NOT NULL,
    annual_revenue NUMERIC,
    employee_count INTEGER NOT NULL DEFAULT 1,

    -- Contact
    primary_phone TEXT NOT NULL,
    secondary_phone TEXT,
    email TEXT,
    website TEXT,

    -- Location
    province_id TEXT NOT NULL,
    district_id TEXT,
    llg TEXT,
    ward TEXT,
    village TEXT,
    street_address TEXT,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Inclusion Attributes
    women_ownership_percentage INTEGER NOT NULL DEFAULT 0 CHECK (women_ownership_percentage >= 0 AND women_ownership_percentage <= 100),
    youth_ownership_percentage INTEGER NOT NULL DEFAULT 0 CHECK (youth_ownership_percentage >= 0 AND youth_ownership_percentage <= 100),
    pwd_ownership_percentage INTEGER NOT NULL DEFAULT 0 CHECK (pwd_ownership_percentage >= 0 AND pwd_ownership_percentage <= 100),
    is_women_led BOOLEAN NOT NULL DEFAULT false,
    is_youth_led BOOLEAN NOT NULL DEFAULT false,
    has_pwd_ownership BOOLEAN NOT NULL DEFAULT false,

    -- Green Profile
    has_green_products BOOLEAN NOT NULL DEFAULT false,
    green_products_description TEXT,
    energy_source energy_source NOT NULL DEFAULT 'none',
    waste_management waste_management NOT NULL DEFAULT 'none',
    water_management water_management NOT NULL DEFAULT 'none',
    climate_risk_exposure climate_risk NOT NULL DEFAULT 'low',
    green_category green_category NOT NULL DEFAULT 'emerging',
    green_score INTEGER NOT NULL DEFAULT 0 CHECK (green_score >= 0 AND green_score <= 100),
    last_green_assessment_date DATE,

    -- Banking
    has_bank_account BOOLEAN NOT NULL DEFAULT false,
    bank_name TEXT,
    account_type account_type,
    mobile_money_provider TEXT,

    -- Status & Verification
    status msme_status NOT NULL DEFAULT 'draft',
    verification_date DATE,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,

    -- Consent
    data_consent_given BOOLEAN NOT NULL DEFAULT false,
    data_consent_date DATE,
    marketing_consent_given BOOLEAN NOT NULL DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Create index for common queries
CREATE INDEX idx_msmes_status ON msmes(status);
CREATE INDEX idx_msmes_province ON msmes(province_id);
CREATE INDEX idx_msmes_sector ON msmes(sector_id);
CREATE INDEX idx_msmes_business_size ON msmes(business_size);
CREATE INDEX idx_msmes_women_led ON msmes(is_women_led);
CREATE INDEX idx_msmes_youth_led ON msmes(is_youth_led);
CREATE INDEX idx_msmes_green_category ON msmes(green_category);

-- =====================================================
-- MSME OWNERS TABLE
-- =====================================================

CREATE TABLE msme_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    gender gender_type NOT NULL,
    date_of_birth DATE,
    phone TEXT NOT NULL,
    email TEXT,
    ownership_percentage INTEGER NOT NULL CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
    is_youth BOOLEAN NOT NULL DEFAULT false,
    is_pwd BOOLEAN NOT NULL DEFAULT false,
    id_type id_type,
    id_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_msme_owners_msme ON msme_owners(msme_id);

-- =====================================================
-- MSME DOCUMENTS TABLE
-- =====================================================

CREATE TABLE msme_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    status document_status NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_msme_documents_msme ON msme_documents(msme_id);
CREATE INDEX idx_msme_documents_status ON msme_documents(status);

-- =====================================================
-- MSME NEEDS ASSESSMENTS TABLE
-- =====================================================

CREATE TABLE msme_needs_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID UNIQUE NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    finance_need BOOLEAN NOT NULL DEFAULT false,
    finance_amount NUMERIC,
    finance_type finance_type,
    market_access_need BOOLEAN NOT NULL DEFAULT false,
    market_access_type market_access_type,
    skills_training_need BOOLEAN NOT NULL DEFAULT false,
    skills_training_areas TEXT[],
    equipment_need BOOLEAN NOT NULL DEFAULT false,
    equipment_type TEXT,
    technology_need BOOLEAN NOT NULL DEFAULT false,
    technology_type TEXT,
    other_needs TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROGRAMS TABLE
-- =====================================================

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    program_type program_type NOT NULL,
    provider TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status program_status NOT NULL DEFAULT 'planned',
    target_sectors TEXT[],
    target_provinces TEXT[],
    eligibility_criteria TEXT,
    max_participants INTEGER,
    current_participants INTEGER NOT NULL DEFAULT 0,
    is_focused_on_women BOOLEAN NOT NULL DEFAULT false,
    is_focused_on_youth BOOLEAN NOT NULL DEFAULT false,
    is_focused_on_green BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_programs_status ON programs(status);

-- =====================================================
-- MSME PROGRAM PARTICIPATIONS TABLE
-- =====================================================

CREATE TABLE msme_program_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status participation_status NOT NULL DEFAULT 'enrolled',
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(msme_id, program_id)
);

CREATE INDEX idx_program_participations_msme ON msme_program_participations(msme_id);
CREATE INDEX idx_program_participations_program ON msme_program_participations(program_id);

-- =====================================================
-- FINANCE REFERRALS TABLE
-- =====================================================

CREATE TABLE finance_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    product_type finance_product NOT NULL,
    amount NUMERIC,
    referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status finance_status NOT NULL DEFAULT 'referred',
    readiness_rating readiness_rating NOT NULL DEFAULT 'not_ready',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_finance_referrals_msme ON finance_referrals(msme_id);
CREATE INDEX idx_finance_referrals_status ON finance_referrals(status);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    msme_id UUID NOT NULL REFERENCES msmes(id) ON DELETE CASCADE,
    action audit_action NOT NULL,
    field TEXT,
    old_value TEXT,
    new_value TEXT,
    user_id UUID REFERENCES users(id),
    user_name TEXT NOT NULL,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_msme ON audit_logs(msme_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- =====================================================
-- VIEWS FOR DASHBOARD STATISTICS
-- =====================================================

CREATE VIEW msme_statistics AS
SELECT
    COUNT(*) as total_msmes,
    COUNT(*) FILTER (WHERE status = 'active') as active_msmes,
    COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review')) as pending_verification,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as new_this_month,
    COUNT(*) FILTER (WHERE business_size = 'micro') as micro_count,
    COUNT(*) FILTER (WHERE business_size = 'small') as small_count,
    COUNT(*) FILTER (WHERE business_size = 'medium') as medium_count,
    COUNT(*) FILTER (WHERE is_women_led = true) as women_led_count,
    COUNT(*) FILTER (WHERE is_youth_led = true) as youth_led_count,
    COUNT(*) FILTER (WHERE has_pwd_ownership = true) as pwd_ownership_count,
    COUNT(*) FILTER (WHERE green_category IN ('green_ready', 'green_certified')) as green_ready_count
FROM msmes;

CREATE VIEW msme_by_province AS
SELECT
    province_id,
    COUNT(*) as count
FROM msmes
WHERE status != 'inactive'
GROUP BY province_id
ORDER BY count DESC;

CREATE VIEW msme_by_sector AS
SELECT
    sector_id,
    sector_name,
    COUNT(*) as count
FROM msmes
WHERE status != 'inactive'
GROUP BY sector_id, sector_name
ORDER BY count DESC;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate registration number
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_number INTEGER;
    new_reg_number TEXT;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

    SELECT COALESCE(MAX(CAST(SUBSTRING(registration_number FROM 11 FOR 5) AS INTEGER)), 0) + 1
    INTO sequence_number
    FROM msmes
    WHERE registration_number LIKE 'SMEC-' || year_part || '-%';

    new_reg_number := 'SMEC-' || year_part || '-' || LPAD(sequence_number::TEXT, 5, '0');

    RETURN new_reg_number;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate green score
CREATE OR REPLACE FUNCTION calculate_green_score(
    p_has_green_products BOOLEAN,
    p_energy_source energy_source,
    p_waste_management waste_management,
    p_water_management water_management,
    p_climate_risk climate_risk
)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Green products (20 points)
    IF p_has_green_products THEN score := score + 20; END IF;

    -- Energy source (25 points max)
    CASE p_energy_source
        WHEN 'solar' THEN score := score + 25;
        WHEN 'hydro' THEN score := score + 25;
        WHEN 'mixed' THEN score := score + 15;
        WHEN 'grid' THEN score := score + 10;
        WHEN 'diesel' THEN score := score + 0;
        ELSE score := score + 5;
    END CASE;

    -- Waste management (20 points max)
    CASE p_waste_management
        WHEN 'comprehensive' THEN score := score + 20;
        WHEN 'recycling' THEN score := score + 15;
        WHEN 'basic' THEN score := score + 5;
        ELSE score := score + 0;
    END CASE;

    -- Water management (20 points max)
    CASE p_water_management
        WHEN 'recycling' THEN score := score + 20;
        WHEN 'conservation' THEN score := score + 15;
        WHEN 'basic' THEN score := score + 5;
        ELSE score := score + 0;
    END CASE;

    -- Climate risk (15 points max - lower risk = higher score)
    CASE p_climate_risk
        WHEN 'low' THEN score := score + 15;
        WHEN 'medium' THEN score := score + 10;
        WHEN 'high' THEN score := score + 5;
    END CASE;

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to determine green category based on score
CREATE OR REPLACE FUNCTION determine_green_category(score INTEGER)
RETURNS green_category AS $$
BEGIN
    IF score >= 75 THEN RETURN 'green_certified';
    ELSIF score >= 50 THEN RETURN 'green_ready';
    ELSIF score >= 25 THEN RETURN 'transitioning';
    ELSE RETURN 'emerging';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER msmes_updated_at BEFORE UPDATE ON msmes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER msme_owners_updated_at BEFORE UPDATE ON msme_owners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER msme_documents_updated_at BEFORE UPDATE ON msme_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER msme_needs_assessments_updated_at BEFORE UPDATE ON msme_needs_assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER msme_program_participations_updated_at BEFORE UPDATE ON msme_program_participations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER finance_referrals_updated_at BEFORE UPDATE ON finance_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate registration number
CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.registration_number IS NULL OR NEW.registration_number = '' THEN
        NEW.registration_number := generate_registration_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER msmes_registration_number BEFORE INSERT ON msmes FOR EACH ROW EXECUTE FUNCTION set_registration_number();

-- Auto-calculate green score and category
CREATE OR REPLACE FUNCTION update_green_profile()
RETURNS TRIGGER AS $$
BEGIN
    NEW.green_score := calculate_green_score(
        NEW.has_green_products,
        NEW.energy_source,
        NEW.waste_management,
        NEW.water_management,
        NEW.climate_risk_exposure
    );
    NEW.green_category := determine_green_category(NEW.green_score);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER msmes_green_profile BEFORE INSERT OR UPDATE ON msmes FOR EACH ROW EXECUTE FUNCTION update_green_profile();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE msmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_needs_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_program_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (will be refined based on roles)
CREATE POLICY "Allow read access to msmes" ON msmes FOR SELECT USING (true);
CREATE POLICY "Allow read access to msme_owners" ON msme_owners FOR SELECT USING (true);
CREATE POLICY "Allow read access to msme_documents" ON msme_documents FOR SELECT USING (true);
CREATE POLICY "Allow read access to msme_needs_assessments" ON msme_needs_assessments FOR SELECT USING (true);
CREATE POLICY "Allow read access to programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow read access to msme_program_participations" ON msme_program_participations FOR SELECT USING (true);
CREATE POLICY "Allow read access to finance_referrals" ON finance_referrals FOR SELECT USING (true);
CREATE POLICY "Allow read access to audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow read access to users" ON users FOR SELECT USING (true);

-- Allow insert/update for authenticated users (will be refined based on roles)
CREATE POLICY "Allow insert to msmes" ON msmes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to msmes" ON msmes FOR UPDATE USING (true);
CREATE POLICY "Allow insert to msme_owners" ON msme_owners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to msme_owners" ON msme_owners FOR UPDATE USING (true);
CREATE POLICY "Allow insert to msme_documents" ON msme_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to msme_documents" ON msme_documents FOR UPDATE USING (true);
CREATE POLICY "Allow insert to msme_needs_assessments" ON msme_needs_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to msme_needs_assessments" ON msme_needs_assessments FOR UPDATE USING (true);
CREATE POLICY "Allow insert to programs" ON programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to programs" ON programs FOR UPDATE USING (true);
CREATE POLICY "Allow insert to msme_program_participations" ON msme_program_participations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to msme_program_participations" ON msme_program_participations FOR UPDATE USING (true);
CREATE POLICY "Allow insert to finance_referrals" ON finance_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to finance_referrals" ON finance_referrals FOR UPDATE USING (true);
CREATE POLICY "Allow insert to audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- =====================================================
-- SEED DATA: Programs
-- =====================================================

INSERT INTO programs (name, description, program_type, provider, start_date, end_date, status, max_participants, current_participants, is_focused_on_women, is_focused_on_youth, is_focused_on_green) VALUES
('SMEC Business Growth Program', 'Comprehensive business development program for established SMEs looking to scale operations.', 'incubation', 'SMEC', '2025-01-01', '2025-12-31', 'active', 50, 23, false, false, true),
('Women in Business Program', 'Targeted support for women-led enterprises including mentorship, training, and market linkages.', 'mentorship', 'SMEC / UN Women', '2024-01-01', '2025-06-30', 'active', 100, 78, true, false, false),
('Climate FIRST Green Enterprise Fund', 'Grant program for MSMEs adopting climate-smart practices and green technologies.', 'grant', 'GGGI / DFAT', '2025-03-01', '2027-02-28', 'planned', 200, 0, false, false, true),
('Youth Enterprise Development', 'Startup support and business skills training for young entrepreneurs under 35.', 'training', 'SMEC / ILO', '2025-02-01', '2025-08-31', 'active', 150, 45, false, true, false),
('Export Ready Program', 'Technical assistance for MSMEs seeking to enter international markets.', 'technical_assistance', 'SMEC / Trade PNG', '2025-01-15', '2025-12-15', 'active', 30, 12, false, false, false);

COMMENT ON TABLE msmes IS 'Core MSME registry table containing all registered enterprises';
COMMENT ON TABLE msme_owners IS 'Ownership information for each MSME, supports multiple owners';
COMMENT ON TABLE msme_documents IS 'Documents uploaded for MSME verification';
COMMENT ON TABLE programs IS 'Support programs available for MSMEs';
COMMENT ON TABLE audit_logs IS 'Complete audit trail for all MSME record changes';
