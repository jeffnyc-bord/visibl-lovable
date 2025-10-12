import { TrendingUp, Target, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustryRankingEmptyProps {
  onAddCompetitor: () => void;
}

export function IndustryRankingEmpty({ onAddCompetitor }: IndustryRankingEmptyProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-background via-primary/5 to-background p-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        {/* Icon group */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Track Your Competition
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Start monitoring how your competitors rank in AI visibility. 
            Compare mentions, scores, and track their position changes over time.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-3 w-full max-w-sm text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Real-time Rankings</p>
              <p className="text-xs text-muted-foreground">See how you stack up against the competition</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Track Changes</p>
              <p className="text-xs text-muted-foreground">Monitor position shifts and score trends</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={onAddCompetitor}
          size="lg" 
          className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Competitor
        </Button>

        <p className="text-xs text-muted-foreground">
          Get started by adding brands to compare against
        </p>
      </div>
    </div>
  );
}
