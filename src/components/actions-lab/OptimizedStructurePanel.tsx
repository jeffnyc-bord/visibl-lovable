import { useState, useEffect } from 'react';
import { Sparkles, Check, ChevronDown, ChevronRight, Link, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from './ContentTypeSelector';
import { PromptSource } from './PromptSourceSelector';
import { EditableHeadersPanel, HeaderItem, HeaderTemplate } from './EditableHeadersPanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TitleSuggestion {
  title: string;
  score: number;
  isOptimal: boolean;
}

export interface OptimizedStructure {
  urlSlug: string;
  seoTitle: string;
  metaDescription: string;
  titleSuggestions: TitleSuggestion[];
  headers: HeaderItem[];
  schemaEnabled: boolean;
  ratingEnabled: boolean;
}

interface OptimizedStructurePanelProps {
  contentType: ContentType;
  prompt: PromptSource;
  onStructureChange: (structure: OptimizedStructure) => void;
  onGenerate: () => void;
}

const generateDefaultHeaders = (contentType: ContentType, promptText: string): HeaderItem[] => {
  if (contentType === 'faq') {
    return [
      { id: 'h-1', level: 'h1', text: `FAQ: ${promptText.slice(0, 40)}`, isOptimized: true },
      { id: 'h-2', level: 'h2', text: 'What are the key differences?', isOptimized: true },
      { id: 'h-3', level: 'h2', text: 'Which option is best for beginners?', isOptimized: true },
      { id: 'h-4', level: 'h2', text: 'What do experts recommend?', isOptimized: false },
    ];
  }
  if (contentType === 'comparison') {
    return [
      { id: 'h-1', level: 'h1', text: `${promptText.slice(0, 50)}`, isOptimized: true },
      { id: 'h-2', level: 'h2', text: 'Quick Comparison', isOptimized: true },
      { id: 'h-3', level: 'h2', text: 'Feature Breakdown', isOptimized: true },
      { id: 'h-4', level: 'h3', text: 'Performance', isOptimized: true },
      { id: 'h-5', level: 'h2', text: 'Our Verdict', isOptimized: true },
    ];
  }
  return [
    { id: 'h-1', level: 'h1', text: `${promptText.slice(0, 50)}`, isOptimized: true },
    { id: 'h-2', level: 'h2', text: 'Introduction', isOptimized: true },
    { id: 'h-3', level: 'h2', text: 'Key Insights', isOptimized: true },
    { id: 'h-4', level: 'h2', text: 'Recommendations', isOptimized: true },
  ];
};

