import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  Code,
  Zap,
  RefreshCw,
  Star,
  ExternalLink,
  Clock,
  Target,
  FileText,
  BarChart3,
  Package,
  Activity,
  Globe,
  Award,
  ChevronRight
} from "lucide-react";

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Mock product data - in real app this would come from API
  const mockProduct = {
    id: productId,
    name: "Nike Air Max 1",
    sku: "AIR-MAX-001",
    score: 98,
    trend: 5,
    category: "Footwear",
    image: "/placeholder-product.jpg",
    lastAnalyzed: "2 hours ago",
    mentions: 847,
    avgRank: 3,
    pagesCrawled: 12
  };

  const gaps = [
    { 
      id: 1, 
      title: "Missing Product Schema Markup", 
      priority: "High", 
      status: "pending", 
      description: "Add Reviews, Price, and Availability schema markup to improve AI understanding",
      impact: "High",
      effort: "Medium"
    },
    { 
      id: 2, 
      title: "Low AI Mentions for 'cross-training shoes'", 
      priority: "Medium", 
      status: "in-progress", 
      description: "Competitors dominate this query space - need content optimization",
      impact: "Medium",
      effort: "High"
    },
    { 
      id: 3, 
      title: "Content lacks FAQ answers", 
      priority: "High", 
      status: "pending", 
      description: "Missing common product feature questions that users frequently ask",
      impact: "High",
      effort: "Low"
    },
    { 
      id: 4, 
      title: "Environmental benefits unclear", 
      priority: "Low", 
      status: "resolved", 
      description: "High search volume query about sustainability needs addressing",
      impact: "Low",
      effort: "Low"
    }
  ];

  const aiMentions = [
    { id: 1, model: "ChatGPT", query: "best running shoes 2024", excerpt: "Nike Air Max 1 offers excellent cushioning for daily runs with its Air Max technology providing superior comfort and impact protection.", sentiment: "positive", url: "nike.com/air-max-1", date: "2 hours ago" },
    { id: 2, model: "Claude", query: "comfortable athletic shoes", excerpt: "The Air Max 1 features innovative design that combines style with performance, making it ideal for both casual wear and light athletic activities.", sentiment: "positive", url: "nike.com/products", date: "4 hours ago" },
    { id: 3, model: "Perplexity", query: "retro sneakers style", excerpt: "Air Max 1 maintains its classic appeal while incorporating modern comfort technologies, though some newer models offer better performance.", sentiment: "neutral", url: "nike.com/heritage", date: "6 hours ago" }
  ];

  const keywords = [
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "air max 1 shoes", volume: 18100, rank: 4, clicks: 890, impressions: 12400, ctr: 7.2, trend: "stable" },
    { keyword: "classic nike sneakers", volume: 8200, rank: 6, clicks: 420, impressions: 6800, ctr: 6.2, trend: "down" }
  ];

  // Pre-select section based on navigation source
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section === 'opportunities') {
      setActiveSection('opportunities');
    }
  }, []);

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
    }, 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{mockProduct.name}</h1>
                  <p className="text-sm text-gray-500">SKU: {mockProduct.sku} • {mockProduct.category}</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReanalyzing ? 'animate-spin' : ''}`} />
              {isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* AI Readiness Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Readiness Score</h2>
                <p className="text-gray-600">Current performance and optimization status</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-blue-600 mb-2">{mockProduct.score}%</div>
                <div className="flex items-center justify-end text-green-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-medium">+{mockProduct.trend}% this week</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={mockProduct.score} className="h-3 bg-white/50" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Last analyzed: {mockProduct.lastAnalyzed}</span>
                <span>Excellent Performance</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="px-8 py-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockProduct.mentions}</div>
              <div className="text-sm text-gray-500">Total AI Mentions</div>
            </div>
            <div className="px-8 py-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">#{mockProduct.avgRank}</div>
              <div className="text-sm text-gray-500">Avg. Organic Rank</div>
            </div>
            <div className="px-8 py-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <div className="text-sm text-gray-500">Technical Health</div>
            </div>
            <div className="px-8 py-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{mockProduct.pagesCrawled}</div>
              <div className="text-sm text-gray-500">Pages Analyzed</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-md px-4 py-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="opportunities" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-md px-4 py-2"
              >
                <Target className="w-4 h-4" />
                <span>Opportunities</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mentions" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-md px-4 py-2"
              >
                <Eye className="w-4 h-4" />
                <span>AI Mentions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-md px-4 py-2"
              >
                <Search className="w-4 h-4" />
                <span>Keywords</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Performance Trend</span>
                  </CardTitle>
                  <CardDescription>AI readiness score over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-blue-400" />
                      <p>Interactive chart showing AI readiness trend</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span>Performance Breakdown</span>
                  </CardTitle>
                  <CardDescription>Detailed scoring across different factors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Quality</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Schema Markup</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium text-amber-600">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Link Authority</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={88} className="w-20 h-2" />
                        <span className="text-sm font-medium text-blue-600">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Technical Health</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Optimization Opportunities</span>
                </CardTitle>
                <CardDescription>
                  Prioritized improvements to boost your product's AI readiness score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gaps.map((gap) => (
                    <div 
                      key={gap.id} 
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(gap.status)}
                            <h3 className="font-semibold text-gray-900">{gap.title}</h3>
                            <Badge className={getPriorityColor(gap.priority)} variant="outline">
                              {gap.priority} Priority
                            </Badge>
                            <Badge className={getStatusColor(gap.status)} variant="outline">
                              {gap.status === 'in-progress' ? 'In Progress' : gap.status === 'resolved' ? 'Resolved' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{gap.description}</p>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium text-gray-700">Impact:</span>
                              <Badge variant="outline" className="text-xs">
                                {gap.impact}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium text-gray-700">Effort:</span>
                              <Badge variant="outline" className="text-xs">
                                {gap.effort}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-6">
                          <Button size="sm" variant="outline" className="text-xs">
                            Mark In Progress
                          </Button>
                          <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                            Get Guidance
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>AI Platform Mentions</span>
                </CardTitle>
                <CardDescription>
                  How {mockProduct.name} appears across different AI platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiMentions.map((mention) => (
                    <div 
                      key={mention.id} 
                      className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-1">{mention.model}</Badge>
                            <div className="text-xs text-gray-500">{mention.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={
                              mention.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' :
                              mention.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }
                            variant="outline"
                          >
                            {mention.sentiment}
                          </Badge>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">"{mention.query}"</p>
                        <p className="text-gray-600 leading-relaxed">"{mention.excerpt}"</p>
                        <p className="text-xs text-gray-500">Source: {mention.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>Search Performance</span>
                </CardTitle>
                <CardDescription>
                  Keyword rankings and performance metrics for {mockProduct.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700">
                      <div>Keyword</div>
                      <div>Volume</div>
                      <div>Rank</div>
                      <div>Clicks</div>
                      <div>Impressions</div>
                      <div>CTR</div>
                      <div>Trend</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-900">{keyword.keyword}</div>
                        <div className="text-gray-600">{keyword.volume.toLocaleString()}</div>
                        <div className="font-semibold text-blue-600">#{keyword.rank}</div>
                        <div className="text-gray-600">{keyword.clicks}</div>
                        <div className="text-gray-600">{keyword.impressions.toLocaleString()}</div>
                        <div className="text-gray-600">{keyword.ctr}%</div>
                        <div className="flex items-center">
                          {keyword.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {keyword.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                          {keyword.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};