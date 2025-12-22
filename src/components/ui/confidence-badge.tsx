import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
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
    <Badge
      variant="outline"
      onClick={onClick}
      className={cn(
        "gap-1 text-[10px] font-normal cursor-pointer",
        "bg-muted/30 border-border/50 text-muted-foreground",
        "hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
        "transition-all duration-200",
        className
      )}
    >
      <Info className="w-2.5 h-2.5" />
      <span>Low Confidence</span>
      <span className="text-muted-foreground/60">·</span>
      <span>Add {neededPrompts} more probes</span>
    </Badge>
  );
};
