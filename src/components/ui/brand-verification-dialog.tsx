import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Globe, Edit3, CheckCircle2 } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  isTracked?: boolean;
  score?: number;
}

interface BrandVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  onConfirm: (verifiedBrands: Brand[]) => void;
}

interface BrandFormData {
  name: string;
  url: string;
  logoFile?: File | null;
  logoPreview?: string;
}

export const BrandVerificationDialog = ({ open, onOpenChange, brands, onConfirm }: BrandVerificationDialogProps) => {
  const [brandForms, setBrandForms] = useState<Record<string, BrandFormData>>(() => 
    brands.reduce((acc, brand) => ({
      ...acc,
      [brand.id]: {
        name: brand.name,
        url: brand.url || "",
        logoFile: null,
        logoPreview: brand.logo || ""
      }
    }), {})
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleInputChange = (brandId: string, field: keyof BrandFormData, value: string) => {
    setBrandForms(prev => ({
      ...prev,
      [brandId]: {
        ...prev[brandId],
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (brandId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setBrandForms(prev => ({
        ...prev,
        [brandId]: {
          ...prev[brandId],
          logoFile: file,
          logoPreview: e.target?.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (brandId: string) => {
    setBrandForms(prev => ({
      ...prev,
      [brandId]: {
        ...prev[brandId],
        logoFile: null,
        logoPreview: ""
      }
    }));
  };

  const handleConfirm = () => {
    // Check if any changes were made
    const hasChanges = brands.some(brand => {
      const form = brandForms[brand.id];
      const originalName = brand.name;
      const originalUrl = brand.url || "";
      const originalLogo = brand.logo || "";
      
      return form?.name !== originalName || 
             form?.url !== originalUrl || 
             form?.logoPreview !== originalLogo;
    });

    // If no changes were made, show confirmation dialog
    if (!hasChanges) {
      setShowConfirmDialog(true);
      return;
    }

    // Otherwise, proceed directly
    proceedWithConfirmation();
  };

  const proceedWithConfirmation = () => {
    const verifiedBrands = brands.map(brand => ({
      ...brand,
      name: brandForms[brand.id]?.name || brand.name,
      url: brandForms[brand.id]?.url || brand.url || "",
      logo: brandForms[brand.id]?.logoPreview || brand.logo
    }));
    onConfirm(verifiedBrands);
    setShowConfirmDialog(false);
  };

  const isFormValid = brands.every(brand => {
    const form = brandForms[brand.id];
    return (form?.name?.trim() || brand.name?.trim()) && (form?.url?.trim() || brand.url?.trim());
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Verify Brand Information
          </DialogTitle>
          <DialogDescription>
            Review and modify the information for each selected brand. Make sure all details are correct before adding to your ranking.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            {brands.map((brand, index) => {
              const form = brandForms[brand.id] || { name: brand.name, url: brand.url || "", logoPreview: brand.logo || "" };
              
              return (
                <Card key={brand.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Logo Section */}
                      <div className="flex-shrink-0">
                        <Label className="text-sm font-medium">Logo</Label>
                        <div className="mt-1">
                          {!form.logoPreview ? (
                            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleLogoUpload(brand.id, file);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                          ) : (
                            <div className="relative w-16 h-16 border rounded-lg bg-background overflow-hidden">
                              <img 
                                src={form.logoPreview} 
                                alt="Brand logo" 
                                className="w-full h-full object-contain p-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveLogo(brand.id)}
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Brand Details Section */}
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`name-${brand.id}`} className="text-sm font-medium">
                              Brand Name
                            </Label>
                            <Input
                              id={`name-${brand.id}`}
                              value={form.name}
                              onChange={(e) => handleInputChange(brand.id, 'name', e.target.value)}
                              placeholder="Enter brand name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`url-${brand.id}`} className="text-sm font-medium">
                              Website URL
                            </Label>
                            <div className="relative mt-1">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id={`url-${brand.id}`}
                                value={form.url}
                                onChange={(e) => handleInputChange(brand.id, 'url', e.target.value)}
                                placeholder="https://example.com"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Brand Preview */}
                        <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            {form.logoPreview && (
                              <div className="w-6 h-6 rounded border bg-background flex items-center justify-center overflow-hidden">
                                <img 
                                  src={form.logoPreview} 
                                  alt="Preview" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium">
                              {form.name || "Brand Name"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {form.url || "Website URL"}
                          </span>
                          {brand.isTracked && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Tracked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Brand Number */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span>{brands.length} brand{brands.length !== 1 ? 's' : ''} ready to add</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!isFormValid}
            >
              Add Brands to Ranking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Brand Information</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure all the brand information is correct? You haven't made any changes to the pre-filled data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back to Edit</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithConfirmation}>
              Yes, Information is Correct
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};