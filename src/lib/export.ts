import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { getProvinceName, getSectorName } from './png-data';

interface ExportableMSME {
  registration_number: string;
  business_name: string;
  trading_name?: string;
  ownership_type: string;
  sector_name: string;
  business_size: string;
  province: string;
  district?: string;
  employee_count: number;
  annual_revenue?: number;
  status: string;
  women_ownership_percentage: number;
  youth_ownership_percentage: number;
  pwd_ownership_percentage: number;
  is_women_led: boolean;
  is_youth_led: boolean;
  green_category: string;
  green_score: number;
  has_bank_account: boolean;
  primary_phone: string;
  email?: string;
  registration_date: string;
}

export function transformMSMEForExport(msme: Record<string, unknown>): ExportableMSME {
  return {
    registration_number: (msme.registration_number || msme.registrationNumber) as string,
    business_name: (msme.business_name || msme.businessName) as string,
    trading_name: (msme.trading_name || msme.tradingName) as string,
    ownership_type: (msme.ownership_type || msme.ownershipType) as string,
    sector_name: (msme.sector_name || msme.sectorName || getSectorName((msme.sector_id || msme.sectorId) as string)) as string,
    business_size: (msme.business_size || msme.businessSize) as string,
    province: getProvinceName((msme.province_id || (msme.location as Record<string, unknown>)?.provinceId || '') as string),
    district: (msme.district_id || (msme.location as Record<string, unknown>)?.districtId || '') as string,
    employee_count: (msme.employee_count || msme.employeeCount || 0) as number,
    annual_revenue: (msme.annual_revenue || msme.annualRevenue) as number,
    status: msme.status as string,
    women_ownership_percentage: (msme.women_ownership_percentage || msme.womenOwnershipPercentage || 0) as number,
    youth_ownership_percentage: (msme.youth_ownership_percentage || msme.youthOwnershipPercentage || 0) as number,
    pwd_ownership_percentage: (msme.pwd_ownership_percentage || msme.pwdOwnershipPercentage || 0) as number,
    is_women_led: (msme.is_women_led || msme.isWomenLed || false) as boolean,
    is_youth_led: (msme.is_youth_led || msme.isYouthLed || false) as boolean,
    green_category: (msme.green_category || (msme.greenProfile as Record<string, unknown>)?.greenCategory || 'emerging') as string,
    green_score: (msme.green_score || (msme.greenProfile as Record<string, unknown>)?.greenScore || 0) as number,
    has_bank_account: (msme.has_bank_account || msme.hasBankAccount || false) as boolean,
    primary_phone: (msme.primary_phone || msme.primaryPhone || '') as string,
    email: msme.email as string,
    registration_date: (msme.registration_date || msme.registrationDate || '') as string,
  };
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const transformedData = data.map(transformMSMEForExport);
  const csv = Papa.unparse(transformedData, { header: true, quotes: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename + '.csv');
}

export function exportToExcel(data: Record<string, unknown>[], filename: string, sheetName = 'MSMEs') {
  const transformedData = data.map(transformMSMEForExport);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(transformedData);
  ws['!cols'] = [
    { wch: 18 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
    { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
    { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
    { wch: 25 }, { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename + '.xlsx');
}

interface DashboardStatsForExport {
  totalMSMEs: number;
  activeMSMEs: number;
  pendingVerification: number;
  womenLedCount: number;
  youthLedCount: number;
  pwdOwnershipCount: number;
  greenReadyCount: number;
  byProvince: Array<{ provinceId: string; provinceName?: string; count: number }>;
  bySector: Array<{ sectorId: string; sectorName: string; count: number }>;
}

export function exportDashboardStats(stats: DashboardStatsForExport, filename: string) {
  const wb = XLSX.utils.book_new();
  const summaryData = [
    { Metric: 'Total MSMEs', Value: stats.totalMSMEs },
    { Metric: 'Active MSMEs', Value: stats.activeMSMEs },
    { Metric: 'Pending Verification', Value: stats.pendingVerification },
    { Metric: 'Women-Led Enterprises', Value: stats.womenLedCount },
    { Metric: 'Youth-Led Enterprises', Value: stats.youthLedCount },
    { Metric: 'PWD Ownership', Value: stats.pwdOwnershipCount },
    { Metric: 'Green Ready', Value: stats.greenReadyCount },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  const provinceData = stats.byProvince.map(p => ({
    Province: p.provinceName || getProvinceName(p.provinceId),
    'MSME Count': p.count,
  }));
  const provinceWs = XLSX.utils.json_to_sheet(provinceData);
  provinceWs['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, provinceWs, 'By Province');
  
  const sectorData = stats.bySector.map(s => ({ Sector: s.sectorName, 'MSME Count': s.count }));
  const sectorWs = XLSX.utils.json_to_sheet(sectorData);
  sectorWs['!cols'] = [{ wch: 35 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, sectorWs, 'By Sector');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename + '.xlsx');
}
