# SMEC MSME Registry

PNG National MSME Database Platform - Climate FIRST Initiative

A comprehensive platform for managing Papua New Guinea's national MSME database. Built to support policy evidence, SME access to finance/markets, and inclusive green growth.

## Overview

This platform was developed as part of the Climate FIRST program, funded by the Australian Government (DFAT) and delivered by GGGI through SMEC.

## Key Features

- MSME Registry - Register and manage all MSMEs across PNG's 22 provinces
- Verification Workflow - Multi-step verification (Draft to Submitted to Verified to Active)
- Inclusion Tracking - GESI-compliant tracking of women-led, youth-led, and PWD ownership
- Green Profile Assessment - Climate-smart scoring and categorization
- Program Management - Track MSME participation in support programs
- Finance Pipeline - Manage finance referrals and track access to finance
- Policy Dashboards - Real-time analytics for evidence-based policy making
- Data Dictionary - Complete field reference for data governance

## Technology Stack

- Frontend: Next.js 15 (App Router), React 18, TypeScript
- Styling: Tailwind CSS, shadcn/ui components
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
- Package Manager: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account

### Installation

1. Clone the repository
2. Run `bun install` to install dependencies
3. Copy `.env.example` to `.env.local` and add your Supabase credentials
4. Run the database schema from `supabase/schema.sql` in your Supabase SQL Editor
5. Run `bun dev` to start the development server
6. Open http://localhost:3000

## Database Schema

### Schema V1 (Original - 9 tables)
- msmes - Main registry with 60+ fields
- msme_owners - Multiple owners with inclusion attributes
- msme_documents - Document verification workflow
- msme_needs_assessments - Finance, market, skills needs
- programs - Support programs
- msme_program_participations - MSME-Program enrollment
- finance_referrals - Finance access tracking
- audit_logs - Complete audit trail
- users - Role-based user management

### Schema V2 (TOR Compliant - Additional 20+ tables)

**Configuration Tables:**
- msme_definition_config - Admin-configurable size thresholds
- geo_regions, geo_provinces, geo_districts, geo_llgs, geo_wards, geo_villages - Full geographic hierarchy
- config_sectors, config_subsectors - Business sector classification
- config_support_needs - Support needs categories
- config_document_types - Document type configuration

**Survey Campaign Management:**
- survey_campaigns - Campaign planning and tracking
- survey_forms - Versioned questionnaire definitions
- campaign_enumerators - Field worker assignments
- survey_responses - Collected survey data

**Data Quality:**
- duplicate_candidates - Potential duplicate SME detection
- merge_audit_log - Merge history tracking

**Integration:**
- api_keys - External API access management
- api_request_log - API usage tracking
- export_jobs - Async export processing

**Expanded SME Profile:**
- smes_v2 - Extended SME table with formality status, GPS, turnover bands
- sme_owners_v2 - Extended owner information with age bands, roles

To apply Schema V2, run `supabase/schema-v2.sql` in your Supabase SQL Editor.

## PNG Location Data

Includes complete PNG administrative data:
- 22 Provinces (Highlands, Momase, Southern, Islands regions)
- 89+ Districts
- 17 Business Sectors with sub-sectors

## Green Growth Scoring

Green Score (0-100) based on:
- Green products/services (20 pts)
- Energy source (25 pts)
- Waste management (20 pts)
- Water management (20 pts)
- Climate risk exposure (15 pts)

Categories: Emerging, Transitioning, Green Ready, Green Certified

## License

Developed for SMEC / GGGI / DFAT under the Climate FIRST program.

---

Climate FIRST - Supporting green growth and climate resilience for PNG MSMEs
