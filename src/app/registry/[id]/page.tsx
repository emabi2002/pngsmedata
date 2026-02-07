'use client';

import { use } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MOCK_MSMES, MOCK_AUDIT_LOG } from '@/lib/mock-data';
import { getProvinceName, getDistrictName } from '@/lib/png-data';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Leaf,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Download,
  Share2,
  User,
  Briefcase,
  CreditCard,
  Shield,
  TrendingUp,
  Target,
  Wallet,
  GraduationCap,
  MoreHorizontal,
  Plus,
} from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Edit className="h-3 w-3" /> },
    submitted: { label: 'Submitted', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="h-3 w-3" /> },
    under_review: { label: 'Under Review', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: <AlertCircle className="h-3 w-3" /> },
    verified: { label: 'Verified', className: 'bg-teal-50 text-teal-700 border-teal-200', icon: <CheckCircle2 className="h-3 w-3" /> },
    active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-3 w-3" /> },
    suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700 border-red-200', icon: <AlertCircle className="h-3 w-3" /> },
    inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500 border-slate-200', icon: <AlertCircle className="h-3 w-3" /> },
  };
  const config = configs[status] || configs.draft;

  return (
    <Badge variant="outline" className={`${config.className} gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

function GreenScoreGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 75) return 'text-emerald-500';
    if (s >= 50) return 'text-teal-500';
    if (s >= 25) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={`${score * 2.51} 251`}
          className={`transition-all duration-1000 ${getColor(score)}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
        <span className="text-xs text-slate-500">Green Score</span>
      </div>
    </div>
  );
}

