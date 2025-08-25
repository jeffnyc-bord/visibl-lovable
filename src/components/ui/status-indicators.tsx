import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorsProps {
  visibleSections: number;
  totalSections: number;
  pendingTasks: number;
  isLoading?: boolean;
}

export function StatusIndicators({ 
  visibleSections, 
  totalSections, 
  pendingTasks, 
  isLoading = false 
}: StatusIndicatorsProps) {
  return (
    <div className="flex items-center gap-3">

      {/* Pending Tasks Indicator */}
      {pendingTasks > 0 && (
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <AlertCircle className="w-4 h-4 text-orange-500" />
          )}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              isLoading && "border-primary text-primary",
              !isLoading && "border-orange-500 text-orange-500"
            )}
          >
            {pendingTasks} {isLoading ? 'loading' : 'pending'}
          </Badge>
        </div>
      )}

      {/* Overall Status Dot */}
      <div className="flex items-center gap-2">
        <div 
          className={cn(
            "w-2 h-2 rounded-full",
            isLoading && "bg-primary animate-pulse",
            !isLoading && pendingTasks > 0 && "bg-orange-500",
            !isLoading && pendingTasks === 0 && "bg-green-500"
          )}
        />
        <span className="text-xs text-muted-foreground">
          {isLoading ? 'Loading' : pendingTasks > 0 ? 'Processing' : 'Ready'}
        </span>
      </div>
    </div>
  );
}