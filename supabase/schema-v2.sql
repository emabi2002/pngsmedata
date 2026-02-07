-- SMEC MSME Registry Database Schema v2.0
-- PNG National MSME Database Platform - Climate FIRST Initiative
-- TOR-Compliant Schema with Survey Workflow, Configuration Layer, and Full Data Model
-- Version: 2.0
-- Created: February 2026

-- =====================================================
-- ADDITIONAL ENUM TYPES FOR TOR COMPLIANCE
-- =====================================================

CREATE TYPE formality_status AS ENUM ('formal', 'informal', 'semi_formal');
CREATE TYPE turnover_band AS ENUM ('under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', '1m_5m', 'over_5m');
CREATE TYPE age_band AS ENUM ('under_25', '25_35', '36_45', '46_55', '56_65', 'over_65');
CREATE TYPE premises_type AS ENUM ('home_based', 'market_stall', 'roadside', 'rented_shop', 'owned_premises', 'mobile', 'online_only', 'other');
CREATE TYPE market_reach AS ENUM ('local_village', 'district', 'provincial', 'national', 'export');
CREATE TYPE banking_status AS ENUM ('fully_banked', 'mobile_money_only', 'unbanked');
CREATE TYPE loan_history AS ENUM ('never_applied', 'applied_rejected', 'has_current_loan', 'repaid_previous', 'defaulted');
CREATE TYPE survey_status AS ENUM ('draft', 'submitted', 'reviewed', 'approved', 'rejected');
CREATE TYPE campaign_status AS ENUM ('planned', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE entry_mode AS ENUM ('digital_field', 'digital_office', 'paper_transcription');
CREATE TYPE sme_status_v2 AS ENUM ('draft', 'submitted', 'under_review', 'verified', 'active', 'dormant', 'closed', 'suspended');

-- =====================================================
-- CONFIGURATION TABLES (Admin-Managed)
-- =====================================================

-- MSME Definition Configuration (Rule-driven thresholds)
CREATE TABLE msme_definition_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    definition_name TEXT NOT NULL, -- 'SMEC Standard' or 'IFC/OECD Aligned'
    is_active BOOLEAN DEFAULT false,
    category TEXT NOT NULL CHECK (category IN ('micro', 'small', 'medium')),
    min_employees INTEGER DEFAULT 0,
    max_employees INTEGER,
    min_turnover NUMERIC,
    max_turnover NUMERIC,
    min_assets NUMERIC,
    max_assets NUMERIC,
    description TEXT,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Geographic Hierarchy (Region → Province → District → LLG → Ward → Village)
CREATE TABLE geo_regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_provinces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES geo_regions(id),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province_id UUID REFERENCES geo_provinces(id),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_llgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES geo_districts(id),
    code TEXT,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    llg_id UUID REFERENCES geo_llgs(id),
    code TEXT,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID REFERENCES geo_wards(id),
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sector/Subsector Configuration
CREATE TABLE config_sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE config_subsectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID REFERENCES config_sectors(id),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product/Service Categories
CREATE TABLE config_product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID REFERENCES config_sectors(id),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Needs Categories
CREATE TABLE config_support_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- finance, market_access, training, equipment, compliance
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Types Configuration
CREATE TABLE config_document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_required_for_formal BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SURVEY CAMPAIGN MANAGEMENT
-- =====================================================

CREATE TABLE survey_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status campaign_status DEFAULT 'planned',
    start_date DATE,
    end_date DATE,
    target_sme_count INTEGER,
    actual_sme_count INTEGER DEFAULT 0,
    target_provinces UUID[], -- Array of province IDs
    target_sectors UUID[], -- Array of sector IDs
    sampling_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Survey Questionnaire Versioning
CREATE TABLE survey_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES survey_campaigns(id),
    form_code TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    description TEXT,
    form_schema JSONB NOT NULL, -- JSON schema defining questions, types, validation
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(form_code, version)
);

-- Enumerator Assignments
CREATE TABLE campaign_enumerators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES survey_campaigns(id),
    user_id UUID REFERENCES users(id),
    assigned_province_id UUID REFERENCES geo_provinces(id),
    assigned_districts UUID[], -- Array of district IDs
    target_count INTEGER,
    completed_count INTEGER DEFAULT 0,
    assignment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPANDED SME MASTER PROFILE
-- =====================================================

