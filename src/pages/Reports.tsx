import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  BarChart3,
  MessageSquare,
  Package,
  FileText,
  ClipboardList,
  Plus,
  Download,
  Eye,
  Clock,
  Calendar,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ReportEditor, { ReportBlock } from '@/components/reports/ReportEditor';
import ReportPreview from '@/components/reports/ReportPreview';
import { downloadReportPDF } from '@/utils/reportPdfExport';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Mock data
const mockPrompts = [
  { id: "1", text: "Best running shoes for marathon training", mentions: 24, platform: "ChatGPT", status: "ai-ready" },
  { id: "2", text: "Nike vs Adidas for professional athletes", mentions: 18, platform: "Gemini", status: "needs-improvement" },
  { id: "3", text: "Most comfortable shoes for daily wear", mentions: 15, platform: "Claude", status: "ai-ready" },
  { id: "4", text: "Top rated sneakers 2024", mentions: 12, platform: "Perplexity", status: "needs-improvement" },
  { id: "5", text: "Which brand has the best durability", mentions: 9, platform: "Grok", status: "ai-ready" },
];

const mockActions = [
  { id: "1", title: "Optimized product description for Air Max", date: "Dec 18, 2024", type: "Content" },
  { id: "2", title: "Updated meta tags for running category", date: "Dec 15, 2024", type: "SEO" },
  { id: "3", title: "Added FAQ schema to landing page", date: "Dec 12, 2024", type: "Technical" },
  { id: "4", title: "Created comparison content vs Adidas", date: "Dec 10, 2024", type: "Content" },
];

const mockProducts = [
  { 
    id: "1", 
    name: "Air Max 90", 
    status: "ai-ready",
    prompts: [
      { id: "p1-1", text: "Best Air Max for running", mentions: 12 },
      { id: "p1-2", text: "Air Max 90 vs Air Max 95", mentions: 8 },
    ]
  },
  { 
    id: "2", 
    name: "Air Force 1", 
    status: "needs-improvement",
    prompts: [
      { id: "p2-1", text: "Air Force 1 sizing guide", mentions: 15 },
      { id: "p2-2", text: "Best white sneakers 2024", mentions: 22 },
    ]
  },
  { 
    id: "3", 
    name: "Dunk Low", 
    status: "ai-ready",
    prompts: [
      { id: "p3-1", text: "Dunk Low vs Jordan 1", mentions: 19 },
    ]
  },
  { 
    id: "4", 
    name: "Pegasus 40", 
    status: "needs-improvement",
    prompts: [
      { id: "p4-1", text: "Best running shoes for beginners", mentions: 31 },
      { id: "p4-2", text: "Nike Pegasus review", mentions: 14 },
    ]
  },
];

const mockOptimizations = [
  { 
    id: "1", 
    title: "Ultimate Guide to Marathon Training", 
    urlSlug: "/guides/marathon-training",
    headers: ["H1: Marathon Training Guide", "H2: Best Gear", "H2: Training Plans"],
    associatedWith: { type: "product", name: "Pegasus 40" },
    createdAt: "Dec 20, 2024"
  },
  { 
    id: "2", 
    title: "Basketball Shoe Comparison 2024", 
    urlSlug: "/comparisons/basketball-shoes",
    headers: ["H1: Basketball Shoe Guide", "H2: Top Picks", "H2: Price Comparison"],
    associatedWith: { type: "brand", name: "Nike" },
    createdAt: "Dec 18, 2024"
  },
  { 
    id: "3", 
    title: "Air Max Technology Explained", 
    urlSlug: "/technology/air-max",
    headers: ["H1: Air Max Tech", "H2: History", "H2: Innovation"],
    associatedWith: { type: "product", name: "Air Max 90" },
    createdAt: "Dec 15, 2024"
  },
];

const platforms = [
  { id: "chatgpt", name: "ChatGPT", mentions: 4234 },
  { id: "gemini", name: "Gemini", mentions: 3456 },
  { id: "perplexity", name: "Perplexity", mentions: 2310 },
  { id: "grok", name: "Grok", mentions: 1892 },
];

