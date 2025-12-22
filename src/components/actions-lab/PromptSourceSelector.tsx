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
  disabled?: boolean;
  stepNumber?: number;
}

export const PromptSourceSelector = ({
  prompts,
  selectedPrompt,
  onSelectPrompt,
  disabled = false,
  stepNumber = 2,
}: PromptSourceSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className={cn(
      "relative transition-all duration-300 ease-out",
      disabled && "opacity-40 pointer-events-none"
    )}>
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold transition-colors",
            selectedPrompt 
              ? "bg-foreground text-background" 
              : "bg-muted text-muted-foreground"
          )}>
            {selectedPrompt ? <Check className="w-3 h-3" /> : stepNumber}
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Select Prompt
          </span>
          {selectedPrompt && (
            <span className="text-xs text-foreground/60 normal-case tracking-normal">
              — {selectedPrompt.prompt.slice(0, 30)}...
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          !isExpanded && "-rotate-90"
        )} />
      </button>

      {/* List View */}
      {isExpanded && (
        <div className="divide-y divide-border/40 animate-fade-in">
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
                  ? "border-foreground bg-foreground"
                  : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
              )}>
                {selectedPrompt?.id === prompt.id && (
                  <Check className="w-2.5 h-2.5 text-background" />
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
