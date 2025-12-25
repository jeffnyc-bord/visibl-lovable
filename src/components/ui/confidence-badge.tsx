import { cn } from "@/lib/utils";
import { Info, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfidenceBadgeProps {
  promptCount: number;
  minForHighConfidence?: number;
  onClick?: () => void;
  className?: string;
}

export const ConfidenceBadge = ({
  promptCount,
  minForHighConfidence = 10,
  onClick,
  className,
}: ConfidenceBadgeProps) => {
  const isLowConfidence = promptCount < minForHighConfidence;
  const neededPrompts = minForHighConfidence - promptCount;

  if (!isLowConfidence) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={cn(
          "gap-1 text-[10px] font-normal",
          "bg-muted/30 border-border/50 text-muted-foreground",
          className
        )}
      >
        <Info className="w-2.5 h-2.5" />
        <span>Low Confidence</span>
        <span className="text-muted-foreground/60">·</span>
        <span>Improve data integrity</span>
      </Badge>
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer group"
      >
        <span>Fix now</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
