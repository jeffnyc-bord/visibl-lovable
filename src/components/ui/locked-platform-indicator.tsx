import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface LockedPlatformIndicatorProps {
  platformName: string;
  platformIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const LockedPlatformIndicator = ({
  platformName,
  platformIcon,
  onClick,
  className,
}: LockedPlatformIndicatorProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-muted/20 border border-dashed border-border/40",
        "cursor-pointer transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      {/* Platform icon with lock overlay */}
      <div className="relative">
        {platformIcon ? (
          <div className="w-6 h-6 opacity-40 grayscale">
            {platformIcon}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-muted/50" />
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-background flex items-center justify-center">
          <Lock className="w-2 h-2 text-muted-foreground/60" />
        </div>
      </div>

      {/* Platform name */}
      <span className="text-xs text-muted-foreground/60 group-hover:text-foreground/70 transition-colors">
        {platformName}
      </span>
    </div>
  );
};
