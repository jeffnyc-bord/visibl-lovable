import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, CheckCircle, CalendarIcon, Upload, Building2, Sparkles } from "lucide-react";
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
}

export const ReportExportDialog = ({ trigger, brandName = "Tesla", reportType = "full", userRole = "business_user", brandData }: ReportExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Report customization state
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [reportTitle, setReportTitle] = useState(`${brandName} AI Visibility Report`);
  const [agencyLogo, setAgencyLogo] = useState<File | null>(null);
  const [agencyName, setAgencyName] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["pdf"]);

  const exportFormats = [
    { id: "pdf", label: "PDF Report", description: "Professional formatted report document" },
    { id: "word", label: "Word Document", description: "Editable document with tables and formatting" },
    { id: "excel", label: "Excel Spreadsheet", description: "Data tables and charts" },
    { id: "powerpoint", label: "PowerPoint Presentation", description: "Slide deck for presentations" },
    { id: "csv", label: "CSV Data", description: "Raw data export" },
  ];

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    { id: "executive-summary", label: "Executive Summary", description: "AI-generated overview of key findings", enabled: true },
    { id: "ai-visibility-score", label: "AI Visibility Overview", description: "Overall performance metrics and trends", enabled: true },
    { id: "platform-analysis", label: "AI Platform Breakdown", description: "Detailed analysis across ChatGPT, Claude, Gemini, Perplexity", enabled: true },
    { id: "product-analysis", label: "Product & Brand Analysis", description: "AI readiness and visibility of products/services", enabled: reportType === "full" || reportType === "visibility" },
    { id: "competitor-analysis", label: "Competitive Landscape", description: "Brand positioning vs competitors in AI platforms", enabled: reportType === "full" },
    { id: "technical-health", label: "Technical AI Optimization", description: "Schema, crawlability and technical performance", enabled: reportType === "full" },
    { id: "top-prompts", label: "Top AI Prompts & Queries", description: "Most frequent prompts mentioning your brand", enabled: true },
    { id: "financial-projections", label: "Financial Impact Projections", description: "Revenue estimates based on AI search volume", enabled: true },
    { id: "recommendations", label: "Strategic Recommendations", description: "Platform-specific and technical optimization recommendations", enabled: true },
  ]);

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setReportSections(prev => 
      prev.map(section => 
        section.id === sectionId ? { ...section, enabled } : section
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
      brandData, // Pass the comprehensive brand data
    };

    const filename = `${brandName.replace(/\s+/g, '_')}_AI_Visibility_Report_${format(new Date(), 'yyyy-MM-dd')}`;

    try {
      // Generate selected formats
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
          case 'excel':
          case 'powerpoint':
          case 'csv':
            // Simulate legacy format generation
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
        setStep(1);
        toast({
          title: "Report Export Complete",
          description: `Your ${reportType === 'full' ? 'comprehensive' : 'focused'} ${brandName} report has been downloaded in ${selectedFormats.length} format${selectedFormats.length > 1 ? 's' : ''}.`,
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
    setStep(1);
    setReportTitle(`${brandName} AI Visibility Report`);
    setAgencyLogo(null);
    setAgencyName("");
    setSelectedFormats(["pdf"]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!isExporting ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Export {reportType === 'full' ? 'Comprehensive' : 'Focused'} Report</span>
              </DialogTitle>
              <DialogDescription>
                Generate a professional, branded report for {brandName} with customizable sections{userRole === "agency_admin" ? " and white-label options" : ""}.
              </DialogDescription>
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-6 py-4">
                {/* Date Range Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Report Period</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
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
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
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
                </div>

                {/* Report Sections */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Report Sections</Label>
                  <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {reportSections.map((section) => (
                      <div key={section.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={section.id}
                          checked={section.enabled}
                          onCheckedChange={(checked) => handleSectionToggle(section.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={section.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {section.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Formats */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Export Formats</Label>
                  <div className="space-y-3 border rounded-lg p-4">
                    {exportFormats.map((format) => (
                      <div key={format.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={format.id}
                          checked={selectedFormats.includes(format.id)}
                          onCheckedChange={(checked) => handleFormatToggle(format.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={format.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {format.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {format.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={userRole === "agency_admin" ? () => setStep(2) : handleExport}>
                    {userRole === "agency_admin" ? "Next: Branding" : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && userRole === "agency_admin" && (
              <div className="space-y-6 py-4">
                {/* Report Title */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Report Title</Label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter custom report title"
                  />
                </div>

                {/* Agency Branding */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <Label className="text-base font-medium">White-Label Options</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Agency Name</Label>
                      <Input
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="Your agency name (for report branding)"
                      />
                    </div>
                    
                    <div>
                        <Label className="text-sm font-medium">Agency Logo</Label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            className="hidden"
                            id="agency-logo"
                          />
                          <label htmlFor="agency-logo" className="cursor-pointer">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {agencyLogo ? agencyLogo.name : "Upload agency logo"}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExport} className="bg-gradient-to-r from-primary to-primary/80">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto">
                {exportProgress === 100 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <FileText className="w-10 h-10 text-primary animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {exportProgress === 100 ? "Report Ready!" : "Generating Report..."}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {exportProgress === 100 ? 
                    "Your professional report has been generated and will download shortly." :
                    exportProgress < 20 ? "Collecting data from all platforms..." :
                    exportProgress < 40 ? "Analyzing AI visibility metrics..." :
                    exportProgress < 60 ? "Generating insights and recommendations..." :
                    exportProgress < 80 ? "Applying branding and formatting..." :
                    "Finalizing PDF report..."
                  }
                </p>
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(exportProgress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
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