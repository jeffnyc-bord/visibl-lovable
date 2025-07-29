
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { BrandAnalysisSection } from "@/components/dashboard/BrandAnalysisSection";
import { CompetitorSection } from "@/components/dashboard/CompetitorSection";
import { TrendsSection } from "@/components/dashboard/TrendsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { TechnicalCrawlabilitySection } from "@/components/dashboard/TechnicalCrawlabilitySection";
import { QueriesAndPromptsSection } from "@/components/dashboard/QueriesAndPromptsSection";
import { ExternalAIVisibilitySection } from "@/components/dashboard/ExternalAIVisibilitySection";
import { AgencyAdminSection } from "@/components/dashboard/AgencyAdminSection";
import { BrandManagementSection } from "@/components/dashboard/BrandManagementSection";
import { Settings as SettingsPage } from "@/pages/Settings";

// Mock brand data structure
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

// Mock data for tracked brands
const mockTrackedBrands: BrandData[] = [
  {
    id: "nike",
    name: "Nike",
    logo: "/lovable-uploads/7c83c89c-25ba-4bd6-ac2d-3bfa6cd098db.png",
    url: "nike.com",
    visibilityScore: 87,
    totalMentions: 12847,
    platformCoverage: 89,
    industryRanking: 2,
    mentionTrend: "up",
    sentimentScore: 78,
    lastUpdated: "2024-01-15",
    platforms: [
      { name: "ChatGPT", mentions: 4234, sentiment: "positive", coverage: 92, trend: "up" },
      { name: "Claude", mentions: 3456, sentiment: "positive", coverage: 87, trend: "up" },
      { name: "Gemini", mentions: 2847, sentiment: "neutral", coverage: 84, trend: "stable" },
      { name: "Perplexity", mentions: 2310, sentiment: "positive", coverage: 91, trend: "up" }
    ],
    products: [
      { id: 1, name: "Air Max", category: "Footwear", visibilityScore: 92, mentions: 3421, sentiment: "positive", lastOptimized: "2024-01-12" },
      { id: 2, name: "Air Jordan", category: "Footwear", visibilityScore: 94, mentions: 4123, sentiment: "positive", lastOptimized: "2024-01-10" },
      { id: 3, name: "Nike Pro", category: "Apparel", visibilityScore: 78, mentions: 1892, sentiment: "neutral", lastOptimized: "2024-01-08" }
    ],
    competitors: [
      { name: "Adidas", visibilityScore: 84, mentions: 11234, trend: "up" },
      { name: "Puma", visibilityScore: 72, mentions: 8456, trend: "down" },
      { name: "Under Armour", visibilityScore: 68, mentions: 6789, trend: "stable" }
    ]
  },
  {
    id: "adidas",
    name: "Adidas",
    logo: "/lovable-uploads/6d96032a-5e62-4e84-b278-3c492029f934.png",
    url: "adidas.com",
    visibilityScore: 84,
    totalMentions: 11234,
    platformCoverage: 86,
    industryRanking: 3,
    mentionTrend: "up",
    sentimentScore: 76,
    lastUpdated: "2024-01-15",
    platforms: [
      { name: "ChatGPT", mentions: 3789, sentiment: "positive", coverage: 88, trend: "up" },
      { name: "Claude", mentions: 3123, sentiment: "positive", coverage: 85, trend: "stable" },
      { name: "Gemini", mentions: 2456, sentiment: "neutral", coverage: 82, trend: "up" },
      { name: "Perplexity", mentions: 1866, sentiment: "positive", coverage: 89, trend: "up" }
    ],
    products: [
      { id: 1, name: "Ultraboost", category: "Footwear", visibilityScore: 89, mentions: 2987, sentiment: "positive", lastOptimized: "2024-01-11" },
      { id: 2, name: "Stan Smith", category: "Footwear", visibilityScore: 85, mentions: 2234, sentiment: "positive", lastOptimized: "2024-01-09" },
      { id: 3, name: "Originals", category: "Apparel", visibilityScore: 74, mentions: 1567, sentiment: "neutral", lastOptimized: "2024-01-07" }
    ],
    competitors: [
      { name: "Nike", visibilityScore: 87, mentions: 12847, trend: "up" },
      { name: "Puma", visibilityScore: 72, mentions: 8456, trend: "down" },
      { name: "New Balance", visibilityScore: 69, mentions: 5432, trend: "up" }
    ]
  },
  {
    id: "apple",
    name: "Apple",
    logo: "/lovable-uploads/2e118f8d-a421-4c37-b61b-bdf56fc650c4.png",
    url: "apple.com",
    visibilityScore: 95,
    totalMentions: 24567,
    platformCoverage: 97,
    industryRanking: 1,
    mentionTrend: "up",
    sentimentScore: 85,
    lastUpdated: "2024-01-15",
    platforms: [
      { name: "ChatGPT", mentions: 8234, sentiment: "positive", coverage: 98, trend: "up" },
      { name: "Claude", mentions: 7456, sentiment: "positive", coverage: 96, trend: "up" },
      { name: "Gemini", mentions: 5847, sentiment: "positive", coverage: 95, trend: "up" },
      { name: "Perplexity", mentions: 3030, sentiment: "positive", coverage: 99, trend: "up" }
    ],
    products: [
      { id: 1, name: "iPhone", category: "Mobile", visibilityScore: 98, mentions: 8901, sentiment: "positive", lastOptimized: "2024-01-14" },
      { id: 2, name: "MacBook", category: "Computing", visibilityScore: 94, mentions: 5432, sentiment: "positive", lastOptimized: "2024-01-13" },
      { id: 3, name: "AirPods", category: "Audio", visibilityScore: 91, mentions: 4567, sentiment: "positive", lastOptimized: "2024-01-12" }
    ],
    competitors: [
      { name: "Samsung", visibilityScore: 89, mentions: 19234, trend: "stable" },
      { name: "Google", visibilityScore: 82, mentions: 15678, trend: "up" },
      { name: "Microsoft", visibilityScore: 78, mentions: 13456, trend: "stable" }
    ]
  }
];
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
  Building,
  Code,
  Zap,
  Eye
} from "lucide-react";

