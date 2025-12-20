import { FileEdit, ArrowRight } from "lucide-react";

interface ContentQueueBarProps {
  draftCount: number;
  onViewDrafts: () => void;
}

export const ContentQueueBar = ({ draftCount, onViewDrafts }: ContentQueueBarProps) => {
  if (draftCount === 0) return null;

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40">
      <div className="flex items-center gap-2">
        <FileEdit className="w-4 h-4 text-warning" />
        <span className="text-sm text-foreground">
          <span className="font-medium">{draftCount} draft{draftCount !== 1 ? 's' : ''}</span>
          <span className="text-muted-foreground"> in Content Studio</span>
        </span>
      </div>
      <button 
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={onViewDrafts}
      >
        View drafts
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
