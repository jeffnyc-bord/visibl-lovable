import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, FileText, ChevronDown, ChevronUp, ArrowUpRight, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReportExportDialog } from "@/components/ui/report-export-dialog";
import { AIInsightsModal } from "@/components/ui/ai-insights-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { LockedPlatformIndicator } from "@/components/ui/locked-platform-indicator";
import { UpgradeSheet, UpgradeType } from "@/components/ui/upgrade-sheet";
import { PromptInsightsSheet, PromptInsight } from "@/components/ui/prompt-insights-sheet";
import { SourceInsightsSheet, SourceInsight } from "@/components/ui/source-insights-sheet";
import { AnimatedCounter, SlotCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";
import grokLogo from "@/assets/grok_logo_new.png";
import chatGPTLogo from "@/assets/chatGPT_logo.png";
import perplexityLogo from "@/assets/perplexity_logo.png";
import geminiLogo from "@/assets/gemini_logo.png";

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
  const [platformChartType, setPlatformChartType] = useState<'bar' | 'pie'>('bar');
  
  // Upgrade sheet state
  const [upgradeSheetOpen, setUpgradeSheetOpen] = useState(false);
  const [upgradeType, setUpgradeType] = useState<UpgradeType>("general");
  
  // Mock prompt count for confidence display
  const promptCount = 5;
  
  // State for expanded sections
  const [expandedSources, setExpandedSources] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState(false);
  
  // State for prompt insights sheet
  const [promptInsightsOpen, setPromptInsightsOpen] = useState(false);
  const [selectedPromptInsight, setSelectedPromptInsight] = useState<PromptInsight | null>(null);
  
  // State for source insights sheet
  const [sourceInsightsOpen, setSourceInsightsOpen] = useState(false);
  const [selectedSourceInsight, setSelectedSourceInsight] = useState<SourceInsight | null>(null);
  
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

  // Active platforms for lowest tier (ChatGPT & Gemini only)
  const activePlatformMentions = [
    { platform: "ChatGPT", mentions: 456, sentiment: "positive", coverage: 85, trend: "+12%", logo: chatGPTLogo },
    { platform: "Gemini", mentions: 287, sentiment: "neutral", coverage: 72, trend: "+18%", logo: geminiLogo },
  ];

  // Locked platforms (require upgrade)
  const lockedPlatforms = [
    { platform: "Grok", mentions: 324, sentiment: "positive", coverage: 78, trend: "+8%", logo: grokLogo },
    { platform: "Perplexity", mentions: 180, sentiment: "positive", coverage: 65, trend: "+22%", logo: perplexityLogo },
  ];

  const allPlatformMentions = [...activePlatformMentions, ...lockedPlatforms];

  // Platform details for tooltips
  const platformDetails: Record<string, { name: string; active: boolean; benefit: string }> = {
    'ChatGPT': { 
      name: 'ChatGPT', 
      active: true, 
      benefit: 'Largest user base with 100M+ weekly active users. Essential for consumer discovery.' 
    },
    'Gemini': { 
      name: 'Gemini', 
      active: true, 
      benefit: 'Integrated with Google Search. Critical for SEO-adjacent AI visibility.' 
    },
    'Perplexity': { 
      name: 'Perplexity', 
      active: false, 
      benefit: 'Research-focused AI with citation support. Key for B2B and technical audiences.' 
    },
    'Grok': { 
      name: 'Grok', 
      active: false, 
      benefit: 'Real-time X/Twitter integration. Valuable for social commerce and trending topics.' 
    }
  };

  const platformMentions = selectedModels.includes("All models") 
    ? allPlatformMentions 
    : allPlatformMentions.filter(platform => {
        return selectedModels.some(model => {
          const filterModel = model === "Microsoft Copilot" ? "Copilot" : model;
          return platform.platform === filterModel;
        });
      });

  // Enhanced prompt data with insights
  const promptInsightsData: PromptInsight[] = [
    { 
      id: "1",
      query: "Nike Air Max vs Adidas Ultraboost", 
      mentions: 203,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "positive", position: 1 },
        { name: "Grok", logo: grokLogo, mentioned: true, sentiment: "positive", position: 2 },
        { name: "Gemini", logo: geminiLogo, mentioned: true, sentiment: "neutral", position: 3 },
        { name: "Perplexity", logo: perplexityLogo, mentioned: false, sentiment: "neutral" },
      ],
      sources: [
        { name: "Nike.com", url: "https://nike.com", citations: 47, authority: "high" },
        { name: "Runner's World", url: "https://runnersworld.com", citations: 32, authority: "high" },
        { name: "Reddit r/Sneakers", url: "https://reddit.com/r/sneakers", citations: 18, authority: "medium" },
      ],
      trafficEstimate: { impressions: 45000, clicks: 2800, trend: "+24%" },
      competitorsMentioned: ["Adidas", "New Balance", "ASICS"],
      lastUpdated: "2 hours ago"
    },
    { 
      id: "2",
      query: "Most comfortable athletic shoes for daily wear", 
      mentions: 167,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "positive", position: 2 },
        { name: "Grok", logo: grokLogo, mentioned: true, sentiment: "positive", position: 1 },
        { name: "Gemini", logo: geminiLogo, mentioned: true, sentiment: "positive", position: 2 },
        { name: "Perplexity", logo: perplexityLogo, mentioned: true, sentiment: "neutral", position: 4 },
      ],
      sources: [
        { name: "Nike.com", url: "https://nike.com", citations: 38, authority: "high" },
        { name: "Wirecutter", url: "https://nytimes.com/wirecutter", citations: 29, authority: "high" },
      ],
      trafficEstimate: { impressions: 38000, clicks: 2100, trend: "+18%" },
      competitorsMentioned: ["Adidas", "Allbirds", "Brooks"],
      lastUpdated: "3 hours ago"
    },
    { 
      id: "3",
      query: "Best basketball shoes for performance", 
      mentions: 89,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "positive", position: 1 },
        { name: "Grok", logo: grokLogo, mentioned: false, sentiment: "neutral" },
        { name: "Gemini", logo: geminiLogo, mentioned: true, sentiment: "positive", position: 1 },
        { name: "Perplexity", logo: perplexityLogo, mentioned: true, sentiment: "positive", position: 2 },
      ],
      sources: [
        { name: "Nike.com", url: "https://nike.com", citations: 52, authority: "high" },
        { name: "ESPN", url: "https://espn.com", citations: 21, authority: "high" },
      ],
      trafficEstimate: { impressions: 22000, clicks: 1400, trend: "+12%" },
      competitorsMentioned: ["Adidas", "Under Armour"],
      lastUpdated: "5 hours ago"
    },
    { 
      id: "4",
      query: "Running shoes for marathon training", 
      mentions: 145,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "positive", position: 3 },
        { name: "Grok", logo: grokLogo, mentioned: true, sentiment: "neutral", position: 4 },
        { name: "Gemini", logo: geminiLogo, mentioned: true, sentiment: "positive", position: 2 },
        { name: "Perplexity", logo: perplexityLogo, mentioned: true, sentiment: "positive", position: 1 },
      ],
      sources: [
        { name: "Runner's World", url: "https://runnersworld.com", citations: 44, authority: "high" },
        { name: "Nike.com", url: "https://nike.com", citations: 36, authority: "high" },
      ],
      trafficEstimate: { impressions: 31000, clicks: 1900, trend: "+8%" },
      competitorsMentioned: ["ASICS", "Brooks", "Hoka"],
      lastUpdated: "4 hours ago"
    },
    { 
      id: "5",
      query: "Sustainable athletic footwear options", 
      mentions: 112,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "neutral", position: 4 },
        { name: "Grok", logo: grokLogo, mentioned: false, sentiment: "neutral" },
        { name: "Gemini", logo: geminiLogo, mentioned: true, sentiment: "positive", position: 3 },
        { name: "Perplexity", logo: perplexityLogo, mentioned: true, sentiment: "positive", position: 2 },
      ],
      sources: [
        { name: "Nike Sustainability", url: "https://nike.com/sustainability", citations: 28, authority: "high" },
        { name: "Forbes", url: "https://forbes.com", citations: 19, authority: "high" },
      ],
      trafficEstimate: { impressions: 18000, clicks: 950, trend: "+32%" },
      competitorsMentioned: ["Allbirds", "Adidas", "Veja"],
      lastUpdated: "6 hours ago"
    },
    { 
      id: "6",
      query: "Best cross-training shoes for gym workouts", 
      mentions: 98,
      platforms: [
        { name: "ChatGPT", logo: chatGPTLogo, mentioned: true, sentiment: "positive", position: 2 },
        { name: "Grok", logo: grokLogo, mentioned: true, sentiment: "positive", position: 1 },
        { name: "Gemini", logo: geminiLogo, mentioned: false, sentiment: "neutral" },
        { name: "Perplexity", logo: perplexityLogo, mentioned: true, sentiment: "neutral", position: 3 },
      ],
      sources: [
        { name: "Nike.com", url: "https://nike.com", citations: 31, authority: "high" },
        { name: "Men's Health", url: "https://menshealth.com", citations: 24, authority: "high" },
      ],
      trafficEstimate: { impressions: 15000, clicks: 820, trend: "+15%" },
      competitorsMentioned: ["Reebok", "Under Armour", "Nobull"],
      lastUpdated: "1 day ago"
    },
  ];

  const handlePromptClick = (promptId: string) => {
    const insight = promptInsightsData.find(p => p.id === promptId);
    if (insight) {
      setSelectedPromptInsight(insight);
      setPromptInsightsOpen(true);
    }
  };

  // Enhanced source data with prompt attribution
  const sourceInsightsData: SourceInsight[] = [
    {
      id: "1",
      name: `www.${brandData.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}`,
      url: brandData.url.startsWith('http') ? brandData.url : `https://${brandData.url}`,
      authority: "high",
      citations: Math.round(brandData.totalMentions * 0.027 * 1.2),
      promptsTriggered: [
        { query: "Nike Air Max vs Adidas Ultraboost", mentions: 47, platforms: ["ChatGPT", "Gemini", "Perplexity"] },
        { query: "Best running shoes for marathon training", mentions: 36, platforms: ["ChatGPT", "Grok"] },
        { query: "Most comfortable athletic shoes", mentions: 28, platforms: ["Gemini", "Perplexity"] },
      ],
      trafficEstimate: { monthlyVisitors: "89M", llmReferrals: 12400, trend: "+18%" },
      sampleQuote: `According to ${brandData.name}'s official product specifications, their latest release features innovative cushioning technology that provides superior comfort for athletes.`,
      lastCited: "2 hours ago"
    },
    {
      id: "2",
      name: "www.techcrunch.com",
      url: "https://www.techcrunch.com",
      authority: "high",
      citations: Math.round(brandData.totalMentions * 0.027 * 0.95),
      promptsTriggered: [
        { query: "Sustainable athletic footwear options", mentions: 32, platforms: ["ChatGPT", "Gemini", "Grok"] },
        { query: "Nike Air Max vs Adidas Ultraboost", mentions: 24, platforms: ["Perplexity", "ChatGPT"] },
      ],
      trafficEstimate: { monthlyVisitors: "12.4M", llmReferrals: 8470, trend: "+24%" },
      sampleQuote: `TechCrunch reports that ${brandData.name} has been leading innovation in the athletic wear space with their new sustainable materials initiative.`,
      lastCited: "5 hours ago"
    },
    {
      id: "3",
      name: "www.theverge.com",
      url: "https://www.theverge.com",
      authority: "high",
      citations: Math.round(brandData.totalMentions * 0.027 * 0.75),
      promptsTriggered: [
        { query: "Best basketball shoes for performance", mentions: 21, platforms: ["ChatGPT", "Gemini"] },
        { query: "Running shoes for marathon training", mentions: 18, platforms: ["Perplexity"] },
      ],
      trafficEstimate: { monthlyVisitors: "24.1M", llmReferrals: 5890, trend: "+12%" },
      sampleQuote: `The Verge's analysis compares ${brandData.name}'s technology stack against industry competitors, noting both strengths and areas for improvement.`,
      lastCited: "1 day ago"
    },
    {
      id: "4",
      name: "www.wired.com",
      url: "https://www.wired.com",
      authority: "high",
      citations: Math.round(brandData.totalMentions * 0.027 * 0.68),
      promptsTriggered: [
        { query: "Best cross-training shoes for gym workouts", mentions: 19, platforms: ["ChatGPT", "Grok"] },
      ],
      trafficEstimate: { monthlyVisitors: "8.7M", llmReferrals: 4230, trend: "+8%" },
      sampleQuote: `Wired's deep dive into athletic technology highlights ${brandData.name}'s proprietary foam technology as a game-changer.`,
      lastCited: "2 days ago"
    },
    {
      id: "5",
      name: "www.forbes.com",
      url: "https://www.forbes.com",
      authority: "high",
      citations: Math.round(brandData.totalMentions * 0.027 * 0.58),
      promptsTriggered: [
        { query: "Sustainable athletic footwear options", mentions: 15, platforms: ["ChatGPT", "Perplexity", "Grok"] },
        { query: "Most comfortable athletic shoes", mentions: 12, platforms: ["Gemini"] },
      ],
      trafficEstimate: { monthlyVisitors: "89.2M", llmReferrals: 7230, trend: "+15%" },
      sampleQuote: `Forbes ranks ${brandData.name} among the top brands for customer satisfaction and product quality in their annual industry report.`,
      lastCited: "3 days ago"
    },
  ];

  const handleSourceClick = (sourceId: string) => {
    const insight = sourceInsightsData.find(s => s.id === sourceId);
    if (insight) {
      setSelectedSourceInsight(insight);
      setSourceInsightsOpen(true);
    }
  };

  const sourceQuality = sourceInsightsData.map(s => ({
    id: s.id,
    source: s.name,
    url: s.url,
    mentions: s.citations,
    authority: s.authority
  }));
  
  const topSource = sourceQuality.reduce((max, source) => source.mentions > max.mentions ? source : max, sourceQuality[0]);

  const displayedPlatforms = showAllPlatforms ? platformMentions : platformMentions.slice(0, 4);

  // Platform distribution colors - Apple Health style
  const PLATFORM_COLORS = ['hsl(142, 71%, 45%)', 'hsl(200, 80%, 50%)', 'hsl(280, 70%, 55%)', 'hsl(35, 90%, 55%)'];

  return (
    <TooltipProvider>
      <div className="space-y-0">
        {/* Header - Clean & Minimal */}
        <div 
          className={`flex items-center justify-between pb-8 animate-fade-in ${demoMode ? 'demo-header' : ''}`}
          style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
        >
          <div>
            <p className="text-sm text-muted-foreground tracking-wide uppercase mb-1">AI Visibility Overview</p>
            <h1 className="text-3xl font-light tracking-tight text-foreground">{brandData.name}</h1>
          </div>
          <ReportExportDialog
            trigger={
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
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

        {/* Hero Score Section */}
        <div 
          className={`py-8 border-b border-border/20 animate-fade-in ${demoMode ? 'demo-card-1' : ''}`}
          style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Large Score Display */}
            <div className="lg:col-span-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">AI Visibility Score</span>
                </div>
                
                {/* Large Score with Animation */}
                <div className="relative mb-4">
                  <AnimatedCounter
                    value={brandData.visibilityScore}
                    duration={2}
                    delay={0.3}
                    className="text-7xl font-extralight tracking-tighter text-foreground"
                    showGlow={true}
                    glowColor="rgb(34, 197, 94)"
                  />
                  <span className="text-2xl font-extralight text-muted-foreground ml-1">/ 100</span>
                  
                  {/* Trend Badge - animated in after counter */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 2.5, duration: 0.4, type: "spring" }}
                    className="absolute -right-2 top-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: 'rgb(22, 163, 74)',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)'
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    +5%
                  </motion.div>
                </div>

                <ConfidenceBadge 
                  promptCount={promptCount} 
                  minForHighConfidence={10}
                  onClick={() => handleUpgradeClick("prompt_fidelity")}
                />
              </div>
            </div>

            {/* Center: Key Metrics */}
            <div className="lg:col-span-4 flex items-center">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full">
                <div>
                  <SlotCounter
                    value={brandData.totalMentions}
                    duration={1.8}
                    delay={0.5}
                    digitClassName="text-4xl font-extralight text-foreground tabular-nums"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Total Mentions</p>
                </div>
                <div 
                  className={cn(
                    "cursor-pointer group",
                    highlightTopSource && "ring-2 ring-primary/30 ring-offset-4 rounded-lg p-2 -m-2"
                  )}
                  onClick={() => window.open(topSource.url, '_blank')}
                >
                  <p className="text-lg font-light text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    {testTopSourceUrl || topSource.source}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Top Source • {topSource.mentions} refs</p>
                </div>
              </div>
            </div>

            {/* Right: Platform Coverage */}
            <div className="lg:col-span-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Platform Coverage</p>
              <TooltipProvider delayDuration={200}>
                <AIInsightsModal
                  trigger={
                    <div className="flex items-center gap-3 cursor-pointer group mb-4">
                      <div className="flex -space-x-2">
                        {activePlatformMentions.map((platform, i) => {
                          const details = platformDetails[platform.platform];
                          const isActive = details?.active ?? false;
                          return (
                            <Tooltip key={platform.platform}>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <img 
                                    src={platform.logo} 
                                    alt={platform.platform}
                                    className="w-8 h-8 rounded-full border-2 border-background object-contain bg-background cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
                                    style={{ zIndex: activePlatformMentions.length - i }}
                                  />
                                  {isActive && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border border-background flex items-center justify-center z-10">
                                      <Check className="w-2 h-2 text-success-foreground" />
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="bottom" 
                                sideOffset={8}
                                className="max-w-xs p-3 z-[100]"
                                style={{
                                  background: 'rgba(0, 0, 0, 0.85)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-primary-foreground text-sm">{platform.platform}</span>
                                    <Badge 
                                      variant="default"
                                      className="text-[10px] px-1.5 py-0 h-4 bg-success/20 text-success border-success/30"
                                    >
                                      Active
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                                    {details?.benefit}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {activePlatformMentions.length} active
                      </span>
                    </div>
                  }
                  platforms={activePlatformMentions}
                />
                <div className="flex items-center gap-2">
                  {lockedPlatforms.map((platform) => {
                    const details = platformDetails[platform.platform];
                    return (
                      <Tooltip key={platform.platform}>
                        <TooltipTrigger asChild>
                          <div>
                            <LockedPlatformIndicator
                              platformName={platform.platform}
                              platformIcon={<img src={platform.logo} alt={platform.platform} className="w-full h-full" />}
                              onClick={() => handleUpgradeClick("chatbot_coverage")}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="bottom" 
                          sideOffset={8}
                          className="max-w-xs p-3 z-[100]"
                          style={{
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-primary-foreground text-sm">{platform.platform}</span>
                              <Badge 
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-4 bg-white/20 text-white/90 border border-white/30"
                              >
                                Locked
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground/90 leading-relaxed">
                              {details?.benefit}
                            </p>
                            <p className="text-xs text-primary/80 font-medium pt-1">
                              Upgrade to Pro to unlock
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  <span className="text-xs text-muted-foreground ml-1">locked</span>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Platform Distribution - Apple Health Style */}
        <div 
          className={`py-8 border-b border-border/20 animate-fade-in ${demoMode ? 'demo-card-2' : ''}`}
          style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-light text-foreground">Platform Distribution</h2>
              {/* Segmented Text Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPlatformChartType('bar')}
                  className="relative px-3 py-1"
                >
                  <span 
                    className={cn(
                      "text-sm transition-colors duration-200",
                      platformChartType === 'bar' 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground/70"
                    )}
                  >
                    Bars
                  </span>
                  {platformChartType === 'bar' && (
                    <motion.div
                      layoutId="chartTabIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-foreground"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setPlatformChartType('pie')}
                  className="relative px-3 py-1"
                >
                  <span 
                    className={cn(
                      "text-sm transition-colors duration-200",
                      platformChartType === 'pie' 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground/70"
                    )}
                  >
                    Distribution
                  </span>
                  {platformChartType === 'pie' && (
                    <motion.div
                      layoutId="chartTabIndicator"
                      className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-foreground"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllPlatforms(!showAllPlatforms)}
              className="text-muted-foreground text-xs"
            >
              {showAllPlatforms ? "Show Less" : "Show All"}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {platformChartType === 'bar' ? (
              <motion.div
                key="bar-chart"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {displayedPlatforms.slice(0, 4).map((platform, index) => {
                  const maxMentions = Math.max(...displayedPlatforms.map(p => p.mentions));
                  const percentage = (platform.mentions / maxMentions) * 100;
                  
                  return (
                    <motion.div 
                      key={platform.platform}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img src={platform.logo} alt={platform.platform} className="w-5 h-5 object-contain" />
                          <span className="text-sm text-foreground">{platform.platform}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-sm font-medium text-foreground tabular-nums">{platform.mentions}</span>
                            <span className="text-xs text-muted-foreground ml-1">mentions</span>
                          </div>
                          <span 
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              color: 'rgb(22, 163, 74)'
                            }}
                          >
                            {platform.trend}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${percentage}%`,
                            opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.4
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          style={{ 
                            background: PLATFORM_COLORS[index % PLATFORM_COLORS.length]
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="pie-chart"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Pie chart with integrated legend */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    className="relative"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <ResponsiveContainer width={220} height={220}>
                      <PieChart>
                        <Pie
                          data={displayedPlatforms.slice(0, 4).map((p, i) => ({
                            name: p.platform,
                            value: p.mentions,
                            color: PLATFORM_COLORS[i % PLATFORM_COLORS.length]
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          onMouseEnter={(_, index) => setHoveredSegment(index)}
                          onMouseLeave={() => setHoveredSegment(null)}
                          label={({ cx, cy, midAngle, outerRadius, index }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius + 25;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const totalMentions = displayedPlatforms.slice(0, 4).reduce((sum, p) => sum + p.mentions, 0);
                            const percentage = ((displayedPlatforms[index].mentions / totalMentions) * 100).toFixed(0);
                            
                            return (
                              <text
                                x={x}
                                y={y}
                                fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="text-xs font-semibold"
                                style={{ 
                                  opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.4,
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
                                {percentage}%
                              </text>
                            );
                          }}
                          labelLine={false}
                        >
                          {displayedPlatforms.slice(0, 4).map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
                              opacity={hoveredSegment === null || hoveredSegment === index ? 1 : 0.4}
                              style={{ transition: 'opacity 0.2s ease' }}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background) / 0.95)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid hsl(var(--border) / 0.3)',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            padding: '10px 14px'
                          }}
                          formatter={(value: number) => [`${value} mentions`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center total */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <span className="text-2xl font-light text-foreground tabular-nums">
                          {displayedPlatforms.slice(0, 4).reduce((sum, p) => sum + p.mentions, 0)}
                        </span>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Horizontal legend below chart */}
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {displayedPlatforms.slice(0, 4).map((platform, index) => (
                    <motion.div 
                      key={platform.platform}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-2 cursor-pointer transition-opacity duration-200"
                      style={{ opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.4 }}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: PLATFORM_COLORS[index % PLATFORM_COLORS.length] }}
                      />
                      <img src={platform.logo} alt={platform.platform} className="w-4 h-4 object-contain" />
                      <span className="text-sm text-foreground">{platform.platform}</span>
                      <span className="text-xs text-muted-foreground">({platform.mentions})</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Visibility Trend */}
        <div 
          className={`py-8 border-b border-border/20 animate-fade-in ${demoMode ? 'demo-card-3' : ''}`}
          style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
        >
          <h2 className="text-xl font-light text-foreground mb-8">Visibility Trend</h2>

          {visibilityTrendData.length === 1 ? (
            <div className="flex items-center justify-center h-48 rounded-2xl bg-muted/20">
              <div className="text-center space-y-2">
                <div className="w-3 h-3 rounded-full bg-foreground/40 mx-auto animate-pulse" />
                <p className="text-sm text-muted-foreground">
                  Baseline: <span className="font-medium text-foreground">{visibilityTrendData[0].mentions}</span> mentions
                </p>
                <p className="text-xs text-muted-foreground">Waiting for next scan</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={visibilityTrendData}>
                <defs>
                  <linearGradient id="areaGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={gradientColors[0]} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="areaGradientStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={gradientColors[0]} />
                    <stop offset="50%" stopColor={gradientColors[1] || gradientColors[0]} />
                    <stop offset="100%" stopColor={gradientColors[2] || gradientColors[0]} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background) / 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid hsl(var(--border) / 0.3)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    padding: '10px 14px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500, fontSize: 12 }}
                  itemStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mentions" 
                  stroke="url(#areaGradientStroke)" 
                  strokeWidth={2}
                  fill="url(#areaGradientFill)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Prompts */}
        <div 
          className={`py-12 border-b border-border/20 animate-fade-in ${demoMode ? 'demo-card-4' : ''}`}
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-foreground">Top Prompts</h2>
            {onNavigateToPrompts && (
              <Button variant="ghost" size="sm" onClick={onNavigateToPrompts} className="text-xs text-muted-foreground hover:text-foreground">
                Manage
              </Button>
            )}
          </div>

          <div className="space-y-0">
            {(expandedPrompts ? promptInsightsData : promptInsightsData.slice(0, 4)).map((prompt) => (
              <div 
                key={prompt.id}
                onClick={() => handlePromptClick(prompt.id)}
                className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 hover:bg-muted/20 -mx-4 px-4 cursor-pointer transition-colors group"
              >
                <p className="text-sm text-foreground group-hover:text-primary transition-colors">{prompt.query}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{prompt.mentions} mentions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {promptInsightsData.length > 4 && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpandedPrompts(!expandedPrompts)}
                className="text-muted-foreground text-xs"
              >
                {expandedPrompts ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5 ml-1" /></>
                ) : (
                  <>Show more <ChevronDown className="w-3.5 h-3.5 ml-1" /></>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Source Quality */}
        <div 
          className={`py-12 animate-fade-in ${demoMode ? 'demo-card-5' : ''}`}
          style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
        >
          <h2 className="text-xl font-light text-foreground mb-6">Source Quality</h2>

          <div className="space-y-0">
            {(expandedSources ? sourceQuality : sourceQuality.slice(0, 3)).map((source) => (
              <div 
                key={source.id}
                className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 hover:bg-muted/20 -mx-4 px-4 cursor-pointer transition-colors group"
                onClick={() => handleSourceClick(source.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {source.source}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize px-1.5 py-0.5 rounded-full bg-muted/50">
                    {source.authority}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{source.mentions} refs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {sourceQuality.length > 3 && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExpandedSources(!expandedSources)}
                className="text-muted-foreground text-xs"
              >
                {expandedSources ? (
                  <>Show less <ChevronUp className="w-3.5 h-3.5 ml-1" /></>
                ) : (
                  <>Show more <ChevronDown className="w-3.5 h-3.5 ml-1" /></>
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

        {/* Prompt Insights Sheet */}
        <PromptInsightsSheet
          open={promptInsightsOpen}
          onOpenChange={setPromptInsightsOpen}
          prompt={selectedPromptInsight}
          onViewSource={(sourceName) => {
            const insight = sourceInsightsData.find(s => s.name === sourceName);
            if (insight) {
              setPromptInsightsOpen(false);
              setTimeout(() => {
                setSelectedSourceInsight(insight);
                setSourceInsightsOpen(true);
              }, 150);
            }
          }}
        />

        {/* Source Insights Sheet */}
        <SourceInsightsSheet
          open={sourceInsightsOpen}
          onOpenChange={setSourceInsightsOpen}
          source={selectedSourceInsight}
          onViewPrompt={(query) => {
            const insight = promptInsightsData.find(p => p.query === query);
            if (insight) {
              setSourceInsightsOpen(false);
              setTimeout(() => {
                setSelectedPromptInsight(insight);
                setPromptInsightsOpen(true);
              }, 150);
            }
          }}
        />
      </div>
    </TooltipProvider>
  );
};
