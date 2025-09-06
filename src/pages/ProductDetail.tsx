import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  const [activeSection, setActiveSection] = useState("overview");
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
    { id: 1, model: "ChatGPT", query: "best running shoes 2024", excerpt: "Nike Air Max 1 offers excellent cushioning for daily runs with its Air Max technology providing superior comfort and impact protection.", sentiment: "positive", url: "nike.com/air-max-1", date: "2 hours ago" },
    { id: 2, model: "Gemini", query: "comfortable athletic footwear", excerpt: "The Nike Air Max 1 combines classic design with reliable cushioning technology, making it a solid choice for both casual wear and light athletic activities.", sentiment: "positive", url: "nike.com/air-max-1", date: "4 hours ago" },
    { id: 3, model: "Perplexity", query: "retro sneakers style", excerpt: "Air Max 1 maintains its classic appeal while incorporating modern comfort technologies, though some newer models offer better performance.", sentiment: "neutral", url: "nike.com/heritage", date: "6 hours ago" },
    { id: 4, model: "Grok", query: "athletic shoes innovation", excerpt: "Nike Air Max 1 represents a breakthrough in sneaker design with its visible air cushioning technology that revolutionized athletic footwear.", sentiment: "positive", url: "nike.com/innovation", date: "8 hours ago" }
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

  const handleMentionClick = (mentionId: number) => {
    setSelectedMentionId(mentionId);
    setShowMentionDetails(true);
  };

  // Transform AI mention data to work with PromptDetailsPanel
  const transformMentionToPromptData = (mentionId: number) => {
    const mention = aiMentions.find(m => m.id === mentionId);
    if (!mention) return null;

    const baseUrl = mention.url.startsWith('http') ? mention.url : `https://${mention.url}`;

    return {
      id: mention.id,
      prompt: mention.query,
      timestamp: new Date().toISOString(),
      results: [{
        platform: mention.model,
        mentioned: true,
        sentiment: mention.sentiment as "positive" | "neutral" | "negative",
        response: mention.excerpt,
        sources: [{
          title: `${mention.model} Response`,
          url: baseUrl,
          domain: mention.url.split('/')[0]
        }]
      }],
      metrics: {
        totalMentions: 1,
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
                onClick={() => navigate('/')}
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
        <div className="space-y-8 mb-8">
          {/* Main Score Card */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-blue-100 hover:border-blue-200 cursor-pointer transform hover:scale-[1.02] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent">
            <div className="flex items-end justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Readiness Score</h2>
                    <p className="text-gray-600">Overall performance and optimization status</p>
                  </div>
                </div>
              </div>
              <div className="text-right transform group-hover:scale-110 transition-transform duration-300">
                <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  {mockProduct.score}%
                </div>
                <div className="flex items-center justify-end text-green-600 bg-green-50 rounded-full px-3 py-1">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="font-medium text-sm">+{mockProduct.trend}% this week</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Progress value={mockProduct.score} className="h-4 bg-gray-200 rounded-full shadow-inner" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full shadow-lg opacity-90" 
                   style={{ width: `${mockProduct.score}%` }} />
            </div>
          </div>

          {/* Interactive Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI Mentions Card */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Eye className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    {mockProduct.mentions}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 mx-auto mt-1 group-hover:animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Product Mentions</div>
                <div className="text-xs text-gray-600">Total mentions across AI platforms</div>
              </div>
            </div>

            {/* Average Rank Card */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Search className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    #{mockProduct.avgRank}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto mt-1 group-hover:animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Avg. Rank</div>
                <div className="text-xs text-gray-600">Average ranking position</div>
              </div>
            </div>

            {/* Technical Health Card */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Code className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 group-hover:text-purple-600 transition-colors duration-300">
                    Good
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 group-hover:bg-purple-400 mx-auto mt-1 transition-colors duration-300 group-hover:animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Technical Health</div>
                <div className="text-xs text-gray-600">Overall technical optimization</div>
              </div>
            </div>

            {/* Pages Analyzed Card */}
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 cursor-pointer transform hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Activity className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {mockProduct.pagesCrawled}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-400 mx-auto mt-1 group-hover:animate-pulse" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">Pages Analyzed</div>
                <div className="text-xs text-gray-600">Total pages crawled and analyzed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-8">
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 px-0 py-4 rounded-none bg-transparent hover:text-blue-500 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="opportunities" 
                className="flex items-center space-x-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 px-0 py-4 rounded-none bg-transparent hover:text-blue-500 transition-colors"
              >
                <Target className="w-4 h-4" />
                <span className="font-medium">Opportunities</span>
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

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Trend</h3>
                  <p className="text-gray-600 mb-6">AI readiness score over the last 30 days</p>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center text-gray-600">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-blue-400" />
                      <p>Interactive chart showing AI readiness trend</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Breakdown</h3>
                  <p className="text-gray-600 mb-6">Detailed scoring by category</p>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Content Quality</span>
                        <span className="font-semibold text-gray-900">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Schema Markup</span>
                        <span className="font-semibold text-gray-900">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Link Authority</span>
                        <span className="font-semibold text-gray-900">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Technical Health</span>
                        <span className="font-semibold text-gray-900">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimization Opportunities</h3>
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
              <p className="text-gray-600 mb-8">How {mockProduct.name} appears across different AI platforms</p>
              <div className="space-y-6">
                 {aiMentions.map((mention) => (
                   <div 
                     key={mention.id} 
                     className="border-l-4 border-purple-500 bg-white pl-6 pr-6 py-6 hover:bg-gray-50 transition-colors duration-200 rounded-r-3xl shadow-sm cursor-pointer"
                     onClick={() => handleMentionClick(mention.id)}
                   >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-3xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
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
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search Performance</h3>
              <p className="text-gray-600 mb-8">Keyword rankings and performance metrics for {mockProduct.name}</p>
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700">
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