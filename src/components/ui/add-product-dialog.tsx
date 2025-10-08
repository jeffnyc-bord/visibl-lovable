import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { canAddProduct, productsTracked, limits, refreshSubscription } = useSubscription();
  
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
    sku: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product/Service name is required";
    }
    
    if (!formData.url.trim()) {
      newErrors.url = "Primary URL is required";
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
    if (!canAddProduct) {
      setShowUpgradeDialog(true);
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        url: formData.url,
        category: formData.category || "Uncategorized",
        sku: formData.sku || `AUTO-${Date.now()}`,
        description: formData.description,
        score: null, // Will be populated after analysis
        status: "analyzing"
      };
      
      // Refresh subscription to update product count
      await refreshSubscription();
      
      onProductAdded?.(newProduct);
      
      toast({
        title: "Product Added Successfully",
        description: "Your product has been queued for initial AI readiness analysis.",
      });
      
      // Reset form
      setFormData({
        name: "",
        url: "",
        category: "",
        sku: "",
        description: ""
      });
      setErrors({});
      setOpen(false);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="flex items-center space-x-2" disabled={!canAddProduct}>
              <Plus className="w-4 h-4" />
              <span>Add Product/Service {!canAddProduct && '(Limit Reached)'}</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Product/Service</span>
            </DialogTitle>
            <DialogDescription>
              Manually add a product or service for AI readiness analysis ({productsTracked}/{limits.maxProducts === 999999 ? '∞' : limits.maxProducts} products used)
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product/Service Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Nike Air Max 1"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="apparel">Apparel</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Primary URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/product-page"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className={errors.url ? "border-red-500" : ""}
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
              <p className="text-xs text-muted-foreground">The main product/service page URL for analysis</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium">
                SKU/Identifier
              </Label>
              <Input
                id="sku"
                placeholder="e.g., AIR-MAX-001 (optional)"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Internal product identifier or SKU</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Short Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of the product/service (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Analysis typically takes 5-10 minutes</span>
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        reason="product_limit"
      />
    </>
  );
}