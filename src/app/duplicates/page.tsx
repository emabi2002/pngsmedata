'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  GitMerge,
  Eye,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Users,
  Calendar,
  RefreshCw,
  Filter,
  ChevronRight,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';

// Mock duplicate candidates data
const MOCK_DUPLICATES = [
  {
    id: 'dup-001',
    similarityScore: 92,
    matchReasons: ['name_match', 'phone_match', 'location_match'],
    status: 'pending',
    createdAt: '2026-02-05',
    sme1: {
      id: 'sme-001',
      registrationNumber: 'SMEC-2026-00145',
      businessName: 'Highlands Fresh Produce Ltd',
      tradingName: 'Highlands Fresh',
      phone: '+675 7123 4567',
      province: 'Western Highlands',
      district: 'Mount Hagen',
      sector: 'Agriculture, Forestry & Fishing',
      employeeCount: 12,
      status: 'active',
      registrationDate: '2026-01-15',
      isWomenLed: true,
    },
    sme2: {
      id: 'sme-002',
      registrationNumber: 'SMEC-2026-00289',
      businessName: 'Highland Fresh Produce',
      tradingName: 'Highland Fresh',
      phone: '+675 7123 4567',
      province: 'Western Highlands',
      district: 'Mount Hagen',
      sector: 'Agriculture, Forestry & Fishing',
      employeeCount: 10,
      status: 'submitted',
      registrationDate: '2026-02-01',
      isWomenLed: true,
    },
  },
  {
    id: 'dup-002',
    similarityScore: 78,
    matchReasons: ['name_match', 'location_match'],
    status: 'pending',
    createdAt: '2026-02-04',
    sme1: {
      id: 'sme-003',
      registrationNumber: 'SMEC-2026-00067',
      businessName: 'Pacific Blue Fisheries',
      tradingName: null,
      phone: '+675 7234 5678',
      province: 'Milne Bay',
      district: 'Alotau',
      sector: 'Agriculture, Forestry & Fishing',
      employeeCount: 5,
      status: 'active',
      registrationDate: '2026-01-10',
      isWomenLed: false,
    },
    sme2: {
      id: 'sme-004',
      registrationNumber: 'SMEC-2026-00312',
      businessName: 'Pacific Blue Fish',
      tradingName: 'PB Fisheries',
      phone: '+675 7234 9999',
      province: 'Milne Bay',
      district: 'Alotau',
      sector: 'Agriculture, Forestry & Fishing',
      employeeCount: 6,
      status: 'submitted',
      registrationDate: '2026-02-03',
      isWomenLed: false,
    },
  },
  {
    id: 'dup-003',
    similarityScore: 65,
    matchReasons: ['phone_match'],
    status: 'pending',
    createdAt: '2026-02-03',
    sme1: {
      id: 'sme-005',
      registrationNumber: 'SMEC-2026-00098',
      businessName: 'Lae Coffee Roasters',
      tradingName: null,
      phone: '+675 7456 7890',
      province: 'Morobe',
      district: 'Lae',
      sector: 'Manufacturing',
      employeeCount: 3,
      status: 'active',
      registrationDate: '2026-01-22',
      isWomenLed: true,
    },
    sme2: {
      id: 'sme-006',
      registrationNumber: 'SMEC-2026-00356',
      businessName: 'Morobe Coffee Company',
      tradingName: 'MCC',
      phone: '+675 7456 7890',
      province: 'Morobe',
      district: 'Lae',
      sector: 'Manufacturing',
      employeeCount: 8,
      status: 'submitted',
      registrationDate: '2026-02-02',
      isWomenLed: false,
    },
  },
];

const RESOLVED_DUPLICATES = [
  {
    id: 'dup-r001',
    similarityScore: 95,
    matchReasons: ['name_match', 'phone_match', 'location_match'],
    status: 'merged',
    resolvedAt: '2026-02-01',
    resolvedBy: 'Sarah Kila',
    masterSmeId: 'sme-010',
    mergedSmeId: 'sme-011',
  },
  {
    id: 'dup-r002',
    similarityScore: 72,
    matchReasons: ['name_match'],
    status: 'not_duplicate',
    resolvedAt: '2026-01-28',
    resolvedBy: 'Admin',
    notes: 'Different businesses with similar names',
  },
];

