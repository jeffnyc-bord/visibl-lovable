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
  BarChart3
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
    { id: 1, title: "Missing Product Schema Markup", priority: "High", status: "pending", description: "Add Reviews, Price, and Availability schema" },
    { id: 2, title: "Low AI Mentions for 'cross-training shoes'", priority: "Medium", status: "in-progress", description: "Competitors dominate this query space" },
    { id: 3, title: "Content lacks FAQ answers", priority: "High", status: "pending", description: "Missing common product feature questions" },
    { id: 4, title: "Environmental benefits unclear", priority: "Low", status: "resolved", description: "High search volume query needs addressing" }
  ];

  const aiMentions = [
    { id: 1, model: "ChatGPT", query: "best running shoes 2024", excerpt: "Nike Air Max 1 offers excellent cushioning...", sentiment: "positive", url: "nike.com/air-max-1" },
    { id: 2, model: "Claude", query: "comfortable athletic shoes", excerpt: "The Air Max 1 features innovative design...", sentiment: "positive", url: "nike.com/products" },
    { id: 3, model: "Perplexity", query: "retro sneakers style", excerpt: "Air Max 1 maintains its classic appeal...", sentiment: "neutral", url: "nike.com/heritage" }
  ];

  const keywords = [
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0 },
    { keyword: "air max 1 shoes", volume: 18100, rank: 4, clicks: 890, impressions: 12400, ctr: 7.2 },
    { keyword: "classic nike sneakers", volume: 8200, rank: 6, clicks: 420, impressions: 6800, ctr: 6.2 }
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
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockProduct.name}</h1>
              <p className="text-sm text-gray-500">SKU: {mockProduct.sku}</p>
            </div>
          </div>
          <Button 
            onClick={handleReanalyze}
            disabled={isReanalyzing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isReanalyzing ? 'animate-spin' : ''}`} />
            <span>{isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Product'}</span>
          </Button>
        </div>

        {/* Product Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Readiness Overview</CardTitle>
              <CardDescription>Current performance and trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6 mb-4">
                <div className="text-5xl font-bold text-blue-600">{mockProduct.score}%</div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">+{mockProduct.trend}% this week</span>
                </div>
              </div>
              <Progress value={mockProduct.score} className="h-3" />
              <div className="mt-4 text-sm text-gray-600">
                Last analyzed: {mockProduct.lastAnalyzed}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                AI Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{mockProduct.mentions}</div>
                <div className="text-xs text-gray-500">Total AI Mentions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">#{mockProduct.avgRank}</div>
                <div className="text-xs text-gray-500">Avg. Organic Rank</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Technical Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">Good</div>
                <div className="text-xs text-gray-500">Core Web Vitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{mockProduct.pagesCrawled}</div>
                <div className="text-xs text-gray-500">Pages Crawled</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
          <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
              <BarChart3 className="w-3 h-3" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
              <Target className="w-3 h-3" />
              <span>Optimization Opportunities</span>
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
              <Eye className="w-3 h-3" />
              <span>AI Mentions</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
              <Search className="w-3 h-3" />
              <span>Search Performance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Readiness Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart showing AI readiness score over time
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <Badge>{mockProduct.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Schema Status:</span>
                    <span className="text-yellow-600">Needs Improvement</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Score:</span>
                    <span className="text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Link Authority:</span>
                    <span className="text-blue-600">Good</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>AI Readiness Gaps & Opportunities</span>
                </CardTitle>
                <CardDescription>
                  Prioritized list of improvements to boost AI readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gaps.map((gap) => (
                    <div key={gap.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(gap.status)}
                            <h3 className="font-medium">{gap.title}</h3>
                            <Badge className={getPriorityColor(gap.priority)}>{gap.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{gap.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Mark as In Progress
                          </Button>
                          <Button size="sm">
                            Get Help
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>AI Mentions for {mockProduct.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiMentions.map((mention) => (
                    <div key={mention.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{mention.model}</Badge>
                          <Badge className={
                            mention.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            mention.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }>
                            {mention.sentiment}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium mb-1">{mention.query}</p>
                      <p className="text-sm text-gray-600 mb-2">"{mention.excerpt}"</p>
                      <p className="text-xs text-gray-500">Source: {mention.url}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 border-b">
                    <div className="grid grid-cols-6 gap-4 p-3 text-sm font-medium text-gray-700">
                      <div>Keyword</div>
                      <div>Volume</div>
                      <div>Rank</div>
                      <div>Clicks</div>
                      <div>Impressions</div>
                      <div>CTR</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4 p-3 text-sm hover:bg-gray-50">
                        <div className="font-medium">{keyword.keyword}</div>
                        <div>{keyword.volume.toLocaleString()}</div>
                        <div className="font-medium">#{keyword.rank}</div>
                        <div>{keyword.clicks}</div>
                        <div>{keyword.impressions.toLocaleString()}</div>
                        <div>{keyword.ctr}%</div>
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