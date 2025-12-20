import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Zap, Layers, Rocket } from "lucide-react";
import { ActionCard } from './ActionCard';
import { Recommendation, SubcategoryType } from './types';

interface CategorySectionProps {
  title: string;
  subcategory: SubcategoryType;
  recommendations: Recommendation[];
  completedIds: string[];
  onToggleComplete: (id: string) => void;
  onOpenStudio: (templateId: string) => void;
  defaultExpanded?: boolean;
}

export const CategorySection = ({
  title,
  subcategory,
  recommendations,
  completedIds,
  onToggleComplete,
  onOpenStudio,
  defaultExpanded = true,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  const getIcon = () => {
    switch (subcategory) {
      case 'quick-wins':
        return <Zap className="w-4 h-4 text-success" />;
      case 'foundations':
        return <Layers className="w-4 h-4 text-primary" />;
      case 'advanced':
        return <Rocket className="w-4 h-4 text-warning" />;
    }
  };

  const getDescription = () => {
    switch (subcategory) {
      case 'quick-wins':
        return 'High-impact actions you can complete this week';
      case 'foundations':
        return 'Essential building blocks for AI visibility';
      case 'advanced':
        return 'Complex optimizations for maximum impact';
    }
  };

  const completedCount = recommendations.filter(r => completedIds.includes(r.id)).length;
  const displayedRecs = showAll ? recommendations : recommendations.slice(0, 4);
  const hasMore = recommendations.length > 4;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] px-1.5 ${
                      completedCount === recommendations.length 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted'
                    }`}
                  >
                    {completedCount}/{recommendations.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{getDescription()}</p>
              </div>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {displayedRecs.map((rec) => (
              <ActionCard
                key={rec.id}
                recommendation={rec}
                isCompleted={completedIds.includes(rec.id)}
                onToggleComplete={onToggleComplete}
                onOpenStudio={onOpenStudio}
              />
            ))}
            
            {hasMore && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAll(!showAll);
                }}
              >
                {showAll ? 'Show less' : `View ${recommendations.length - 4} more actions`}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
