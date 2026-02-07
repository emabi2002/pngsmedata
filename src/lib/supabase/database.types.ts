export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =====================================================
// ENUM TYPES (Schema V2)
// =====================================================

export type OwnershipType = 'sole_proprietor' | 'partnership' | 'company' | 'cooperative' | 'association';
export type BusinessSize = 'micro' | 'small' | 'medium';
export type MSMEStatus = 'draft' | 'submitted' | 'under_review' | 'verified' | 'active' | 'suspended' | 'inactive';
export type GreenCategory = 'emerging' | 'transitioning' | 'green_ready' | 'green_certified';
export type EnergySource = 'grid' | 'solar' | 'diesel' | 'hydro' | 'mixed' | 'none';
export type WasteManagement = 'none' | 'basic' | 'recycling' | 'comprehensive';
export type WaterManagement = 'none' | 'basic' | 'conservation' | 'recycling';
export type ClimateRisk = 'low' | 'medium' | 'high';
export type GenderType = 'male' | 'female' | 'other';
export type IdType = 'national_id' | 'passport' | 'drivers_license';
export type DocumentType = 'ipa_certificate' | 'irc_certificate' | 'tin_certificate' | 'business_license' | 'owner_id' | 'bank_statement' | 'other';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';
export type AccountType = 'savings' | 'current' | 'business';
export type ProgramType = 'training' | 'incubation' | 'grant' | 'mentorship' | 'market_linkage' | 'technical_assistance';
export type ProgramStatus = 'planned' | 'active' | 'completed' | 'cancelled';
export type ParticipationStatus = 'enrolled' | 'active' | 'completed' | 'dropped';
export type FinanceProduct = 'loan' | 'grant' | 'equity' | 'guarantee' | 'green_finance';
export type FinanceStatus = 'referred' | 'in_progress' | 'approved' | 'disbursed' | 'rejected';
export type ReadinessRating = 'not_ready' | 'developing' | 'ready' | 'bankable';
export type UserRole = 'admin' | 'smec_officer' | 'provincial_officer' | 'partner' | 'readonly';
export type AuditAction = 'created' | 'updated' | 'status_changed' | 'document_added' | 'verified' | 'program_enrolled';
export type FinanceType = 'working_capital' | 'equipment' | 'expansion' | 'startup';
export type MarketAccessType = 'local' | 'provincial' | 'national' | 'export';

// Schema V2 Additional Types
export type FormalityStatus = 'formal' | 'informal' | 'semi_formal';
export type TurnoverBand = 'under_10k' | '10k_50k' | '50k_100k' | '100k_500k' | '500k_1m' | '1m_5m' | 'over_5m';
export type AgeBand = 'under_25' | '25_35' | '36_45' | '46_55' | '56_65' | 'over_65';
export type PremisesType = 'home_based' | 'market_stall' | 'roadside' | 'rented_shop' | 'owned_premises' | 'mobile' | 'online_only' | 'other';
export type MarketReach = 'local_village' | 'district' | 'provincial' | 'national' | 'export';
export type BankingStatus = 'fully_banked' | 'mobile_money_only' | 'unbanked';
export type LoanHistory = 'never_applied' | 'applied_rejected' | 'has_current_loan' | 'repaid_previous' | 'defaulted';
export type SurveyStatus = 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
export type CampaignStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type EntryMode = 'digital_field' | 'digital_office' | 'paper_transcription';
export type SMEStatusV2 = 'draft' | 'submitted' | 'under_review' | 'verified' | 'active' | 'dormant' | 'closed' | 'suspended';

