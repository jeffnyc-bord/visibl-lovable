import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { TrendingUp, FileText, MessageSquare, ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown, Minus, Clock, Quote, Info, ArrowUpRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReportExportDialog } from "@/components/ui/report-export-dialog";
import { AIInsightsModal } from "@/components/ui/ai-insights-modal";
import { TooltipProvider, Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScoreDial } from "@/components/ui/score-dial";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { LockedPlatformIndicator } from "@/components/ui/locked-platform-indicator";
import { UpgradeSheet, UpgradeType } from "@/components/ui/upgrade-sheet";
import { cn } from "@/lib/utils";
import grokLogo from "@/assets/grok_logo_new.png";

interface BrandData {
  id: string;
  name: string;
  logo: string;
  url: string;
  visibilityScore: number;
  totalMentions: number;
  platformCoverage: number;
  industryRanking: number;
  mentionTrend: string;
  sentimentScore: number;
  lastUpdated: string;
  platforms: Array<{
    name: string;
    mentions: number;
    sentiment: string;
    coverage: number;
    trend: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    category: string;
    visibilityScore: number;
    mentions: number;
    sentiment: string;
    lastOptimized: string;
  }>;
  competitors: Array<{
    name: string;
    visibilityScore: number;
    mentions: number;
    trend: string;
  }>;
}

interface OverviewSectionProps {
  brandData: BrandData;
  selectedModels: string[];
  selectedDateRange: string;
  onQueryClick?: (query: string) => void;
  onNavigateToPrompts?: () => void;
  userRole?: "business_user" | "agency_admin";
  showBaseline?: boolean;
  highlightTopSource?: boolean;
  testTopSourceUrl?: string;
  dataPointsCount?: number;
  selectedGradient?: string;
  demoMode?: boolean;
}

const GRADIENT_CONFIGS: Record<string, string[]> = {
  gradient1: ["#3B82F6", "#06B6D4", "#10B981"],
  gradient2: ["#F59E0B", "#EF4444", "#EC4899"],
  gradient3: ["#69c5f2", "#a7def8", "#cbebfa"],
  gradient4: ["#DC2626", "#F97316", "#FCD34D"],
  gradient5: ["#059669", "#10B981", "#34D399"],
  gradient6: ["#6366F1", "#8B5CF6", "#A855F7"],
  gradient7: ["#06B6D4", "#8B5CF6", "#EC4899"],
  gradient8: ["#10B981", "#06B6D4", "#3B82F6"],
  gradient9: ["#F59E0B", "#EC4899", "#A855F7"],
  gradient10: ["#84CC16", "#06B6D4", "#8B5CF6"],
};

