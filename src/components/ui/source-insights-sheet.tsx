import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ExternalLink, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  MessageSquare,
  Eye,
  Users,
  ArrowUpRight,
  Shield,
  Sparkles
} from "lucide-react";

import chatGPTLogo from "@/assets/chatGPT_logo.png";
import claudeLogo from "@/assets/claude_logo.png";
import geminiLogo from "@/assets/gemini_logo.png";
import perplexityLogo from "@/assets/perplexity_logo.png";
import grokLogo from "@/assets/grok_logo.png";
import { cn } from "@/lib/utils";

export interface SourceInsight {
  id: string;
  name: string;
  url: string;
  authority: "high" | "medium" | "low";
  citations: number;
  promptsTriggered: Array<{
    query: string;
    mentions: number;
    platforms: string[];
  }>;
  trafficEstimate: {
    monthlyVisitors: string;
    llmReferrals: number;
    trend: string;
  };
  sampleQuote?: string;
  lastCited: string;
}

interface SourceInsightsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceInsight | null;
  onViewPrompt?: (query: string) => void;
}

export const SourceInsightsSheet = ({ 
  open, 
  onOpenChange, 
  source,
  onViewPrompt 
}: SourceInsightsSheetProps) => {
  if (!source) return null;

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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <SheetTitle className="text-lg font-medium">
                  {source.name}
                </SheetTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs capitalize", getAuthorityColor(source.authority))}>
                  <Shield className="w-3 h-3 mr-1" />
                  {source.authority} authority
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last cited {source.lastCited}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(source.url, '_blank')}
              className="flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Visit
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Traffic & Citation Stats */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Source Authority
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Traffic</span>
                </div>
                <p className="text-xl font-semibold">{source.trafficEstimate.monthlyVisitors}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Trend</span>
                </div>
                <p className="text-xl font-semibold text-success">{source.trafficEstimate.trend}</p>
              </div>
            </div>
          </section>

          {/* Where did this source come from? */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Where did this source come from?
              </h3>
              <span className="text-xs text-muted-foreground">{source.promptsTriggered.length} prompts</span>
            </div>
            <div className="space-y-2">
              {source.promptsTriggered.map((prompt, index) => {
                const getPlatformLogo = (platform: string) => {
                  const lower = platform.toLowerCase();
                  if (lower.includes('chatgpt') || lower.includes('openai')) return chatGPTLogo;
                  if (lower.includes('claude')) return claudeLogo;
                  if (lower.includes('gemini')) return geminiLogo;
                  if (lower.includes('perplexity')) return perplexityLogo;
                  if (lower.includes('grok')) return grokLogo;
                  return null;
                };

                return (
                  <div 
                    key={index}
                    onClick={() => onViewPrompt?.(prompt.query)}
                    className="p-3 rounded-lg bg-secondary/20 border border-border/30 hover:bg-secondary/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {prompt.query}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">{prompt.mentions} mentions</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Found in:</span>
                            <div className="flex items-center -space-x-1">
                              {prompt.platforms.map((platform) => {
                                const logo = getPlatformLogo(platform);
                                return logo ? (
                                  <Avatar key={platform} className="w-5 h-5 border-2 border-background">
                                    <AvatarImage src={logo} alt={platform} />
                                    <AvatarFallback className="text-[8px]">{platform[0]}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <span key={platform} className="text-[10px] text-muted-foreground px-1">
                                    {platform}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Why This Source Matters */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Why This Matters
            </h3>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm leading-relaxed text-foreground/80">
                This source has been cited <strong>{source.citations} times</strong> across AI platforms. 
                Content from {source.authority}-authority sources like this has a <strong>
                {source.authority === 'high' ? '3.2x' : source.authority === 'medium' ? '1.8x' : '1.2x'} higher chance
                </strong> of being referenced in AI responses compared to average sources.
              </p>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};
