import { useState, useRef } from 'react';
import { Globe, Link2, Megaphone } from "lucide-react";
import { StrategyOverview } from './StrategyOverview';
import { FilterBar } from './FilterBar';
import { ActionGroup } from './ActionGroup';
import { ContentQueueBar } from './ContentQueueBar';
import { recommendations, strategyKPIs, strategySummary } from './data';
import { FilterState, TabType, Recommendation } from './types';
import { toast } from "@/hooks/use-toast";

interface ActionsLabProps {
  demoMode?: boolean;
}

export const ActionsLab = ({ demoMode = false }: ActionsLabProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('on-site');
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    goal: 'all',
    channel: 'all',
    effort: 'all',
  });
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggleComplete = (id: string) => {
    setCompletedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleOpenStudio = (templateId: string) => {
    toast({
      title: "Opening Content Studio",
      description: `Loading ${templateId} template...`,
    });
  };

  const handleStartQuickWins = () => {
    setActiveTab('on-site');
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDrafts = () => {
    toast({
      title: "Content Studio",
      description: "Opening your drafts...",
    });
  };

  const getFilteredRecommendations = (category: TabType): Recommendation[] => {
    let filtered = recommendations.filter(r => r.category === category);
    
    if (filters.effort !== 'all') {
      filtered = filtered.filter(r => r.effort.toLowerCase() === filters.effort);
    }
    
    return filtered;
  };

  const getThisWeekRecs = (category: TabType) => {
    return getFilteredRecommendations(category).filter(r => r.subcategory === 'quick-wins');
  };

  const getLaterRecs = (category: TabType) => {
    return getFilteredRecommendations(category).filter(r => r.subcategory !== 'quick-wins');
  };

  const completedCount = completedIds.length;
  const totalCount = recommendations.length;
  const draftCount = 3;

  const tabConfig = [
    { id: 'on-site' as TabType, label: 'On-site AI & SEO', icon: Globe },
    { id: 'off-site' as TabType, label: 'Off-site & Authority', icon: Link2 },
    { id: 'pr-social' as TabType, label: 'PR & Social', icon: Megaphone },
  ];

  return (
    <div className={`${demoMode ? 'demo-card-1' : ''}`}>
      {/* Strategy Overview */}
      <StrategyOverview 
        summary={strategySummary}
        kpis={strategyKPIs}
        onStartQuickWins={handleStartQuickWins}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Tabs Row */}
      <div ref={contentRef} className="flex items-center justify-between gap-4 border-b border-border/40 mb-6">
        <div className="flex items-center gap-1">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <FilterBar 
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* Content Queue */}
      <ContentQueueBar draftCount={draftCount} onViewDrafts={handleViewDrafts} />

      {/* Actions List */}
      <div className="mt-6 space-y-8">
        {/* This Week - Priority Group */}
        <ActionGroup
          title="This Week"
          subtitle="High-impact quick wins"
          recommendations={getThisWeekRecs(activeTab)}
          completedIds={completedIds}
          onToggleComplete={handleToggleComplete}
          onOpenStudio={handleOpenStudio}
          showStepNumbers={true}
          defaultExpanded={true}
          maxVisible={5}
          isPriorityGroup={true}
        />

        {/* Later */}
        <ActionGroup
          title="Later"
          subtitle="Foundations & advanced"
          recommendations={getLaterRecs(activeTab)}
          completedIds={completedIds}
          onToggleComplete={handleToggleComplete}
          onOpenStudio={handleOpenStudio}
          showStepNumbers={false}
          defaultExpanded={true}
          maxVisible={4}
          isPriorityGroup={false}
        />
      </div>
    </div>
  );
};
