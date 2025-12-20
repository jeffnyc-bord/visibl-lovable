import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles } from "lucide-react";
import { StrategyKPI } from './types';

interface StrategyOverviewProps {
  summary: string;
  kpis: StrategyKPI[];
  onViewPlan: () => void;
}

export const StrategyOverview = ({ summary, kpis, onViewPlan }: StrategyOverviewProps) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold text-foreground">Strategy Overview</h2>
              <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi) => (
            <div 
              key={kpi.label} 
              className="p-4 rounded-xl bg-background/60 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </span>
                {getTrendIcon(kpi.trend)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(kpi.score)}`}>
                  {kpi.score}
                </span>
                <span className="text-sm text-muted-foreground">/100</span>
                {kpi.change && (
                  <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {kpi.trend === 'up' ? '+' : '-'}{kpi.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={onViewPlan}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          View your 14-day action plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
