import { TrendingUp, Target, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustryRankingEmptyProps {
  onAddCompetitor: () => void;
}

export function IndustryRankingEmpty({ onAddCompetitor }: IndustryRankingEmptyProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 p-12">
      {/* Content */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Track Your Competition
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Monitor how your competitors rank in AI visibility. 
            Compare mentions, scores, and track position changes over time.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-2 w-full max-w-sm text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Real-time Rankings</p>
              <p className="text-xs text-muted-foreground">See how you stack up</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Track Changes</p>
              <p className="text-xs text-muted-foreground">Monitor position shifts</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={onAddCompetitor}
          size="lg" 
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Competitor
        </Button>
      </div>
    </div>
  );
}
