
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AddProductDialog } from "@/components/ui/add-product-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter,
  ArrowUpDown,
  Eye,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Package,
  Star,
  ExternalLink,
  Zap,
  Pin,
  Plus,
  Loader2,
  RotateCcw
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
}

export const BrandAnalysisSection = ({ brandData }: BrandAnalysisSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");
  const [pinnedFilter, setPinnedFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  // Use brand's product data with enhanced mock structure
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
    isPinned: index < 2
  }));

  const topProducts = mockProducts.filter(p => p.score >= 90).slice(0, 5);
  const bottomProducts = mockProducts.filter(p => p.score < 70).slice(0, 5);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(mockProducts.map(p => p.id));
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
      // Simulate batch re-analysis
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
    toast({
      title: "Analysis Started",
      description: `${product.name} has been added and is being analyzed. You'll be notified when complete.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Overall Product AI Readiness Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Product AI Readiness</CardTitle>
            <CardDescription>Aggregated view of your entire product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-blue-600">82%</div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+2% this week</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average AI Readiness Score</span>
                <Progress value={82} className="w-24 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Product Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-xs text-gray-500">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 cursor-pointer hover:underline">89</div>
              <div className="text-xs text-gray-500">Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 cursor-pointer hover:underline">156</div>
              <div className="text-xs text-gray-500">AI-Ready</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Excellent (90-100%)</span>
              <span className="font-medium">156</span>
            </div>
            <Progress value={15} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span>Good (80-89%)</span>
              <span className="font-medium">423</span>
            </div>
            <Progress value={40} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span>Needs Work (70-79%)</span>
              <span className="font-medium">579</span>
            </div>
            <Progress value={35} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span>Poor (&lt;70%)</span>
              <span className="font-medium">89</span>
            </div>
            <Progress value={10} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Top / Bottom Performing Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center text-green-600">
              <Star className="w-4 h-4 mr-2" />
              Top AI-Ready Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <div 
                      className="font-medium text-sm cursor-pointer hover:text-blue-600" 
                      onClick={() => window.location.href = `/product/${product.id}`}
                    >
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.sku}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-700 border-green-300">{product.score}%</Badge>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+{product.trend}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Products Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bottomProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div 
                      className="font-medium text-sm cursor-pointer hover:text-blue-600" 
                      onClick={() => window.location.href = `/product/${product.id}`}
                    >
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.sku}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-700 border-red-300">{product.score}%</Badge>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">{product.trend}%</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs px-2 py-1"
                      onClick={() => window.location.href = `/product/${product.id}?section=opportunities`}
                    >
                      Fix Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Detailed Product AI Readiness Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Product AI Readiness Analysis</CardTitle>
          <CardDescription>Detailed view and management of all product performance</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name, SKU, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <AddProductDialog 
                onProductAdded={handleProductAdded}
                trigger={
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Product/Service</span>
                  </Button>
                }
              />
              {selectedProducts.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBatchReanalyze}
                  disabled={isReanalyzing}
                  className="flex items-center space-x-2"
                >
                  {isReanalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  <span>
                    {isReanalyzing 
                      ? "Re-analyzing..." 
                      : `Re-analyze Selected (${selectedProducts.length})`
                    }
                  </span>
                </Button>
              )}
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
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
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                   <SelectItem value="accessories">Accessories</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={pinnedFilter} onValueChange={setPinnedFilter}>
                 <SelectTrigger className="w-40">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Products</SelectItem>
                   <SelectItem value="pinned">Pinned Only</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score-desc">Score (High to Low)</SelectItem>
                  <SelectItem value="score-asc">Score (Low to High)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="trend-desc">Most Improving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b">
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-gray-700">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={selectedProducts.length === mockProducts.length}
                    onCheckedChange={handleSelectAll}
                    className="mr-2"
                  />
                  Select
                </div>
                <div className="col-span-3">Product / SKU</div>
                <div className="col-span-2">AI Readiness</div>
                <div className="col-span-1">Trend</div>
                <div className="col-span-1">Key Gaps</div>
                <div className="col-span-1">AI Mentions</div>
                <div className="col-span-1">Avg Rank</div>
                <div className="col-span-1">Updated</div>
                <div className="col-span-1">Action</div>
              </div>
            </div>
            <div className="divide-y">
              {mockProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-gray-50">
                  <div className="col-span-1 flex items-center">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                  </div>
                   <div className="col-span-3">
                     <div className="flex items-center space-x-2">
                       <div 
                         className="font-medium text-blue-600 cursor-pointer hover:underline" 
                         onClick={() => window.location.href = `/product/${product.id}`}
                       >
                         {product.name}
                       </div>
                       {product.isPinned && (
                         <Pin className="w-3 h-3 text-amber-500" />
                       )}
                     </div>
                     <div className="text-xs text-gray-500">{product.sku}</div>
                   </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{product.score}%</span>
                        {product.score >= 90 ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : product.score >= 70 ? (
                          <Eye className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <Progress value={product.score} className="h-1" />
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    {product.trend > 0 ? (
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span className="text-xs">+{product.trend}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        <span className="text-xs">{product.trend}%</span>
                      </div>
                    )}
                  </div>
                   <div className="col-span-1">
                     <span className="text-xs text-gray-600">{product.gaps}</span>
                   </div>
                  <div className="col-span-1 font-medium">{product.mentions}</div>
                  <div className="col-span-1 font-medium">#{product.rank}</div>
                  <div className="col-span-1 text-xs text-gray-500">{product.lastUpdated}</div>
                  <div className="col-span-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs px-2 py-1"
                      onClick={() => window.location.href = `/product/${product.id}`}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div>Showing 6 of 1,247 products</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
