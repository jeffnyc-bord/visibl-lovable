import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
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
  ChevronRight,
  Pin,
  PinOff
} from "lucide-react";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("recommendations");
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showMentionDetails, setShowMentionDetails] = useState(false);
  const [selectedMentionId, setSelectedMentionId] = useState<number | null>(null);

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
    { id: 1, model: "ChatGPT", query: "best running shoes 2024", excerpt: "Nike Air Max 1 offers excellent cushioning for daily runs with its Air Max technology providing superior comfort and impact protection.", sentiment: "positive", url: "nike.com/air-max-1", date: "2 hours ago", mentions: 3 },
    { id: 2, model: "Gemini", query: "comfortable athletic footwear", excerpt: "The Nike Air Max 1 combines classic design with reliable cushioning technology, making it a solid choice for both casual wear and light athletic activities.", sentiment: "positive", url: "nike.com/air-max-1", date: "4 hours ago", mentions: 2 },
    { id: 3, model: "Perplexity", query: "retro sneakers style", excerpt: "Air Max 1 maintains its classic appeal while incorporating modern comfort technologies, though some newer models offer better performance.", sentiment: "neutral", url: "nike.com/heritage", date: "6 hours ago", mentions: 1 },
    { id: 4, model: "Grok", query: "athletic shoes innovation", excerpt: "Nike Air Max 1 represents a breakthrough in sneaker design with its visible air cushioning technology that revolutionized athletic footwear.", sentiment: "positive", url: "nike.com/innovation", date: "8 hours ago", mentions: 4 }
  ];

  const keywords = [
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "air max 1 shoes", volume: 18100, rank: 4, clicks: 890, impressions: 12400, ctr: 7.2, trend: "stable" },
    { keyword: "nike sneakers", volume: 8200, rank: 6, clicks: 420, impressions: 6800, ctr: 6.2, trend: "down" },
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "air max 1 shoes", volume: 18100, rank: 4, clicks: 890, impressions: 12400, ctr: 7.2, trend: "stable" },
    { keyword: "nike sneakers", volume: 8200, rank: 6, clicks: 420, impressions: 6800, ctr: 6.2, trend: "down" },
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
    { keyword: "air max 1 shoes", volume: 18100, rank: 4, clicks: 890, impressions: 12400, ctr: 7.2, trend: "stable" },
    { keyword: "nike sneakers", volume: 8200, rank: 6, clicks: 420, impressions: 6800, ctr: 6.2, trend: "down" },
    { keyword: "nike air max 1", volume: 49500, rank: 2, clicks: 1250, impressions: 15600, ctr: 8.0, trend: "up" },
  ];

  // Pre-select section based on navigation source
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section === 'opportunities') {
      setActiveSection('opportunities');
    }
  }, []);

  const handleMentionClick = (mentionId: number) => {
    setSelectedMentionId(mentionId);
    setShowMentionDetails(true);
  };

  // Transform AI mention data to work with PromptDetailsPanel
  const transformMentionToPromptData = (mentionId: number) => {
    const mention = aiMentions.find(m => m.id === mentionId);
    if (!mention) return null;

    const baseUrl = mention.url.startsWith('http') ? mention.url : `https://${mention.url}`;

    // Create results for all 4 platforms
    const allPlatformResults = [
      {
        platform: "ChatGPT",
        mentioned: mention.model === "ChatGPT",
        sentiment: (mention.model === "ChatGPT" ? mention.sentiment : "positive") as "positive" | "neutral" | "negative",
        response: mention.model === "ChatGPT" 
          ? mention.excerpt 
          : "Nike Air Max 1 offers excellent cushioning and iconic style with its visible Air technology.",
        sources: [{
          title: "ChatGPT Response",
          url: baseUrl,
          domain: mention.url.split('/')[0]
        }]
      },
      {
        platform: "Perplexity",
        mentioned: mention.model === "Perplexity",
        sentiment: (mention.model === "Perplexity" ? mention.sentiment : "positive") as "positive" | "neutral" | "negative",
        response: mention.model === "Perplexity"
          ? mention.excerpt
          : "The Nike Air Max 1 provides superior comfort with Air Max technology and maintains its status as an iconic sneaker.",
        sources: [{
          title: "Perplexity Response",
          url: baseUrl,
          domain: mention.url.split('/')[0]
        }]
      },
      {
        platform: "Gemini",
        mentioned: mention.model === "Gemini",
        sentiment: (mention.model === "Gemini" ? mention.sentiment : "positive") as "positive" | "neutral" | "negative",
        response: mention.model === "Gemini"
          ? mention.excerpt
          : "Nike Air Max 1 combines classic design with reliable cushioning technology for both casual and athletic wear.",
        sources: [{
          title: "Gemini Response",
          url: baseUrl,
          domain: mention.url.split('/')[0]
        }]
      },
      {
        platform: "Grok",
        mentioned: mention.model === "Grok",
        sentiment: (mention.model === "Grok" ? mention.sentiment : "neutral") as "positive" | "neutral" | "negative",
        response: mention.model === "Grok"
          ? mention.excerpt
          : "Nike Air Max 1 represents a breakthrough in sneaker design with visible air cushioning that revolutionized footwear.",
        sources: [{
          title: "Grok Response",
          url: baseUrl,
          domain: mention.url.split('/')[0]
        }]
      }
    ];

    return {
      id: mention.id,
      prompt: mention.query,
      timestamp: new Date().toISOString(),
      results: allPlatformResults,
      metrics: {
        totalMentions: mention.mentions,
        topPlatforms: [mention.model],
        avgSentiment: mention.sentiment
      }
    };
  };

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setTimeout(() => {
        setIsReanalyzing(false);
        setAnalysisProgress(0);
        toast({
          title: "Analysis Complete",
          description: "Product re-analysis has been completed successfully.",
        });
      }, 1000);
    }, 4000);
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    toast({
      title: isPinned ? "Removed from Watchlist" : "Added to Watchlist",
      description: isPinned ? 
        "Product removed from priority monitoring." : 
        "Product added to priority monitoring watchlist.",
    });
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
    <>
      {/* Loading Overlay */}
      {isReanalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Re-analyzing Product
                </h3>
                <p className="text-gray-600 text-sm">
                  Running AI analysis and updating readiness metrics...
                </p>
              </div>
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(analysisProgress, 100)}%` }}
                    />
                  </div>
                <p className="text-sm text-gray-500">
                  {analysisProgress < 30 ? "Scanning product pages..." :
                   analysisProgress < 60 ? "Analyzing AI mentions..." :
                   analysisProgress < 90 ? "Updating metrics..." :
                   "Finalizing results..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/?tab=brand')}
                className="text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-900">{mockProduct.name}</h1>
              <p className="text-sm text-gray-500">SKU: {mockProduct.sku}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleTogglePin}
                variant="outline"
                className="rounded-3xl border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {isPinned ? <Pin className="w-4 h-4 mr-2" /> : <PinOff className="w-4 h-4 mr-2" />}
                {isPinned ? 'Pinned' : 'Pin to Watchlist'}
              </Button>
              <Button 
                onClick={handleReanalyze}
                disabled={isReanalyzing}
                className="text-white shadow-sm rounded-3xl"
                style={{ backgroundColor: '#2F7EFE' }}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isReanalyzing ? 'animate-spin' : ''}`} />
                {isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* AI Readiness Hero Section */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: AI Readiness Score */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">AI Readiness Score</h2>
                  <p className="text-sm text-gray-600 mb-6">Overall performance and Optimization status</p>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{mockProduct.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500"># SKU: {mockProduct.sku}</span>
                    </div>
                    <div className="inline-flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{mockProduct.trend}% up this week</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - mockProduct.score / 100)}
                      className="text-gray-900"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-medium text-gray-900">{mockProduct.score}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Key Metrics */}
              <div className="grid grid-cols-2 gap-6 lg:border-l lg:border-gray-100 lg:pl-8">
                {/* Avg. Rank */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Search className="w-5 h-5" />
                    <span className="font-medium text-gray-900">Avg. Rank</span>
                  </div>
                  <p className="text-xs text-gray-600">Average rank position</p>
                  <p className="text-3xl font-bold text-gray-900">#{mockProduct.avgRank}</p>
                </div>

                {/* Product Mentions */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium text-gray-900">Product Mentions</span>
                  </div>
                  <p className="text-xs text-gray-600">Total mentions across platforms</p>
                  <p className="text-3xl font-bold text-gray-900">{mockProduct.mentions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-8">
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger 
                value="recommendations" 
                className="flex items-center space-x-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 px-0 py-4 rounded-none bg-transparent hover:text-blue-500 transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="font-medium">Recommendations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mentions" 
                className="flex items-center space-x-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 px-0 py-4 rounded-none bg-transparent hover:text-blue-500 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="font-medium">AI Mentions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="flex items-center space-x-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 px-0 py-4 rounded-none bg-transparent hover:text-blue-500 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">Keywords</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recommendations" className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimization Recommendations</h3>
              <p className="text-gray-600 mb-8">Prioritized improvements to boost your product's AI readiness score</p>
              <div className="space-y-6">
                {gaps.map((gap) => (
                  <div 
                    key={gap.id} 
                    className="border-l-4 border-blue-500 bg-white pl-6 pr-6 py-6 hover:bg-gray-50 transition-colors duration-200 rounded-r-3xl shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getStatusIcon(gap.status)}
                          <h4 className="font-semibold text-gray-900">{gap.title}</h4>
                          <Badge className={getPriorityColor(gap.priority)} variant="outline">
                            {gap.priority} Priority
                          </Badge>
                          <Badge className={getStatusColor(gap.status)} variant="outline">
                            {gap.status === 'in-progress' ? 'In Progress' : gap.status === 'resolved' ? 'Resolved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{gap.description}</p>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">Impact:</span>
                            <Badge variant="outline" className="text-xs">
                              {gap.impact}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">Effort:</span>
                            <Badge variant="outline" className="text-xs">
                              {gap.effort}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-6">
                        <Button size="sm" variant="outline" className="text-xs rounded-2xl">
                          Mark In Progress
                        </Button>
                        <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 rounded-2xl">
                          Get Guidance
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Product AI Mentions</h3>
              <p className="text-gray-600 mb-6">How {mockProduct.name} appears across different AI platforms</p>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-input bg-background" />
                      </TableHead>
                      <TableHead className="font-semibold">Prompt</TableHead>
                      <TableHead className="font-semibold">Top Platform</TableHead>
                      <TableHead className="font-semibold">Mentions</TableHead>
                      <TableHead className="font-semibold">Source</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiMentions.map((mention) => (
                      <TableRow 
                        key={mention.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleMentionClick(mention.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-input hover:border-primary transition-all duration-200 cursor-pointer bg-background" />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900 max-w-xs truncate">{mention.query}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{mention.model}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{mention.mentions}</span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{mention.url.split('/')[0]}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-500">{mention.date}</p>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => window.open(`https://${mention.url}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">Search Performance — {mockProduct.name}</h3>
              </div>
              <p className="text-gray-600 mb-6">Keyword rankings and performance metrics</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {keywords.map((keyword, index) => (
                  <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <p className="font-medium text-gray-900 text-sm">{keyword.keyword}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">{keyword.volume.toLocaleString()}</span>
                          <span className="text-blue-600 font-semibold text-lg">#{keyword.rank}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
         </Tabs>
       </div>
     </div>

     {/* AI Mention Details Panel */}
     <PromptDetailsPanel
       isOpen={showMentionDetails}
       onClose={() => setShowMentionDetails(false)}
       promptData={selectedMentionId ? transformMentionToPromptData(selectedMentionId) : null}
     />
     </>
   );
};