import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, FileText, Calendar, MessageSquare, CheckCircle, Star, BarChart3, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Target, Link, Settings, ExternalLink, HelpCircle, Upload, Plus, X, Globe, Loader2, Image as ImageIcon, Building, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReportExportDialog } from "@/components/ui/report-export-dialog";
import { AIInsightsModal } from "@/components/ui/ai-insights-modal";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { IndustryRankingEmpty } from "@/components/ui/industry-ranking-empty";
import { GradientMetricCard, GradientBadge, FeatureCard } from "@/components/ui/gradient-cards";
import boardLabsIcon from "@/assets/board-labs-icon-hex.png";

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
}

export const OverviewSection = ({ brandData, selectedModels, selectedDateRange, onQueryClick, onNavigateToPrompts, userRole = "business_user" }: OverviewSectionProps) => {
  const { toast } = useToast();
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [showManualAddDialog, setShowManualAddDialog] = useState(false);
  const [addCompetitorStep, setAddCompetitorStep] = useState(1);
  const [industryRankingBrands, setIndustryRankingBrands] = useState<any[]>([]);
  const [loadingBrands, setLoadingBrands] = useState<string[]>([]);
  const [manualBrandForm, setManualBrandForm] = useState({ name: "", website: "", reportFrequency: "", logoFile: null as File | null, logoPreview: "" });
  
  // State for Top Prompts section
  const [listMoreClicked, setListMoreClicked] = useState(false);
  
  // Brand limits based on tier
  const TIER_LIMITS = {
    standard: 5,
    premium: 15,
    enterprise: 50
  };
  
  const currentTier = "standard"; // This would come from user subscription data
  const maxBrands = TIER_LIMITS[currentTier];
  const currentBrandCount = 3; // This would come from actual tracked brands count

  const visibilityData = [
    { month: "Jul", score: 75 },
    { month: "Aug", score: 78 },
    { month: "Sep", score: 82 },
    { month: "Oct", score: 80 },
    { month: "Nov", score: 85 },
    { month: "Dec", score: 87 },
  ];

  const industryRanking = [
    { rank: 1, brand: "Nike", score: 87, change: "+2", insight: "Leading in performance-focused queries", link: "/competitors?brand=nike" },
    { rank: 2, brand: "Adidas", score: 85, change: "-1", insight: "Strong in sustainable product queries", link: "/competitors?brand=adidas" },
    { rank: 3, brand: "Under Armour", score: 82, change: "+1", insight: "Growing in tech & innovation mentions", link: "/competitors?brand=under-armour" },
    { rank: 4, brand: "Puma", score: 78, change: "0", insight: "Stable in lifestyle & fashion segments", link: "/competitors?brand=puma" },
    { rank: 5, brand: "New Balance", score: 76, change: "+3", insight: "Rising in comfort & wellness categories", link: "/competitors?brand=new-balance" },
  ];

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

  const visibilityTrendData = [
    { month: "Jul", mentions: 890 },
    { month: "Aug", mentions: 1020 },
    { month: "Sep", mentions: 1156 },
    { month: "Oct", mentions: 1089 },
    { month: "Nov", mentions: 1203 },
    { month: "Dec", mentions: 1247 },
  ];

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

  const sourceQuality = [
    { source: "Nike.com (Official)", mentions: 342, authority: "high", freshness: "current" },
    { source: "ESPN Sports Analysis", mentions: 298, authority: "high", freshness: "current" },
    { source: "Footwear News Industry", mentions: 215, authority: "high", freshness: "current" },
    { source: "Complex Sneakers Reviews", mentions: 187, authority: "medium", freshness: "current" },
    { source: "Runner's World Gear Tests", mentions: 156, authority: "medium", freshness: "current" },
    { source: "Sneaker Community Forums", mentions: 123, authority: "low", freshness: "current" },
  ];

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
          <h2 className="text-2xl font-bold text-foreground">AI Visibility Overview</h2>
          <p className="text-muted-foreground">Comprehensive AI visibility metrics and platform insights for {brandData.name}</p>
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
        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, visibilityScore: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/b3896000-028e-49c5-b74f-04e22725b257.png" alt="AI Visibility Score" className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">AI Visibility Score</span>
              </div>
              <div className="relative">
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
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-blue-600">{brandData.visibilityScore}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                {brandData.mentionTrend === "up" ? "+" : ""}5
              </Badge>
            </div>
            <Progress value={brandData.visibilityScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, totalMentions: false})}>
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

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, industryRanking: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Industry AI Ranking</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, industryRanking: !showTooltips.industryRanking})}
                />
                {showTooltips.industryRanking && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Your brand's ranking compared to competitors in your industry based on AI platform visibility and mentions.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-green-600">#{brandData.industryRanking}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                +2
              </Badge>
            </div>
            <div className="text-sm text-gray-600 mt-1">Among industry brands</div>
          </CardContent>
        </Card>

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, platformCoverage: false})}>
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

      {/* Elegant Gradient Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GradientMetricCard
          title="Visibility Trend"
          value="+23%"
          change="vs last month"
          icon={<TrendingUp className="w-5 h-5" />}
          gradient="purple"
        />
        <GradientMetricCard
          title="AI Platform Reach"
          value={brandData.platforms.length}
          change="platforms"
          icon={<MessageSquare className="w-5 h-5" />}
          gradient="blue"
        />
        <GradientMetricCard
          title="Sentiment Score"
          value={`${brandData.sentimentScore}%`}
          change="positive"
          icon={<Star className="w-5 h-5" />}
          gradient="pink"
        />
      </div>

      {/* Quick Insights with Gradient Badges */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Quick Insights
          </CardTitle>
          <CardDescription>
            Key highlights from your AI visibility performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Strong Momentum"
              description={`Your visibility score increased by 5 points this week, ranking you #${brandData.industryRanking} in your industry.`}
              gradient="purple"
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Platform Coverage"
              description={`Active presence across ${brandData.platforms.length} major AI platforms with ${brandData.totalMentions.toLocaleString()} total mentions.`}
              gradient="blue"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
            <GradientBadge variant="primary">
              <Star className="w-3.5 h-3.5" />
              Top Performer
            </GradientBadge>
            <GradientBadge variant="success">
              {brandData.mentionTrend === "up" ? "↑" : "→"} Trending Up
            </GradientBadge>
            <GradientBadge variant="info">
              {brandData.platformCoverage}% Coverage
            </GradientBadge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visibility Chart */}
        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, visibilityTrend: false})}>
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
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={visibilityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mentions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Ranking */}
        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, industryRankingChart: false})}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Industry AI Ranking</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, industryRankingChart: !showTooltips.industryRankingChart})}
                />
                {showTooltips.industryRankingChart && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>See how your brand ranks against top competitors in AI visibility scores and track position changes over time.</p>
                  </div>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Compare your brand's AI visibility against competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {industryRankingBrands.length === 0 ? (
              <IndustryRankingEmpty onAddCompetitor={() => setShowManualAddDialog(true)} />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {industryRankingBrands.length} competitors tracked
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowManualAddDialog(true)}
                      className="text-xs h-7"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add More
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {industryRankingBrands.map((brand) => (
                      <TableRow key={brand.rank} className={brand.isLoading ? "opacity-70" : ""}>
                        <TableCell className="font-medium">#{brand.rank}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {brand.isLoading && (
                              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                            )}
                            <span>{brand.brand}</span>
                            {brand.isLoading && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                Scanning...
                              </Badge>
                            )}
                            {!brand.isLoading && (
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
                                    onClick={() => window.open(brand.link, '_blank')}
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="text-xs">{brand.insight}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Click to compare in Competitors tab</p>
                                </TooltipContent>
                              </UITooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {brand.isLoading ? (
                            <Skeleton className="h-4 w-8" />
                          ) : (
                            brand.score
                          )}
                        </TableCell>
                        <TableCell>
                          {brand.isLoading ? (
                            <Skeleton className="h-4 w-8" />
                          ) : (
                            <Badge variant="secondary" className={
                              brand.change.startsWith('+') ? 'bg-green-100 text-green-800' :
                              brand.change.startsWith('-') ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {brand.change}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
                            disabled={brand.isLoading}
                            onClick={() => {
                              setIndustryRankingBrands(prev => prev.filter(b => b.rank !== brand.rank));
                              setLoadingBrands(prev => prev.filter(name => name !== brand.brand));
                              toast({
                                title: "Brand Removed",
                                description: `${brand.brand} has been removed from the ranking.`,
                              });
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* Manual Add Brand Dialog - Sleek Apple-like Design */}
        <Dialog open={showManualAddDialog} onOpenChange={(open) => {
          setShowManualAddDialog(open);
          if (!open) {
            setAddCompetitorStep(1);
            setManualBrandForm({ name: "", website: "", reportFrequency: "", logoFile: null, logoPreview: "" });
          }
        }}>
          <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-8 border-b">
              <div className="relative z-10">
                {/* Title at top */}
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-semibold text-center">
                    Add Competitor Brand
                  </DialogTitle>
                </DialogHeader>

                {/* Description */}
                <DialogDescription className="text-base text-muted-foreground text-center mb-6">
                  Track a competitor to compare AI visibility metrics
                </DialogDescription>

                {/* Board Labs Logo + Plus Icon */}
                <div className="flex justify-center items-center mb-6">
                  <div className="flex items-center gap-6">
                    {/* Board Labs Logo */}
                    <div className="w-16 h-16 rounded-full border bg-white shadow-sm flex items-center justify-center p-2">
                      <img 
                        src={boardLabsIcon} 
                        alt="Board Labs" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Connecting Line */}
                    <div className="h-px w-16 bg-border relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rotate-45 translate-x-1" />
                    </div>
                    
                    {/* Plus Icon */}
                    <div className="w-16 h-16 rounded-full border bg-white shadow-sm flex items-center justify-center">
                      <Plus className="h-7 w-7 text-foreground stroke-[1.5]" />
                    </div>
                  </div>
                </div>

                {/* Step indicator */}
                <div className="mt-6 flex items-center justify-center gap-6">
                  {[
                    { num: 1, label: "Info" },
                    { num: 2, label: "Settings" },
                    { num: 3, label: "Logo" }
                  ].map((step, idx) => (
                    <div key={step.num} className="flex items-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          step.num <= addCompetitorStep 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step.num}
                        </div>
                        <span className={`text-xs font-medium transition-colors ${
                          step.num <= addCompetitorStep ? 'text-primary' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < 2 && (
                        <div className={`w-12 h-0.5 mx-2 mb-6 transition-colors ${
                          step.num < addCompetitorStep ? 'bg-primary' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-8">
              <div className="min-h-[240px]">
                {currentBrandCount >= maxBrands ? (
                // Show upgrade message when limit is reached
                <div className="relative text-center py-16 space-y-6 animate-fade-in">
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950/30 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <Target className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Brand Limit Reached</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-4">
                      You've reached the maximum of <span className="font-bold text-foreground">{maxBrands} brands</span> on your <span className="font-semibold text-foreground capitalize">{currentTier}</span> plan.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{currentBrandCount}/{maxBrands}</span>
                      <span className="text-muted-foreground">brands tracked</span>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center pt-6">
                    <Button variant="outline" size="lg" onClick={() => setShowManualAddDialog(false)}>
                      Close
                    </Button>
                    <Button size="lg">
                      <Star className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              ) : (
                // Show funnel steps
                <>
                  {/* Step 1: Basic Information */}
                  {addCompetitorStep === 1 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="brand-name" className="text-base font-semibold flex items-center gap-2">
                            Brand Name <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="brand-name"
                              value={manualBrandForm.name}
                              onChange={(e) => setManualBrandForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Competitor Brand"
                              className="pl-12 h-14 text-base border-2 focus:border-primary transition-all"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="website" className="text-base font-semibold flex items-center gap-2">
                            Website URL <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                              id="website"
                              value={manualBrandForm.website}
                              onChange={(e) => setManualBrandForm(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://competitor.com"
                              className="pl-12 h-14 text-base border-2 focus:border-primary transition-all"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 pl-1">
                            <Eye className="w-4 h-4" />
                            We'll analyze their AI visibility and gather competitive insights
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Monitoring Preferences */}
                  {addCompetitorStep === 2 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="report-frequency" className="text-base font-semibold">
                            How often do you want to track this competitor? <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={manualBrandForm.reportFrequency}
                            onValueChange={(value) => setManualBrandForm(prev => ({ ...prev, reportFrequency: value }))}
                          >
                            <SelectTrigger className="h-14 text-base border-2 focus:border-primary transition-all">
                              <SelectValue placeholder="Select monitoring frequency" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-2 shadow-xl z-50">
                              <SelectItem value="daily" disabled className="text-muted-foreground py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5" />
                                  <div>
                                    <div className="font-medium">Once daily</div>
                                    <div className="text-xs">Enterprise only</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="weekly" className="py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5" />
                                  <div>
                                    <div className="font-medium">Once a week</div>
                                    <div className="text-xs text-muted-foreground">Recommended for most brands</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="twiceweekly" className="py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5" />
                                  <div className="font-medium">Twice a week</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="biweekly" className="py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5" />
                                  <div className="font-medium">Biweekly</div>
                                </div>
                              </SelectItem>
                              <SelectItem value="monthly" className="py-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5" />
                                  <div className="font-medium">Monthly</div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 pl-1">
                            <BarChart3 className="w-4 h-4" />
                            More frequent tracking helps identify trends faster
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Logo Upload */}
                  {addCompetitorStep === 3 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">
                            Brand Logo <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                          </Label>
                          
                          <div className="space-y-4">
                            {!manualBrandForm.logoPreview ? (
                              <div className="relative group/upload">
                                <Input
                                  id="competitor-logo"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setManualBrandForm(prev => ({
                                          ...prev,
                                          logoFile: file,
                                          logoPreview: event.target?.result as string
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-2xl p-16 text-center transition-all duration-300 group-hover/upload:border-primary/60 group-hover/upload:bg-primary/5 cursor-pointer">
                                  
                                  <div className="relative flex flex-col items-center gap-4">
                                    <div className="p-6 bg-primary/10 rounded-3xl group-hover/upload:scale-110 transition-transform duration-300">
                                      <Upload className="h-10 w-10 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-lg font-semibold text-foreground mb-2">Upload Brand Logo</p>
                                      <p className="text-sm text-muted-foreground">Drop your file here or click to browse</p>
                                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or SVG • Max 5MB</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-primary/20 rounded-2xl p-6 bg-primary/5 animate-scale-in">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl border-2 border-primary/20 bg-background p-2 flex items-center justify-center overflow-hidden shadow-lg">
                                      <img 
                                        src={manualBrandForm.logoPreview} 
                                        alt="Logo preview" 
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-base font-semibold text-foreground flex items-center gap-2">
                                        Logo uploaded successfully
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      </p>
                                      <p className="text-sm text-muted-foreground">Ready to track this brand</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setManualBrandForm(prev => ({ ...prev, logoFile: null, logoPreview: "" }))}
                                    className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <X className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground text-center">
                              Skip this step if you don't have a logo handy
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              </div>
            </div>
            
            {/* Footer Actions */}
            {currentBrandCount < maxBrands && (
              <div className="px-8 py-5 border-t bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                  {addCompetitorStep > 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setAddCompetitorStep(prev => prev - 1)}
                      className="h-10 px-5 hover:bg-muted transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setShowManualAddDialog(false);
                        setAddCompetitorStep(1);
                        setManualBrandForm({ name: "", website: "", reportFrequency: "", logoFile: null, logoPreview: "" });
                      }}
                      className="h-10 px-5 hover:bg-muted transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  )}

                  {addCompetitorStep < 3 ? (
                    <Button 
                      onClick={() => setAddCompetitorStep(prev => prev + 1)}
                      disabled={
                        (addCompetitorStep === 1 && (!manualBrandForm.name.trim() || !manualBrandForm.website.trim())) ||
                        (addCompetitorStep === 2 && !manualBrandForm.reportFrequency)
                      }
                      className="h-10 px-6"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        if (!manualBrandForm.name.trim() || !manualBrandForm.website.trim() || !manualBrandForm.reportFrequency) return;
                        
                        const placeholderBrand = {
                          rank: industryRankingBrands.length + 1,
                          brand: manualBrandForm.name,
                          score: 0,
                          change: "0",
                          insight: "Analyzing brand data...",
                          link: `/competitors?brand=${manualBrandForm.name.toLowerCase()}`,
                          isLoading: true
                        };
                        
                        setIndustryRankingBrands(prev => [...prev, placeholderBrand]);
                        setLoadingBrands(prev => [...prev, manualBrandForm.name]);
                        
                        toast({
                          title: "Scanning Brand",
                          description: `Collecting data for ${manualBrandForm.name}...`,
                        });
                        
                        const brandName = manualBrandForm.name;
                        setShowManualAddDialog(false);
                        setAddCompetitorStep(1);
                        setManualBrandForm({ name: "", website: "", reportFrequency: "", logoFile: null, logoPreview: "" });
                        
                        // Simulate data collection process
                        setTimeout(() => {
                          setIndustryRankingBrands(prev => 
                            prev.map(b => 
                              b.brand === brandName && b.isLoading
                                ? {
                                    ...b,
                                    score: Math.floor(Math.random() * 30) + 70,
                                    change: Math.random() > 0.5 ? "+1" : "0",
                                    insight: "Growing presence in AI mentions",
                                    isLoading: false
                                  }
                                : b
                            )
                          );
                          
                          setLoadingBrands(prev => prev.filter(name => name !== brandName));
                          
                          toast({
                            title: "Data Collection Complete",
                            description: `Successfully analyzed ${brandName}.`,
                          });
                        }, 3000);
                      }}
                      className="h-10 px-6"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add & Start Tracking
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>


      {/* AI Platform Mention Distribution */}
      <Card className="mb-6 group relative" onMouseLeave={() => setShowTooltips({...showTooltips, platformDistribution: false})}>
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
      <Card className="mb-6 group relative" onMouseLeave={() => setShowTooltips({...showTooltips, coreQueries: false})}>
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

      {/* Source Quality Analysis */}
      <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, sourceQuality: false})}>
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>References</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Freshness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sourceQuality.map((source, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{source.source}</TableCell>
                  <TableCell>{source.mentions}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getAuthorityColor(source.authority)}>
                      {source.authority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={source.freshness === "current" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {source.freshness}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
};