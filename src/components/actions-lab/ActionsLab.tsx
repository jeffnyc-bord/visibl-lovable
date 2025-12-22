import { useState, useRef } from 'react';
import { Globe, Link2, Megaphone, Zap, LayoutList, Clock, CheckCircle2 } from "lucide-react";
import { StrategyOverview } from './StrategyOverview';
import { FilterBar } from './FilterBar';
import { ActionGroup } from './ActionGroup';
import { ContentQueueBar } from './ContentQueueBar';
import { ContentGenerationWorkflow } from './ContentGenerationWorkflow';
import { recommendations, strategyKPIs, strategySummary } from './data';
import { FilterState, TabType, Recommendation } from './types';
import { toast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

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
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenStudio = (templateId: string) => {
    toast({ title: "Opening Content Studio", description: `Loading ${templateId} template...` });
  };

  const handleStartQuickWins = () => {
    setActiveTab('off-site');
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDrafts = () => {
    toast({ title: "Content Studio", description: "Opening your drafts..." });
  };

  const getFilteredRecommendations = (category: TabType): Recommendation[] => {
    let filtered = recommendations.filter(r => r.category === category);
    if (filters.effort !== 'all') {
      filtered = filtered.filter(r => r.effort.toLowerCase() === filters.effort);
    }
    return filtered;
  };

  const getThisWeekRecs = (category: TabType) => 
    getFilteredRecommendations(category).filter(r => r.subcategory === 'quick-wins');

  const getLaterRecs = (category: TabType) => 
    getFilteredRecommendations(category).filter(r => r.subcategory !== 'quick-wins');

  const completedCount = completedIds.length;
  const totalCount = recommendations.length;
  const draftCount = 3;

  const tabConfig = [
    { id: 'on-site' as TabType, label: 'On-site Content', shortLabel: 'On-site', icon: Globe },
    { id: 'off-site' as TabType, label: 'Off-site & Authority', shortLabel: 'Off-site', icon: Link2 },
    { id: 'pr-social' as TabType, label: 'PR & Social', shortLabel: 'PR/Social', icon: Megaphone },
  ];

  const quickActions = [
    { icon: Zap, label: 'Quick Wins', count: getThisWeekRecs(activeTab).length },
    { icon: LayoutList, label: 'All Actions', count: recommendations.filter(r => r.category === activeTab).length },
    { icon: Clock, label: 'Snoozed', count: 0 },
    { icon: CheckCircle2, label: 'Completed', count: completedIds.length },
  ];

  return (
    <div className={`flex gap-6 ${demoMode ? 'demo-card-1' : ''}`}>
      {/* Glassmorphism Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-6 self-start">
        <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          {/* Navigation */}
          <nav className="p-3">
            <span className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
              Categories
            </span>
            <div className="mt-2 space-y-0.5">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.shortLabel}
                </button>
              ))}
            </div>
          </nav>

          <div className="mx-3 border-t border-border/40" />

          {/* Quick Actions (only for non-on-site tabs) */}
          {activeTab !== 'on-site' && (
            <>
              <nav className="p-3">
                <span className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                  Views
                </span>
                <div className="mt-2 space-y-0.5">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg transition-all duration-200"
                    >
                      <span className="flex items-center gap-2.5">
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </span>
                      {action.count > 0 && <span className="text-xs text-muted-foreground/60">{action.count}</span>}
                    </button>
                  ))}
                </div>
              </nav>
              <div className="mx-3 border-t border-border/40" />
            </>
          )}

          {/* Progress */}
          <div className="p-4">
            <div className="text-center">
              <div className="text-3xl font-semibold text-foreground tracking-tight">
                {Math.round((completedCount / totalCount) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {completedCount} of {totalCount} complete
              </div>
              <div className="w-full h-1 rounded-full bg-muted mt-3 overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Tabs */}
        <div ref={contentRef} className="lg:hidden flex items-center gap-1 border-b border-border/40 mb-6 overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                activeTab === tab.id
                  ? 'text-foreground border-foreground'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* On-site: Content Generation (default view) */}
        {activeTab === 'on-site' && (
          <>
            <div className="hidden lg:block mb-6">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">
                {tabConfig.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Generate AI-optimized content from your Prompt Blast Lab insights
              </p>
            </div>
            <ContentGenerationWorkflow demoMode={demoMode} />
          </>
        )}

        {/* Off-site & PR/Social: Actions View */}
        {activeTab !== 'on-site' && (
          <>
            <StrategyOverview 
              summary={strategySummary}
              kpis={strategyKPIs}
              onStartQuickWins={handleStartQuickWins}
              completedCount={completedCount}
              totalCount={totalCount}
            />

            <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">
                {tabConfig.find(t => t.id === activeTab)?.label}
              </h2>
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>

            <div className="lg:hidden mb-4">
              <FilterBar filters={filters} onFilterChange={setFilters} />
            </div>

            <ContentQueueBar draftCount={draftCount} onViewDrafts={handleViewDrafts} />

            <div className="mt-6 space-y-8">
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
          </>
        )}
      </div>
    </div>
  );
};