const Index = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  // Simulating role-based logic - in real app this would come from auth/context
  const [userRole, setUserRole] = useState<"business_user" | "agency_admin">("business_user");
  
  // Brand switching state
  const [trackedBrands] = useState<BrandData[]>(mockTrackedBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("nike");
  
  // Section visibility state
  const [visibleSections, setVisibleSections] = useState<string[]>([
    "overview", "brand", "queries", "competitors", "trends", "technical", "recommendations"
  ]);
  
  // Query prompt state
  const [prefilledQuery, setPrefilledQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Get current selected brand data
  const selectedBrand = trackedBrands.find(brand => brand.id === selectedBrandId) || trackedBrands[0];

  // Available dashboard sections
  const allSections = [
    { key: "overview", label: "AI Visibility Overview", icon: "/lovable-uploads/bbadd30d-d143-4dae-b889-4797029e56f6.png" },
    { key: "brand", label: "Brand & Product Visibility", icon: "/lovable-uploads/153e42f9-e2e0-44d2-b4a0-07a8fbd42599.png" },
    { key: "queries", label: "Prompt Blast Lab", icon: "/lovable-uploads/a89301fe-f6cc-44ec-80c8-e563e07e8f0c.png" },
    { key: "competitors", label: "Competitors", icon: "/lovable-uploads/6a43d419-c4e3-47a9-bd9d-d88e81f33fee.png" },
    { key: "trends", label: "AI Trends", icon: Globe },
    { key: "technical", label: "Technical Health", icon: Code },
    { key: "recommendations", label: "Recommendations", icon: "/lovable-uploads/aa7e3f0d-b714-499a-b96f-f48edabf1de9.png" }
  ];

  const toggleSectionVisibility = (sectionKey: string) => {
    setVisibleSections(prev => {
      const newSections = prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey];
      
      // If current active view is being hidden, switch to first visible section
      if (!newSections.includes(activeView) && activeView !== "dashboard") {
        setActiveView("dashboard");
      }
      
      return newSections;
    });
  };

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
        { label: "Brand Management", icon: Building, active: activeView === "brands", view: "brands" },
      ];
    } else {
      return [
        ...baseItems,
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
            <img 
              src="/lovable-uploads/8b019b65-cf22-4d96-bc74-711b20ff6457.png" 
              alt="visibl logo" 
              className="w-6 h-6"
            />
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-semibold text-gray-900 text-sm font-mono tracking-wide">visibl</h1>
                <div className="text-xs text-gray-500">AI Brand Visibility</div>
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
              <div 
                className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                  activeView === "settings" 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveView("settings")}
              >
                <Settings className="w-4 h-4" />
                {!sidebarCollapsed && <span className="font-medium">Settings</span>}
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
                 activeView === "agency" ? "Agency Admin" :
                 activeView === "settings" ? "Settings" : "Dashboard"}
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

              {/* Section Visibility Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Visible Sections:</span>
                <Select>
                  <SelectTrigger className="w-36 h-7 text-xs">
                    <SelectValue placeholder={`${visibleSections.length} of ${allSections.length} visible`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {allSections.map((section) => (
                        <div 
                          key={section.key}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => toggleSectionVisibility(section.key)}
                        >
                          <input
                            type="checkbox"
                            checked={visibleSections.includes(section.key)}
                            onChange={() => {}} // Handled by parent onClick
                            className="w-4 h-4 text-blue-600"
                          />
                          <div className="flex items-center space-x-2">
                            {typeof section.icon === 'string' ? (
                              <img src={section.icon} alt={section.label} className="w-4 h-4" />
                            ) : (
                              <section.icon className="w-4 h-4" />
                            )}
                            <span className="text-sm">{section.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
        <main className="flex-1 p-3 overflow-auto">
          {activeView === "dashboard" && (
            <>

              {/* Filter Bar */}
              {hasAnalysis && (
                <div className="mb-3 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                        <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent focus:ring-0 hover:bg-gray-50 rounded-md px-2 py-1">
                          <div className="flex items-center space-x-2">
                            <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-6 h-6 object-contain" />
                            <span className="font-medium text-gray-900 text-sm">{selectedBrand.name}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {trackedBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              <div className="flex items-center space-x-2">
                                <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                                <span>{brand.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
                  <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
                    {allSections
                      .filter(section => visibleSections.includes(section.key))
                      .map((section) => (
                        <TabsTrigger 
                          key={section.key}
                          value={section.key} 
                          className="flex items-center space-x-1.5 data-[state=active]:bg-gray-100 text-sm px-3 py-1.5"
                        >
                          {typeof section.icon === 'string' ? (
                            <img src={section.icon} alt={section.label} className="w-4 h-4" />
                          ) : (
                            <section.icon className="w-3 h-3" />
                          )}
                          <span>{section.label}</span>
                        </TabsTrigger>
                      ))}
                  </TabsList>

                  {visibleSections.includes("overview") && (
                    <TabsContent value="overview">
                      <OverviewSection 
                        brandData={selectedBrand} 
                        onQueryClick={(query) => {
                          setPrefilledQuery(query);
                          setActiveTab("queries");
                        }}
                      />
                    </TabsContent>
                  )}

                  {visibleSections.includes("brand") && (
                    <TabsContent value="brand">
                      <BrandAnalysisSection brandData={selectedBrand} />
                    </TabsContent>
                  )}

                  {visibleSections.includes("queries") && (
                    <TabsContent value="queries">
                      <QueriesAndPromptsSection 
                        brandData={selectedBrand} 
                        prefilledQuery={prefilledQuery}
                        onQueryUsed={() => setPrefilledQuery("")}
                      />
                    </TabsContent>
                  )}

                  {visibleSections.includes("competitors") && (
                    <TabsContent value="competitors">
                      <CompetitorSection brandData={selectedBrand} />
                    </TabsContent>
                  )}

                  {visibleSections.includes("trends") && (
                    <TabsContent value="trends">
                      <TrendsSection />
                    </TabsContent>
                  )}

                  {visibleSections.includes("technical") && (
                    <TabsContent value="technical">
                      <TechnicalCrawlabilitySection />
                    </TabsContent>
                  )}

                  {visibleSections.includes("recommendations") && (
                    <TabsContent value="recommendations">
                      <RecommendationsSection />
                    </TabsContent>
                  )}
                </Tabs>
              )}
            </>
          )}

          {activeView === "brands" && <BrandManagementSection selectedBrand={selectedBrand} trackedBrands={trackedBrands} />}
          {activeView === "agency" && <AgencyAdminSection />}
          {activeView === "settings" && <SettingsPage userRole={userRole} />}
        </main>
      </div>
    </div>
  );
};

export default Index;
