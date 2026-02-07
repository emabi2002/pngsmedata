import type { Province, District } from './types';

export const PNG_PROVINCES: Province[] = [
  // Highlands Region
  { id: 'chimbu', name: 'Chimbu (Simbu)', region: 'highlands', code: 'CPV' },
  { id: 'eastern-highlands', name: 'Eastern Highlands', region: 'highlands', code: 'EHG' },
  { id: 'enga', name: 'Enga', region: 'highlands', code: 'EPG' },
  { id: 'hela', name: 'Hela', region: 'highlands', code: 'HLA' },
  { id: 'jiwaka', name: 'Jiwaka', region: 'highlands', code: 'JWK' },
  { id: 'southern-highlands', name: 'Southern Highlands', region: 'highlands', code: 'SHM' },
  { id: 'western-highlands', name: 'Western Highlands', region: 'highlands', code: 'WHM' },

  // Islands Region
  { id: 'bougainville', name: 'Autonomous Region of Bougainville', region: 'islands', code: 'NSB' },
  { id: 'east-new-britain', name: 'East New Britain', region: 'islands', code: 'EBR' },
  { id: 'manus', name: 'Manus', region: 'islands', code: 'MRL' },
  { id: 'new-ireland', name: 'New Ireland', region: 'islands', code: 'NIK' },
  { id: 'west-new-britain', name: 'West New Britain', region: 'islands', code: 'WBK' },

  // Momase Region
  { id: 'east-sepik', name: 'East Sepik', region: 'momase', code: 'ESW' },
  { id: 'madang', name: 'Madang', region: 'momase', code: 'MPM' },
  { id: 'morobe', name: 'Morobe', region: 'momase', code: 'MPL' },
  { id: 'sandaun', name: 'Sandaun (West Sepik)', region: 'momase', code: 'SAN' },

  // Southern Region
  { id: 'central', name: 'Central', region: 'southern', code: 'CPK' },
  { id: 'gulf', name: 'Gulf', region: 'southern', code: 'GPK' },
  { id: 'milne-bay', name: 'Milne Bay', region: 'southern', code: 'MBA' },
  { id: 'ncd', name: 'National Capital District', region: 'southern', code: 'NCD' },
  { id: 'northern', name: 'Northern (Oro)', region: 'southern', code: 'NPP' },
  { id: 'western', name: 'Western', region: 'southern', code: 'WPD' },
];

export const PNG_DISTRICTS: District[] = [
  // National Capital District
  { id: 'ncd-central', name: 'Moresby North-East', provinceId: 'ncd' },
  { id: 'ncd-northwest', name: 'Moresby North-West', provinceId: 'ncd' },
  { id: 'ncd-south', name: 'Moresby South', provinceId: 'ncd' },

  // Morobe
  { id: 'lae', name: 'Lae', provinceId: 'morobe' },
  { id: 'huon-gulf', name: 'Huon Gulf', provinceId: 'morobe' },
  { id: 'bulolo', name: 'Bulolo', provinceId: 'morobe' },
  { id: 'markham', name: 'Markham', provinceId: 'morobe' },
  { id: 'nawae', name: 'Nawae', provinceId: 'morobe' },
  { id: 'finschhafen', name: 'Finschhafen', provinceId: 'morobe' },
  { id: 'kabwum', name: 'Kabwum', provinceId: 'morobe' },
  { id: 'tewai-siassi', name: 'Tewai-Siassi', provinceId: 'morobe' },
  { id: 'menyamya', name: 'Menyamya', provinceId: 'morobe' },

  // Eastern Highlands
  { id: 'goroka', name: 'Goroka', provinceId: 'eastern-highlands' },
  { id: 'kainantu', name: 'Kainantu', provinceId: 'eastern-highlands' },
  { id: 'obura-wonenara', name: 'Obura-Wonenara', provinceId: 'eastern-highlands' },
  { id: 'okapa', name: 'Okapa', provinceId: 'eastern-highlands' },
  { id: 'henganofi', name: 'Henganofi', provinceId: 'eastern-highlands' },
  { id: 'daulo', name: 'Daulo', provinceId: 'eastern-highlands' },
  { id: 'lufa', name: 'Lufa', provinceId: 'eastern-highlands' },
  { id: 'unggai-bena', name: 'Unggai-Bena', provinceId: 'eastern-highlands' },

  // Western Highlands
  { id: 'mount-hagen', name: 'Mount Hagen', provinceId: 'western-highlands' },
  { id: 'dei', name: 'Dei', provinceId: 'western-highlands' },
  { id: 'mul-baiyer', name: 'Mul-Baiyer', provinceId: 'western-highlands' },
  { id: 'tambul-nebilyer', name: 'Tambul-Nebilyer', provinceId: 'western-highlands' },
  { id: 'anglimp-south-wahgi', name: 'Anglimp-South Wahgi', provinceId: 'western-highlands' },
  { id: 'north-wahgi', name: 'North Wahgi', provinceId: 'western-highlands' },

  // East New Britain
  { id: 'rabaul', name: 'Rabaul', provinceId: 'east-new-britain' },
  { id: 'kokopo', name: 'Kokopo', provinceId: 'east-new-britain' },
  { id: 'gazelle', name: 'Gazelle', provinceId: 'east-new-britain' },
  { id: 'pomio', name: 'Pomio', provinceId: 'east-new-britain' },

  // Madang
  { id: 'madang-town', name: 'Madang', provinceId: 'madang' },
  { id: 'bogia', name: 'Bogia', provinceId: 'madang' },
  { id: 'middle-ramu', name: 'Middle Ramu', provinceId: 'madang' },
  { id: 'sumkar', name: 'Sumkar', provinceId: 'madang' },
  { id: 'usino-bundi', name: 'Usino Bundi', provinceId: 'madang' },
  { id: 'rai-coast', name: 'Rai Coast', provinceId: 'madang' },

  // Central Province
  { id: 'abau', name: 'Abau', provinceId: 'central' },
  { id: 'goilala', name: 'Goilala', provinceId: 'central' },
  { id: 'kairuku-hiri', name: 'Kairuku-Hiri', provinceId: 'central' },
  { id: 'rigo', name: 'Rigo', provinceId: 'central' },

  // Add more districts as needed...
];

