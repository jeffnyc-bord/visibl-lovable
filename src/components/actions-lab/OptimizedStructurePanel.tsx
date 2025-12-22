import { useState, useEffect } from 'react';
import { Sparkles, Check, ChevronDown, ChevronRight, Link, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentType } from './ContentTypeSelector';
import { PromptSource } from './PromptSourceSelector';

interface TitleSuggestion {
  title: string;
  score: number;
  isOptimal: boolean;
}

interface HeaderItem {
  level: 'h1' | 'h2' | 'h3';
  text: string;
  isOptimized: boolean;
}

interface OptimizedStructure {
  urlSlug: string;
  seoTitle: string;
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

export const OptimizedStructurePanel = ({
  contentType,
  prompt,
  onStructureChange,
  onGenerate,
}: OptimizedStructurePanelProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [urlSlug, setUrlSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(0);
  const [schemaEnabled, setSchemaEnabled] = useState(contentType === 'faq');
  const [expandedHeaders, setExpandedHeaders] = useState(true);

  const titleSuggestions: TitleSuggestion[] = [
    { title: `${prompt.prompt} - Complete Guide for 2024`, score: 94, isOptimal: true },
    { title: `${prompt.prompt}: Expert Analysis & Recommendations`, score: 88, isOptimal: false },
    { title: `Understanding ${prompt.prompt} - What You Need to Know`, score: 82, isOptimal: false },
  ];

  const headers: HeaderItem[] = contentType === 'faq' 
    ? [
        { level: 'h1', text: `FAQ: ${prompt.prompt.slice(0, 40)}`, isOptimized: true },
        { level: 'h2', text: 'What are the key differences?', isOptimized: true },
        { level: 'h2', text: 'Which option is best for beginners?', isOptimized: true },
        { level: 'h2', text: 'What do experts recommend?', isOptimized: false },
      ]
    : contentType === 'comparison'
    ? [
        { level: 'h1', text: `${prompt.prompt.slice(0, 50)}`, isOptimized: true },
        { level: 'h2', text: 'Quick Comparison', isOptimized: true },
        { level: 'h2', text: 'Feature Breakdown', isOptimized: true },
        { level: 'h3', text: 'Performance', isOptimized: true },
        { level: 'h2', text: 'Our Verdict', isOptimized: true },
      ]
    : [
        { level: 'h1', text: `${prompt.prompt.slice(0, 50)}`, isOptimized: true },
        { level: 'h2', text: 'Introduction', isOptimized: true },
        { level: 'h2', text: 'Key Insights', isOptimized: true },
        { level: 'h2', text: 'Recommendations', isOptimized: true },
      ];

  useEffect(() => {
    setIsVisible(true);
    const slug = prompt.prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
    setUrlSlug(slug);
    setSeoTitle(titleSuggestions[0].title);
  }, [prompt]);

  const maxTitleLength = 60;
  const titleProgress = (seoTitle.length / maxTitleLength) * 100;
  const isTitleOptimal = seoTitle.length >= 50 && seoTitle.length <= 60;

  return (
    <section className={cn(
      "animate-fade-in",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Section Header */}
      <div className="flex items-center gap-3 py-3">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
          3
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
          <div className="mt-2 ml-28 space-y-1">
            {headers.map((h, i) => (
              <div key={i} className={cn(
                "flex items-center gap-2 text-sm",
                h.level === 'h2' && "pl-3",
                h.level === 'h3' && "pl-6 text-muted-foreground"
              )}>
                <span className="text-[9px] font-mono uppercase text-muted-foreground/60 w-5">{h.level}</span>
                <span className="truncate">{h.text}</span>
                {h.isOptimized && <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />}
              </div>
            ))}
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
