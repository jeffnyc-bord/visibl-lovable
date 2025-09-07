import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, FileText, Calendar, MessageSquare, CheckCircle, Star, BarChart3, ChevronDown, ChevronUp, Target, Link, Settings, ExternalLink, HelpCircle, Upload, Plus, X, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReportExportDialog } from "@/components/ui/report-export-dialog";
import { AIInsightsModal } from "@/components/ui/ai-insights-modal";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
}

export const OverviewSection = ({ brandData, selectedModels, selectedDateRange, onQueryClick }: OverviewSectionProps) => {
  const { toast } = useToast();
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [showManualAddDialog, setShowManualAddDialog] = useState(false);
  const [industryRankingBrands, setIndustryRankingBrands] = useState<any[]>([]);
  const [manualBrandForm, setManualBrandForm] = useState({ name: "", website: "" });
  
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
    { query: "Best running shoes for marathon training", brand: "Nike", mentions: 145 },
    { query: "Nike Air Max vs Adidas Ultraboost", brand: "Nike", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", brand: "Nike", mentions: 67 },
    { query: "Best basketball shoes for performance", brand: "Nike", mentions: 89 },
  ];

  const sourceQuality = [
    { source: "Official Tesla Website", mentions: 245, authority: "high", freshness: "current" },
    { source: "Reuters (Tesla news)", mentions: 189, authority: "high", freshness: "current" },
    { source: "TechCrunch", mentions: 167, authority: "medium", freshness: "current" },
    { source: "Wikipedia", mentions: 134, authority: "medium", freshness: "outdated" },
    { source: "Tesla Forums", mentions: 98, authority: "low", freshness: "current" },
  ];

  const allPlatformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 36 },
    { platform: "Grok", mentions: 324, percentage: 26 },
    { platform: "Gemini", mentions: 287, percentage: 23 },
    { platform: "Perplexity", mentions: 180, percentage: 15 },
    { platform: "Claude", mentions: 145, percentage: 9 },
    { platform: "Copilot", mentions: 123, percentage: 8 },
    { platform: "Google AI Mode", mentions: 98, percentage: 6 },
    { platform: "Others", mentions: 0, percentage: 0 },
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
        : [
            ...platformMentionsData.slice(0, 4),
            {
              platform: "Others",
              mentions: platformMentionsData.slice(4).reduce((sum, p) => sum + p.mentions, 0),
              percentage: platformMentionsData.slice(4).reduce((sum, p) => sum + p.percentage, 0)
            }
          ])
    : platformMentionsData; // For multiple specific models, show all available data

  const pieChartColors = selectedModels.includes("All models") 
    ? (showAllPlatforms ? COLORS : [...COLORS.slice(0, 4), '#6B7280'])
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
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          }
          brandName={brandData.name}
          reportType="full"
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
              // Default empty state for new users
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Set Up Industry Ranking</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add competitors to see how your brand ranks in AI visibility. Choose to auto-populate from your tracked brands or add manually.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <Button
                    onClick={() => {
                      // Auto-populate from tracked brands (using mock data for now)
                      const trackedBrandsRanking = [
                        { rank: 1, brand: "Apple", score: 95, change: "+3", insight: "Leading in tech innovation queries", link: "/competitors?brand=apple" },
                        { rank: 2, brand: "Nike", score: 87, change: "+2", insight: "Strong in performance & sports queries", link: "/competitors?brand=nike" },
                        { rank: 3, brand: "Adidas", score: 84, change: "-1", insight: "Growing in sustainable product mentions", link: "/competitors?brand=adidas" },
                      ];
                      setIndustryRankingBrands(trackedBrandsRanking);
                      toast({
                        title: "Ranking Auto-Populated",
                        description: "Successfully populated ranking with your tracked brands.",
                      });
                    }}
                    className="flex-1 min-w-0"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Auto Populate
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowManualAddDialog(true)}
                    className="flex-1 min-w-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Competitors Manually
                  </Button>
                </div>
              </div>
            ) : (
              // Show table when brands are added
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
                      <TableRow key={brand.rank}>
                        <TableCell className="font-medium">#{brand.rank}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span>{brand.brand}</span>
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
                          </div>
                        </TableCell>
                        <TableCell>{brand.score}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={
                            brand.change.startsWith('+') ? 'bg-green-100 text-green-800' :
                            brand.change.startsWith('-') ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {brand.change}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
                            onClick={() => {
                              setIndustryRankingBrands(prev => prev.filter(b => b.rank !== brand.rank));
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

        {/* Manual Add Brand Dialog */}
        <Dialog open={showManualAddDialog} onOpenChange={setShowManualAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Competitor Manually</DialogTitle>
              <DialogDescription>
                Add a competitor brand to track in your industry ranking.
              </DialogDescription>
            </DialogHeader>
            
            {/* Brand Limit Info */}
            <div className="bg-muted/50 border rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Tracked Brands</span>
                <span className="text-sm text-muted-foreground">
                  {currentBrandCount} / {maxBrands} (Standard Tier)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    currentBrandCount >= maxBrands ? 'bg-destructive' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min((currentBrandCount / maxBrands) * 100, 100)}%` }}
                />
              </div>
              {currentBrandCount >= maxBrands && (
                <p className="text-xs text-destructive mt-2">
                  You've reached your brand limit. Upgrade to Premium for 15 brands or Enterprise for 50 brands.
                </p>
              )}
            </div>

            {currentBrandCount >= maxBrands ? (
              // Show upgrade prompt when at limit
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Brand Limit Reached</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You're currently tracking {currentBrandCount} brands on the Standard Tier. 
                  Upgrade to add more competitors to your ranking.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowManualAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            ) : (
              // Show form when under limit
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brand-name">
                      Brand Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brand-name"
                      value={manualBrandForm.name}
                      onChange={(e) => setManualBrandForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter competitor name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">
                      Website URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="website"
                      value={manualBrandForm.website}
                      onChange={(e) => setManualBrandForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://competitor.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll use this to analyze their AI visibility and gather insights.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowManualAddDialog(false);
                    setManualBrandForm({ name: "", website: "" });
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (!manualBrandForm.name.trim() || !manualBrandForm.website.trim()) return;
                      
                      const newBrand = {
                        rank: industryRankingBrands.length + 1,
                        brand: manualBrandForm.name,
                        score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
                        change: Math.random() > 0.5 ? "+1" : "0",
                        insight: `Growing presence in AI mentions`,
                        link: `/competitors?brand=${manualBrandForm.name.toLowerCase()}`
                      };
                      
                      setIndustryRankingBrands(prev => [...prev, newBrand]);
                      toast({
                        title: "Competitor Added",
                        description: `${manualBrandForm.name} has been added to your ranking.`,
                      });
                      setShowManualAddDialog(false);
                      setManualBrandForm({ name: "", website: "" });
                    }}
                    disabled={!manualBrandForm.name.trim() || !manualBrandForm.website.trim()}
                  >
                    Add Competitor
                  </Button>
                </DialogFooter>
              </>
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
            {coreQueries.map((query, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all"
                onClick={() => onQueryClick?.(query.query)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{query.query}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">AI Mentions:</span>
                    <span className="font-medium">{query.mentions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Quality Analysis */}
      <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, sourceQuality: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-orange-500" />
              <span>Source Quality & Authority</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, sourceQuality: !showTooltips.sourceQuality})}
              />
              {showTooltips.sourceQuality && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Analysis of the sources AI platforms reference when mentioning your brand, including authority level and content freshness.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Analysis of the sources AI platforms reference when mentioning your brand.
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