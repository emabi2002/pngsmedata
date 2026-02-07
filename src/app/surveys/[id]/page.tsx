'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Save,
  Play,
  Pause,
  Settings,
  FileText,
  Users,
  MapPin,
  Calendar,
  GripVertical,
  Trash2,
  Copy,
  MoreVertical,
  Type,
  Hash,
  ToggleLeft,
  List,
  AlignLeft,
  Phone,
  Mail,
  CalendarDays,
  MapPinned,
  CheckSquare,
  Circle,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
} from 'lucide-react';

// Question types available in the form builder
const QUESTION_TYPES = [
  { id: 'text', label: 'Short Text', icon: Type, description: 'Single line text input' },
  { id: 'textarea', label: 'Long Text', icon: AlignLeft, description: 'Multi-line text area' },
  { id: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Email address input' },
  { id: 'date', label: 'Date', icon: CalendarDays, description: 'Date picker' },
  { id: 'select', label: 'Dropdown', icon: List, description: 'Single select dropdown' },
  { id: 'radio', label: 'Radio Buttons', icon: Circle, description: 'Single choice options' },
  { id: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multiple choice options' },
  { id: 'boolean', label: 'Yes/No', icon: ToggleLeft, description: 'Boolean toggle' },
  { id: 'location', label: 'GPS Location', icon: MapPinned, description: 'Capture GPS coordinates' },
];

interface FormQuestion {
  id: string;
  type: string;
  label: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditionalOn?: string;
  conditionalValue?: string;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  isExpanded: boolean;
}

// Mock campaign data
const MOCK_CAMPAIGN = {
  id: 'camp-001',
  campaignCode: 'SURVEY-2026-001',
  name: 'National MSME Census 2026',
  description: 'Comprehensive survey of all registered MSMEs across PNG for policy baseline.',
  status: 'active' as const,
  startDate: '2026-01-15',
  endDate: '2026-06-30',
  targetSMECount: 5000,
  actualSMECount: 1247,
  enumeratorCount: 45,
};

// Initial form sections
const INITIAL_SECTIONS: FormSection[] = [
  {
    id: 'section-1',
    title: 'Business Information',
    description: 'Basic details about the enterprise',
    isExpanded: true,
    questions: [
      { id: 'q1', type: 'text', label: 'Business Name', required: true },
      { id: 'q2', type: 'text', label: 'Trading Name', required: false },
      { id: 'q3', type: 'select', label: 'Ownership Type', required: true, options: ['Sole Proprietor', 'Partnership', 'Company', 'Cooperative'] },
      { id: 'q4', type: 'date', label: 'Date Established', required: false },
    ],
  },
  {
    id: 'section-2',
    title: 'Contact & Location',
    description: 'Contact information and business location',
    isExpanded: false,
    questions: [
      { id: 'q5', type: 'phone', label: 'Primary Phone', required: true },
      { id: 'q6', type: 'email', label: 'Email Address', required: false },
      { id: 'q7', type: 'select', label: 'Province', required: true, options: ['NCD', 'Morobe', 'Western Highlands', 'Eastern Highlands'] },
      { id: 'q8', type: 'location', label: 'GPS Coordinates', required: false },
    ],
  },
  {
    id: 'section-3',
    title: 'Ownership & Inclusion',
    description: 'Owner demographics and inclusion attributes',
    isExpanded: false,
    questions: [
      { id: 'q9', type: 'number', label: 'Women Ownership %', required: true, validation: { min: 0, max: 100 } },
      { id: 'q10', type: 'number', label: 'Youth Ownership %', required: true, validation: { min: 0, max: 100 } },
      { id: 'q11', type: 'boolean', label: 'Has PWD Ownership', required: true },
    ],
  },
];

function QuestionCard({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  question: FormQuestion;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(question.label);
  const [editedOptions, setEditedOptions] = useState(question.options?.join('\n') || '');

  const questionType = QUESTION_TYPES.find(t => t.id === question.type);
  const TypeIcon = questionType?.icon || Type;

  const handleSave = () => {
    onUpdate({
      label: editedLabel,
      options: question.type === 'select' || question.type === 'radio' || question.type === 'checkbox'
        ? editedOptions.split('\n').filter(o => o.trim())
        : undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-emerald-200 transition-colors">
      <div className="cursor-move p-1 text-slate-400 hover:text-slate-600">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              placeholder="Question label"
              className="font-medium"
            />
            {(question.type === 'select' || question.type === 'radio' || question.type === 'checkbox') && (
              <div>
                <Label className="text-xs text-slate-500">Options (one per line)</Label>
                <Textarea
                  value={editedOptions}
                  onChange={(e) => setEditedOptions(e.target.value)}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={4}
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{question.label}</span>
              {question.required && <span className="text-red-500 text-xs">*</span>}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs gap-1">
                <TypeIcon className="h-3 w-3" />
                {questionType?.label}
              </Badge>
              {question.options && (
                <span className="text-xs text-slate-500">{question.options.length} options</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Switch
          checked={question.required}
          onCheckedChange={(checked) => onUpdate({ required: checked })}
        />
        <span className="text-xs text-slate-500">Required</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function AddQuestionDialog({ onAdd }: { onAdd: (type: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 w-full border-dashed">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>Choose a question type to add to your form</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {QUESTION_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => {
                  onAdd(type.id);
                  setOpen(false);
                }}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left"
              >
                <div className="p-2 rounded-lg bg-slate-100">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{type.label}</p>
                  <p className="text-xs text-slate-500">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sections, setSections] = useState<FormSection[]>(INITIAL_SECTIONS);
  const [activeTab, setActiveTab] = useState('builder');
  const [formName, setFormName] = useState('MSME Census Form v1');

  const campaign = MOCK_CAMPAIGN;
  const progressPercent = Math.round((campaign.actualSMECount / campaign.targetSMECount) * 100);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const addQuestion = (sectionId: string, type: string) => {
    const questionType = QUESTION_TYPES.find(t => t.id === type);
    const newQuestion: FormQuestion = {
      id: `q-${Date.now()}`,
      type,
      label: `New ${questionType?.label || 'Question'}`,
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox'
        ? ['Option 1', 'Option 2']
        : undefined,
    };

    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, questions: [...s.questions, newQuestion] }
        : s
    ));
    toast.success('Question added');
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<FormQuestion>) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? {
            ...s,
            questions: s.questions.map(q =>
              q.id === questionId ? { ...q, ...updates } : q
            ),
          }
        : s
    ));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, questions: s.questions.filter(q => q.id !== questionId) }
        : s
    ));
    toast.success('Question deleted');
  };

  const duplicateQuestion = (sectionId: string, questionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const question = section?.questions.find(q => q.id === questionId);
    if (question) {
      const newQuestion = { ...question, id: `q-${Date.now()}`, label: `${question.label} (copy)` };
      setSections(sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      ));
      toast.success('Question duplicated');
    }
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      questions: [],
      isExpanded: true,
    };
    setSections([...sections, newSection]);
    toast.success('Section added');
  };

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const requiredQuestions = sections.reduce((acc, s) => acc + s.questions.filter(q => q.required).length, 0);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/surveys">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                    <Play className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{campaign.campaignCode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                <Save className="h-4 w-4" />
                Save Form
              </Button>
            </div>
          </div>

          {/* Campaign Progress */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Collection Progress</span>
                    <span className="text-sm font-medium">
                      {campaign.actualSMECount.toLocaleString()} / {campaign.targetSMECount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{campaign.enumeratorCount} Enumerators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{campaign.startDate} - {campaign.endDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger value="builder" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1">
                <Settings className="h-4 w-4" />
                Form Builder
              </TabsTrigger>
              <TabsTrigger value="responses" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1">
                <FileText className="h-4 w-4" />
                Responses
              </TabsTrigger>
              <TabsTrigger value="enumerators" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 gap-1">
                <Users className="h-4 w-4" />
                Enumerators
              </TabsTrigger>
            </TabsList>

            {/* Form Builder Tab */}
            <TabsContent value="builder">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Form Sections */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Form Header */}
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label className="text-xs text-slate-500">Form Name</Label>
                          <Input
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="mt-1 font-semibold text-lg"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Version</p>
                          <Badge variant="outline">v1.0</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sections */}
                  {sections.map((section) => (
                    <Card key={section.id} className="border-slate-200">
                      <CardHeader
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {section.isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {section.questions.length} questions
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        {section.description && (
                          <CardDescription>{section.description}</CardDescription>
                        )}
                      </CardHeader>
                      {section.isExpanded && (
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {section.questions.map((question) => (
                              <QuestionCard
                                key={question.id}
                                question={question}
                                onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                                onDelete={() => deleteQuestion(section.id, question.id)}
                                onDuplicate={() => duplicateQuestion(section.id, question.id)}
                              />
                            ))}
                            <AddQuestionDialog onAdd={(type) => addQuestion(section.id, type)} />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                  {/* Add Section Button */}
                  <Button
                    variant="outline"
                    className="w-full gap-1 border-dashed h-12"
                    onClick={addSection}
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Form Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Sections</span>
                        <span className="font-medium">{sections.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Questions</span>
                        <span className="font-medium">{totalQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Required</span>
                        <span className="font-medium text-red-600">{requiredQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Optional</span>
                        <span className="font-medium">{totalQuestions - requiredQuestions}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-emerald-200 bg-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-emerald-900">Form Tips</p>
                          <ul className="text-xs text-emerald-700 mt-1 space-y-1">
                            <li>• Keep forms under 30 questions</li>
                            <li>• Group related questions</li>
                            <li>• Use GPS for location capture</li>
                            <li>• Mark critical fields as required</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Responses Tab */}
            <TabsContent value="responses">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Survey Responses</CardTitle>
                      <CardDescription>
                        {campaign.actualSMECount.toLocaleString()} responses collected
                      </CardDescription>
                    </div>
                    <Button variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-medium">Response data will appear here</p>
                    <p className="text-sm">Connect to Supabase to view real survey responses</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enumerators Tab */}
            <TabsContent value="enumerators">
              <Card className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Enumerator Assignments</CardTitle>
                      <CardDescription>
                        {campaign.enumeratorCount} enumerators assigned to this campaign
                      </CardDescription>
                    </div>
                    <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4" />
                      Assign Enumerator
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-medium">Enumerator assignments will appear here</p>
                    <p className="text-sm">Connect to Supabase to manage field workers</p>
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
