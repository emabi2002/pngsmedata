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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PNG_PROVINCES, BUSINESS_SECTORS, getDistrictsByProvince } from '@/lib/png-data';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Users,
  Leaf,
  CreditCard,
  FileText,
  Save,
  Send,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Business Info', icon: Building2 },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Ownership', icon: Users },
  { id: 4, name: 'Green Profile', icon: Leaf },
  { id: 5, name: 'Banking', icon: CreditCard },
  { id: 6, name: 'Documents', icon: FileText },
];

interface Owner {
  id: string;
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  ownershipPercentage: number;
  isYouth: boolean;
  isPWD: boolean;
}

export default function NewMSMEPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Info
    businessName: '',
    tradingName: '',
    ownershipType: '',
    dateEstablished: '',
    sectorId: '',
    subSectorId: '',
    productsServices: '',
    employeeCount: '',
    annualRevenue: '',
    ipaNumber: '',
    ircNumber: '',
    tinNumber: '',

    // Location
    provinceId: '',
    districtId: '',
    llg: '',
    ward: '',
    village: '',
    streetAddress: '',

    // Contact
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    website: '',

    // Green Profile
    hasGreenProducts: false,
    greenProductsDescription: '',
    energySource: '',
    wasteManagement: '',
    waterManagement: '',
    climateRiskExposure: '',

    // Banking
    hasBankAccount: false,
    bankName: '',
    accountType: '',
    mobileMoneyProvider: '',

    // Consent
    dataConsentGiven: false,
    marketingConsentGiven: false,
  });

  const [owners, setOwners] = useState<Owner[]>([
    { id: '1', fullName: '', gender: '', phone: '', email: '', ownershipPercentage: 100, isYouth: false, isPWD: false }
  ]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addOwner = () => {
    setOwners([...owners, {
      id: String(Date.now()),
      fullName: '',
      gender: '',
      phone: '',
      email: '',
      ownershipPercentage: 0,
      isYouth: false,
      isPWD: false,
    }]);
  };

  const removeOwner = (id: string) => {
    setOwners(owners.filter(o => o.id !== id));
  };

  const updateOwner = (id: string, field: string, value: string | number | boolean) => {
    setOwners(owners.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handleSubmit = () => {
    toast.success('MSME registration submitted for verification');
  };

  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/registry">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Register New MSME</h1>
              <p className="text-slate-500">Complete the form to register a new enterprise</p>
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                          isActive ? 'bg-emerald-50 text-emerald-700' :
                          isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          isActive ? 'bg-emerald-600 border-emerald-600 text-white' :
                          isCompleted ? 'bg-emerald-100 border-emerald-600 text-emerald-600' :
                          'bg-white border-slate-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium hidden md:inline">{step.name}</span>
                      </button>
                      {idx < steps.length - 1 && (
                        <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                          isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={progressPercent} className="h-1" />
            </CardContent>
          </Card>

          {/* Form Content */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-6">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Business Information</h2>
                    <p className="text-sm text-slate-500">Basic details about the enterprise</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                        placeholder="Enter registered business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradingName">Trading Name</Label>
                      <Input
                        id="tradingName"
                        value={formData.tradingName}
                        onChange={(e) => updateFormData('tradingName', e.target.value)}
                        placeholder="If different from business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipType">Ownership Type *</Label>
                      <Select
                        value={formData.ownershipType}
                        onValueChange={(v) => updateFormData('ownershipType', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ownership type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="cooperative">Cooperative</SelectItem>
                          <SelectItem value="association">Association</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateEstablished">Date Established</Label>
                      <Input
                        id="dateEstablished"
                        type="date"
                        value={formData.dateEstablished}
                        onChange={(e) => updateFormData('dateEstablished', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sectorId">Business Sector *</Label>
                      <Select
                        value={formData.sectorId}
                        onValueChange={(v) => updateFormData('sectorId', v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_SECTORS.map(sector => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Number of Employees *</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => updateFormData('employeeCount', e.target.value)}
                        placeholder="Including owners"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="productsServices">Products & Services *</Label>
                      <Textarea
                        id="productsServices"
                        value={formData.productsServices}
                        onChange={(e) => updateFormData('productsServices', e.target.value)}
                        placeholder="Describe the main products and services offered..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-slate-900 mb-4">Registration Numbers (if available)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ipaNumber">IPA Number</Label>
                        <Input
                          id="ipaNumber"
                          value={formData.ipaNumber}
                          onChange={(e) => updateFormData('ipaNumber', e.target.value)}
                          placeholder="IPA-XXXX-XXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ircNumber">IRC Number</Label>
                        <Input
                          id="ircNumber"
                          value={formData.ircNumber}
                          onChange={(e) => updateFormData('ircNumber', e.target.value)}
                          placeholder="IRC-XXXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tinNumber">TIN Number</Label>
                        <Input
                          id="tinNumber"
                          value={formData.tinNumber}
                          onChange={(e) => updateFormData('tinNumber', e.target.value)}
                          placeholder="TIN-XXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Location & Contact</h2>
                    <p className="text-sm text-slate-500">Where is the business located?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="provinceId">Province *</Label>
                      <Select
                        value={formData.provinceId}
                        onValueChange={(v) => {
                          updateFormData('provinceId', v);
                          updateFormData('districtId', '');
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PNG_PROVINCES.map(province => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="districtId">District</Label>
                      <Select
                        value={formData.districtId}
                        onValueChange={(v) => updateFormData('districtId', v)}
                        disabled={!formData.provinceId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.provinceId && getDistrictsByProvince(formData.provinceId).map(district => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="llg">LLG (Local Level Government)</Label>
                      <Input
                        id="llg"
                        value={formData.llg}
                        onChange={(e) => updateFormData('llg', e.target.value)}
                        placeholder="Enter LLG name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Ward</Label>
                      <Input
                        id="ward"
                        value={formData.ward}
                        onChange={(e) => updateFormData('ward', e.target.value)}
                        placeholder="Enter ward number/name"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Textarea
                        id="streetAddress"
                        value={formData.streetAddress}
                        onChange={(e) => updateFormData('streetAddress', e.target.value)}
                        placeholder="Physical address of the business..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-slate-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryPhone">Primary Phone *</Label>
                        <Input
                          id="primaryPhone"
                          value={formData.primaryPhone}
                          onChange={(e) => updateFormData('primaryPhone', e.target.value)}
                          placeholder="+675 XXXX XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                        <Input
                          id="secondaryPhone"
                          value={formData.secondaryPhone}
                          onChange={(e) => updateFormData('secondaryPhone', e.target.value)}
                          placeholder="+675 XXXX XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="business@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => updateFormData('website', e.target.value)}
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Ownership */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-1">Ownership Structure</h2>
                      <p className="text-sm text-slate-500">Add all owners/shareholders of the business</p>
                    </div>
                    <Button onClick={addOwner} variant="outline" size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Owner
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {owners.map((owner, idx) => (
                      <Card key={owner.id} className="border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-slate-900">Owner {idx + 1}</h4>
                            {owners.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOwner(owner.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Full Name *</Label>
                              <Input
                                value={owner.fullName}
                                onChange={(e) => updateOwner(owner.id, 'fullName', e.target.value)}
                                placeholder="Enter full name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Gender *</Label>
                              <Select
                                value={owner.gender}
                                onValueChange={(v) => updateOwner(owner.id, 'gender', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Ownership % *</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={owner.ownershipPercentage}
                                onChange={(e) => updateOwner(owner.id, 'ownershipPercentage', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone</Label>
                              <Input
                                value={owner.phone}
                                onChange={(e) => updateOwner(owner.id, 'phone', e.target.value)}
                                placeholder="+675 XXXX XXXX"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={owner.email}
                                onChange={(e) => updateOwner(owner.id, 'email', e.target.value)}
                                placeholder="owner@example.com"
                              />
                            </div>
                            <div className="flex items-end gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`youth-${owner.id}`}
                                  checked={owner.isYouth}
                                  onCheckedChange={(checked) => updateOwner(owner.id, 'isYouth', checked as boolean)}
                                />
                                <Label htmlFor={`youth-${owner.id}`} className="text-sm">Youth (under 35)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`pwd-${owner.id}`}
                                  checked={owner.isPWD}
                                  onCheckedChange={(checked) => updateOwner(owner.id, 'isPWD', checked as boolean)}
                                />
                                <Label htmlFor={`pwd-${owner.id}`} className="text-sm">PWD</Label>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Ownership Summary */}
                  <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Ownership Summary</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-rose-600">
                            {owners.filter(o => o.gender === 'female').reduce((acc, o) => acc + o.ownershipPercentage, 0)}%
                          </p>
                          <p className="text-sm text-slate-600">Women Ownership</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-amber-600">
                            {owners.filter(o => o.isYouth).reduce((acc, o) => acc + o.ownershipPercentage, 0)}%
                          </p>
                          <p className="text-sm text-slate-600">Youth Ownership</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-violet-600">
                            {owners.filter(o => o.isPWD).reduce((acc, o) => acc + o.ownershipPercentage, 0)}%
                          </p>
                          <p className="text-sm text-slate-600">PWD Ownership</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 4: Green Profile */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Green Profile</h2>
                    <p className="text-sm text-slate-500">Environmental practices and climate readiness</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="hasGreenProducts"
                        checked={formData.hasGreenProducts as boolean}
                        onCheckedChange={(checked) => updateFormData('hasGreenProducts', checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="hasGreenProducts" className="font-medium">
                          Business offers green/sustainable products or services
                        </Label>
                        <p className="text-sm text-slate-500">
                          Products/services that are environmentally friendly or climate-smart
                        </p>
                      </div>
                    </div>

                    {formData.hasGreenProducts && (
                      <div className="space-y-2 pl-7">
                        <Label htmlFor="greenProductsDescription">Describe your green products/services</Label>
                        <Textarea
                          id="greenProductsDescription"
                          value={formData.greenProductsDescription}
                          onChange={(e) => updateFormData('greenProductsDescription', e.target.value)}
                          placeholder="Explain what makes your products/services environmentally sustainable..."
                          rows={3}
                        />
                      </div>
                    )}

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Primary Energy Source *</Label>
                        <Select
                          value={formData.energySource}
                          onValueChange={(v) => updateFormData('energySource', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select energy source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid Electricity</SelectItem>
                            <SelectItem value="solar">Solar Power</SelectItem>
                            <SelectItem value="diesel">Diesel Generator</SelectItem>
                            <SelectItem value="hydro">Hydro Power</SelectItem>
                            <SelectItem value="mixed">Mixed Sources</SelectItem>
                            <SelectItem value="none">None/Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Waste Management Level *</Label>
                        <Select
                          value={formData.wasteManagement}
                          onValueChange={(v) => updateFormData('wasteManagement', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic (disposal only)</SelectItem>
                            <SelectItem value="recycling">Recycling practices</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Water Management Level *</Label>
                        <Select
                          value={formData.waterManagement}
                          onValueChange={(v) => updateFormData('waterManagement', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic usage</SelectItem>
                            <SelectItem value="conservation">Conservation practices</SelectItem>
                            <SelectItem value="recycling">Water recycling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Climate Risk Exposure *</Label>
                        <Select
                          value={formData.climateRiskExposure}
                          onValueChange={(v) => updateFormData('climateRiskExposure', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Banking */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Banking & Finance</h2>
                    <p className="text-sm text-slate-500">Financial access and readiness information</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="hasBankAccount"
                      checked={formData.hasBankAccount as boolean}
                      onCheckedChange={(checked) => updateFormData('hasBankAccount', checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="hasBankAccount" className="font-medium">
                        Business has a formal bank account
                      </Label>
                    </div>
                  </div>

                  {formData.hasBankAccount && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Select
                          value={formData.bankName}
                          onValueChange={(v) => updateFormData('bankName', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BSP">BSP (Bank South Pacific)</SelectItem>
                            <SelectItem value="Westpac">Westpac</SelectItem>
                            <SelectItem value="ANZ">ANZ</SelectItem>
                            <SelectItem value="Kina Bank">Kina Bank</SelectItem>
                            <SelectItem value="NDB">National Development Bank</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Account Type</Label>
                        <Select
                          value={formData.accountType}
                          onValueChange={(v) => updateFormData('accountType', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="current">Current Account</SelectItem>
                            <SelectItem value="business">Business Account</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Mobile Money Provider (if any)</Label>
                    <Select
                      value={formData.mobileMoneyProvider}
                      onValueChange={(v) => updateFormData('mobileMoneyProvider', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BSP Mobile">BSP Mobile</SelectItem>
                        <SelectItem value="Digicel MoniPlus">Digicel MoniPlus</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 6: Documents & Consent */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Documents & Consent</h2>
                    <p className="text-sm text-slate-500">Upload supporting documents and provide consent</p>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <h3 className="font-medium text-slate-900 mb-1">Upload Documents</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      IPA Certificate, IRC Certificate, TIN Certificate, Business License, Owner ID
                    </p>
                    <Button variant="outline">Select Files</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900">Data Consent</h3>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="dataConsentGiven"
                        checked={formData.dataConsentGiven as boolean}
                        onCheckedChange={(checked) => updateFormData('dataConsentGiven', checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="dataConsentGiven" className="font-medium">
                          I consent to data collection and processing *
                        </Label>
                        <p className="text-sm text-slate-500">
                          I understand that my business information will be stored in the SMEC National MSME Database
                          and may be used for policy analysis, program targeting, and reporting purposes.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="marketingConsentGiven"
                        checked={formData.marketingConsentGiven as boolean}
                        onCheckedChange={(checked) => updateFormData('marketingConsentGiven', checked as boolean)}
                      />
                      <div>
                        <Label htmlFor="marketingConsentGiven" className="font-medium">
                          I consent to receive program updates
                        </Label>
                        <p className="text-sm text-slate-500">
                          I agree to receive information about SMEC programs, training opportunities,
                          and other relevant business support services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft} className="gap-1">
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={handleNext} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                  <Send className="h-4 w-4" />
                  Submit for Verification
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
