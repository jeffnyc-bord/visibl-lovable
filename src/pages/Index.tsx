
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
  Globe,
  BarChart3,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown,
  Play
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
    <div className="min-h-screen bg-gray-50/30 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-gray-900 text-lg">GSEO Analytics</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span>Tesla</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3`}>
              General
            </div>
            {sidebarItems.map((item, index) => (
              <div key={index} className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className={`${sidebarCollapsed ? 'hidden' : 'block'} text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3`}>
              Settings
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                <Users className="w-5 h-5" />
                {!sidebarCollapsed && <span className="font-medium">Team</span>}
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
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
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Monitor your brand's AI visibility</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-700 font-medium">00:25:15</span>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  3 pending prompts
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
                <span className="ml-2 font-medium">Help</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {/* URL Input Section */}
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-gray-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xl">Analyze Brand Website</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Enter your brand's primary website URL for comprehensive AI visibility analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="https://your-brand-website.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                />
                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || !websiteUrl}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 text-base font-medium shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Analyze Website
                    </>
                  )}
                </Button>
              </div>
              {isAnalyzing && (
                <div className="mt-6 p-4 bg-white/60 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                    <span className="font-medium">Crawling website and analyzing AI readiness...</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <Progress value={45} className="h-3" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filter Bar */}
          {hasAnalysis && (
            <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">Tesla</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">Last 7 days</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">All Tags</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">All Models</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {hasAnalysis && (
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="bg-white border border-gray-200 p-2 shadow-sm rounded-xl">
                <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-lg px-4 py-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-lg px-4 py-2">
                  <Brain className="w-4 h-4" />
                  <span className="font-medium">My Brand</span>
                </TabsTrigger>
                <TabsTrigger value="competitors" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-lg px-4 py-2">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Competitors</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-lg px-4 py-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">AI Trends</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-lg px-4 py-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Actions</span>
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
