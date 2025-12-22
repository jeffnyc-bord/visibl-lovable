
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AddProductDialog } from "@/components/ui/add-product-dialog";
import { UpgradeSheet } from "@/components/ui/upgrade-sheet";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Package,
  Star,
  ExternalLink,
  Pin,
  Plus,
  Loader2,
  RotateCcw,
  ChevronRight
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
  const [pinnedFilter, setPinnedFilter] = useState("all");
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(allProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBatchReanalyze = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsReanalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Re-analysis Complete",
        description: `Successfully re-analyzed ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}. AI readiness scores have been updated.`,
      });
      
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to re-analyze selected products. Please try again.",
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
      description: `${product.name} has been added and is being analyzed.`,
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
        description: `${product.name} has been analyzed and is now ready.`,
      });
    }, 10000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Product AI Readiness</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and optimize your product catalog for AI visibility</p>
        </div>
        <AddProductDialog 
          onProductAdded={handleProductAdded}
          trigger={
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          }
        />
      </div>

      {/* Summary Stats - Clean horizontal row */}
      <div className="flex items-center gap-12 py-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-semibold text-foreground tracking-tight">82%</div>
          <div>
            <p className="text-sm text-muted-foreground">Average AI Readiness</p>
            <div className="flex items-center gap-1 text-emerald-600 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">+2% this week</span>
            </div>
          </div>
        </div>
        
        <div className="h-10 w-px bg-border/50" />
        
        <div>
          <div className="text-2xl font-semibold text-foreground">1,247</div>
          <p className="text-sm text-muted-foreground">Total Products</p>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-red-600">89</div>
          <p className="text-sm text-muted-foreground">Need Attention</p>
        </div>
        
        <div>
          <div className="text-2xl font-semibold text-emerald-600">156</div>
          <p className="text-sm text-muted-foreground">AI-Ready</p>
        </div>
      </div>

      {/* Score Distribution - Inline progress bars */}
      <div className="py-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Score Distribution</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Excellent (90-100%)</span>
              <span className="text-sm font-medium text-foreground">156</span>
            </div>
            <Progress value={15} className="h-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Good (80-89%)</span>
              <span className="text-sm font-medium text-foreground">423</span>
            </div>
            <Progress value={40} className="h-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Needs Work (70-79%)</span>
              <span className="text-sm font-medium text-foreground">579</span>
            </div>
            <Progress value={35} className="h-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Poor (&lt;70%)</span>
              <span className="text-sm font-medium text-foreground">89</span>
            </div>
            <Progress value={10} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Top / Bottom Products - Side by side list style */}
      <div className="grid grid-cols-2 gap-8">
        {/* Top Products */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-medium text-foreground">Top AI-Ready Products</h3>
          </div>
          <div className="space-y-1">
            {topProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
                    <span className="text-xs text-muted-foreground">{product.sku}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-600">{product.score}%</span>
                  <div className="flex items-center text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs ml-0.5">+{product.trend}%</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Products */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-medium text-foreground">Products Needing Attention</h3>
          </div>
          <div className="space-y-1">
            {bottomProducts.length > 0 ? (
              bottomProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => window.location.href = `/product/${product.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{product.name}</span>
                      <span className="text-xs text-muted-foreground">{product.sku}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-red-600">{product.score}%</span>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs ml-0.5">{product.trend}%</span>
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
                <p className="text-sm text-foreground">All products performing well</p>
                <p className="text-xs text-muted-foreground mt-1">No products currently need attention</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">All Products</h3>
          <div className="text-sm text-muted-foreground">
            Showing {allProducts.length} of 1,247 products
          </div>
        </div>

        {/* Search and Filters - Clean inline design */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/30 border-border/50"
            />
          </div>
          
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchReanalyze}
              disabled={isReanalyzing}
              className="h-9 gap-1.5"
            >
              {isReanalyzing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              {isReanalyzing ? "Re-analyzing..." : `Re-analyze (${selectedProducts.length})`}
            </Button>
          )}
          
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-32 h-9 bg-muted/30 border-border/50">
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
            <SelectTrigger className="w-32 h-9 bg-muted/30 border-border/50">
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
            <SelectTrigger className="w-40 h-9 bg-muted/30 border-border/50">
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

        {/* Product List - Clean table style without heavy borders */}
        {allProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <AddProductDialog 
              onProductAdded={handleProductAdded}
              trigger={
                <button className="text-primary hover:underline text-sm font-medium">
                  Add your first product
                </button>
              }
            />
          </div>
        ) : (
          <div>
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedProducts.length === allProducts.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div className="col-span-4">Product</div>
              <div className="col-span-2">AI Readiness</div>
              <div className="col-span-1">Trend</div>
              <div className="col-span-1">Mentions</div>
              <div className="col-span-2">Updated</div>
              <div className="col-span-1"></div>
            </div>
            
            {/* Product Rows */}
            <div>
              {allProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`grid grid-cols-12 gap-4 py-4 items-center border-b border-border/30 transition-colors ${
                    product.status === "analyzing" 
                      ? "bg-blue-50/30" 
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className="col-span-1">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                      disabled={product.status === "analyzing"}
                    />
                  </div>
                  
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      {product.status === "analyzing" && (
                        <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
                      )}
                      <div>
                        <div 
                          className={`text-sm font-medium ${product.status === "analyzing" ? "text-blue-600" : "text-foreground hover:text-primary cursor-pointer"}`}
                          onClick={() => product.status !== "analyzing" && (window.location.href = `/product/${product.id}`)}
                        >
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                      </div>
                      {product.status === "analyzing" && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
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
                      <span className="text-xs text-blue-600 font-medium">Analyzing...</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Progress value={product.score} className="h-1.5 w-16" />
                        <span className="text-sm font-medium text-foreground">{product.score}%</span>
                        {product.score >= 90 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : product.score >= 70 ? (
                          <Eye className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1">
                    {product.status === "analyzing" ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : product.trend > 0 ? (
                      <div className="flex items-center text-emerald-600">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        <span className="text-xs font-medium">+{product.trend}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <TrendingDown className="w-3 h-3 mr-0.5" />
                        <span className="text-xs font-medium">{product.trend}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-1">
                    <span className="text-sm text-foreground">
                      {product.status === "analyzing" ? "—" : product.mentions}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm text-muted-foreground">{product.lastUpdated}</span>
                  </div>
                  
                  <div className="col-span-1">
                    {product.status === "analyzing" ? (
                      <span className="text-xs text-blue-600">In Queue</span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => onOptimizeProduct?.(String(product.id), product.name)}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Optimize
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {allProducts.length} of 1,247 products
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8">Previous</Button>
                <Button variant="ghost" size="sm" className="h-8">Next</Button>
              </div>
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
