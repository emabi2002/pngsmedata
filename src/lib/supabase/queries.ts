import { getSupabaseClient } from './client';

// =====================================================
// MSME Queries
// =====================================================

export async function getMSMEs(options?: {
  status?: string;
  provinceId?: string;
  sectorId?: string;
  businessSize?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('msmes')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.provinceId && options.provinceId !== 'all') {
    query = query.eq('province_id', options.provinceId);
  }

  if (options?.sectorId && options.sectorId !== 'all') {
    query = query.eq('sector_id', options.sectorId);
  }

  if (options?.businessSize && options.businessSize !== 'all') {
    query = query.eq('business_size', options.businessSize);
  }

  if (options?.search) {
    query = query.or(`business_name.ilike.%${options.search}%,registration_number.ilike.%${options.search}%`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data, count };
}

export async function getMSMEById(id: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msmes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getMSMEWithRelations(id: string) {
  const supabase = getSupabaseClient();

  const [msmeResult, ownersResult, documentsResult, needsResult, participationsResult, referralsResult, logsResult] = await Promise.all([
    supabase.from('msmes').select('*').eq('id', id).single(),
    supabase.from('msme_owners').select('*').eq('msme_id', id),
    supabase.from('msme_documents').select('*').eq('msme_id', id),
    supabase.from('msme_needs_assessments').select('*').eq('msme_id', id).single(),
    supabase.from('msme_program_participations').select('*, programs(*)').eq('msme_id', id),
    supabase.from('finance_referrals').select('*').eq('msme_id', id),
    supabase.from('audit_logs').select('*').eq('msme_id', id).order('created_at', { ascending: false }),
  ]);

  if (msmeResult.error) throw msmeResult.error;

  return {
    msme: msmeResult.data,
    owners: ownersResult.data || [],
    documents: documentsResult.data || [],
    needsAssessment: needsResult.data,
    programParticipations: participationsResult.data || [],
    financeReferrals: referralsResult.data || [],
    auditLogs: logsResult.data || [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMSME(msme: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msmes')
    .insert(msme)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateMSME(id: string, updates: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msmes')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMSMEStatus(id: string, status: string, verifiedBy?: string, notes?: string) {
  const supabase = getSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = { status };

  if (status === 'verified' || status === 'active') {
    updates.verification_date = new Date().toISOString().split('T')[0];
    if (notes) updates.verification_notes = notes;
  }

  const { data, error } = await supabase
    .from('msmes')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// MSME Owners Queries
// =====================================================

export async function getMSMEOwners(msmeId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_owners')
    .select('*')
    .eq('msme_id', msmeId);

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMSMEOwner(owner: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_owners')
    .insert(owner)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateMSMEOwner(id: string, updates: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_owners')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMSMEOwner(id: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('msme_owners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// Programs Queries
// =====================================================

export async function getPrograms(options?: {
  status?: string;
  limit?: number;
}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('programs')
    .select('*')
    .order('start_date', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getProgramById(id: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Dashboard Statistics Queries
// =====================================================

export async function getDashboardStats() {
  const supabase = getSupabaseClient();

  // Get basic counts
  const [
    totalResult,
    activeResult,
    pendingResult,
    womenLedResult,
    youthLedResult,
    pwdResult,
    greenReadyResult,
    programEnrollmentsResult,
  ] = await Promise.all([
    supabase.from('msmes').select('*', { count: 'exact', head: true }),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).in('status', ['submitted', 'under_review']),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('is_women_led', true),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('is_youth_led', true),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('has_pwd_ownership', true),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).in('green_category', ['green_ready', 'green_certified']),
    supabase.from('msme_program_participations').select('*', { count: 'exact', head: true }),
  ]);

  // Get by province
  const { data: byProvince } = await supabase
    .from('msmes')
    .select('province_id')
    .neq('status', 'inactive');

  // Get by sector
  const { data: bySector } = await supabase
    .from('msmes')
    .select('sector_id, sector_name')
    .neq('status', 'inactive');

  // Get by size
  const [microResult, smallResult, mediumResult] = await Promise.all([
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('business_size', 'micro'),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('business_size', 'small'),
    supabase.from('msmes').select('*', { count: 'exact', head: true }).eq('business_size', 'medium'),
  ]);

  // Get finance needs count
  const { count: financeNeedCount } = await supabase
    .from('msme_needs_assessments')
    .select('*', { count: 'exact', head: true })
    .eq('finance_need', true);

  // Aggregate province data
  const provinceAggregation: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (byProvince as any[])?.forEach((item: { province_id: string }) => {
    provinceAggregation[item.province_id] = (provinceAggregation[item.province_id] || 0) + 1;
  });

  // Aggregate sector data
  const sectorAggregation: Record<string, { name: string; count: number }> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bySector as any[])?.forEach((item: { sector_id: string; sector_name: string }) => {
    if (!sectorAggregation[item.sector_id]) {
      sectorAggregation[item.sector_id] = { name: item.sector_name, count: 0 };
    }
    sectorAggregation[item.sector_id].count++;
  });

  return {
    totalMSMEs: totalResult.count || 0,
    activeMSMEs: activeResult.count || 0,
    pendingVerification: pendingResult.count || 0,
    womenLedCount: womenLedResult.count || 0,
    youthLedCount: youthLedResult.count || 0,
    pwdOwnershipCount: pwdResult.count || 0,
    greenReadyCount: greenReadyResult.count || 0,
    programEnrollments: programEnrollmentsResult.count || 0,
    financeNeedTotal: financeNeedCount || 0,
    bySize: {
      micro: microResult.count || 0,
      small: smallResult.count || 0,
      medium: mediumResult.count || 0,
    },
    byProvince: Object.entries(provinceAggregation)
      .map(([id, count]) => ({ provinceId: id, count }))
      .sort((a, b) => b.count - a.count),
    bySector: Object.entries(sectorAggregation)
      .map(([id, data]) => ({ sectorId: id, sectorName: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count),
  };
}

// =====================================================
// Audit Log Queries
// =====================================================

export async function getAuditLogs(msmeId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('msme_id', msmeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAuditLog(log: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Finance Referrals Queries
// =====================================================

export async function getFinanceReferrals(msmeId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('finance_referrals')
    .select('*')
    .eq('msme_id', msmeId)
    .order('referral_date', { ascending: false });

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createFinanceReferral(referral: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('finance_referrals')
    .insert(referral)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Documents Queries
// =====================================================

export async function getMSMEDocuments(msmeId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_documents')
    .select('*')
    .eq('msme_id', msmeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createMSMEDocument(document: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDocumentStatus(id: string, status: string, verifiedBy?: string, rejectionReason?: string) {
  const supabase = getSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = { status };

  if (status === 'verified') {
    updates.verified_at = new Date().toISOString();
  }

  if (rejectionReason) {
    updates.rejection_reason = rejectionReason;
  }

  const { data, error } = await supabase
    .from('msme_documents')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Survey Campaigns Queries (Schema V2)
// =====================================================

export async function getSurveyCampaigns(options?: {
  status?: string;
  limit?: number;
}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('survey_campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getSurveyCampaignById(id: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('survey_campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSurveyCampaign(campaign: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('survey_campaigns')
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSurveyCampaign(id: string, updates: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('survey_campaigns')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSurveyResponses(campaignId: string, options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('survey_responses')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data, count };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSurveyResponse(response: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('survey_responses')
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCampaignEnumerators(campaignId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('campaign_enumerators')
    .select('*, users(*)')
    .eq('campaign_id', campaignId);

  if (error) throw error;
  return data;
}

// =====================================================
// Configuration Queries (Schema V2)
// =====================================================

export async function getMSMEDefinitionConfig() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('msme_definition_config')
    .select('*')
    .eq('is_active', true)
    .order('category');

  if (error) throw error;
  return data;
}

export async function getConfigSectors() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('config_sectors')
    .select('*, config_subsectors(*)')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function getConfigSupportNeeds() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('config_support_needs')
    .select('*')
    .eq('is_active', true)
    .order('category');

  if (error) throw error;
  return data;
}

export async function getConfigDocumentTypes() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('config_document_types')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

// =====================================================
// Geographic Hierarchy Queries (Schema V2)
// =====================================================

export async function getGeoRegions() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('geo_regions')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getGeoProvinces(regionId?: string) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('geo_provinces')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (regionId) {
    query = query.eq('region_id', regionId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getGeoDistricts(provinceId?: string) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('geo_districts')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (provinceId) {
    query = query.eq('province_id', provinceId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getGeoLLGs(districtId?: string) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('geo_llgs')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (districtId) {
    query = query.eq('district_id', districtId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// =====================================================
// Duplicate Detection Queries (Schema V2)
// =====================================================

export async function getDuplicateCandidates(options?: {
  status?: string;
  limit?: number;
}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('duplicate_candidates')
    .select('*, smes_v2!sme_id_1(*), smes_v2!sme_id_2(*)')
    .order('similarity_score', { ascending: false });

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function resolveDuplicate(id: string, status: string, mergedIntoSmeId?: string) {
  const supabase = getSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {
    status,
    reviewed_at: new Date().toISOString(),
  };

  if (mergedIntoSmeId) {
    updates.merged_into_sme_id = mergedIntoSmeId;
  }

  const { data, error } = await supabase
    .from('duplicate_candidates')
    // @ts-expect-error - Database types resolve after schema setup
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Export Jobs Queries (Schema V2)
// =====================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createExportJob(job: any) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('export_jobs')
    .insert(job)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExportJobs(limit = 10) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('export_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
