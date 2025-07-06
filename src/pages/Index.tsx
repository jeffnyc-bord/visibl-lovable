
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { BrandAnalysisSection } from "@/components/dashboard/BrandAnalysisSection";
import { CompetitorSection } from "@/components/dashboard/CompetitorSection";
import { TrendsSection } from "@/components/dashboard/TrendsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { 
  Search, 
  TrendingUp, 
  Brain, 
  Target, 
  Lightbulb, 
  Filter, 
  Globe,
  BarChart3,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown
} from "lucide-react";

const Index = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
    }, 3000);
  };

  const sidebarItems = [
    { label: "Dashboard", icon: BarChart3, active: true },
    { label: "Rankings", icon: TrendingUp, active: false },
    { label: "Sources", icon: Globe, active: false },
    { label: "Prompts", icon: FileText, active: false },
    { label: "Mentions", icon: Users, active: false },
    { label: "Competitors", icon: Target, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-semibold text-gray-900">GSEO Analytics</h1>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>Tesla</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-medium text-gray-500 uppercase tracking-wider mb-3`}>
              General
            </div>
            {sidebarItems.map((item, index) => (
              <div key={index} className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-medium text-gray-500 uppercase tracking-wider mb-3`}>
              Settings
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Users className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Team</span>}
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Settings className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Workspace</span>}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>00:25:15</span>
                <span>3 pending prompts</span>
              </div>
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
                <span className="ml-2">Help</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {/* URL Input Section */}
          <Card className="mb-6 shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Search className="w-5 h-5 text-blue-500" />
                <span>Analyze Brand Website</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your brand's primary website URL for comprehensive AI visibility analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-3">
                <Input
                  placeholder="https://your-brand-website.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || !websiteUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Website"}
                </Button>
              </div>
              {isAnalyzing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Crawling website and analyzing AI readiness...</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filter Bar */}
          {hasAnalysis && (
            <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="font-medium text-gray-900">Tesla</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                <Separator orientation="vertical" className="h-6" />
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Last 7 days</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>All Tags</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>All Models</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {hasAnalysis && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white border border-gray-200 p-1 shadow-sm">
                <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-gray-100">
                  <TrendingUp className="w-4 h-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center space-x-2 data-[state=active]:bg-gray-100">
                  <Brain className="w-4 h-4" />
                  <span>My Brand</span>
                </TabsTrigger>
                <TabsTrigger value="competitors" className="flex items-center space-x-2 data-[state=active]:bg-gray-100">
                  <Target className="w-4 h-4" />
                  <span>Competitors</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center space-x-2 data-[state=active]:bg-gray-100">
                  <Globe className="w-4 h-4" />
                  <span>AI Trends</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center space-x-2 data-[state=active]:bg-gray-100">
                  <Lightbulb className="w-4 h-4" />
                  <span>Actions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewSection />
              </TabsContent>

              <TabsContent value="brand">
                <BrandAnalysisSection />
              </TabsContent>

              <TabsContent value="competitors">
                <CompetitorSection />
              </TabsContent>

              <TabsContent value="trends">
                <TrendsSection />
              </TabsContent>

              <TabsContent value="recommendations">
                <RecommendationsSection />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
