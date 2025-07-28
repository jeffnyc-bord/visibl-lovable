
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, ExternalLink, Target, Plus, Filter, BarChart3, LineChart, Crown, AlertTriangle, CheckCircle, Settings, Trophy, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart as RechartsLineChart, Line, Area, AreaChart, ComposedChart } from "recharts";
import { useState } from "react";

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

interface CompetitorSectionProps {
  brandData: BrandData;
}

export const CompetitorSection = ({ brandData }: CompetitorSectionProps) => {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(["Adidas", "Under Armour", "New Balance"]);
  const [dateRange, setDateRange] = useState("30");
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");
  const [customColumns, setCustomColumns] = useState<string[]>(["aiVisibility", "aiMentions", "sentiment", "topProducts"]);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);

  const competitors = [
    {
      name: "Adidas",
      domain: "adidas.com",
      aiVisibility: 89,
      marketShare: 24,
      trend: "up",
      trendValue: 12,
      keyProducts: ["Boost Technology", "Ultraboost", "Stan Smith", "Predator"],
      aiMentions: 342,
      sentiment: 8.4,
      ranking: 1
    },
    {
      name: "Under Armour",
      domain: "underarmour.com",
      aiVisibility: 76,
      marketShare: 18,
      trend: "down",
      trendValue: -5,
      keyProducts: ["HOVR Technology", "Curry Basketball", "HeatGear", "ColdGear"],
      aiMentions: 298,
      sentiment: 7.9,
      ranking: 2
    },
    {
      name: "New Balance",
      domain: "newbalance.com",
      aiVisibility: 72,
      marketShare: 12,
      trend: "up",
      trendValue: 15,
      keyProducts: ["Fresh Foam", "990 Series", "FuelCell", "Made in USA"],
      aiMentions: 189,
      sentiment: 8.1,
      ranking: 3
    },
    {
      name: "Puma",
      domain: "puma.com",
      aiVisibility: 68,
      marketShare: 15,
      trend: "up",
      trendValue: 8,
      keyProducts: ["Nitro Technology", "Suede Classic", "RS-X", "King Football"],
      aiMentions: 234,
      sentiment: 7.6,
      ranking: 4
    }
  ];

  // Top prompts data for battleground section
  const topPrompts = [
    {
      prompt: "What are the best running shoes for marathon training?",
      yourResult: "Not Mentioned",
      winningBrand: "Adidas",
      winnerPosition: "#1",
      impact: "high",
      category: "Product Recommendation"
    },
    {
      prompt: "Which athletic brand has the most sustainable manufacturing practices?",
      yourResult: "Mentioned #4",
      winningBrand: "Adidas", 
      winnerPosition: "#1",
      impact: "high",
      category: "Brand Values"
    },
    {
      prompt: "Best basketball shoes for performance and comfort?",
      yourResult: "Not Mentioned",
      winningBrand: "Under Armour",
      winnerPosition: "#1", 
      impact: "medium",
      category: "Product Recommendation"
    },
    {
      prompt: "Most comfortable athletic wear for workout sessions?",
      yourResult: "Mentioned #3",
      winningBrand: "Under Armour",
      winnerPosition: "#1",
      impact: "medium",
      category: "Product Recommendation"
    },
    {
      prompt: "Which brand offers the best technology in athletic footwear?",
      yourResult: "Not Mentioned",
      winningBrand: "Adidas",
      winnerPosition: "#1",
      impact: "high",
      category: "Technology/Innovation"
    }
  ];

  const yourBrand = {
    name: "Nike",
    aiVisibility: 65,
    marketShare: 10,
    aiMentions: 156,
    sentiment: 7.2,
    ranking: 7
  };

  // Create leaderboard with your brand included
  const leaderboard = [...competitors, yourBrand]
    .sort((a, b) => b.aiVisibility - a.aiVisibility)
    .map((brand, index) => ({ ...brand, position: index + 1 }));

  // Performance insights
  const getPerformanceInsights = () => {
    const avgVisibility = competitors.reduce((sum, c) => sum + c.aiVisibility, 0) / competitors.length;
    const avgMentions = competitors.reduce((sum, c) => sum + c.aiMentions, 0) / competitors.length;
    const avgSentiment = competitors.reduce((sum, c) => sum + c.sentiment, 0) / competitors.length;
    
    return {
      visibilityGap: avgVisibility - yourBrand.aiVisibility,
      mentionsGap: avgMentions - yourBrand.aiMentions,
      sentimentAdvantage: yourBrand.sentiment - avgSentiment,
      strongestCompetitor: competitors.find(c => c.aiVisibility === Math.max(...competitors.map(comp => comp.aiVisibility))),
      weakestCompetitor: competitors.find(c => c.aiVisibility === Math.min(...competitors.map(comp => comp.aiVisibility)))
    };
  };

  const insights = getPerformanceInsights();

  // Multi-metric comparison data
  const comparisonData = [
    { 
      brand: "Nike", 
      aiVisibility: yourBrand.aiVisibility,
      mentions: yourBrand.aiMentions,
      sentiment: yourBrand.sentiment * 10
    },
    ...competitors
      .filter(c => selectedCompetitors.includes(c.name))
      .map(c => ({
        brand: c.name,
        aiVisibility: c.aiVisibility,
        mentions: c.aiMentions,
        sentiment: c.sentiment * 10
      }))
  ];

  // Chart data for AI Visibility comparison
  const visibilityData = [
    { name: "Nike", value: yourBrand.aiVisibility },
    ...competitors
      .filter(c => selectedCompetitors.includes(c.name))
      .map(c => ({ name: c.name, value: c.aiVisibility }))
  ];

  // Chart data for mentions over time (mock data)
  const mentionsTimeData = [
    { date: "Week 1", "Nike": 35, "Adidas": 85, "Under Armour": 72, "New Balance": 47, "Puma": 58 },
    { date: "Week 2", "Nike": 42, "Adidas": 88, "Under Armour": 70, "New Balance": 52, "Puma": 61 },
    { date: "Week 3", "Nike": 38, "Adidas": 92, "Under Armour": 68, "New Balance": 49, "Puma": 59 },
    { date: "Week 4", "Nike": 41, "Adidas": 95, "Under Armour": 74, "New Balance": 51, "Puma": 56 }
  ];

  const handleCompetitorToggle = (competitorName: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitorName)
        ? prev.filter(name => name !== competitorName)
        : [...prev, competitorName]
    );
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Interactive Leaderboard Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <img src="/lovable-uploads/9ed4aa18-f1e1-454e-9a51-5342807e8e7a.png" alt="Competitive Landscape" className="w-5 h-5" />
            <span>Nike's Competitive AI Landscape</span>
          </CardTitle>
          <CardDescription>
            Understand where Nike stands and identify opportunities to outperform athletic competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Interactive Leaderboard */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">AI Visibility Leaderboard</h4>
                </div>
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((brand, index) => (
                    <div 
                      key={brand.name} 
                      className={`flex items-center justify-between p-2 rounded ${
                        brand.name === 'Nike' 
                          ? 'bg-blue-200 border-2 border-blue-400' 
                          : 'bg-white/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className={`text-sm ${brand.name === 'Nike' ? 'font-bold' : ''}`}>
                          {brand.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{brand.aiVisibility}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Visibility Gap</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">-{insights.visibilityGap.toFixed(1)}%</div>
                  <div className="text-xs text-red-700">Behind industry average</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Sentiment Advantage</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {insights.sentimentAdvantage > 0 ? '+' : ''}{insights.sentimentAdvantage.toFixed(1)}
                  </div>
                  <div className="text-xs text-green-700">
                    {insights.sentimentAdvantage > 0 ? 'Above' : 'Below'} industry average
                  </div>
                </div>
              </div>

              {/* Key Competitive Narrative */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Competitive Narrative</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>{insights.strongestCompetitor?.name}</strong> leads with {insights.strongestCompetitor?.aiVisibility}% visibility and high mention volume in athletic wear</p>
                  <p>• Nike maintains {insights.sentimentAdvantage > 0 ? 'stronger' : 'competitive'} sentiment quality despite lower visibility</p>
                  <p>• <strong>Opportunity:</strong> Focus on athletic performance content to increase mention frequency while maintaining brand sentiment</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Performance Charts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Multi-Metric Performance Analysis</span>
          </CardTitle>
          <CardDescription>
            Visualize how Nike's performance compares across key metrics in the athletic industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Visibility & Mentions Comparison */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Visibility vs. Mentions Volume</h4>
              <ChartContainer
                config={{
                  aiVisibility: { label: "AI Visibility %", color: "hsl(var(--chart-1))" },
                  mentions: { label: "AI Mentions", color: "hsl(var(--chart-2))" }
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonData}>
                    <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="aiVisibility" fill="hsl(var(--chart-1))" radius={4} />
                    <Line yAxisId="right" type="monotone" dataKey="mentions" stroke="hsl(var(--chart-2))" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Sentiment Quality Analysis */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Sentiment Quality Comparison</h4>
              <ChartContainer
                config={{
                  sentiment: { label: "Sentiment Score", color: "hsl(var(--chart-3))" }
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sentiment" fill="hsl(var(--chart-3))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Prompt Battleground Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Top Prompt Battleground</span>
          </CardTitle>
          <CardDescription>
            See which athletic brands win on the most important AI prompts in sportswear industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPrompts.map((prompt, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-medium mb-1">{prompt.prompt}</h5>
                    <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                  </div>
                  <Badge 
                    variant={prompt.impact === "high" ? "destructive" : "secondary"}
                    className="ml-2"
                  >
                    {prompt.impact} impact
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Winner:</span>
                    <span className="font-semibold text-green-600">{prompt.winningBrand}</span>
                    <Badge variant="secondary" className="text-xs">{prompt.winnerPosition}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Nike's Result:</span>
                    <span className={`font-semibold ${
                      prompt.yourResult === "Not Mentioned" ? "text-red-600" : "text-orange-600"
                    }`}>
                      {prompt.yourResult}
                    </span>
                  </div>
                </div>
                
                {prompt.yourResult === "Not Mentioned" && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="text-sm text-red-700">
                      <strong>Opportunity:</strong> This high-impact athletic prompt represents a key visibility gap. 
                      Consider creating Nike content that addresses this sportswear query.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Competitive Comparison Dashboard */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Competitive Comparison Dashboard</span>
              </CardTitle>
              <CardDescription>
                Customizable deep-dive analysis with actionable insights
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowColumnCustomizer(!showColumnCustomizer)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize Columns
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === "table" ? "charts" : "table")}
              >
                {viewMode === "table" ? <LineChart className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                {viewMode === "table" ? "Charts View" : "Table View"}
              </Button>
              <ExportDialog
                trigger={
                  <Button variant="outline" size="sm">
                    Export Report
                  </Button>
                }
                title="Export Competitor Analysis"
                description="Export detailed competitor analysis report in your preferred format."
                exportType="report"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Column Customizer */}
          {showColumnCustomizer && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Customize Table Columns</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "aiVisibility", label: "AI Visibility" },
                  { id: "aiMentions", label: "AI Mentions" },
                  { id: "sentiment", label: "Sentiment" },
                  { id: "topProducts", label: "Top Products" },
                  { id: "marketShare", label: "Market Share" },
                  { id: "trend", label: "Trend" }
                ].map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={customColumns.includes(column.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomColumns([...customColumns, column.id]);
                        } else {
                          setCustomColumns(customColumns.filter(id => id !== column.id));
                        }
                      }}
                    />
                    <label htmlFor={column.id} className="text-sm cursor-pointer">
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Select Competitors:</span>
              {competitors.map((competitor) => (
                <div key={competitor.name} className="flex items-center space-x-1">
                  <Checkbox
                    id={competitor.name}
                    checked={selectedCompetitors.includes(competitor.name)}
                    onCheckedChange={() => handleCompetitorToggle(competitor.name)}
                  />
                  <label htmlFor={competitor.name} className="text-xs cursor-pointer">
                    {competitor.name}
                  </label>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Competitor
            </Button>
          </div>

          {viewMode === "table" ? (
            /* Comparison Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Metric</TableHead>
                    <TableHead className="text-center">Nike</TableHead>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableHead key={competitor.name} className="text-center">
                          {competitor.name}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AI Visibility</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-blue-600">{yourBrand.aiVisibility}%</span>
                        <Progress value={yourBrand.aiVisibility} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-blue-600">{competitor.aiVisibility}%</span>
                            <Progress value={competitor.aiVisibility} className="w-16 h-2" />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Market Share</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-green-600">{yourBrand.marketShare}%</span>
                        <Progress value={yourBrand.marketShare} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-green-600">{competitor.marketShare}%</span>
                            <Progress value={competitor.marketShare} className="w-16 h-2" />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Mentions</TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-purple-600">{yourBrand.aiMentions}</span>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <span className="text-lg font-bold text-purple-600">{competitor.aiMentions}</span>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sentiment Score</TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-orange-600">{yourBrand.sentiment}/10</span>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <span className="text-lg font-bold text-orange-600">{competitor.sentiment}/10</span>
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Charts View */
            <div className="space-y-8">
              {/* AI Visibility Comparison Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">AI Visibility Comparison</h4>
                <ChartContainer
                  config={{
                    value: {
                      label: "AI Visibility %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visibilityData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Mentions Trend Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">AI Mentions Trend (Last 30 Days)</h4>
                <ChartContainer
                  config={{
                    "Nike": {
                      label: "Nike",
                      color: "hsl(var(--chart-1))",
                    },
                    "Adidas": {
                      label: "Adidas",
                      color: "hsl(var(--chart-2))",
                    },
                    "Under Armour": {
                      label: "Under Armour", 
                      color: "hsl(var(--chart-3))",
                    },
                    "New Balance": {
                      label: "New Balance",
                      color: "hsl(var(--chart-4))",
                    },
                    "Puma": {
                      label: "Puma",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={mentionsTimeData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="Nike" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                      />
                      {selectedCompetitors.includes("Adidas") && (
                        <Line 
                          type="monotone" 
                          dataKey="Adidas" 
                          stroke="hsl(var(--chart-2))" 
                          strokeWidth={2}
                        />
                      )}
                      {selectedCompetitors.includes("Under Armour") && (
                        <Line 
                          type="monotone" 
                          dataKey="Under Armour" 
                          stroke="hsl(var(--chart-3))" 
                          strokeWidth={2}
                        />
                      )}
                      {selectedCompetitors.includes("New Balance") && (
                        <Line 
                          type="monotone" 
                          dataKey="New Balance" 
                          stroke="hsl(var(--chart-4))" 
                          strokeWidth={2}
                        />
                      )}
                      {selectedCompetitors.includes("Puma") && (
                        <Line 
                          type="monotone" 
                          dataKey="Puma" 
                          stroke="hsl(var(--chart-5))" 
                          strokeWidth={2}
                        />
                      )}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Condensed Competitor Cards */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Competitor Profiles</CardTitle>
          <CardDescription>
            Quick overview of each competitor with detailed analysis links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitors.map((competitor, index) => (
              <Card key={index} className="relative hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{competitor.name}</h4>
                      <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(competitor.trend)}
                      <span className={`text-xs font-medium ${getTrendColor(competitor.trend)}`}>
                        {competitor.trend === "up" ? "+" : ""}{competitor.trendValue}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">AI Visibility</span>
                      <span className="font-medium">{competitor.aiVisibility}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Mentions</span>
                      <span className="font-medium">{competitor.aiMentions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sentiment</span>
                      <span className="font-medium">{competitor.sentiment}/10</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Full Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Gaps */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Competitive Opportunities</CardTitle>
          <CardDescription>
            Areas where Nike can gain advantage over athletic competitors in AI visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-3">Opportunities</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Athletic performance content gaps among 75% of competitors
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Limited sustainability messaging implementation
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Weak content on emerging athletic technologies
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-3">Threats</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  Adidas gaining AI mention share rapidly in athletic sector
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  Under Armour improving sentiment scores with tech focus
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  Industry moving toward sustainable athletic wear
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