type DuplicateCandidate = typeof MOCK_DUPLICATES[0];

function SimilarityBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 85) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 70) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <Badge variant="outline" className={`text-lg font-bold px-3 py-1 ${getColor()}`}>
      {score}%
    </Badge>
  );
}

function MatchReasonBadge({ reason }: { reason: string }) {
  const config: Record<string, { label: string; className: string }> = {
    name_match: { label: 'Name Match', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    phone_match: { label: 'Phone Match', className: 'bg-violet-50 text-violet-700 border-violet-200' },
    location_match: { label: 'Location Match', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  const { label, className } = config[reason] || { label: reason, className: 'bg-slate-100 text-slate-700' };

  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

function SMEComparisonCard({ sme, isSelected, onSelect }: {
  sme: DuplicateCandidate['sme1'];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50 shadow-md'
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-slate-900">{sme.businessName}</p>
          {sme.tradingName && (
            <p className="text-xs text-slate-500">Trading as: {sme.tradingName}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">{sme.registrationNumber}</p>
        </div>
        <Badge
          variant="outline"
          className={`text-xs ${
            sme.status === 'active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {sme.status}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          {sme.phone}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {sme.district}, {sme.province}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          {sme.sector}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          {sme.employeeCount} employees
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          Registered: {sme.registrationDate}
        </div>
      </div>

      {sme.isWomenLed && (
        <Badge variant="outline" className="mt-3 text-xs bg-rose-50 text-rose-600 border-rose-200">
          Women-Led
        </Badge>
      )}

      {isSelected && (
        <div className="mt-3 flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Selected as Master Record</span>
        </div>
      )}
    </div>
  );
}

function DuplicateCard({ duplicate, onResolve }: {
  duplicate: DuplicateCandidate;
  onResolve: (id: string, action: 'merge' | 'not_duplicate') => void;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [mergeNotes, setMergeNotes] = useState('');

  const handleMerge = () => {
    if (!selectedMaster) {
      toast.error('Please select a master record');
      return;
    }
    onResolve(duplicate.id, 'merge');
    setShowDialog(false);
    toast.success('Records merged successfully');
  };

  const handleNotDuplicate = () => {
    onResolve(duplicate.id, 'not_duplicate');
    toast.success('Marked as not duplicate');
  };

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Potential Duplicate Detected</p>
              <p className="text-xs text-slate-500">Found on {duplicate.createdAt}</p>
            </div>
          </div>
          <SimilarityBadge score={duplicate.similarityScore} />
        </div>

        {/* Match Reasons */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500">Match reasons:</span>
          {duplicate.matchReasons.map((reason) => (
            <MatchReasonBadge key={reason} reason={reason} />
          ))}
        </div>

        {/* SME Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Record A</p>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="font-medium text-slate-900 truncate">{duplicate.sme1.businessName}</p>
              <p className="text-xs text-slate-500">{duplicate.sme1.registrationNumber}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <Phone className="h-3 w-3" />
                {duplicate.sme1.phone}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <MapPin className="h-3 w-3" />
                {duplicate.sme1.province}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Record B</p>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="font-medium text-slate-900 truncate">{duplicate.sme2.businessName}</p>
              <p className="text-xs text-slate-500">{duplicate.sme2.registrationNumber}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <Phone className="h-3 w-3" />
                {duplicate.sme2.phone}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                <MapPin className="h-3 w-3" />
                {duplicate.sme2.province}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={handleNotDuplicate}
          >
            <XCircle className="h-4 w-4" />
            Not Duplicate
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <Button
              size="sm"
              className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowDialog(true)}
            >
              <GitMerge className="h-4 w-4" />
              Merge Records
            </Button>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Merge Duplicate Records</DialogTitle>
                <DialogDescription>
                  Select which record should be kept as the master. The other record will be merged into it.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <SimilarityBadge score={duplicate.similarityScore} />
                  <span className="text-sm text-slate-500">similarity score</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SMEComparisonCard
                    sme={duplicate.sme1}
                    isSelected={selectedMaster === duplicate.sme1.id}
                    onSelect={() => setSelectedMaster(duplicate.sme1.id)}
                  />
                  <SMEComparisonCard
                    sme={duplicate.sme2}
                    isSelected={selectedMaster === duplicate.sme2.id}
                    onSelect={() => setSelectedMaster(duplicate.sme2.id)}
                  />
                </div>

                <div className="mt-4">
                  <Label>Merge Notes (optional)</Label>
                  <Textarea
                    value={mergeNotes}
                    onChange={(e) => setMergeNotes(e.target.value)}
                    placeholder="Add any notes about this merge..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleMerge}
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={!selectedMaster}
                >
                  <GitMerge className="h-4 w-4" />
                  Confirm Merge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href={`/registry/${duplicate.sme1.id}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DuplicatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [duplicates, setDuplicates] = useState(MOCK_DUPLICATES);

  const pendingCount = duplicates.filter(d => d.status === 'pending').length;
  const resolvedCount = RESOLVED_DUPLICATES.length;

  const handleResolve = (id: string, action: 'merge' | 'not_duplicate') => {
    setDuplicates(duplicates.filter(d => d.id !== id));
  };

  const runDuplicateCheck = () => {
    toast.success('Duplicate detection scan started');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Duplicate Detection</h1>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {pendingCount} pending
                </Badge>
              </div>
              <p className="text-slate-500">Identify and resolve potential duplicate MSME records</p>
            </div>
            <Button onClick={runDuplicateCheck} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="h-4 w-4" />
              Run Detection
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700">Pending Review</p>
                    <p className="text-3xl font-bold text-amber-900">{pendingCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">High Confidence</p>
                    <p className="text-3xl font-bold text-red-600">
                      {duplicates.filter(d => d.similarityScore >= 85).length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Resolved Today</p>
                    <p className="text-3xl font-bold text-emerald-600">12</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Resolved</p>
                    <p className="text-3xl font-bold text-slate-900">{resolvedCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detection Algorithm Info */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Similarity Scoring Algorithm</p>
                  <p className="text-sm text-blue-700">
                    Duplicates are detected using fuzzy name matching (40%), phone number comparison (30%),
                    and location matching (20%). Scores above 85% indicate high-confidence duplicates.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-red-600">85%+</p>
                    <p className="text-xs text-slate-500">High</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-amber-600">70-84%</p>
                    <p className="text-xs text-slate-500">Medium</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-yellow-600">50-69%</p>
                    <p className="text-xs text-slate-500">Low</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Tabs */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Resolved ({resolvedCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search by business name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Duplicate Cards */}
          {activeTab === 'pending' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {duplicates.length > 0 ? (
                duplicates.map((duplicate) => (
                  <DuplicateCard
                    key={duplicate.id}
                    duplicate={duplicate}
                    onResolve={handleResolve}
                  />
                ))
              ) : (
                <Card className="col-span-2 border-emerald-200 bg-emerald-50">
                  <CardContent className="p-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-emerald-900 mb-2">All Clear!</h3>
                    <p className="text-emerald-700">No pending duplicate candidates to review.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'resolved' && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Resolved Duplicates</CardTitle>
                <CardDescription>History of resolved duplicate cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RESOLVED_DUPLICATES.map((resolved) => (
                    <div
                      key={resolved.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        {resolved.status === 'merged' ? (
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                            <GitMerge className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                            <XCircle className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {resolved.status === 'merged' ? 'Records Merged' : 'Not a Duplicate'}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {resolved.similarityScore}% match
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            Resolved by {resolved.resolvedBy} on {resolved.resolvedAt}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
