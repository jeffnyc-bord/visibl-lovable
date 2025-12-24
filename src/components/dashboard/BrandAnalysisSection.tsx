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
  Pin,
  Plus,
  Loader2,
  RotateCcw,
  ChevronRight,
  Check,
  Sparkles,
  Globe,
  Brain,
  BarChart3,
  Clock
} from "lucide-react";

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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [upgradeSheetOpen, setUpgradeSheetOpen] = useState(false);
  const [activeListTab, setActiveListTab] = useState<'attention' | 'ready'>('attention');
  
  const currentProductCount = brandData.products.length;
  const maxProducts = 5; // For upsell demo
  const isAtLimit = currentProductCount >= maxProducts;

  // Visibility pillars data
  const visibilityPillars = [
    { label: "Platform Coverage", current: 2, max: 4, icon: Globe },
    { label: "Intelligence Depth", current: 10, max: 25, icon: Brain },
    { label: "Market Presence", current: 78, max: 100, icon: BarChart3, isPercentage: true },
    { label: "Content Freshness", current: 85, max: 100, icon: Clock, isPercentage: true },
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
    lastUpdated: `${Math.floor(Math.random() * 6) + 1} hours ago`,
    isPinned: index < 2,
    status: "complete",
    thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`
  }));

  const allProducts = [...newProducts, ...mockProducts];
  const topProducts = allProducts.filter(p => p.score >= 90).slice(0, 5);
  const bottomProducts = allProducts.filter(p => p.score < 70 && p.status === "complete").slice(0, 5);

  // Score distribution for battery bar
  const scoreDistribution = [
    { label: "Excellent", range: "90-100%", count: 156, percentage: 12, color: "hsl(142, 71%, 45%)" },
    { label: "Good", range: "80-89%", count: 423, percentage: 34, color: "hsl(200, 80%, 50%)" },
    { label: "Needs Work", range: "70-79%", count: 579, percentage: 46, color: "hsl(45, 90%, 55%)" },
    { label: "Poor", range: "<70%", count: 89, percentage: 8, color: "hsl(0, 70%, 55%)" },
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
          ? { 
              ...p, 
              status: "complete",
              score: Math.floor(Math.random() * 30) + 60,
              mentions: Math.floor(Math.random() * 50) + 10,
              rank: Math.floor(Math.random() * 20) + 5,
              gaps: "Content clarity",
              lastUpdated: "Just now"
            }
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
    <div className="space-y-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, sans-serif' }}>
      {/* Header with Add Product icon */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#86868B' }}>Products</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#1D1D1F' }}>AI Readiness</h1>
        </div>
        <AddProductDialog 
          onProductAdded={handleProductAdded}
          trigger={
            <button className="p-2 rounded-full hover:bg-muted/50 transition-colors" aria-label="Add Product">
              <Plus className="w-5 h-5" style={{ color: '#86868B' }} />
            </button>
          }
        />
      </div>

      {/* Executive Summary Panel - Vibrancy Effect */}
      <div 
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="grid grid-cols-12 gap-8">
          {/* Column 1: Circular Gauge for Average Readiness */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(0 0% 92%)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${82 * 2.64} ${100 * 2.64}`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-semibold tabular-nums" style={{ color: '#1D1D1F' }}>82</span>
                <span className="text-sm" style={{ color: '#86868B' }}>%</span>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: '#86868B' }}>Average AI Readiness</p>
            {/* Coverage Gap Upsell */}
            <button 
              className="text-xs mt-2 hover:underline transition-all"
              style={{ color: 'hsl(210, 100%, 50%)' }}
              onClick={() => setUpgradeSheetOpen(true)}
            >
              Unlock deeper coverage: Track 2 more chatbots
            </button>
          </div>

          {/* Column 2: Inventory Counts */}
          <div className="col-span-4 flex flex-col justify-center space-y-5">
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <span className="text-sm" style={{ color: '#86868B' }}>Total Products</span>
              <span 
                className="text-2xl font-semibold tabular-nums"
                style={{ color: isAtLimit ? 'hsl(25, 95%, 53%)' : '#1D1D1F' }}
              >
                {currentProductCount}/{maxProducts >= 999999 ? '∞' : maxProducts}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <span className="text-sm" style={{ color: '#86868B' }}>Needs Attention</span>
              <span className="text-2xl font-semibold tabular-nums" style={{ color: 'hsl(0, 70%, 55%)' }}>89</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm" style={{ color: '#86868B' }}>AI-Ready</span>
              <span className="text-2xl font-semibold tabular-nums" style={{ color: 'hsl(142, 71%, 45%)' }}>156</span>
            </div>
          </div>

          {/* Column 3: Battery Bar Score Distribution */}
          <div className="col-span-4 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#86868B' }}>Score Distribution</p>
            
            {/* Segmented Battery Bar */}
            <div className="flex h-6 rounded-lg overflow-hidden mb-4" style={{ background: 'hsl(0 0% 95%)' }}>
              {scoreDistribution.map((item, index) => (
                <div
                  key={index}
                  className="h-full flex items-center justify-center text-xs font-medium transition-all hover:opacity-90"
                  style={{ 
                    width: `${item.percentage}%`,
                    background: item.color,
                    color: 'white',
                    borderRight: index < scoreDistribution.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none'
                  }}
                  title={`${item.label}: ${item.count} (${item.percentage}%)`}
                >
                  {item.percentage >= 15 && `${item.percentage}%`}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {scoreDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: '#86868B' }}>
                    {item.label} <span className="tabular-nums font-medium" style={{ color: '#1D1D1F' }}>{item.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Pillars */}
      <div 
        className="rounded-2xl p-5 mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#86868B' }}>Visibility Pillars</p>
        <div className="grid grid-cols-4 gap-6">
          {visibilityPillars.map((pillar, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'hsl(0 0% 96%)' }}>
                <pillar.icon className="w-4 h-4" style={{ color: '#86868B' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#86868B' }}>{pillar.label}</p>
                <p className="text-lg font-semibold tabular-nums" style={{ color: '#1D1D1F' }}>
                  {pillar.isPercentage ? `${pillar.current}%` : `${pillar.current}/${pillar.max}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segmented Control for Product Lists */}
      <div className="mb-4">
        <div 
          className="inline-flex p-1 rounded-lg"
          style={{ background: 'hsl(0 0% 95%)' }}
        >
          <button
            onClick={() => setActiveListTab('attention')}
            className="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2"
            style={{
              background: activeListTab === 'attention' ? 'white' : 'transparent',
              color: activeListTab === 'attention' ? '#1D1D1F' : '#86868B',
              boxShadow: activeListTab === 'attention' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: activeListTab === 'attention' ? 'hsl(0, 70%, 55%)' : '#86868B' }} />
            Needs Attention
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                background: activeListTab === 'attention' ? 'hsl(0, 70%, 55%)' : 'hsl(0 0% 88%)',
                color: activeListTab === 'attention' ? 'white' : '#86868B'
              }}
            >
              {bottomProducts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveListTab('ready')}
            className="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2"
            style={{
              background: activeListTab === 'ready' ? 'white' : 'transparent',
              color: activeListTab === 'ready' ? '#1D1D1F' : '#86868B',
              boxShadow: activeListTab === 'ready' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: activeListTab === 'ready' ? 'hsl(142, 71%, 45%)' : '#86868B' }} />
            Top AI-Ready
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                background: activeListTab === 'ready' ? 'hsl(142, 71%, 45%)' : 'hsl(0 0% 88%)',
                color: activeListTab === 'ready' ? 'white' : '#86868B'
              }}
            >
              {topProducts.length}
            </span>
          </button>
        </div>
      </div>

      {/* High-Density Product List */}
      <div 
        className="rounded-2xl overflow-hidden mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {activeListProducts.length > 0 ? (
          activeListProducts.map((product, index) => (
            <div 
              key={product.id}
              className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group hover:bg-black/[0.02]"
              style={{ 
                borderBottom: index < activeListProducts.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' 
              }}
              onClick={() => window.location.href = `/product/${product.id}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Tiny thumbnail */}
                <img 
                  src={product.thumbnail} 
                  alt="" 
                  className="w-8 h-8 rounded-lg object-cover"
                  style={{ background: 'hsl(0 0% 96%)' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors" style={{ color: '#1D1D1F' }}>
                    {product.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#86868B' }}>{product.sku}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Status pill */}
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    background: activeListTab === 'ready' ? 'hsl(142 76% 94%)' : 'hsl(0 76% 94%)',
                    color: activeListTab === 'ready' ? 'hsl(142 71% 35%)' : 'hsl(0 70% 45%)'
                  }}
                >
                  {product.score}%
                </span>

                {/* Trend */}
                <div 
                  className="flex items-center gap-0.5 text-xs"
                  style={{ color: product.trend > 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 70%, 55%)' }}
                >
                  {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {product.trend > 0 ? '+' : ''}{product.trend}%
                </div>

                {/* Quick Fix Chevron - appears on hover */}
                <ChevronRight 
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                  style={{ color: '#86868B' }} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {activeListTab === 'attention' ? (
              <>
                <CheckCircle className="w-8 h-8 mb-3" style={{ color: 'hsl(142, 71%, 45%)' }} />
                <p className="text-sm font-medium" style={{ color: '#1D1D1F' }}>All products performing well</p>
                <p className="text-xs mt-1" style={{ color: '#86868B' }}>No products need attention</p>
              </>
            ) : (
              <>
                <Star className="w-8 h-8 mb-3" style={{ color: '#86868B' }} />
                <p className="text-sm font-medium" style={{ color: '#1D1D1F' }}>No top performers yet</p>
                <p className="text-xs mt-1" style={{ color: '#86868B' }}>Optimize products to reach 90%+</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* All Products Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: '#1D1D1F' }}>All Products</h2>
          <span className="text-sm" style={{ color: '#86868B' }}>
            {allProducts.length} of 1,247 products
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#86868B' }} />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background border-border/30 rounded-lg text-sm"
              style={{ background: 'hsl(0 0% 96%)' }}
            />
          </div>
          
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchReanalyze}
              disabled={isReanalyzing}
              className="h-9 rounded-lg border-border/30"
            >
              {isReanalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-2" />
              )}
              {isReanalyzing ? "Analyzing..." : `Re-analyze (${selectedProducts.length})`}
            </Button>
          )}
          
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-28 h-9 border-border/30 rounded-lg text-sm" style={{ background: 'hsl(0 0% 96%)' }}>
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
            <SelectTrigger className="w-36 h-9 border-border/30 rounded-lg text-sm" style={{ background: 'hsl(0 0% 96%)' }}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score-desc">Score (High to Low)</SelectItem>
              <SelectItem value="score-asc">Score (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="trend-desc">Most Improving</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unified Product Table */}
        {allProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p style={{ color: '#86868B' }} className="mb-4">No products yet</p>
            <AddProductDialog 
              onProductAdded={handleProductAdded}
              trigger={
                <button className="text-primary hover:underline text-sm">
                  Add your first product
                </button>
              }
            />
          </div>
        ) : (
          <div 
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Table Header */}
            <div 
              className="grid grid-cols-12 gap-4 py-2.5 px-4 text-xs font-medium"
              style={{ color: '#86868B', borderBottom: '0.5px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}
            >
              <div className="col-span-1 flex items-center">
                <button
                  onClick={() => handleSelectAll(selectedProducts.length !== allProducts.filter(p => p.status !== "analyzing").length)}
                  className="flex items-center justify-center w-4 h-4 rounded border transition-all cursor-pointer"
                  style={{ 
                    borderColor: selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 ? '#1D1D1F' : 'rgba(0,0,0,0.2)',
                    background: selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 ? '#1D1D1F' : 'transparent'
                  }}
                >
                  {selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0 && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
              </div>
              <div className="col-span-4">Product</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">AI Readiness</div>
              <div className="col-span-1">Trend</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            
            {/* Product Rows */}
            {allProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`grid grid-cols-12 gap-4 py-3 px-4 items-center transition-colors group ${
                  product.status === "analyzing" ? "" : "hover:bg-black/[0.02]"
                }`}
                style={{ 
                  borderBottom: index < allProducts.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
                  background: product.status === "analyzing" ? 'hsl(210 100% 98%)' : 'transparent'
                }}
              >
                <div className="col-span-1">
                  {product.status !== "analyzing" && (
                    <button
                      onClick={() => handleSelectProduct(product.id)}
                      className="flex items-center justify-center w-4 h-4 rounded border transition-all cursor-pointer"
                      style={{ 
                        borderColor: selectedProducts.includes(product.id) ? '#1D1D1F' : 'rgba(0,0,0,0.2)',
                        background: selectedProducts.includes(product.id) ? '#1D1D1F' : 'transparent'
                      }}
                    >
                      {selectedProducts.includes(product.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                  )}
                </div>
                
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.thumbnail} 
                      alt="" 
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      style={{ background: 'hsl(0 0% 96%)' }}
                    />
                    <div className="min-w-0">
                      <p 
                        className={`text-sm font-medium truncate transition-colors ${product.status === "analyzing" ? "" : "cursor-pointer group-hover:text-primary"}`}
                        style={{ color: product.status === "analyzing" ? 'hsl(210, 100%, 45%)' : '#1D1D1F' }}
                        onClick={() => product.status !== "analyzing" && (window.location.href = `/product/${product.id}`)}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: '#86868B' }}>{product.sku}</p>
                    </div>
                    {product.status === "analyzing" && (
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: 'hsl(210, 100%, 45%)' }} />
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  {product.status === "analyzing" ? (
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ background: 'hsl(210 100% 92%)', color: 'hsl(210, 100%, 45%)' }}
                    >
                      Analyzing
                    </span>
                  ) : (
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        background: product.score >= 90 ? 'hsl(142 76% 94%)' : product.score >= 70 ? 'hsl(45 90% 94%)' : 'hsl(0 76% 94%)',
                        color: product.score >= 90 ? 'hsl(142 71% 35%)' : product.score >= 70 ? 'hsl(35 90% 40%)' : 'hsl(0 70% 45%)'
                      }}
                    >
                      {product.score >= 90 ? 'Ready' : product.score >= 70 ? 'Good' : 'Needs Work'}
                    </span>
                  )}
                </div>
                
                <div className="col-span-2">
                  {product.status === "analyzing" ? (
                    <span className="text-xs" style={{ color: '#86868B' }}>—</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Thin progress bar */}
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(0 0% 92%)' }}>
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${product.score}%`,
                            background: product.score >= 90 
                              ? 'hsl(142, 71%, 45%)' 
                              : product.score >= 70 
                                ? 'hsl(45, 90%, 55%)' 
                                : 'hsl(0, 70%, 55%)'
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium tabular-nums" style={{ color: '#1D1D1F' }}>{product.score}%</span>
                    </div>
                  )}
                </div>
                
                <div className="col-span-1">
                  {product.status === "analyzing" ? (
                    <span className="text-xs" style={{ color: '#86868B' }}>—</span>
                  ) : (
                    <div 
                      className="inline-flex items-center gap-0.5 text-xs"
                      style={{ color: product.trend > 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 70%, 55%)' }}
                    >
                      {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {product.trend > 0 ? '+' : ''}{product.trend}%
                    </div>
                  )}
                </div>
                
                <div className="col-span-2 flex justify-end">
                  {product.status === "analyzing" ? (
                    <span className="text-xs" style={{ color: 'hsl(210, 100%, 45%)' }}>In Queue</span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#86868B' }}
                      onClick={() => onOptimizeProduct?.(String(product.id), product.name)}
                    >
                      Optimize
                      <ChevronRight className="w-3 h-3 ml-1" />
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
            <span className="text-sm" style={{ color: '#86868B' }}>
              Showing {allProducts.length} of 1,247 products
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" style={{ color: '#86868B' }}>Previous</Button>
              <Button variant="ghost" size="sm" style={{ color: '#86868B' }}>Next</Button>
            </div>
          </div>
        )}
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
