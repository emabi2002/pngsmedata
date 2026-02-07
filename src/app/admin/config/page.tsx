'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import {
  Sliders,
  Plus,
  Edit,
  Trash2,
  Building2,
  Layers,
  Target,
  FileCheck,
  Save,
  CheckCircle2,
  Info,
  AlertCircle,
} from 'lucide-react';

// Mock MSME Definition Config
const MSME_DEFINITIONS = [
  { id: '1', category: 'micro', minEmployees: 1, maxEmployees: 5, description: 'Micro enterprise: 1-5 employees', isActive: true },
  { id: '2', category: 'small', minEmployees: 6, maxEmployees: 20, description: 'Small enterprise: 6-20 employees', isActive: true },
  { id: '3', category: 'medium', minEmployees: 21, maxEmployees: 100, description: 'Medium enterprise: 21-100 employees', isActive: true },
];

// Mock Sectors
const CONFIG_SECTORS = [
  { id: '1', code: 'AGR', name: 'Agriculture, Forestry & Fishing', isActive: true, sortOrder: 1 },
  { id: '2', code: 'MFG', name: 'Manufacturing', isActive: true, sortOrder: 2 },
  { id: '3', code: 'CON', name: 'Construction', isActive: true, sortOrder: 3 },
  { id: '4', code: 'RET', name: 'Wholesale & Retail Trade', isActive: true, sortOrder: 4 },
  { id: '5', code: 'TRN', name: 'Transport & Logistics', isActive: true, sortOrder: 5 },
  { id: '6', code: 'ACC', name: 'Accommodation & Food Services', isActive: true, sortOrder: 6 },
  { id: '7', code: 'ICT', name: 'Information & Communication', isActive: true, sortOrder: 7 },
  { id: '8', code: 'FIN', name: 'Financial & Insurance', isActive: false, sortOrder: 8 },
];

// Mock Support Needs
const SUPPORT_NEEDS = [
  { id: '1', category: 'finance', name: 'Working Capital', description: 'Need for working capital or cash flow financing', isActive: true },
  { id: '2', category: 'finance', name: 'Equipment Finance', description: 'Need for equipment purchase or lease financing', isActive: true },
  { id: '3', category: 'market_access', name: 'Local Market Linkage', description: 'Access to local/provincial markets', isActive: true },
  { id: '4', category: 'market_access', name: 'Export Assistance', description: 'Support for export market access', isActive: true },
  { id: '5', category: 'training', name: 'Financial Management', description: 'Training in bookkeeping and financial management', isActive: true },
  { id: '6', category: 'training', name: 'Digital Skills', description: 'Training in digital marketing and e-commerce', isActive: true },
  { id: '7', category: 'compliance', name: 'Business Registration', description: 'Support for formal registration (IPA/IRC)', isActive: true },
];

