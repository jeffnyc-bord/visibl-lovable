import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ExternalLink, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  Users,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromptInsight {
  id: string;
  query: string;
  mentions: number;
  platforms: Array<{
    name: string;
    logo: string;
    mentioned: boolean;
    sentiment: "positive" | "neutral" | "negative";
    position?: number;
  }>;
  sources: Array<{
    name: string;
    url: string;
    citations: number;
    authority: "high" | "medium" | "low";
  }>;
  trafficEstimate: {
    impressions: number;
    clicks: number;
    trend: string;
  };
  competitorsMentioned: string[];
  lastUpdated: string;
}

interface PromptInsightsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: PromptInsight | null;
  onViewInAuthorityLab?: (sourceUrl: string) => void;
  onViewSource?: (sourceName: string) => void;
}

export const PromptInsightsSheet = ({ 
  open, 
  onOpenChange, 
  prompt,
  onViewInAuthorityLab,
  onViewSource
}: PromptInsightsSheetProps) => {
  if (!prompt) return null;

  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="w-3.5 h-3.5 text-success" />;
      case "negative": return <ThumbsDown className="w-3.5 h-3.5 text-destructive" />;
      default: return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getAuthorityColor = (authority: "high" | "medium" | "low") => {
    switch (authority) {
      case "high": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <SheetTitle className="text-lg font-medium leading-snug pr-4">
                {prompt.query}
              </SheetTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{prompt.mentions} mentions</span>
                <span className="text-border">•</span>
                <span>Updated {prompt.lastUpdated}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Traffic Estimates */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Traffic Estimates
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Impressions</span>
                </div>
                <p className="text-xl font-semibold">{prompt.trafficEstimate.impressions.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Clicks</span>
                </div>
                <p className="text-xl font-semibold">{prompt.trafficEstimate.clicks.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Trend</span>
                </div>
                <p className="text-xl font-semibold text-success">{prompt.trafficEstimate.trend}</p>
              </div>
            </div>
          </section>

          {/* Platform Breakdown */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform Breakdown
            </h3>
            <div className="space-y-2">
              {prompt.platforms.map((platform) => (
                <div 
                  key={platform.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={platform.logo} 
                      alt={platform.name} 
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {platform.mentioned ? (
                      <>
                        {platform.position && (
                          <span className="text-xs text-muted-foreground">
                            Position #{platform.position}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          {getSentimentIcon(platform.sentiment)}
                          <span className="text-xs capitalize">{platform.sentiment}</span>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success border-0 text-[10px]">
                          Mentioned
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                        Not Mentioned
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sources Attribution */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sources Surfaced
              </h3>
              <span className="text-xs text-muted-foreground">{prompt.sources.length} sources</span>
            </div>
            <div className="space-y-2">
              {prompt.sources.map((source, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group"
                  onClick={() => onViewSource?.(source.name)}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {source.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{source.citations} citations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px] capitalize", getAuthorityColor(source.authority))}>
                      {source.authority}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(source.url, '_blank');
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
            {onViewInAuthorityLab && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onViewInAuthorityLab(prompt.sources[0]?.url || '')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View in Authority Lab
              </Button>
            )}
          </section>

          {/* Competitors Mentioned */}
          {prompt.competitorsMentioned.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Competitors Also Mentioned
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.competitorsMentioned.map((competitor) => (
                  <Badge key={competitor} variant="outline" className="text-xs">
                    {competitor}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