// Wizard steps
type WizardStep = 'setup' | 'ai-visibility' | 'prompts' | 'products' | 'optimizations' | 'actions';

const WIZARD_STEPS: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: 'setup', label: 'Report Setup', icon: BarChart3 },
  { key: 'ai-visibility', label: 'AI Overview', icon: BarChart3 },
  { key: 'prompts', label: 'Prompts & Queries', icon: MessageSquare },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'optimizations', label: 'On-Site Optimizations', icon: FileText },
  { key: 'actions', label: 'Actions Log', icon: ClipboardList },
];

interface SectionConfig {
  enabled: boolean;
  items?: string[];
}

// Initial saved reports data
const initialSavedReports = [
  {
    id: "1",
    title: "Q4 2024 AI Visibility Report",
    createdAt: new Date(2024, 11, 20),
    dateRange: { start: new Date(2024, 9, 1), end: new Date(2024, 11, 31) },
    status: "completed" as const,
  },
  {
    id: "2",
    title: "November Performance Analysis",
    createdAt: new Date(2024, 10, 30),
    dateRange: { start: new Date(2024, 10, 1), end: new Date(2024, 10, 30) },
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Product Launch Report",
    createdAt: new Date(2024, 10, 15),
    dateRange: { start: new Date(2024, 9, 15), end: new Date(2024, 10, 15) },
    status: "completed" as const,
  },
];

type SavedReport = typeof initialSavedReports[0];

type ViewMode = 'dashboard' | 'wizard' | 'editor';

