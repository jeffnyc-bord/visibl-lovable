import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ActionCard } from './ActionCard';
import { Recommendation } from './types';

interface ActionGroupProps {
  title: string;
  subtitle?: string;
  recommendations: Recommendation[];
  completedIds: string[];
  onToggleComplete: (id: string) => void;
  onOpenStudio: (templateId: string) => void;
  showStepNumbers?: boolean;
  defaultExpanded?: boolean;
  maxVisible?: number;
}

export const ActionGroup = ({
  title,
  subtitle,
  recommendations,
  completedIds,
  onToggleComplete,
  onOpenStudio,
  showStepNumbers = false,
  defaultExpanded = true,
  maxVisible = 5,
}: ActionGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);

  const completedCount = recommendations.filter(r => completedIds.includes(r.id)).length;
  const displayedRecs = showAll ? recommendations : recommendations.slice(0, maxVisible);
  const hasMore = recommendations.length > maxVisible;

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? '' : '-rotate-90'
          }`}
        />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{recommendations.length}
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">· {subtitle}</span>
        )}
      </button>

      {/* Cards */}
      {isExpanded && (
        <div className="space-y-1.5 pl-6">
          {displayedRecs.map((rec, index) => (
            <ActionCard
              key={rec.id}
              recommendation={rec}
              isCompleted={completedIds.includes(rec.id)}
              onToggleComplete={onToggleComplete}
              onOpenStudio={onOpenStudio}
              stepNumber={showStepNumbers && !completedIds.includes(rec.id) ? index + 1 : undefined}
            />
          ))}
          
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show less' : `View ${recommendations.length - maxVisible} more`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