export default function MSMEDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const msme = MOCK_MSMES.find(m => m.id === id);

  if (!msme) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">MSME Not Found</h2>
                <p className="text-slate-500 mb-4">The MSME you're looking for doesn't exist or has been removed.</p>
                <Link href="/registry">
                  <Button>Back to Registry</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  const auditLogs = MOCK_AUDIT_LOG.filter(log => log.msmeId === msme.id);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/registry">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{msme.businessName}</h1>
                  <StatusBadge status={msme.status} />
                </div>
                <p className="text-sm text-slate-500">{msme.registrationNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              {msme.status === 'submitted' && (
                <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Verify
                </Button>
              )}
            </div>
          </div>

          {/* Header Card */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 text-emerald-600 font-bold text-2xl">
                  {msme.businessName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{msme.businessName}</h2>
                      {msme.tradingName && (
                        <p className="text-sm text-slate-500">Trading as: {msme.tradingName}</p>
                      )}
                      <p className="text-sm text-slate-600 mt-1">{msme.sectorName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {msme.isWomenLed && (
                        <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">
                          <Users className="h-3 w-3 mr-1" />
                          Women-Led
                        </Badge>
                      )}
                      {msme.isYouthLed && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                          Youth-Led
                        </Badge>
                      )}
                      {msme.hasPWDOwnership && (
                        <Badge variant="outline" className="bg-violet-50 text-violet-600 border-violet-200">
                          PWD Ownership
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{getProvinceName(msme.location.provinceId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{msme.primaryPhone}</span>
                    </div>
                    {msme.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{msme.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{msme.employeeCount} employees</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white border border-slate-200 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="owners" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Ownership
              </TabsTrigger>
              <TabsTrigger value="green" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Green Profile
              </TabsTrigger>
              <TabsTrigger value="programs" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Programs
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Documents
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Audit Log
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Business Details */}
                <Card className="border-slate-200 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-slate-400" />
                      Business Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Ownership Type</p>
                        <p className="text-sm font-medium text-slate-900 capitalize">{msme.ownershipType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Business Size</p>
                        <p className="text-sm font-medium text-slate-900 capitalize">{msme.businessSize}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Date Established</p>
                        <p className="text-sm font-medium text-slate-900">{msme.dateEstablished || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Annual Revenue</p>
                        <p className="text-sm font-medium text-slate-900">
                          {msme.annualRevenue ? `K${msme.annualRevenue.toLocaleString()}` : 'Not disclosed'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Products & Services</p>
                      <div className="flex flex-wrap gap-2">
                        {msme.productsServices.map((product, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-50">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">IPA Number</p>
                        <p className="text-sm font-medium text-slate-900">{msme.ipaNumber || 'Not registered'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">TIN Number</p>
                        <p className="text-sm font-medium text-slate-900">{msme.tinNumber || 'Not registered'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">IRC Number</p>
                        <p className="text-sm font-medium text-slate-900">{msme.ircNumber || 'Not registered'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">SMEC Membership</p>
                        <p className="text-sm font-medium text-slate-900">{msme.smecMembershipNumber || 'Not a member'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-emerald-500" />
                        Green Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <GreenScoreGauge score={msme.greenProfile.greenScore} />
                      <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">
                        {msme.greenProfile.greenCategory.replace('_', ' ')}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                        Banking Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Bank Account</span>
                          {msme.hasBankAccount ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-100 text-slate-600">No</Badge>
                          )}
                        </div>
                        {msme.hasBankAccount && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Bank</span>
                              <span className="text-sm font-medium">{msme.bankName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Account Type</span>
                              <span className="text-sm font-medium capitalize">{msme.accountType}</span>
                            </div>
                          </>
                        )}
                        {msme.mobileMoneyProvider && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Mobile Money</span>
                            <span className="text-sm font-medium">{msme.mobileMoneyProvider}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Needs Assessment */}
              {msme.needsAssessment && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-slate-400" />
                      Needs Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {msme.needsAssessment.financeNeed && (
                        <div className="p-4 rounded-lg border border-violet-200 bg-violet-50">
                          <Wallet className="h-5 w-5 text-violet-600 mb-2" />
                          <p className="font-medium text-slate-900">Finance Need</p>
                          <p className="text-sm text-slate-600">
                            K{msme.needsAssessment.financeAmount?.toLocaleString()} - {msme.needsAssessment.financeType}
                          </p>
                        </div>
                      )}
                      {msme.needsAssessment.marketAccessNeed && (
                        <div className="p-4 rounded-lg border border-sky-200 bg-sky-50">
                          <TrendingUp className="h-5 w-5 text-sky-600 mb-2" />
                          <p className="font-medium text-slate-900">Market Access</p>
                          <p className="text-sm text-slate-600 capitalize">{msme.needsAssessment.marketAccessType} market</p>
                        </div>
                      )}
                      {msme.needsAssessment.skillsTrainingNeed && (
                        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                          <GraduationCap className="h-5 w-5 text-amber-600 mb-2" />
                          <p className="font-medium text-slate-900">Skills Training</p>
                          <p className="text-sm text-slate-600">
                            {msme.needsAssessment.skillsTrainingAreas?.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      )}
                      {msme.needsAssessment.equipmentNeed && (
                        <div className="p-4 rounded-lg border border-rose-200 bg-rose-50">
                          <Briefcase className="h-5 w-5 text-rose-600 mb-2" />
                          <p className="font-medium text-slate-900">Equipment</p>
                          <p className="text-sm text-slate-600">{msme.needsAssessment.equipmentType}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Owners Tab */}
            <TabsContent value="owners" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-slate-400" />
                      Ownership Structure
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-rose-50 text-rose-700">
                        Women: {msme.womenOwnershipPercentage}%
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        Youth: {msme.youthOwnershipPercentage}%
                      </Badge>
                      {msme.pwdOwnershipPercentage > 0 && (
                        <Badge variant="outline" className="bg-violet-50 text-violet-700">
                          PWD: {msme.pwdOwnershipPercentage}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {msme.owners.map((owner) => (
                      <div key={owner.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold">
                          {owner.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{owner.fullName}</p>
                            {owner.isYouth && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600">Youth</Badge>
                            )}
                            {owner.isPWD && (
                              <Badge variant="outline" className="text-xs bg-violet-50 text-violet-600">PWD</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="capitalize">{owner.gender}</span>
                            <span>{owner.phone}</span>
                            {owner.email && <span>{owner.email}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">{owner.ownershipPercentage}%</p>
                          <p className="text-xs text-slate-500">Ownership</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Green Profile Tab */}
            <TabsContent value="green" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Green Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <GreenScoreGauge score={msme.greenProfile.greenScore} />
                    <div className="mt-4 w-full space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Category</span>
                        <Badge className="bg-emerald-100 text-emerald-700 capitalize">
                          {msme.greenProfile.greenCategory.replace('_', ' ')}
                        </Badge>
                      </div>
                      {msme.greenProfile.lastAssessmentDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Last Assessment</span>
                          <span className="font-medium">{msme.greenProfile.lastAssessmentDate}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Environmental Practices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase mb-1">Energy Source</p>
                        <p className="font-medium text-slate-900 capitalize">{msme.greenProfile.energySource}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase mb-1">Waste Management</p>
                        <p className="font-medium text-slate-900 capitalize">{msme.greenProfile.wasteManagement}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase mb-1">Water Management</p>
                        <p className="font-medium text-slate-900 capitalize">{msme.greenProfile.waterManagement}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase mb-1">Climate Risk</p>
                        <Badge className={`capitalize ${
                          msme.greenProfile.climateRiskExposure === 'low' ? 'bg-emerald-100 text-emerald-700' :
                          msme.greenProfile.climateRiskExposure === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {msme.greenProfile.climateRiskExposure}
                        </Badge>
                      </div>
                    </div>
                    {msme.greenProfile.hasGreenProducts && msme.greenProfile.greenProductsDescription && (
                      <div className="mt-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                        <p className="text-xs text-emerald-600 uppercase mb-1">Green Products/Services</p>
                        <p className="text-sm text-slate-700">{msme.greenProfile.greenProductsDescription}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Programs Tab */}
            <TabsContent value="programs" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Program Participations</CardTitle>
                    <Button size="sm" variant="outline">Enroll in Program</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {msme.programParticipations.length > 0 ? (
                    <div className="space-y-3">
                      {msme.programParticipations.map((participation) => (
                        <div key={participation.programId} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                          <div>
                            <p className="font-medium text-slate-900">{participation.programName}</p>
                            <p className="text-sm text-slate-500">Enrolled: {participation.enrollmentDate}</p>
                          </div>
                          <Badge className={`capitalize ${
                            participation.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            participation.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {participation.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <GraduationCap className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No program participations yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {msme.financeReferrals.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Finance Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {msme.financeReferrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                          <div>
                            <p className="font-medium text-slate-900">{referral.institutionName}</p>
                            <p className="text-sm text-slate-500">
                              {referral.productType} - K{referral.amount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`capitalize ${
                              referral.status === 'approved' || referral.status === 'disbursed' ? 'bg-emerald-100 text-emerald-700' :
                              referral.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              referral.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {referral.status.replace('_', ' ')}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">
                              Readiness: {referral.readinessRating.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {msme.documents.length > 0 ? (
                    <div className="space-y-3">
                      {msme.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100">
                              <FileText className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{doc.name}</p>
                              <p className="text-xs text-slate-500">
                                Uploaded: {doc.uploadedAt}
                                {doc.verifiedAt && ` | Verified: ${doc.verifiedAt}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              doc.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                              doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {doc.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No documents uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit" className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-slate-400" />
                    Audit Trail
                  </CardTitle>
                  <CardDescription>Complete history of changes to this MSME record</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditLogs.map((log, idx) => (
                      <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            {log.action === 'created' && <Plus className="h-4 w-4 text-slate-600" />}
                            {log.action === 'updated' && <Edit className="h-4 w-4 text-blue-600" />}
                            {log.action === 'verified' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                            {log.action === 'status_changed' && <AlertCircle className="h-4 w-4 text-amber-600" />}
                            {log.action === 'program_enrolled' && <GraduationCap className="h-4 w-4 text-violet-600" />}
                          </div>
                          {idx < auditLogs.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-slate-900 capitalize">
                            {log.action.replace('_', ' ')}
                          </p>
                          {log.field && (
                            <p className="text-sm text-slate-600">
                              {log.field}: {log.oldValue} → {log.newValue}
                            </p>
                          )}
                          {log.newValue && !log.field && (
                            <p className="text-sm text-slate-600">{log.newValue}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {log.userName} • {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
