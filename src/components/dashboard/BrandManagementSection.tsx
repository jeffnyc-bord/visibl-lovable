
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Globe, 
  TrendingUp, 
  Calendar,
  Settings,
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
  Zap
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
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [addBrandProgress, setAddBrandProgress] = useState(0);
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  const [addBrandStep, setAddBrandStep] = useState(1);
  const [newBrandData, setNewBrandData] = useState({
    name: "",
    url: "",
    logoFile: null as File | null,
    logoPreview: "",
    reportFrequency: ""
  });
  
  // Brand limits based on tier
  const TIER_LIMITS = {
    standard: 5,
    premium: 15,
    enterprise: 50
  };
  
  const currentTier = "standard"; // This would come from user subscription data
  const maxBrands = TIER_LIMITS[currentTier];
  const currentBrandCount = trackedBrands.length; // Actual count from tracked brands
  const brandsRemaining = Math.max(0, maxBrands - currentBrandCount);
  const isAtLimit = currentBrandCount >= maxBrands;
  
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

  // Get competitors for the selected brand (exclude the selected brand itself)
  const [competitors, setCompetitors] = useState(() => 
    selectedBrand.competitors.map((competitor, index) => ({
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
     }))
  );

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

  const handleAddBrand = () => {
    if (!newBrandData.name.trim() || !newBrandData.url.trim() || !newBrandData.reportFrequency) return;
    
    // Check brand limit
    if (isAtLimit) {
      toast({
        title: "Brand Limit Reached",
        description: `You've reached the maximum of ${maxBrands} brands for the ${currentTier} tier. Upgrade to add more competitors.`,
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
            
            {isAtLimit ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive mb-1">
                      Brand limit reached
                    </p>
                    <p className="text-xs text-destructive/80 mb-2">
                      Upgrade to Premium for 15 brands or Enterprise for 50 brands.
                    </p>
                    <Button size="sm" variant="destructive" className="h-7 text-xs">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAddBrandDialog(true)}
                className="w-full h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Brand
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracked Brands - Card Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Your Watchlist</h3>
          <p className="text-sm text-muted-foreground">{currentBrandCount} brand{currentBrandCount !== 1 ? 's' : ''} tracked</p>
        </div>

        {/* Primary Brand (You) */}
        <Card className="shadow-sm border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white shadow-lg">
              You
            </Badge>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-16 h-16 bg-white border-2 border-primary/20 rounded-lg flex items-center justify-center shadow-sm">
                  {myBrand.name === "Nike" ? (
                    <img src="/lovable-uploads/d296743b-ff18-4da8-8546-d789de582706.png" alt={myBrand.name} className="w-10 h-10 object-contain" />
                  ) : myBrand.name === "Adidas" ? (
                    <img src="/lovable-uploads/443dfdf9-57da-486d-9339-83c684d1c404.png" alt={myBrand.name} className="w-10 h-10 object-contain" />
                  ) : myBrand.name === "Apple" ? (
                    <img src="/lovable-uploads/f7211f59-be5b-4e58-9bfa-3b6653217350.png" alt={myBrand.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <Building className="w-8 h-8 text-primary" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{myBrand.name}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{myBrand.url}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{myBrand.visibilityScore}%</p>
                      <p className="text-xs text-muted-foreground mt-1">AI Visibility Score</p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-foreground">{myBrand.totalMentions}</span>
                        <span className={`text-sm ml-2 ${myBrand.trend.startsWith('+') ? 'text-green-600' : myBrand.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                          {myBrand.trend}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Total Mentions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{myBrand.platformCoverage}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Platform Coverage</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  {myBrand.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{myBrand.reportFrequency}</p>
                <p className="text-xs text-muted-foreground">Updated {myBrand.lastReport}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Brands */}
        {competitors.map((competitor) => (
          <Card key={competitor.id} className={`shadow-sm border-border transition-all ${competitor.isLoading ? 'bg-blue-50/50 border-blue-200' : 'hover:shadow-md'}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-lg flex items-center justify-center border ${competitor.isLoading ? 'animate-pulse' : ''}`}>
                    {competitor.isLoading ? (
                      <Globe className="w-8 h-8 text-blue-600 animate-spin" />
                    ) : (
                      <Target className="w-8 h-8 text-secondary-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg text-foreground">{competitor.name}</h3>
                      {!competitor.isLoading && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                      {competitor.isLoading && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{competitor.url}</p>
                    </div>
                    
                    {competitor.isLoading ? (
                      <div className="mt-3">
                        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${competitor.loadingProgress || 0}%` }}
                          />
                        </div>
                        <p className="text-sm text-blue-600 font-medium">
                          {(competitor.loadingProgress || 0) < 25 ? "Analyzing website..." :
                           (competitor.loadingProgress || 0) < 50 ? "Discovering content..." :
                           (competitor.loadingProgress || 0) < 75 ? "Setting up monitoring..." :
                           "Almost ready..."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{competitor.visibilityScore}%</p>
                          <p className="text-xs text-muted-foreground mt-1">AI Visibility Score</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-foreground">{competitor.totalMentions}</span>
                            <span className={`text-sm ml-2 ${competitor.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {competitor.trend}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Total Mentions</p>
                        </div>
                        <div>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(competitor.status)}`}
                          >
                            {competitor.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{competitor.reportFrequency}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  {!competitor.isLoading && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleToggleMonitoring(competitor.id)}>
                          {competitor.status === "Active" ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause Monitoring
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Activate Monitoring
                            </>
                          )}
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove from Watchlist
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Competitor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {competitor.name} from your watchlist? This action cannot be undone.
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
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add New Brand Dialog */}
      <Dialog open={showAddBrandDialog} onOpenChange={(open) => {
        setShowAddBrandDialog(open);
        if (!open) {
          setAddBrandStep(1);
          setNewBrandData({ name: "", url: "", logoFile: null, logoPreview: "", reportFrequency: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50/50 px-8 py-8 border-b overflow-hidden">
            <div className="relative z-10">
              {/* Title at top */}
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 text-center">
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
                  <div className="w-16 h-16 rounded-full border border-gray-200/60 bg-white shadow-sm flex items-center justify-center p-2">
                    <img 
                      src={boardLabsIcon} 
                      alt="Board Labs" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Connecting Line */}
                  <div className="h-px w-16 bg-gradient-to-r from-gray-300/40 via-gray-400/60 to-gray-300/40 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-400/60 rotate-45 translate-x-1" />
                  </div>
                  
                  {/* Plus Icon */}
                  <div className="w-16 h-16 rounded-full border border-gray-200/60 bg-white shadow-sm flex items-center justify-center">
                    <Plus className="h-7 w-7 text-gray-700 stroke-[1.5]" />
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
                            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full group-hover:scale-110 transition-transform duration-300">
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
          <div className="px-8 py-5 border-t bg-gradient-to-r from-muted/30 to-muted/10">
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
                  className="h-10 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:shadow-none"
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
                  className="h-10 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add & Start Monitoring
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
     </div>
   </>
  );
};
