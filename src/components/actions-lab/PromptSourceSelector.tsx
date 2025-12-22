import { useState } from 'react';
import { ChevronRight, Sparkles, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PromptSource {
  id: string;
  prompt: string;
  fullPrompt: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  platforms: string[];
  lastTested: string;
}

interface PromptSourceSelectorProps {
  prompts: PromptSource[];
  selectedPrompt: PromptSource | null;
  onSelectPrompt: (prompt: PromptSource) => void;
}

export const PromptSourceSelector = ({
  prompts,
  selectedPrompt,
  onSelectPrompt,
}: PromptSourceSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Source
          </h3>
          <p className="text-sm text-foreground font-medium">From Prompt Blast Lab</p>
        </div>
      </div>

      {/* Horizontal Scroller */}
      <div className="relative">
        {/* Scroll Container */}
        <div 
          className={cn(
            "flex gap-3 overflow-x-auto pb-2 scrollbar-none",
            !isExpanded && "max-w-full"
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt)}
              className={cn(
                "group relative flex-shrink-0 min-w-[280px] max-w-[320px] p-4 rounded-xl border transition-all duration-300",
                "hover:border-primary/30 hover:bg-muted/30",
                selectedPrompt?.id === prompt.id
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border/60 bg-background"
              )}
            >
              {/* Selection Indicator */}
              {selectedPrompt?.id === prompt.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}

              {/* Prompt Text */}
              <p className="text-sm font-medium text-foreground text-left line-clamp-2 pr-6">
                {prompt.prompt}
              </p>

              {/* Metadata Row */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-muted-foreground">
                  {prompt.mentions} mentions
                </span>
                <span className="text-[10px] text-muted-foreground/60">•</span>
                <span className={cn(
                  "text-xs font-medium",
                  prompt.sentiment === 'positive' && "text-success",
                  prompt.sentiment === 'neutral' && "text-muted-foreground",
                  prompt.sentiment === 'negative' && "text-destructive"
                )}>
                  {prompt.sentiment}
                </span>
                <span className="text-[10px] text-muted-foreground/60">•</span>
                <span className="text-xs text-muted-foreground">
                  {prompt.platforms.length} platforms
                </span>
              </div>

              {/* Hover Arrow */}
              <ChevronRight className={cn(
                "absolute right-3 bottom-4 w-4 h-4 text-muted-foreground/40 transition-all duration-200",
                "group-hover:text-primary group-hover:translate-x-0.5",
                selectedPrompt?.id === prompt.id && "text-primary"
              )} />
            </button>
          ))}

          {/* View All Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 min-w-[120px] flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border/60 hover:border-primary/30 hover:bg-muted/20 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-muted-foreground/60" />
            <span className="text-xs font-medium text-muted-foreground">
              View All
            </span>
          </button>
        </div>

        {/* Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* Divider */}
      <div className="mt-6 border-t border-border/40" />
    </section>
  );
};
