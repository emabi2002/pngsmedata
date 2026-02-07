'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Download,
  FileText,
  Database,
  BookOpen,
  Tag,
  Hash,
  ToggleLeft,
  Calendar,
  List,
  Type,
} from 'lucide-react';

interface FieldDefinition {
  name: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'array' | 'object';
  required: boolean;
  example: string;
  validValues?: string[];
  category: string;
}

const dataFields: FieldDefinition[] = [
  // Business Information
  { name: 'registration_number', description: 'System-generated unique identifier for the MSME', dataType: 'string', required: true, example: 'SMEC-2025-00001', category: 'Business Information' },
  { name: 'business_name', description: 'Legal registered name of the business', dataType: 'string', required: true, example: 'Highlands Fresh Produce Ltd', category: 'Business Information' },
  { name: 'trading_name', description: 'Name the business operates under if different from legal name', dataType: 'string', required: false, example: 'Highlands Fresh', category: 'Business Information' },
  { name: 'ownership_type', description: 'Legal structure of the business', dataType: 'enum', required: true, example: 'company', validValues: ['sole_proprietor', 'partnership', 'company', 'cooperative', 'association'], category: 'Business Information' },
  { name: 'date_established', description: 'Date the business was first established', dataType: 'date', required: false, example: '2018-03-15', category: 'Business Information' },
  { name: 'ipa_number', description: 'Investment Promotion Authority registration number', dataType: 'string', required: false, example: 'IPA-2018-45632', category: 'Business Information' },
  { name: 'irc_number', description: 'Internal Revenue Commission registration number', dataType: 'string', required: false, example: 'IRC-456321', category: 'Business Information' },
  { name: 'tin_number', description: 'Tax Identification Number', dataType: 'string', required: false, example: 'TIN-789456123', category: 'Business Information' },

  // Classification
  { name: 'sector_id', description: 'Primary business sector classification', dataType: 'string', required: true, example: 'agriculture', category: 'Classification' },
  { name: 'sub_sector_id', description: 'Specific sub-sector within the primary sector', dataType: 'string', required: false, example: 'vegetables', category: 'Classification' },
  { name: 'business_size', description: 'Size classification based on employees and revenue', dataType: 'enum', required: true, example: 'small', validValues: ['micro', 'small', 'medium'], category: 'Classification' },
  { name: 'products_services', description: 'List of main products or services offered', dataType: 'array', required: true, example: '["Fresh vegetables", "Organic produce"]', category: 'Classification' },
  { name: 'employee_count', description: 'Total number of employees including owners', dataType: 'number', required: true, example: '12', category: 'Classification' },
  { name: 'annual_revenue', description: 'Annual revenue in Papua New Guinea Kina', dataType: 'number', required: false, example: '450000', category: 'Classification' },

  // Location
  { name: 'province_id', description: 'Province where business is primarily located', dataType: 'string', required: true, example: 'western-highlands', category: 'Location' },
  { name: 'district_id', description: 'District within the province', dataType: 'string', required: false, example: 'mount-hagen', category: 'Location' },
  { name: 'llg', description: 'Local Level Government area', dataType: 'string', required: false, example: 'Mount Hagen Urban', category: 'Location' },
  { name: 'ward', description: 'Ward within the LLG', dataType: 'string', required: false, example: 'Ward 5', category: 'Location' },
  { name: 'street_address', description: 'Physical street address', dataType: 'string', required: false, example: 'Lot 15, Airport Road', category: 'Location' },
  { name: 'latitude', description: 'GPS latitude coordinate', dataType: 'number', required: false, example: '-5.8509', category: 'Location' },
  { name: 'longitude', description: 'GPS longitude coordinate', dataType: 'number', required: false, example: '144.2958', category: 'Location' },

  // Inclusion Attributes
  { name: 'women_ownership_percentage', description: 'Percentage of business owned by women (0-100)', dataType: 'number', required: true, example: '60', category: 'Inclusion' },
  { name: 'youth_ownership_percentage', description: 'Percentage owned by youth under 35 years (0-100)', dataType: 'number', required: true, example: '0', category: 'Inclusion' },
  { name: 'pwd_ownership_percentage', description: 'Percentage owned by persons with disability (0-100)', dataType: 'number', required: true, example: '0', category: 'Inclusion' },
  { name: 'is_women_led', description: 'Business is majority (>50%) owned by women', dataType: 'boolean', required: true, example: 'true', category: 'Inclusion' },
  { name: 'is_youth_led', description: 'Business is majority (>50%) owned by youth', dataType: 'boolean', required: true, example: 'false', category: 'Inclusion' },
  { name: 'has_pwd_ownership', description: 'Business has any PWD ownership', dataType: 'boolean', required: true, example: 'false', category: 'Inclusion' },

  // Green Profile
  { name: 'has_green_products', description: 'Business offers environmentally sustainable products/services', dataType: 'boolean', required: true, example: 'true', category: 'Green Profile' },
  { name: 'energy_source', description: 'Primary energy source used by the business', dataType: 'enum', required: true, example: 'solar', validValues: ['grid', 'solar', 'diesel', 'hydro', 'mixed', 'none'], category: 'Green Profile' },
  { name: 'waste_management', description: 'Level of waste management practices', dataType: 'enum', required: true, example: 'recycling', validValues: ['none', 'basic', 'recycling', 'comprehensive'], category: 'Green Profile' },
  { name: 'water_management', description: 'Level of water conservation practices', dataType: 'enum', required: true, example: 'conservation', validValues: ['none', 'basic', 'conservation', 'recycling'], category: 'Green Profile' },
  { name: 'climate_risk_exposure', description: 'Level of exposure to climate-related risks', dataType: 'enum', required: true, example: 'medium', validValues: ['low', 'medium', 'high'], category: 'Green Profile' },
  { name: 'green_category', description: 'Overall green classification', dataType: 'enum', required: true, example: 'green_ready', validValues: ['emerging', 'transitioning', 'green_ready', 'green_certified'], category: 'Green Profile' },
  { name: 'green_score', description: 'Calculated green score from 0-100', dataType: 'number', required: true, example: '78', category: 'Green Profile' },

  // Status & Verification
  { name: 'status', description: 'Current status of the MSME registration', dataType: 'enum', required: true, example: 'active', validValues: ['draft', 'submitted', 'under_review', 'verified', 'active', 'suspended', 'inactive'], category: 'Status' },
  { name: 'verification_date', description: 'Date when the MSME was verified', dataType: 'date', required: false, example: '2025-01-16', category: 'Status' },
  { name: 'verified_by', description: 'Name of officer who verified the record', dataType: 'string', required: false, example: 'Sarah Kila', category: 'Status' },
  { name: 'data_consent_given', description: 'Whether MSME has consented to data collection', dataType: 'boolean', required: true, example: 'true', category: 'Status' },

  // Banking
  { name: 'has_bank_account', description: 'Whether business has a formal bank account', dataType: 'boolean', required: true, example: 'true', category: 'Banking' },
  { name: 'bank_name', description: 'Name of primary bank', dataType: 'string', required: false, example: 'BSP', category: 'Banking' },
  { name: 'account_type', description: 'Type of bank account', dataType: 'enum', required: false, example: 'business', validValues: ['savings', 'current', 'business'], category: 'Banking' },
  { name: 'mobile_money_provider', description: 'Mobile money service used', dataType: 'string', required: false, example: 'BSP Mobile', category: 'Banking' },
];