export type Database = {
  public: {
    Tables: {
      // =====================================================
      // USERS
      // =====================================================
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          province_id: string | null;
          organization_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };

      // =====================================================
      // MSMES (V1 Schema - still supported)
      // =====================================================
      msmes: {
        Row: {
          id: string;
          registration_number: string;
          business_name: string;
          trading_name: string | null;
          ownership_type: OwnershipType;
          date_established: string | null;
          registration_date: string;
          ipa_number: string | null;
          irc_number: string | null;
          tin_number: string | null;
          smec_membership_number: string | null;
          sector_id: string;
          sector_name: string;
          sub_sector_id: string | null;
          sub_sector_name: string | null;
          products_services: string[];
          business_size: BusinessSize;
          annual_revenue: number | null;
          employee_count: number;
          primary_phone: string;
          secondary_phone: string | null;
          email: string | null;
          website: string | null;
          province_id: string;
          district_id: string | null;
          llg: string | null;
          ward: string | null;
          village: string | null;
          street_address: string | null;
          postal_code: string | null;
          latitude: number | null;
          longitude: number | null;
          women_ownership_percentage: number;
          youth_ownership_percentage: number;
          pwd_ownership_percentage: number;
          is_women_led: boolean;
          is_youth_led: boolean;
          has_pwd_ownership: boolean;
          has_green_products: boolean;
          green_products_description: string | null;
          energy_source: EnergySource;
          waste_management: WasteManagement;
          water_management: WaterManagement;
          climate_risk_exposure: ClimateRisk;
          green_category: GreenCategory;
          green_score: number;
          last_green_assessment_date: string | null;
          has_bank_account: boolean;
          bank_name: string | null;
          account_type: AccountType | null;
          mobile_money_provider: string | null;
          status: MSMEStatus;
          verification_date: string | null;
          verified_by: string | null;
          verification_notes: string | null;
          data_consent_given: boolean;
          data_consent_date: string | null;
          marketing_consent_given: boolean;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['msmes']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['msmes']['Insert']>;
      };

      // =====================================================
      // MSME OWNERS
      // =====================================================
      msme_owners: {
        Row: {
          id: string;
          msme_id: string;
          full_name: string;
          gender: GenderType;
          date_of_birth: string | null;
          phone: string;
          email: string | null;
          ownership_percentage: number;
          is_youth: boolean;
          is_pwd: boolean;
          id_type: IdType | null;
          id_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['msme_owners']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['msme_owners']['Insert']>;
      };

      // =====================================================
      // MSME DOCUMENTS
      // =====================================================
      msme_documents: {
        Row: {
          id: string;
          msme_id: string;
          document_type: DocumentType;
          name: string;
          file_url: string;
          file_size: number | null;
          status: DocumentStatus;
          verified_at: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['msme_documents']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['msme_documents']['Insert']>;
      };

      // =====================================================
      // MSME NEEDS ASSESSMENTS
      // =====================================================
      msme_needs_assessments: {
        Row: {
          id: string;
          msme_id: string;
          finance_need: boolean;
          finance_amount: number | null;
          finance_type: FinanceType | null;
          market_access_need: boolean;
          market_access_type: MarketAccessType | null;
          skills_training_need: boolean;
          skills_training_areas: string[] | null;
          equipment_need: boolean;
          equipment_type: string | null;
          technology_need: boolean;
          technology_type: string | null;
          other_needs: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['msme_needs_assessments']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['msme_needs_assessments']['Insert']>;
      };

      // =====================================================
      // PROGRAMS
      // =====================================================
      programs: {
        Row: {
          id: string;
          name: string;
          description: string;
          program_type: ProgramType;
          provider: string;
          start_date: string;
          end_date: string | null;
          status: ProgramStatus;
          target_sectors: string[] | null;
          target_provinces: string[] | null;
          eligibility_criteria: string | null;
          max_participants: number | null;
          current_participants: number;
          is_focused_on_women: boolean;
          is_focused_on_youth: boolean;
          is_focused_on_green: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['programs']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };

      // =====================================================
      // MSME PROGRAM PARTICIPATIONS
      // =====================================================
      msme_program_participations: {
        Row: {
          id: string;
          msme_id: string;
          program_id: string;
          enrollment_date: string;
          status: ParticipationStatus;
          completion_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['msme_program_participations']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['msme_program_participations']['Insert']>;
      };

      // =====================================================
      // FINANCE REFERRALS
      // =====================================================
      finance_referrals: {
        Row: {
          id: string;
          msme_id: string;
          institution_name: string;
          product_type: FinanceProduct;
          amount: number | null;
          referral_date: string;
          status: FinanceStatus;
          readiness_rating: ReadinessRating;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['finance_referrals']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['finance_referrals']['Insert']>;
      };

      // =====================================================
      // AUDIT LOGS
      // =====================================================
      audit_logs: {
        Row: {
          id: string;
          msme_id: string;
          action: AuditAction;
          field: string | null;
          old_value: string | null;
          new_value: string | null;
          user_id: string | null;
          user_name: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };

      // =====================================================
      // SCHEMA V2 - CONFIGURATION TABLES
      // =====================================================

      // MSME Definition Configuration
      msme_definition_config: {
        Row: {
          id: string;
          definition_name: string;
          is_active: boolean;
          category: string;
          min_employees: number;
          max_employees: number | null;
          min_turnover: number | null;
          max_turnover: number | null;
          min_assets: number | null;
          max_assets: number | null;
          description: string | null;
          effective_from: string;
          effective_to: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['msme_definition_config']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['msme_definition_config']['Insert']>;
      };

      // Geographic Hierarchy
      geo_regions: {
        Row: {
          id: string;
          code: string;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_regions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_regions']['Insert']>;
      };

      geo_provinces: {
        Row: {
          id: string;
          region_id: string | null;
          code: string;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_provinces']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_provinces']['Insert']>;
      };

      geo_districts: {
        Row: {
          id: string;
          province_id: string | null;
          code: string;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_districts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_districts']['Insert']>;
      };

      geo_llgs: {
        Row: {
          id: string;
          district_id: string | null;
          code: string | null;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_llgs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_llgs']['Insert']>;
      };

      geo_wards: {
        Row: {
          id: string;
          llg_id: string | null;
          code: string | null;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_wards']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_wards']['Insert']>;
      };

      geo_villages: {
        Row: {
          id: string;
          ward_id: string | null;
          name: string;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['geo_villages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['geo_villages']['Insert']>;
      };

      // Sector Configuration
      config_sectors: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['config_sectors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['config_sectors']['Insert']>;
      };

      config_subsectors: {
        Row: {
          id: string;
          sector_id: string | null;
          code: string;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['config_subsectors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['config_subsectors']['Insert']>;
      };

      // Support Needs Categories
      config_support_needs: {
        Row: {
          id: string;
          category: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['config_support_needs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['config_support_needs']['Insert']>;
      };

      // Document Types Configuration
      config_document_types: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          is_required_for_formal: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['config_document_types']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['config_document_types']['Insert']>;
      };

      // =====================================================
      // SCHEMA V2 - SURVEY CAMPAIGN MANAGEMENT
      // =====================================================

      survey_campaigns: {
        Row: {
          id: string;
          campaign_code: string;
          name: string;
          description: string | null;
          status: CampaignStatus;
          start_date: string | null;
          end_date: string | null;
          target_sme_count: number | null;
          actual_sme_count: number;
          target_provinces: string[] | null;
          target_sectors: string[] | null;
          sampling_notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['survey_campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['survey_campaigns']['Insert']>;
      };

      survey_forms: {
        Row: {
          id: string;
          campaign_id: string | null;
          form_code: string;
          version: number;
          name: string;
          description: string | null;
          form_schema: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['survey_forms']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['survey_forms']['Insert']>;
      };

      campaign_enumerators: {
        Row: {
          id: string;
          campaign_id: string | null;
          user_id: string | null;
          assigned_province_id: string | null;
          assigned_districts: string[] | null;
          target_count: number | null;
          completed_count: number;
          assignment_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaign_enumerators']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['campaign_enumerators']['Insert']>;
      };

      survey_responses: {
        Row: {
          id: string;
          survey_form_id: string | null;
          campaign_id: string | null;
          sme_id: string | null;
          enumerator_id: string | null;
          entry_mode: EntryMode;
          collection_date: string;
          collection_time: string | null;
          collection_province_id: string | null;
          gps_latitude: number | null;
          gps_longitude: number | null;
          responses: Json;
          attachments: string[] | null;
          notes: string | null;
          status: SurveyStatus;
          submitted_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          review_notes: string | null;
          paper_form_number: string | null;
          transcribed_by: string | null;
          transcription_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['survey_responses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['survey_responses']['Insert']>;
      };

      // =====================================================
      // SCHEMA V2 - DUPLICATE DETECTION
      // =====================================================

      duplicate_candidates: {
        Row: {
          id: string;
          sme_id_1: string | null;
          sme_id_2: string | null;
          similarity_score: number | null;
          match_reasons: string[] | null;
          status: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          merged_into_sme_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['duplicate_candidates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['duplicate_candidates']['Insert']>;
      };

      merge_audit_log: {
        Row: {
          id: string;
          master_sme_id: string | null;
          merged_sme_id: string | null;
          merged_sme_data: Json | null;
          merge_reason: string | null;
          merged_by: string | null;
          merged_at: string;
        };
        Insert: Omit<Database['public']['Tables']['merge_audit_log']['Row'], 'id' | 'merged_at'>;
        Update: Partial<Database['public']['Tables']['merge_audit_log']['Insert']>;
      };

      // =====================================================
      // SCHEMA V2 - API ACCESS & EXPORT
      // =====================================================

      api_keys: {
        Row: {
          id: string;
          key_hash: string;
          name: string;
          organization: string | null;
          scopes: string[];
          rate_limit_per_hour: number;
          is_active: boolean;
          expires_at: string | null;
          last_used_at: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['api_keys']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['api_keys']['Insert']>;
      };

      export_jobs: {
        Row: {
          id: string;
          job_name: string;
          export_type: string;
          format: string;
          filters: Json | null;
          status: string;
          file_url: string | null;
          file_size_bytes: number | null;
          record_count: number | null;
          started_at: string | null;
          completed_at: string | null;
          error_message: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['export_jobs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['export_jobs']['Insert']>;
      };

      // =====================================================
      // SCHEMA V2 - EXPANDED SME (smes_v2)
      // =====================================================

      smes_v2: {
        Row: {
          id: string;
          registration_number: string;
          legal_name: string;
          trading_name: string | null;
          formality_status: FormalityStatus;
          ipa_number: string | null;
          irc_number: string | null;
          tin_number: string | null;
          business_license_number: string | null;
          smec_membership_number: string | null;
          ownership_type: OwnershipType;
          date_established: string | null;
          years_in_operation: number | null;
          region_id: string | null;
          province_id: string;
          district_id: string | null;
          llg_id: string | null;
          ward_id: string | null;
          village_id: string | null;
          physical_address: string | null;
          postal_address: string | null;
          gps_latitude: number | null;
          gps_longitude: number | null;
          gps_accuracy: number | null;
          primary_phone: string;
          secondary_phone: string | null;
          email: string | null;
          website: string | null;
          social_media: Json | null;
          sector_id: string;
          subsector_id: string | null;
          products_services: string[] | null;
          markets_served: MarketReach[] | null;
          employee_count: number;
          employee_count_fulltime: number | null;
          employee_count_parttime: number | null;
          employee_count_seasonal: number | null;
          turnover_band: TurnoverBand | null;
          annual_turnover_estimate: number | null;
          calculated_size: BusinessSize | null;
          premises_type: PremisesType | null;
          premises_owned: boolean;
          women_ownership_pct: number;
          youth_ownership_pct: number;
          pwd_ownership_pct: number;
          is_women_led: boolean;
          is_youth_led: boolean;
          has_pwd_ownership: boolean;
          banking_status: BankingStatus | null;
          bank_name: string | null;
          has_mobile_money: boolean;
          mobile_money_provider: string | null;
          loan_history: LoanHistory | null;
          current_loan_amount: number | null;
          finance_need_amount: number | null;
          finance_readiness_score: number | null;
          has_green_products: boolean;
          green_products_description: string | null;
          energy_source: EnergySource | null;
          waste_management: WasteManagement | null;
          water_management: WaterManagement | null;
          climate_risk_exposure: ClimateRisk | null;
          green_score: number;
          green_category: GreenCategory | null;
          key_constraints: string[] | null;
          support_needs: string[] | null;
          status: SMEStatusV2;
          verification_date: string | null;
          verified_by: string | null;
          verification_notes: string | null;
          last_contact_date: string | null;
          source_campaign_id: string | null;
          entry_mode: EntryMode | null;
          collected_by: string | null;
          collection_date: string | null;
          consent_given: boolean;
          consent_date: string | null;
          consent_type: string | null;
          data_sharing_consent: boolean;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['smes_v2']['Row'], 'id' | 'created_at' | 'updated_at' | 'is_women_led' | 'is_youth_led' | 'has_pwd_ownership'>;
        Update: Partial<Database['public']['Tables']['smes_v2']['Insert']>;
      };

      sme_owners_v2: {
        Row: {
          id: string;
          sme_id: string;
          full_name: string;
          gender: GenderType;
          age_band: AgeBand | null;
          date_of_birth: string | null;
          is_youth: boolean;
          is_pwd: boolean;
          pwd_type: string | null;
          phone: string | null;
          email: string | null;
          ownership_percentage: number;
          role_in_business: string | null;
          education_level: string | null;
          id_type: IdType | null;
          id_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sme_owners_v2']['Row'], 'id' | 'created_at' | 'updated_at' | 'is_youth'>;
        Update: Partial<Database['public']['Tables']['sme_owners_v2']['Insert']>;
      };

      // V2 Audit Log
      audit_log_v2: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: string;
          old_values: Json | null;
          new_values: Json | null;
          changed_fields: string[] | null;
          user_id: string | null;
          user_email: string | null;
          user_role: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_log_v2']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_log_v2']['Insert']>;
      };
    };
    Views: {
      msme_statistics: {
        Row: {
          total_msmes: number;
          active_msmes: number;
          pending_verification: number;
          formal_msmes: number;
          informal_msmes: number;
          women_led: number;
          youth_led: number;
          pwd_owned: number;
          green_ready: number;
          unbanked: number;
          finance_need_count: number;
          total_finance_need: number;
        };
      };
      dashboard_kpis: {
        Row: {
          total_smes: number;
          active_smes: number;
          pending_verification: number;
          formal_smes: number;
          informal_smes: number;
          women_led: number;
          youth_led: number;
          pwd_owned: number;
          green_ready: number;
          unbanked: number;
          finance_need_count: number;
          total_finance_need: number;
        };
      };
      dashboard_by_province: {
        Row: {
          province_id: string;
          province_name: string;
          region_name: string | null;
          total_count: number;
          active_count: number;
          formal_count: number;
          women_led_count: number;
          youth_led_count: number;
        };
      };
      dashboard_by_sector: {
        Row: {
          sector_id: string;
          sector_name: string;
          total_count: number;
          micro_count: number;
          small_count: number;
          medium_count: number;
        };
      };
      campaign_progress: {
        Row: {
          campaign_id: string;
          campaign_name: string;
          status: CampaignStatus;
          target_sme_count: number | null;
          responses_collected: number;
          responses_approved: number;
          active_enumerators: number;
          progress_pct: number | null;
        };
      };
    };
    Functions: {
      generate_registration_number: {
        Args: Record<string, never>;
        Returns: string;
      };
      calculate_green_score: {
        Args: {
          p_has_green_products: boolean;
          p_energy_source: EnergySource;
          p_waste_management: WasteManagement;
          p_water_management: WaterManagement;
          p_climate_risk: ClimateRisk;
        };
        Returns: number;
      };
      determine_green_category: {
        Args: { score: number };
        Returns: GreenCategory;
      };
      classify_sme_size: {
        Args: {
          p_employee_count: number;
          p_turnover_band: TurnoverBand;
        };
        Returns: BusinessSize;
      };
      check_duplicate_sme: {
        Args: {
          p_legal_name: string;
          p_phone: string;
          p_province_id: string;
        };
        Returns: Array<{
          sme_id: string;
          similarity_score: number;
          match_reasons: string[];
        }>;
      };
    };
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
