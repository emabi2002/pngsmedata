'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_DASHBOARD_STATS } from '@/lib/mock-data';
import { REGIONS, PNG_PROVINCES } from '@/lib/png-data';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Leaf,
  TrendingUp,
  Download,
  FileText,
  PieChart,
  Map,
  Calendar,
  ArrowRight,
  Building2,
  Target,
  Wallet,
} from 'lucide-react';

function ReportCard({
  title,
  description,
  icon: Icon,
  href,
  stats,
  color = 'slate',
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  stats?: { label: string; value: string | number }[];
  color?: 'emerald' | 'rose' | 'amber' | 'violet' | 'slate';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <Link href={href}>
      <Card className="border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-500 mb-3">{description}</p>
              {stats && (
                <div className="flex items-center gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ReportsPage() {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-slate-500">Comprehensive MSME data insights and visualizations</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <Calendar className="h-4 w-4" />
                Feb 2026
              </Button>
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">Total MSMEs</p>
                    <p className="text-3xl font-bold text-emerald-900">{stats.totalMSMEs.toLocaleString()}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Active Rate</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {Math.round((stats.activeMSMEs / stats.totalMSMEs) * 100)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Women-Led Rate</p>
                    <p className="text-3xl font-bold text-rose-600">
                      {Math.round((stats.womenLedCount / stats.totalMSMEs) * 100)}%
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-rose-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Green Ready Rate</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {Math.round((stats.greenReadyCount / stats.totalMSMEs) * 100)}%
                    </p>
                  </div>
                  <Leaf className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard
                title="MSME Overview Report"
                description="Complete summary of all registered MSMEs with distribution by status, size, and sector."
                icon={BarChart3}
                href="/reports/overview"
                stats={[
                  { label: 'Total', value: stats.totalMSMEs.toLocaleString() },
                  { label: 'Active', value: stats.activeMSMEs.toLocaleString() },
                ]}
                color="emerald"
              />
              <ReportCard
                title="Inclusion Dashboard"
                description="GESI analysis showing women-led, youth-led, and PWD ownership metrics."
                icon={Users}
                href="/reports/inclusion"
                stats={[
                  { label: 'Women-Led', value: stats.womenLedCount },
                  { label: 'Youth-Led', value: stats.youthLedCount },
                ]}
                color="rose"
              />
              <ReportCard
                title="Green Growth Analysis"
                description="Climate-smart MSME segmentation and green readiness scoring."
                icon={Leaf}
                href="/reports/green"
                stats={[
                  { label: 'Green Ready', value: stats.greenReadyCount },
                  { label: 'Rate', value: `${Math.round((stats.greenReadyCount / stats.totalMSMEs) * 100)}%` },
                ]}
                color="emerald"
              />
              <ReportCard
                title="Finance Pipeline"
                description="Finance needs, referrals, and access to finance analysis."
                icon={Wallet}
                href="/reports/finance"
                stats={[
                  { label: 'Finance Need', value: stats.financeNeedTotal },
                  { label: 'Enrolled', value: stats.programEnrollments },
                ]}
                color="violet"
              />
              <ReportCard
                title="Provincial Distribution"
                description="Geographic distribution of MSMEs across all 22 provinces."
                icon={Map}
                href="/reports/provincial"
                color="amber"
              />
              <ReportCard
                title="Sector Analysis"
                description="Breakdown by business sector and sub-sector classification."
                icon={PieChart}
                href="/reports/sectors"
                color="slate"
              />
            </div>
          </div>

          {/* Regional Summary */}
          <Card className="border-slate-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Regional Distribution</CardTitle>
              <CardDescription>MSME count by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {REGIONS.map((region) => {
                  const provinces = PNG_PROVINCES.filter(p => p.region === region.id);
                  const count = stats.byProvince
                    .filter(p => provinces.some(prov => prov.id === p.provinceId))
                    .reduce((acc, p) => acc + p.count, 0);

                  return (
                    <div
                      key={region.id}
                      className="p-4 rounded-xl border border-slate-200 text-center"
                      style={{ borderColor: region.color }}
                    >
                      <div
                        className="w-12 h-12 mx-auto rounded-full mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${region.color}20` }}
                      >
                        <Map className="h-6 w-6" style={{ color: region.color }} />
                      </div>
                      <p className="font-semibold text-slate-900">{region.name}</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: region.color }}>
                        {count.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">{provinces.length} provinces</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Export Data</CardTitle>
              <CardDescription>Download reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-slate-400" />
                  <span className="font-medium">Full MSME Export</span>
                  <span className="text-xs text-slate-500">CSV format with all fields</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-slate-400" />
                  <span className="font-medium">Executive Summary</span>
                  <span className="text-xs text-slate-500">PDF report for stakeholders</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <PieChart className="h-8 w-8 text-slate-400" />
                  <span className="font-medium">Inclusion Report</span>
                  <span className="text-xs text-slate-500">GESI metrics breakdown</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
