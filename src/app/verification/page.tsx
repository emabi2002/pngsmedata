'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MOCK_MSMES } from '@/lib/mock-data';
import { getProvinceName } from '@/lib/png-data';
import type { MSME } from '@/lib/types';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  MapPin,
  Users,
  Leaf,
  Building2,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';

function VerificationCard({ msme, onVerify, onReject }: { msme: MSME; onVerify: () => void; onReject: () => void }) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <Card className="border-slate-200 hover:border-emerald-200 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-600 font-semibold">
              {msme.businessName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{msme.businessName}</h3>
              <p className="text-sm text-slate-500">{msme.registrationNumber}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${
              msme.status === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {msme.status === 'submitted' ? 'Submitted' : 'Under Review'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            {getProvinceName(msme.location.provinceId)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="h-4 w-4 text-slate-400" />
            {msme.sectorName}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="h-4 w-4 text-slate-400" />
            {msme.primaryPhone}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400" />
            {msme.registrationDate}
          </div>
        </div>

        {/* Inclusion Tags */}
        <div className="flex items-center gap-2 mb-4">
          {msme.isWomenLed && (
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-600 border-rose-200">
              <Users className="h-3 w-3 mr-1" />
              Women-Led
            </Badge>
          )}
          {msme.isYouthLed && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
              Youth-Led
            </Badge>
          )}
          {msme.greenProfile.greenCategory === 'green_ready' && (
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
              <Leaf className="h-3 w-3 mr-1" />
              Green Ready
            </Badge>
          )}
        </div>

        {/* Document Status */}
        <div className="p-3 rounded-lg bg-slate-50 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Document Status</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {msme.documents.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm">{msme.documents.length} documents</span>
            </div>
            {msme.documents.filter(d => d.status === 'pending').length > 0 && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600">
                {msme.documents.filter(d => d.status === 'pending').length} pending review
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/registry/${msme.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </Link>

          <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <XCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Application</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this MSME application.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onReject();
                    setShowRejectDialog(false);
                  }}
                >
                  Reject Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={onVerify}
          >
            <CheckCircle2 className="h-4 w-4" />
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const pendingMSMEs = MOCK_MSMES.filter(m =>
    m.status === 'submitted' || m.status === 'under_review'
  );

  const filteredMSMEs = pendingMSMEs.filter(msme => {
    if (searchQuery && !msme.businessName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'submitted' && msme.status !== 'submitted') {
      return false;
    }
    if (activeTab === 'under_review' && msme.status !== 'under_review') {
      return false;
    }
    return true;
  });

  const handleVerify = (id: string) => {
    console.log('Verifying MSME:', id);
    // In real app, would call API to update status
  };

  const handleReject = (id: string) => {
    console.log('Rejecting MSME:', id);
    // In real app, would call API to update status
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {pendingMSMEs.length} pending
              </Badge>
            </div>
            <p className="text-slate-500">Review and verify MSME applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700">Total Pending</p>
                    <p className="text-3xl font-bold text-amber-900">{pendingMSMEs.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">New Submissions</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {pendingMSMEs.filter(m => m.status === 'submitted').length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Under Review</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {pendingMSMEs.filter(m => m.status === 'under_review').length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Verified Today</p>
                    <p className="text-3xl font-bold text-slate-900">12</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  All ({pendingMSMEs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="submitted"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Submitted ({pendingMSMEs.filter(m => m.status === 'submitted').length})
                </TabsTrigger>
                <TabsTrigger
                  value="under_review"
                  className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Under Review ({pendingMSMEs.filter(m => m.status === 'under_review').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search applications..."
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

          {/* Verification Cards */}
          {filteredMSMEs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMSMEs.map(msme => (
                <VerificationCard
                  key={msme.id}
                  msme={msme}
                  onVerify={() => handleVerify(msme.id)}
                  onReject={() => handleReject(msme.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">All caught up!</h3>
                <p className="text-slate-500">No pending applications to review.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
