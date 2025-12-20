import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronRight, 
  Zap, 
  Clock, 
  Flame, 
  Wand2,
  FileEdit
} from "lucide-react";
import { Recommendation } from './types';

interface ActionCardProps {
  recommendation: Recommendation;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onOpenStudio: (templateId: string) => void;
  stepNumber?: number;
}

export const ActionCard = ({ 
  recommendation, 
  isCompleted, 
  onToggleComplete,
  onOpenStudio,
  stepNumber
}: ActionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getEffortBadge = (effort: 'Low' | 'Medium' | 'High') => {
    switch (effort) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-success">
            <Zap className="w-3 h-3" />
            Low
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-warning">
            <Clock className="w-3 h-3" />
            Med
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
            <Flame className="w-3 h-3" />
            High
          </span>
        );
    }
  };

  const hasContentTemplate = !!recommendation.contentStudioTemplate;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div 
        className={`group relative rounded-lg border transition-all ${
          isCompleted 
            ? 'bg-success/5 border-success/20' 
            : 'bg-card border-border/50 hover:border-border'
        }`}
      >
        {/* Main Row */}
        <div className="flex items-start gap-3 p-3">
          {/* Step Number / Checkbox */}
          <div className="flex-shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {stepNumber && !isCompleted ? (
              <div 
                className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center cursor-pointer"
                onClick={() => onToggleComplete(recommendation.id)}
              >
                {stepNumber}
              </div>
            ) : (
              <Checkbox 
                checked={isCompleted}
                onCheckedChange={() => onToggleComplete(recommendation.id)}
                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium leading-tight ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {recommendation.plainTitle}
                </h4>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-primary font-medium">
                    {recommendation.businessImpact}
                  </span>
                  <span className="text-border">·</span>
                  {getEffortBadge(recommendation.effort)}
                  <span className="text-border">·</span>
                  <span className="text-xs text-success font-medium">
                    +{recommendation.aiVisibilityIncrease}%
                  </span>
                </div>
              </div>

              {/* CTA / Expand */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {recommendation.hasDraft && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-warning/10 text-warning border-0">
                    <FileEdit className="w-3 h-3 mr-1" />
                    Draft
                  </Badge>
                )}
                
                {hasContentTemplate && !isCompleted && (
                  <Button 
                    size="sm" 
                    className="h-7 text-xs px-3 bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStudio(recommendation.contentStudioTemplate!);
                    }}
                  >
                    <Wand2 className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                )}
                
                <CollapsibleTrigger asChild>
                  <button className="p-1 hover:bg-muted/50 rounded transition-colors">
                    <ChevronRight 
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 ml-8 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {recommendation.whatToChange}
            </p>
            
            {recommendation.contextNote && (
              <p className="text-xs text-primary/80 italic">
                {recommendation.contextNote}
              </p>
            )}

            {/* Why this matters */}
            <div className="p-2.5 rounded-md bg-muted/40 border border-border/40">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Why this matters for AI
              </span>
              <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
                {recommendation.whyItMatters}
              </p>
            </div>

            {/* Technical Details */}
            {recommendation.technicalDetails && (
              <div className="p-2.5 rounded-md bg-muted/20 border border-border/30">
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                  Technical view
                </span>
                <div className="mt-1.5 space-y-1 text-xs font-mono text-muted-foreground">
                  {recommendation.technicalDetails.currentTitle && (
                    <div><span className="text-foreground/60">Title:</span> {recommendation.technicalDetails.currentTitle}</div>
                  )}
                  {recommendation.technicalDetails.currentH1 && (
                    <div><span className="text-foreground/60">H1:</span> {recommendation.technicalDetails.currentH1}</div>
                  )}
                  {recommendation.technicalDetails.currentUrl && (
                    <div><span className="text-foreground/60">URL:</span> {recommendation.technicalDetails.currentUrl}</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center gap-2 pt-1">
              {!hasContentTemplate && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(recommendation.id);
                  }}
                >
                  {isCompleted ? 'Mark incomplete' : 'Mark done'}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                className="h-7 text-xs text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                Snooze
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
