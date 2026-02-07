# SMEC MSME Registry - PNG National MSME Database Platform

## Project Overview
Building a national MSME database platform for Papua New Guinea under Climate FIRST (DFAT/GGGI funded).

## Completed Features

### Phase 1 - Core Structure
- [x] Project setup with Next.js + shadcn
- [x] Dark sidebar navigation layout (matching reference UI)
- [x] Core data types and PNG location data
- [x] Mock data for demonstration

### Phase 2 - MSME Registry
- [x] MSME listing page with filters
- [x] MSME registration form (6-step wizard)
- [x] MSME detail view with tabs
- [x] Owner management (multiple owners support)
- [x] Inclusion attributes (women/youth/PWD flags)

### Phase 3 - Verification & Data Quality
- [x] Verification queue page
- [x] Status workflow: Draft → Submitted → Verified → Active
- [x] Document upload interface
- [x] Audit trail / change log display

### Phase 4 - Programs & Referrals
- [x] Program management page
- [x] MSME-Program linking display
- [x] Needs assessment display

### Phase 5 - Dashboards & Reports
- [x] Overview dashboard with KPIs
- [x] Provincial distribution chart
- [x] Sector breakdown chart
- [x] Inclusion metrics with targets
- [x] Green readiness display
- [x] Reports overview page

### Phase 6 - Data Governance
- [x] Data dictionary page
- [x] Audit log viewer in MSME detail

### Phase 7 - Backend Integration
- [x] Supabase client/server setup
- [x] Database schema v1 applied
- [x] Data access layer (queries.ts)
- [x] GitHub repository push
- [x] Export functionality (CSV/Excel)
- [x] PNG Map component

## Current Sprint - Schema V2 TOR Compliance

### Completed
- [x] Update database types for schema-v2 (all tables, views, functions)
- [x] Survey campaign management page (`/surveys`)
- [x] Configuration management admin page (`/admin/config`)
- [x] Geographic hierarchy admin page (`/admin/geo`)
- [x] Updated sidebar navigation with new sections
- [x] Added Supabase queries for surveys, config, geo, duplicates, exports

### In Progress
- [ ] Apply schema-v2.sql to Supabase (user action required)
- [ ] Duplicate detection UI

### Pending
- [ ] Survey form builder
- [ ] Enumerator assignment management
- [ ] API access management
- [ ] Export jobs tracking UI

## Schema V2 Key Additions
1. **Configuration Tables** - Admin-managed MSME definition, geographic hierarchy, sectors
2. **Survey Campaigns** - Campaign management, questionnaire versioning, enumerator assignments
3. **Expanded SME Profile** - Formality status, survey workflow, consent tracking
4. **Duplicate Detection** - Similarity scoring, merge audit log
5. **API Management** - API keys, rate limiting, request logging
6. **Export Jobs** - Async export processing with status tracking

## Pages Implemented
1. `/` - Dashboard with all key metrics
2. `/registry` - MSME listing with filters
3. `/registry/new` - 6-step registration form
4. `/registry/[id]` - MSME detail view with tabs
5. `/verification` - Verification queue
6. `/programs` - Programs management
7. `/reports` - Reports overview
8. `/data-dictionary` - Field definitions

## Pages To Add (Schema V2)
- `/surveys` - Survey campaign management
- `/surveys/[id]` - Campaign detail with responses
- `/admin/config` - Configuration management
- `/admin/geo` - Geographic hierarchy management

## Design Notes
- Color palette: GGGI Teal (#2EBFA6) + Dark sidebar (#0F172A)
- Government-ready, professional aesthetic
- Responsive design
- PNG provinces/districts data integrated
- 22 provinces, 89 districts covered

## Technology Stack
- Next.js 15 with App Router
- Tailwind CSS + shadcn/ui
- TypeScript
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Bun package manager

## Notes for Production
- Apply schema-v2.sql to Supabase for full TOR compliance
- Add authentication with role-based access
- Implement real-time survey sync for field data collection
- Connect to IPA/IRC/TIN verification APIs
