'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { REGIONS, PNG_PROVINCES, PNG_DISTRICTS } from '@/lib/png-data';
import {
  MapPinned,
  Plus,
  Edit,
  ChevronRight,
  ChevronDown,
  MapPin,
  Layers,
  Building,
  Home,
  Upload,
  Download,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface ProvinceWithDistricts {
  id: string;
  name: string;
  code: string;
  region: string;
  districts: Array<{ id: string; name: string; provinceId: string }>;
  isExpanded: boolean;
}

export default function GeoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProvinces, setExpandedProvinces] = useState<Set<string>>(new Set());

  // Group provinces with their districts
  const provincesWithDistricts: ProvinceWithDistricts[] = PNG_PROVINCES.map(province => ({
    ...province,
    districts: PNG_DISTRICTS.filter(d => d.provinceId === province.id),
    isExpanded: expandedProvinces.has(province.id),
  }));

  const toggleProvince = (provinceId: string) => {
    const newExpanded = new Set(expandedProvinces);
    if (newExpanded.has(provinceId)) {
      newExpanded.delete(provinceId);
    } else {
      newExpanded.add(provinceId);
    }
    setExpandedProvinces(newExpanded);
  };

  const filteredProvinces = provincesWithDistricts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDistricts = PNG_DISTRICTS.length;
  const regionCounts = REGIONS.map(region => ({
    ...region,
    provinceCount: PNG_PROVINCES.filter(p => p.region === region.id).length,
  }));

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
                <MapPinned className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">Geographic Data</h1>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Admin Only
                  </Badge>
                </div>
                <p className="text-slate-500">Manage PNG administrative hierarchy (Region to Province to District to LLG to Ward to Village)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{REGIONS.length}</p>
                <p className="text-sm text-slate-500">Regions</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{PNG_PROVINCES.length}</p>
                <p className="text-sm text-slate-500">Provinces</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-slate-900">{totalDistricts}</p>
                <p className="text-sm text-slate-500">Districts</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">--</p>
                <p className="text-sm text-slate-500">LLGs</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">--</p>
                <p className="text-sm text-slate-500">Wards</p>
              </CardContent>
            </Card>
          </div>

          {/* Regions Overview */}
          <Card className="border-slate-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Regions Overview</CardTitle>
              <CardDescription>Papua New Guinea's four main geographic regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {regionCounts.map(region => (
                  <div
                    key={region.id}
                    className="p-4 rounded-xl border-2 text-center"
                    style={{ borderColor: region.color, backgroundColor: `${region.color}10` }}
                  >
                    <div
                      className="w-12 h-12 mx-auto rounded-full mb-3 flex items-center justify-center"
                      style={{ backgroundColor: `${region.color}30` }}
                    >
                      <MapPin className="h-6 w-6" style={{ color: region.color }} />
                    </div>
                    <p className="font-semibold text-slate-900">{region.name}</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: region.color }}>
                      {region.provinceCount}
                    </p>
                    <p className="text-xs text-slate-500">Provinces</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Province & District Management */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Provinces & Districts</CardTitle>
                  <CardDescription>Manage the administrative hierarchy</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Search provinces..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Province
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {REGIONS.map(region => {
                  const regionProvinces = filteredProvinces.filter(p => p.region === region.id);
                  if (regionProvinces.length === 0) return null;

                  return (
                    <div key={region.id} className="mb-4">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2"
                        style={{ backgroundColor: `${region.color}15` }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="font-semibold text-slate-900">{region.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {regionProvinces.length} provinces
                        </Badge>
                      </div>

                      <div className="space-y-1 ml-4">
                        {regionProvinces.map(province => (
                          <Collapsible
                            key={province.id}
                            open={expandedProvinces.has(province.id)}
                            onOpenChange={() => toggleProvince(province.id)}
                          >
                            <div className="border border-slate-200 rounded-lg">
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer">
                                  <div className="flex items-center gap-3">
                                    {expandedProvinces.has(province.id) ? (
                                      <ChevronDown className="h-4 w-4 text-slate-400" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-slate-400" />
                                    )}
                                    <Building className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-900">{province.name}</span>
                                    <code className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                                      {province.code}
                                    </code>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {province.districts.length} districts
                                    </Badge>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-xs">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="border-t border-slate-200 p-3 bg-slate-50/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-slate-700">Districts</p>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                      <Plus className="h-3 w-3" />
                                      Add District
                                    </Button>
                                  </div>
                                  {province.districts.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                      {province.districts.map(district => (
                                        <div
                                          key={district.id}
                                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300"
                                        >
                                          <Home className="h-3.5 w-3.5 text-slate-400" />
                                          <span className="text-sm text-slate-700">{district.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-slate-500 italic">No districts defined yet</p>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Hierarchy Note */}
          <Card className="border-amber-200 bg-amber-50 mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Layers className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">TOR V2 Geographic Hierarchy</p>
                  <p className="text-sm text-amber-700">
                    The schema supports a full 6-level hierarchy: Region → Province → District → LLG (Local Level Government) → Ward → Village.
                    LLG, Ward, and Village data can be imported from official PNG government sources or entered manually during MSME registration.
                    GPS coordinates are captured at the village level for accurate mapping.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
