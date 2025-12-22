import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import ReportEditor, { ReportBlock } from '@/components/reports/ReportEditor';

// Mock data for granular selection
const mockPrompts = [
  { id: "1", text: "Best running shoes for marathon training", mentions: 24, platform: "ChatGPT" },
  { id: "2", text: "Nike vs Adidas for professional athletes", mentions: 18, platform: "Gemini" },
  { id: "3", text: "Most comfortable shoes for daily wear", mentions: 15, platform: "Claude" },
  { id: "4", text: "Top rated sneakers 2024", mentions: 12, platform: "Perplexity" },
  { id: "5", text: "Which brand has the best durability", mentions: 9, platform: "Grok" },
];

const mockActions = [
  { id: "1", title: "Optimized product description for Air Max", date: "Dec 18, 2024", type: "Content" },
  { id: "2", title: "Updated meta tags for running category", date: "Dec 15, 2024", type: "SEO" },
  { id: "3", title: "Added FAQ schema to landing page", date: "Dec 12, 2024", type: "Technical" },
  { id: "4", title: "Created comparison content vs Adidas", date: "Dec 10, 2024", type: "Content" },
];

const mockProducts = [
  { id: "1", name: "Air Max 90", prompts: 8 },
  { id: "2", name: "Air Force 1", prompts: 6 },
  { id: "3", name: "Dunk Low", prompts: 4 },
];

const mockSources = [
  { id: "1", url: "nike.com/running", traffic: "45K", citations: 12 },
  { id: "2", url: "nike.com/air-max", traffic: "32K", citations: 8 },
  { id: "3", url: "nike.com/basketball", traffic: "28K", citations: 5 },
];

const platforms = [
  { id: "chatgpt", name: "ChatGPT", mentions: 4234 },
  { id: "gemini", name: "Gemini", mentions: 3456 },
  { id: "claude", name: "Claude", mentions: 2847 },
  { id: "perplexity", name: "Perplexity", mentions: 2310 },
  { id: "grok", name: "Grok", mentions: 1892 },
];

interface SectionConfig {
  enabled: boolean;
  items?: string[];
}

