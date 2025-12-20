import { useState } from 'react';
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
  isPriorityGroup?: boolean;
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
  isPriorityGroup = false,
}: ActionGroupProps) => {
  const [showAll, setShowAll] = useState(false);

  const completedCount = recommendations.filter(r => completedIds.includes(r.id)).length;
  const displayedRecs = showAll ? recommendations : recommendations.slice(0, maxVisible);
  const hasMore = recommendations.length > maxVisible;

  if (recommendations.length === 0) return null;

  return (
    <div className={`${isPriorityGroup ? 'bg-muted/30 -mx-6 px-6 py-4 rounded-2xl' : ''}`}>
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-2">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{recommendations.length} completed
        </span>
        {subtitle && (
          <span className="text-xs text-muted-foreground">· {subtitle}</span>
        )}
      </div>

      {/* List with dividers */}
      <div className="divide-y divide-border/60">
        {displayedRecs.map((rec, index) => (
          <ActionCard
            key={rec.id}
            recommendation={rec}
            isCompleted={completedIds.includes(rec.id)}
            onToggleComplete={onToggleComplete}
            onOpenStudio={onOpenStudio}
            stepNumber={showStepNumbers && !completedIds.includes(rec.id) ? index + 1 : undefined}
            isPriority={isPriorityGroup && showStepNumbers}
          />
        ))}
      </div>
      
      {hasMore && (
        <button
          className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `View ${recommendations.length - maxVisible} more`}
        </button>
      )}
    </div>
  );
};