// Mock Document Types
const DOCUMENT_TYPES = [
  { id: '1', code: 'IPA_CERT', name: 'IPA Certificate of Incorporation', isRequiredForFormal: true, isActive: true },
  { id: '2', code: 'IRC_CERT', name: 'IRC Registration Certificate', isRequiredForFormal: true, isActive: true },
  { id: '3', code: 'TIN_CERT', name: 'TIN Certificate', isRequiredForFormal: true, isActive: true },
  { id: '4', code: 'BUS_LICENSE', name: 'Business License', isRequiredForFormal: false, isActive: true },
  { id: '5', code: 'OWNER_ID', name: 'Owner National ID/Passport', isRequiredForFormal: false, isActive: true },
  { id: '6', code: 'BANK_STMT', name: 'Bank Statement', isRequiredForFormal: false, isActive: true },
  { id: '7', code: 'PHOTO', name: 'Business Premises Photo', isRequiredForFormal: false, isActive: true },
];

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('msme-definition');

  const handleSave = () => {
    toast.success('Configuration saved successfully');
  };

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
                <Sliders className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">Configuration</h1>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Admin Only
                  </Badge>
                </div>
                <p className="text-slate-500">Manage system configuration and classification rules</p>
              </div>
            </div>
            <Button onClick={handleSave} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>

          {/* Info Banner */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Configuration Management</p>
                  <p className="text-sm text-blue-700">
                    These settings define how MSMEs are classified, what sectors are available, and which documents
                    are required for verification. Changes here will affect the entire system. Please review carefully before saving.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger
                value="msme-definition"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1"
              >
                <Building2 className="h-4 w-4" />
                MSME Definition
              </TabsTrigger>
              <TabsTrigger
                value="sectors"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1"
              >
                <Layers className="h-4 w-4" />
                Sectors
              </TabsTrigger>
              <TabsTrigger
                value="support-needs"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1"
              >
                <Target className="h-4 w-4" />
                Support Needs
              </TabsTrigger>
              <TabsTrigger
                value="document-types"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1"
              >
                <FileCheck className="h-4 w-4" />
                Document Types
              </TabsTrigger>
            </TabsList>

            {/* MSME Definition Tab */}
            <TabsContent value="msme-definition">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">MSME Size Classification</CardTitle>
                      <CardDescription>
                        Define the thresholds for micro, small, and medium enterprise classification (SMEC Standard)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {MSME_DEFINITIONS.map((def) => (
                      <div key={def.id} className="flex items-center gap-6 p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`capitalize ${
                              def.category === 'micro' ? 'bg-violet-100 text-violet-700' :
                              def.category === 'small' ? 'bg-sky-100 text-sky-700' :
                              'bg-indigo-100 text-indigo-700'
                            }`}>
                              {def.category}
                            </Badge>
                            {def.isActive && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{def.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <Label className="text-xs text-slate-500">Min Employees</Label>
                            <Input
                              type="number"
                              value={def.minEmployees}
                              className="w-20 text-center mt-1"
                              readOnly
                            />
                          </div>
                          <div className="text-center">
                            <Label className="text-xs text-slate-500">Max Employees</Label>
                            <Input
                              type="number"
                              value={def.maxEmployees}
                              className="w-20 text-center mt-1"
                              readOnly
                            />
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">Classification Note</p>
                        <p className="text-sm text-amber-700">
                          These thresholds follow the SMEC Standard definition. Alternative classifications (e.g., IFC/OECD aligned)
                          can be configured as separate definition sets.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sectors Tab */}
            <TabsContent value="sectors">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Business Sectors</CardTitle>
                      <CardDescription>
                        Configure the available business sectors for MSME classification
                      </CardDescription>
                    </div>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Sector
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-24">Order</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CONFIG_SECTORS.map((sector) => (
                        <TableRow key={sector.id}>
                          <TableCell>
                            <code className="px-2 py-1 bg-slate-100 rounded text-sm">{sector.code}</code>
                          </TableCell>
                          <TableCell className="font-medium">{sector.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={sector.sortOrder}
                              className="w-16 text-center"
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            <Switch checked={sector.isActive} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Needs Tab */}
            <TabsContent value="support-needs">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Support Needs Categories</CardTitle>
                      <CardDescription>
                        Define the types of support needs that can be captured during MSME registration
                      </CardDescription>
                    </div>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {['finance', 'market_access', 'training', 'compliance'].map((category) => (
                      <div key={category}>
                        <h3 className="font-medium text-slate-900 capitalize mb-3">
                          {category.replace('_', ' ')}
                        </h3>
                        <div className="space-y-2">
                          {SUPPORT_NEEDS.filter(n => n.category === category).map((need) => (
                            <div key={need.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                              <div>
                                <p className="font-medium text-slate-900">{need.name}</p>
                                <p className="text-sm text-slate-500">{need.description}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Switch checked={need.isActive} />
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Document Types Tab */}
            <TabsContent value="document-types">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Document Types</CardTitle>
                      <CardDescription>
                        Configure the document types that can be uploaded for MSME verification
                      </CardDescription>
                    </div>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Document Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-40">Required for Formal</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                        <TableHead className="w-20"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DOCUMENT_TYPES.map((docType) => (
                        <TableRow key={docType.id}>
                          <TableCell>
                            <code className="px-2 py-1 bg-slate-100 rounded text-sm">{docType.code}</code>
                          </TableCell>
                          <TableCell className="font-medium">{docType.name}</TableCell>
                          <TableCell>
                            {docType.isRequiredForFormal ? (
                              <Badge className="bg-red-100 text-red-700">Required</Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-500">Optional</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch checked={docType.isActive} />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
