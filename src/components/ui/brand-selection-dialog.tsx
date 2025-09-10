import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Building2, Database, CheckCircle2, Search } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  isTracked?: boolean;
  score?: number;
}

interface BrandSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedBrands: Brand[]) => void;
}

export const BrandSelectionDialog = ({ open, onOpenChange, onConfirm }: BrandSelectionDialogProps) => {
  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<string>>(new Set());
  const [showAllDatabaseBrands, setShowAllDatabaseBrands] = useState(false);

  // Mock tracked brands (would come from actual data)
  const trackedBrands: Brand[] = [
    { id: "1", name: "Apple", logo: "/lovable-uploads/84b583a1-fe3d-4393-ae0a-df3ec0dbd01d.png", url: "https://apple.com", isTracked: true, score: 95 },
    { id: "2", name: "Microsoft", logo: "/lovable-uploads/20ab85cf-422a-46f0-a62a-26fe3db14680.png", url: "https://microsoft.com", isTracked: true, score: 89 },
    { id: "3", name: "Google", logo: "/lovable-uploads/921c76c7-1c98-41d6-a192-8308c4b7fd49.png", url: "https://google.com", isTracked: true, score: 92 },
  ];

  // Mock database brands (would come from API)
  const allDatabaseBrands: Brand[] = [
    { id: "4", name: "Nike", url: "https://nike.com", score: 87 },
    { id: "5", name: "Adidas", url: "https://adidas.com", score: 85 },
    { id: "6", name: "Under Armour", url: "https://underarmour.com", score: 82 },
    { id: "7", name: "Puma", url: "https://puma.com", score: 78 },
    { id: "8", name: "New Balance", url: "https://newbalance.com", score: 76 },
    { id: "9", name: "Reebok", url: "https://reebok.com", score: 74 },
    { id: "10", name: "Converse", url: "https://converse.com", score: 72 },
    { id: "11", name: "Vans", url: "https://vans.com", score: 70 },
    // Additional brands shown when "Find More" is clicked
    { id: "12", name: "ASICS", url: "https://asics.com", score: 68 },
    { id: "13", name: "Brooks", url: "https://brooksrunning.com", score: 66 },
    { id: "14", name: "Saucony", url: "https://saucony.com", score: 64 },
    { id: "15", name: "Hoka", url: "https://hoka.com", score: 72 },
    { id: "16", name: "On Running", url: "https://on-running.com", score: 69 },
    { id: "17", name: "Salomon", url: "https://salomon.com", score: 67 },
    { id: "18", name: "Merrell", url: "https://merrell.com", score: 63 },
    { id: "19", name: "Allbirds", url: "https://allbirds.com", score: 65 },
  ];

  const databaseBrands = showAllDatabaseBrands ? allDatabaseBrands : allDatabaseBrands.slice(0, 8);

  const handleBrandToggle = (brandId: string) => {
    const newSelected = new Set(selectedBrandIds);
    if (newSelected.has(brandId)) {
      newSelected.delete(brandId);
    } else {
      newSelected.add(brandId);
    }
    setSelectedBrandIds(newSelected);
  };

  const handleConfirm = () => {
    const allBrands = [...trackedBrands, ...allDatabaseBrands];
    const selectedBrands = allBrands.filter(brand => selectedBrandIds.has(brand.id));
    onConfirm(selectedBrands);
    onOpenChange(false);
    setSelectedBrandIds(new Set());
    setShowAllDatabaseBrands(false);
  };

  const selectedCount = selectedBrandIds.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Brands to Add</DialogTitle>
          <DialogDescription>
            Choose brands from your tracked list and our database to populate your industry ranking.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {/* Tracked Brands Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Your Tracked Brands</h3>
                <Badge variant="secondary" className="text-xs">
                  {trackedBrands.length} brands
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trackedBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                      selectedBrandIds.has(brand.id) 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:bg-muted/30'
                    }`}
                    onClick={() => handleBrandToggle(brand.id)}
                  >
                    <Checkbox
                      checked={selectedBrandIds.has(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {brand.logo && (
                        <div className="w-8 h-8 rounded border bg-background p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img 
                            src={brand.logo} 
                            alt={`${brand.name} logo`} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{brand.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{brand.url}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Score: {brand.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Database Brands Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Available Brands</h3>
                  <Badge variant="secondary" className="text-xs">
                    {showAllDatabaseBrands ? allDatabaseBrands.length : `${databaseBrands.length} of ${allDatabaseBrands.length}`} brands
                  </Badge>
                </div>
                {!showAllDatabaseBrands && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllDatabaseBrands(true)}
                    className="text-xs h-7"
                  >
                    <Search className="w-3 h-3 mr-1" />
                    Find More Industry Brands
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {databaseBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                      selectedBrandIds.has(brand.id) 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:bg-muted/30'
                    }`}
                    onClick={() => handleBrandToggle(brand.id)}
                  >
                    <Checkbox
                      checked={selectedBrandIds.has(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                        {brand.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{brand.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{brand.url}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Score: {brand.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedCount} brand{selectedCount !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={selectedCount === 0}
            >
              Continue with {selectedCount} Brand{selectedCount !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};