export const OptimizedStructurePanel = ({
  contentType,
  prompt,
  onStructureChange,
  onGenerate,
}: OptimizedStructurePanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [urlSlug, setUrlSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);
  const [schemaEnabled, setSchemaEnabled] = useState(contentType === 'faq');
  const [expandedHeaders, setExpandedHeaders] = useState(true);
  const [headers, setHeaders] = useState<HeaderItem[]>(() => 
    generateDefaultHeaders(contentType, prompt.prompt)
  );
  const [templates, setTemplates] = useState<HeaderTemplate[]>([]);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const titleSuggestions: TitleSuggestion[] = [
    { title: `${prompt.prompt} - Complete Guide for 2024`, score: 94, isOptimal: true },
    { title: `${prompt.prompt}: Expert Analysis & Recommendations`, score: 88, isOptimal: false },
    { title: `Understanding ${prompt.prompt} - What You Need to Know`, score: 82, isOptimal: false },
  ];

  useEffect(() => {
    setIsVisible(true);
    const slug = prompt.prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
    setUrlSlug(slug);
    setSeoTitle(titleSuggestions[0].title);
    const defaultDesc = `Discover everything you need to know about ${prompt.prompt.toLowerCase()}. Our comprehensive guide covers key insights, expert recommendations, and actionable tips.`;
    setMetaDescription(defaultDesc);
    setHeaders(generateDefaultHeaders(contentType, prompt.prompt));
    
    // Notify parent of initial structure
    onStructureChange({
      urlSlug: slug,
      seoTitle: titleSuggestions[0].title,
      metaDescription: defaultDesc,
      titleSuggestions,
      headers: generateDefaultHeaders(contentType, prompt.prompt),
      schemaEnabled: contentType === 'faq',
      ratingEnabled: false,
    });
  }, [prompt, contentType]);

  // Notify parent when values change
  useEffect(() => {
    onStructureChange({
      urlSlug,
      seoTitle,
      metaDescription,
      titleSuggestions,
      headers,
      schemaEnabled,
      ratingEnabled: false,
    });
  }, [urlSlug, seoTitle, metaDescription, headers, schemaEnabled]);

  const handleGenerateMetaDescription = async () => {
    setIsGeneratingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meta-description', {
        body: {
          title: seoTitle,
          contentType,
          prompt: prompt.prompt,
        },
      });

      if (error) throw error;
      
      if (data?.metaDescription) {
        setMetaDescription(data.metaDescription);
        toast({
          title: "Meta description generated",
          description: "AI-optimized description created successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating meta description:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate meta description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSaveTemplate = (name: string) => {
    const newTemplate: HeaderTemplate = {
      id: `template-${Date.now()}`,
      name,
      contentType,
      headers: [...headers],
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleLoadTemplate = (template: HeaderTemplate) => {
    setHeaders(template.headers.map((h, i) => ({ ...h, id: `h-loaded-${i}` })));
  };

  const maxTitleLength = 60;
  const titleProgress = (seoTitle.length / maxTitleLength) * 100;
  const isTitleOptimal = seoTitle.length >= 50 && seoTitle.length <= 60;

  const maxDescLength = 155;
  const descProgress = (metaDescription.length / maxDescLength) * 100;
  const isDescOptimal = metaDescription.length >= 120 && metaDescription.length <= 155;

  return (
    <section className={cn(
      "animate-fade-in",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Section Header */}
      <div className="flex items-center gap-3 py-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
          5
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Optimized Structure
        </span>
      </div>

      {/* URL Slug Row */}
      <div className="flex items-center gap-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2 w-24 flex-shrink-0">
          <Link className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Slug</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-muted-foreground/60">/blog/</span>
          <input
            type="text"
            value={urlSlug}
            onChange={(e) => setUrlSlug(e.target.value)}
            className="flex-1 bg-transparent text-sm font-mono focus:outline-none"
            placeholder="url-slug"
          />
        </div>
        <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
          <Sparkles className="w-3 h-3" />
          Auto
        </button>
        {urlSlug && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
      </div>

      {/* SEO Title Row */}
      <div className="py-3 border-b border-border/30">
        <div className="flex items-center gap-4">
          <div className="w-24 flex-shrink-0">
            <span className="text-xs text-muted-foreground">Title</span>
          </div>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
            placeholder="SEO Title..."
          />
          <span className={cn(
            "text-[10px] font-mono",
            isTitleOptimal ? "text-success" : titleProgress > 100 ? "text-destructive" : "text-muted-foreground"
          )}>
            {seoTitle.length}/{maxTitleLength}
          </span>
          {isTitleOptimal && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
        </div>

        {/* Title Progress */}
        <div className="mt-2 ml-28 h-0.5 rounded-full bg-muted overflow-hidden max-w-xs">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-300",
              isTitleOptimal ? "bg-success" : titleProgress > 100 ? "bg-destructive" : "bg-primary/50"
            )}
            style={{ width: `${Math.min(titleProgress, 100)}%` }}
          />
        </div>

        {/* Alt Titles */}
        <div className="mt-3 ml-28 space-y-1">
          {titleSuggestions.slice(1).map((s, i) => (
            <button
              key={i}
              onClick={() => { setSeoTitle(s.title); setSelectedTitleIndex(i + 1); }}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="w-3 h-3 rounded-full border border-muted-foreground/30" />
              <span className="truncate max-w-md">{s.title}</span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full bg-muted", s.isOptimal && "text-success")}>{s.score}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meta Description Row */}
      <div className="py-3 border-b border-border/30">
        <div className="flex items-start gap-4">
          <div className="w-24 flex-shrink-0 pt-1">
            <span className="text-xs text-muted-foreground">Meta Desc</span>
          </div>
          <div className="flex-1">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[60px]"
              placeholder="Write a compelling meta description (120-155 characters)..."
              rows={2}
            />
            {/* Description Progress */}
            <div className="mt-2 h-0.5 rounded-full bg-muted overflow-hidden max-w-xs">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isDescOptimal ? "bg-success" : descProgress > 100 ? "bg-destructive" : "bg-primary/50"
                )}
                style={{ width: `${Math.min(descProgress, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateMetaDescription}
              disabled={isGeneratingDesc}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {isGeneratingDesc ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Auto
            </button>
            <span className={cn(
              "text-[10px] font-mono",
              isDescOptimal ? "text-success" : descProgress > 100 ? "text-destructive" : "text-muted-foreground"
            )}>
              {metaDescription.length}/{maxDescLength}
            </span>
            {isDescOptimal && <div className="w-1.5 h-1.5 rounded-full bg-success" />}
          </div>
        </div>
        <p className="mt-2 ml-28 text-[10px] text-muted-foreground/60">
          Include primary keyword naturally. Aim for 120-155 characters for optimal display.
        </p>
      </div>

      {/* Headers */}
      <div className="py-3 border-b border-border/30">
        <button
          onClick={() => setExpandedHeaders(!expandedHeaders)}
          className="flex items-center gap-4 w-full"
        >
          <div className="w-24 flex-shrink-0 flex items-center gap-2">
            {expandedHeaders ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">Headers</span>
          </div>
          <span className="text-xs text-muted-foreground/60">{headers.filter(h => h.isOptimized).length}/{headers.length} optimized</span>
        </button>

        {expandedHeaders && (
          <div className="mt-3">
            <EditableHeadersPanel
              headers={headers}
              onHeadersChange={setHeaders}
              templates={templates}
              onSaveTemplate={handleSaveTemplate}
              onLoadTemplate={handleLoadTemplate}
              contentType={contentType}
            />
          </div>
        )}
      </div>

      {/* Schema Toggle (for FAQ) */}
      {contentType === 'faq' && (
        <div className="flex items-center justify-between py-3 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="w-24 flex-shrink-0">
              <span className="text-xs text-muted-foreground">Schema</span>
            </div>
            <span className="text-sm">FAQ Schema</span>
          </div>
          <button
            onClick={() => setSchemaEnabled(!schemaEnabled)}
            className={cn(
              "relative w-9 h-5 rounded-full transition-colors",
              schemaEnabled ? "bg-foreground" : "bg-muted"
            )}
          >
            <div className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform",
              schemaEnabled ? "translate-x-4" : "translate-x-0.5"
            )} />
          </button>
        </div>
      )}

      {/* Generate CTA */}
      <div className="flex justify-end pt-6">
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Generate Content
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
