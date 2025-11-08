
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Globe, 
  TrendingUp, 
  Calendar,
  MoreVertical,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Target,
  Building,
  Pause,
  Play,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  X,
  Zap,
  Repeat,
  Edit,
  Clock
} from "lucide-react";
import boardLabsIcon from "@/assets/board-labs-icon-hex.png";

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

interface BrandManagementSectionProps {
  selectedBrand: BrandData;
  trackedBrands: BrandData[];
  loadingDuration?: number;
}

export const BrandManagementSection = ({ selectedBrand, trackedBrands, loadingDuration = 6 }: BrandManagementSectionProps) => {
  const { toast } = useToast();
  const { tier, limits, brandsTracked, canAddBrand, swapsUsed, swapsRemaining, canSwap, refreshSubscription } = useSubscription();
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [addBrandProgress, setAddBrandProgress] = useState(0);
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [addBrandStep, setAddBrandStep] = useState(1);
  const [isReplacingPrimaryBrand, setIsReplacingPrimaryBrand] = useState(false);
  const [showEditNameDialog, setShowEditNameDialog] = useState(false);
  const [showScanFrequencyDialog, setShowScanFrequencyDialog] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [newBrandData, setNewBrandData] = useState({
    name: "",
    url: "",
    logoFile: null as File | null,
    logoPreview: "",
    reportFrequency: ""
  });
  
  const maxBrands = limits.maxBrands;
  const currentTier = tier;
  
  // Use selected brand as the primary brand
  const myBrand = {
    id: 1,
    name: selectedBrand.name,
    url: selectedBrand.url,
    type: "primary",
    status: "Active",
    visibilityScore: selectedBrand.visibilityScore,
    trend: selectedBrand.mentionTrend === "up" ? "+3.2%" : selectedBrand.mentionTrend === "down" ? "-1.5%" : "0%",
    reportFrequency: "Daily",
    lastReport: "2 hours ago",
    totalMentions: `${(selectedBrand.totalMentions / 1000).toFixed(1)}K`,
    platformCoverage: selectedBrand.platformCoverage
  };

  // Get competitors - combine selected brand's competitors with other tracked brands
  const [competitors, setCompetitors] = useState(() => {
    // First, add the explicit competitors from the selected brand
    const explicitCompetitors = selectedBrand.competitors.map((competitor, index) => ({
      id: index + 2,
      name: competitor.name,
      url: `${competitor.name.toLowerCase().replace(/\s+/g, '')}.com`,
      status: "Active" as "Active" | "Paused" | "Loading",
      visibilityScore: competitor.visibilityScore,
      trend: competitor.trend === "up" ? "+1.8%" : competitor.trend === "down" ? "-0.5%" : "0%",
      reportFrequency: "Weekly" as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
      lastReport: "3 days ago",
      totalMentions: `${(competitor.mentions / 1000).toFixed(1)}K`,
      isLoading: false,
      loadingProgress: 0
    }));

    // Get names of explicit competitors to avoid duplicates
    const existingNames = new Set(explicitCompetitors.map(c => c.name.toLowerCase()));

    // Then add other tracked brands (excluding the currently selected brand and duplicates)
    const otherBrands = trackedBrands
      .filter(brand => 
        brand.id !== selectedBrand.id && 
        !existingNames.has(brand.name.toLowerCase())
      )
      .map((brand, index) => ({
        id: explicitCompetitors.length + index + 2,
        name: brand.name,
        url: brand.url,
        status: "Active" as "Active" | "Paused" | "Loading",
        visibilityScore: brand.visibilityScore,
        trend: brand.mentionTrend === "up" ? "+2.1%" : brand.mentionTrend === "down" ? "-1.2%" : "0%",
        reportFrequency: "Weekly" as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
        lastReport: "2 days ago",
        totalMentions: `${(brand.totalMentions / 1000).toFixed(1)}K`,
        isLoading: false,
        loadingProgress: 0
      }));

    return [...explicitCompetitors, ...otherBrands];
  });

  const getTypeColor = (type: string) => {
    return type === "deep" 
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Paused": return "bg-gray-100 text-gray-700 border-gray-200";
      case "Loading": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const competitorCount = competitors.length;
  // Total brands = actual brands from database
  const totalBrandsTracked = brandsTracked;
  const currentBrandCount = totalBrandsTracked;
  const brandsRemaining = Math.max(0, maxBrands - totalBrandsTracked);
  const isAtLimit = !canAddBrand;

  const handleToggleMonitoring = (competitorId: number) => {
    setCompetitors(prev => prev.map(competitor => 
      competitor.id === competitorId && competitor.status !== "Loading"
        ? { ...competitor, status: competitor.status === "Active" ? "Paused" : "Active" }
        : competitor
    ));
    
    const competitor = competitors.find(c => c.id === competitorId);
    const newStatus = competitor?.status === "Active" ? "Paused" : "Active";
    
    toast({
      title: `Monitoring ${newStatus}`,
      description: `${competitor?.name} monitoring has been ${newStatus.toLowerCase()}.`,
    });
  };

  const handleRemoveCompetitor = (competitorId: number) => {
    const competitor = competitors.find(c => c.id === competitorId);
    setCompetitors(prev => prev.filter(c => c.id !== competitorId));
    
    toast({
      title: "Competitor Removed",
      description: `${competitor?.name} has been removed from your watchlist.`,
    });
  };

  const handleEditName = (competitorId: number) => {
    // Handle primary brand (id: 1)
    if (competitorId === 1) {
      setSelectedCompetitor(1);
      setEditedName(myBrand.name);
      setShowEditNameDialog(true);
      return;
    }
    
    const competitor = competitors.find(c => c.id === competitorId);
    if (competitor) {
      setSelectedCompetitor(competitorId);
      setEditedName(competitor.name);
      setShowEditNameDialog(true);
    }
  };

  const handleSaveEditedName = () => {
    if (selectedCompetitor !== null && editedName.trim()) {
      // For primary brand, just show a toast (in a real app, you'd update the database)
      if (selectedCompetitor === 1) {
        toast({
          title: "Name Updated",
          description: `Primary brand name updated to ${editedName.trim()}`,
        });
        setShowEditNameDialog(false);
        setSelectedCompetitor(null);
        setEditedName("");
        return;
      }
      
      setCompetitors(prev =>
        prev.map(competitor =>
          competitor.id === selectedCompetitor
            ? { ...competitor, name: editedName.trim() }
            : competitor
        )
      );
      setShowEditNameDialog(false);
      setSelectedCompetitor(null);
      setEditedName("");
    }
  };

  const handleChangeScanFrequency = (competitorId: number) => {
    // Handle primary brand (id: 1)
    if (competitorId === 1) {
      setSelectedCompetitor(1);
      setSelectedFrequency(myBrand.reportFrequency.toLowerCase().replace('-', ''));
      setShowScanFrequencyDialog(true);
      return;
    }
    
    const competitor = competitors.find(c => c.id === competitorId);
    if (competitor) {
      setSelectedCompetitor(competitorId);
      setSelectedFrequency(competitor.reportFrequency.toLowerCase().replace('-', ''));
      setShowScanFrequencyDialog(true);
    }
  };

  const handleSaveScanFrequency = () => {
    if (selectedCompetitor !== null && selectedFrequency) {
      const formattedFrequency = selectedFrequency === "biweekly" 
        ? "Bi-weekly" 
        : selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1) as "Daily" | "Weekly" | "Bi-weekly" | "Monthly";
      
      // Calculate next scan date
      const nextScanDate = calculateNextScan(selectedFrequency);
      
      // For primary brand, just show a toast (in a real app, you'd update the database)
      if (selectedCompetitor === 1) {
        toast({
          title: "Frequency Updated",
          description: `Scan frequency updated to ${formattedFrequency}. Next scan scheduled for ${nextScanDate}.`,
        });
        setShowScanFrequencyDialog(false);
        setSelectedCompetitor(null);
        setSelectedFrequency("");
        return;
      }
      
      setCompetitors(prev =>
        prev.map(competitor =>
          competitor.id === selectedCompetitor
            ? { ...competitor, reportFrequency: formattedFrequency }
            : competitor
        )
      );
      
      toast({
        title: "Frequency Updated",
        description: `Next scan scheduled for ${nextScanDate}.`,
      });
      
      setShowScanFrequencyDialog(false);
      setSelectedCompetitor(null);
      setSelectedFrequency("");
    }
  };

  const calculateNextScan = (frequency: string): string => {
    const now = new Date();
    let nextScan = new Date(now);
    
    switch(frequency) {
      case 'daily':
        nextScan.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        nextScan.setDate(now.getDate() + 7);
        break;
      case 'twiceweekly':
        nextScan.setDate(now.getDate() + 3);
        break;
      case 'biweekly':
        nextScan.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        nextScan.setMonth(now.getMonth() + 1);
        break;
      default:
        nextScan.setDate(now.getDate() + 7);
    }
    
    return nextScan.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleRemoveAndReplace = (competitorId: number) => {
    const competitor = competitors.find(c => c.id === competitorId);
    setCompetitors(prev => prev.filter(c => c.id !== competitorId));
    
    toast({
      title: "Competitor Removed",
      description: `${competitor?.name} has been removed. Add a new brand to replace it.`,
    });
    
    // Open add brand dialog
    setShowAddBrandDialog(true);
  };

  const handleAddBrandClick = () => {
    // Check if user can add more brands
    if (!canAddBrand) {
      setShowUpgradeDialog(true);
      return;
    }
    setShowAddBrandDialog(true);
  };

  const handleAddBrand = async () => {
    if (!newBrandData.name.trim() || !newBrandData.url.trim() || !newBrandData.reportFrequency) return;
    
    // Double check brand limit
    if (!canAddBrand) {
      toast({
        title: "Brand Limit Reached",
        description: `You've reached the maximum of ${maxBrands} brand${maxBrands !== 1 ? 's' : ''} for the ${currentTier} tier. Upgrade to add more brands.`,
        variant: "destructive",
      });
      return;
    }
    
    // Create new competitor immediately with loading state
    const newCompetitor = {
      id: Math.max(...competitors.map(c => c.id), 1) + 1,
      name: newBrandData.name.trim(),
      url: newBrandData.url,
      status: "Loading" as "Active" | "Paused" | "Loading",
      visibilityScore: 0,
      trend: "0%",
      reportFrequency: newBrandData.reportFrequency === "biweekly" ? "Bi-weekly" : newBrandData.reportFrequency.charAt(0).toUpperCase() + newBrandData.reportFrequency.slice(1) as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
      lastReport: "Setting up...",
      totalMentions: "0K",
      isLoading: true,
      loadingProgress: 0
    };
    
    // Add to competitors list immediately
    setCompetitors(prev => [...prev, newCompetitor]);
    
    // If replacing primary brand, update swap counter
    if (isReplacingPrimaryBrand) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('profiles')
          .update({ swaps_used: swapsUsed + 1 })
          .eq('id', user?.id);
        
        if (error) throw error;
        
        await refreshSubscription();
        
        toast({
          title: "Primary Brand Replaced",
          description: `${swapsRemaining - 1} swap${swapsRemaining - 1 !== 1 ? 's' : ''} remaining.`,
        });
      } catch (error) {
        console.error('Error updating swap count:', error);
        toast({
          title: "Warning",
          description: "Brand added but failed to track swap count.",
          variant: "destructive",
        });
      }
      setIsReplacingPrimaryBrand(false);
    }
    
    // Close dialog and reset
    setShowAddBrandDialog(false);
    setAddBrandStep(1);
    setNewBrandData({ name: "", url: "", logoFile: null, logoPreview: "", reportFrequency: "" });
    
    // Show success toast
    toast({
      title: "Brand Added to Watchlist",
      description: `${newCompetitor.name} is being set up. You can continue exploring while we process the data.`,
    });
    
    // Simulate progress updates for the specific competitor
    const progressInterval = setInterval(() => {
      setCompetitors(prev => prev.map(comp => 
        comp.id === newCompetitor.id 
          ? { ...comp, loadingProgress: Math.min((comp.loadingProgress || 0) + Math.random() * 15, 100) }
          : comp
      ));
    }, 800);
    
    // Complete the loading after specified duration
    setTimeout(() => {
      clearInterval(progressInterval);
      setCompetitors(prev => prev.map(comp => 
        comp.id === newCompetitor.id 
          ? {
              ...comp,
              status: "Active" as "Active" | "Paused",
              visibilityScore: Math.floor(Math.random() * 40) + 60,
              trend: Math.random() > 0.5 ? "+1.2%" : "-0.8%",
              lastReport: "Just completed",
              totalMentions: `${(Math.random() * 5 + 1).toFixed(1)}K`,
              isLoading: false,
              loadingProgress: 100
            }
          : comp
      ));
      
      toast({
        title: "Setup Complete",
        description: `${newCompetitor.name} analysis is ready and being monitored.`,
      });
    }, loadingDuration * 1000);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewBrandData(prev => ({ ...prev, logoFile: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBrandData(prev => ({ ...prev, logoPreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>

    <div className="space-y-6">
      {/* Brand Limit Tracking */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground flex items-center justify-between">
            <span>Brand Tracking Overview</span>
            <div className="text-sm font-normal text-muted-foreground">
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Tracked Brands</span>
              <span className="text-muted-foreground">
                {currentBrandCount} / {maxBrands} brands
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isAtLimit ? 'bg-destructive' : currentBrandCount >= maxBrands * 0.8 ? 'bg-orange-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min((currentBrandCount / maxBrands) * 100, 100)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {isAtLimit ? (
                    <span className="text-destructive font-medium">Limit reached</span>
                  ) : (
                    <span>
                      {brandsRemaining} brand{brandsRemaining !== 1 ? 's' : ''} remaining
                    </span>
                  )}
                </span>
                {!isAtLimit && currentBrandCount >= maxBrands * 0.8 && (
                  <span className="text-orange-600 font-medium">
                    Approaching limit
                  </span>
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleAddBrandClick}
              className="w-full h-10"
              variant={isAtLimit ? "outline" : "default"}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAtLimit ? "Upgrade to Add More" : "Add New Brand"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Brands - Grid Card Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Your Watchlist</h3>
          <p className="text-sm text-muted-foreground">{totalBrandsTracked} brand{totalBrandsTracked !== 1 ? 's' : ''} tracked</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {/* Primary Brand (You) */}
          <Card className="relative overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-b from-white to-gray-50/30 group">
            {/* "You" Badge with hover transition to settings */}
            <div className="absolute top-4 right-4 z-10">
              <div className="relative w-auto h-auto">
                {/* "You" Badge - visible by default, hidden on hover */}
                <Badge className="bg-primary text-white text-xs px-2 py-1 shadow-sm border-none group-hover:opacity-0 transition-opacity duration-200">
                  You
                </Badge>
                
                {/* Settings dropdown - hidden by default, visible on hover */}
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-50 bg-background">
                      <DropdownMenuItem onClick={() => handleEditName(1)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeScanFrequency(1)}>
                        <Clock className="w-4 h-4 mr-2" />
                        Change Frequency
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Repeat className="w-4 h-4 mr-2" />
                            Remove & Replace
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove & Replace Primary Brand</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                              <div className="text-destructive font-medium">
                                ⚠️ Warning: Swapping may delete previous scan data
                              </div>
                              <div>
                                This will remove {myBrand.name} as your primary brand and allow you to add a new brand to replace it.
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant={canSwap ? "default" : "destructive"} className="text-xs">
                                  {swapsRemaining} swap{swapsRemaining !== 1 ? 's' : ''} remaining
                                </Badge>
                                <span className="text-muted-foreground">({swapsUsed}/3 used)</span>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              disabled={!canSwap}
                              onClick={() => {
                                if (!canSwap) {
                                  toast({
                                    title: "Swap Limit Reached",
                                    description: "You've used all 3 brand swaps.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                
                                setIsReplacingPrimaryBrand(true);
                                setShowAddBrandDialog(true);
                              }}
                            >
                              {canSwap ? 'Remove & Replace' : 'No Swaps Left'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200/60 shadow-sm flex items-center justify-center p-2.5">
                  {myBrand.name === "Nike" ? (
                    <img src="/lovable-uploads/d296743b-ff18-4da8-8546-d789de582706.png" alt={myBrand.name} className="w-full h-full object-contain" />
                  ) : myBrand.name === "Adidas" ? (
                    <img src="/lovable-uploads/443dfdf9-57da-486d-9339-83c684d1c404.png" alt={myBrand.name} className="w-full h-full object-contain" />
                  ) : myBrand.name === "Apple" ? (
                    <img src="/lovable-uploads/f7211f59-be5b-4e58-9bfa-3b6653217350.png" alt={myBrand.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building className="w-10 h-10 text-primary" />
                  )}
                </div>
              </div>

              {/* Brand Name */}
              <div className="text-center mb-3">
                <h3 className="font-semibold text-base text-foreground mb-0.5">{myBrand.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{myBrand.url}</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">AI Visibility</span>
                  <span className="text-base font-semibold text-foreground">{myBrand.visibilityScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Mentions</span>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-foreground">{myBrand.totalMentions}</span>
                    <span className={`text-xs ${myBrand.trend.startsWith('+') ? 'text-green-600' : myBrand.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                      {myBrand.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 text-xs">
                  {myBrand.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{myBrand.reportFrequency}</span>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Brands */}
          {competitors.map((competitor) => (
            <Card 
              key={competitor.id} 
              className={`relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200 ${
                competitor.isLoading 
                  ? 'border-blue-200 bg-gradient-to-b from-blue-50/50 to-white' 
                  : 'border-gray-200/60 bg-gradient-to-b from-white to-gray-50/30'
              }`}
            >
              {/* Actions Menu */}
              {!competitor.isLoading && (
                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-50 bg-background">
                      <DropdownMenuItem onClick={() => handleEditName(competitor.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeScanFrequency(competitor.id)}>
                        <Clock className="w-4 h-4 mr-2" />
                        Change Frequency
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleMonitoring(competitor.id)}>
                        {competitor.status === "Active" ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Repeat className="w-4 h-4 mr-2" />
                            Remove & Replace
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove & Replace Competitor</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {competitor.name} from your watchlist and allow you to add a new brand to replace it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveAndReplace(competitor.id)}>
                              Remove & Replace
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Competitor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {competitor.name} from your watchlist?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveCompetitor(competitor.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
              <CardContent className="p-5">
                {competitor.isLoading ? (
                  <>
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-xl bg-blue-100 border border-blue-200 shadow-sm flex items-center justify-center">
                        <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h3 className="font-semibold text-base text-foreground mb-0.5">{competitor.name}</h3>
                      <p className="text-xs text-blue-600 font-medium">{competitor.lastReport}</p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-3" />

                    <div className="space-y-2.5">
                      <div className="text-xs text-center text-muted-foreground mb-2">
                        Analyzing AI visibility...
                      </div>
                      <Progress value={competitor.loadingProgress || 0} className="h-2" />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(competitor.loadingProgress || 0)}%
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-xl bg-white border border-gray-200/60 shadow-sm flex items-center justify-center p-2.5">
                        {competitor.name === "Adidas" ? (
                          <img src="/lovable-uploads/443dfdf9-57da-486d-9339-83c684d1c404.png" alt={competitor.name} className="w-full h-full object-contain" />
                        ) : competitor.name === "Apple" ? (
                          <img src="/lovable-uploads/f7211f59-be5b-4e58-9bfa-3b6653217350.png" alt={competitor.name} className="w-full h-full object-contain" />
                        ) : competitor.name === "Nike" ? (
                          <img src="/lovable-uploads/d296743b-ff18-4da8-8546-d789de582706.png" alt={competitor.name} className="w-full h-full object-contain" />
                        ) : competitor.name === "Under Armour" ? (
                          <img src="/lovable-uploads/under-armour-logo.jpg" alt={competitor.name} className="w-full h-full object-contain" />
                        ) : competitor.name === "Puma" ? (
                          <img src="/lovable-uploads/puma-logo.jpg" alt={competitor.name} className="w-full h-full object-contain" />
                        ) : (
                          <Building className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <h3 className="font-semibold text-base text-foreground mb-0.5">{competitor.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{competitor.url}</p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">AI Visibility</span>
                        <span className="text-base font-semibold text-foreground">{competitor.visibilityScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Mentions</span>
                        <div className="flex items-center gap-1">
                          <span className="text-base font-semibold text-foreground">{competitor.totalMentions}</span>
                          <span className={`text-xs ${competitor.trend.startsWith('+') ? 'text-green-600' : competitor.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                            {competitor.trend}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={competitor.status === "Active" ? "bg-green-50 text-green-700 border-green-100 text-xs" : "bg-gray-50 text-gray-700 border-gray-100 text-xs"}
                      >
                        {competitor.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{competitor.reportFrequency}</span>
                    </div>
                  </>
                )}
              </CardContent>
              
            </Card>
          ))}
        </div>
      </div>
      
      {/* Add New Brand Dialog */}
      <Dialog open={showAddBrandDialog} onOpenChange={(open) => {
        setShowAddBrandDialog(open);
        if (!open) {
          setAddBrandStep(1);
          setNewBrandData({ name: "", url: "", logoFile: null, logoPreview: "", reportFrequency: "" });
          setIsReplacingPrimaryBrand(false);
        }
      }}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8 border-b">
            <div className="relative z-10">
              {/* Title at top */}
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-semibold text-center">
                  Add New Brand to Your Platform
                </DialogTitle>
              </DialogHeader>

              {/* Description */}
              <DialogDescription className="text-base text-muted-foreground text-center mb-6">
                Track a new brand to monitor visibility across major AI platform
              </DialogDescription>

              {/* Board Labs Logo + Plus Icon */}
              <div className="flex justify-center items-center mb-6">
                <div className="flex items-center gap-6">
                  {/* Board Labs Logo */}
                  <div className="w-16 h-16 rounded-full border bg-white shadow-sm flex items-center justify-center p-2">
                    <img 
                      src={boardLabsIcon} 
                      alt="Board Labs" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Connecting Line */}
                  <div className="h-px w-16 bg-border relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-border rotate-45 translate-x-1" />
                  </div>
                  
                  {/* Plus Icon */}
                  <div className="w-16 h-16 rounded-full border bg-white shadow-sm flex items-center justify-center">
                    <Plus className="h-7 w-7 text-foreground stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* Step indicator */}
              <div className="mt-6 flex items-center justify-center gap-6">
                {[
                  { num: 1, label: "Info" },
                  { num: 2, label: "Settings" },
                  { num: 3, label: "Logo" }
                ].map((step, idx) => (
                  <div key={step.num} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step.num <= addBrandStep 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step.num}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${
                        step.num <= addBrandStep ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div className={`w-12 h-0.5 mx-2 mb-6 transition-colors ${
                        step.num < addBrandStep ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content area with transitions */}
          <div className="p-8">
            <div className="min-h-[240px]">
              {addBrandStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="brand-name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Building className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Brand Name
                    </Label>
                    <Input
                      id="brand-name"
                      value={newBrandData.name}
                      onChange={(e) => setNewBrandData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                      placeholder="e.g., Nike, Apple, Tesla"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the official brand name you want to track
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand-url" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Website URL
                    </Label>
                    <Input
                      id="brand-url"
                      value={newBrandData.url}
                      onChange={(e) => setNewBrandData(prev => ({ ...prev, url: e.target.value }))}
                      className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                      placeholder="https://yourbrand.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The main website for brand verification
                    </p>
                  </div>
                </div>
              )}

              {addBrandStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <Label htmlFor="report-frequency" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Monitoring Frequency
                    </Label>
                    <Select
                      value={newBrandData.reportFrequency || ""}
                      onValueChange={(value) => setNewBrandData(prev => ({ ...prev, reportFrequency: value }))}
                    >
                      <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-base">
                        <SelectValue placeholder="Choose how often to check brand visibility" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="daily" disabled className="text-gray-400 text-base">
                          <div className="flex items-center justify-between w-full">
                            <span>Once daily</span>
                            <Badge variant="secondary" className="ml-2 text-xs">Enterprise</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="weekly" className="text-base">Once a week</SelectItem>
                        <SelectItem value="twiceweekly" className="text-base">Twice a week</SelectItem>
                        <SelectItem value="biweekly" className="text-base">Biweekly</SelectItem>
                        <SelectItem value="monthly" className="text-base">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How often should we track this brand's AI visibility?
                    </p>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground">Smart Monitoring</h4>
                        <p className="text-xs text-muted-foreground">
                          Our AI-powered system continuously tracks your brand across major AI platforms and provides actionable insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {addBrandStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <Label htmlFor="brand-logo" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      Brand Logo
                    </Label>
                    
                    {!newBrandData.logoPreview ? (
                      <div className="relative group">
                        <Input
                          id="brand-logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300 hover:bg-primary/5 group-hover:scale-[1.01] transform cursor-pointer">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                              <Upload className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                              <p className="text-base font-semibold text-foreground mb-1">Drop your logo here or click to browse</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, or SVG • Max 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-primary/20 rounded-xl p-5 bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl border-2 border-primary/20 bg-white p-2 flex items-center justify-center overflow-hidden shadow-sm">
                              <img 
                                src={newBrandData.logoPreview} 
                                alt="Logo preview" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Logo uploaded successfully</p>
                              <p className="text-xs text-muted-foreground">Your brand is ready to track</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewBrandData(prev => ({ ...prev, logoFile: null, logoPreview: "" }))}
                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Optional • Add your logo for better visual tracking
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with gradient buttons */}
          <div className="px-8 py-5 border-t bg-muted/30">
            <div className="flex items-center justify-between gap-3">
              {addBrandStep > 1 ? (
                <Button 
                  variant="outline" 
                  onClick={() => setAddBrandStep(prev => prev - 1)}
                  className="h-10 px-5 hover:bg-muted transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowAddBrandDialog(false);
                    setAddBrandStep(1);
                    setNewBrandData({ name: "", url: "", logoFile: null, logoPreview: "", reportFrequency: "" });
                  }}
                  className="h-10 px-5 hover:bg-muted transition-all duration-200"
                >
                  Cancel
                </Button>
              )}

              {addBrandStep < 3 ? (
                <Button 
                  onClick={() => setAddBrandStep(prev => prev + 1)}
                  disabled={
                    (addBrandStep === 1 && (!newBrandData.name.trim() || !newBrandData.url.trim())) ||
                    (addBrandStep === 2 && !newBrandData.reportFrequency)
                  }
                  className="h-10 px-6"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    handleAddBrand();
                    setAddBrandStep(1);
                  }}
                  className="h-10 px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add & Start Monitoring
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-lg">
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <img 
                src={boardLabsIcon} 
                alt="Bord Labs" 
                className="w-16 h-16"
              />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Upgrade to Track More Brands
              </h2>
              <p className="text-sm text-muted-foreground">
                You've reached your brand limit on the {currentTier} plan. Upgrade to add more brands to your watchlist.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-1 gap-3">
                {currentTier === 'free' && (
                  <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Pro Plan</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Popular</Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-primary" />
                        <span>Track up to 5 brands</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        <span>Daily tracking updates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>Advanced analytics</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
                
                <div className="border border-border rounded-lg p-4 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">Enterprise</h3>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-primary" />
                      <span>Unlimited brands</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-primary" />
                      <span>White-label reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span>Custom integrations</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)} size="sm">
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Name Dialog */}
      <Dialog open={showEditNameDialog} onOpenChange={setShowEditNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand Name</DialogTitle>
            <DialogDescription>
              Update the display name for this brand in your watchlist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedName}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Frequency Dialog */}
      <Dialog open={showScanFrequencyDialog} onOpenChange={setShowScanFrequencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Frequency</DialogTitle>
            <DialogDescription>
              Update how often this brand is scanned.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scan-frequency">Scan Frequency</Label>
              <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                <SelectTrigger id="scan-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (Enterprise only)</SelectItem>
                  <SelectItem value="weekly">Once a week</SelectItem>
                  <SelectItem value="twiceweekly">Twice a week</SelectItem>
                  <SelectItem value="biweekly">Biweekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedFrequency && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  Next scan will occur on <span className="font-semibold text-foreground">{calculateNextScan(selectedFrequency)}</span>
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowScanFrequencyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScanFrequency}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
     </div>
   </>
  );
};
