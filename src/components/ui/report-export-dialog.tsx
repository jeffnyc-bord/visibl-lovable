import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, FileText, CheckCircle, CalendarIcon, Upload, Building2, Sparkles,
  MessageSquare, Package, Link, Plus, Trash2, Edit2, ChevronRight, ChevronLeft,
  GripVertical, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { downloadPDF } from "@/utils/pdfGenerator";
import { downloadWordDocument } from "@/utils/wordGenerator";

interface ReportExportDialogProps {
  trigger: React.ReactNode;
  brandName?: string;
  reportType?: "full" | "ai-mentions" | "visibility";
  userRole?: "business_user" | "agency_admin";
  brandData?: {
    visibilityScore: number;
    totalMentions: number;
    platformCoverage: number;
    industryRanking: number;
    mentionTrend: string;
    sentimentScore: number;
    platforms: Array<{
      name: string;
      mentions: number;
      sentiment: string;
      coverage: number;
      trend: string;
    }>;
    products: Array<{
      name: string;
      category: string;
      visibilityScore: number;
      mentions: number;
      sentiment: string;
    }>;
    competitors: Array<{
      name: string;
      visibilityScore: number;
      mentions: number;
      trend: string;
    }>;
  };
}

interface ReportSection {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  comment: string;
}

interface PromptItem {
  id: string;
  text: string;
  platform: string;
  mentions: number;
  selected: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  score: number;
  selected: boolean;
}

interface SourceItem {
  id: string;
  url: string;
  title: string;
  authority: "high" | "medium" | "low";
  selected: boolean;
  isCustom?: boolean;
}

// Sample data for prompts
const samplePrompts: PromptItem[] = [
  { id: "1", text: "What is the best electric vehicle for families?", platform: "ChatGPT", mentions: 245, selected: true },
  { id: "2", text: "Compare Tesla vs other electric cars", platform: "Claude", mentions: 189, selected: true },
  { id: "3", text: "Most reliable electric vehicle brands 2024", platform: "Gemini", mentions: 156, selected: true },
  { id: "4", text: "Best EV for long road trips", platform: "Perplexity", mentions: 134, selected: false },
  { id: "5", text: "Electric SUV recommendations", platform: "ChatGPT", mentions: 122, selected: false },
  { id: "6", text: "Tesla autopilot vs competitors", platform: "Claude", mentions: 98, selected: false },
  { id: "7", text: "Best charging network for electric cars", platform: "Gemini", mentions: 87, selected: false },
  { id: "8", text: "Electric vehicle maintenance costs", platform: "Perplexity", mentions: 76, selected: false },
];

// Sample data for products
const sampleProducts: ProductItem[] = [
  { id: "1", name: "Model S", category: "Sedan", score: 92, selected: true },
  { id: "2", name: "Model 3", category: "Sedan", score: 88, selected: true },
  { id: "3", name: "Model X", category: "SUV", score: 85, selected: true },
  { id: "4", name: "Model Y", category: "SUV", score: 90, selected: true },
  { id: "5", name: "Cybertruck", category: "Truck", score: 78, selected: false },
  { id: "6", name: "Roadster", category: "Sports", score: 65, selected: false },
];

// Sample data for sources
const sampleSources: SourceItem[] = [
  { id: "1", url: "https://electrek.co/tesla-review", title: "Electrek - Tesla Review 2024", authority: "high", selected: true },
  { id: "2", url: "https://caranddriver.com/tesla", title: "Car and Driver - Tesla Guide", authority: "high", selected: true },
  { id: "3", url: "https://motortrend.com/ev-comparison", title: "MotorTrend - EV Comparison", authority: "medium", selected: true },
  { id: "4", url: "https://techcrunch.com/tesla-autopilot", title: "TechCrunch - Autopilot Analysis", authority: "medium", selected: false },
  { id: "5", url: "https://reuters.com/tesla-market", title: "Reuters - Tesla Market Position", authority: "high", selected: false },
  { id: "6", url: "https://wired.com/ev-future", title: "Wired - Future of EVs", authority: "medium", selected: false },
];

