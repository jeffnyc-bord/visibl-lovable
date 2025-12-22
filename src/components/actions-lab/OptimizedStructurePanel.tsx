import { useState, useEffect } from 'react';
import { Sparkles, Check, AlertCircle, ChevronDown, ChevronRight, ToggleLeft, ToggleRight, Hash, Link } from 'lucide-react';
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
  const [schemaEnabled, setSchemaEnabled] = useState(contentType === 'faq' || contentType === 'review');
  const [ratingEnabled, setRatingEnabled] = useState(contentType === 'review');
  const [expandedHeaders, setExpandedHeaders] = useState(true);

  // Generate mock structure based on prompt and content type
  const titleSuggestions: TitleSuggestion[] = [
    { 
      title: `${prompt.prompt} - Complete Guide for 2024`, 
      score: 94, 
      isOptimal: true 
    },
    { 
      title: `${prompt.prompt}: Expert Analysis & Recommendations`, 
      score: 88, 
      isOptimal: false 
    },
    { 
      title: `Understanding ${prompt.prompt} - What You Need to Know`, 
      score: 82, 
      isOptimal: false 
    },
  ];

  const headers: HeaderItem[] = contentType === 'faq' 
    ? [
        { level: 'h1', text: `Frequently Asked Questions: ${prompt.prompt.slice(0, 40)}...`, isOptimized: true },
        { level: 'h2', text: 'What are the key differences?', isOptimized: true },
        { level: 'h2', text: 'Which option is best for beginners?', isOptimized: true },
        { level: 'h2', text: 'What do experts recommend?', isOptimized: false },
        { level: 'h2', text: 'How to make the right choice?', isOptimized: true },
      ]
    : contentType === 'comparison'
    ? [
        { level: 'h1', text: `${prompt.prompt.slice(0, 50)}...`, isOptimized: true },
        { level: 'h2', text: 'Quick Comparison Overview', isOptimized: true },
        { level: 'h2', text: 'Feature-by-Feature Breakdown', isOptimized: true },
        { level: 'h3', text: 'Performance Metrics', isOptimized: true },
        { level: 'h3', text: 'Value for Money', isOptimized: false },
        { level: 'h2', text: 'Our Verdict', isOptimized: true },
      ]
    : [
        { level: 'h1', text: `${prompt.prompt.slice(0, 50)}...`, isOptimized: true },
        { level: 'h2', text: 'Introduction', isOptimized: true },
        { level: 'h2', text: 'Key Insights', isOptimized: true },
        { level: 'h3', text: 'Market Analysis', isOptimized: false },
        { level: 'h2', text: 'Recommendations', isOptimized: true },
        { level: 'h2', text: 'Conclusion', isOptimized: true },
      ];

  useEffect(() => {
    setIsVisible(true);
    // Auto-generate URL slug from prompt
    const slug = prompt.prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
    setUrlSlug(slug);
    setSeoTitle(titleSuggestions[0].title);
  }, [prompt]);

  const maxTitleLength = 60;
  const titleProgress = (seoTitle.length / maxTitleLength) * 100;
  const isTitleOptimal = seoTitle.length >= 50 && seoTitle.length <= 60;

  return (
    <section 
      className={cn(
        "relative transition-all duration-500",
        isVisible 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 translate-x-8"
      )}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 mt-6">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          3
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Optimized Structure
          </h3>
          <p className="text-sm text-foreground font-medium">Configure your content outline</p>
        </div>
      </div>

      {/* Code Editor Style Container */}
      <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
        {/* URL Slug Field */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Link className="w-4 h-4 text-muted-foreground" />
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              URL Slug
            </label>
            <button className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
              <Sparkles className="w-3 h-3" />
              Auto-generate
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/blog/</span>
            <input
              type="text"
              value={urlSlug}
              onChange={(e) => setUrlSlug(e.target.value)}
              className="flex-1 bg-background/50 border border-border/40 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              placeholder="url-slug-here"
            />
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                urlSlug.length > 0 ? "bg-success" : "bg-muted-foreground/30"
              )} />
              <span className="text-xs text-muted-foreground">
                {urlSlug.length > 0 ? 'SEO Optimized' : 'Enter slug'}
              </span>
            </div>
          </div>
        </div>

        {/* SEO Title Field with Character Meter */}
        <div className="border-b border-border/40 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              SEO Title
            </label>
          </div>
          
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full bg-background/50 border border-border/40 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="Your SEO-optimized title..."
          />

          {/* Character Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isTitleOptimal ? "bg-success" : titleProgress > 100 ? "bg-destructive" : "bg-warning"
                )}
                style={{ width: `${Math.min(titleProgress, 100)}%` }}
              />
            </div>
            <span className={cn(
              "text-xs font-mono",
              isTitleOptimal ? "text-success" : titleProgress > 100 ? "text-destructive" : "text-muted-foreground"
            )}>
              {seoTitle.length}/{maxTitleLength}
            </span>
            {isTitleOptimal && (
              <div className="flex items-center gap-1 text-success">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs">Optimal</span>
              </div>
            )}
          </div>

          {/* Title Stack */}
          <div className="mt-4">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              Suggested alternatives
            </span>
            <div className="space-y-1">
              {titleSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSeoTitle(suggestion.title);
                    setSelectedTitleIndex(index);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200",
                    selectedTitleIndex === index
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedTitleIndex === index
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}>
                    {selectedTitleIndex === index && (
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    )}
                  </div>
                  <span className={cn(
                    "flex-1 text-sm truncate",
                    selectedTitleIndex === index ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {suggestion.title}
                  </span>
                  <span className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded-full",
                    suggestion.isOptimal 
                      ? "bg-success/10 text-success" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {suggestion.score}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Headers Hierarchy */}
        <div className="p-4">
          <button
            onClick={() => setExpandedHeaders(!expandedHeaders)}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-3">
              {expandedHeaders ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Headers (H1, H2, H3)
              </label>
            </div>
            <span className="text-xs text-muted-foreground">
              {headers.filter(h => h.isOptimized).length}/{headers.length} optimized
            </span>
          </button>

          {expandedHeaders && (
            <div className="space-y-1 pl-4 border-l-2 border-border/40 ml-2">
              {headers.map((header, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors",
                    header.level === 'h1' && "font-semibold text-foreground",
                    header.level === 'h2' && "text-foreground/90 pl-4",
                    header.level === 'h3' && "text-muted-foreground pl-8 text-sm"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded",
                    header.level === 'h1' && "bg-primary/10 text-primary",
                    header.level === 'h2' && "bg-muted text-muted-foreground",
                    header.level === 'h3' && "bg-muted/50 text-muted-foreground/70"
                  )}>
                    {header.level}
                  </span>
                  <span className="flex-1 truncate">{header.text}</span>
                  {header.isOptimized && (
                    <div className="w-2 h-2 rounded-full bg-success" title="SEO Optimized" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type-Specific Fields */}
        {(contentType === 'faq' || contentType === 'review') && (
          <div className="border-t border-border/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {schemaEnabled ? (
                  <ToggleRight className="w-5 h-5 text-primary" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {contentType === 'faq' ? 'FAQ Schema Markup' : 'Review Schema'}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Enable rich snippets in search results
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSchemaEnabled(!schemaEnabled)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors duration-200",
                  schemaEnabled ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                  schemaEnabled ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>

            {contentType === 'review' && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  {ratingEnabled ? (
                    <ToggleRight className="w-5 h-5 text-primary" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      Star Rating Component
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Add interactive rating display
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRatingEnabled(!ratingEnabled)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors duration-200",
                    ratingEnabled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                    ratingEnabled ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          Generate Content
        </button>
      </div>
    </section>
  );
};
