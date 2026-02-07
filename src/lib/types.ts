// Core MSME Types for PNG National Database

export type MSMEStatus = 'draft' | 'submitted' | 'under_review' | 'verified' | 'active' | 'suspended' | 'inactive';
export type BusinessSize = 'micro' | 'small' | 'medium';
export type GreenCategory = 'emerging' | 'transitioning' | 'green_ready' | 'green_certified';
export type OwnershipType = 'sole_proprietor' | 'partnership' | 'company' | 'cooperative' | 'association';

export interface Province {
  id: string;
  name: string;
  region: 'highlands' | 'momase' | 'southern' | 'islands';
  code: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}

export interface Owner {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  phone: string;
  email?: string;
  ownershipPercentage: number;
  isYouth: boolean; // Under 35
  isPWD: boolean; // Person with disability
  idType?: 'national_id' | 'passport' | 'drivers_license';
  idNumber?: string;
}

export interface Location {
  provinceId: string;
  districtId?: string;
  llg?: string;
  ward?: string;
  village?: string;
  streetAddress?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface GreenProfile {
  hasGreenProducts: boolean;
  greenProductsDescription?: string;
  energySource: 'grid' | 'solar' | 'diesel' | 'hydro' | 'mixed' | 'none';
  wasteManagement: 'none' | 'basic' | 'recycling' | 'comprehensive';
  waterManagement: 'none' | 'basic' | 'conservation' | 'recycling';
  climateRiskExposure: 'low' | 'medium' | 'high';
  greenCategory: GreenCategory;
  greenScore: number; // 0-100
  lastAssessmentDate?: string;
}

export interface Document {
  id: string;
  type: 'ipa_certificate' | 'irc_certificate' | 'tin_certificate' | 'business_license' | 'owner_id' | 'bank_statement' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface NeedsAssessment {
  financeNeed: boolean;
  financeAmount?: number;
  financeType?: 'working_capital' | 'equipment' | 'expansion' | 'startup';
  marketAccessNeed: boolean;
  marketAccessType?: 'local' | 'provincial' | 'national' | 'export';
  skillsTrainingNeed: boolean;
  skillsTrainingAreas?: string[];
  equipmentNeed: boolean;
  equipmentType?: string;
  technologyNeed: boolean;
  technologyType?: string;
  otherNeeds?: string;
}

export interface ProgramParticipation {
  programId: string;
  programName: string;
  enrollmentDate: string;
  status: 'enrolled' | 'active' | 'completed' | 'dropped';
  completionDate?: string;
  notes?: string;
}

export interface FinanceReferral {
  id: string;
  institutionName: string;
  productType: 'loan' | 'grant' | 'equity' | 'guarantee' | 'green_finance';
  amount?: number;
  referralDate: string;
  status: 'referred' | 'in_progress' | 'approved' | 'disbursed' | 'rejected';
  readinessRating: 'not_ready' | 'developing' | 'ready' | 'bankable';
}

export interface AuditLogEntry {
  id: string;
  msmeId: string;
  action: 'created' | 'updated' | 'status_changed' | 'document_added' | 'verified' | 'program_enrolled';
  field?: string;
  oldValue?: string;
  newValue?: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress?: string;
}

export interface MSME {
  id: string;
  registrationNumber: string; // System-generated unique ID

  // Basic Information
  businessName: string;
  tradingName?: string;
  ownershipType: OwnershipType;
  dateEstablished?: string;
  registrationDate: string;

  // Registration References
  ipaNumber?: string; // Investment Promotion Authority
  ircNumber?: string; // Internal Revenue Commission
  tinNumber?: string; // Tax Identification Number
  smecMembershipNumber?: string;

  // Classification
  sectorId: string;
  sectorName: string;
  subSectorId?: string;
  subSectorName?: string;
  productsServices: string[];
  businessSize: BusinessSize;
  annualRevenue?: number;
  employeeCount: number;

  // Contact
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;

  // Location
  location: Location;

  // Ownership & Inclusion
  owners: Owner[];
  womenOwnershipPercentage: number;
  youthOwnershipPercentage: number;
  pwdOwnershipPercentage: number;
  isWomenLed: boolean; // >50% women ownership
  isYouthLed: boolean; // >50% youth ownership
  hasPWDOwnership: boolean;

  // Green Profile
  greenProfile: GreenProfile;

  // Banking & Finance
  hasBankAccount: boolean;
  bankName?: string;
  accountType?: 'savings' | 'current' | 'business';
  mobileMoneyProvider?: string;

  // Documents
  documents: Document[];

  // Status & Verification
  status: MSMEStatus;
  verificationDate?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  lastUpdated: string;

  // Needs & Programs
  needsAssessment?: NeedsAssessment;
  programParticipations: ProgramParticipation[];
  financeReferrals: FinanceReferral[];

  // Consent
  dataConsentGiven: boolean;
  dataConsentDate?: string;
  marketingConsentGiven: boolean;

  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  type: 'training' | 'incubation' | 'grant' | 'mentorship' | 'market_linkage' | 'technical_assistance';
  provider: string;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  targetSectors?: string[];
  targetProvinces?: string[];
  eligibilityCriteria?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isFocusedOnWomen: boolean;
  isFocusedOnYouth: boolean;
  isFocusedOnGreen: boolean;
}

export interface DashboardStats {
  totalMSMEs: number;
  activeMSMEs: number;
  pendingVerification: number;
  newThisMonth: number;
  bySize: {
    micro: number;
    small: number;
    medium: number;
  };
  byStatus: Record<MSMEStatus, number>;
  womenLedCount: number;
  youthLedCount: number;
  pwdOwnershipCount: number;
  greenReadyCount: number;
  byProvince: Array<{ provinceId: string; provinceName: string; count: number }>;
  bySector: Array<{ sectorId: string; sectorName: string; count: number }>;
  financeNeedTotal: number;
  programEnrollments: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'smec_officer' | 'provincial_officer' | 'partner' | 'readonly';
  provinceId?: string; // For provincial officers
  organizationName?: string; // For partners
  isActive: boolean;
}
