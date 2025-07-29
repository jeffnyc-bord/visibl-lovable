import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Eye, FileText, Calendar, MessageSquare, CheckCircle, Star, BarChart3, ChevronDown, ChevronUp, Target, Link, Settings, ExternalLink, HelpCircle } from "lucide-react";
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
}

export const OverviewSection = ({ brandData }: OverviewSectionProps) => {
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

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

  const platformMentions = [
    { platform: "ChatGPT", mentions: 456, sentiment: "positive", coverage: 85, trend: "+12%" },
    { platform: "Claude", mentions: 324, sentiment: "positive", coverage: 78, trend: "+8%" },
    { platform: "Gemini", mentions: 287, sentiment: "neutral", coverage: 72, trend: "+18%" },
    { platform: "Perplexity", mentions: 180, sentiment: "positive", coverage: 65, trend: "+22%" },
    { platform: "Grok", mentions: 145, sentiment: "positive", coverage: 58, trend: "+15%" },
    { platform: "Copilot", mentions: 123, sentiment: "neutral", coverage: 52, trend: "+9%" },
    { platform: "Google AI Mode", mentions: 98, sentiment: "positive", coverage: 45, trend: "+25%" },
    { platform: "Google Overviews", mentions: 87, sentiment: "neutral", coverage: 42, trend: "+18%" },
  ];

  const visibilityTrendData = [
    { month: "Jul", mentions: 890 },
    { month: "Aug", mentions: 1020 },
    { month: "Sep", mentions: 1156 },
    { month: "Oct", mentions: 1089 },
    { month: "Nov", mentions: 1203 },
    { month: "Dec", mentions: 1247 },
  ];

  const coreQueries = [
    { query: "Best running shoes for marathon training", relevanceScore: 92, brand: "Nike", mentions: 145 },
    { query: "Nike Air Max vs Adidas Ultraboost", relevanceScore: 88, brand: "Nike", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", relevanceScore: 75, brand: "Nike", mentions: 67 },
    { query: "Best basketball shoes for performance", relevanceScore: 82, brand: "Nike", mentions: 89 },
  ];

  const sourceQuality = [
    { source: "Official Tesla Website", mentions: 245, authority: "high", freshness: "current" },
    { source: "Reuters (Tesla news)", mentions: 189, authority: "high", freshness: "current" },
    { source: "TechCrunch", mentions: 167, authority: "medium", freshness: "current" },
    { source: "Wikipedia", mentions: 134, authority: "medium", freshness: "outdated" },
    { source: "Tesla Forums", mentions: 98, authority: "low", freshness: "current" },
  ];

  const platformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 28 },
    { platform: "Claude", mentions: 324, percentage: 20 },
    { platform: "Gemini", mentions: 287, percentage: 18 },
    { platform: "Perplexity", mentions: 180, percentage: 11 },
    { platform: "Grok", mentions: 145, percentage: 9 },
    { platform: "Copilot", mentions: 123, percentage: 8 },
    { platform: "Google AI Mode", mentions: 98, percentage: 6 },
    { platform: "Google Overviews", mentions: 87, percentage: 5 },
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

  // Create pie chart data - show top 4 platforms + "Others" when collapsed
  const pieChartData = showAllPlatforms 
    ? platformMentionsData 
    : [
        ...platformMentionsData.slice(0, 4),
        {
          platform: "Others",
          mentions: platformMentionsData.slice(4).reduce((sum, p) => sum + p.mentions, 0),
          percentage: platformMentionsData.slice(4).reduce((sum, p) => sum + p.percentage, 0)
        }
      ];

  const pieChartColors = showAllPlatforms ? COLORS : [...COLORS.slice(0, 4), '#6B7280'];

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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/f5efaad8-a8ef-4c09-a7e6-523328cd1fd8.png" alt="AI Visibility Score" className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-600">AI Visibility Score</span>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2dfd4e75-59fe-4604-9bc8-e9465d077056.png" alt="Total Mentions" className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-600">Total Mentions</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{brandData.totalMentions.toLocaleString()}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                +15%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Industry AI Ranking</span>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Platform Coverage</span>
            </div>
            <div className="mt-2">
              <AIInsightsModal
                trigger={
                  <button className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">
                    {brandData.platformCoverage}
                  </button>
                }
                platforms={platformMentions}
              />
              <span className="text-sm text-gray-600 ml-1">platforms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Summary */}
      <Card className="mb-6 relative overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-md" />
              <div className="relative w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Insights Summary
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative space-y-4">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">+5</div>
              <div className="text-xs text-gray-400">Score Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">+15%</div>
              <div className="text-xs text-gray-400">Mention Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">#1</div>
              <div className="text-xs text-gray-400">Industry Rank</div>
            </div>
          </div>

          {/* Insights Content */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="text-white font-semibold">Nike's AI Visibility Score increased to 87 (+5 points)</span> this period, primarily driven by strong performance on ChatGPT and positive mentions across core brand queries.
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="text-white font-semibold">Key Performance Drivers:</span> ChatGPT leads with 456 mentions (+12%), while Perplexity shows exceptional growth (+22%). Nike dominates in running shoe queries with 92% relevance scores.
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="text-white font-semibold">Strategic Opportunity:</span> Competitors like Adidas are showing increased activity in product-specific mentions. Consider expanding content strategy around sustainability and lifestyle use cases.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
                variant="outline"
              >
                <ExternalLink className="w-3 h-3 mr-1.5" />
                View Details
              </Button>
              <Button 
                size="sm" 
                className="bg-cyan-500/80 hover:bg-cyan-500 text-white border-0"
              >
                <FileText className="w-3 h-3 mr-1.5" />
                Export Summary
              </Button>
            </div>
            <div className="text-xs text-gray-400">
              Updated 2 minutes ago
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visibility Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <img src="/lovable-uploads/c450af84-c4bc-4808-9aef-caf1ef5fb80c.png" alt="Overall AI Visibility Trend" className="w-5 h-5" />
              <span>Overall AI Visibility Trend</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Industry AI Ranking</span>
            </CardTitle>
            <CardDescription>
              Top performing brands in your industry for AI visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {industryRanking.map((brand) => (
                  <TableRow key={brand.rank}>
                    <TableCell className="font-medium">#{brand.rank}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{brand.brand}</span>
                        {brand.brand !== "Nike" && (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* AI Platform Mention Distribution */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <img src="/lovable-uploads/79e7d0e6-2ccc-40a4-a2c4-fa6f2406e0c6.png" alt="AI Platform Mention Distribution" className="w-5 h-5" />
            <span>AI Platform Mention Distribution</span>
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
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="mentions"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Breakdown</h4>
              <div className="space-y-3">
                {pieChartData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: pieChartColors[index % pieChartColors.length] }}
                      ></div>
                      <span className="text-sm font-medium">{platform.platform}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{platform.mentions}</span>
                      <span className="text-xs text-gray-500">({platform.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform-wise Mentions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span>AI Platform Mentions</span>
          </CardTitle>
          <CardDescription>
            Breakdown of brand mentions across different AI platforms and their sentiment analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Mentions</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPlatforms.map((platform, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{platform.platform}</TableCell>
                  <TableCell>{platform.mentions}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSentimentColor(platform.sentiment)}>
                      {platform.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={platform.coverage} className="w-16 h-2" />
                      <span className="text-sm text-gray-600">{platform.coverage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {platform.trend}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {platformMentions.length > 4 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllPlatforms(!showAllPlatforms)}
                className="flex items-center space-x-1"
              >
                {showAllPlatforms ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Show All Platforms ({platformMentions.length})</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Core Brand Queries */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <img src="/lovable-uploads/0fe89acd-e0a5-4388-8a50-3f25de035732.png" alt="Core Brand Queries" className="w-5 h-5" />
            <span>Core Brand Queries</span>
          </CardTitle>
          <CardDescription>
            System-generated queries that are most relevant to your brand, based on AI understanding and market analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coreQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{query.query}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Relevance:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {query.relevanceScore}%
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">AI Mentions:</span>
                      <span className="font-medium">{query.mentions}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={query.relevanceScore} className="w-20 h-2" />
                  <div className="flex items-center space-x-2">
                    {query.relevanceScore < 80 && (
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => window.open('/recommendations?filter=query-optimization', '_blank')}
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Optimize
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Generate optimization recommendations for this query</p>
                        </TooltipContent>
                      </UITooltip>
                    )}
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open('/recommendations?generate=content-blueprint', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate content blueprint for this query</p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Quality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="w-5 h-5 text-orange-500" />
            <span>Source Quality & Authority</span>
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