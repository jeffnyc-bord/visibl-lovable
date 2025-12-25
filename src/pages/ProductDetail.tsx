import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Sparkles,
  Wrench,
  ArrowRight,
  ExternalLink,
  Zap
} from "lucide-react";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";
import { AddPromptDialog } from "@/components/ui/add-prompt-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GhostProductSlot } from "@/components/ui/ghost-product-slot";
import { FidelityMeter } from "@/components/ui/fidelity-meter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UpgradeSheet } from "@/components/ui/upgrade-sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// AI Platform Logos
import chatGPTLogo from "@/assets/chatGPT_logo.png";
import geminiLogo from "@/assets/gemini_logo.png";
import perplexityLogo from "@/assets/perplexity_logo.png";
import grokLogo from "@/assets/grok_logo_new.png";

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
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedGapId, setSelectedGapId] = useState<number | null>(null);
  const [showUpgradeSheet, setShowUpgradeSheet] = useState(false);

  // Platform logo mapping
  const platformLogos: Record<string, string> = {
    'ChatGPT': chatGPTLogo,
    'Gemini': geminiLogo,
    'Perplexity': perplexityLogo,
    'Grok': grokLogo
  };
  
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

  // Apple-style pillar data with platform details
  const platformDetails: Record<string, { name: string; active: boolean; benefit: string }> = {
    'ChatGPT': { 
      name: 'ChatGPT', 
      active: true, 
      benefit: 'Largest user base with 100M+ weekly active users. Essential for consumer discovery.' 
    },
    'Gemini': { 
      name: 'Gemini', 
      active: true, 
      benefit: 'Integrated with Google Search. Critical for SEO-adjacent AI visibility.' 
    },
    'Perplexity': { 
      name: 'Perplexity', 
      active: false, 
      benefit: 'Research-focused AI with citation support. Key for B2B and technical audiences.' 
    },
    'Grok': { 
      name: 'Grok', 
      active: false, 
      benefit: 'Real-time X/Twitter integration. Valuable for social commerce and trending topics.' 
    }
  };

  const pillars = {
    platformCoverage: { 
      current: 2, 
      total: 4, 
      platforms: ['ChatGPT', 'Gemini', 'Perplexity', 'Grok'],
      platformDetails
    },
    intelligenceDepth: { current: 12, total: 25 },
    marketPresence: { mentions: 1247, trend: [45, 52, 48, 61, 55, 72, 68] },
    contentFreshness: { activePages: 8, lastSync: '2m ago' }
  };

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
                <div className="relative mb-6 flex items-baseline gap-2">
                  <div 
                    className="text-8xl font-extralight tracking-tighter text-foreground"
                    style={{
                      textShadow: mockProduct.trend > 0 ? '0 0 60px rgba(34, 197, 94, 0.15)' : 'none'
                    }}
                  >
                    {mockProduct.score}
                  </div>
                  <span className="text-2xl font-extralight text-muted-foreground">/100</span>
                  
                  {/* Trend Badge with Glow */}
                  <div 
                    className="ml-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium"
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
                
                {/* AI Readiness Label + Fix Now Button */}
                <div className="flex items-center gap-4 mb-8">
                  <p className="text-sm text-muted-foreground">AI Readiness Score</p>
                  <button
                    onClick={() => {
                      setSelectedGapId(1);
                      setShowTransitionModal(true);
                    }}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 transition-all duration-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-medium text-amber-600">Fix Now</span>
                    <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>

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

            {/* Right: Score Breakdown - Apple Settings Style */}
            <div className="lg:col-span-7">
              <p className="text-sm text-muted-foreground mb-6 font-medium tracking-wide">Score Breakdown</p>
              
              {/* Frosted Glass Container */}
              <div 
                className="rounded-2xl border border-border/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                {/* Pillar 1: Platform Coverage */}
                <div className="p-5 border-b border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Platform Coverage</span>
                    <span className="text-lg font-semibold text-foreground">{pillars.platformCoverage.current}/{pillars.platformCoverage.total} <span className="text-sm font-normal text-muted-foreground">Platforms</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <TooltipProvider delayDuration={200}>
                      <div className="flex items-center gap-3">
                        {pillars.platformCoverage.platforms.map((platform) => {
                          const details = platformDetails[platform];
                          const isActive = details?.active ?? false;
                          return (
                            <Tooltip key={platform}>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer group ${
                                    isActive 
                                      ? 'bg-background shadow-sm ring-1 ring-border/40 hover:ring-primary/40 hover:shadow-md' 
                                      : 'bg-muted/30 hover:bg-muted/50'
                                  }`}
                                >
                                  <img 
                                    src={platformLogos[platform]} 
                                    alt={platform}
                                    className={`w-6 h-6 object-contain transition-all ${
                                      isActive ? '' : 'grayscale opacity-40 group-hover:opacity-60'
                                    }`}
                                  />
                                  {/* Lock indicator for inactive platforms */}
                                  {!isActive && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-muted border border-background flex items-center justify-center">
                                      <svg className="w-2 h-2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                      </svg>
                                    </div>
                                  )}
                                  {/* Active indicator */}
                                  {isActive && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border border-background flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-success-foreground" />
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="bottom" 
                                sideOffset={8}
                                className="max-w-xs p-3 z-[100]"
                                style={{
                                  background: 'rgba(0, 0, 0, 0.85)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-primary-foreground text-sm">{platform}</span>
                                    <Badge 
                                      variant={isActive ? "default" : "secondary"}
                                      className={`text-[10px] px-1.5 py-0 h-4 ${
                                        isActive 
                                          ? 'bg-success/20 text-success border-success/30' 
                                          : 'bg-muted/30 text-muted-foreground/80 border-muted-foreground/20'
                                      }`}
                                    >
                                      {isActive ? 'Active' : 'Locked'}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground/90 leading-relaxed">
                                    {details?.benefit}
                                  </p>
                                  {!isActive && (
                                    <p className="text-xs text-primary/80 font-medium pt-1">
                                      Upgrade to Pro to unlock
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </TooltipProvider>
                    <button 
                      onClick={() => setShowUpgradeSheet(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
                    >
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Expand Coverage</span>
                    </button>
                  </div>
                </div>

                {/* Pillar 2: Intelligence Depth */}
                <div className="p-5 border-b border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Intelligence Depth</span>
                    <span className="text-lg font-semibold text-foreground">{pillars.intelligenceDepth.current}/{pillars.intelligenceDepth.total} <span className="text-sm font-normal text-muted-foreground">Prompts</span></span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-foreground/70 transition-all duration-700 ease-out"
                        style={{ width: `${(pillars.intelligenceDepth.current / pillars.intelligenceDepth.total) * 100}%` }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        // If almost at limit (>80%), show paywall
                        const usagePercent = (pillars.intelligenceDepth.current / pillars.intelligenceDepth.total) * 100;
                        if (usagePercent >= 80) {
                          setShowUpgradeSheet(true);
                        } else {
                          // Anchor to prompts section
                          setActiveSection('prompts');
                          const promptsSection = document.getElementById('prompts-section');
                          if (promptsSection) {
                            promptsSection.scrollIntoView({ behavior: 'smooth' });
                          }
                          setShowAddPrompt(true);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group shrink-0"
                    >
                      <Plus className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Add Prompts</span>
                    </button>
                  </div>
                </div>

                {/* Pillar 3: Market Presence */}
                <div className="p-5 border-b border-border/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Market Presence</span>
                    <span className="text-lg font-semibold text-foreground">{pillars.marketPresence.mentions.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">Mentions</span></span>
                  </div>
                  {/* Sparkline */}
                  <div className="flex items-end gap-1 h-8">
                    {pillars.marketPresence.trend.map((value, idx) => {
                      const maxVal = Math.max(...pillars.marketPresence.trend);
                      const height = (value / maxVal) * 100;
                      return (
                        <div 
                          key={idx}
                          className="flex-1 rounded-sm bg-foreground/20 transition-all hover:bg-foreground/40"
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
                </div>

                {/* Pillar 4: Content Freshness */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Content Freshness</span>
                    <span className="text-lg font-semibold text-foreground">{pillars.contentFreshness.activePages} <span className="text-sm font-normal text-muted-foreground">Active Pages</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Last sync with AEO Content Studio: {pillars.contentFreshness.lastSync}</p>
                    <button 
                      onClick={() => navigate('/?tab=actions&view=content-studio-library')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all group"
                    >
                      <ExternalLink className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Open Studio</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prompts Section */}
          <div id="prompts-section" className="space-y-8">
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
                            ? 'text-background opacity-100' 
                            : 'text-transparent opacity-0'
                        }`} />
                      </button>
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Query</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Top Platform</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Mentions</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-medium w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.map((prompt) => (
                    <TableRow 
                      key={prompt.id}
                      className="border-border/10 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => handleMentionClick(prompt.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTogglePromptSelection(prompt.id)}
                          className="group/check relative flex items-center justify-center w-5 h-5 rounded-full border border-border hover:border-foreground transition-all duration-200 cursor-pointer bg-background"
                        >
                          <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                            selectedPrompts.includes(prompt.id)
                              ? 'bg-foreground scale-100 opacity-100' 
                              : 'bg-transparent scale-0 opacity-0'
                          }`} />
                          <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                            selectedPrompts.includes(prompt.id)
                              ? 'text-background opacity-100' 
                              : 'text-transparent opacity-0'
                          }`} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                            {prompt.query}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {prompt.excerpt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={platformLogos[prompt.model]} 
                            alt={prompt.model} 
                            className="w-5 h-5 rounded"
                          />
                          <span className="text-sm text-muted-foreground">{prompt.model}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground font-medium">{prompt.mentions}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{prompt.date}</span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
                              <Settings className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleToggleQueue(prompt.id)}>
                              {prompt.queued ? 'Remove from Queue' : 'Add to Queue'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(prompt.query)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Query
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSinglePrompt(prompt.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
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

      {/* Transition Modal - Apple Style */}
      {showTransitionModal && selectedGapId && (() => {
        const selectedGap = gaps.find(g => g.id === selectedGapId);
        if (!selectedGap) return null;
        return (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 animate-scale-in border border-border/50">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto">
                  <Wrench className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-foreground">
                    Opening Content Studio
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You're about to optimize <strong className="text-foreground">{mockProduct.name}</strong> to fix:
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/20">
                    <p className="text-sm font-medium text-foreground">{selectedGap.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedGap.description}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 gap-2"
                    onClick={() => {
                      setShowTransitionModal(false);
                      setSelectedGapId(null);
                      navigate(`/?tab=recommendations&subtab=on-site&productId=${productId}`);
                    }}
                  >
                    Continue to Studio
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-full"
                    onClick={() => {
                      setShowTransitionModal(false);
                      setSelectedGapId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Upgrade Sheet */}
      <UpgradeSheet 
        open={showUpgradeSheet} 
        onOpenChange={setShowUpgradeSheet} 
        type="chatbot_coverage"
      />
    </>
  );
};
