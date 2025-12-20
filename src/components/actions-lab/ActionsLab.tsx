import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Link2, Megaphone } from "lucide-react";
import { StrategyOverview } from './StrategyOverview';
import { FilterBar } from './FilterBar';
import { CategorySection } from './CategorySection';
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
    // TODO: Navigate to content studio with template
  };

  const handleViewPlan = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFilteredRecommendations = (category: TabType): Recommendation[] => {
    let filtered = recommendations.filter(r => r.category === category);
    
    if (filters.effort !== 'all') {
      filtered = filtered.filter(r => r.effort.toLowerCase() === filters.effort);
    }
    
    return filtered;
  };

  const getRecommendationsBySubcategory = (category: TabType, subcategory: 'quick-wins' | 'foundations' | 'advanced') => {
    return getFilteredRecommendations(category).filter(r => r.subcategory === subcategory);
  };

  const totalImpact = recommendations.reduce((sum, r) => sum + r.aiVisibilityIncrease, 0);
  const completedCount = completedIds.length;
  const totalCount = recommendations.length;

  const tabConfig = [
    { id: 'on-site' as TabType, label: 'On-site AI & SEO', icon: Globe },
    { id: 'off-site' as TabType, label: 'Off-site & Authority', icon: Link2 },
    { id: 'pr-social' as TabType, label: 'PR & Social Visibility', icon: Megaphone },
  ];

  const subcategoryConfig = [
    { id: 'quick-wins' as const, title: 'Quick Wins' },
    { id: 'foundations' as const, title: 'Foundations' },
    { id: 'advanced' as const, title: 'Advanced' },
  ];

  return (
    <div className={`space-y-6 ${demoMode ? 'demo-card-1' : ''}`}>
      {/* Strategy Overview */}
      <StrategyOverview 
        summary={strategySummary}
        kpis={strategyKPIs}
        onViewPlan={handleViewPlan}
      />

      {/* Main Tabs */}
      <div ref={contentRef}>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-xl grid grid-cols-3 gap-1">
            {tabConfig.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 py-2.5 px-4 text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label.split(' ')[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Filter Bar */}
          <div className="mt-4">
            <FilterBar 
              filters={filters}
              onFilterChange={setFilters}
              completedCount={completedCount}
              totalCount={totalCount}
              totalImpact={totalImpact}
            />
          </div>

          {/* Tab Content */}
          {tabConfig.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4 space-y-4">
              {subcategoryConfig.map((subcat, index) => {
                const recs = getRecommendationsBySubcategory(tab.id, subcat.id);
                if (recs.length === 0) return null;
                
                return (
                  <CategorySection
                    key={subcat.id}
                    title={subcat.title}
                    subcategory={subcat.id}
                    recommendations={recs}
                    completedIds={completedIds}
                    onToggleComplete={handleToggleComplete}
                    onOpenStudio={handleOpenStudio}
                    defaultExpanded={index === 0}
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
