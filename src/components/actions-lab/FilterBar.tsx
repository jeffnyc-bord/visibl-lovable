import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Globe, Zap, Filter } from "lucide-react";
import { FilterState } from './types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  completedCount: number;
  totalCount: number;
  totalImpact: number;
}

export const FilterBar = ({ 
  filters, 
  onFilterChange, 
  completedCount, 
  totalCount,
  totalImpact 
}: FilterBarProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl bg-muted/30 border border-border/40">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        
        <Select 
          value={filters.goal} 
          onValueChange={(value) => onFilterChange({ ...filters, goal: value as FilterState['goal'] })}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs bg-background border-border/60">
            <Target className="w-3 h-3 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All goals</SelectItem>
            <SelectItem value="demos">More demos</SelectItem>
            <SelectItem value="calls">More calls</SelectItem>
            <SelectItem value="visits">More visits</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.channel} 
          onValueChange={(value) => onFilterChange({ ...filters, channel: value as FilterState['channel'] })}
        >
          <SelectTrigger className="h-8 w-[130px] text-xs bg-background border-border/60">
            <Globe className="w-3 h-3 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            <SelectItem value="site">Website</SelectItem>
            <SelectItem value="pr">PR</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.effort} 
          onValueChange={(value) => onFilterChange({ ...filters, effort: value as FilterState['effort'] })}
        >
          <SelectTrigger className="h-8 w-[110px] text-xs bg-background border-border/60">
            <Zap className="w-3 h-3 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Effort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All effort</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs bg-success/10 text-success px-2 py-1">
            {completedCount} of {totalCount} completed
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-primary">+{totalImpact}%</div>
          <div className="text-[10px] text-muted-foreground">potential impact</div>
        </div>
      </div>
    </div>
  );
};
