import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  Clock, 
  Zap, 
  Flame, 
  ArrowRight, 
  Code, 
  HelpCircle,
  Wand2,
  CheckCircle
} from "lucide-react";
import { Recommendation } from './types';

interface ActionCardProps {
  recommendation: Recommendation;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onOpenStudio: (templateId: string) => void;
}

export const ActionCard = ({ 
  recommendation, 
  isCompleted, 
  onToggleComplete,
  onOpenStudio 
}: ActionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getEffortIndicator = (effort: 'Low' | 'Medium' | 'High') => {
    switch (effort) {
      case 'Low':
        return (
          <div className="flex items-center gap-1.5 text-success">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Low effort</span>
          </div>
        );
      case 'Medium':
        return (
          <div className="flex items-center gap-1.5 text-warning">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Medium effort</span>
          </div>
        );
      case 'High':
        return (
          <div className="flex items-center gap-1.5 text-destructive">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">High effort</span>
          </div>
        );
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card 
        className={`transition-all duration-200 hover:shadow-md border-border/60 ${
          isCompleted ? 'bg-success/5 border-success/30' : 'bg-card'
        }`}
      >
        <CollapsibleTrigger className="w-full text-left">
          <CardContent className="p-4">
            {/* Top Row */}
            <div className="flex items-start gap-3">
              <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={isCompleted}
                  onCheckedChange={() => onToggleComplete(recommendation.id)}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {recommendation.plainTitle}
                  </h3>
                  {recommendation.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-[10px] px-1.5 py-0 h-5 bg-muted/60"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Middle Section */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Impact:</span>
                    <span className="text-xs font-medium text-primary">{recommendation.businessImpact}</span>
                  </div>
                  {getEffortIndicator(recommendation.effort)}
                </div>

                {/* What to Change */}
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {recommendation.whatToChange}
                </p>

                {recommendation.contextNote && (
                  <p className="text-xs text-primary/80 mt-1.5 italic">
                    {recommendation.contextNote}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold text-success">+{recommendation.aiVisibilityIncrease}%</div>
                  <div className="text-[10px] text-muted-foreground">visibility</div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">
            <div className="ml-7 pt-3 border-t border-border/40 space-y-4">
              {/* Why This Matters */}
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Why this matters for AI search</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {recommendation.whyItMatters}
                </p>
              </div>

              {/* Technical Details */}
              {recommendation.technicalDetails && (
                <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Code className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">Technical view</span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
                    {recommendation.technicalDetails.currentTitle && (
                      <div>
                        <span className="text-foreground/70">Title: </span>
                        {recommendation.technicalDetails.currentTitle}
                      </div>
                    )}
                    {recommendation.technicalDetails.currentH1 && (
                      <div>
                        <span className="text-foreground/70">H1: </span>
                        {recommendation.technicalDetails.currentH1}
                      </div>
                    )}
                    {recommendation.technicalDetails.currentUrl && (
                      <div>
                        <span className="text-foreground/70">URL: </span>
                        {recommendation.technicalDetails.currentUrl}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {recommendation.contentStudioTemplate ? (
                  <Button 
                    size="sm" 
                    className="h-8 text-xs bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStudio(recommendation.contentStudioTemplate!);
                    }}
                  >
                    <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                    Open in Content Studio
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(recommendation.id);
                    }}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    {isCompleted ? 'Mark incomplete' : 'Mark as done'}
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  Snooze
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
