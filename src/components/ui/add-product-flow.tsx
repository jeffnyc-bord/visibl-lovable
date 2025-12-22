import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Loader2, 
  ChevronRight, 
  ChevronLeft, 
  Package, 
  Globe, 
  Tag, 
  FileText,
  CheckCircle,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { UpgradeDialog } from "./upgrade-dialog";

interface AddProductFlowProps {
  onProductAdded?: (product: any) => void;
  onCancel?: () => void;
}

export function AddProductFlow({ onProductAdded, onCancel }: AddProductFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
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

  const steps = [
    { num: 1, label: "Basic Info", icon: Package },
    { num: 2, label: "Details", icon: Tag },
    { num: 3, label: "Description", icon: FileText },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Check product limit
    if (!canAddProduct) {
      setShowUpgradeDialog(true);
      return;
    }
    
    if (!validateStep(1)) {
      setCurrentStep(1);
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
        score: null,
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
      setCurrentStep(1);
      
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

  const handleCancel = () => {
    setFormData({
      name: "",
      url: "",
      category: "",
      sku: "",
      description: ""
    });
    setErrors({});
    setCurrentStep(1);
    onCancel?.();
  };

  return (
    <>
      <Card className="shadow-sm border-border overflow-hidden">
        {/* Header with step indicator */}
        <div className="px-6 py-5 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Add Product/Service</h3>
                <p className="text-sm text-muted-foreground">
                  {productsTracked}/{limits.maxProducts === 999999 ? '∞' : limits.maxProducts} products tracked
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.num < currentStep 
                        ? 'bg-green-500 text-white' 
                        : step.num === currentStep 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.num < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    step.num <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-3 mb-6 transition-colors ${
                    step.num < currentStep ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <CardContent className="p-6">
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10">
                        <Package className="h-3 w-3 text-primary" />
                      </div>
                      Product/Service Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Nike Air Max 1"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`h-11 ${errors.name ? "border-destructive" : ""}`}
                      autoFocus
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10">
                        <Globe className="h-3 w-3 text-primary" />
                      </div>
                      Primary URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/product-page"
                      value={formData.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      className={`h-11 ${errors.url ? "border-destructive" : ""}`}
                    />
                    {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
                    <p className="text-xs text-muted-foreground">The main product/service page URL for analysis</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="h-11">
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

                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium">
                      SKU/Identifier
                    </Label>
                    <Input
                      id="sku"
                      placeholder="e.g., AIR-MAX-001 (optional)"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">Internal product identifier or SKU</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Short Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the product/service (optional)"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      A brief description helps our AI better understand and analyze your product
                    </p>
                  </div>

                  {/* Summary preview */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-medium">{formData.name || "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        <span className="font-medium">{formData.category || "Uncategorized"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">URL:</span>{" "}
                        <span className="font-medium text-xs break-all">{formData.url || "—"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between pt-5 mt-5 border-t">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 3
            </div>
            <div className="flex gap-2">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack} className="h-10">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleCancel} className="h-10">
                  Cancel
                </Button>
              )}

              {currentStep < 3 ? (
                <Button onClick={handleNext} className="h-10">
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="h-10">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog}
        reason="product_limit"
      />
    </>
  );
}
