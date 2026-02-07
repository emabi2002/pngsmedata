'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { MOCK_MSMES } from '@/lib/mock-data';
import { PNG_PROVINCES, BUSINESS_SECTORS, getProvinceName } from '@/lib/png-data';
import type { MSME, MSMEStatus, BusinessSize } from '@/lib/types';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  Building2,
  MapPin,
  Users,
  Leaf,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusConfig: Record<MSMEStatus, { label: string; className: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Edit className="h-3 w-3" /> },
  submitted: { label: 'Submitted', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="h-3 w-3" /> },
  under_review: { label: 'Under Review', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: <AlertCircle className="h-3 w-3" /> },
  verified: { label: 'Verified', className: 'bg-teal-50 text-teal-700 border-teal-200', icon: <CheckCircle2 className="h-3 w-3" /> },
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-3 w-3" /> },
  suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: <AlertCircle className="h-3 w-3" /> },
};

const sizeConfig: Record<BusinessSize, { label: string; className: string }> = {
  micro: { label: 'Micro', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  small: { label: 'Small', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  medium: { label: 'Medium', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

function MSMERow({ msme }: { msme: MSME }) {
  const status = statusConfig[msme.status];
  const size = sizeConfig[msme.businessSize];

  return (
    <TableRow className="hover:bg-slate-50/50">
      <TableCell className="w-12">
        <Checkbox />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-600 font-semibold text-sm">
            {msme.businessName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <Link
              href={`/registry/${msme.id}`}
              className="font-medium text-slate-900 hover:text-emerald-600 transition-colors"
            >
              {msme.businessName}
            </Link>
            <p className="text-xs text-slate-500">{msme.registrationNumber}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {getProvinceName(msme.location.provinceId)}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-slate-700">{msme.sectorName}</span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${size.className}`}>
          {size.label}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${status.className} gap-1`}>
          {status.icon}
          {status.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {msme.isWomenLed && (
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-600 border-rose-200 px-1.5">
              <Users className="h-3 w-3" />
            </Badge>
          )}
          {msme.isYouthLed && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 px-1.5">
              Y
            </Badge>
          )}
          {msme.greenProfile.greenCategory === 'green_ready' || msme.greenProfile.greenCategory === 'green_certified' ? (
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200 px-1.5">
              <Leaf className="h-3 w-3" />
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-slate-500">{msme.employeeCount}</span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/registry/${msme.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function RegistryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter MSMEs based on criteria
  const filteredMSMEs = MOCK_MSMES.filter(msme => {
    if (searchQuery && !msme.businessName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedProvince !== 'all' && msme.location.provinceId !== selectedProvince) {
      return false;
    }
    if (selectedSector !== 'all' && msme.sectorId !== selectedSector) {
      return false;
    }
    if (selectedStatus !== 'all' && msme.status !== selectedStatus) {
      return false;
    }
    if (selectedSize !== 'all' && msme.businessSize !== selectedSize) {
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
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MSME Registry</h1>
              <p className="text-slate-500">Manage and view all registered MSMEs</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Link href="/registry/new">
                <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                  Register MSME
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total MSMEs</p>
                    <p className="text-2xl font-bold text-slate-900">1,247</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Women-Led</p>
                    <p className="text-2xl font-bold text-slate-900">312</p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Green Ready</p>
                    <p className="text-2xl font-bold text-slate-900">234</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Leaf className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">156</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search by business name, registration number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedProvince !== 'all' || selectedSector !== 'all' || selectedStatus !== 'all' || selectedSize !== 'all') && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-emerald-600">
                      !
                    </Badge>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Province</Label>
                    <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Provinces" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Provinces</SelectItem>
                        {PNG_PROVINCES.map(province => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Sector</Label>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        {BUSINESS_SECTORS.map(sector => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Business Size</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Sizes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        {Object.entries(sizeConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMSMEs.map(msme => (
                    <MSMERow key={msme.id} msme={msme} />
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{filteredMSMEs.length}</span> of{' '}
                  <span className="font-medium">{MOCK_MSMES.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
