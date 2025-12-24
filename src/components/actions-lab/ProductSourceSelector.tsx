import { useState, useMemo } from 'react';
import { ChevronRight, Package, Check, ChevronDown, Plus, Search, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface ProductSource {
  id: string;
  name: string;
  category: string;
  visibilityScore: number;
  mentions: number;
  brandLogo?: string;
}

interface ProductSourceSelectorProps {
  products: ProductSource[];
  selectedProduct: ProductSource | null;
  onSelectProduct: (product: ProductSource) => void;
  disabled?: boolean;
  stepNumber?: number;
}

export const ProductSourceSelector = ({
  products,
  selectedProduct,
  onSelectProduct,
  disabled = false,
  stepNumber = 1,
}: ProductSourceSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const hasProducts = products.length > 0;
  const showSearch = products.length > 3;

  return (
    <section className={cn(
      "relative transition-all duration-300 ease-out",
      disabled && "opacity-40 pointer-events-none"
    )}>
      {/* Section Header */}
      <div className="flex items-center justify-between py-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 group"
        >
          <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold transition-colors",
            selectedProduct 
              ? "bg-foreground text-background" 
              : "bg-muted text-muted-foreground"
          )}>
            {selectedProduct ? <Check className="w-3 h-3" /> : stepNumber}
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Select Product
          </span>
          {selectedProduct && (
            <span className="text-xs text-foreground/60 normal-case tracking-normal">
              — {selectedProduct.name}
            </span>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )} />
        </button>

        {/* Search Input */}
        {showSearch && isExpanded && (
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs bg-muted/30 border-border/50 focus:border-primary/50"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {isExpanded && !hasProducts && (
        <div className="py-12 flex flex-col items-center text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            No products yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs mb-4">
            Add your first product to start generating AI-optimized content for your catalog.
          </p>
          <Button
            onClick={() => navigate('/?tab=brand')}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Product
          </Button>
        </div>
      )}

      {/* List View */}
      {isExpanded && hasProducts && (
        <div className="divide-y divide-border/40 animate-fade-in">
          {filteredProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No products match "{searchQuery}"
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={cn(
                  "w-full flex items-center gap-4 py-3 px-1 text-left transition-colors duration-150 group",
                  "hover:bg-muted/30",
                  selectedProduct?.id === product.id && "bg-foreground/5"
                )}
              >
                {/* Radio Circle */}
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                  selectedProduct?.id === product.id
                    ? "border-foreground bg-foreground"
                    : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                )}>
                  {selectedProduct?.id === product.id && (
                    <Check className="w-2.5 h-2.5 text-background" />
                  )}
                </div>

                {/* Product Icon */}
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "block text-sm line-clamp-1",
                    selectedProduct?.id === product.id ? "text-foreground font-medium" : "text-foreground/80"
                  )}>
                    {product.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </div>

                {/* Metadata */}
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {product.mentions} mentions
                </span>
                <span className="text-xs font-medium text-foreground/60 hidden sm:block">
                  {product.visibilityScore}%
                </span>

                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </button>
            ))
          )}

          {/* Add Product Helper */}
          <button
            onClick={() => navigate('/?tab=brand')}
            className="w-full flex items-center gap-2 py-3 px-1 text-left group hover:bg-muted/30 transition-colors"
          >
            <div className="w-4 h-4 flex-shrink-0" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Don't see your product?
            </span>
            <span className="text-sm text-primary font-medium group-hover:underline">
              Add it now →
            </span>
          </button>
        </div>
      )}

      {/* Thin Divider */}
      <div className="mt-4 border-t border-border/30" />
    </section>
  );
};
