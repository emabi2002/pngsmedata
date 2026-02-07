'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_DASHBOARD_STATS, MOCK_MSMES } from '@/lib/mock-data';
import { BUSINESS_SECTORS, REGIONS, PNG_PROVINCES } from '@/lib/png-data';
import {
  Building2,
  TrendingUp,
  Users,
  Leaf,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  FileCheck,
  Wallet,
  MapPin,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
  color = 'emerald',
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  color?: 'emerald' | 'amber' | 'blue' | 'violet' | 'rose';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <Card className="relative overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          <div className={`rounded-xl p-3 border ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {change && (
          <div className="mt-3 flex items-center gap-1">
            {changeType === 'positive' && (
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            )}
            {changeType === 'negative' && (
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-emerald-600' :
              changeType === 'negative' ? 'text-rose-600' : 'text-slate-600'
            }`}>
              {change}
            </span>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProvincialDistribution() {
  const stats = MOCK_DASHBOARD_STATS;
  const maxCount = Math.max(...stats.byProvince.map(p => p.count));

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Provincial Distribution</CardTitle>
            <CardDescription>MSME count by province</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <MapPin className="h-4 w-4" />
            View Map
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.byProvince.slice(0, 8).map((province, idx) => (
          <div key={province.provinceId} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{province.provinceName}</span>
              <span className="text-slate-500">{province.count.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${(province.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full mt-2 text-slate-500">
          View all 22 provinces
        </Button>
      </CardContent>
    </Card>
  );
}

function SectorBreakdown() {
  const stats = MOCK_DASHBOARD_STATS;
  const total = stats.bySector.reduce((acc, s) => acc + s.count, 0);

  const sectorColors = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Sector Breakdown</CardTitle>
            <CardDescription>Distribution by business sector</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Donut chart representation */}
        <div className="flex items-center gap-6 mb-4">
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              {stats.bySector.slice(0, 5).reduce((acc, sector, idx) => {
                const percentage = (sector.count / total) * 100;
                const offset = acc.offset;
                acc.elements.push(
                  <circle
                    key={sector.sectorId}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={`hsl(${160 + idx * 20}, 70%, ${45 + idx * 5}%)`}
                    strokeWidth="20"
                    strokeDasharray={`${percentage} ${100 - percentage}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-500"
                  />
                );
                acc.offset += percentage;
                return acc;
              }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</span>
              <span className="text-xs text-slate-500">Total</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {stats.bySector.slice(0, 5).map((sector, idx) => (
              <div key={sector.sectorId} className="flex items-center gap-2 text-sm">
                <div className={`h-3 w-3 rounded-full ${sectorColors[idx]}`} />
                <span className="flex-1 truncate text-slate-700">{sector.sectorName}</span>
                <span className="font-medium text-slate-900">{sector.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InclusionMetrics() {
  const stats = MOCK_DASHBOARD_STATS;

  const inclusionData = [
    {
      label: 'Women-Led',
      count: stats.womenLedCount,
      percentage: Math.round((stats.womenLedCount / stats.totalMSMEs) * 100),
      color: 'bg-rose-500',
      target: 30,
    },
    {
      label: 'Youth-Led',
      count: stats.youthLedCount,
      percentage: Math.round((stats.youthLedCount / stats.totalMSMEs) * 100),
      color: 'bg-amber-500',
      target: 25,
    },
    {
      label: 'PWD Ownership',
      count: stats.pwdOwnershipCount,
      percentage: Math.round((stats.pwdOwnershipCount / stats.totalMSMEs) * 100),
      color: 'bg-violet-500',
      target: 5,
    },
    {
      label: 'Green Ready',
      count: stats.greenReadyCount,
      percentage: Math.round((stats.greenReadyCount / stats.totalMSMEs) * 100),
      color: 'bg-emerald-500',
      target: 40,
    },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Inclusion & Green Metrics</CardTitle>
            <CardDescription>GESI and climate indicators</CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Climate FIRST
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {inclusionData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-semibold">{item.count.toLocaleString()}</span>
                <span className="text-slate-500">({item.percentage}%)</span>
              </div>
            </div>
            <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
              {/* Target indicator */}
              <div
                className="absolute top-0 h-full w-0.5 bg-slate-400"
                style={{ left: `${item.target}%` }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-xs text-slate-400">Target: {item.target}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentMSMEs() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Recent Registrations</CardTitle>
            <CardDescription>Latest MSME submissions</CardDescription>
          </div>
          <Link href="/registry">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_MSMES.slice(0, 5).map((msme) => (
          <Link
            key={msme.id}
            href={`/registry/${msme.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-medium text-sm">
              {msme.businessName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{msme.businessName}</p>
              <p className="text-xs text-slate-500">{msme.sectorName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={`text-xs ${
                  msme.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  msme.status === 'submitted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  msme.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  msme.status === 'verified' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {msme.status.replace('_', ' ')}
              </Badge>
              {msme.isWomenLed && (
                <Badge variant="outline" className="text-xs bg-rose-50 text-rose-600 border-rose-200">
                  Women-led
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function VerificationQueue() {
  const pendingMSMEs = MOCK_MSMES.filter(m => m.status === 'submitted' || m.status === 'under_review');

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <CardTitle className="text-lg font-semibold">Verification Queue</CardTitle>
              <CardDescription>{MOCK_DASHBOARD_STATS.pendingVerification} awaiting review</CardDescription>
            </div>
          </div>
          <Link href="/verification">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              Review Now
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-white border border-amber-200">
            <p className="text-2xl font-bold text-slate-900">{MOCK_DASHBOARD_STATS.byStatus.submitted}</p>
            <p className="text-xs text-slate-500">Submitted</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white border border-amber-200">
            <p className="text-2xl font-bold text-slate-900">{MOCK_DASHBOARD_STATS.byStatus.under_review}</p>
            <p className="text-xs text-slate-500">Under Review</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white border border-amber-200">
            <p className="text-2xl font-bold text-slate-900">{MOCK_DASHBOARD_STATS.byStatus.verified}</p>
            <p className="text-xs text-slate-500">Verified</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">MSME Command Center</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Live
              </Badge>
            </div>
            <p className="text-slate-500">
              National MSME Database Platform for Papua New Guinea
            </p>
          </div>

          {/* Alert Banner */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Leaf className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">Climate FIRST Initiative</p>
                <p className="text-sm text-slate-400">Supporting green growth and climate resilience for PNG MSMEs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Program Status</p>
                <p className="font-semibold text-emerald-400">Active</p>
              </div>
              <Button variant="secondary" size="sm" className="gap-1">
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total MSMEs"
              value={stats.totalMSMEs.toLocaleString()}
              change="+47 new"
              changeType="positive"
              icon={Building2}
              description="Registered enterprises"
              color="emerald"
            />
            <StatCard
              title="Active MSMEs"
              value={stats.activeMSMEs.toLocaleString()}
              change="+12%"
              changeType="positive"
              icon={CheckCircle2}
              description="Verified and operational"
              color="blue"
            />
            <StatCard
              title="Pending Verification"
              value={stats.pendingVerification}
              change="3 urgent"
              changeType="negative"
              icon={Clock}
              description="Awaiting review"
              color="amber"
            />
            <StatCard
              title="Finance Pipeline"
              value={`K${(stats.financeNeedTotal * 50000).toLocaleString()}`}
              change="+8 referrals"
              changeType="positive"
              icon={Wallet}
              description="Total finance needs identified"
              color="violet"
            />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="bg-white border border-slate-200 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="inclusion" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Inclusion
              </TabsTrigger>
              <TabsTrigger value="green" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Green Growth
              </TabsTrigger>
              <TabsTrigger value="finance" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                Finance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <VerificationQueue />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProvincialDistribution />
                    <SectorBreakdown />
                  </div>
                </div>
                <div className="space-y-6">
                  <InclusionMetrics />
                  <RecentMSMEs />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inclusion" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Women-Led Enterprises"
                  value={stats.womenLedCount.toLocaleString()}
                  change="+15 this month"
                  changeType="positive"
                  icon={Users}
                  description={`${Math.round((stats.womenLedCount / stats.totalMSMEs) * 100)}% of total`}
                  color="rose"
                />
                <StatCard
                  title="Youth-Led Enterprises"
                  value={stats.youthLedCount.toLocaleString()}
                  change="+23 this month"
                  changeType="positive"
                  icon={TrendingUp}
                  description={`${Math.round((stats.youthLedCount / stats.totalMSMEs) * 100)}% of total`}
                  color="amber"
                />
                <StatCard
                  title="PWD Ownership"
                  value={stats.pwdOwnershipCount.toLocaleString()}
                  change="+5 this month"
                  changeType="positive"
                  icon={Users}
                  description={`${Math.round((stats.pwdOwnershipCount / stats.totalMSMEs) * 100)}% of total`}
                  color="violet"
                />
              </div>
            </TabsContent>

            <TabsContent value="green" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Green Certified"
                  value="89"
                  icon={Leaf}
                  description="Fully certified green enterprises"
                  color="emerald"
                />
                <StatCard
                  title="Green Ready"
                  value={stats.greenReadyCount.toLocaleString()}
                  icon={CheckCircle2}
                  description="Meeting green criteria"
                  color="emerald"
                />
                <StatCard
                  title="Transitioning"
                  value="312"
                  icon={TrendingUp}
                  description="In green transition"
                  color="blue"
                />
                <StatCard
                  title="Emerging"
                  value="612"
                  icon={AlertCircle}
                  description="Early stage green adoption"
                  color="amber"
                />
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Finance Referrals"
                  value="158"
                  change="+12 this month"
                  changeType="positive"
                  icon={Wallet}
                  description="Active referrals to financial institutions"
                  color="violet"
                />
                <StatCard
                  title="Loan Approvals"
                  value="67"
                  icon={CheckCircle2}
                  description="Approved this quarter"
                  color="emerald"
                />
                <StatCard
                  title="Green Finance"
                  value="K2.4M"
                  icon={Leaf}
                  description="Green finance disbursed"
                  color="emerald"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
            <div>
              <p className="font-medium text-slate-900">Quick Export</p>
              <p className="text-sm text-slate-500">Download current dashboard data</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                PDF Report
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
