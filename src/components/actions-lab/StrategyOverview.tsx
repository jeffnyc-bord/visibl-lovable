import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        return <TrendingUp className="w-3.5 h-3.5 text-success" />;
      case 'down':
        return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
      case 'stable':
        return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-primary';
    return 'text-destructive';
  };

  return (
    <div className="bg-gradient-to-br from-primary/8 via-background to-primary/4 rounded-2xl p-6 border border-primary/10">
      {/* Narrative + KPIs Row */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left: Narrative */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Right: KPIs */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className={`text-xl font-bold ${getScoreColor(kpi.score)}`}>
                  {kpi.score}
                </span>
                {getTrendIcon(kpi.trend)}
              </div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {kpi.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Row */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-primary/10">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{completedCount}</span> of {totalCount} high-impact actions completed
        </div>
        <Button 
          onClick={onStartQuickWins}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Zap className="w-3.5 h-3.5" />
          Start with Quick Wins
        </Button>
      </div>
    </div>
  );
};
