'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_PROGRAMS } from '@/lib/mock-data';
import type { Program } from '@/lib/types';
import {
  Plus,
  Users,
  Leaf,
  Calendar,
  Target,
  GraduationCap,
  Wallet,
  Handshake,
  Lightbulb,
  Settings,
  ChevronRight,
  Building2,
  TrendingUp,
  Clock,
} from 'lucide-react';

const programTypeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  training: { icon: GraduationCap, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  incubation: { icon: Lightbulb, color: 'bg-violet-100 text-violet-600 border-violet-200' },
  grant: { icon: Wallet, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  mentorship: { icon: Handshake, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  market_linkage: { icon: TrendingUp, color: 'bg-rose-100 text-rose-600 border-rose-200' },
  technical_assistance: { icon: Settings, color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
};

function ProgramCard({ program }: { program: Program }) {
  const typeConfig = programTypeConfig[program.type] || programTypeConfig.training;
  const TypeIcon = typeConfig.icon;
  const progressPercent = program.maxParticipants
    ? Math.round((program.currentParticipants / program.maxParticipants) * 100)
    : 0;

  return (
    <Card className="border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl border ${typeConfig.color}`}>
            <TypeIcon className="h-6 w-6" />
          </div>
          <Badge
            variant="outline"
            className={`${
              program.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              program.status === 'planned' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              program.status === 'completed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {program.status}
          </Badge>
        </div>

        <h3 className="font-semibold text-slate-900 mb-1">{program.name}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{program.description}</p>

        {/* Focus Tags */}
        <div className="flex items-center gap-2 mb-4">
          {program.isFocusedOnWomen && (
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-600 border-rose-200">
              <Users className="h-3 w-3 mr-1" />
              Women
            </Badge>
          )}
          {program.isFocusedOnYouth && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
              Youth
            </Badge>
          )}
          {program.isFocusedOnGreen && (
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
              <Leaf className="h-3 w-3 mr-1" />
              Green
            </Badge>
          )}
        </div>

        {/* Provider & Date */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <span>{program.provider}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {program.startDate}
          </div>
        </div>

        {/* Capacity */}
        {program.maxParticipants && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Enrollment</span>
              <span className="font-medium">
                {program.currentParticipants} / {program.maxParticipants}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full mt-4 gap-1">
          View Program
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const activePrograms = MOCK_PROGRAMS.filter(p => p.status === 'active');
  const plannedPrograms = MOCK_PROGRAMS.filter(p => p.status === 'planned');
  const completedPrograms = MOCK_PROGRAMS.filter(p => p.status === 'completed');

  const filteredPrograms = activeTab === 'all'
    ? MOCK_PROGRAMS
    : MOCK_PROGRAMS.filter(p => p.status === activeTab);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Programs</h1>
              <p className="text-slate-500">Manage support programs and interventions</p>
            </div>
            <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Create Program
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Programs</p>
                    <p className="text-3xl font-bold text-slate-900">{MOCK_PROGRAMS.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700">Active</p>
                    <p className="text-3xl font-bold text-emerald-900">{activePrograms.length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Participants</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {MOCK_PROGRAMS.reduce((acc, p) => acc + p.currentParticipants, 0)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Green Programs</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {MOCK_PROGRAMS.filter(p => p.isFocusedOnGreen).length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <Leaf className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-white border border-slate-200 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                All Programs
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Active ({activePrograms.length})
              </TabsTrigger>
              <TabsTrigger
                value="planned"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Planned ({plannedPrograms.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                Completed ({completedPrograms.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Program Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* Climate FIRST Banner */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 mt-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-white shadow-sm">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">Climate FIRST Green Enterprise Fund</h3>
                  <p className="text-slate-600">
                    New grant program launching March 2025 for MSMEs adopting climate-smart practices.
                    Funded by DFAT through GGGI.
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
