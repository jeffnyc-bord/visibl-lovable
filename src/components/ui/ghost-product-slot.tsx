import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface GhostProductSlotProps {
  onClick?: () => void;
  className?: string;
}

export const GhostProductSlot = ({ onClick, className }: GhostProductSlotProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between p-3 rounded-lg border border-dashed border-border/50 bg-muted/20",
        "cursor-pointer transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      {/* Dashed placeholder content */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md border border-dashed border-border/50 flex items-center justify-center bg-background/50">
          <Plus className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-24 rounded bg-muted/50" />
          <div className="h-2 w-16 rounded bg-muted/30" />
        </div>
      </div>

      {/* CTA text on hover */}
      <span className="text-xs text-muted-foreground/60 group-hover:text-primary transition-colors">
        Expand coverage
      </span>
    </div>
  );
};