CREATE TABLE smes_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number TEXT UNIQUE NOT NULL,

    -- Basic Information
    legal_name TEXT NOT NULL,
    trading_name TEXT,
    formality_status formality_status NOT NULL DEFAULT 'informal',

    -- Registration Identifiers (Optional for informal)
    ipa_number TEXT,
    irc_number TEXT,
    tin_number TEXT,
    business_license_number TEXT,
    smec_membership_number TEXT,

    -- Ownership Structure
    ownership_type ownership_type NOT NULL DEFAULT 'sole_proprietor',
    date_established DATE,
    years_in_operation INTEGER,

    -- Location Hierarchy
    region_id UUID REFERENCES geo_regions(id),
    province_id UUID REFERENCES geo_provinces(id) NOT NULL,
    district_id UUID REFERENCES geo_districts(id),
    llg_id UUID REFERENCES geo_llgs(id),
    ward_id UUID REFERENCES geo_wards(id),
    village_id UUID REFERENCES geo_villages(id),
    physical_address TEXT,
    postal_address TEXT,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    gps_accuracy DECIMAL(10, 2),

    -- Contact Information
    primary_phone TEXT NOT NULL,
    secondary_phone TEXT,
    email TEXT,
    website TEXT,
    social_media JSONB, -- {facebook, instagram, etc}

    -- Sectoral Classification
    sector_id UUID REFERENCES config_sectors(id) NOT NULL,
    subsector_id UUID REFERENCES config_subsectors(id),
    products_services TEXT[],
    markets_served market_reach[] DEFAULT '{local_village}',

    -- Size Classification (Auto-calculated based on config)
    employee_count INTEGER NOT NULL DEFAULT 1,
    employee_count_fulltime INTEGER,
    employee_count_parttime INTEGER,
    employee_count_seasonal INTEGER,
    turnover_band turnover_band,
    annual_turnover_estimate NUMERIC,
    calculated_size business_size, -- Auto-set by trigger

    -- Premises & Operations
    premises_type premises_type DEFAULT 'home_based',
    premises_owned BOOLEAN DEFAULT false,

    -- Demographics & GEDSI
    women_ownership_pct INTEGER DEFAULT 0 CHECK (women_ownership_pct >= 0 AND women_ownership_pct <= 100),
    youth_ownership_pct INTEGER DEFAULT 0 CHECK (youth_ownership_pct >= 0 AND youth_ownership_pct <= 100),
    pwd_ownership_pct INTEGER DEFAULT 0 CHECK (pwd_ownership_pct >= 0 AND pwd_ownership_pct <= 100),
    is_women_led BOOLEAN GENERATED ALWAYS AS (women_ownership_pct > 50) STORED,
    is_youth_led BOOLEAN GENERATED ALWAYS AS (youth_ownership_pct > 50) STORED,
    has_pwd_ownership BOOLEAN GENERATED ALWAYS AS (pwd_ownership_pct > 0) STORED,

    -- Financial Access
    banking_status banking_status DEFAULT 'unbanked',
    bank_name TEXT,
    has_mobile_money BOOLEAN DEFAULT false,
    mobile_money_provider TEXT,
    loan_history loan_history DEFAULT 'never_applied',
    current_loan_amount NUMERIC,
    finance_need_amount NUMERIC,
    finance_readiness_score INTEGER CHECK (finance_readiness_score >= 0 AND finance_readiness_score <= 100),

    -- Green Profile
    has_green_products BOOLEAN DEFAULT false,
    green_products_description TEXT,
    energy_source energy_source DEFAULT 'none',
    waste_management waste_management DEFAULT 'none',
    water_management water_management DEFAULT 'none',
    climate_risk_exposure climate_risk DEFAULT 'low',
    green_score INTEGER DEFAULT 0,
    green_category green_category DEFAULT 'emerging',

    -- Constraints & Support Needs
    key_constraints TEXT[],
    support_needs UUID[], -- References config_support_needs

    -- Status & Verification
    status sme_status_v2 DEFAULT 'draft',
    verification_date TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    last_contact_date DATE,

    -- Data Collection Info
    source_campaign_id UUID REFERENCES survey_campaigns(id),
    entry_mode entry_mode DEFAULT 'digital_field',
    collected_by UUID REFERENCES users(id),
    collection_date DATE,

    -- Privacy & Consent
    consent_given BOOLEAN DEFAULT false,
    consent_date TIMESTAMPTZ,
    consent_type TEXT, -- 'verbal', 'written', 'digital'
    data_sharing_consent BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Create indexes for common queries
