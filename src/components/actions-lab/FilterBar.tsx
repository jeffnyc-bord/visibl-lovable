import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, Globe, Zap, SlidersHorizontal, ChevronDown } from "lucide-react";
import { FilterState } from './types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterBar = ({ 
  filters, 
  onFilterChange
}: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = filters.goal !== 'all' || filters.channel !== 'all' || filters.effort !== 'all';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 text-xs gap-1.5 ${hasActiveFilters ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-muted/30 border border-border/40">
          <Select 
            value={filters.goal} 
            onValueChange={(value) => onFilterChange({ ...filters, goal: value as FilterState['goal'] })}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs bg-background border-border/60">
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
            <SelectTrigger className="h-8 w-[120px] text-xs bg-background border-border/60">
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
            <SelectTrigger className="h-8 w-[100px] text-xs bg-background border-border/60">
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

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs text-muted-foreground"
              onClick={() => onFilterChange({ goal: 'all', channel: 'all', effort: 'all' })}
            >
              Clear
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
