import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
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
        <button 
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            hasActiveFilters 
              ? 'text-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex items-center gap-2 mt-3 py-3 border-t border-border/40">
          <Select 
            value={filters.goal} 
            onValueChange={(value) => onFilterChange({ ...filters, goal: value as FilterState['goal'] })}
          >
            <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs border-0 bg-muted/50 hover:bg-muted transition-colors">
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
            <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs border-0 bg-muted/50 hover:bg-muted transition-colors">
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
            <SelectTrigger className="h-8 w-auto min-w-[90px] text-xs border-0 bg-muted/50 hover:bg-muted transition-colors">
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
            <button 
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onFilterChange({ goal: 'all', channel: 'all', effort: 'all' })}
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