const Reports = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [savedReports, setSavedReports] = useState<SavedReport[]>(initialSavedReports);
  const [currentStep, setCurrentStep] = useState<WizardStep>('setup');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleDeleteReport = (reportId: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
    toast({
      title: "Report deleted",
      description: "The report has been removed.",
    });
  };
  
  // Selection state
  const [sections, setSections] = useState<Record<string, SectionConfig>>({
    score: { enabled: true },
    mentions: { enabled: true },
    platformCoverage: { enabled: true, items: platforms.map(p => p.id) },
    prompts: { enabled: true, items: mockPrompts.map(p => p.id) },
    products: { enabled: false, items: [] },
    productPrompts: { enabled: false, items: [] },
    optimizations: { enabled: false, items: [] },
    optimizationDetails: { enabled: false, items: [] },
    actions: { enabled: false, items: [] },
  });
  
  // Filter states
  const [productFilter, setProductFilter] = useState<'all' | 'ai-ready' | 'needs-improvement'>('all');
  const [promptFilter, setPromptFilter] = useState<'all' | 'ai-ready' | 'needs-improvement'>('all');

  const [reportTitle, setReportTitle] = useState("AI Visibility Report");
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editorBlocks, setEditorBlocks] = useState<ReportBlock[]>([]);

  // Step navigation
  const currentStepIndex = WIZARD_STEPS.findIndex(s => s.key === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

  const goToNextStep = () => {
    if (isLastStep) {
      // Proceed to editor
      setEditorBlocks(generateBlocks());
      setViewMode('editor');
    } else {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1].key);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1].key);
    }
  };

  const goToStep = (step: WizardStep) => {
    const stepIndex = WIZARD_STEPS.findIndex(s => s.key === step);
    if (stepIndex <= currentStepIndex) {
      setCurrentStep(step);
    }
  };

  // Toggle helpers
  const toggleItem = (sectionKey: string, itemId: string) => {
    setSections(prev => {
      const currentItems = prev[sectionKey].items || [];
      const newItems = currentItems.includes(itemId)
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId];
      return {
        ...prev,
        [sectionKey]: { ...prev[sectionKey], enabled: newItems.length > 0, items: newItems }
      };
    });
  };

  const selectAllItems = (sectionKey: string, allIds: string[]) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], enabled: true, items: allIds }
    }));
  };

  const deselectAllItems = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], enabled: false, items: [] }
    }));
  };

  const toggleSection = (key: string) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCustomLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Count selected items per section
  const getSelectionSummary = () => {
    const aiVisibility = [
      sections.score.enabled ? 'Score' : null,
      sections.mentions.enabled ? 'Mentions' : null,
      (sections.platformCoverage.items?.length || 0) > 0 ? `${sections.platformCoverage.items?.length} platforms` : null,
    ].filter(Boolean);
    
    const promptsCount = sections.prompts.items?.length || 0;
    const productsCount = sections.products.items?.length || 0;
    const optimizationsCount = sections.optimizations.items?.length || 0;
    const actionsCount = sections.actions.items?.length || 0;

    return { aiVisibility, promptsCount, productsCount, optimizationsCount, actionsCount };
  };

  const summary = getSelectionSummary();

  // Filter products
  const filteredProducts = mockProducts.filter(p => 
    productFilter === 'all' || p.status === productFilter
  );

  // Filter prompts
  const filteredPrompts = mockPrompts.filter(p => 
    promptFilter === 'all' || p.status === promptFilter
  );

  // Generate blocks for editor
  const generateBlocks = (): ReportBlock[] => {
    const blocks: ReportBlock[] = [];
    
    if (sections.score.enabled) {
      blocks.push({
        id: 'score-section',
        type: 'section',
        content: {
          sectionType: 'Visibility Score',
          title: 'Overall AI Visibility Score',
          body: 'Your brand scored 87/100 this period, up 5 points from last period.'
        }
      });
    }

    if (sections.mentions.enabled) {
      blocks.push({
        id: 'mentions-stat',
        type: 'stat',
        content: {
          statValue: '12,847',
          statLabel: 'total brand mentions across AI platforms'
        }
      });
    }

    if (sections.platformCoverage.enabled && sections.platformCoverage.items?.length) {
      blocks.push({
        id: 'platform-section',
        type: 'section',
        content: {
          sectionType: 'Platform Coverage',
          title: 'AI Platform Mention Distribution',
          body: 'Comprehensive analysis of brand mentions across leading AI platforms.'
        }
      });
    }

    if (sections.prompts.enabled && sections.prompts.items?.length) {
      blocks.push({
        id: 'prompts-section',
        type: 'section',
        content: {
          sectionType: 'Top Prompts',
          title: 'Top AI Prompts & Queries',
          body: 'Most frequent prompts mentioning your brand.'
        }
      });
      
      const selectedPrompts = mockPrompts.filter(p => sections.prompts.items?.includes(p.id));
      selectedPrompts.slice(0, 3).forEach((prompt) => {
        blocks.push({
          id: `prompt-${prompt.id}`,
          type: 'quote',
          content: {
            quoteText: prompt.text,
            quoteAuthor: `${prompt.mentions} mentions on ${prompt.platform}`
          }
        });
      });
    }

    if (sections.products.enabled && sections.products.items?.length) {
      blocks.push({
        id: 'products-section',
        type: 'section',
        content: {
          sectionType: 'Products',
          title: 'Product AI Visibility',
          body: 'Products analyzed for AI visibility with their associated prompts.'
        }
      });
    }

    if (sections.optimizations.enabled && sections.optimizations.items?.length) {
      blocks.push({
        id: 'optimizations-section',
        type: 'section',
        content: {
          sectionType: 'On-site Optimizations',
          title: 'Content Optimization Summary',
          body: 'Content created and optimized for AI visibility.'
        }
      });
    }

    if (sections.actions.enabled && sections.actions.items?.length) {
      blocks.push({
        id: 'actions-section',
        type: 'section',
        content: {
          sectionType: 'Actions Log',
          title: 'Recent Actions & Optimizations',
          body: 'Summary of optimization actions taken during this period.'
        }
      });
    }

    return blocks;
  };

  const handleProceedToEdit = () => {
    setEditorBlocks(generateBlocks());
    setViewMode('editor');
  };

  const handleStartNewReport = () => {
    // Reset state for new report
    setCurrentStep('setup');
    setReportTitle("AI Visibility Report");
    setStartDate(new Date(2024, 0, 1));
    setEndDate(new Date());
    setCustomLogo(null);
    setSections({
      score: { enabled: true },
      mentions: { enabled: true },
      platformCoverage: { enabled: true, items: platforms.map(p => p.id) },
      prompts: { enabled: true, items: mockPrompts.map(p => p.id) },
      products: { enabled: false, items: [] },
      productPrompts: { enabled: false, items: [] },
      optimizations: { enabled: false, items: [] },
      optimizationDetails: { enabled: false, items: [] },
      actions: { enabled: false, items: [] },
    });
    setViewMode('wizard');
  };

  const handleExitWizard = () => {
    setViewMode('dashboard');
  };

  const handleExport = async () => {
    if (editorBlocks.length === 0) {
      toast({
        title: "No content to export",
        description: "Add some content blocks before exporting.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      // Transform sections to match PDF export format
      const pdfSections = {
        score: { enabled: sections.score.enabled },
        mentions: { enabled: sections.mentions.enabled },
        platformCoverage: { enabled: sections.platformCoverage.enabled, items: sections.platformCoverage.items },
        prompts: { enabled: sections.prompts.enabled, items: sections.prompts.items },
        products: { enabled: sections.products.enabled, items: sections.products.items },
        optimizations: { enabled: sections.optimizations.enabled, items: sections.optimizations.items },
        actions: { enabled: sections.actions.enabled, items: sections.actions.items },
      };
      
      await downloadReportPDF({
        blocks: editorBlocks,
        reportTitle,
        dateRange: { start: startDate || new Date(2024, 0, 1), end: endDate || new Date() },
        showPageNumbers,
        customLogo: customLogo || undefined,
        brandName: 'Nike',
        sections: pdfSections,
        platforms
      });
      
      toast({ title: "Report exported", description: "Your PDF has been downloaded." });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Export failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  // Dashboard view
  const renderDashboard = () => (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </button>
          
          <Button 
            onClick={handleStartNewReport}
            className="h-9 px-5 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">
            Reports
          </h1>
          <p className="text-muted-foreground">
            View and manage your AI visibility reports.
          </p>
        </div>

        {/* Saved Reports */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Saved Reports
            </h2>
            <span className="text-xs text-muted-foreground">
              {savedReports.length} reports
            </span>
          </div>

          {savedReports.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No reports yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first AI visibility report to get started.
              </p>
              <Button onClick={handleStartNewReport} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="group bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1 truncate">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(report.dateRange.start, "MMM d")} – {format(report.dateRange.end, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Created {format(report.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete report?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{report.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReport(report.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );

  if (viewMode === 'dashboard') {
    return renderDashboard();
  }

  if (viewMode === 'editor') {
    const pdfSections = {
      score: { enabled: sections.score.enabled },
      mentions: { enabled: sections.mentions.enabled },
      platformCoverage: { enabled: sections.platformCoverage.enabled, items: sections.platformCoverage.items },
      prompts: { enabled: sections.prompts.enabled, items: sections.prompts.items },
      products: { enabled: sections.products.enabled, items: sections.products.items },
      optimizations: { enabled: sections.optimizations.enabled, items: sections.optimizations.items },
      actions: { enabled: sections.actions.enabled, items: sections.actions.items },
    };
    
    return (
      <ReportEditor
        blocks={editorBlocks}
        onBlocksChange={setEditorBlocks}
        onBack={() => setViewMode('wizard')}
        onExport={handleExport}
        reportTitle={reportTitle}
        onTitleChange={setReportTitle}
        isExporting={isExporting}
        sections={pdfSections}
        platforms={platforms}
        dateRange={{ start: startDate, end: endDate }}
        brandName="Nike"
        customLogo={customLogo}
      />
    );
  }

  // Render Setup step
  const renderSetupView = () => (
    <div className="space-y-6">
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
          Report Period
        </label>
        <div className="flex items-center gap-2 text-sm">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-foreground hover:text-foreground/70 transition-colors px-3 py-2 border border-border rounded-lg">
                {startDate ? format(startDate, "MMM d, yyyy") : "Start"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">—</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-foreground hover:text-foreground/70 transition-colors px-3 py-2 border border-border rounded-lg">
                {endDate ? format(endDate, "MMM d, yyyy") : "End"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5">Report Title</label>
          <Input
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="border border-border rounded-lg px-3 bg-transparent h-10 text-sm"
            placeholder="Enter report title"
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleLogoUpload}
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Logo</span>
          {customLogo ? (
            <div className="flex items-center gap-2">
              <img src={customLogo} alt="Logo" className="h-6 object-contain" />
              <button
                onClick={() => setCustomLogo(null)}
                className="text-xs text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:underline"
            >
              Upload
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Page numbers</span>
          <Switch
            checked={showPageNumbers}
            onCheckedChange={setShowPageNumbers}
          />
        </div>
      </div>
    </div>
  );

  // Render AI Visibility section
  const renderAIVisibilityView = () => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground mb-6">
        Select which AI visibility metrics to include in your report.
      </p>
      
      <div className="divide-y divide-border/30">
        <SelectableRow
          label="Visibility Score"
          meta="Overall brand AI visibility score"
          selected={sections.score.enabled}
          onToggle={() => toggleSection('score')}
        />
        <SelectableRow
          label="Total Mentions"
          meta="Aggregate mention count across platforms"
          selected={sections.mentions.enabled}
          onToggle={() => toggleSection('mentions')}
        />
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground">Platform Coverage</span>
        <div className="flex gap-4">
          <button 
            onClick={() => selectAllItems("platformCoverage", platforms.map(p => p.id))}
            className="text-xs text-primary hover:underline"
          >
            Select all
          </button>
          <button 
            onClick={() => deselectAllItems("platformCoverage")}
            className="text-xs text-muted-foreground hover:underline"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border/30">
        {platforms.map(platform => (
          <SelectableRow
            key={platform.id}
            label={platform.name}
            meta={`${platform.mentions.toLocaleString()} mentions`}
            selected={sections.platformCoverage.items?.includes(platform.id) || false}
            onToggle={() => toggleItem('platformCoverage', platform.id)}
          />
        ))}
      </div>
    </div>
  );

  // Render Prompts section
  const renderPromptsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Select prompts and queries to include.
        </p>
        <div className="flex gap-2">
          <FilterPill 
            label="All" 
            active={promptFilter === 'all'} 
            onClick={() => setPromptFilter('all')} 
          />
          <FilterPill 
            label="AI-Ready" 
            active={promptFilter === 'ai-ready'} 
            onClick={() => setPromptFilter('ai-ready')}
            variant="success"
          />
          <FilterPill 
            label="Needs Improvement" 
            active={promptFilter === 'needs-improvement'} 
            onClick={() => setPromptFilter('needs-improvement')}
            variant="warning"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mb-2">
        <button 
          onClick={() => selectAllItems("prompts", filteredPrompts.map(p => p.id))}
          className="text-xs text-primary hover:underline"
        >
          Select all
        </button>
        <button 
          onClick={() => deselectAllItems("prompts")}
          className="text-xs text-muted-foreground hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {filteredPrompts.map(prompt => (
          <SelectableRow
            key={prompt.id}
            label={prompt.text}
            meta={`${prompt.mentions} mentions · ${prompt.platform}`}
            selected={sections.prompts.items?.includes(prompt.id) || false}
            onToggle={() => toggleItem('prompts', prompt.id)}
            badge={prompt.status === 'ai-ready' ? 'AI-Ready' : 'Needs Improvement'}
            badgeVariant={prompt.status === 'ai-ready' ? 'success' : 'warning'}
          />
        ))}
      </div>
    </div>
  );

  // Render Products section (simplified - no drill-down)
  const renderProductsView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Select products to include in your report.
        </p>
        <div className="flex gap-2">
          <FilterPill 
            label="All" 
            active={productFilter === 'all'} 
            onClick={() => setProductFilter('all')} 
          />
          <FilterPill 
            label="AI-Ready" 
            active={productFilter === 'ai-ready'} 
            onClick={() => setProductFilter('ai-ready')}
            variant="success"
          />
          <FilterPill 
            label="Needs Improvement" 
            active={productFilter === 'needs-improvement'} 
            onClick={() => setProductFilter('needs-improvement')}
            variant="warning"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mb-2">
        <button 
          onClick={() => selectAllItems("products", filteredProducts.map(p => p.id))}
          className="text-xs text-primary hover:underline"
        >
          Select all
        </button>
        <button 
          onClick={() => deselectAllItems("products")}
          className="text-xs text-muted-foreground hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {filteredProducts.map(product => (
          <SelectableRow
            key={product.id}
            label={product.name}
            meta={`${product.prompts.length} prompts`}
            selected={sections.products.items?.includes(product.id) || false}
            onToggle={() => toggleItem('products', product.id)}
            badge={product.status === 'ai-ready' ? 'AI-Ready' : 'Needs Improvement'}
            badgeVariant={product.status === 'ai-ready' ? 'success' : 'warning'}
          />
        ))}
      </div>
    </div>
  );

  // Render Optimizations section (simplified - no drill-down)
  const renderOptimizationsView = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select on-site content optimizations to include.
      </p>

      <div className="flex items-center justify-end gap-4 mb-2">
        <button 
          onClick={() => selectAllItems("optimizations", mockOptimizations.map(o => o.id))}
          className="text-xs text-primary hover:underline"
        >
          Select all
        </button>
        <button 
          onClick={() => deselectAllItems("optimizations")}
          className="text-xs text-muted-foreground hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {mockOptimizations.map(opt => (
          <SelectableRow
            key={opt.id}
            label={opt.title}
            meta={`${opt.urlSlug} · ${opt.associatedWith.type}: ${opt.associatedWith.name}`}
            selected={sections.optimizations.items?.includes(opt.id) || false}
            onToggle={() => toggleItem('optimizations', opt.id)}
          />
        ))}
      </div>
    </div>
  );

  // Render Actions section
  const renderActionsView = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Select actions to include in your report.
      </p>

      <div className="flex items-center justify-end gap-4 mb-2">
        <button 
          onClick={() => selectAllItems("actions", mockActions.map(a => a.id))}
          className="text-xs text-primary hover:underline"
        >
          Select all
        </button>
        <button 
          onClick={() => deselectAllItems("actions")}
          className="text-xs text-muted-foreground hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-border/30">
        {mockActions.map(action => (
          <SelectableRow
            key={action.id}
            label={action.title}
            meta={`${action.date} · ${action.type}`}
            selected={sections.actions.items?.includes(action.id) || false}
            onToggle={() => toggleItem('actions', action.id)}
          />
        ))}
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'setup':
        return renderSetupView();
      case 'ai-visibility':
        return renderAIVisibilityView();
      case 'prompts':
        return renderPromptsView();
      case 'products':
        return renderProductsView();
      case 'optimizations':
        return renderOptimizationsView();
      case 'actions':
        return renderActionsView();
      default:
        return renderSetupView();
    }
  };

  const currentStepConfig = WIZARD_STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <button 
            onClick={() => isFirstStep ? handleExitWizard() : goToPreviousStep()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{isFirstStep ? 'Exit' : 'Back'}</span>
          </button>
          
          <Button 
            onClick={goToNextStep}
            className="h-9 px-5 rounded-full"
          >
            {isLastStep ? 'Preview Report' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Step Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {WIZARD_STEPS.map((step, index) => (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => goToStep(step.key)}
                  disabled={index > currentStepIndex}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                    index === currentStepIndex 
                      ? "bg-primary text-primary-foreground font-medium"
                      : index < currentStepIndex
                        ? "text-foreground hover:bg-muted cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {index < currentStepIndex && <Check className="w-3.5 h-3.5" />}
                  {step.label}
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-light tracking-tight text-foreground mb-2">
              {currentStepConfig.label}
            </h1>
            <p className="text-muted-foreground text-sm">
              Step {currentStepIndex + 1} of {WIZARD_STEPS.length}
            </p>
          </div>

          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

// Clean list item component (no card styling)
interface SectionNavItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  selected: boolean;
  selectedCount: number;
  onClick: () => void;
}

const SectionNavItem = ({ icon: Icon, title, description, selected, selectedCount, onClick }: SectionNavItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 py-4 transition-colors text-left group hover:bg-muted/20"
  >
    <div className={cn(
      "w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors",
      selected ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
    )}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {selectedCount > 0 && (
          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            {selectedCount}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
  </button>
);

// Clean selectable row (no card)
interface SelectableRowProps {
  label: string;
  meta: string;
  selected: boolean;
  onToggle: () => void;
  badge?: string;
  badgeVariant?: 'success' | 'warning';
}

const SelectableRow = ({ label, meta, selected, onToggle, badge, badgeVariant }: SelectableRowProps) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center gap-3 py-3 text-left transition-colors hover:bg-muted/20"
  >
    <div className={cn(
      "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
      selected ? "bg-primary border-primary" : "border-border"
    )}>
      {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground truncate">{label}</span>
        {badge && (
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full",
            badgeVariant === 'success' && "bg-emerald-500/10 text-emerald-600",
            badgeVariant === 'warning' && "bg-amber-500/10 text-amber-600"
          )}>
            {badge}
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{meta}</span>
    </div>
  </button>
);

// Product row with drill-down
interface ProductRowProps {
  product: typeof mockProducts[0];
  selected: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

const ProductRow = ({ product, selected, onToggle, onNavigate }: ProductRowProps) => (
  <div className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/20">
    <button onClick={onToggle} className="shrink-0">
      <div className={cn(
        "w-4 h-4 rounded border flex items-center justify-center transition-all",
        selected ? "bg-primary border-primary" : "border-border"
      )}>
        {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
      </div>
    </button>
    <button onClick={onNavigate} className="flex-1 flex items-center gap-3 text-left min-w-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground truncate">{product.name}</span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-full",
            product.status === 'ai-ready' 
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-amber-500/10 text-amber-600"
          )}>
            {product.status === 'ai-ready' ? 'AI-Ready' : 'Needs Improvement'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{product.prompts.length} prompts</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  </div>
);

// Optimization row with drill-down
interface OptimizationRowProps {
  optimization: typeof mockOptimizations[0];
  selected: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

const OptimizationRow = ({ optimization, selected, onToggle, onNavigate }: OptimizationRowProps) => (
  <div className="flex items-center gap-3 py-3 transition-colors hover:bg-muted/20">
    <button onClick={onToggle} className="shrink-0">
      <div className={cn(
        "w-4 h-4 rounded border flex items-center justify-center transition-all",
        selected ? "bg-primary border-primary" : "border-border"
      )}>
        {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
      </div>
    </button>
    <button onClick={onNavigate} className="flex-1 flex items-center gap-3 text-left min-w-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground truncate">{optimization.title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            {optimization.associatedWith.type === 'product' ? 'Product' : 'Brand'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground truncate">{optimization.urlSlug}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  </div>
);

// Filter pill component
interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning';
}

const FilterPill = ({ label, active, onClick, variant = 'default' }: FilterPillProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1 text-xs rounded-full transition-colors",
      active 
        ? variant === 'success' 
          ? "bg-emerald-500/10 text-emerald-600"
          : variant === 'warning'
            ? "bg-amber-500/10 text-amber-600"
            : "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
    )}
  >
    {label}
  </button>
);

export default Reports;
