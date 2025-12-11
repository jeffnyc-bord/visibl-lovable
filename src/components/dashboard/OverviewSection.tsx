import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, FileText, MessageSquare, HelpCircle, Calendar, ChevronDown, ChevronUp, ExternalLink, Shield, ThumbsUp, ThumbsDown, Minus, Clock, Quote, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReportExportDialog } from "@/components/ui/report-export-dialog";
import { AIInsightsModal } from "@/components/ui/ai-insights-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScoreDial } from "@/components/ui/score-dial";

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
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  // State for Top Prompts section
  const [listMoreClicked, setListMoreClicked] = useState(false);
  
  // State for Source Quality section
  const [sourcesDisplayCount, setSourcesDisplayCount] = useState(3);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  const allVisibilityData = [
    { month: "Jul", score: 75 },
    { month: "Aug", score: 78 },
    { month: "Sep", score: 82 },
    { month: "Oct", score: 80 },
    { month: "Nov", score: 85 },
    { month: "Dec", score: 87 },
  ];

  // Use dataPointsCount to filter visibility data
  const visibilityData = allVisibilityData.slice(0, dataPointsCount);

  // AI Visibility data from ExternalAIVisibilitySection
  const visibilityMetrics = {
    totalMentions: 1700,
    averageRating: 4.2,
    platformCoverage: 12,
    trending: "+15%"
  };

  const allPlatformMentions = [
    { platform: "ChatGPT", mentions: 456, sentiment: "positive", coverage: 85, trend: "+12%" },
    { platform: "Claude", mentions: 324, sentiment: "positive", coverage: 78, trend: "+8%" },
    { platform: "Gemini", mentions: 287, sentiment: "neutral", coverage: 72, trend: "+18%" },
    { platform: "Perplexity", mentions: 180, sentiment: "positive", coverage: 65, trend: "+22%" },
    { platform: "Grok", mentions: 145, sentiment: "positive", coverage: 58, trend: "+15%" },
    { platform: "Copilot", mentions: 123, sentiment: "neutral", coverage: 52, trend: "+9%" },
    { platform: "Google AI Mode", mentions: 98, sentiment: "positive", coverage: 45, trend: "+25%" },
    { platform: "Google Overviews", mentions: 87, sentiment: "neutral", coverage: 42, trend: "+18%" },
  ];

  // Filter platform mentions based on selected models
  const platformMentions = selectedModels.includes("All models") 
    ? allPlatformMentions 
    : allPlatformMentions.filter(platform => {
        return selectedModels.some(model => {
          // Map Microsoft Copilot to Copilot for filtering
          const filterModel = model === "Microsoft Copilot" ? "Copilot" : model;
          return platform.platform === filterModel;
        });
      });

  // Generate brand-specific visibility trend data with more variation
  const generateBrandTrendData = () => {
    // Create a seed based on brand name for consistent but varied patterns
    const brandSeed = brandData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patternType = brandSeed % 4;
    
    const baseMentions = brandData.totalMentions / 6;
    const scoreMultiplier = (brandData.visibilityScore / 100) * 0.5 + 0.75; // Range: 0.75 to 1.25
    
    // Different growth patterns based on brand
    switch(patternType) {
      case 0: // Steady growth
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.65 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.08 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.20 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.35 * scoreMultiplier) },
        ];
      case 1: // Spike pattern
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.85 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 0.90 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 1.45 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.15 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.05 * scoreMultiplier) },
        ];
      case 2: // Volatile pattern
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 0.95 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 1.25 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 1.35 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.10 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 0.90 * scoreMultiplier) },
        ];
      default: // Declining then recovering
        return [
          { month: "Jul", mentions: Math.round(baseMentions * 1.20 * scoreMultiplier) },
          { month: "Aug", mentions: Math.round(baseMentions * 1.05 * scoreMultiplier) },
          { month: "Sep", mentions: Math.round(baseMentions * 0.85 * scoreMultiplier) },
          { month: "Oct", mentions: Math.round(baseMentions * 0.80 * scoreMultiplier) },
          { month: "Nov", mentions: Math.round(baseMentions * 1.00 * scoreMultiplier) },
          { month: "Dec", mentions: Math.round(baseMentions * 1.25 * scoreMultiplier) },
        ];
    }
  };

  const allVisibilityTrendData = generateBrandTrendData();

  // Show only first data point if baseline mode is enabled, otherwise use dataPointsCount
  const visibilityTrendData = showBaseline 
    ? [allVisibilityTrendData[0]] 
    : allVisibilityTrendData.slice(0, dataPointsCount);

  const coreQueries = [
    { query: "Nike Air Max vs Adidas Ultraboost", brand: "Nike", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", brand: "Nike", mentions: 67 },
    { query: "Best basketball shoes for performance", brand: "Nike", mentions: 89 },
    { query: "Running shoes for marathon training", brand: "Nike", mentions: 145 },
    { query: "Sustainable athletic footwear options", brand: "Nike", mentions: 112 },
    { query: "Best cross-training shoes for gym workouts", brand: "Nike", mentions: 98 },
    { query: "Lightweight running shoes comparison", brand: "Nike", mentions: 156 },
    { query: "Nike React vs Nike ZoomX technology", brand: "Nike", mentions: 134 },
  ];

  // Generate brand-specific source quality data with expanded details
  const generateBrandSources = () => {
    const brandUrl = brandData.url.startsWith('http') ? brandData.url : `https://${brandData.url}`;
    const brandDomain = brandData.url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    const baseMentions = Math.round(brandData.totalMentions * 0.027); // ~2.7% of total
    
    const promptExamples = [
      "Best running shoes for marathon training",
      "Most comfortable athletic footwear",
      "Sustainable sneaker brands comparison",
      "Top basketball shoes for performance",
      "Athletic shoes with best arch support"
    ];
    
    const sources = [
      { 
        source: `www.${brandDomain}`, 
        url: brandUrl, 
        mentions: Math.round(baseMentions * 1.2),
        authority: "high" as const,
        sentiment: "positive" as const,
        platforms: ["ChatGPT", "Gemini", "Perplexity", "Claude"],
        lastCited: "2 hours ago",
        sampleQuote: `"According to ${brandData.name}'s official product specifications, their latest release features innovative cushioning technology..."`,
        prompts: [promptExamples[0], promptExamples[1], promptExamples[3]],
        competitorMentioned: false
      },
      { 
        source: "www.techcrunch.com", 
        url: "https://www.techcrunch.com", 
        mentions: Math.round(baseMentions * 0.95),
        authority: "high" as const,
        sentiment: "positive" as const,
        platforms: ["ChatGPT", "Gemini", "Grok"],
        lastCited: "5 hours ago",
        sampleQuote: `"TechCrunch reports that ${brandData.name} has been leading innovation in the athletic wear space with their new sustainable materials initiative..."`,
        prompts: [promptExamples[2], promptExamples[0]],
        competitorMentioned: true
      },
      { 
        source: "www.theverge.com", 
        url: "https://www.theverge.com", 
        mentions: Math.round(baseMentions * 0.75),
        authority: "high" as const,
        sentiment: "neutral" as const,
        platforms: ["Perplexity", "Claude"],
        lastCited: "1 day ago",
        sampleQuote: `"The Verge's analysis compares ${brandData.name}'s technology stack against industry competitors, noting both strengths and areas for improvement..."`,
        prompts: [promptExamples[1], promptExamples[4]],
        competitorMentioned: true
      },
      { 
        source: "www.wired.com", 
        url: "https://www.wired.com", 
        mentions: Math.round(baseMentions * 0.68),
        authority: "high" as const,
        sentiment: "positive" as const,
        platforms: ["ChatGPT", "Gemini"],
        lastCited: "2 days ago",
        sampleQuote: `"Wired's deep dive into athletic technology highlights ${brandData.name}'s proprietary foam technology as a game-changer..."`,
        prompts: [promptExamples[3]],
        competitorMentioned: false
      },
      { 
        source: "www.forbes.com", 
        url: "https://www.forbes.com", 
        mentions: Math.round(baseMentions * 0.58),
        authority: "high" as const,
        sentiment: "positive" as const,
        platforms: ["ChatGPT", "Perplexity", "Grok"],
        lastCited: "3 days ago",
        sampleQuote: `"Forbes ranks ${brandData.name} among the top brands for customer satisfaction and product quality in their annual industry report..."`,
        prompts: [promptExamples[0], promptExamples[2]],
        competitorMentioned: true
      },
      { 
        source: "www.reddit.com", 
        url: "https://www.reddit.com", 
        mentions: Math.round(baseMentions * 0.45),
        authority: "medium" as const,
        sentiment: "neutral" as const,
        platforms: ["Perplexity", "Claude", "Gemini"],
        lastCited: "6 hours ago",
        sampleQuote: `"Reddit users in r/running frequently recommend ${brandData.name} products for their durability and comfort during long-distance training..."`,
        prompts: [promptExamples[1], promptExamples[4]],
        competitorMentioned: true
      },
    ];
    
    return sources;
  };

  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="w-3.5 h-3.5" />;
      case "negative": return <ThumbsDown className="w-3.5 h-3.5" />;
      default: return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getSentimentStyles = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-700 border-green-200";
      case "negative": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getAuthorityStyles = (authority: "high" | "medium" | "low") => {
    switch (authority) {
      case "high": return "bg-blue-100 text-blue-700 border-blue-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const sourceQuality = generateBrandSources();

  const allPlatformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 36 },
    { platform: "Grok", mentions: 324, percentage: 26 },
    { platform: "Gemini", mentions: 287, percentage: 23 },
    { platform: "Perplexity", mentions: 180, percentage: 15 },
    { platform: "Claude", mentions: 145, percentage: 9 },
    { platform: "Copilot", mentions: 123, percentage: 8 },
    { platform: "Google AI Mode", mentions: 98, percentage: 6 },
  ];

  // Filter platform mentions data for pie chart based on selected models
  const platformMentionsData = selectedModels.includes("All models") 
    ? allPlatformMentionsData 
    : allPlatformMentionsData.filter(platform => {
        return selectedModels.some(model => {
          const filterModel = model === "Microsoft Copilot" ? "Copilot" : model;
          return platform.platform === filterModel;
        });
      });

  // Vibrant color palette for donut segments
  const DONUT_COLORS = [
    '#65CAD2', // Light teal
    '#FFB366', // Light orange
    '#FF6633', // Darker orange
    '#33CCB3'  // Bright teal
  ];

  const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange-red
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      case "neutral": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAuthorityColor = (authority: string) => {
    switch (authority) {
      case "high": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const displayedPlatforms = showAllPlatforms ? platformMentions : platformMentions.slice(0, 4);

  // Determine if only one specific model is selected (not "All models")
  const isOnlyOneModelSelected = !selectedModels.includes("All models") && selectedModels.length === 1;
  
  // Create pie chart data - adapt based on selected models and show/hide logic
  const pieChartData = selectedModels.includes("All models") 
    ? (showAllPlatforms 
        ? platformMentionsData 
        : platformMentionsData.slice(0, 4))
    : platformMentionsData; // For multiple specific models, show all available data

  const pieChartColors = selectedModels.includes("All models") 
    ? (showAllPlatforms ? COLORS : COLORS.slice(0, 4))
    : COLORS;


  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Export Report Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold text-foreground ${demoMode ? 'demo-header' : ''}`}>AI Visibility Overview</h2>
          <p className={`text-muted-foreground ${demoMode ? 'demo-header' : ''}`}>Comprehensive AI visibility metrics and platform insights for {brandData.name}</p>
        </div>
        <ReportExportDialog
          trigger={
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Export Report
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

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={`group relative ${demoMode ? 'demo-card-1' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, visibilityScore: false})}>
          <CardContent className="p-4">
            <div className="absolute top-4 right-4">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, visibilityScore: !showTooltips.visibilityScore})}
              />
              {showTooltips.visibilityScore && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Your brand's overall visibility score across AI platforms, calculated based on mention frequency, sentiment, and platform coverage.</p>
                </div>
              )}
            </div>
            <ScoreDial
              currentScore={brandData.visibilityScore}
              previousScore={82}
              change={5}
              label="AI Visibility Score"
              icon={<img src="/lovable-uploads/b3896000-028e-49c5-b74f-04e22725b257.png" alt="AI Visibility Score" className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        <Card className={`group relative ${demoMode ? 'demo-card-2' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, totalMentions: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/44498275-d714-4181-80c1-79b02c494519.png" alt="Total Mentions" className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">Total Mentions</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, totalMentions: !showTooltips.totalMentions})}
                />
                {showTooltips.totalMentions && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Total number of times your brand has been mentioned across all AI platforms in the selected time period.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{brandData.totalMentions.toLocaleString()}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                +15%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`group relative cursor-pointer hover:shadow-lg transition-all duration-300 ${demoMode ? 'demo-card-3' : ''} ${
            highlightTopSource 
              ? 'ring-4 ring-primary ring-offset-2 shadow-2xl animate-pulse' 
              : ''
          }`}
          onClick={() => {
            const topSource = sourceQuality.reduce((max, source) => 
              source.mentions > max.mentions ? source : max
            , sourceQuality[0]);
            window.open(topSource.url, '_blank');
          }}
          onMouseLeave={() => setShowTooltips({...showTooltips, topSource: false})}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Top Source</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltips({...showTooltips, topSource: !showTooltips.topSource});
                  }}
                />
                {showTooltips.topSource && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>The source with the highest number of references across all AI platforms. Click to visit the source.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 min-w-0">
              <span className="text-lg font-bold text-green-600 block truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {testTopSourceUrl || sourceQuality.reduce((max, source) => 
                  source.mentions > max.mentions ? source : max
                , sourceQuality[0]).source}
              </span>
              <Badge variant="secondary" className="ml-0 mt-1 text-xs bg-green-100 text-green-800">
                {sourceQuality.reduce((max, source) => 
                  source.mentions > max.mentions ? source : max
                , sourceQuality[0]).mentions} references
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mt-1 truncate">Most referenced source</div>
          </CardContent>
        </Card>

        <Card className={`group relative ${demoMode ? 'demo-card-4' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, platformCoverage: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/0a1405cf-54d9-4154-9c04-cbb22a4ad851.png" alt="Platform Coverage" className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">Platform Coverage</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, platformCoverage: !showTooltips.platformCoverage})}
                />
                {showTooltips.platformCoverage && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Number of AI platforms where your brand has been mentioned. Click the number to see detailed platform insights.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <AIInsightsModal
                    trigger={
                      <button className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">
                        4
                      </button>
                    }
                    platforms={platformMentions}
                  />
                  <span className="text-xs text-gray-500">platforms</span>
                  <div className="relative group w-16 h-8">
                    {/* AI Platform Logos Carousel - Overlapping Layout */}
                    <div className="relative h-8 w-20 transition-all duration-500 ease-in-out group-hover:w-32">
                      <img 
                        src="/lovable-uploads/771fa115-94bb-4581-ae07-0733d1e93498.png" 
                        alt="Grok" 
                        className="absolute left-0 top-0 w-8 h-8 object-contain transition-all duration-500 ease-in-out group-hover:left-0" 
                        style={{ zIndex: 40 }}
                      />
                      <img 
                        src="/lovable-uploads/20ab85cf-422a-46f0-a62a-26fe3db14680.png" 
                        alt="Gemini" 
                        className="absolute left-4 top-0 w-8 h-8 object-contain transition-all duration-500 ease-in-out group-hover:left-8" 
                        style={{ zIndex: 30 }}
                      />
                      <img 
                        src="/lovable-uploads/921c76c7-1c98-41d6-a192-8308c4b7fd49.png" 
                        alt="Perplexity" 
                        className="absolute left-8 top-0 w-8 h-8 object-contain transition-all duration-500 ease-in-out group-hover:left-16" 
                        style={{ zIndex: 20 }}
                      />
                      <img 
                        src="/lovable-uploads/84b583a1-fe3d-4393-ae0a-df3ec0dbd01d.png" 
                        alt="ChatGPT" 
                        className="absolute left-12 top-0 w-8 h-8 object-contain transition-all duration-500 ease-in-out group-hover:left-24" 
                        style={{ zIndex: 10 }}
                      />
                    </div>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visibility Chart */}
        <Card className={`group relative ${demoMode ? 'demo-card-5' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, visibilityTrend: false})}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/c450af84-c4bc-4808-9aef-caf1ef5fb80c.png" alt="Overall AI Visibility Trend" className="w-5 h-5" />
                <span>Overall AI Visibility Trend</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, visibilityTrend: !showTooltips.visibilityTrend})}
                />
                {showTooltips.visibilityTrend && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Track your brand's mention volume across the AI ecosystem over time to identify trends and measure progress.</p>
                  </div>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Your brand's mention volume across the AI ecosystem over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {visibilityTrendData.length === 1 ? (
              <div className="relative h-[250px] flex items-center justify-center bg-gradient-to-b from-background to-muted/20 rounded-lg overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
                
                <div className="relative z-10 flex flex-col items-center max-w-md px-8">
                  {/* Animated progress indicator */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: 'rgba(105, 197, 242, 0.1)' }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(105, 197, 242, 0.2)' }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#69c5f2' }}></div>
                        </div>
                      </div>
                      <div className="absolute -inset-1 rounded-full border-2 animate-[scale-in_2s_ease-in-out_infinite]" style={{ borderColor: 'rgba(105, 197, 242, 0.3)' }}></div>
                    </div>
                    <div className="h-0.5 w-16 relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #69c5f2, rgba(105, 197, 242, 0.5), hsl(var(--muted)))' }}>
                      <div className="absolute inset-0 animate-[slide-in-right_2s_ease-in-out_infinite]" style={{ background: 'linear-gradient(90deg, transparent, #69c5f2, transparent)' }}></div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 222, 248, 0.2)' }}>
                      <div className="w-3 h-3 rounded-full border-2 border-dashed" style={{ borderColor: 'rgba(105, 197, 242, 0.4)' }}></div>
                    </div>
                  </div>

                  {/* Clean centered content */}
                  <div className="text-center space-y-3 animate-fade-in">
                    <h3 className="text-lg font-medium text-foreground">
                      Baseline Established
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your first scan captured <span className="font-semibold text-foreground">450</span> mentions
                    </p>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ backgroundColor: 'rgba(105, 197, 242, 0.05)', borderColor: 'rgba(105, 197, 242, 0.2)' }}>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#69c5f2' }}></div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Waiting for next scan to show trends
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={visibilityTrendData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={1} />
                      <stop offset="50%" stopColor={gradientColors[1]} stopOpacity={0.95} />
                      <stop offset="100%" stopColor={gradientColors[2]} stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeOpacity={0.1}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                      padding: '12px 16px',
                    }}
                    labelStyle={{ 
                      color: 'hsl(var(--foreground))', 
                      fontWeight: 600,
                      fontSize: '13px',
                      marginBottom: '2px'
                    }}
                    itemStyle={{ 
                      color: gradientColors[1],
                      fontSize: '14px',
                      fontWeight: 500,
                      padding: '2px 0'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                  />
                  <Bar 
                    dataKey="mentions" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Source Quality & Authority */}
        <Card className={`group relative self-start ${demoMode ? 'demo-card-6' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, sourceQuality: false})}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/210deded-106c-459a-8f28-05761a09348c.png" alt="Source Quality" className="w-12 h-12" />
                <span>Source Quality & Authority</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, sourceQuality: !showTooltips.sourceQuality})}
                />
                {showTooltips.sourceQuality && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Analysis of the sources AI platforms reference when mentioning Nike vs competitors, including authority level and content freshness from sports industry publications.</p>
                  </div>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Analysis of the sources AI platforms reference when mentioning Nike vs competitors like Adidas, Under Armour, and Puma.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[250px] flex flex-col">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>References</TableHead>
                  <TableHead>Authority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceQuality.slice(0, sourcesDisplayCount).map((source, index) => (
                  <>
                    <TableRow 
                      key={index}
                      onClick={() => setExpandedSource(expandedSource === index ? null : index)}
                      className="animate-fade-in cursor-pointer transition-all duration-200 hover:bg-muted/50"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell className="w-8 pr-0">
                        {expandedSource === index ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell>{source.mentions}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getAuthorityStyles(source.authority)}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {source.authority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row Details */}
                    {expandedSource === index && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-4 space-y-4 animate-fade-in">
                            {/* Top Row: Last Cited, Competitor Badge */}
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Last cited: <span className="text-foreground font-medium">{source.lastCited}</span></span>
                              </div>
                              
                              {source.competitorMentioned && (
                                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                  <Users className="w-3 h-3 mr-1" />
                                  Also cites competitors
                                </Badge>
                              )}
                            </div>
                            
                            {/* Platforms */}
                            <div>
                              <span className="text-xs text-muted-foreground font-medium mb-2 block">AI Platforms using this source:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {source.platforms.map((platform, pIdx) => (
                                  <Badge key={pIdx} variant="secondary" className="text-xs">
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {/* Prompts that referenced this source */}
                            <div>
                              <span className="text-xs text-muted-foreground font-medium mb-2 block">Prompts that cited this source:</span>
                              <div className="space-y-1.5">
                                {source.prompts.map((prompt, pIdx) => (
                                  <div 
                                    key={pIdx} 
                                    className="flex items-center gap-2 text-xs p-2 bg-background rounded-md border cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onQueryClick?.(prompt);
                                    }}
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                    <span className="truncate">{prompt}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Sample Quote */}
                            <div className="bg-background rounded-md p-3 border-l-2 border-primary/40">
                              <div className="flex items-start gap-2">
                                <Quote className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground italic leading-relaxed">{source.sampleQuote}</p>
                              </div>
                            </div>
                            
                            {/* Visit Source Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(source.url, '_blank');
                              }}
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                              Visit Source
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
            
            {/* View More, View All, and Show Less Buttons */}
            {sourceQuality.length > 3 && (
              <div className="flex flex-col items-center gap-3 pt-4 border-t mt-auto">
                {/* Prominent Collapse button when expanded */}
                {sourcesDisplayCount > 5 && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSourcesDisplayCount(3);
                      setExpandedSource(null);
                    }}
                    className="min-w-[200px] transition-all duration-300 hover:scale-105 bg-primary text-primary-foreground shadow-md"
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Collapse to Top 3
                  </Button>
                )}
                
                <div className="flex justify-center gap-3">
                  {sourcesDisplayCount > 3 && sourcesDisplayCount <= 5 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSourcesDisplayCount(3);
                        setExpandedSource(null);
                      }}
                      className="min-w-[120px] transition-all duration-300 hover:scale-105"
                    >
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcesDisplayCount(Math.min(sourcesDisplayCount + 5, sourceQuality.length))}
                    className="min-w-[120px] transition-all duration-300 hover:scale-105"
                    disabled={sourcesDisplayCount >= sourceQuality.length}
                  >
                    View More
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcesDisplayCount(sourceQuality.length)}
                    className="min-w-[120px] transition-all duration-300 hover:scale-105"
                    disabled={sourcesDisplayCount >= sourceQuality.length}
                  >
                    View All ({sourceQuality.length})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>


      {/* AI Platform Mention Distribution */}
      <Card className={`mb-6 group relative ${demoMode ? 'demo-card-7' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, platformDistribution: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/7692f35b-aca5-4d79-ba3e-f7dbcdd6a053.png" alt="AI Platform Mention Distribution" className="w-5 h-5" />
              <span>AI Platform Mention Distribution</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, platformDistribution: !showTooltips.platformDistribution})}
              />
              {showTooltips.platformDistribution && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Visual breakdown of your brand mentions across different AI platforms, helping identify where to focus optimization efforts.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Brand mentions across AI platforms from your generated queries and prompt blasts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Mentions by Platform</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                  className="text-xs h-6"
                >
                  {showAllPlatforms ? "Show Less" : "Show All"}
                </Button>
              </div>
              {isOnlyOneModelSelected ? (
                <div className="flex items-center justify-center h-[250px] border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Select multiple models to view distribution</p>
                    <p className="text-xs text-gray-500">Choose "All models" or multiple specific models from the filter above</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-lg">
                  <div className="flex justify-center items-center">
                    <div className="relative w-48 h-48">
                      {/* Surrounding Donut Chart */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
                        {platformMentionsData.slice(0, 4).map((platform, index) => {
                          const isHovered = hoveredSegment === index;
                          const strokeWidth = isHovered ? 8 : 6;
                          const radius = 45;
                          const circumference = 2 * Math.PI * radius;
                          const segmentLength = (platform.percentage / 100) * circumference;
                          const offset = platformMentionsData.slice(0, index).reduce((acc, p) => acc + (p.percentage / 100) * circumference, 0);
                          const gap = 4; // Smaller gap between segments
                          
                          return (
                            <circle
                              key={index}
                              cx="60"
                              cy="60"
                              r={radius}
                              fill="none"
                              stroke={DONUT_COLORS[index]}
                              strokeWidth={strokeWidth}
                              strokeLinecap="round"
                              strokeDasharray={`${segmentLength - gap} ${circumference - segmentLength + gap}`}
                              strokeDashoffset={-(offset + (index * gap))}
                              className="transition-all duration-300 cursor-pointer"
                              style={{
                                filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                                animationDelay: `${index * 0.2}s`,
                              }}
                              onMouseEnter={() => setHoveredSegment(index)}
                              onMouseLeave={() => setHoveredSegment(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Central Pie Chart */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-20 h-20">
                          {hoveredSegment !== null && (
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#6AA4CC"
                                strokeWidth="0.5"
                                opacity="0.5"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#2D588A"
                                strokeWidth="28"
                                strokeDasharray={`${platformMentionsData[hoveredSegment].percentage * 0.88} 100`}
                                className="transition-all duration-500"
                              />
                            </svg>
                          )}
                          
                          {/* Central Percentage Text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {hoveredSegment !== null ? `${platformMentionsData[hoveredSegment].percentage}%` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Platform Labels */}
                      <div className="absolute inset-0">
                        {platformMentionsData.slice(0, 4).map((platform, index) => {
                          const angle = (platformMentionsData.slice(0, index).reduce((acc, p) => acc + p.percentage, 0) + platform.percentage / 2) * 3.6;
                          const radian = (angle - 90) * (Math.PI / 180);
                          const labelRadius = 70;
                          const x = 50 + Math.cos(radian) * labelRadius;
                          const y = 50 + Math.sin(radian) * labelRadius;
                          
                          return (
                            <div
                              key={index}
                              className={`absolute text-xs font-medium cursor-pointer transition-all duration-300 ${
                                hoveredSegment === index 
                                  ? 'text-gray-900 font-bold transform scale-110' 
                                  : 'text-gray-700 hover:text-gray-900'
                              }`}
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: `translate(-50%, -50%) ${hoveredSegment === index ? 'scale(1.1)' : 'scale(1)'}`,
                                opacity: hoveredSegment === index ? 1 : 0.7,
                                textShadow: hoveredSegment === index ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                              }}
                              onMouseEnter={() => setHoveredSegment(index)}
                              onMouseLeave={() => setHoveredSegment(null)}
                            >
                              {platform.platform}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Breakdown</h4>
              <div className="space-y-3">
                {pieChartData.map((platform, index) => {
                  // Function to get the platform logo
                  const getPlatformLogo = (platformName: string) => {
                    switch (platformName) {
                      case "ChatGPT":
                        return "/lovable-uploads/84b583a1-fe3d-4393-ae0a-df3ec0dbd01d.png";
                      case "Grok":
                        return "/lovable-uploads/771fa115-94bb-4581-ae07-0733d1e93498.png";
                      case "Gemini":
                        return "/lovable-uploads/20ab85cf-422a-46f0-a62a-26fe3db14680.png";
                      case "Perplexity":
                        return "/lovable-uploads/921c76c7-1c98-41d6-a192-8308c4b7fd49.png";
                      default:
                        return null;
                    }
                  };

                  const logo = getPlatformLogo(platform.platform);

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: pieChartColors[index % pieChartColors.length] }}
                        ></div>
                        {logo && (
                          <img 
                            src={logo} 
                            alt={`${platform.platform} logo`} 
                            className="w-12 h-12 object-contain"
                          />
                        )}
                        <span className="text-sm font-medium">{platform.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{platform.mentions}</span>
                        <span className="text-xs text-gray-500">({platform.percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Core Brand Queries */}
      <Card className={`mb-6 group relative ${demoMode ? 'demo-card-8' : ''}`} onMouseLeave={() => setShowTooltips({...showTooltips, coreQueries: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Top Prompts</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, coreQueries: !showTooltips.coreQueries})}
              />
              {showTooltips.coreQueries && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Key search queries and questions where your brand appears most frequently across AI platforms, ranked by relevance score.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            System-generated queries that are most relevant to your brand, based on AI understanding and market analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(listMoreClicked ? coreQueries.slice(0, 8) : coreQueries.slice(0, 4)).map((query, index) => (
              <div 
                key={index} 
                className="group/card relative rounded-lg cursor-pointer"
                onClick={() => onQueryClick?.(query.query)}
              >
                {/* Tracing shimmer effect - only visible on hover */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-lg overflow-hidden pointer-events-none">
                  <div 
                    className="absolute w-20 h-1 rounded-full"
                    style={{ 
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
                      animation: 'trace-border 3s linear infinite'
                    }}
                  />
                </div>
                
                {/* Card content */}
                <div className="relative flex items-center justify-between p-4 bg-background border rounded-lg group-hover/card:border-primary/20 transition-all">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{query.query}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">AI Mentions:</span>
                      <span className="font-medium text-foreground">{query.mentions}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Action Buttons */}
            {coreQueries.length > 4 && (
              <div className="flex items-center justify-center gap-3 pt-4 border-t">
                {!listMoreClicked && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setListMoreClicked(true)}
                    className="min-w-[120px]"
                  >
                    View more
                  </Button>
                )}
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigateToPrompts?.()}
                  className="min-w-[120px]"
                >
                  View all
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      </div>
    </TooltipProvider>
  );
};