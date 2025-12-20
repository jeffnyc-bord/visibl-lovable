import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Separate into "This Week" (quick-wins) vs "Later" (foundations + advanced)
  const getThisWeekRecs = (category: TabType) => {
    return getFilteredRecommendations(category).filter(r => r.subcategory === 'quick-wins');
  };

  const getLaterRecs = (category: TabType) => {
    return getFilteredRecommendations(category).filter(r => r.subcategory !== 'quick-wins');
  };

  const completedCount = completedIds.length;
  const totalCount = recommendations.length;

  // Mock draft count - in real app, track which items have drafts
  const draftCount = 3;

  const tabConfig = [
    { id: 'on-site' as TabType, label: 'On-site AI & SEO', icon: Globe },
    { id: 'off-site' as TabType, label: 'Off-site & Authority', icon: Link2 },
    { id: 'pr-social' as TabType, label: 'PR & Social', icon: Megaphone },
  ];

  return (
    <div className={`space-y-4 ${demoMode ? 'demo-card-1' : ''}`}>
      {/* Strategy Overview - Hero Section */}
      <StrategyOverview 
        summary={strategySummary}
        kpis={strategyKPIs}
        onStartQuickWins={handleStartQuickWins}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Content Queue Bar */}
      <ContentQueueBar draftCount={draftCount} onViewDrafts={handleViewDrafts} />

      {/* Main Content */}
      <div ref={contentRef}>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          {/* Tabs + Filters Row */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <TabsList className="h-9 p-1 bg-muted/50 rounded-lg">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <FilterBar 
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Tab Content */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-6">
              {/* This Week */}
              <ActionGroup
                title="This week"
                subtitle="High-impact quick wins"
                recommendations={getThisWeekRecs(tab.id)}
                completedIds={completedIds}
                onToggleComplete={handleToggleComplete}
                onOpenStudio={handleOpenStudio}
                showStepNumbers={true}
                defaultExpanded={true}
                maxVisible={5}
              />

              {/* Later */}
              <ActionGroup
                title="Later"
                subtitle="Foundations & advanced"
                recommendations={getLaterRecs(tab.id)}
                completedIds={completedIds}
                onToggleComplete={handleToggleComplete}
                onOpenStudio={handleOpenStudio}
                showStepNumbers={false}
                defaultExpanded={true}
                maxVisible={4}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