export const ReportExportDialog = ({ trigger, brandName = "Tesla", reportType = "full", userRole = "business_user", brandData }: ReportExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Total steps: 1=Sections, 2=Prompts, 3=Products, 4=Sources, 5=Format/Branding
  const totalSteps = userRole === "agency_admin" ? 5 : 4;
  
  const steps = [
    { number: 1, label: "Sections", icon: FileText },
    { number: 2, label: "Prompts", icon: MessageSquare },
    { number: 3, label: "Products", icon: Package },
    { number: 4, label: "Sources", icon: Link },
    ...(userRole === "agency_admin" ? [{ number: 5, label: "Branding", icon: Building2 }] : []),
  ];

  // Report customization state
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [reportTitle, setReportTitle] = useState(`${brandName} AI Visibility Report`);
  const [agencyLogo, setAgencyLogo] = useState<File | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["pdf"]);

  // Prompts state
  const [prompts, setPrompts] = useState<PromptItem[]>(samplePrompts);
  
  // Products state  
  const [products, setProducts] = useState<ProductItem[]>(sampleProducts);
  
  // Sources state
  const [sources, setSources] = useState<SourceItem[]>(sampleSources);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceTitle, setNewSourceTitle] = useState("");

  // Section comments state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const exportFormats = [
    { id: "pdf", label: "PDF Report", description: "Professional formatted report document" },
    { id: "csv", label: "CSV Data", description: "Raw data export" },
  ];

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    { id: "ai-visibility-overview", label: "AI Visibility Overview", description: "Overall performance metrics and trends", enabled: true, comment: "" },
    { id: "platform-mention-distribution", label: "AI Platform Mention Distribution", description: "Detailed analysis across ChatGPT, Claude, Gemini, Perplexity", enabled: true, comment: "" },
    { id: "product-brand-analysis", label: "Product & Brand Analysis", description: "AI readiness and visibility of products/services", enabled: true, comment: "" },
    { id: "product-readiness-distribution", label: "Overall Product Readiness Distribution", description: "Distribution of product readiness across portfolio", enabled: true, comment: "" },
    { id: "top-prompts-queries", label: "Top AI Prompts & Queries", description: "Most frequent prompts mentioning your brand", enabled: true, comment: "" },
    { id: "strategic-recommendations", label: "Strategic Recommendations", description: "Platform-specific and technical optimization recommendations", enabled: true, comment: "" },
  ]);

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setReportSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, enabled } : section
      )
    );
  };

  const handleSectionComment = (sectionId: string, comment: string) => {
    setReportSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, comment } : section
      )
    );
  };

  const handleFormatToggle = (formatId: string, checked: boolean) => {
    setSelectedFormats(prev => 
      checked 
        ? [...prev, formatId]
        : prev.filter(id => id !== formatId)
    );
  };

  const handlePromptToggle = (promptId: string) => {
    setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, selected: !p.selected } : p));
  };

  const handleProductToggle = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, selected: !p.selected } : p));
  };

  const handleSourceToggle = (sourceId: string) => {
    setSources(prev => prev.map(s => s.id === sourceId ? { ...s, selected: !s.selected } : s));
  };

  const handleAddSource = () => {
    if (!newSourceUrl.trim()) return;
    const newSource: SourceItem = {
      id: `custom-${Date.now()}`,
      url: newSourceUrl,
      title: newSourceTitle || newSourceUrl,
      authority: "medium",
      selected: true,
      isCustom: true,
    };
    setSources(prev => [...prev, newSource]);
    setNewSourceUrl("");
    setNewSourceTitle("");
    toast({ title: "Source added", description: "Custom source has been added to the report." });
  };

  const handleRemoveSource = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
  };

  const handleSelectAllPrompts = () => {
    const allSelected = prompts.every(p => p.selected);
    setPrompts(prev => prev.map(p => ({ ...p, selected: !allSelected })));
  };

  const handleSelectAllProducts = () => {
    const allSelected = products.every(p => p.selected);
    setProducts(prev => prev.map(p => ({ ...p, selected: !allSelected })));
  };

  const handleSelectAllSources = () => {
    const allSelected = sources.every(s => s.selected);
    setSources(prev => prev.map(s => ({ ...s, selected: !allSelected })));
  };

  const handleFileUpload = (file: File) => {
    setAgencyLogo(file);
  };

  const handleExport = async () => {
    const enabledSections = reportSections.filter(section => section.enabled);
    if (enabledSections.length === 0) {
      toast({
        title: "No sections selected",
        description: "Please select at least one section to include in your report.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFormats.length === 0) {
      toast({
        title: "No formats selected",
        description: "Please select at least one export format.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    const reportData = {
      brandName,
      reportTitle,
      dateRange,
      sections: enabledSections,
      agencyName,
      brandData,
      selectedPrompts: prompts.filter(p => p.selected),
      selectedProducts: products.filter(p => p.selected),
      selectedSources: sources.filter(s => s.selected),
      sectionComments: reportSections.reduce((acc, s) => ({ ...acc, [s.id]: s.comment }), {}),
    };

    const filename = `${brandName.replace(/\s+/g, '_')}_AI_Visibility_Report_${format(new Date(), 'yyyy-MM-dd')}`;

    try {
      const formatPromises = selectedFormats.map(async (formatId) => {
        switch (formatId) {
          case 'pdf':
            setExportProgress(25);
            downloadPDF(reportData, filename);
            break;
          case 'word':
            setExportProgress(50);
            downloadWordDocument(reportData, filename);
            break;
          case 'csv':
            setExportProgress(prev => prev + 20);
            break;
        }
      });

      await Promise.all(formatPromises);
      setExportProgress(100);

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setIsOpen(false);
        setCurrentStep(1);
        toast({
          title: "Report Export Complete",
          description: `Your custom ${brandName} report has been downloaded.`,
        });
      }, 1500);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
      setExportProgress(0);
      toast({
        title: "Export Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setReportTitle(`${brandName} AI Visibility Report`);
    setAgencyLogo(null);
    setAgencyName("");
    setSelectedFormats(["pdf"]);
    setPrompts(samplePrompts);
    setProducts(sampleProducts);
    setSources(sampleSources);
    setNewSourceUrl("");
    setNewSourceTitle("");
    setEditingCommentId(null);
  };

  const selectedPromptsCount = prompts.filter(p => p.selected).length;
  const selectedProductsCount = products.filter(p => p.selected).length;
  const selectedSourcesCount = sources.filter(s => s.selected).length;

  const getAuthorityColor = (authority: string) => {
    switch (authority) {
      case "high": return "text-green-600 bg-green-500/10";
      case "medium": return "text-amber-600 bg-amber-500/10";
      case "low": return "text-red-600 bg-red-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/40">
        {!isExporting ? (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/40">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Custom Report Builder
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Create a tailored report for {brandName}
                </DialogDescription>
              </DialogHeader>

              {/* Step Indicator - Apple-style segmented control */}
              <div className="flex items-center gap-1 mt-5 p-1 bg-muted/50 rounded-xl w-fit">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                      currentStep === step.number 
                        ? "bg-background text-foreground shadow-sm" 
                        : currentStep > step.number
                          ? "text-primary/70 hover:text-primary"
                          : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <step.icon className="w-3.5 h-3.5" />
                    <span>{step.label}</span>
                    {currentStep > step.number && (
                      <CheckCircle className="w-3 h-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1 px-6 py-5">
              {/* Step 1: Sections with Comments */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Date Range Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Report Period</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal h-10 bg-muted/30 border-border/40 hover:bg-muted/50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs mr-1">From:</span>
                            {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal h-10 bg-muted/30 border-border/40 hover:bg-muted/50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs mr-1">To:</span>
                            {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Report Sections with Notes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-foreground">Report Sections</Label>
                      <Badge variant="outline" className="text-xs font-normal bg-muted/30 border-border/40">
                        {reportSections.filter(s => s.enabled).length} of {reportSections.length} selected
                      </Badge>
                    </div>
                    
                    {/* Hint about notes */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                      <Edit2 className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                      <p className="text-xs text-primary/80">
                        Click "Add Note" on any section to include custom commentary in your report
                      </p>
                    </div>

                    <div className="space-y-2">
                      {reportSections.map((section) => (
                        <div 
                          key={section.id} 
                          className={cn(
                            "group rounded-xl border bg-background/50 transition-all duration-200",
                            section.enabled 
                              ? "border-border/60 shadow-sm" 
                              : "border-border/30 opacity-60"
                          )}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <Checkbox
                              id={section.id}
                              checked={section.enabled}
                              onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <label
                                  htmlFor={section.id}
                                  className="text-sm font-medium leading-tight cursor-pointer text-foreground"
                                >
                                  {section.label}
                                </label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "h-7 px-2.5 text-xs rounded-lg transition-all",
                                    section.comment 
                                      ? "text-primary bg-primary/10 hover:bg-primary/15" 
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  )}
                                  onClick={() => setEditingCommentId(editingCommentId === section.id ? null : section.id)}
                                >
                                  <Edit2 className="w-3 h-3 mr-1" />
                                  {section.comment ? "Edit Note" : "Add Note"}
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {section.description}
                              </p>
                              
                              {/* Existing note display */}
                              {section.comment && editingCommentId !== section.id && (
                                <div className="mt-3 p-3 rounded-lg bg-muted/40 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <MessageSquare className="w-3 h-3 text-primary/70" />
                                    <span className="text-[10px] font-medium text-primary/70 uppercase tracking-wide">Your Note</span>
                                  </div>
                                  <p className="text-xs text-foreground/80 leading-relaxed">
                                    {section.comment}
                                  </p>
                                </div>
                              )}
                              
                              {/* Note editor */}
                              {editingCommentId === section.id && (
                                <div className="mt-3 space-y-2">
                                  <Textarea
                                    placeholder="Add your custom notes or commentary for this section..."
                                    value={section.comment}
                                    onChange={(e) => handleSectionComment(section.id, e.target.value)}
                                    className="text-sm min-h-[80px] bg-muted/30 border-border/40 resize-none"
                                    autoFocus
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => setEditingCommentId(null)}
                                      className="h-7 px-3 text-xs"
                                    >
                                      Save Note
                                    </Button>
                                    {section.comment && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          handleSectionComment(section.id, "");
                                          setEditingCommentId(null);
                                        }}
                                        className="h-7 px-3 text-xs text-muted-foreground hover:text-destructive"
                                      >
                                        Remove Note
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Prompts Selection */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Select Prompts</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Choose which prompts from Prompt Blast to include
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal bg-muted/30 border-border/40">
                        {selectedPromptsCount} selected
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSelectAllPrompts}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {prompts.every(p => p.selected) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={cn(
                          "flex items-start gap-3 p-3.5 rounded-xl border bg-background/50 transition-all cursor-pointer",
                          prompt.selected 
                            ? "border-primary/40 bg-primary/5 shadow-sm" 
                            : "border-border/40 hover:border-border/60 hover:bg-muted/20"
                        )}
                        onClick={() => handlePromptToggle(prompt.id)}
                      >
                        <Checkbox
                          checked={prompt.selected}
                          onCheckedChange={() => handlePromptToggle(prompt.id)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug text-foreground">{prompt.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] bg-muted/30 border-border/40">{prompt.platform}</Badge>
                            <span className="text-[10px] text-muted-foreground">{prompt.mentions} mentions</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Products Selection */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Select Products</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Choose which products to include in the analysis
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal bg-muted/30 border-border/40">
                        {selectedProductsCount} selected
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSelectAllProducts}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {products.every(p => p.selected) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-xl border bg-background/50 transition-all cursor-pointer",
                          product.selected 
                            ? "border-primary/40 bg-primary/5 shadow-sm" 
                            : "border-border/40 hover:border-border/60 hover:bg-muted/20"
                        )}
                        onClick={() => handleProductToggle(product.id)}
                      >
                        <Checkbox
                          checked={product.selected}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-[10px] bg-muted/30 border-border/40">{product.category}</Badge>
                            <span className="text-[10px] text-muted-foreground">Score: {product.score}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Sources Management */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Manage Sources</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Select, add, or remove sources for your report
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal bg-muted/30 border-border/40">
                        {selectedSourcesCount} selected
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSelectAllSources}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {sources.every(s => s.selected) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                  </div>

                  {/* Add Custom Source */}
                  <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add Custom Source</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Source URL"
                        value={newSourceUrl}
                        onChange={(e) => setNewSourceUrl(e.target.value)}
                        className="h-9 text-sm bg-background/50 border-border/40"
                      />
                      <Input
                        placeholder="Source Title (optional)"
                        value={newSourceTitle}
                        onChange={(e) => setNewSourceTitle(e.target.value)}
                        className="h-9 text-sm bg-background/50 border-border/40"
                      />
                    </div>
                    <Button size="sm" onClick={handleAddSource} disabled={!newSourceUrl.trim()} className="h-8">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Source
                    </Button>
                  </div>

                  {/* Sources List */}
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {sources.map((source) => (
                      <div
                        key={source.id}
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-xl border bg-background/50 transition-all",
                          source.selected 
                            ? "border-primary/40 bg-primary/5 shadow-sm" 
                            : "border-border/40"
                        )}
                      >
                        <Checkbox
                          checked={source.selected}
                          onCheckedChange={() => handleSourceToggle(source.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate text-foreground">{source.title}</p>
                            {source.isCustom && (
                              <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20 text-primary">Custom</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge className={cn("text-[10px] border", getAuthorityColor(source.authority))}>
                              {source.authority} authority
                            </Badge>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              View
                            </a>
                          </div>
                        </div>
                        {source.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveSource(source.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Export format for non-agency users */}
                  {userRole !== "agency_admin" && (
                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <Label className="text-sm font-medium text-foreground">Export Format</Label>
                      <div className="flex gap-2">
                        {exportFormats.map((format) => (
                          <button
                            key={format.id}
                            onClick={() => handleFormatToggle(format.id, !selectedFormats.includes(format.id))}
                            className={cn(
                              "flex-1 p-3 rounded-xl border text-left transition-all",
                              selectedFormats.includes(format.id)
                                ? "border-primary/40 bg-primary/5 shadow-sm"
                                : "border-border/40 bg-background/50 hover:border-border/60"
                            )}
                          >
                            <p className="text-sm font-medium text-foreground">{format.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{format.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Format & Branding (Agency only) */}
              {currentStep === 5 && userRole === "agency_admin" && (
                <div className="space-y-5">
                  {/* Report Title */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Report Title</Label>
                    <Input
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="Enter custom report title"
                      className="h-10 bg-muted/30 border-border/40"
                    />
                  </div>

                  {/* Export Formats */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Export Formats</Label>
                    <div className="flex gap-2">
                      {exportFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => handleFormatToggle(format.id, !selectedFormats.includes(format.id))}
                          className={cn(
                            "flex-1 p-3.5 rounded-xl border text-left transition-all",
                            selectedFormats.includes(format.id)
                              ? "border-primary/40 bg-primary/5 shadow-sm"
                              : "border-border/40 bg-background/50 hover:border-border/60"
                          )}
                        >
                          <p className="text-sm font-medium text-foreground">{format.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{format.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Agency Branding */}
                  <div className="space-y-4 p-4 rounded-xl border border-border/40 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary/70" />
                      <Label className="text-sm font-medium text-foreground">White-Label Options</Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Agency Name</Label>
                        <Input
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="Your agency name (for report branding)"
                          className="h-9 bg-background/50 border-border/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Agency Logo</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                          className="hidden"
                          id="agency-logo"
                        />
                        <label htmlFor="agency-logo" className="cursor-pointer block">
                          <div className="border border-dashed border-border/60 rounded-xl p-4 text-center hover:border-primary/40 hover:bg-primary/5 transition-all">
                            <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {agencyLogo ? agencyLogo.name : "Upload agency logo"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/20">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="h-9 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {selectedPromptsCount}
                </span>
                <span className="w-px h-3 bg-border/60" />
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {selectedProductsCount}
                </span>
                <span className="w-px h-3 bg-border/60" />
                <span className="flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  {selectedSourcesCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  className="h-9 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)} className="h-9">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleExport} className="h-9 bg-primary hover:bg-primary/90">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Generate Report
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6 py-12 px-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto">
                {exportProgress === 100 ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <FileText className="w-8 h-8 text-primary animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {exportProgress === 100 ? "Report Ready" : "Generating Report..."}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {exportProgress === 100 
                    ? "Your custom report will download shortly."
                    : "Building your custom report..."
                  }
                </p>
              </div>
              <div className="space-y-2 max-w-[200px] mx-auto">
                <div className="w-full bg-muted/40 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(exportProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(exportProgress)}% complete
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
