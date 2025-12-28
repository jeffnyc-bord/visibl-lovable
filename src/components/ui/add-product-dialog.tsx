import * as React from "react";
import { useState } from "react";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Loader2, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { UpgradeDialog } from "./upgrade-dialog";

interface AddProductDialogProps {
  trigger?: React.ReactNode;
  onProductAdded?: (product: any) => void;
}

export function AddProductDialog({ trigger, onProductAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { canAddChatbot, chatbotsTracked, limits, refreshSubscription } = useSubscription();
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
    sku: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const usagePercent = (chatbotsTracked / (limits.maxChatbots === 999999 ? 100 : limits.maxChatbots)) * 100;
  const isNearLimit = usagePercent >= 80;

  // Reset states when dialog closes
  React.useEffect(() => {
    if (!open) {
      setLoading(false);
      setShowSuccess(false);
      setFormData({ name: "", url: "", category: "", sku: "", description: "" });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check product limit
    if (!canAddChatbot) {
      setShowUpgradeDialog(true);
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoading(false);
      setShowSuccess(true);
      
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        url: formData.url,
        category: formData.category || "Uncategorized",
        sku: formData.sku || `AUTO-${Date.now()}`,
        description: formData.description,
        score: null,
        status: "analyzing"
      };
      
      // Refresh subscription to update product count
      await refreshSubscription();
      
      // Show success state, then close
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      onProductAdded?.(newProduct);
      
      toast({
        title: "Product Added",
        description: "Your product has been queued for AI readiness analysis.",
      });
      
      setOpen(false);
      
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    if (loading || showSuccess) return;
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger && (
          <div onClick={() => canAddChatbot && setOpen(true)}>
            {trigger}
          </div>
        )}
        <DialogPortal>
          <DialogOverlay className="bg-foreground/20 backdrop-blur-sm" />
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <div 
              className="w-full max-w-lg animate-in slide-in-from-bottom-8 duration-300 ease-out"
              style={{
                animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* macOS Sequoia Sheet Modal */}
              <div 
                className="relative rounded-[20px] overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Success Overlay */}
                {showSuccess && (
                  <div 
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95 animate-in fade-in duration-300"
                    style={{
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {/* Success checkmark with ring animation */}
                    <div className="relative mb-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 71% 45%) 100%)',
                          boxShadow: '0 0 0 0 hsla(142, 76%, 36%, 0.4)',
                          animation: 'successPulse 1s ease-out'
                        }}
                      >
                        <Check 
                          className="w-8 h-8 text-white" 
                          style={{
                            animation: 'checkDraw 0.4s ease-out 0.1s both'
                          }}
                        />
                      </div>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-foreground mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, sans-serif',
                        animationDelay: '0.15s',
                        animationFillMode: 'both'
                      }}
                    >
                      Product Added
                    </h3>
                    <p 
                      className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        animationDelay: '0.25s',
                        animationFillMode: 'both'
                      }}
                    >
                      Starting AI readiness analysis...
                    </p>
                    
                    {/* Animated processing indicator */}
                    <div 
                      className="mt-6 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ 
                        animationDelay: '0.35s',
                        animationFillMode: 'both'
                      }}
                    >
                      <div className="flex -space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div 
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/60"
                            style={{
                              animation: `queueDot 0.6s ease-in-out ${i * 0.1}s infinite alternate`
                            }}
                          />
                        ))}
                      </div>
                      <span 
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Analyzing...
                      </span>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="relative px-6 pt-6 pb-4">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    disabled={loading || showSuccess}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>

                  {/* Title with Icon */}
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-5 h-5 text-foreground/70" />
                    <h2 
                      className="text-lg font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, sans-serif' }}
                    >
                      Add Product
                    </h2>
                  </div>
                  
                  {/* Subtitle */}
                  <p 
                    className="text-center text-sm text-muted-foreground mt-1"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                  >
                    Add a product or service for AI readiness analysis
                  </p>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="px-6 pb-6">
                  <div className="space-y-4 mb-6">
                    {/* Product Name */}
                    <div className="space-y-1.5">
                      <label 
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Product Name
                      </label>
                      <Input
                        placeholder="e.g., Nike Air Max 1"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading || showSuccess}
                        className={`border-0 bg-muted/40 rounded-xl h-11 px-4 text-[15px] placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-muted/60 transition-all ${errors.name ? 'ring-2 ring-destructive/50' : ''}`}
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    
                    {/* URL */}
                    <div className="space-y-1.5">
                      <label 
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Product URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/product"
                        value={formData.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        onFocus={() => setFocusedField("url")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading || showSuccess}
                        className={`border-0 bg-muted/40 rounded-xl h-11 px-4 text-[15px] placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-muted/60 transition-all ${errors.url ? 'ring-2 ring-destructive/50' : ''}`}
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      />
                      {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
                    </div>
                    
                    {/* Category & SKU Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label 
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                        >
                          Category
                        </label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => handleInputChange("category", value)}
                          disabled={loading || showSuccess}
                        >
                          <SelectTrigger className="border-0 bg-muted/40 rounded-xl h-11 px-4 text-[15px] focus:ring-2 focus:ring-primary/30 focus:bg-muted/60 transition-all">
                            <SelectValue placeholder="Optional" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="footwear">Footwear</SelectItem>
                            <SelectItem value="apparel">Apparel</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label 
                          className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                        >
                          SKU
                        </label>
                        <Input
                          placeholder="Optional"
                          value={formData.sku}
                          onChange={(e) => handleInputChange("sku", e.target.value)}
                          disabled={loading || showSuccess}
                          className="border-0 bg-muted/40 rounded-xl h-11 px-4 text-[15px] placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-muted/60 transition-all"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                        />
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-1.5">
                      <label 
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Description
                      </label>
                      <Textarea
                        placeholder="Brief description (optional)"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        disabled={loading || showSuccess}
                        rows={2}
                        className="border-0 bg-muted/40 rounded-xl px-4 py-3 text-[15px] placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:bg-muted/60 transition-all resize-none"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Bottom Bar: Capacity Meter + Actions */}
                  <div className="flex flex-col gap-4">
                    {/* Top row: Capacity + Nudge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        {/* Thin Progress Bar */}
                        <div className="w-16 h-1 bg-muted/60 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(usagePercent, 100)}%`,
                              backgroundColor: isNearLimit ? 'hsl(var(--destructive))' : 'hsl(var(--foreground) / 0.4)'
                            }}
                          />
                        </div>
                        <span 
                          className="text-xs text-muted-foreground whitespace-nowrap"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                        >
                          {chatbotsTracked}/{limits.maxChatbots === 999999 ? '∞' : limits.maxChatbots} Products
                        </span>
                      </div>
                      
                      {/* Nudge for near limit */}
                      {isNearLimit && (
                        <button
                          type="button"
                          onClick={() => setShowUpgradeDialog(true)}
                          className="text-xs text-primary hover:underline underline-offset-2 transition-all"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                        >
                          Need more? Upgrade now.
                        </button>
                      )}
                    </div>

                    {/* Bottom row: Action Buttons - Right aligned */}
                    <div className="flex items-center justify-end gap-4">
                      {/* Cancel - Ghost with underline on hover */}
                      <button 
                        type="button" 
                        onClick={handleClose}
                        disabled={loading || showSuccess}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground relative group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Cancel
                        <span className="absolute bottom-1.5 left-4 right-4 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      </button>

                      {/* Add Product - High-gloss black pill */}
                      <button 
                        type="submit" 
                        disabled={!formData.name.trim() || !formData.url.trim() || loading || showSuccess}
                        className="px-6 py-2.5 rounded-full text-sm font-medium text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap flex items-center gap-2"
                        style={{ 
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                          background: formData.name.trim() && formData.url.trim() && !loading
                            ? 'linear-gradient(180deg, hsl(0 0% 15%) 0%, hsl(0 0% 9%) 100%)' 
                            : 'hsl(var(--muted))'
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          'Add Product'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogPortal>
        
        {/* Custom keyframes for success animation */}
        <style>{`
          @keyframes successPulse {
            0% {
              box-shadow: 0 0 0 0 hsla(142, 76%, 36%, 0.6);
              transform: scale(0.8);
            }
            50% {
              box-shadow: 0 0 0 20px hsla(142, 76%, 36%, 0);
              transform: scale(1.05);
            }
            100% {
              box-shadow: 0 0 0 0 hsla(142, 76%, 36%, 0);
              transform: scale(1);
            }
          }
          
          @keyframes checkDraw {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-10deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          @keyframes queueDot {
            0% {
              opacity: 0.4;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}</style>
      </Dialog>
      
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        reason="product_limit"
      />
    </>
  );
}