const Reports = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'configure' | 'edit'>('configure');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const [sections, setSections] = useState<Record<string, SectionConfig>>({
    score: { enabled: true },
    mentions: { enabled: true },
    platformCoverage: { enabled: true, items: platforms.map(p => p.id) },
    prompts: { enabled: true, items: mockPrompts.map(p => p.id) },
    optimization: { enabled: false },
    products: { enabled: false, items: [] },
    sources: { enabled: false, items: [] },
    actions: { enabled: false, items: [] },
  });

  const [reportTitle, setReportTitle] = useState("AI Visibility Report");
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Editor blocks state
  const [editorBlocks, setEditorBlocks] = useState<ReportBlock[]>([]);

  const toggleSection = (key: string) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const toggleItem = (sectionKey: string, itemId: string) => {
    setSections(prev => {
      const currentItems = prev[sectionKey].items || [];
      const newItems = currentItems.includes(itemId)
        ? currentItems.filter(id => id !== itemId)
        : [...currentItems, itemId];
      return {
        ...prev,
        [sectionKey]: { ...prev[sectionKey], items: newItems }
      };
    });
  };

  const selectAllItems = (sectionKey: string, allIds: string[]) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], items: allIds }
    }));
  };

  const deselectAllItems = (sectionKey: string) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], items: [] }
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

  const enabledSectionsCount = Object.values(sections).filter(s => s.enabled).length;

  // Generate initial blocks from configuration
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
          body: 'Comprehensive analysis of brand mentions across leading AI platforms with visual breakdown and detailed metrics.'
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
          body: 'Most frequent prompts and queries mentioning your brand across AI platforms.'
        }
      });
      
      // Add selected prompts as quotes
      const selectedPrompts = mockPrompts.filter(p => sections.prompts.items?.includes(p.id));
      selectedPrompts.slice(0, 3).forEach((prompt, i) => {
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
          sectionType: 'Optimized Products',
          title: 'Product Optimization Summary',
          body: 'Products that have been optimized for AI visibility with associated prompts and content.'
        }
      });
    }

    if (sections.sources.enabled && sections.sources.items?.length) {
      blocks.push({
        id: 'sources-section',
        type: 'section',
        content: {
          sectionType: 'Authority Sources',
          title: 'Top Authority Sources',
          body: 'Pages with highest estimated traffic and LLM citation counts.'
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
    setStep('edit');
  };

  const handleExport = () => {
    console.log('Exporting PDF with blocks:', editorBlocks);
    // TODO: Implement actual PDF export
  };

  // Render editor step
  if (step === 'edit') {
    return (
      <ReportEditor
        blocks={editorBlocks}
        onBlocksChange={setEditorBlocks}
        onBack={() => setStep('configure')}
        onExport={handleExport}
        reportTitle={reportTitle}
        onTitleChange={setReportTitle}
      />
    );
  }

  // Render configure step
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          
          <Button 
            onClick={handleProceedToEdit}
            className="h-9 px-5 rounded-full"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16">
        {/* Page Title */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Step 1 of 2</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Configure Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Select what to include, then customize in the next step
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
          {/* Left - Configuration */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Time Period */}
            <section>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-4">
                Report Period
              </label>
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-foreground hover:text-foreground/70 transition-colors">
                      {startDate ? format(startDate, "MMM d, yyyy") : "Start"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-foreground hover:text-foreground/70 transition-colors">
                      {endDate ? format(endDate, "MMM d, yyyy") : "End"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </section>

            <Separator />

            {/* Sections */}
            <section>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-6">
                Sections
              </label>
              
              <div className="space-y-0">
                {/* Score */}
                <SectionToggle
                  title="Visibility Score"
                  enabled={sections.score.enabled}
                  onToggle={() => toggleSection("score")}
                />

                {/* Mentions */}
                <SectionToggle
                  title="Total Mentions"
                  enabled={sections.mentions.enabled}
                  onToggle={() => toggleSection("mentions")}
                />

                {/* Platform Coverage - Expandable */}
                <ExpandableSection
                  title="Platform Coverage"
                  subtitle={`${sections.platformCoverage.items?.length || 0} of ${platforms.length} platforms`}
                  enabled={sections.platformCoverage.enabled}
                  onToggle={() => toggleSection("platformCoverage")}
                  expanded={expandedSection === "platformCoverage"}
                  onExpand={() => setExpandedSection(expandedSection === "platformCoverage" ? null : "platformCoverage")}
                >
                  <ItemList
                    items={platforms.map(p => ({ id: p.id, label: p.name, meta: `${p.mentions.toLocaleString()} mentions` }))}
                    selectedIds={sections.platformCoverage.items || []}
                    onToggle={(id) => toggleItem("platformCoverage", id)}
                    onSelectAll={() => selectAllItems("platformCoverage", platforms.map(p => p.id))}
                    onClear={() => deselectAllItems("platformCoverage")}
                  />
                </ExpandableSection>

                {/* Prompts - Expandable */}
                <ExpandableSection
                  title="Prompts & Queries"
                  subtitle={`${sections.prompts.items?.length || 0} of ${mockPrompts.length} prompts`}
                  enabled={sections.prompts.enabled}
                  onToggle={() => toggleSection("prompts")}
                  expanded={expandedSection === "prompts"}
                  onExpand={() => setExpandedSection(expandedSection === "prompts" ? null : "prompts")}
                >
                  <ItemList
                    items={mockPrompts.map(p => ({ id: p.id, label: p.text, meta: `${p.mentions} mentions · ${p.platform}` }))}
                    selectedIds={sections.prompts.items || []}
                    onToggle={(id) => toggleItem("prompts", id)}
                    onSelectAll={() => selectAllItems("prompts", mockPrompts.map(p => p.id))}
                    onClear={() => deselectAllItems("prompts")}
                  />
                </ExpandableSection>

                {/* On-site Optimization */}
                <SectionToggle
                  title="On-site Optimization"
                  enabled={sections.optimization.enabled}
                  onToggle={() => toggleSection("optimization")}
                />

                {/* Products - Expandable */}
                <ExpandableSection
                  title="Optimized Products"
                  subtitle={`${sections.products.items?.length || 0} of ${mockProducts.length} products`}
                  enabled={sections.products.enabled}
                  onToggle={() => toggleSection("products")}
                  expanded={expandedSection === "products"}
                  onExpand={() => setExpandedSection(expandedSection === "products" ? null : "products")}
                >
                  <ItemList
                    items={mockProducts.map(p => ({ id: p.id, label: p.name, meta: `${p.prompts} prompts` }))}
                    selectedIds={sections.products.items || []}
                    onToggle={(id) => toggleItem("products", id)}
                    onSelectAll={() => selectAllItems("products", mockProducts.map(p => p.id))}
                    onClear={() => deselectAllItems("products")}
                  />
                </ExpandableSection>

                {/* Sources - Expandable */}
                <ExpandableSection
                  title="Authority Sources"
                  subtitle={`${sections.sources.items?.length || 0} of ${mockSources.length} sources`}
                  enabled={sections.sources.enabled}
                  onToggle={() => toggleSection("sources")}
                  expanded={expandedSection === "sources"}
                  onExpand={() => setExpandedSection(expandedSection === "sources" ? null : "sources")}
                >
                  <ItemList
                    items={mockSources.map(s => ({ id: s.id, label: s.url, meta: `${s.traffic} traffic · ${s.citations} citations` }))}
                    selectedIds={sections.sources.items || []}
                    onToggle={(id) => toggleItem("sources", id)}
                    onSelectAll={() => selectAllItems("sources", mockSources.map(s => s.id))}
                    onClear={() => deselectAllItems("sources")}
                  />
                </ExpandableSection>

                {/* Actions - Expandable */}
                <ExpandableSection
                  title="Actions Log"
                  subtitle={`${sections.actions.items?.length || 0} of ${mockActions.length} actions`}
                  enabled={sections.actions.enabled}
                  onToggle={() => toggleSection("actions")}
                  expanded={expandedSection === "actions"}
                  onExpand={() => setExpandedSection(expandedSection === "actions" ? null : "actions")}
                >
                  <ItemList
                    items={mockActions.map(a => ({ id: a.id, label: a.title, meta: `${a.date} · ${a.type}` }))}
                    selectedIds={sections.actions.items || []}
                    onToggle={(id) => toggleItem("actions", id)}
                    onSelectAll={() => selectAllItems("actions", mockActions.map(a => a.id))}
                    onClear={() => deselectAllItems("actions")}
                  />
                </ExpandableSection>
              </div>
            </section>

            <Separator />

            {/* Branding */}
            <section>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-6">
                Branding
              </label>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-foreground mb-2 block">Report Title</label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="max-w-sm border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground bg-transparent h-10"
                    placeholder="Enter report title"
                  />
                </div>

                <div>
                  <label className="text-sm text-foreground mb-2 block">Logo</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {customLogo ? (
                    <div className="flex items-center gap-3">
                      <img src={customLogo} alt="Logo" className="h-8 object-contain" />
                      <button 
                        onClick={() => setCustomLogo(null)}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      Upload logo
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm text-foreground">Page numbers</span>
                  <Switch
                    checked={showPageNumbers}
                    onCheckedChange={setShowPageNumbers}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-4">
                Preview
              </label>
              
              {/* Mini Document Preview */}
              <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden aspect-[8.5/11]">
                <div className="p-6 h-full flex flex-col text-left">
                  {/* Cover content */}
                  <div className="flex-1">
                    {customLogo && (
                      <img src={customLogo} alt="Logo" className="h-5 object-contain mb-4" />
                    )}
                    <h3 className="text-base font-light text-foreground mb-1">
                      {reportTitle}
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-6">
                      {startDate && endDate && `${format(startDate, "MM/dd/yyyy")} — ${format(endDate, "MM/dd/yyyy")}`}
                    </p>
                    
                    {/* Section placeholders */}
                    <div className="space-y-3">
                      {sections.score.enabled && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-muted/50" />
                          <div className="flex-1">
                            <div className="h-1.5 bg-muted/50 rounded w-16 mb-1" />
                            <div className="h-1 bg-muted/30 rounded w-10" />
                          </div>
                        </div>
                      )}
                      {sections.mentions.enabled && (
                        <div className="h-1.5 bg-muted/40 rounded w-20" />
                      )}
                      {sections.platformCoverage.enabled && (
                        <div className="space-y-1 pt-2">
                          {(sections.platformCoverage.items || []).slice(0, 3).map((_, i) => (
                            <div key={i} className="flex justify-between">
                              <div className="h-1 bg-muted/30 rounded w-12" />
                              <div className="h-1 bg-muted/20 rounded w-6" />
                            </div>
                          ))}
                        </div>
                      )}
                      {sections.prompts.enabled && (sections.prompts.items?.length || 0) > 0 && (
                        <div className="space-y-1 pt-2">
                          {(sections.prompts.items || []).slice(0, 3).map((_, i) => (
                            <div key={i} className="h-1 bg-muted/20 rounded w-full" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  {showPageNumbers && (
                    <div className="flex justify-between items-center text-[8px] text-muted-foreground pt-3 border-t border-border/50">
                      <span>{customLogo ? "" : "Your Brand"}</span>
                      <span>01</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="mt-4 text-sm text-muted-foreground">
                {enabledSectionsCount} sections selected
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Simple section toggle
interface SectionToggleProps {
  title: string;
  enabled: boolean;
  onToggle: () => void;
}

const SectionToggle = ({ title, enabled, onToggle }: SectionToggleProps) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between py-4 border-b border-border/50 text-left group"
  >
    <span className={cn(
      "text-sm transition-colors",
      enabled ? "text-foreground" : "text-muted-foreground"
    )}>
      {title}
    </span>
    <div className={cn(
      "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
      enabled 
        ? "bg-foreground border-foreground" 
        : "border-border"
    )}>
      {enabled && <Check className="h-3 w-3 text-background" />}
    </div>
  </button>
);

// Expandable section with items
interface ExpandableSectionProps {
  title: string;
  subtitle: string;
  enabled: boolean;
  onToggle: () => void;
  expanded: boolean;
  onExpand: () => void;
  children: React.ReactNode;
}

const ExpandableSection = ({ title, subtitle, enabled, onToggle, expanded, onExpand, children }: ExpandableSectionProps) => (
  <div className="border-b border-border/50">
    <div className="flex items-center py-4">
      <button
        onClick={onToggle}
        className="flex-1 flex items-center justify-between text-left"
      >
        <div>
          <span className={cn(
            "text-sm transition-colors block",
            enabled ? "text-foreground" : "text-muted-foreground"
          )}>
            {title}
          </span>
          {enabled && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className={cn(
          "w-5 h-5 rounded-full border flex items-center justify-center transition-all mr-3",
          enabled 
            ? "bg-foreground border-foreground" 
            : "border-border"
        )}>
          {enabled && <Check className="h-3 w-3 text-background" />}
        </div>
      </button>
      {enabled && (
        <button
          onClick={onExpand}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-180"
          )} />
        </button>
      )}
    </div>
    {enabled && expanded && (
      <div className="pb-4">
        {children}
      </div>
    )}
  </div>
);

// Item list for selection
interface ItemListProps {
  items: { id: string; label: string; meta: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

const ItemList = ({ items, selectedIds, onToggle, onSelectAll, onClear }: ItemListProps) => (
  <div className="pl-0">
    <div className="flex items-center justify-end gap-4 mb-3">
      <button 
        onClick={onSelectAll}
        className="text-xs text-primary hover:underline"
      >
        Select all
      </button>
      <button 
        onClick={onClear}
        className="text-xs text-muted-foreground hover:underline"
      >
        Clear
      </button>
    </div>
    <div className="space-y-0">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={cn(
            "w-full flex items-center gap-3 py-3 px-0 text-left border-b border-border/30 last:border-0",
            "hover:bg-muted/20 transition-colors"
          )}
        >
          <div className={cn(
            "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
            selectedIds.includes(item.id)
              ? "bg-foreground border-foreground" 
              : "border-border"
          )}>
            {selectedIds.includes(item.id) && <Check className="h-2.5 w-2.5 text-background" />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-foreground block truncate">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.meta}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default Reports;
