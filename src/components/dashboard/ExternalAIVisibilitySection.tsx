import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, TrendingUp, MessageSquare, Link, Calendar, Star, BarChart3, Target, HelpCircle, Globe } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const ExternalAIVisibilitySection = () => {
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  // Mock data for AI mentions and sources
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

  const recentMentions = [
    {
      platform: "ChatGPT",
      context: "Electric vehicle comparison",
      mention: "Tesla is widely regarded as the leader in electric vehicle technology...",
      timestamp: "2024-01-15 16:30",
      sentiment: "positive",
      query: "Best electric car brands 2024"
    },
    {
      platform: "Claude",
      context: "Sustainable transportation",
      mention: "Tesla's innovations in battery technology have significantly advanced...",
      timestamp: "2024-01-15 14:22",
      sentiment: "positive",
      query: "Environmental impact of electric vehicles"
    },
    {
      platform: "Gemini",
      context: "Autonomous driving",
      mention: "Tesla's Autopilot system represents one of the most advanced...",
      timestamp: "2024-01-15 12:45",
      sentiment: "neutral",
      query: "Self-driving car technology comparison"
    },
  ];

  const sourceQuality = [
    { source: "Nike.com (Official)", mentions: 342, authority: "high", freshness: "current" },
    { source: "ESPN Sports", mentions: 278, authority: "high", freshness: "current" },
    { source: "Footwear News", mentions: 195, authority: "medium", freshness: "current" },
    { source: "Complex Sneakers", mentions: 156, authority: "medium", freshness: "current" },
    { source: "Sneaker Forums", mentions: 112, authority: "low", freshness: "current" },
  ];

  // Data for overall AI visibility trend
  const visibilityTrendData = [
    { month: "Jul", mentions: 890 },
    { month: "Aug", mentions: 1020 },
    { month: "Sep", mentions: 1156 },
    { month: "Oct", mentions: 1089 },
    { month: "Nov", mentions: 1203 },
    { month: "Dec", mentions: 1247 },
  ];

  // Core Brand Queries data
  const coreQueries = [
    { query: "Best electric vehicle for families", brand: "Tesla", mentions: 145 },
    { query: "Tesla Model 3 vs competitors", brand: "Tesla", mentions: 203 },
    { query: "Electric car charging infrastructure", brand: "Tesla", mentions: 67 },
    { query: "Sustainable transportation options", brand: "Tesla", mentions: 89 },
  ];

  // AI Platform Mention Distribution data - Top 4 platforms for donut chart
  const platformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 28 },
    { platform: "Claude", mentions: 324, percentage: 20 },
    { platform: "Gemini", mentions: 287, percentage: 18 },
    { platform: "Perplexity", mentions: 180, percentage: 11 },
  ];

  // Vibrant color palette for donut segments
  const DONUT_COLORS = [
    '#65CAD2', // Light teal
    '#FFB366', // Light orange
    '#FF6633', // Darker orange
    '#33CCB3'  // Bright teal
  ];

  const COLORS = [
    'hsl(var(--primary))', 
    'hsl(var(--secondary))', 
    'hsl(220, 14%, 69%)', 
    'hsl(220, 14%, 83%)',
    'hsl(280, 70%, 65%)',
    'hsl(200, 80%, 60%)',
    'hsl(120, 60%, 55%)',
    'hsl(35, 75%, 60%)'
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

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, totalMentions: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/2dfd4e75-59fe-4604-9bc8-e9465d077056.png" alt="Total Mentions" className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-600">Total Mentions</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, totalMentions: !showTooltips.totalMentions})}
                />
                {showTooltips.totalMentions && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Total number of mentions across all external AI platforms tracked.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{visibilityMetrics.totalMentions.toLocaleString()}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                {visibilityMetrics.trending}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, sentiment: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Avg. Sentiment</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, sentiment: !showTooltips.sentiment})}
                />
                {showTooltips.sentiment && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Average sentiment rating of your brand mentions across AI platforms on a scale of 1-5.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{visibilityMetrics.averageRating}/5</span>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(visibilityMetrics.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, platformCoverage: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Platform Coverage</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, platformCoverage: !showTooltips.platformCoverage})}
                />
                {showTooltips.platformCoverage && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Number of different AI platforms where your brand has visibility.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{visibilityMetrics.platformCoverage}</span>
              <span className="text-sm text-gray-600 ml-1">platforms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative" onMouseLeave={() => setShowTooltips({...showTooltips, growth: false})}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Growth Trend</span>
              </div>
              <div className="relative">
                <HelpCircle 
                  className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                  onClick={() => setShowTooltips({...showTooltips, growth: !showTooltips.growth})}
                />
                {showTooltips.growth && (
                  <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                    <p>Percentage change in mentions compared to the previous month.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-green-600">{visibilityMetrics.trending}</span>
              <span className="text-sm text-gray-600 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall AI Visibility Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <span>Overall AI Visibility Trend</span>
          </CardTitle>
          <CardDescription>
            Your brand's mention volume across the AI ecosystem over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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

      {/* AI Platform Mention Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <img src="/lovable-uploads/79e7d0e6-2ccc-40a4-a2c4-fa6f2406e0c6.png" alt="AI Platform Mention Distribution" className="w-5 h-5" />
            <span>AI Platform Mention Distribution</span>
          </CardTitle>
          <CardDescription>
            Brand mentions across AI platforms from your generated queries and prompt blasts.
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-[#1A2B4D] p-8 rounded-lg">
          <div className="flex justify-center items-center">
            <div className="relative w-80 h-80">
              {/* Surrounding Donut Chart */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
                <defs>
                  {/* Gradient definitions for animation */}
                  <linearGradient id="teal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#65CAD2" />
                    <stop offset="100%" stopColor="#33CCB3" />
                  </linearGradient>
                </defs>
                {platformMentionsData.map((platform, index) => {
                  const isHovered = hoveredSegment === index;
                  const strokeWidth = isHovered ? 20 : 16;
                  const radius = 65;
                  const circumference = 2 * Math.PI * radius;
                  const segmentLength = (platform.percentage / 100) * circumference;
                  const offset = platformMentionsData.slice(0, index).reduce((acc, p) => acc + (p.percentage / 100) * circumference, 0);
                  const gap = 2; // Small gap between segments
                  
                  return (
                    <circle
                      key={index}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke={DONUT_COLORS[index]}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={`${segmentLength - gap} ${circumference - segmentLength + gap}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                        animationDelay: `${index * 0.2}s`,
                        animation: `drawSegment 1s ease-out forwards`
                      }}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  );
                })}
              </svg>

              {/* Central Pie Chart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32">
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
                        style={{
                          animation: 'fillCentralPie 0.8s ease-out forwards'
                        }}
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
                {platformMentionsData.map((platform, index) => {
                  const angle = (platformMentionsData.slice(0, index).reduce((acc, p) => acc + p.percentage, 0) + platform.percentage / 2) * 3.6;
                  const radian = (angle - 90) * (Math.PI / 180);
                  const labelRadius = 100;
                  const x = 50 + Math.cos(radian) * labelRadius;
                  const y = 50 + Math.sin(radian) * labelRadius;
                  
                  return (
                    <div
                      key={index}
                      className="absolute text-white text-xs font-medium pointer-events-none"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        opacity: hoveredSegment === index ? 1 : 0.7
                      }}
                    >
                      {platform.platform}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platform Breakdown List */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-white mb-4 text-center">Platform Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              {platformMentionsData.map((platform, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    hoveredSegment === index 
                      ? 'border-white/30 bg-white/10' 
                      : 'border-white/10 bg-white/5'
                  }`}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: DONUT_COLORS[index] }}
                    ></div>
                    <span className="text-sm font-medium text-white">{platform.platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{platform.mentions}</span>
                    <span className="text-xs text-white/60">({platform.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline CSS for animations */}
          <style>{`
            @keyframes drawSegment {
              0% {
                stroke-dasharray: 0 1000;
              }
              100% {
                stroke-dasharray: var(--segment-length) var(--gap-length);
              }
            }
            
            @keyframes fillCentralPie {
              0% {
                stroke-dasharray: 0 100;
              }
              100% {
                stroke-dasharray: var(--percentage) 100;
              }
            }
          `}</style>
        </CardContent>
      </Card>

      {/* Platform-wise Mentions */}
      <Card>
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
              {platformMentions.map((platform, index) => (
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
        </CardContent>
      </Card>

      {/* Core Brand Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
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
                      <span className="text-sm text-gray-600">AI Mentions:</span>
                      <span className="font-medium">{query.mentions}</span>
                    </div>
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
            <img src="/lovable-uploads/210deded-106c-459a-8f28-05761a09348c.png" alt="Source Quality" className="w-12 h-12" />
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
  );
};