export const BUSINESS_SECTORS = [
  { id: 'agriculture', name: 'Agriculture, Forestry & Fishing', icon: '🌾' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { id: 'construction', name: 'Construction', icon: '🏗️' },
  { id: 'wholesale-retail', name: 'Wholesale & Retail Trade', icon: '🏪' },
  { id: 'transport', name: 'Transport & Logistics', icon: '🚛' },
  { id: 'accommodation-food', name: 'Accommodation & Food Services', icon: '🏨' },
  { id: 'ict', name: 'Information & Communication', icon: '💻' },
  { id: 'finance', name: 'Financial & Insurance', icon: '🏦' },
  { id: 'professional', name: 'Professional Services', icon: '💼' },
  { id: 'education', name: 'Education & Training', icon: '📚' },
  { id: 'health', name: 'Health & Social Services', icon: '🏥' },
  { id: 'arts-recreation', name: 'Arts, Entertainment & Recreation', icon: '🎭' },
  { id: 'mining', name: 'Mining & Quarrying', icon: '⛏️' },
  { id: 'energy', name: 'Energy & Utilities', icon: '⚡' },
  { id: 'tourism', name: 'Tourism & Hospitality', icon: '✈️' },
  { id: 'crafts', name: 'Handicrafts & Artifacts', icon: '🎨' },
  { id: 'other', name: 'Other Services', icon: '📋' },
];

export const SUB_SECTORS: Record<string, Array<{ id: string; name: string }>> = {
  agriculture: [
    { id: 'coffee', name: 'Coffee Production' },
    { id: 'cocoa', name: 'Cocoa Production' },
    { id: 'copra', name: 'Copra/Coconut' },
    { id: 'palm-oil', name: 'Palm Oil' },
    { id: 'vanilla', name: 'Vanilla' },
    { id: 'vegetables', name: 'Vegetables & Fruits' },
    { id: 'livestock', name: 'Livestock' },
    { id: 'poultry', name: 'Poultry' },
    { id: 'fisheries', name: 'Fisheries & Aquaculture' },
    { id: 'forestry', name: 'Forestry & Timber' },
    { id: 'beekeeping', name: 'Beekeeping & Honey' },
  ],
  manufacturing: [
    { id: 'food-processing', name: 'Food Processing' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'textiles', name: 'Textiles & Garments' },
    { id: 'wood-products', name: 'Wood Products' },
    { id: 'chemicals', name: 'Chemicals & Plastics' },
    { id: 'metals', name: 'Metal Products' },
    { id: 'furniture', name: 'Furniture Making' },
  ],
  'wholesale-retail': [
    { id: 'general-store', name: 'General Store/Trade Store' },
    { id: 'food-retail', name: 'Food & Grocery' },
    { id: 'clothing', name: 'Clothing & Apparel' },
    { id: 'hardware', name: 'Hardware & Building Materials' },
    { id: 'electronics', name: 'Electronics & Appliances' },
    { id: 'fuel', name: 'Fuel & Petroleum' },
    { id: 'market-vendor', name: 'Market Vendor' },
  ],
  'accommodation-food': [
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'guest-house', name: 'Guest House/Lodge' },
    { id: 'hotel', name: 'Hotel' },
    { id: 'catering', name: 'Catering Services' },
    { id: 'fast-food', name: 'Fast Food/Takeaway' },
  ],
  transport: [
    { id: 'road-transport', name: 'Road Transport/PMV' },
    { id: 'shipping', name: 'Shipping/Marine' },
    { id: 'courier', name: 'Courier & Delivery' },
    { id: 'storage', name: 'Warehousing & Storage' },
  ],
};

export const REGIONS = [
  { id: 'highlands', name: 'Highlands Region', color: '#059669' },
  { id: 'momase', name: 'Momase Region', color: '#0891b2' },
  { id: 'southern', name: 'Southern Region', color: '#d97706' },
  { id: 'islands', name: 'Islands Region', color: '#7c3aed' },
];

export function getProvincesByRegion(region: string): Province[] {
  return PNG_PROVINCES.filter(p => p.region === region);
}

export function getDistrictsByProvince(provinceId: string): District[] {
  return PNG_DISTRICTS.filter(d => d.provinceId === provinceId);
}

export function getProvinceName(provinceId: string): string {
  return PNG_PROVINCES.find(p => p.id === provinceId)?.name || provinceId;
}

export function getDistrictName(districtId: string): string {
  return PNG_DISTRICTS.find(d => d.id === districtId)?.name || districtId;
}

export function getSectorName(sectorId: string): string {
  return BUSINESS_SECTORS.find(s => s.id === sectorId)?.name || sectorId;
}
