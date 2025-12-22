import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface FidelityMeterProps {
  current: number;
  max: number;
  label?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export const FidelityMeter = ({
  current,
  max,
  label = "Fidelity",
  description,
  onClick,
  className,
}: FidelityMeterProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  const isLow = percentage < 50;
  const isMedium = percentage >= 50 && percentage < 80;
  
  const getStatusLabel = () => {
    if (percentage >= 80) return "High Fidelity";
    if (percentage >= 50) return "Moderate";
    return "Low Confidence";
  };

  const getStatusColor = () => {
    if (percentage >= 80) return "text-foreground";
    if (percentage >= 50) return "text-muted-foreground";
    return "text-muted-foreground/70";
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      {/* Gauge visualization */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          {/* Background arc */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted/30"
            strokeDasharray="66 100"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={cn(
              "transition-all duration-500",
              percentage >= 80 ? "text-primary" : 
              percentage >= 50 ? "text-muted-foreground" : 
              "text-muted-foreground/50"
            )}
            strokeDasharray={`${percentage * 0.66} 100`}
            strokeLinecap="round"
          />
        </svg>
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-[10px] font-medium", getStatusColor())}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {(isLow || isMedium) && (
            <Info className="w-3 h-3 text-muted-foreground/60" />
          )}
        </div>
        <p className={cn("text-xs truncate", getStatusColor())}>
          {description || getStatusLabel()}
        </p>
      </div>

      {/* Subtle action indicator */}
      {onClick && (isLow || isMedium) && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-primary font-medium">Improve</span>
        </div>
      )}
    </div>
  );
};