CREATE INDEX idx_smes_v2_province ON smes_v2(province_id);
CREATE INDEX idx_smes_v2_sector ON smes_v2(sector_id);
CREATE INDEX idx_smes_v2_status ON smes_v2(status);
CREATE INDEX idx_smes_v2_formality ON smes_v2(formality_status);
CREATE INDEX idx_smes_v2_women_led ON smes_v2(is_women_led);
CREATE INDEX idx_smes_v2_campaign ON smes_v2(source_campaign_id);
CREATE INDEX idx_smes_v2_search ON smes_v2 USING gin(to_tsvector('english', legal_name || ' ' || COALESCE(trading_name, '')));

-- =====================================================
-- SME OWNERS/MANAGEMENT (Extended Demographics)
-- =====================================================

CREATE TABLE sme_owners_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sme_id UUID NOT NULL REFERENCES smes_v2(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    gender gender_type NOT NULL,
    age_band age_band,
    date_of_birth DATE,
    is_youth BOOLEAN GENERATED ALWAYS AS (age_band IN ('under_25', '25_35')) STORED,
    is_pwd BOOLEAN DEFAULT false,
    pwd_type TEXT,
    phone TEXT,
    email TEXT,
    ownership_percentage INTEGER NOT NULL CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    role_in_business TEXT, -- 'owner', 'manager', 'director', etc.
    education_level TEXT,
    id_type id_type,
    id_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sme_owners_sme ON sme_owners_v2(sme_id);

-- =====================================================
-- SURVEY RESPONSES
-- =====================================================

CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_form_id UUID REFERENCES survey_forms(id),
    campaign_id UUID REFERENCES survey_campaigns(id),
    sme_id UUID REFERENCES smes_v2(id), -- Linked SME (created or existing)

    -- Enumerator Info
    enumerator_id UUID REFERENCES users(id),
    entry_mode entry_mode NOT NULL,

    -- Collection Context
    collection_date DATE NOT NULL,
    collection_time TIME,
    collection_province_id UUID REFERENCES geo_provinces(id),
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),

    -- Response Data
    responses JSONB NOT NULL, -- All survey answers as JSON
    attachments TEXT[], -- File URLs
    notes TEXT,

    -- Status
    status survey_status DEFAULT 'draft',
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,

    -- Paper Entry Specific
    paper_form_number TEXT, -- Physical form reference
    transcribed_by UUID REFERENCES users(id),
    transcription_date TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_survey_responses_campaign ON survey_responses(campaign_id);
CREATE INDEX idx_survey_responses_enumerator ON survey_responses(enumerator_id);
CREATE INDEX idx_survey_responses_status ON survey_responses(status);

-- =====================================================
-- DUPLICATE DETECTION & MERGE LOG
-- =====================================================

