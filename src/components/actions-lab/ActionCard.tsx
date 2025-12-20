import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronRight, 
  Plus,
  Circle,
  FileEdit
} from "lucide-react";
import { Recommendation } from './types';

interface ActionCardProps {
  recommendation: Recommendation;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onOpenStudio: (templateId: string) => void;
  stepNumber?: number;
  isPriority?: boolean;
}

export const ActionCard = ({ 
  recommendation, 
  isCompleted, 
  onToggleComplete,
  onOpenStudio,
  stepNumber,
  isPriority = false
}: ActionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasContentTemplate = !!recommendation.contentStudioTemplate;

  // Effort as small colored dots
  const getEffortDots = (effort: 'Low' | 'Medium' | 'High') => {
    const count = effort === 'Low' ? 1 : effort === 'Medium' ? 2 : 3;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((i) => (
          <Circle 
            key={i} 
            className={`w-1.5 h-1.5 ${
              i <= count 
                ? effort === 'Low' ? 'fill-success text-success' 
                  : effort === 'Medium' ? 'fill-warning text-warning' 
                  : 'fill-destructive text-destructive'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div 
        className={`group transition-colors duration-200 ${
          isCompleted ? 'opacity-50' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Row */}
        <div className="flex items-center gap-4 py-3.5">
          {/* Checkbox / Step Number */}
          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {isPriority && stepNumber && !isCompleted ? (
              <div 
                className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => onToggleComplete(recommendation.id)}
              >
                {stepNumber}
              </div>
            ) : (
              <Checkbox 
                checked={isCompleted}
                onCheckedChange={() => onToggleComplete(recommendation.id)}
                className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4 className={`text-[15px] font-medium leading-snug tracking-tight ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {recommendation.plainTitle}
                </h4>
                
                {/* Metadata row */}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {recommendation.businessImpact}
                  </span>
                  {getEffortDots(recommendation.effort)}
                  <span className="text-xs font-medium text-success">
                    +{recommendation.aiVisibilityIncrease}%
                  </span>
                  {recommendation.hasDraft && (
                    <span className="inline-flex items-center gap-1 text-xs text-warning">
                      <FileEdit className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Actions - appear on hover */}
              <div className={`flex items-center gap-2 flex-shrink-0 transition-opacity duration-200 ${
                isHovered || isExpanded ? 'opacity-100' : 'opacity-0'
              }`}>
                {hasContentTemplate && !isCompleted && (
                  <button 
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStudio(recommendation.contentStudioTemplate!);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                    Create
                  </button>
                )}
                
                <CollapsibleTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
                    <ChevronRight 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
              
              {/* Always visible chevron when not hovered */}
              <div className={`flex-shrink-0 transition-opacity duration-200 ${
                isHovered || isExpanded ? 'opacity-0 w-0' : 'opacity-100'
              }`}>
                <CollapsibleTrigger asChild>
                  <button className="p-1.5">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="pl-10 pb-4 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {recommendation.whatToChange}
            </p>
            
            {recommendation.contextNote && (
              <p className="text-sm text-primary/70 italic">
                {recommendation.contextNote}
              </p>
            )}

            {/* Why this matters */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                Why this matters for AI
              </span>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                {recommendation.whyItMatters}
              </p>
            </div>

            {/* Technical Details */}
            {recommendation.technicalDetails && (
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                  Technical view
                </span>
                <div className="mt-1.5 space-y-0.5 text-xs font-mono text-muted-foreground">
                  {recommendation.technicalDetails.currentTitle && (
                    <div><span className="text-muted-foreground/50">Title:</span> {recommendation.technicalDetails.currentTitle}</div>
                  )}
                  {recommendation.technicalDetails.currentH1 && (
                    <div><span className="text-muted-foreground/50">H1:</span> {recommendation.technicalDetails.currentH1}</div>
                  )}
                  {recommendation.technicalDetails.currentUrl && (
                    <div><span className="text-muted-foreground/50">URL:</span> {recommendation.technicalDetails.currentUrl}</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center gap-3 pt-2">
              {!hasContentTemplate && !isCompleted && (
                <button 
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(recommendation.id);
                  }}
                >
                  Mark done
                </button>
              )}
              <button 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Snooze
              </button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
