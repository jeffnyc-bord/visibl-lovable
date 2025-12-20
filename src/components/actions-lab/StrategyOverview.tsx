import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { StrategyKPI } from './types';

interface StrategyOverviewProps {
  summary: string;
  kpis: StrategyKPI[];
  onStartQuickWins: () => void;
  completedCount: number;
  totalCount: number;
}

export const StrategyOverview = ({ 
  summary, 
  kpis, 
  onStartQuickWins,
  completedCount,
  totalCount
}: StrategyOverviewProps) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-success" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-destructive" />;
      case 'stable':
        return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="mb-8">
      {/* Narrative */}
      <p className="text-muted-foreground text-[15px] leading-relaxed max-w-3xl">
        {summary}
      </p>

      {/* KPIs Row */}
      <div className="flex items-center gap-8 mt-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground tracking-tight">
              {kpi.score}
            </span>
            {getTrendIcon(kpi.trend)}
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {kpi.label}
            </span>
          </div>
        ))}
        
        {/* Progress */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
          
          <button 
            onClick={onStartQuickWins}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Start Quick Wins
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
