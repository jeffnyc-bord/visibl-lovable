import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddProductDialog } from "@/components/ui/add-product-dialog";
import { UpgradeSheet } from "@/components/ui/upgrade-sheet";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  AlertTriangle,
  CheckCircle,
  Star,
  Plus,
  Loader2,
  RotateCcw,
  ChevronRight,
  Check,
  Sparkles,
  Globe,
  Brain,
  BarChart3,
  Clock,
  Zap,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface BrandAnalysisSectionProps {
  brandData: BrandData;
  demoMode?: boolean;
  onOptimizeProduct?: (productId: string, productName: string) => void;
}

export const BrandAnalysisSection = ({ brandData, demoMode = false, onOptimizeProduct }: BrandAnalysisSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [upgradeSheetOpen, setUpgradeSheetOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState<'attention' | 'ready'>('attention');
  
  const currentProductCount = brandData.products.length;
  const maxProducts = 5;
  const isAtLimit = currentProductCount >= maxProducts;

  // Visibility pillars data
  const visibilityPillars = [
    { 
      label: "Platform Coverage", 
      current: 2, 
      max: 4, 
      icon: Globe,
      description: "Tracking more AI platforms (ChatGPT, Claude, Perplexity, etc.) increases your score confidence by cross-validating visibility across different LLMs. Each platform has unique training data and response patterns."
    },
    { 
      label: "Intelligence Depth", 
      current: 10, 
      max: 25, 
      icon: Brain,
      description: "More prompts mean broader coverage of how customers actually search using AI. Higher prompt count increases score confidence and ensures your products appear across diverse customer queries and use cases."
    },
    { 
      label: "Market Presence", 
      current: 78, 
      max: 100, 
      icon: BarChart3, 
      isPercentage: true,
      description: "The percentage of tracked prompts where your product or brand was mentioned in AI responses. Higher market presence means your brand is being recommended more frequently across customer queries."
    },
    { 
      label: "Content Freshness", 
      current: 85, 
      max: 100, 
      icon: Clock, 
      isPercentage: true,
      description: "LLMs favor up-to-date, comprehensive content. Regular updates and broader topic coverage increase the likelihood of your products being surfaced in AI responses. Fresh content signals relevance and authority."
    },
  ];

  const mockProducts = brandData.products.map((product, index) => ({
    id: product.id,
    name: product.name,
    sku: `${product.name.toUpperCase().replace(/\s+/g, '-')}-${String(product.id).padStart(3, '0')}`,
    score: product.visibilityScore,
    trend: product.sentiment === "positive" ? 5 : product.sentiment === "negative" ? -3 : 1,
    category: product.category,
    gaps: product.visibilityScore > 90 ? "Schema optimization" : product.visibilityScore > 70 ? "Content clarity" : "Missing product schema",
    mentions: product.mentions,
    rank: index + 3,
    lastUpdated: `${Math.floor(Math.random() * 6) + 1}h ago`,
    isPinned: index < 2,
    status: "complete",
    thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`
  }));

  const allProducts = [...newProducts, ...mockProducts];
  const topProducts = allProducts.filter(p => p.score >= 90).slice(0, 5);
  const bottomProducts = allProducts.filter(p => p.score < 70 && p.status === "complete").slice(0, 5);

  // Score distribution for battery bar
  const scoreDistribution = [
    { label: "Excellent", count: 156, percentage: 12, color: "linear-gradient(135deg, #34C759, #30D158)" },
    { label: "Good", count: 423, percentage: 34, color: "linear-gradient(135deg, #007AFF, #5AC8FA)" },
    { label: "Fair", count: 579, percentage: 46, color: "linear-gradient(135deg, #FF9500, #FFCC00)" },
    { label: "Poor", count: 89, percentage: 8, color: "linear-gradient(135deg, #FF3B30, #FF6961)" },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(allProducts.filter(p => p.status !== "analyzing").map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBatchReanalyze = async () => {
    if (selectedProducts.length === 0) return;
    setIsReanalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Re-analysis Complete",
        description: `Successfully re-analyzed ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}.`,
      });
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to re-analyze selected products.",
        variant: "destructive",
      });
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleProductAdded = (product: any) => {
    const newProduct = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      score: null,
      trend: 0,
      category: product.category,
      gaps: "Analyzing...",
      mentions: 0,
      rank: null,
      lastUpdated: "Just now",
      isPinned: false,
      status: "analyzing",
      thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`
    };
    setNewProducts(prev => [...prev, newProduct]);
    toast({
      title: "Analysis Started",
      description: `${product.name} is being analyzed.`,
    });
    setTimeout(() => {
      setNewProducts(prev => prev.map(p => 
        p.id === product.id 
          ? { ...p, status: "complete", score: Math.floor(Math.random() * 30) + 60, mentions: Math.floor(Math.random() * 50) + 10, rank: Math.floor(Math.random() * 20) + 5, gaps: "Content clarity", lastUpdated: "Just now" }
          : p
      ));
      toast({
        title: "Analysis Complete",
        description: `${product.name} is now ready.`,
      });
    }, 10000);
  };

  const activeListProducts = activeListTab === 'attention' ? bottomProducts : topProducts;

  return (
    <div 
      className="relative min-h-screen"
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Rounded", system-ui, sans-serif',
      }}
    >
      {/* Subtle mesh gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 0% 0%, rgba(0, 122, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(88, 86, 214, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(52, 199, 89, 0.02) 0%, transparent 40%)
          `,
          zIndex: 0
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Minimal Header */}
        <div className="flex items-center justify-between">
          <div>
          <p className="text-sm text-muted-foreground tracking-wide uppercase mb-1">Products</p>
          <h1 className="text-3xl font-light tracking-tight text-foreground">AI Readiness</h1>
          </div>
          <AddProductDialog 
            onProductAdded={handleProductAdded}
            trigger={
              <button 
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(0,0,0,0.04)' }}
                aria-label="Add Product"
              >
                <Plus className="w-5 h-5" style={{ color: '#1D1D1F' }} />
              </button>
            }
          />
        </div>

        {/* Main Overview Panel - Floating with Vibrancy */}
        <div 
          className="rounded-[20px] p-8 animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="flex items-start gap-16">
            {/* Left: The Readiness Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                {/* Background ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(0,0,0,0.06)"
                    strokeWidth="5"
                  />
                  {/* Progress ring with glossy gradient */}
                  <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34C759" />
                      <stop offset="50%" stopColor="#30D158" />
                      <stop offset="100%" stopColor="#32DE84" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#ringGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${82 * 2.76} ${100 * 2.76}`}
                    style={{ 
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: 'drop-shadow(0 2px 8px rgba(52, 199, 89, 0.3))'
                    }}
                  />
                </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[40px] font-extralight tabular-nums tracking-tighter leading-none" style={{ color: '#1D1D1F' }}>82</span>
                <span className="text-[13px] font-light mt-0.5" style={{ color: '#86868B' }}>%</span>
              </div>
            </div>
            
            {/* Upsell Pill Button */}
            <button 
              onClick={() => setUpgradeSheetOpen(true)}
              className="mt-5 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1))',
                color: '#007AFF',
              }}
            >
              <Zap className="w-3 h-3 inline mr-1.5 -mt-0.5" />
              Boost Accuracy: Track 2 More Chatbots
            </button>
            </div>

          {/* Center: Stats Stack */}
            <div className="flex flex-col justify-center py-2 min-w-[140px]">
              <div className="mb-6">
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-1" style={{ color: '#86868B' }}>TOTAL PRODUCTS</p>
                <p 
                  className="text-[36px] font-extralight tabular-nums tracking-tighter leading-none"
                  style={{ color: isAtLimit ? '#FF9500' : '#1D1D1F' }}
                >
                  {currentProductCount}<span className="text-[20px] font-light" style={{ color: '#86868B' }}>/{maxProducts >= 999999 ? '∞' : maxProducts}</span>
                </p>
              </div>
              <div className="mb-6">
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-1" style={{ color: '#86868B' }}>NEEDS ATTENTION</p>
                <p className="text-[36px] font-extralight tabular-nums tracking-tighter leading-none" style={{ color: '#FF3B30' }}>89</p>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-1" style={{ color: '#86868B' }}>AI-READY</p>
                <p className="text-[36px] font-extralight tabular-nums tracking-tighter leading-none" style={{ color: '#34C759' }}>156</p>
              </div>
            </div>

            {/* Right: Battery Bar */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: '#86868B' }}>SCORE DISTRIBUTION</p>
              
              {/* Battery Bar */}
              <div className="flex h-2 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(0,0,0,0.04)' }}>
                {scoreDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="h-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`,
                      background: item.color,
                    }}
                  />
                ))}
              </div>

              {/* Inline Legend */}
              <div className="flex items-center gap-6">
                {scoreDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ background: item.color.includes('gradient') ? item.color.replace('linear-gradient(135deg, ', '').split(',')[0] : item.color }} 
                    />
                    <span className="text-[11px]" style={{ color: '#86868B' }}>{item.label}</span>
                    <span className="text-[11px] font-medium tabular-nums" style={{ color: '#1D1D1F' }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Pillars - Clean Rows, No Borders */}
        <div 
          className="rounded-[20px] p-6 animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            animationDelay: '0.1s'
          }}
        >
          <p className="text-[11px] font-medium tracking-[0.08em] uppercase mb-5" style={{ color: '#86868B' }}>VISIBILITY PILLARS</p>
          
          {/* Pillars as clean rows with 40px spacing */}
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-10">
              {visibilityPillars.map((pillar, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-4 group transition-all hover:opacity-80 active:scale-[0.98]"
                    >
                      <pillar.icon className="w-5 h-5" style={{ color: '#86868B' }} />
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] font-medium tracking-[0.04em] uppercase" style={{ color: '#86868B' }}>{pillar.label}</p>
                          {pillar.description && <Info className="w-3 h-3" style={{ color: '#86868B' }} />}
                        </div>
                        <p className="text-[24px] font-extralight tabular-nums tracking-tighter leading-tight" style={{ color: '#1D1D1F' }}>
                          {pillar.isPercentage ? `${pillar.current}%` : <>{pillar.current}<span className="text-[14px] font-light" style={{ color: '#86868B' }}>/{pillar.max}</span></>}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" style={{ color: '#86868B' }} />
                    </button>
                  </TooltipTrigger>
                  {pillar.description && (
                    <TooltipContent 
                      side="bottom" 
                      sideOffset={8}
                      className="max-w-xs p-3 text-[12px] leading-relaxed z-[100]"
                    >
                      {pillar.description}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-4">
          <div 
            className="inline-flex p-1 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.04)' }}
          >
            <button
              onClick={() => setActiveListTab('attention')}
              className="px-5 py-2 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2"
              style={{
                background: activeListTab === 'attention' ? 'white' : 'transparent',
                color: activeListTab === 'attention' ? '#1D1D1F' : '#86868B',
                boxShadow: activeListTab === 'attention' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: activeListTab === 'attention' ? '#FF3B30' : '#86868B' }} />
              Needs Attention
              <span 
                className="text-[11px] font-medium px-2 py-0.5 rounded-full tabular-nums"
                style={{ 
                  background: activeListTab === 'attention' ? 'rgba(255, 59, 48, 0.12)' : 'rgba(0,0,0,0.06)',
                  color: activeListTab === 'attention' ? '#FF3B30' : '#86868B'
                }}
              >
                {bottomProducts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveListTab('ready')}
              className="px-5 py-2 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2"
              style={{
                background: activeListTab === 'ready' ? 'white' : 'transparent',
                color: activeListTab === 'ready' ? '#1D1D1F' : '#86868B',
                boxShadow: activeListTab === 'ready' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: activeListTab === 'ready' ? '#34C759' : '#86868B' }} />
              Top AI-Ready
              <span 
                className="text-[11px] font-medium px-2 py-0.5 rounded-full tabular-nums"
                style={{ 
                  background: activeListTab === 'ready' ? 'rgba(52, 199, 89, 0.12)' : 'rgba(0,0,0,0.06)',
                  color: activeListTab === 'ready' ? '#34C759' : '#86868B'
                }}
              >
                {topProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Product List - Floating Panel */}
        <div 
          className="rounded-[20px] overflow-hidden animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            animationDelay: '0.15s'
          }}
        >
          {activeListProducts.length > 0 ? (
            activeListProducts.map((product, index) => (
              <div 
                key={product.id}
                className="flex items-center justify-between px-6 py-4 cursor-pointer transition-all group hover:bg-white/60"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium truncate transition-colors" style={{ color: '#1D1D1F' }}>
                      {product.name}
                    </p>
                    <p className="text-[12px] truncate" style={{ color: '#86868B' }}>{product.sku}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <span 
                    className="text-[15px] font-light tabular-nums"
                    style={{ color: activeListTab === 'ready' ? '#34C759' : '#FF3B30' }}
                  >
                    {product.score}%
                  </span>

                  <div 
                    className="flex items-center gap-1 text-[12px] font-medium"
                    style={{ color: product.trend > 0 ? '#34C759' : '#FF3B30' }}
                  >
                    {product.trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {product.trend > 0 ? '+' : ''}{product.trend}%
                  </div>

                  <ChevronRight 
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" 
                    style={{ color: '#86868B' }} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {activeListTab === 'attention' ? (
                <>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(52, 199, 89, 0.12)' }}>
                    <CheckCircle className="w-6 h-6" style={{ color: '#34C759' }} />
                  </div>
                  <p className="text-[15px] font-light" style={{ color: '#1D1D1F' }}>All products performing well</p>
                  <p className="text-[13px] mt-1" style={{ color: '#86868B' }}>No products need attention</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(0,0,0,0.04)' }}>
                    <Star className="w-6 h-6" style={{ color: '#86868B' }} />
                  </div>
                  <p className="text-[15px] font-light" style={{ color: '#1D1D1F' }}>No top performers yet</p>
                  <p className="text-[13px] mt-1" style={{ color: '#86868B' }}>Optimize products to reach 90%+</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* All Products Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-light" style={{ color: '#1D1D1F' }}>All Products</h2>
            <span className="text-[13px]" style={{ color: '#86868B' }}>
              {allProducts.length} of 1,247
            </span>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#86868B' }} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-0 rounded-xl text-[13px]"
                style={{ background: 'rgba(0,0,0,0.04)' }}
              />
            </div>
            
            {selectedProducts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchReanalyze}
                disabled={isReanalyzing}
                className="h-9 rounded-xl border-0 text-[13px]"
                style={{ background: 'rgba(0,122,255,0.08)', color: '#007AFF' }}
              >
                {isReanalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                {isReanalyzing ? "Analyzing..." : `Re-analyze (${selectedProducts.length})`}
              </Button>
            )}
            
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-28 h-9 border-0 rounded-xl text-[13px]" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="excellent">90-100%</SelectItem>
                <SelectItem value="good">80-89%</SelectItem>
                <SelectItem value="needs-work">70-79%</SelectItem>
                <SelectItem value="poor">&lt;70%</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-9 border-0 rounded-xl text-[13px]" style={{ background: 'rgba(0,0,0,0.04)' }}>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Score ↓</SelectItem>
                <SelectItem value="score-asc">Score ↑</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="trend-desc">Trending</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Add Product Button - Right aligned, Apple style */}
            <div className="ml-auto">
              <AddProductDialog
                trigger={
                  <button
                    className="h-9 px-4 rounded-full text-[13px] font-medium flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      background: 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
                      color: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)'
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Product
                  </button>
                }
              />
            </div>
          </div>

          {/* All Products Table */}
          {allProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p style={{ color: '#86868B' }} className="mb-4 text-[14px]">No products yet</p>
              <AddProductDialog 
                onProductAdded={handleProductAdded}
                trigger={
                  <button className="text-[14px] font-medium" style={{ color: '#007AFF' }}>
                    Add your first product
                  </button>
                }
              />
            </div>
          ) : (
            <div 
              className="rounded-[20px] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Header */}
              <div 
                className="grid grid-cols-12 gap-4 py-3 px-6 text-[11px] font-medium tracking-[0.04em] uppercase"
                style={{ color: '#86868B', background: 'rgba(0,0,0,0.02)' }}
              >
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={() => handleSelectAll(selectedProducts.length !== allProducts.filter(p => p.status !== "analyzing").length)}
                    className="w-4 h-4 rounded flex items-center justify-center transition-all"
                    style={{ 
                      background: selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 ? '#007AFF' : 'transparent',
                      border: `1.5px solid ${selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 ? '#007AFF' : 'rgba(0,0,0,0.2)'}`
                    }}
                  >
                    {selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                </div>
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-1">Trend</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              
              {/* Rows */}
              {allProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`grid grid-cols-12 gap-4 py-4 px-6 items-center transition-all group ${
                    product.status === "analyzing" ? "" : "hover:bg-white/60 cursor-pointer"
                  }`}
                  style={{ background: product.status === "analyzing" ? 'rgba(0, 122, 255, 0.04)' : 'transparent' }}
                  onClick={() => product.status !== "analyzing" && (window.location.href = `/product/${product.id}`)}
                >
                  <div className="col-span-1" onClick={(e) => e.stopPropagation()}>
                    {product.status !== "analyzing" && (
                      <button
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 rounded flex items-center justify-center transition-all"
                        style={{ 
                          background: selectedProducts.includes(product.id) ? '#007AFF' : 'transparent',
                          border: `1.5px solid ${selectedProducts.includes(product.id) ? '#007AFF' : 'rgba(0,0,0,0.2)'}`
                        }}
                      >
                        {selectedProducts.includes(product.id) && <Check className="w-3 h-3 text-white" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium truncate" style={{ color: product.status === "analyzing" ? '#007AFF' : '#1D1D1F' }}>
                          {product.name}
                        </p>
                        <p className="text-[12px] truncate" style={{ color: '#86868B' }}>{product.sku}</p>
                      </div>
                      {product.status === "analyzing" && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: '#007AFF' }} />}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span 
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: product.status === "analyzing" ? 'rgba(0, 122, 255, 0.12)' : product.score >= 90 ? 'rgba(52, 199, 89, 0.12)' : product.score >= 70 ? 'rgba(255, 149, 0, 0.12)' : 'rgba(255, 59, 48, 0.12)',
                        color: product.status === "analyzing" ? '#007AFF' : product.score >= 90 ? '#34C759' : product.score >= 70 ? '#FF9500' : '#FF3B30'
                      }}
                    >
                      {product.status === "analyzing" ? 'Analyzing' : product.score >= 90 ? 'Ready' : product.score >= 70 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    {product.status === "analyzing" ? (
                      <span className="text-[12px]" style={{ color: '#86868B' }}>—</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${product.score}%`,
                              background: product.score >= 90 ? 'linear-gradient(90deg, #34C759, #30D158)' : product.score >= 70 ? 'linear-gradient(90deg, #FF9500, #FFCC00)' : 'linear-gradient(90deg, #FF3B30, #FF6961)'
                            }}
                          />
                        </div>
                        <span className="text-[13px] font-light tabular-nums" style={{ color: '#1D1D1F' }}>{product.score}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1">
                    {product.status === "analyzing" ? (
                      <span className="text-[12px]" style={{ color: '#86868B' }}>—</span>
                    ) : (
                      <div className="flex items-center gap-0.5 text-[12px] font-medium" style={{ color: product.trend > 0 ? '#34C759' : '#FF3B30' }}>
                        {product.trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {product.trend > 0 ? '+' : ''}{product.trend}%
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex justify-end" onClick={(e) => e.stopPropagation()}>
                    {product.status === "analyzing" ? (
                      <span className="text-[12px] font-medium" style={{ color: '#007AFF' }}>In Queue</span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-[12px] h-7 px-3 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                        style={{ color: '#007AFF' }}
                        onClick={() => onOptimizeProduct?.(String(product.id), product.name)}
                      >
                        Optimize
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {allProducts.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <span className="text-[13px]" style={{ color: '#86868B' }}>Showing {allProducts.length} of 1,247</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-[13px] h-8 px-3 rounded-lg" style={{ color: '#86868B' }}>Previous</Button>
                <Button variant="ghost" size="sm" className="text-[13px] h-8 px-3 rounded-lg" style={{ color: '#007AFF' }}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <UpgradeSheet
        open={upgradeSheetOpen}
        onOpenChange={setUpgradeSheetOpen}
        type="product_coverage"
        currentValue={currentProductCount}
        maxValue={maxProducts}
      />
    </div>
  );
};
