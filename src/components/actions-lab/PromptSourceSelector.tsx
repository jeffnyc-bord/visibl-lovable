import { useState, useMemo } from 'react';
import { ChevronRight, Zap, Check, ChevronDown, Search, Plus, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredPrompts = useMemo(() => {
    if (!searchQuery.trim()) return prompts;
    const query = searchQuery.toLowerCase();
    return prompts.filter(
      (prompt) =>
        prompt.prompt.toLowerCase().includes(query) ||
        prompt.fullPrompt.toLowerCase().includes(query)
    );
  }, [prompts, searchQuery]);

  const hasPrompts = prompts.length > 0;
  const showSearch = prompts.length > 3;

  return (
    <section className={cn(
      "relative transition-all duration-300 ease-out",
      disabled && "opacity-40 pointer-events-none"
    )}>
      {/* Section Header */}
      <div className="flex items-center justify-between py-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 group"
        >
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
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )} />
        </button>

        {/* Search Input */}
        {showSearch && isExpanded && (
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs bg-muted/30 border-border/50 focus:border-primary/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {isExpanded && !hasPrompts && (
        <div className="py-12 flex flex-col items-center text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <MessageSquareText className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            No prompts yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mb-4">
            Create prompts in the Prompt Blast Lab to start generating AI-optimized content.
          </p>
          <Button
            onClick={() => navigate('/?tab=prompts')}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Prompt
          </Button>
        </div>
      )}

      {/* List View */}
      {isExpanded && hasPrompts && (
        <div className="divide-y divide-border/40 animate-fade-in">
          {filteredPrompts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No prompts match "{searchQuery}"
              </p>
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
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
            ))
          )}

          {/* Add Prompt Helper */}
          <button
            onClick={() => navigate('/?tab=prompts')}
            className="w-full flex items-center gap-2 py-3 px-1 text-left group hover:bg-muted/30 transition-colors"
          >
            <div className="w-4 h-4 flex-shrink-0" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Don't see your prompt?
            </span>
            <span className="text-sm text-primary font-medium group-hover:underline">
              Add it now →
            </span>
          </button>
        </div>
      )}

      {/* Thin Divider */}
      <div className="mt-4 border-t border-border/30" />
    </section>
  );
};
