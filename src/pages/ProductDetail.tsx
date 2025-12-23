import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  TrendingUp,
  Eye,
  Search,
  RefreshCw,
  Target,
  Package,
  Pin,
  PinOff,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Settings,
  Copy,
  BarChart3,
  X,
  Check,
  Info,
  Sparkles
} from "lucide-react";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";
import { AddPromptDialog } from "@/components/ui/add-prompt-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GhostProductSlot } from "@/components/ui/ghost-product-slot";
import { FidelityMeter } from "@/components/ui/fidelity-meter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("prompts");
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showMentionDetails, setShowMentionDetails] = useState(false);
  const [selectedMentionId, setSelectedMentionId] = useState<number | null>(null);
  const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
  const [showFidelitySheet, setShowFidelitySheet] = useState(false);
  
  type PromptStatus = "completed" | "queued";
  type Prompt = {
    id: number;
    model: string;
    query: string;
    excerpt: string;
    sentiment: "positive" | "neutral" | "negative";
    url: string;
    date: string;
    mentions: number;
    queued: boolean;
    status: PromptStatus;
  };
  
  const [prompts, setPrompts] = useState<Prompt[]>([
    { id: 1, model: "ChatGPT", query: "best running shoes 2024", excerpt: "Nike Air Max 1 offers excellent cushioning for daily runs with its Air Max technology providing superior comfort and impact protection.", sentiment: "positive", url: "nike.com/air-max-1", date: "2 hours ago", mentions: 3, queued: false, status: "completed" },
    { id: 2, model: "Gemini", query: "comfortable athletic footwear", excerpt: "The Nike Air Max 1 combines classic design with reliable cushioning technology, making it a solid choice for both casual wear and light athletic activities.", sentiment: "positive", url: "nike.com/air-max-1", date: "4 hours ago", mentions: 2, queued: false, status: "completed" },
    { id: 3, model: "Perplexity", query: "retro sneakers style", excerpt: "Air Max 1 maintains its classic appeal while incorporating modern comfort technologies, though some newer models offer better performance.", sentiment: "neutral", url: "nike.com/heritage", date: "6 hours ago", mentions: 1, queued: false, status: "completed" },
    { id: 4, model: "Grok", query: "athletic shoes innovation", excerpt: "Nike Air Max 1 represents a breakthrough in sneaker design with its visible air cushioning technology that revolutionized athletic footwear.", sentiment: "positive", url: "nike.com/innovation", date: "8 hours ago", mentions: 4, queued: false, status: "completed" }
  ]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const MAX_PROMPTS = 5;

  // Mock product data - in real app this would come from API
  const mockProduct = {
    id: productId,
    name: "Nike Air Max 1",
    sku: "AIR-MAX-001",
    score: 82,
    trend: 2,
    category: "Footwear",
    image: "/placeholder-product.jpg",
    lastAnalyzed: "2 hours ago",
    mentions: 847,
    avgRank: 3,
    pagesCrawled: 12
  };

  // Score distribution data for Apple Health-style bars
  const scoreDistribution = [
    { label: "Content Quality", score: 88, color: "hsl(142, 71%, 45%)" },
    { label: "Technical SEO", score: 76, color: "hsl(200, 80%, 50%)" },
    { label: "AI Optimization", score: 82, color: "hsl(280, 70%, 55%)" },
    { label: "Authority Signals", score: 71, color: "hsl(35, 90%, 55%)" },
  ];

  const gaps = [
    { 
      id: 1, 
      title: "Product specs missing", 
      priority: "High", 
      status: "in-progress", 
      description: "Technical specifications are not comprehensive enough for AI systems",
      impact: "High",
      effort: "Medium"
    },
    { 
      id: 2, 
      title: "Limited customer reviews", 
      priority: "Medium", 
      status: "pending", 
      description: "More customer testimonials needed to build trust signals",
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

  const keywords = [
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
    const mention = prompts.find(m => m.id === mentionId);
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
        "Product removed from your watchlist" : 
        "Product added to your watchlist"
    });
  };

  const handleTogglePromptSelection = (promptId: number) => {
    setSelectedPrompts(prev =>
      prev.includes(promptId)
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleToggleAllPrompts = () => {
    if (selectedPrompts.length === prompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(prompts.map(p => p.id));
    }
  };

  const handleDeletePrompts = () => {
    if (selectedPrompts.length === 0) return;
    
    setPrompts(prev => prev.filter(p => !selectedPrompts.includes(p.id)));
    setSelectedPrompts([]);
    toast({
      title: "Prompts Deleted",
      description: `${selectedPrompts.length} prompt${selectedPrompts.length > 1 ? 's' : ''} deleted successfully.`,
    });
  };

  const handleDeleteSinglePrompt = (promptId: number) => {
    setPrompts(prev => prev.filter(p => p.id !== promptId));
    toast({
      title: "Prompt Deleted",
      description: "Prompt deleted successfully.",
    });
  };

  const handleToggleQueue = (promptId: number) => {
    setPrompts(prev => prev.map(p => 
      p.id === promptId 
        ? { ...p, queued: !p.queued, status: !p.queued ? "queued" as const : "completed" as const }
        : p
    ));
    const prompt = prompts.find(p => p.id === promptId);
    toast({
      title: prompt?.queued ? "Removed from Queue" : "Added to Queue",
      description: prompt?.queued 
        ? "Prompt removed from analysis queue." 
        : "Prompt added to analysis queue.",
    });
  };

  const handleAddPrompt = (promptText: string) => {
    if (prompts.length >= MAX_PROMPTS) {
      toast({
        title: "Limit Reached",
        description: `You can only have up to ${MAX_PROMPTS} prompts.`,
        variant: "destructive"
      });
      return;
    }

    const newPrompt: Prompt = {
      id: Math.max(...prompts.map(p => p.id), 0) + 1,
      model: "Pending",
      query: promptText,
      excerpt: "This prompt is queued for analysis. Results will appear once processing is complete.",
      sentiment: "neutral",
      url: "pending",
      date: "Just now",
      mentions: 0,
      queued: true,
      status: "queued"
    };

    setPrompts(prev => [newPrompt, ...prev]);
    setShowAddPrompt(false);
    toast({
      title: "Prompt Queued",
      description: "Your prompt has been added to the analysis queue.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50/50';
      case 'Medium': return 'text-amber-600 bg-amber-50/50';
      case 'Low': return 'text-blue-600 bg-blue-50/50';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-50/50';
      case 'in-progress': return 'text-blue-600 bg-blue-50/50';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isReanalyzing && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 animate-scale-in border border-border/50">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                <RefreshCw className="w-7 h-7 text-foreground animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Re-analyzing Product
                </h3>
                <p className="text-muted-foreground text-sm">
                  Running AI analysis and updating readiness metrics...
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-foreground h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(analysisProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
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

      {/* Mesh Gradient Background */}
      <div 
        className="min-h-screen relative"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(248, 250, 252, 0.9) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(241, 245, 249, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 40% 80%, rgba(226, 232, 240, 0.6) 0%, transparent 50%),
            linear-gradient(180deg, hsl(0 0% 99%) 0%, hsl(0 0% 97%) 100%)
          `
        }}
      >
        {/* Header */}
        <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/?tab=brand')}
                className="text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleTogglePin}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={handleReanalyze}
                  disabled={isReanalyzing}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border/60"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isReanalyzing ? 'animate-spin' : ''}`} />
                  {isReanalyzing ? 'Analyzing...' : 'Re-analyze'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Product Hero */}
          <div className="mb-16">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground tracking-wide uppercase">Product</p>
                <h1 className="text-4xl font-light tracking-tight text-foreground">{mockProduct.name}</h1>
                <p className="text-muted-foreground">SKU: {mockProduct.sku}</p>
              </div>
            </div>
          </div>

          {/* AI Readiness Score Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            {/* Left: Score Display */}
            <div className="lg:col-span-5">
              <div className="flex flex-col items-center lg:items-start">
                {/* Large Score */}
                <div className="relative mb-6">
                  <div 
                    className="text-8xl font-extralight tracking-tighter text-foreground"
                    style={{
                      textShadow: mockProduct.trend > 0 ? '0 0 60px rgba(34, 197, 94, 0.15)' : 'none'
                    }}
                  >
                    {mockProduct.score}
                  </div>
                  <span className="text-2xl font-extralight text-muted-foreground ml-1">%</span>
                  
                  {/* Trend Badge with Glow */}
                  <div 
                    className="absolute -right-4 top-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: 'rgb(22, 163, 74)',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{mockProduct.trend}%
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-8">AI Readiness Score</p>

                {/* Key Metrics - Minimal */}
                <div className="flex gap-12 pt-8 border-t border-border/30 w-full">
                  <div>
                    <p className="text-3xl font-light text-foreground">#{mockProduct.avgRank}</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg. Rank</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-foreground">{mockProduct.mentions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mentions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Score Distribution - Apple Health Style Bars */}
            <div className="lg:col-span-7">
              <p className="text-sm text-muted-foreground mb-6">Score Breakdown</p>
              <div className="space-y-5">
                {scoreDistribution.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-foreground">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${item.score}%`,
                          background: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-10">
            <TabsList className="bg-transparent p-0 h-auto border-b border-border/30 w-full justify-start gap-8 rounded-none">
              <TabsTrigger 
                value="prompts" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 pt-0 text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none font-normal"
              >
                Prompts
              </TabsTrigger>
              <TabsTrigger 
                value="recommendations" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 pt-0 text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none font-normal"
              >
                Recommendations
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none px-0 pb-4 pt-0 text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none font-normal"
              >
                Keywords
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-8 mt-10">
              <div>
                <h3 className="text-xl font-light text-foreground mb-2">Optimization Recommendations</h3>
                <p className="text-sm text-muted-foreground mb-10">Prioritized improvements to boost your product's AI readiness</p>
                
                <div className="space-y-1">
                  {gaps.map((gap, index) => (
                    <div 
                      key={gap.id} 
                      className="group py-6 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors -mx-4 px-4 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-0.5">
                            {getStatusIcon(gap.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-foreground">{gap.title}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(gap.priority)}`}>
                                {gap.priority}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(gap.status)}`}>
                                {gap.status === 'in-progress' ? 'In Progress' : gap.status === 'resolved' ? 'Resolved' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{gap.description}</p>
                            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                              <span>Impact: <strong className="text-foreground font-medium">{gap.impact}</strong></span>
                              <span>Effort: <strong className="text-foreground font-medium">{gap.effort}</strong></span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          Get Guidance
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="space-y-8 mt-10">
              <div>
                {/* Fidelity Meter */}
                <div className="mb-8 p-4 rounded-2xl bg-muted/30 border border-border/20">
                  <div className="flex items-center justify-between">
                    <FidelityMeter
                      current={3}
                      max={5}
                      label="Data Fidelity"
                      description="60% — Add more prompts for higher accuracy"
                      onClick={() => setShowFidelitySheet(true)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowFidelitySheet(true)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Info className="w-3.5 h-3.5 mr-1.5" />
                      Learn more
                    </Button>
                  </div>
                </div>

                {/* Queue Indicator */}
                {prompts.filter(p => p.queued).length > 0 && (
                  <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/30">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="text-sm text-foreground">
                          {prompts.filter(p => p.queued).length} prompt{prompts.filter(p => p.queued).length > 1 ? 's' : ''} queued
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Waiting for next analysis run
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-light text-foreground mb-1">Product Prompts</h3>
                    <p className="text-sm text-muted-foreground">{prompts.length}/{MAX_PROMPTS} prompts tracked</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPrompts.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeletePrompts}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete ({selectedPrompts.length})
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddPrompt(true)}
                      disabled={prompts.length >= MAX_PROMPTS}
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Prompt
                    </Button>
                  </div>
                </div>
                
                {/* Prompts List - Clean Table */}
                <div className="rounded-xl border border-border/30 overflow-hidden bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/20 hover:bg-transparent">
                        <TableHead className="w-12">
                          <button
                            onClick={handleToggleAllPrompts}
                            className="group relative flex items-center justify-center w-5 h-5 rounded-full border border-border hover:border-foreground transition-all duration-200 cursor-pointer bg-background"
                          >
                            <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                              selectedPrompts.length === prompts.length && prompts.length > 0
                                ? 'bg-foreground scale-100 opacity-100' 
                                : 'bg-transparent scale-0 opacity-0'
                            }`} />
                            <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                              selectedPrompts.length === prompts.length && prompts.length > 0
                                ? 'text-background scale-100 opacity-100' 
                                : 'text-transparent scale-0 opacity-0'
                            }`} />
                          </button>
                        </TableHead>
                        <TableHead className="text-xs text-muted-foreground font-normal">Prompt</TableHead>
                        <TableHead className="text-xs text-muted-foreground font-normal">Platform</TableHead>
                        <TableHead className="text-xs text-muted-foreground font-normal">Mentions</TableHead>
                        <TableHead className="text-xs text-muted-foreground font-normal">Source</TableHead>
                        <TableHead className="text-xs text-muted-foreground font-normal">Date</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prompts.map((mention) => (
                        <TableRow 
                          key={mention.id} 
                          className={`border-border/10 ${mention.status !== "queued" ? "cursor-pointer hover:bg-muted/30" : "cursor-default"}`}
                          onClick={() => mention.status !== "queued" && handleMentionClick(mention.id)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleTogglePromptSelection(mention.id)}
                              className="group relative flex items-center justify-center w-5 h-5 rounded-full border border-border hover:border-foreground transition-all duration-200 cursor-pointer bg-background"
                            >
                              <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                                selectedPrompts.includes(mention.id)
                                  ? 'bg-foreground scale-100 opacity-100' 
                                  : 'bg-transparent scale-0 opacity-0'
                              }`} />
                              <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                                selectedPrompts.includes(mention.id)
                                  ? 'text-background scale-100 opacity-100' 
                                  : 'text-transparent scale-0 opacity-0'
                              }`} />
                            </button>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground max-w-xs truncate">{mention.query}</p>
                          </TableCell>
                          <TableCell>
                            {mention.status === "queued" ? (
                              <span className="text-xs text-amber-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Queued
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">{mention.model}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mention.mentions}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">{mention.url.split('/')[0]}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">{mention.date}</span>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                  <Settings className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {mention.status === "queued" && (
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteSinglePrompt(mention.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove from Queue
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => {
                                  if (mention.status !== "queued") {
                                    handleMentionClick(mention.id);
                                  }
                                }} disabled={mention.status === "queued"}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  navigator.clipboard.writeText(mention.query);
                                  toast({
                                    title: "Copied",
                                    description: "Prompt copied to clipboard.",
                                  });
                                }}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Prompt
                                </DropdownMenuItem>
                                {mention.status !== "queued" && (
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteSinglePrompt(mention.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Prompt
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Ghost Product Slot */}
                <div className="mt-8">
                  <GhostProductSlot 
                    onClick={() => navigate('/?tab=brand')}
                    className="opacity-60 hover:opacity-100"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Ready to dominate another category? Track your next product line here.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-8 mt-10">
              <div>
                <h3 className="text-xl font-light text-foreground mb-2">Search Performance</h3>
                <p className="text-sm text-muted-foreground mb-10">Keyword rankings and performance metrics for {mockProduct.name}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="group p-5 rounded-2xl border border-border/20 bg-background/50 hover:bg-muted/30 transition-all cursor-pointer"
                    >
                      <p className="text-sm text-foreground mb-3 truncate">{keyword.keyword}</p>
                      <div className="flex items-end justify-between">
                        <span className="text-xs text-muted-foreground">{keyword.volume.toLocaleString()} vol</span>
                        <span className="text-2xl font-light text-foreground">#{keyword.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Prompt Details Panel */}
      <PromptDetailsPanel
        isOpen={showMentionDetails}
        onClose={() => setShowMentionDetails(false)}
        promptData={selectedMentionId ? transformMentionToPromptData(selectedMentionId) : null}
      />

      {/* Add Prompt Dialog */}
      <AddPromptDialog
        open={showAddPrompt}
        onOpenChange={setShowAddPrompt}
        onAdd={handleAddPrompt}
      />

      {/* Fidelity Enhancement Sheet */}
      <Sheet open={showFidelitySheet} onOpenChange={setShowFidelitySheet}>
        <SheetContent className="bg-background/95 backdrop-blur-xl border-l border-border/30">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-light flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Enhance Data Fidelity
            </SheetTitle>
            <SheetDescription>
              Improve your brand's intelligence with more prompt coverage
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Current Fidelity</span>
                <span className="text-2xl font-light text-foreground">60%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-foreground/70"
                  style={{ width: '60%' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm text-foreground">What you'll get:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Track 10 additional prompts for 100% fidelity</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>More accurate AI visibility scoring</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Better competitive intelligence</span>
                </li>
              </ul>
            </div>

            <Button 
              className="w-full rounded-full mt-6"
              onClick={() => {
                setShowFidelitySheet(false);
                navigate('/settings?tab=billing');
              }}
            >
              Upgrade to Pro
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
