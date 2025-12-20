import { FileEdit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentQueueBarProps {
  draftCount: number;
  onViewDrafts: () => void;
}

export const ContentQueueBar = ({ draftCount, onViewDrafts }: ContentQueueBarProps) => {
  if (draftCount === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-warning/10 border border-warning/20">
      <div className="flex items-center gap-2">
        <FileEdit className="w-4 h-4 text-warning" />
        <span className="text-sm text-foreground">
          <span className="font-medium">{draftCount} draft{draftCount !== 1 ? 's' : ''}</span>
          <span className="text-muted-foreground"> in Content Studio from your action plan</span>
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 text-xs text-warning hover:text-warning hover:bg-warning/10 gap-1"
        onClick={onViewDrafts}
      >
        View drafts
        <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
};
