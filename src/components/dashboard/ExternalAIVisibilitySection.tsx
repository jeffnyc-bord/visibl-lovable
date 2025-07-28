import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, TrendingUp, MessageSquare, Link, Calendar, Star, BarChart3, Target } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const ExternalAIVisibilitySection = () => {
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
    { source: "Official Tesla Website", mentions: 245, authority: "high", freshness: "current" },
    { source: "Reuters (Tesla news)", mentions: 189, authority: "high", freshness: "current" },
    { source: "TechCrunch", mentions: 167, authority: "medium", freshness: "current" },
    { source: "Wikipedia", mentions: 134, authority: "medium", freshness: "outdated" },
    { source: "Tesla Forums", mentions: 98, authority: "low", freshness: "current" },
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
    { query: "Best electric vehicle for families", relevanceScore: 92, brand: "Tesla", mentions: 145 },
    { query: "Tesla Model 3 vs competitors", relevanceScore: 88, brand: "Tesla", mentions: 203 },
    { query: "Electric car charging infrastructure", relevanceScore: 75, brand: "Tesla", mentions: 67 },
    { query: "Sustainable transportation options", relevanceScore: 82, brand: "Tesla", mentions: 89 },
  ];

  // AI Platform Mention Distribution data
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2dfd4e75-59fe-4604-9bc8-e9465d077056.png" alt="Total Mentions" className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-600">Total Mentions</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{visibilityMetrics.totalMentions.toLocaleString()}</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                {visibilityMetrics.trending}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Avg. Sentiment</span>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Platform Coverage</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{visibilityMetrics.platformCoverage}</span>
              <span className="text-sm text-gray-600 ml-1">platforms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Growth Trend</span>
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
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Mentions by Platform</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={platformMentionsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="mentions"
                  >
                    {platformMentionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Breakdown</h4>
              <div className="space-y-3">
                {platformMentionsData.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
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
            <Target className="w-5 h-5 text-blue-500" />
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
                <div className="flex items-center space-x-2">
                  <Progress value={query.relevanceScore} className="w-20 h-2" />
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
  );
};