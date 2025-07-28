
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
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
  Building
} from "lucide-react";

export const BrandManagementSection = () => {
  const { toast } = useToast();
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [addBrandProgress, setAddBrandProgress] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandType, setBrandType] = useState("");
  const [reportFrequency, setReportFrequency] = useState("");
  
  // User's primary brand
  const myBrand = {
    id: 1,
    name: "Nike",
    url: "nike.com",
    type: "primary",
    status: "Active",
    visibilityScore: 94,
    trend: "+3.2%",
    reportFrequency: "Daily",
    lastReport: "2 hours ago",
    totalMentions: "2.4K",
    platformCoverage: 12
  };

  const [competitors, setCompetitors] = useState([
    {
      id: 2,
      name: "Adidas",
      url: "adidas.com",
      status: "Active",
      visibilityScore: 87,
      trend: "+1.8%",
      reportFrequency: "Weekly",
      lastReport: "3 days ago",
      totalMentions: "1.9K"
    },
    {
      id: 3,
      name: "Under Armour",
      url: "underarmour.com",
      status: "Active",
      visibilityScore: 72,
      trend: "-0.5%",
      reportFrequency: "Weekly",
      lastReport: "1 week ago",
      totalMentions: "1.2K"
    },
    {
      id: 4,
      name: "Puma",
      url: "puma.com",
      status: "Active",
      visibilityScore: 68,
      trend: "+2.1%",
      reportFrequency: "Bi-weekly",
      lastReport: "5 days ago",
      totalMentions: "890"
    }
  ]);

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
        setIsAddingBrand(false);
        setAddBrandProgress(0);
        setWebsiteUrl("");
        setReportFrequency("");
        toast({
          title: "Competitor Added Successfully",
          description: "Your competitor has been added to your watchlist.",
        });
      }, 1000);
    }, 6000);
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
      {/* My Brand Hero Section */}
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <Building className="w-5 h-5" />
                My Brand
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your brand's AI visibility performance
              </CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Eye className="w-4 h-4 mr-2" />
              View Full Dashboard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-foreground">{myBrand.visibilityScore}%</span>
                <span className="text-sm text-green-600 ml-1">{myBrand.trend}</span>
              </div>
              <p className="text-sm text-muted-foreground">AI Visibility Score</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-foreground">{myBrand.totalMentions}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Mentions</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-foreground">{myBrand.platformCoverage}</span>
              </div>
              <p className="text-sm text-muted-foreground">Platform Coverage</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-foreground">{myBrand.lastReport}</span>
              </div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Competitor */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Add Competitor</CardTitle>
          <CardDescription className="text-muted-foreground">
            Add a competitor to your watchlist to monitor their AI visibility
          </CardDescription>
        </CardHeader>
         <CardContent>
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
                 {isAddingBrand ? "Adding..." : "Add to Watchlist"}
               </Button>
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
                    <Badge variant="secondary" className="text-xs">
                      {competitor.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{competitor.reportFrequency}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
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
