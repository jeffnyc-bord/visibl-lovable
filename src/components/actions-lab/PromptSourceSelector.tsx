import { useState } from 'react';
import { ChevronRight, Zap, Check, ChevronDown } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="relative">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
            <Zap className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Source — Prompt Blast Lab
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          !isExpanded && "-rotate-90"
        )} />
      </button>

      {/* List View */}
      {isExpanded && (
        <div className="divide-y divide-border/40">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt)}
              className={cn(
                "w-full flex items-center gap-4 py-3 px-1 text-left transition-colors duration-150 group",
                "hover:bg-muted/30",
                selectedPrompt?.id === prompt.id && "bg-primary/5"
              )}
            >
              {/* Radio Circle */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                selectedPrompt?.id === prompt.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
              )}>
                {selectedPrompt?.id === prompt.id && (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                )}
              </div>

              {/* Prompt Text */}
              <span className={cn(
                "flex-1 text-sm line-clamp-1",
                selectedPrompt?.id === prompt.id ? "text-foreground font-medium" : "text-foreground/80"
              )}>
                {prompt.prompt}
              </span>

              {/* Metadata */}
              <span className="text-xs text-muted-foreground hidden sm:block">
                {prompt.mentions} mentions
              </span>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                prompt.sentiment === 'positive' && "text-success",
                prompt.sentiment === 'neutral' && "text-muted-foreground",
                prompt.sentiment === 'negative' && "text-destructive"
              )}>
                {prompt.sentiment}
              </span>

              <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Thin Divider */}
      <div className="mt-4 border-t border-border/30" />
    </section>
  );
};
