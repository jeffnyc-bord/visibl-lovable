
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Trash2
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

interface BrandManagementSectionProps {
  selectedBrand: BrandData;
  trackedBrands: BrandData[];
  loadingDuration?: number;
}

export const BrandManagementSection = ({ selectedBrand, trackedBrands, loadingDuration = 6 }: BrandManagementSectionProps) => {
  const { toast } = useToast();
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [addBrandProgress, setAddBrandProgress] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandType, setBrandType] = useState("");
  const [reportFrequency, setReportFrequency] = useState("");
  const [selectedCompetitorFromDropdown, setSelectedCompetitorFromDropdown] = useState("");
  
  // Predefined list of popular competitors
  const popularCompetitors = [
    { name: "Apple", url: "apple.com" },
    { name: "Google", url: "google.com" },
    { name: "Microsoft", url: "microsoft.com" },
    { name: "Amazon", url: "amazon.com" },
    { name: "Meta", url: "meta.com" },
    { name: "Tesla", url: "tesla.com" },
    { name: "OpenAI", url: "openai.com" },
    { name: "Anthropic", url: "anthropic.com" },
    { name: "Netflix", url: "netflix.com" },
    { name: "Spotify", url: "spotify.com" }
  ];
  
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
      status: "Active" as "Active" | "Paused",
      visibilityScore: competitor.visibilityScore,
      trend: competitor.trend === "up" ? "+1.8%" : competitor.trend === "down" ? "-0.5%" : "0%",
      reportFrequency: "Weekly" as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
      lastReport: "3 days ago",
      totalMentions: `${(competitor.mentions / 1000).toFixed(1)}K`
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
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const competitorCount = competitors.length;

  const handleToggleMonitoring = (competitorId: number) => {
    setCompetitors(prev => prev.map(competitor => 
      competitor.id === competitorId 
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

  const handleAddCompetitorFromDropdown = (competitorName: string) => {
    const competitor = popularCompetitors.find(c => c.name === competitorName);
    if (!competitor) return;
    
    setIsAddingBrand(true);
    setAddBrandProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAddBrandProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 500);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setAddBrandProgress(100);
      setTimeout(() => {
        // Create new competitor from dropdown selection
        const newCompetitor = {
          id: Math.max(...competitors.map(c => c.id), 1) + 1,
          name: competitor.name,
          url: competitor.url,
          status: "Active" as "Active" | "Paused",
          visibilityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          trend: Math.random() > 0.5 ? "+1.2%" : "-0.8%",
          reportFrequency: "Weekly" as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
          lastReport: "Just added",
          totalMentions: `${(Math.random() * 5 + 1).toFixed(1)}K`
        };
        
        // Add to competitors list
        setCompetitors(prev => [...prev, newCompetitor]);
        
        setIsAddingBrand(false);
        setAddBrandProgress(0);
        setSelectedCompetitorFromDropdown("");
        toast({
          title: "Competitor Added Successfully",
          description: `${newCompetitor.name} has been added to your watchlist.`,
        });
      }, 1000);
    }, loadingDuration * 1000);
  };

  const handleAddBrand = () => {
    if (!websiteUrl.trim() || !reportFrequency) return;
    
    setIsAddingBrand(true);
    setAddBrandProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAddBrandProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 500);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setAddBrandProgress(100);
      setTimeout(() => {
        // Create new competitor from form data
        const newCompetitor = {
          id: Math.max(...competitors.map(c => c.id), 1) + 1,
          name: websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0],
          url: websiteUrl,
          status: "Active" as "Active" | "Paused",
          visibilityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          trend: Math.random() > 0.5 ? "+1.2%" : "-0.8%",
          reportFrequency: reportFrequency === "biweekly" ? "Bi-weekly" : reportFrequency.charAt(0).toUpperCase() + reportFrequency.slice(1) as "Daily" | "Weekly" | "Bi-weekly" | "Monthly",
          lastReport: "Just added",
          totalMentions: `${(Math.random() * 5 + 1).toFixed(1)}K`
        };
        
        // Add to competitors list
        setCompetitors(prev => [...prev, newCompetitor]);
        
        setIsAddingBrand(false);
        setAddBrandProgress(0);
        setWebsiteUrl("");
        setReportFrequency("");
        toast({
          title: "Competitor Added Successfully",
          description: `${newCompetitor.name} has been added to your watchlist.`,
        });
      }, 1000);
    }, loadingDuration * 1000);
  };

  return (
    <>
      {/* Loading Overlay */}
      {isAddingBrand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
               <div>
                 <h3 className="text-xl font-semibold text-gray-900 mb-2">
                   Adding Competitor...
                 </h3>
                 <p className="text-gray-600 text-sm">
                   Setting up competitor tracking and analysis...
                 </p>
               </div>
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(addBrandProgress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {addBrandProgress < 20 ? "Validating website..." :
                   addBrandProgress < 40 ? "Discovering pages..." :
                   addBrandProgress < 60 ? "Setting up tracking..." :
                   addBrandProgress < 80 ? "Configuring reports..." :
                   "Finalizing setup..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="space-y-6">
      {/* Add Competitor */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Add Competitor</CardTitle>
          <CardDescription className="text-muted-foreground">
            Add a competitor to your watchlist to monitor their AI visibility
          </CardDescription>
        </CardHeader>
         <CardContent>
           <div className="space-y-4">
             {/* Quick Add from Popular Competitors */}
             <div className="p-4 bg-accent/30 rounded-lg border border-border">
               <h4 className="text-sm font-medium text-foreground mb-3">Quick Add Popular Competitors</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 <Select value={selectedCompetitorFromDropdown} onValueChange={setSelectedCompetitorFromDropdown}>
                   <SelectTrigger className="h-9">
                     <SelectValue placeholder="Select a competitor" />
                   </SelectTrigger>
                   <SelectContent>
                     {popularCompetitors
                       .filter(comp => !competitors.some(existing => existing.name.toLowerCase() === comp.name.toLowerCase()))
                       .map((competitor) => (
                         <SelectItem key={competitor.name} value={competitor.name}>
                           {competitor.name}
                         </SelectItem>
                       ))
                     }
                   </SelectContent>
                 </Select>
                 
                 <div className="md:col-span-2">
                   <Button 
                     className="w-full h-9"
                     onClick={() => handleAddCompetitorFromDropdown(selectedCompetitorFromDropdown)}
                     disabled={!selectedCompetitorFromDropdown || isAddingBrand}
                     variant="secondary"
                   >
                     <Plus className="w-4 h-4 mr-2" />
                     {isAddingBrand ? "Adding..." : "Add Selected"}
                   </Button>
                 </div>
               </div>
             </div>
             
             {/* Manual Add */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <Input 
                 placeholder="Enter competitor website URL" 
                 className="h-9" 
                 value={websiteUrl}
                 onChange={(e) => setWebsiteUrl(e.target.value)}
               />
               
               <Select value={reportFrequency} onValueChange={setReportFrequency}>
                 <SelectTrigger className="h-9">
                   <SelectValue placeholder="Report Frequency" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="daily">Daily</SelectItem>
                   <SelectItem value="weekly">Weekly</SelectItem>
                   <SelectItem value="biweekly">Bi-weekly</SelectItem>
                   <SelectItem value="monthly">Monthly</SelectItem>
                 </SelectContent>
               </Select>
               
               <div className="md:col-span-2">
                 <Button 
                   className="w-full h-9"
                   onClick={handleAddBrand}
                   disabled={!websiteUrl.trim() || !reportFrequency || isAddingBrand}
                 >
                   <Plus className="w-4 h-4 mr-2" />
                   {isAddingBrand ? "Adding..." : "Add Custom URL"}
                 </Button>
               </div>
             </div>
           </div>
         </CardContent>
      </Card>

      {/* Competitor Watchlist */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Competitor Watchlist</CardTitle>
          <CardDescription className="text-muted-foreground">
            Monitor your competitors' AI visibility performance ({competitorCount}/10 slots used)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-lg flex items-center justify-center border">
                    <Target className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground text-sm">{competitor.name}</h3>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{competitor.url}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{competitor.visibilityScore}%</p>
                    <p className="text-xs text-muted-foreground">AI Visibility</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-lg font-bold text-foreground">{competitor.totalMentions}</span>
                      <span className={`text-xs ml-1 ${competitor.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {competitor.trend}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Mentions</p>
                  </div>
                  
                   <div className="text-center">
                     <Badge 
                       variant="secondary" 
                       className={`text-xs ${getStatusColor(competitor.status)}`}
                     >
                       {competitor.status}
                     </Badge>
                     <p className="text-xs text-muted-foreground mt-1">{competitor.reportFrequency}</p>
                   </div>
                  
                   <div className="flex items-center space-x-1">
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
                   </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
     </div>
   </>
  );
};