CREATE TABLE duplicate_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sme_id_1 UUID REFERENCES smes_v2(id),
    sme_id_2 UUID REFERENCES smes_v2(id),
    similarity_score DECIMAL(5, 2), -- 0-100
    match_reasons TEXT[], -- 'name_match', 'phone_match', 'location_match'
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed_duplicate', 'not_duplicate', 'merged'
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    merged_into_sme_id UUID REFERENCES smes_v2(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE merge_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_sme_id UUID REFERENCES smes_v2(id),
    merged_sme_id UUID, -- May be deleted, so no FK
    merged_sme_data JSONB, -- Full snapshot before merge
    merge_reason TEXT,
    merged_by UUID REFERENCES users(id),
    merged_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMPREHENSIVE AUDIT LOGGING
-- =====================================================

CREATE TABLE audit_log_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES users(id),
    user_email TEXT,
    user_role TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table ON audit_log_v2(table_name);
CREATE INDEX idx_audit_log_record ON audit_log_v2(record_id);
CREATE INDEX idx_audit_log_created ON audit_log_v2(created_at DESC);

-- =====================================================
-- API ACCESS & INTEGRATION
-- =====================================================

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash TEXT UNIQUE NOT NULL, -- Hashed API key
    name TEXT NOT NULL,
    organization TEXT,
    scopes TEXT[] NOT NULL, -- 'sme:read', 'sme:write', 'stats:read', etc.
    rate_limit_per_hour INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE TABLE api_request_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DATA EXPORT JOBS
-- =====================================================

CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name TEXT NOT NULL,
    export_type TEXT NOT NULL, -- 'full_sme', 'survey_responses', 'statistics'
    format TEXT NOT NULL, -- 'csv', 'xlsx', 'json'
    filters JSONB, -- Applied filters
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    file_url TEXT,
    file_size_bytes BIGINT,
    record_count INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- =====================================================
-- DASHBOARD VIEWS FOR TOR COMPLIANCE
-- =====================================================

CREATE VIEW dashboard_kpis AS
SELECT
    COUNT(*) as total_smes,
    COUNT(*) FILTER (WHERE status = 'active') as active_smes,
    COUNT(*) FILTER (WHERE status IN ('submitted', 'under_review')) as pending_verification,
    COUNT(*) FILTER (WHERE formality_status = 'formal') as formal_smes,
    COUNT(*) FILTER (WHERE formality_status = 'informal') as informal_smes,
    COUNT(*) FILTER (WHERE is_women_led) as women_led,
    COUNT(*) FILTER (WHERE is_youth_led) as youth_led,
    COUNT(*) FILTER (WHERE has_pwd_ownership) as pwd_owned,
    COUNT(*) FILTER (WHERE green_category IN ('green_ready', 'green_certified')) as green_ready,
    COUNT(*) FILTER (WHERE banking_status = 'unbanked') as unbanked,
    COUNT(*) FILTER (WHERE finance_need_amount > 0) as finance_need_count,
    SUM(COALESCE(finance_need_amount, 0)) as total_finance_need
FROM smes_v2;

CREATE VIEW dashboard_by_province AS
SELECT
    p.id as province_id,
    p.name as province_name,
    r.name as region_name,
    COUNT(s.id) as total_count,
    COUNT(s.id) FILTER (WHERE s.status = 'active') as active_count,
    COUNT(s.id) FILTER (WHERE s.formality_status = 'formal') as formal_count,
    COUNT(s.id) FILTER (WHERE s.is_women_led) as women_led_count,
    COUNT(s.id) FILTER (WHERE s.is_youth_led) as youth_led_count
FROM geo_provinces p
LEFT JOIN geo_regions r ON p.region_id = r.id
LEFT JOIN smes_v2 s ON s.province_id = p.id
GROUP BY p.id, p.name, r.name;

CREATE VIEW dashboard_by_sector AS
SELECT
    sec.id as sector_id,
    sec.name as sector_name,
    COUNT(s.id) as total_count,
    COUNT(s.id) FILTER (WHERE s.calculated_size = 'micro') as micro_count,
    COUNT(s.id) FILTER (WHERE s.calculated_size = 'small') as small_count,
    COUNT(s.id) FILTER (WHERE s.calculated_size = 'medium') as medium_count
FROM config_sectors sec
LEFT JOIN smes_v2 s ON s.sector_id = sec.id
GROUP BY sec.id, sec.name;

CREATE VIEW campaign_progress AS
SELECT
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.target_sme_count,
    COUNT(sr.id) as responses_collected,
    COUNT(sr.id) FILTER (WHERE sr.status = 'approved') as responses_approved,
    COUNT(DISTINCT sr.enumerator_id) as active_enumerators,
    ROUND((COUNT(sr.id)::NUMERIC / NULLIF(c.target_sme_count, 0) * 100), 1) as progress_pct
FROM survey_campaigns c
LEFT JOIN survey_responses sr ON sr.campaign_id = c.id
GROUP BY c.id, c.name, c.status, c.target_sme_count;

-- =====================================================
-- FUNCTIONS FOR AUTO-CLASSIFICATION
-- =====================================================

CREATE OR REPLACE FUNCTION classify_sme_size(p_employee_count INTEGER, p_turnover_band turnover_band)
RETURNS business_size AS $$
DECLARE
    v_size business_size;
    v_config RECORD;
BEGIN
    -- Get active MSME definition config
    FOR v_config IN
        SELECT * FROM msme_definition_config
        WHERE is_active = true
        ORDER BY category DESC -- Check medium first, then small, then micro
    LOOP
        IF p_employee_count >= v_config.min_employees
           AND (v_config.max_employees IS NULL OR p_employee_count <= v_config.max_employees) THEN
            RETURN v_config.category::business_size;
        END IF;
    END LOOP;

    -- Default classification if no config matches
    IF p_employee_count <= 5 THEN RETURN 'micro';
    ELSIF p_employee_count <= 20 THEN RETURN 'small';
    ELSE RETURN 'medium';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-classify SME size
CREATE OR REPLACE FUNCTION update_sme_classification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.calculated_size := classify_sme_size(NEW.employee_count, NEW.turnover_band);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER smes_v2_classification
    BEFORE INSERT OR UPDATE ON smes_v2
    FOR EACH ROW
    EXECUTE FUNCTION update_sme_classification();

-- =====================================================
-- DUPLICATE DETECTION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION check_duplicate_sme(
    p_legal_name TEXT,
    p_phone TEXT,
    p_province_id UUID
)
RETURNS TABLE(sme_id UUID, similarity_score DECIMAL, match_reasons TEXT[]) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        (
            CASE WHEN LOWER(s.legal_name) = LOWER(p_legal_name) THEN 50 ELSE
                 SIMILARITY(LOWER(s.legal_name), LOWER(p_legal_name)) * 40 END +
            CASE WHEN s.primary_phone = p_phone THEN 30 ELSE 0 END +
            CASE WHEN s.province_id = p_province_id THEN 20 ELSE 0 END
        )::DECIMAL as score,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN LOWER(s.legal_name) = LOWER(p_legal_name) OR SIMILARITY(LOWER(s.legal_name), LOWER(p_legal_name)) > 0.6 THEN 'name_match' END,
            CASE WHEN s.primary_phone = p_phone THEN 'phone_match' END,
            CASE WHEN s.province_id = p_province_id THEN 'location_match' END
        ], NULL) as reasons
    FROM smes_v2 s
    WHERE
        SIMILARITY(LOWER(s.legal_name), LOWER(p_legal_name)) > 0.4
        OR s.primary_phone = p_phone
    ORDER BY score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_trgm for similarity matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE smes_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE sme_owners_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for different roles
