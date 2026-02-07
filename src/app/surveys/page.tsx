'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  ClipboardList,
  Users,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  ChevronRight,
  Smartphone,
  FileSpreadsheet,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for campaigns
const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    campaignCode: 'SURVEY-2026-001',
    name: 'National MSME Census 2026',
    description: 'Comprehensive survey of all registered MSMEs across PNG for policy baseline.',
    status: 'active' as const,
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    targetSMECount: 5000,
    actualSMECount: 1247,
    targetProvinces: ['ncd', 'morobe', 'western-highlands', 'eastern-highlands', 'east-new-britain'],
    enumeratorCount: 45,
    responsesApproved: 1102,
    responsesPending: 145,
    createdBy: 'Sarah Kila',
  },
  {
    id: 'camp-002',
    campaignCode: 'SURVEY-2026-002',
    name: 'Women in Business Survey',
    description: 'Targeted survey of women-led enterprises for GESI baseline assessment.',
    status: 'active' as const,
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    targetSMECount: 500,
    actualSMECount: 234,
    targetProvinces: ['ncd', 'morobe', 'milne-bay'],
    enumeratorCount: 15,
    responsesApproved: 198,
    responsesPending: 36,
    createdBy: 'Admin',
  },
  {
    id: 'camp-003',
    campaignCode: 'SURVEY-2026-003',
    name: 'Green Enterprise Assessment',
    description: 'Climate FIRST program baseline survey for green readiness scoring.',
    status: 'planned' as const,
    startDate: '2026-03-01',
    endDate: '2026-05-31',
    targetSMECount: 1000,
    actualSMECount: 0,
    targetProvinces: ['western-highlands', 'eastern-highlands', 'chimbu', 'enga'],
    enumeratorCount: 0,
    responsesApproved: 0,
    responsesPending: 0,
    createdBy: 'Admin',
  },
  {
    id: 'camp-004',
    campaignCode: 'SURVEY-2025-004',
    name: 'Agriculture Sector Survey',
    description: 'Sector-specific survey of agriculture and agribusiness MSMEs.',
    status: 'completed' as const,
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    targetSMECount: 800,
    actualSMECount: 756,
    targetProvinces: ['western-highlands', 'eastern-highlands', 'morobe', 'madang'],
    enumeratorCount: 25,
    responsesApproved: 756,
    responsesPending: 0,
    createdBy: 'Provincial Officer',
  },
];

type CampaignStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';

const statusConfig: Record<CampaignStatus, { label: string; className: string; icon: React.ReactNode }> = {
  planned: { label: 'Planned', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Calendar className="h-3 w-3" /> },
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Play className="h-3 w-3" /> },
  paused: { label: 'Paused', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Pause className="h-3 w-3" /> },
  completed: { label: 'Completed', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200', icon: <Clock className="h-3 w-3" /> },
};

function CampaignCard({ campaign }: { campaign: typeof MOCK_CAMPAIGNS[0] }) {
  const status = statusConfig[campaign.status];
  const progressPercent = campaign.targetSMECount > 0
    ? Math.round((campaign.actualSMECount / campaign.targetSMECount) * 100)
    : 0;

  return (
    <Card className="border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="outline" className={`text-xs ${status.className} gap-1 mb-2`}>
              {status.icon}
              {status.label}
            </Badge>
            <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
            <p className="text-xs text-slate-500">{campaign.campaignCode}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Manage Enumerators
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Responses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Collection Progress</span>
            <span className="font-medium">
              {campaign.actualSMECount.toLocaleString()} / {campaign.targetSMECount.toLocaleString()}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-slate-500 text-right">{progressPercent}% complete</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-slate-50">
            <p className="text-lg font-bold text-slate-900">{campaign.enumeratorCount}</p>
            <p className="text-xs text-slate-500">Enumerators</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-emerald-50">
            <p className="text-lg font-bold text-emerald-700">{campaign.responsesApproved}</p>
            <p className="text-xs text-slate-500">Approved</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-amber-50">
            <p className="text-lg font-bold text-amber-700">{campaign.responsesPending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {campaign.startDate} - {campaign.endDate}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {campaign.targetProvinces.length} provinces
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full gap-1">
          View Campaign
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function NewCampaignDialog() {
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    toast.success('Campaign created successfully');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Survey Campaign</DialogTitle>
          <DialogDescription>
            Set up a new data collection campaign for MSME surveying.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Campaign Name *</Label>
            <Input placeholder="e.g., National MSME Census 2026" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the purpose and scope of this campaign..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Target SME Count *</Label>
            <Input type="number" placeholder="500" />
          </div>
          <div className="space-y-2">
            <Label>Data Entry Mode</Label>
            <Select defaultValue="digital_field">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_field">Digital Field Collection</SelectItem>
                <SelectItem value="digital_office">Digital Office Entry</SelectItem>
                <SelectItem value="paper_transcription">Paper Form Transcription</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
            Create Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SurveysPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const activeCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'active');
  const plannedCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'planned');
  const completedCampaigns = MOCK_CAMPAIGNS.filter(c => c.status === 'completed');

  const filteredCampaigns = activeTab === 'all'
    ? MOCK_CAMPAIGNS
    : MOCK_CAMPAIGNS.filter(c => c.status === activeTab);

  const totalResponses = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.actualSMECount, 0);
  const totalTarget = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.targetSMECount, 0);
  const totalEnumerators = MOCK_CAMPAIGNS.filter(c => c.status === 'active').reduce((acc, c) => acc + c.enumeratorCount, 0);

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
                <h1 className="text-2xl font-bold text-slate-900">Survey Campaigns</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  TOR v2
                </Badge>
              </div>
              <p className="text-slate-500">Manage field data collection campaigns for MSME surveying</p>
            </div>
            <NewCampaignDialog />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Campaigns</p>
                    <p className="text-3xl font-bold text-slate-900">{MOCK_CAMPAIGNS.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">Active Campaigns</p>
                    <p className="text-3xl font-bold text-emerald-900">{activeCampaigns.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <Play className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Responses</p>
                    <p className="text-3xl font-bold text-slate-900">{totalResponses.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Active Enumerators</p>
                    <p className="text-3xl font-bold text-slate-900">{totalEnumerators}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collection Methods Banner */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Digital Field Collection</p>
                    <p className="text-xs text-slate-600">Mobile app for enumerators</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Paper Transcription</p>
                    <p className="text-xs text-slate-600">Office data entry from forms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Target className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Duplicate Detection</p>
                    <p className="text-xs text-slate-600">Automatic matching & merge</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                    View Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  All ({MOCK_CAMPAIGNS.length})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Active ({activeCampaigns.length})
                </TabsTrigger>
                <TabsTrigger
                  value="planned"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Planned ({plannedCampaigns.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Completed ({completedCampaigns.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {/* Quick Stats Summary */}
          <Card className="border-slate-200 mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Collection Summary</CardTitle>
              <CardDescription>Overall progress across all active campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Target</span>
                  <span className="font-bold text-slate-900">{totalTarget.toLocaleString()} SMEs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Collected</span>
                  <span className="font-bold text-emerald-600">{totalResponses.toLocaleString()} SMEs</span>
                </div>
                <Progress value={(totalResponses / totalTarget) * 100} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Overall Progress</span>
                  <span className="font-medium text-emerald-600">
                    {Math.round((totalResponses / totalTarget) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
