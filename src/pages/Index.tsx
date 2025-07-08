
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { BrandAnalysisSection } from "@/components/dashboard/BrandAnalysisSection";
import { TechnicalCrawlabilitySection } from "@/components/dashboard/TechnicalCrawlabilitySection";
import { AgencyAdminSection } from "@/components/dashboard/AgencyAdminSection";
import { BrandManagementSection } from "@/components/dashboard/BrandManagementSection";
import { 
  Search, 
  TrendingUp, 
  Brain, 
  Target, 
  Lightbulb, 
  Globe,
  BarChart3,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown,
  Building
} from "lucide-react";

const Index = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  // Simulating role-based logic - in real app this would come from auth/context
  const [userRole, setUserRole] = useState<"business_user" | "agency_admin">("business_user");

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
    }, 3000);
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { label: "Dashboard", icon: BarChart3, active: activeView === "dashboard", view: "dashboard" },
    ];

    if (userRole === "business_user") {
      return [
        ...baseItems,
        { label: "My Brand Analytics", icon: Building, active: activeView === "brands", view: "brands" },
      ];
    } else {
      return [
        ...baseItems,
        { label: "Brand Management", icon: Building, active: activeView === "brands", view: "brands" },
        { label: "Agency Admin", icon: Users, active: activeView === "agency", view: "agency" },
      ];
    }
  };

  const sidebarItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50 flex text-sm">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-14' : 'w-56'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Logo/Brand */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-semibold text-gray-900 text-sm">GSEO Analytics</h1>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>Tesla</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-medium text-gray-500 uppercase tracking-wider mb-2`}>
              General
            </div>
            {sidebarItems.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                  item.active 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveView(item.view)}
              >
                <item.icon className="w-4 h-4" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-medium text-gray-500 uppercase tracking-wider mb-2`}>
              Settings
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-sm">
                <Users className="w-4 h-4" />
                {!sidebarCollapsed && <span className="font-medium">Team</span>}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeView === "dashboard" ? "Dashboard" : 
                 activeView === "brands" ? (userRole === "business_user" ? "My Brand Analytics" : "Brand Management") :
                 activeView === "agency" ? "Agency Admin" : "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Demo Role Switcher */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Demo Role:</span>
                <Select value={userRole} onValueChange={(value: "business_user" | "agency_admin") => setUserRole(value)}>
                  <SelectTrigger className="w-32 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_user">Business User</SelectItem>
                    <SelectItem value="agency_admin">Agency Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                <span>00:25:15</span>
                <span>3 pending prompts</span>
              </div>
              <Button variant="ghost" size="sm" className="text-sm">
                <HelpCircle className="w-4 h-4" />
                <span className="ml-1">Help</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-auto">
          {activeView === "dashboard" && (
            <>
              {/* URL Input Section */}
              <Card className="mb-4 shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
                    <Search className="w-4 h-4 text-blue-500" />
                    <span>Analyze Brand Website</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Enter your brand's primary website URL for comprehensive AI visibility analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="https://your-brand-website.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm h-9"
                    />
                    <Button 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing || !websiteUrl}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm h-9"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Website"}
                    </Button>
                  </div>
                  {isAnalyzing && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Crawling website and analyzing AI readiness...</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filter Bar */}
              {hasAnalysis && (
                <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">Tesla</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                    
                    <Separator orientation="vertical" className="h-4" />
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <span>Last 7 days</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <span>All Tags</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <span>All Models</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Content */}
              {hasAnalysis && (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
                    <TabsTrigger value="overview" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="brand" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
                      <Brain className="w-3 h-3" />
                      <span>Brand & Products</span>
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5">
                      <Settings className="w-3 h-3" />
                      <span>Technical AI Crawlability</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <OverviewSection />
                  </TabsContent>

                  <TabsContent value="brand">
                    <BrandAnalysisSection />
                  </TabsContent>

                  <TabsContent value="technical">
                    <TechnicalCrawlabilitySection />
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}

          {activeView === "brands" && <BrandManagementSection />}
          {activeView === "agency" && <AgencyAdminSection />}
        </main>
      </div>
    </div>
  );
};

export default Index;