const typeIcons: Record<string, React.ReactNode> = {
  string: <Type className="h-4 w-4 text-blue-500" />,
  number: <Hash className="h-4 w-4 text-emerald-500" />,
  boolean: <ToggleLeft className="h-4 w-4 text-violet-500" />,
  date: <Calendar className="h-4 w-4 text-amber-500" />,
  enum: <List className="h-4 w-4 text-rose-500" />,
  array: <Tag className="h-4 w-4 text-cyan-500" />,
  object: <Database className="h-4 w-4 text-slate-500" />,
};

export default function DataDictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(dataFields.map(f => f.category)))];

  const filteredFields = dataFields.filter(field => {
    if (searchQuery && !field.name.toLowerCase().includes(searchQuery.toLowerCase()) && !field.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory !== 'all' && field.category !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-900 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Dictionary</h1>
                <p className="text-slate-500">Complete field reference for the MSME database schema</p>
              </div>
            </div>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>

          {/* Introduction Card */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">About This Data Dictionary</h3>
                  <p className="text-sm text-slate-600">
                    This document provides a comprehensive reference for all data fields captured in the PNG National MSME Database.
                    It is designed to support policy analysts, researchers, and development partners in understanding the data structure,
                    definitions, and valid values for each field. The database schema follows DFAT data governance standards and supports
                    GESI (Gender Equality and Social Inclusion) and climate-smart reporting requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{dataFields.length}</p>
                <p className="text-sm text-slate-500">Total Fields</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">{dataFields.filter(f => f.required).length}</p>
                <p className="text-sm text-slate-500">Required Fields</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{categories.length - 1}</p>
                <p className="text-sm text-slate-500">Categories</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">v1.0</p>
                <p className="text-sm text-slate-500">Schema Version</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search field names or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-white border border-slate-200 p-1 flex-wrap">
                {categories.map(cat => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 capitalize"
                  >
                    {cat === 'all' ? 'All' : cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Data Table */}
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[200px]">Field Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Required</TableHead>
                    <TableHead className="w-[200px]">Example / Valid Values</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFields.map((field, idx) => (
                    <TableRow key={field.name} className="hover:bg-slate-50/50">
                      <TableCell>
                        <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">
                          {field.name}
                        </code>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-600">{field.description}</p>
                        <Badge variant="outline" className="text-xs mt-1 bg-slate-50">
                          {field.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {typeIcons[field.dataType]}
                          <span className="text-sm text-slate-600 capitalize">{field.dataType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {field.required ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {field.validValues ? (
                          <div className="flex flex-wrap gap-1">
                            {field.validValues.slice(0, 3).map(val => (
                              <Badge key={val} variant="outline" className="text-xs">
                                {val}
                              </Badge>
                            ))}
                            {field.validValues.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{field.validValues.length - 3} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <code className="text-xs font-mono text-slate-500">{field.example}</code>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Note:</strong> This data dictionary is maintained by the SMEC Data Management Team.
              For questions about data definitions or to request additions, please contact the SMEC Registry Administrator.
              Last updated: February 2026 | Schema Version: 1.0
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
