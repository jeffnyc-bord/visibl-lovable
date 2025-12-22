import { useState } from 'react';
import { ChevronRight, Package, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductSource {
  id: string;
  name: string;
  category: string;
  visibilityScore: number;
  mentions: number;
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

  return (
    <section className={cn(
      "relative transition-all duration-300 ease-out",
      disabled && "opacity-40 pointer-events-none"
    )}>
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <div className="flex items-center gap-3">
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
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          !isExpanded && "-rotate-90"
        )} />
      </button>

      {/* List View */}
      {isExpanded && (
        <div className="divide-y divide-border/40 animate-fade-in">
          {products.map((product) => (
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
          ))}
        </div>
      )}

      {/* Thin Divider */}
      <div className="mt-4 border-t border-border/30" />
    </section>
  );
};