export const OverviewSection = ({ brandData, selectedModels, selectedDateRange, onQueryClick, onNavigateToPrompts, userRole = "business_user", showBaseline = false, highlightTopSource = false, testTopSourceUrl = "", dataPointsCount = 6, selectedGradient = "gradient1", demoMode = false }: OverviewSectionProps) => {
  const gradientColors = GRADIENT_CONFIGS[selectedGradient] || GRADIENT_CONFIGS.gradient1;
  const { toast } = useToast();
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  // Upgrade sheet state
  const [upgradeSheetOpen, setUpgradeSheetOpen] = useState(false);
  const [upgradeType, setUpgradeType] = useState<UpgradeType>("general");
  
  // Mock prompt count for confidence display
  const promptCount = 5;
  
  // State for expanded sections
  const [expandedSources, setExpandedSources] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState(false);
  
  const handleUpgradeClick = (type: UpgradeType) => {
    setUpgradeType(type);
    setUpgradeSheetOpen(true);
  };

  const allVisibilityTrendData = (() => {
    const brandSeed = brandData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patternType = brandSeed % 4;
    const baseMentions = brandData.totalMentions / 6;
    const scoreMultiplier = (brandData.visibilityScore / 100) * 0.5 + 0.75;
    
    switch(patternType) {
      case 0:
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.65 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.08 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.20 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.35 * scoreMultiplier) },
        ];
      case 1:
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.85 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 0.90 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 1.45 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.15 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.05 * scoreMultiplier) },
        ];
      case 2:
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 1.25 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.35 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.10 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 0.90 * scoreMultiplier) },
        ];
      default:
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 1.20 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 1.05 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.85 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.00 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.25 * scoreMultiplier) },
        ];
    }
  })();

  const visibilityTrendData = showBaseline 
    ? [allVisibilityTrendData[0]] 
    : allVisibilityTrendData.slice(0, dataPointsCount);

  const allPlatformMentions = [
    { platform: "ChatGPT", mentions: 456, sentiment: "positive", coverage: 85, trend: "+12%", logo: "/lovable-uploads/84b583a1-fe3d-4393-ae0a-df3ec0dbd01d.png" },
    { platform: "Grok", mentions: 324, sentiment: "positive", coverage: 78, trend: "+8%", logo: grokLogo },
    { platform: "Gemini", mentions: 287, sentiment: "neutral", coverage: 72, trend: "+18%", logo: "/lovable-uploads/20ab85cf-422a-46f0-a62a-26fe3db14680.png" },
    { platform: "Perplexity", mentions: 180, sentiment: "positive", coverage: 65, trend: "+22%", logo: "/lovable-uploads/921c76c7-1c98-41d6-a192-8308c4b7fd49.png" },
    { platform: "Claude", mentions: 145, sentiment: "positive", coverage: 58, trend: "+15%", logo: "/lovable-uploads/7c83c89c-25ba-4bd6-ac2d-3bfa6cd098db.png" },
    { platform: "Copilot", mentions: 123, sentiment: "neutral", coverage: 52, trend: "+9%", logo: "/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" },
  ];

  const platformMentions = selectedModels.includes("All models") 
    ? allPlatformMentions 
    : allPlatformMentions.filter(platform => {
        return selectedModels.some(model => {
          const filterModel = model === "Microsoft Copilot" ? "Copilot" : model;
          return platform.platform === filterModel;
        });
      });

  const coreQueries = [
    { query: "Nike Air Max vs Adidas Ultraboost", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", mentions: 167 },
    { query: "Best basketball shoes for performance", mentions: 89 },
    { query: "Running shoes for marathon training", mentions: 145 },
    { query: "Sustainable athletic footwear options", mentions: 112 },
    { query: "Best cross-training shoes for gym workouts", mentions: 98 },
  ];

  const generateBrandSources = () => {
    const brandUrl = brandData.url.startsWith('http') ? brandData.url : `https://${brandData.url}`;
    const brandDomain = brandData.url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    const baseMentions = Math.round(brandData.totalMentions * 0.027);
    
    return [
      { source: `www.${brandDomain}`, url: brandUrl, mentions: Math.round(baseMentions * 1.2), authority: "high" as const },
      { source: "www.techcrunch.com", url: "https://www.techcrunch.com", mentions: Math.round(baseMentions * 0.95), authority: "high" as const },
      { source: "www.theverge.com", url: "https://www.theverge.com", mentions: Math.round(baseMentions * 0.75), authority: "high" as const },
      { source: "www.wired.com", url: "https://www.wired.com", mentions: Math.round(baseMentions * 0.68), authority: "high" as const },
      { source: "www.forbes.com", url: "https://www.forbes.com", mentions: Math.round(baseMentions * 0.58), authority: "high" as const },
    ];
  };

  const sourceQuality = generateBrandSources();
  const topSource = sourceQuality.reduce((max, source) => source.mentions > max.mentions ? source : max, sourceQuality[0]);

  const displayedPlatforms = showAllPlatforms ? platformMentions : platformMentions.slice(0, 4);

  // Vibrant donut chart colors
  const DONUT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

  return (
    <TooltipProvider>
      <div className="space-y-0">
        {/* Header */}
        <div 
          className={`flex items-center justify-between pb-6 border-b border-border/50 animate-fade-in ${demoMode ? 'demo-header' : ''}`}
          style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Visibility</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Performance overview for {brandData.name}</p>
          </div>
          <ReportExportDialog
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                Export
              </Button>
            }
            brandName={brandData.name}
            reportType="full"
            userRole={userRole}
            brandData={{
              visibilityScore: brandData.visibilityScore,
              totalMentions: brandData.totalMentions,
              platformCoverage: brandData.platformCoverage,
              industryRanking: brandData.industryRanking,
              mentionTrend: brandData.mentionTrend,
              sentimentScore: brandData.sentimentScore,
              platforms: brandData.platforms,
              products: brandData.products,
              competitors: brandData.competitors
            }}
          />
        </div>

        {/* Primary Metrics - Compact Layout */}
        <div 
          className={`py-6 border-b border-border/50 animate-fade-in ${demoMode ? 'demo-card-1' : ''}`}
          style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score */}
            <div className="flex flex-col">
              <ScoreDial
                currentScore={brandData.visibilityScore}
                previousScore={82}
                change={5}
                label="AI Visibility Score"
                icon={<Sparkles className="w-4 h-4" />}
              />
              <div className="mt-3">
                <ConfidenceBadge 
                  promptCount={promptCount} 
                  minForHighConfidence={10}
                  onClick={() => handleUpgradeClick("prompt_fidelity")}
                />
              </div>
            </div>

            {/* Middle: Mentions & Source */}
            <div className="space-y-5">
              {/* Total Mentions */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Mentions</p>
                  <Badge variant="secondary" className="bg-success/10 text-success border-0 text-xs font-medium">
                    +15%
                  </Badge>
                </div>
                <p className="text-3xl font-light tracking-tight mt-1">{brandData.totalMentions.toLocaleString()}</p>
              </div>

              {/* Top Source */}
              <div 
                className={cn(
                  "cursor-pointer group transition-all",
                  highlightTopSource && "ring-2 ring-primary ring-offset-4 rounded-lg p-2 -m-2"
                )}
                onClick={() => window.open(topSource.url, '_blank')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Top Source</p>
                  <span className="text-xs text-muted-foreground">{topSource.mentions} refs</span>
                </div>
                <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 mt-1">
                  {testTopSourceUrl || topSource.source}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>

            {/* Right: Platform Coverage */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Platform Coverage</p>
              <AIInsightsModal
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="flex -space-x-2">
                      {displayedPlatforms.slice(0, 4).map((platform, i) => (
                        <img 
                          key={platform.platform}
                          src={platform.logo} 
                          alt={platform.platform}
                          className="w-7 h-7 rounded-full border-2 border-background object-contain bg-background"
                          style={{ zIndex: 4 - i }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {platformMentions.length} platforms
                    </span>
                  </div>
                }
                platforms={platformMentions}
              />
              <div className="flex items-center gap-1.5 mt-3">
                <LockedPlatformIndicator
                  platformName="Grok"
                  platformIcon={<img src={grokLogo} alt="Grok" className="w-full h-full" />}
                  onClick={() => handleUpgradeClick("chatbot_coverage")}
                />
                <LockedPlatformIndicator
                  platformName="Copilot"
                  platformIcon={<img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="Copilot" className="w-full h-full" />}
                  onClick={() => handleUpgradeClick("chatbot_coverage")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Trend */}
        <div 
          className={`py-8 border-b border-border/50 animate-fade-in ${demoMode ? 'demo-card-2' : ''}`}
          style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Visibility Trend</h2>
          </div>

          {visibilityTrendData.length === 1 ? (
            <div className="flex items-center justify-center h-48 rounded-xl bg-muted/30">
              <div className="text-center space-y-2">
                <div className="w-3 h-3 rounded-full bg-primary/60 mx-auto animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  Baseline captured: <span className="font-medium text-foreground">{visibilityTrendData[0].mentions}</span> mentions
                </p>
                <p className="text-xs text-muted-foreground">Waiting for next scan</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={visibilityTrendData} barSize={32}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={1} />
                    <stop offset="100%" stopColor={gradientColors[2]} stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                  itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Bar dataKey="mentions" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform Distribution */}
        <div 
          className={`py-8 border-b border-border/50 animate-fade-in ${demoMode ? 'demo-card-3' : ''}`}
          style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Platform Distribution</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="text-muted-foreground text-xs"
            >
              {showAllPlatforms ? "Show Less" : "Show All"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donut Chart - Properly calculated */}
            <div className="flex justify-center items-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {(() => {
                    const platforms = displayedPlatforms.slice(0, 4);
                    const total = platforms.reduce((sum, p) => sum + p.mentions, 0);
                    const radius = 35;
                    const circumference = 2 * Math.PI * radius;
                    let cumulativeOffset = 0;
                    
                    return platforms.map((platform, index) => {
                      const percentage = platform.mentions / total;
                      const segmentLength = percentage * circumference;
                      const currentOffset = cumulativeOffset;
                      cumulativeOffset += segmentLength;
                      
                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          stroke={DONUT_COLORS[index]}
                          strokeWidth={hoveredSegment === index ? 12 : 10}
                          strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                          strokeDashoffset={-currentOffset}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-200 cursor-pointer"
                          style={{ filter: hoveredSegment === index ? 'brightness(1.1)' : 'brightness(1)' }}
                          onMouseEnter={() => setHoveredSegment(index)}
                          onMouseLeave={() => setHoveredSegment(null)}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {hoveredSegment !== null ? (
                      <>
                        <p className="text-xl font-medium">{displayedPlatforms[hoveredSegment].mentions}</p>
                        <p className="text-xs text-muted-foreground">{displayedPlatforms[hoveredSegment].platform}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-medium">{displayedPlatforms.slice(0, 4).reduce((sum, p) => sum + p.mentions, 0)}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform List */}
            <div className="space-y-2">
              {displayedPlatforms.map((platform, index) => (
                <div 
                  key={platform.platform}
                  className={cn(
                    "flex items-center justify-between py-2 px-2 -mx-2 rounded-md transition-colors cursor-pointer",
                    hoveredSegment === index ? "bg-muted/60" : "hover:bg-muted/30"
                  )}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
                    />
                    <img src={platform.logo} alt={platform.platform} className="w-5 h-5 object-contain" />
                    <span className="text-sm">{platform.platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">{platform.mentions}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success border-0 text-xs">
                      {platform.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Prompts */}
        <div 
          className={`py-8 border-b border-border/50 animate-fade-in ${demoMode ? 'demo-card-4' : ''}`}
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Top Prompts</h2>
            {onNavigateToPrompts && (
              <Button variant="ghost" size="sm" onClick={onNavigateToPrompts} className="text-xs text-muted-foreground">
                Manage
              </Button>
            )}
          </div>

          <div className="space-y-1">
            {(expandedPrompts ? coreQueries : coreQueries.slice(0, 4)).map((query, index) => (
              <div 
                key={index}
                onClick={() => onQueryClick?.(query.query)}
                className="flex items-center justify-between py-2.5 px-3 -mx-3 rounded-md hover:bg-muted/40 cursor-pointer transition-colors group"
              >
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">{query.query}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{query.mentions}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {coreQueries.length > 4 && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpandedPrompts(!expandedPrompts)}
                className="text-muted-foreground text-xs"
              >
                {expandedPrompts ? (
                  <>Less <ChevronUp className="w-3.5 h-3.5 ml-0.5" /></>
                ) : (
                  <>More <ChevronDown className="w-3.5 h-3.5 ml-0.5" /></>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Source Quality */}
        <div 
          className={`py-8 animate-fade-in ${demoMode ? 'demo-card-5' : ''}`}
          style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Source Quality</h2>
          </div>

          <div className="space-y-1">
            {(expandedSources ? sourceQuality : sourceQuality.slice(0, 3)).map((source, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2.5 px-3 -mx-3 rounded-md hover:bg-muted/40 cursor-pointer transition-colors group"
                onClick={() => window.open(source.url, '_blank')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {source.source}
                  </span>
                  <Badge variant="secondary" className="text-[10px] capitalize px-1.5 py-0">
                    {source.authority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{source.mentions} refs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {sourceQuality.length > 3 && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpandedSources(!expandedSources)}
                className="text-muted-foreground text-xs"
              >
                {expandedSources ? (
                  <>Less <ChevronUp className="w-3.5 h-3.5 ml-0.5" /></>
                ) : (
                  <>More <ChevronDown className="w-3.5 h-3.5 ml-0.5" /></>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Upgrade Sheet */}
        <UpgradeSheet 
          open={upgradeSheetOpen} 
          onOpenChange={setUpgradeSheetOpen}
          type={upgradeType}
        />
      </div>
    </TooltipProvider>
  );
};