CREATE POLICY "Admin full access to SMEs" ON smes_v2
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Provincial officers see their province" ON smes_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND role = 'provincial_officer'
            AND province_id::text = smes_v2.province_id::text
        )
    );

CREATE POLICY "Enumerators see their submissions" ON smes_v2
    FOR SELECT USING (
        created_by = auth.uid() OR collected_by = auth.uid()
    );

-- =====================================================
-- SEED DEFAULT CONFIGURATION DATA
-- =====================================================

-- Default MSME Definition (SMEC Standard)
INSERT INTO msme_definition_config (definition_name, is_active, category, min_employees, max_employees, description) VALUES
('SMEC Standard', true, 'micro', 1, 5, 'Micro enterprise: 1-5 employees'),
('SMEC Standard', true, 'small', 6, 20, 'Small enterprise: 6-20 employees'),
('SMEC Standard', true, 'medium', 21, 100, 'Medium enterprise: 21-100 employees');

-- Default Support Needs Categories
INSERT INTO config_support_needs (category, name, description) VALUES
('finance', 'Working Capital', 'Need for working capital or cash flow financing'),
('finance', 'Equipment Finance', 'Need for equipment purchase or lease financing'),
('finance', 'Expansion Capital', 'Need for capital to expand operations'),
('market_access', 'Local Market Linkage', 'Access to local/provincial markets'),
('market_access', 'National Market Linkage', 'Access to national markets'),
('market_access', 'Export Assistance', 'Support for export market access'),
('training', 'Financial Management', 'Training in bookkeeping and financial management'),
('training', 'Business Planning', 'Training in business planning and strategy'),
('training', 'Digital Skills', 'Training in digital marketing and e-commerce'),
('equipment', 'Production Equipment', 'Need for production/manufacturing equipment'),
('equipment', 'Technology/IT', 'Need for computers, software, digital tools'),
('compliance', 'Business Registration', 'Support for formal registration (IPA/IRC)'),
('compliance', 'Licensing', 'Support for obtaining business licenses');

-- Default Document Types
INSERT INTO config_document_types (code, name, is_required_for_formal) VALUES
('IPA_CERT', 'IPA Certificate of Incorporation', true),
('IRC_CERT', 'IRC Registration Certificate', true),
('TIN_CERT', 'TIN Certificate', true),
('BUS_LICENSE', 'Business License', false),
('OWNER_ID', 'Owner National ID/Passport', false),
('BANK_STMT', 'Bank Statement', false),
('PHOTO', 'Business Premises Photo', false);

COMMENT ON TABLE smes_v2 IS 'Core SME registry table supporting formal and informal enterprises per TOR requirements';
COMMENT ON TABLE survey_responses IS 'Survey data collection supporting both digital and paper-based entry';
COMMENT ON TABLE msme_definition_config IS 'Admin-configurable MSME classification thresholds';
