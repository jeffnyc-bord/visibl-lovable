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
  ArrowUpRight,
  Check
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
  
  const currentProductCount = brandData.products.length;
  const maxProducts = 10;

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
    status: "complete"
  }));

  const allProducts = [...newProducts, ...mockProducts];
  const topProducts = allProducts.filter(p => p.score >= 90).slice(0, 5);
  const bottomProducts = allProducts.filter(p => p.score < 70 && p.status === "complete").slice(0, 5);

  // Score distribution data
  const scoreDistribution = [
    { label: "Excellent", range: "90-100%", count: 156, percentage: 12, color: "hsl(142, 71%, 45%)" },
    { label: "Good", range: "80-89%", count: 423, percentage: 34, color: "hsl(200, 80%, 50%)" },
    { label: "Needs Work", range: "70-79%", count: 579, percentage: 46, color: "hsl(35, 90%, 55%)" },
    { label: "Poor", range: "<70%", count: 89, percentage: 7, color: "hsl(0, 70%, 55%)" },
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
      status: "analyzing"
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

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-8">
        <div>
          <p className="text-sm text-muted-foreground tracking-wide uppercase mb-1">Products</p>
          <h1 className="text-3xl font-light tracking-tight text-foreground">AI Readiness</h1>
        </div>
        <AddProductDialog 
          onProductAdded={handleProductAdded}
          trigger={
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          }
        />
      </div>

      {/* Hero Stats */}
      <div className="py-8 border-b border-border/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Large Score */}
          <div className="lg:col-span-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-2">Average AI Readiness</span>
              <div className="relative">
                <span 
                  className="text-7xl font-extralight tracking-tighter text-foreground"
                  style={{ textShadow: '0 0 60px rgba(34, 197, 94, 0.1)' }}
                >
                  82
                </span>
                <span className="text-2xl font-extralight text-muted-foreground ml-1">%</span>
                
                {/* Trend Badge */}
                <div 
                  className="absolute -right-2 top-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: 'rgb(22, 163, 74)',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)'
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  +2%
                </div>
              </div>
            </div>
          </div>

          {/* Center: Key Metrics */}
          <div className="lg:col-span-4 flex items-center">
            <div className="grid grid-cols-3 gap-8 w-full">
              <div>
                <p className="text-3xl font-extralight text-foreground">1,247</p>
                <p className="text-xs text-muted-foreground mt-1">Total Products</p>
              </div>
              <div>
                <p className="text-3xl font-extralight text-red-500">89</p>
                <p className="text-xs text-muted-foreground mt-1">Need Attention</p>
              </div>
              <div>
                <p className="text-3xl font-extralight text-green-600">156</p>
                <p className="text-xs text-muted-foreground mt-1">AI-Ready</p>
              </div>
            </div>
          </div>

          {/* Right: Score Distribution - Apple Health Style */}
          <div className="lg:col-span-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Score Distribution</p>
            <div className="space-y-3">
              {scoreDistribution.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-border/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top / Bottom Products */}
      <div className="py-8 border-b border-border/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Top Products */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-4 h-4 text-green-600" />
              <h3 className="text-lg font-light text-foreground">Top AI-Ready</h3>
            </div>
            <div className="space-y-0">
              {topProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 hover:bg-muted/20 -mx-4 px-4 cursor-pointer transition-colors group"
                  onClick={() => window.location.href = `/product/${product.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-green-600 tabular-nums">{product.score}%</span>
                    <div 
                      className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      +{product.trend}%
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Products */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="text-lg font-light text-foreground">Needs Attention</h3>
            </div>
            <div className="space-y-0">
              {bottomProducts.length > 0 ? (
                bottomProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 hover:bg-muted/20 -mx-4 px-4 cursor-pointer transition-colors group"
                    onClick={() => window.location.href = `/product/${product.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-red-500 tabular-nums">{product.score}%</span>
                      <div 
                        className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(220, 38, 38)' }}
                      >
                        <TrendingDown className="w-3 h-3" />
                        {product.trend}%
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/product/${product.id}?section=opportunities`;
                        }}
                      >
                        Fix Now
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                  <p className="text-sm text-foreground">All products performing well</p>
                  <p className="text-xs text-muted-foreground mt-1">No products need attention</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All Products Section */}
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-light text-foreground">All Products</h2>
          <span className="text-sm text-muted-foreground">
            {allProducts.length} of 1,247 products
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-background border-border/30 rounded-xl"
            />
          </div>
          
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchReanalyze}
              disabled={isReanalyzing}
              className="h-10 rounded-full border-border/30"
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
            <SelectTrigger className="w-32 h-10 bg-background border-border/30 rounded-xl">
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
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 h-10 bg-background border-border/30 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-10 bg-background border-border/30 rounded-xl">
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

        {/* Product List */}
        {allProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
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
          <div className="rounded-2xl border border-border/20 overflow-hidden bg-background/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 py-3 px-5 text-xs text-muted-foreground border-b border-border/10 bg-muted/20">
              <div className="col-span-1 flex items-center">
                <button
                  onClick={() => handleSelectAll(selectedProducts.length !== allProducts.filter(p => p.status !== "analyzing").length)}
                  className="group relative flex items-center justify-center w-5 h-5 rounded-full border border-border hover:border-foreground transition-all duration-200 cursor-pointer bg-background"
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                    selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0
                      ? 'bg-foreground scale-100 opacity-100' 
                      : 'bg-transparent scale-0 opacity-0'
                  }`} />
                  <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                    selectedProducts.length === allProducts.filter(p => p.status !== "analyzing").length && allProducts.length > 0
                      ? 'text-background scale-100 opacity-100' 
                      : 'text-transparent scale-0 opacity-0'
                  }`} />
                </button>
              </div>
              <div className="col-span-4">Product</div>
              <div className="col-span-2">AI Readiness</div>
              <div className="col-span-1">Trend</div>
              <div className="col-span-1">Mentions</div>
              <div className="col-span-2">Updated</div>
              <div className="col-span-1"></div>
            </div>
            
            {/* Product Rows */}
            {allProducts.map((product) => (
              <div 
                key={product.id} 
                className={`grid grid-cols-12 gap-4 py-4 px-5 items-center border-b border-border/10 last:border-0 transition-colors ${
                  product.status === "analyzing" 
                    ? "bg-blue-50/30" 
                    : "hover:bg-muted/20"
                }`}
              >
                <div className="col-span-1">
                  {product.status !== "analyzing" && (
                    <button
                      onClick={() => handleSelectProduct(product.id)}
                      className="group relative flex items-center justify-center w-5 h-5 rounded-full border border-border hover:border-foreground transition-all duration-200 cursor-pointer bg-background"
                    >
                      <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                        selectedProducts.includes(product.id)
                          ? 'bg-foreground scale-100 opacity-100' 
                          : 'bg-transparent scale-0 opacity-0'
                      }`} />
                      <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                        selectedProducts.includes(product.id)
                          ? 'text-background scale-100 opacity-100' 
                          : 'text-transparent scale-0 opacity-0'
                      }`} />
                    </button>
                  )}
                </div>
                
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    {product.status === "analyzing" && (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                    )}
                    <div>
                      <p 
                        className={`text-sm ${product.status === "analyzing" ? "text-blue-600" : "text-foreground hover:text-primary cursor-pointer"} transition-colors`}
                        onClick={() => product.status !== "analyzing" && (window.location.href = `/product/${product.id}`)}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                    {product.status === "analyzing" && (
                      <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 border-0 ml-2">
                        Analyzing
                      </Badge>
                    )}
                    {product.isPinned && product.status !== "analyzing" && (
                      <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  {product.status === "analyzing" ? (
                    <span className="text-xs text-blue-600">Analyzing...</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* Apple Health-style thin bar */}
                      <div className="w-16 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${product.score}%`,
                            background: product.score >= 90 
                              ? 'hsl(142, 71%, 45%)' 
                              : product.score >= 70 
                                ? 'hsl(35, 90%, 55%)' 
                                : 'hsl(0, 70%, 55%)'
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground tabular-nums">{product.score}%</span>
                    </div>
                  )}
                </div>
                
                <div className="col-span-1">
                  {product.status === "analyzing" ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : product.trend > 0 ? (
                    <div 
                      className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(22, 163, 74)' }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      +{product.trend}%
                    </div>
                  ) : (
                    <div 
                      className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(220, 38, 38)' }}
                    >
                      <TrendingDown className="w-3 h-3" />
                      {product.trend}%
                    </div>
                  )}
                </div>
                
                <div className="col-span-1">
                  <span className="text-sm text-foreground tabular-nums">
                    {product.status === "analyzing" ? "—" : product.mentions}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">{product.lastUpdated}</span>
                </div>
                
                <div className="col-span-1 flex justify-end">
                  {product.status === "analyzing" ? (
                    <span className="text-xs text-blue-600">In Queue</span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => onOptimizeProduct?.(String(product.id), product.name)}
                    >
                      Optimize
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {allProducts.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-muted-foreground">
              Showing {allProducts.length} of 1,247 products
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Previous</Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Next</Button>
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
