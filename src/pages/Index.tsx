
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { BrandAnalysisSection } from "@/components/dashboard/BrandAnalysisSection";
import { CompetitorSection } from "@/components/dashboard/CompetitorSection";
import { TrendsSection } from "@/components/dashboard/TrendsSection";
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";
import { TechnicalCrawlabilitySection } from "@/components/dashboard/TechnicalCrawlabilitySection";
import boardLabsLogo from "@/assets/board-labs-logo.jpg";
import boardLabsIcon from "@/assets/board-labs-icon-hex.png";
import { QueriesAndPromptsSection } from "@/components/dashboard/QueriesAndPromptsSection";
import { ExternalAIVisibilitySection } from "@/components/dashboard/ExternalAIVisibilitySection";
import { AgencyAdminSection } from "@/components/dashboard/AgencyAdminSection";
import { BrandManagementSection } from "@/components/dashboard/BrandManagementSection";
import { ActionsLog } from "@/components/actions-log";
import { Settings as SettingsPage } from "@/pages/Settings";
import { DashboardSkeleton, ChartWidgetSkeleton, ScorecardSkeleton, TableSkeleton, WidgetSkeleton } from "@/components/ui/dashboard-skeleton";
import { FullDashboardError, WidgetError, EmptyState, NoAIVisibilityEmpty } from "@/components/ui/error-states";
import { BrandLoadingCard } from "@/components/ui/brand-loading-card";
import { DeveloperControls } from "@/components/ui/developer-controls";
import { StatusIndicators } from "@/components/ui/status-indicators";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  Users,
  Globe,
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Settings,
  BarChart3,
  Target,
  Zap,
  Shield,
  Building,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  X,
  HelpCircle,
  Menu,
  Code,
  Brain,
  Lightbulb,
  FileText,
  Home,
  Sparkles,
  Activity,
  FlaskConical
} from "lucide-react";

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
    logo: "/lovable-uploads/d296743b-ff18-4da8-8546-d789de582706.png",
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
    logo: "/lovable-uploads/443dfdf9-57da-486d-9339-83c684d1c404.png",
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
    logo: "/lovable-uploads/f7211f59-be5b-4e58-9bfa-3b6653217350.png",
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

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  // Simulating role-based logic - in real app this would come from auth/context
  const [userRole, setUserRole] = useState<"business_user" | "agency_admin">("business_user");
  const [loadingDuration, setLoadingDuration] = useState(6);
  const [topSourceUrl, setTopSourceUrl] = useState("");
  const [dataPointsCount, setDataPointsCount] = useState(6);
  const [selectedGradient, setSelectedGradient] = useState("gradient3");
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  const [addBrandStep, setAddBrandStep] = useState(1);
  const [newBrandData, setNewBrandData] = useState({
    name: "",
    url: "",
    logoFile: null as File | null,
    logoPreview: "",
    reportFrequency: ""
  });
  
  // Brand switching state
  const [trackedBrands, setTrackedBrands] = useState<BrandData[]>(mockTrackedBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("nike");
  
  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState("Last 7 days");
  const [selectedModels, setSelectedModels] = useState<string[]>(["All models"]);
  
  // Section visibility state
  const [visibleSections, setVisibleSections] = useState<string[]>([
    "overview", "brand", "queries", "recommendations"
  ]);
  
  // Query prompt state
  const [prefilledQuery, setPrefilledQuery] = useState<string>("");
  const [autoOpenPrompt, setAutoOpenPrompt] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [recommendationsSubTab, setRecommendationsSubTab] = useState<'on-site' | 'authority' | 'actionslog'>('on-site');
  const [queriesSubTab, setQueriesSubTab] = useState<'generate' | 'monitor' | 'test'>('generate');
  const [previousScrollPosition, setPreviousScrollPosition] = useState<number>(0);

  // Check for tab parameter in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && allSections.some(section => section.key === tabParam)) {
      setActiveTab(tabParam);
      // Clear the URL parameter after setting the tab
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Restore scroll position when returning to overview tab
  useEffect(() => {
    if (activeTab === "overview" && previousScrollPosition > 0) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo(0, previousScrollPosition);
        setPreviousScrollPosition(0); // Reset after use
      }, 100);
    }
  }, [activeTab, previousScrollPosition]);

  // Dashboard state management
  const [dashboardStates, setDashboardStates] = useState({
    fullDashboardLoading: false,
    widgetLoading: false,
    fullDashboardError: false,
    widgetError: false,
    emptyState: false,
    showBaseline: false,
    highlightTopSource: false,
  });
  
  // Demo mode state
  const [demoMode, setDemoMode] = useState(false);
  
  // Last client warning state (for dev controls)
  const [showLastClientWarning, setShowLastClientWarning] = useState(false);

  // Get current selected brand data
  const selectedBrand = trackedBrands.find(brand => brand.id === selectedBrandId) || trackedBrands[0];

  // Available dashboard sections - now organized into groups
  const mainSections = [
    { key: "overview", label: "AI Visibility Overview", icon: Home },
    { key: "brand", label: "Brand & Products Visibility", icon: Building },
    { key: "queries", label: "Prompt Blast Lab", icon: Zap },
    { key: "recommendations", label: "Actions Lab", icon: Lightbulb }
  ];
  
  const allSections = [...mainSections];

  // Calculate visible sections and pending tasks
  const visibleSectionsCount = visibleSections.length;
  const totalSectionsCount = allSections.length;
  const pendingTasks = Object.values(dashboardStates).filter(Boolean).length;

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

  const handleStateChange = (state: string, value: boolean) => {
    setDashboardStates(prev => ({
      ...prev,
      [state]: value
    }));
  };

  const handleRetryDashboard = () => {
    setDashboardStates(prev => ({ ...prev, fullDashboardError: false }));
    // In a real app, this would trigger a data refetch
  };

  const handleRetryWidget = () => {
    setDashboardStates(prev => ({ ...prev, widgetError: false }));
    // In a real app, this would trigger a widget-specific data refetch
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { label: "Dashboard", icon: BarChart3, active: activeView === "dashboard", view: "dashboard" },
    ];

    if (userRole === "business_user") {
      return [
        ...baseItems,
        { label: "Watchlist", icon: Building, active: activeView === "brands", view: "brands" },
      ];
    } else {
      return [
        ...baseItems,
        { label: "Client Portal", icon: Users, active: activeView === "agency", view: "agency" },
      ];
    }
  };

  // Handle adding new brand
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

  const handleAddNewBrand = () => {
    if (!newBrandData.name.trim() || !newBrandData.url.trim()) return;
    
    const newBrand: BrandData = {
      id: newBrandData.name.toLowerCase().replace(/\s+/g, ''),
      name: newBrandData.name,
      logo: newBrandData.logoPreview || "/lovable-uploads/d296743b-ff18-4da8-8546-d789de582706.png",
      url: newBrandData.url,
      visibilityScore: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      totalMentions: Math.floor(Math.random() * 5000) + 1000,
      platformCoverage: Math.floor(Math.random() * 20) + 80,
      industryRanking: Math.floor(Math.random() * 10) + 1,
      mentionTrend: Math.random() > 0.5 ? "up" : "stable",
      sentimentScore: Math.floor(Math.random() * 20) + 70,
      lastUpdated: new Date().toISOString().split('T')[0],
      platforms: [
        { name: "ChatGPT", mentions: Math.floor(Math.random() * 2000) + 1000, sentiment: "positive", coverage: 90, trend: "up" },
        { name: "Claude", mentions: Math.floor(Math.random() * 1500) + 800, sentiment: "neutral", coverage: 85, trend: "stable" },
        { name: "Gemini", mentions: Math.floor(Math.random() * 1000) + 500, sentiment: "positive", coverage: 82, trend: "up" },
        { name: "Perplexity", mentions: Math.floor(Math.random() * 800) + 400, sentiment: "positive", coverage: 88, trend: "up" }
      ],
      products: [],
      competitors: []
    };
    
    setTrackedBrands(prev => [...prev, newBrand]);
    setSelectedBrandId(newBrand.id);
    toast({
      title: "Brand Added Successfully",
      description: `${newBrand.name} has been added to your portfolio.`,
    });
    setShowAddBrandDialog(false);
    setNewBrandData({ name: "", url: "", logoFile: null, logoPreview: "", reportFrequency: "" });
  };

  const sidebarItems = getNavigationItems();

  // Show full dashboard error if triggered
  if (dashboardStates.fullDashboardError) {
    return <FullDashboardError onRetry={handleRetryDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-sm">
      {/* Developer Controls */}
      <DeveloperControls 
        states={dashboardStates}
        onStateChange={handleStateChange}
        userRole={userRole}
        onRoleChange={setUserRole}
        loadingDuration={loadingDuration}
        onLoadingDurationChange={setLoadingDuration}
        topSourceUrl={topSourceUrl}
        onTopSourceUrlChange={setTopSourceUrl}
        dataPointsCount={dataPointsCount}
        onDataPointsCountChange={setDataPointsCount}
        selectedGradient={selectedGradient}
        onGradientChange={setSelectedGradient}
        onNavigateToAuth={() => navigate('/auth')}
        demoMode={demoMode}
        onDemoModeChange={setDemoMode}
        onTriggerLastClientWarning={() => {
          setUserRole("agency_admin");
          setActiveView("agency");
          setShowLastClientWarning(true);
        }}
      />
      {/* Sidebar - Cloudflare-inspired design */}
      <div className={`${sidebarCollapsed ? 'w-14' : 'w-72'} bg-background border-r border-border flex flex-col transition-all duration-300 sticky top-0 h-screen overflow-y-auto`}>
        {/* Logo/Brand Header */}
        <div className={`${sidebarCollapsed ? 'px-2 justify-center' : 'px-4'} py-4 border-b border-border`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? '' : 'space-x-3'}`}>
              <img 
                src={boardLabsIcon} 
                alt="Board Labs logo" 
                className="w-8 h-8 flex-shrink-0 object-contain"
              />
              {!sidebarCollapsed && (
                <span className="font-semibold text-foreground text-base">visibl</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Search */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm cursor-pointer hover:bg-muted/50 transition-colors">
              <Search className="w-4 h-4" />
              <span>Quick search...</span>
              <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          {/* Main Sections Group - Expanded */}
          {!sidebarCollapsed && (
            <div>
              {mainSections.map((section) => {
                const isActive = activeView === "dashboard" && activeTab === section.key;
                const hasSubItems = section.key === 'recommendations' || section.key === 'queries';
                
                return (
                  <div key={section.key}>
                    <div
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 mb-0.5 ${
                        isActive
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground/80 hover:text-foreground'
                      }`}
                      onClick={() => {
                        setActiveView("dashboard");
                        setActiveTab(section.key);
                      }}
                    >
                      {/* Rainbow gradient accent bar */}
                      <div 
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ease-out ${
                          isActive ? 'h-4 opacity-100' : 'h-0 opacity-0'
                        }`}
                        style={{
                          background: isActive ? 'linear-gradient(180deg, #4285f4 0%, #34a0a4 33%, #52b788 66%, #e9c46a 100%)' : undefined,
                        }}
                      />
                      <section.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-foreground' : ''}`} />
                      <span>{section.label}</span>
                    </div>
                    
                    {/* Sub-items for Prompt Blast Lab */}
                    {hasSubItems && activeTab === 'queries' && (
                      <div className="ml-7 border-l border-border/50 pl-2 mb-1">
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            queriesSubTab === 'generate'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setQueriesSubTab('generate')}
                        >
                          <Sparkles className="w-4 h-4 flex-shrink-0" />
                          <span>Generate</span>
                        </div>
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            queriesSubTab === 'monitor'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setQueriesSubTab('monitor')}
                        >
                          <Activity className="w-4 h-4 flex-shrink-0" />
                          <span>Monitor</span>
                        </div>
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            queriesSubTab === 'test'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setQueriesSubTab('test')}
                        >
                          <FlaskConical className="w-4 h-4 flex-shrink-0" />
                          <span>Test</span>
                        </div>
                      </div>
                    )}

                    {/* Sub-items for Recommendations */}
                    {hasSubItems && activeTab === 'recommendations' && (
                      <div className="ml-7 border-l border-border/50 pl-2 mb-1">
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            recommendationsSubTab === 'on-site'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setRecommendationsSubTab('on-site')}
                        >
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span>On-Site Optimization</span>
                        </div>
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            recommendationsSubTab === 'authority'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setRecommendationsSubTab('authority')}
                        >
                          <Shield className="w-4 h-4 flex-shrink-0" />
                          <span>Authority Lab</span>
                        </div>
                        <div
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 text-sm ${
                            recommendationsSubTab === 'actionslog'
                              ? 'text-foreground font-medium bg-muted/50' 
                              : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => setRecommendationsSubTab('actionslog')}
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>Actions Log</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Main Sections Group - Collapsed (Icons Only) */}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center gap-1">
              {mainSections.map((section) => {
                const isActive = activeView === "dashboard" && activeTab === section.key;
                
                return (
                  <div
                    key={section.key}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? 'text-foreground bg-muted/50' 
                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => {
                      setActiveView("dashboard");
                      setActiveTab(section.key);
                    }}
                    title={section.label}
                  >
                    {/* Rainbow gradient accent bar */}
                    <div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ease-out ${
                        isActive ? 'h-4 opacity-100' : 'h-0 opacity-0'
                      }`}
                      style={{
                        background: isActive ? 'linear-gradient(180deg, #4285f4 0%, #34a0a4 33%, #52b788 66%, #e9c46a 100%)' : undefined,
                      }}
                    />
                    <section.icon className={`w-[18px] h-[18px] ${isActive ? 'text-foreground' : ''}`} />
                  </div>
                );
              })}

              {/* Divider */}
              <div className="w-6 h-px bg-border/50 my-2" />

              {/* Management items - Collapsed */}
              {sidebarItems.filter(item => item.view !== "dashboard").map((item, index) => {
                const isActive = activeView === item.view;
                return (
                  <div 
                    key={index}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? 'text-foreground bg-muted/50' 
                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setActiveView(item.view)}
                    title={item.label}
                  >
                    {/* Rainbow gradient accent bar */}
                    <div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ease-out ${
                        isActive ? 'h-4 opacity-100' : 'h-0 opacity-0'
                      }`}
                      style={{
                        background: isActive ? 'linear-gradient(180deg, #4285f4 0%, #34a0a4 33%, #52b788 66%, #e9c46a 100%)' : undefined,
                      }}
                    />
                    <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-foreground' : ''}`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Management Group - Expanded */}
          {!sidebarCollapsed && (
            <div className="mt-5">
              <div className="px-3 mb-1.5">
                <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">Manage</span>
              </div>
              {sidebarItems.filter(item => item.view !== "dashboard").map((item, index) => {
                const isActive = activeView === item.view;
                return (
                  <div 
                    key={index}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 mb-0.5 ${
                      isActive
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground/80 hover:text-foreground'
                    }`}
                    onClick={() => setActiveView(item.view)}
                  >
                    {/* Rainbow gradient accent bar */}
                    <div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ease-out ${
                        isActive ? 'h-4 opacity-100' : 'h-0 opacity-0'
                      }`}
                      style={{
                        background: isActive ? 'linear-gradient(180deg, #4285f4 0%, #34a0a4 33%, #52b788 66%, #e9c46a 100%)' : undefined,
                      }}
                    />
                    <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-foreground' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </nav>

        {/* Settings - Pinned to Bottom */}
        <div className={`${sidebarCollapsed ? 'flex justify-center' : ''} px-2 py-3 border-t border-border/50`}>
          <div 
            className={`relative flex items-center ${sidebarCollapsed ? 'justify-center w-10 h-10' : 'gap-3 px-3 py-2'} rounded-md cursor-pointer transition-colors duration-150 ${
              activeView === "settings" 
                ? 'text-foreground font-medium' + (sidebarCollapsed ? ' bg-muted/50' : '')
                : 'text-muted-foreground/80 hover:text-foreground' + (sidebarCollapsed ? ' hover:bg-muted/30' : '')
            }`}
            onClick={() => setActiveView("settings")}
            title={sidebarCollapsed ? "Settings" : undefined}
          >
            {/* Rainbow gradient accent bar */}
            <div 
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-300 ease-out ${
                activeView === "settings" ? 'h-4 opacity-100' : 'h-0 opacity-0'
              }`}
              style={{
                background: activeView === "settings" ? 'linear-gradient(180deg, #4285f4 0%, #34a0a4 33%, #52b788 66%, #e9c46a 100%)' : undefined,
              }}
            />
            <Settings className={`w-[18px] h-[18px] flex-shrink-0 ${activeView === "settings" ? 'text-foreground' : ''}`} />
            {!sidebarCollapsed && <span>Settings</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-background border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Brand Selector - moved to header */}
              {activeView === "dashboard" && hasAnalysis && !dashboardStates.fullDashboardLoading && (
                <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                  <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent focus:ring-0 hover:bg-muted/50 rounded-md px-2 py-1.5">
                    <div className="flex items-center space-x-2">
                      <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-6 h-6 object-contain" />
                      <span className="font-medium text-foreground text-sm">{selectedBrand.name}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50 min-w-[280px]">
                    <div className="px-2 py-1.5">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        {userRole === "agency_admin" ? "Client Brand" : "Your Brand"}
                      </div>
                      <SelectItem value={selectedBrand.id} className="rounded-md">
                        <div className="flex items-center space-x-2">
                          <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-5 h-5 object-contain" />
                          <span className="font-medium">{selectedBrand.name}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">Primary</Badge>
                        </div>
                      </SelectItem>
                    </div>
                    
                    {selectedBrand.competitors && selectedBrand.competitors.length > 0 && (
                      <div className="px-2 py-1.5 border-t border-border/50">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Tracked Competitors
                        </div>
                        {trackedBrands.filter(b => b.id !== selectedBrand.id).map((brand) => (
                          <SelectItem key={brand.id} value={brand.id} className="rounded-md">
                            <div className="flex items-center space-x-2">
                              <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                              <span>{brand.name}</span>
                              <span className="text-[10px] text-muted-foreground ml-auto">vs {selectedBrand.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-t border-border/50 mt-1 pt-1 px-2 pb-1">
                      <div 
                        className="flex items-center space-x-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer rounded-md transition-colors"
                        onClick={() => setShowAddBrandDialog(true)}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Competitor to Track</span>
                      </div>
                      {userRole === "agency_admin" && (
                        <div 
                          className="flex items-center space-x-2 px-2 py-1.5 text-sm text-foreground hover:bg-muted/50 cursor-pointer rounded-md transition-colors"
                          onClick={() => setActiveView("agency")}
                        >
                          <Users className="w-4 h-4" />
                          <span>Switch or Add New Client</span>
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
              
              {dashboardStates.fullDashboardLoading && (
                <div>
                  <h2 className="text-lg font-medium text-foreground">Loading your AI Visibility Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Gathering real-time insights from across the AI ecosystem...</p>
                </div>
              )}
              
              {activeView !== "dashboard" && (
                <h2 className="text-lg font-medium text-foreground">
                  {activeView === "brands" ? "Watchlist"
                    : activeView === "agency" ? "Agency Admin"
                    : activeView === "settings" ? "Settings" 
                    : "Dashboard"}
                </h2>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Next Scan & Model Filters - moved to header */}
              {activeView === "dashboard" && hasAnalysis && !dashboardStates.fullDashboardLoading && (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      Next scan: <span className="text-foreground font-medium">Wed 2:00 PM</span>
                    </span>
                  </div>
                  
                  <Separator orientation="vertical" className="h-5" />
                  
                  <Popover onOpenChange={(open) => {
                    if (!open && selectedModels.length === 0) {
                      setSelectedModels(["All models"]);
                    }
                  }}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 text-xs h-8 px-3">
                        <span>
                          {selectedModels.includes("All models") 
                            ? "All models" 
                            : selectedModels.length === 1 
                              ? selectedModels[0] 
                              : selectedModels.length === 0
                                ? "Select models"
                                : `${selectedModels.length} models`}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="end">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground mb-2">Select AI Models</div>
                        {["All models", "ChatGPT", "Gemini", "Grok", "Perplexity"].map((model) => (
                          <div key={model} className="flex items-center space-x-2">
                            <Checkbox
                              id={model}
                              checked={selectedModels.includes(model)}
                              onCheckedChange={(checked) => {
                                if (model === "All models") {
                                  if (checked) {
                                    setSelectedModels(["All models"]);
                                  } else {
                                    setSelectedModels([]);
                                  }
                                } else {
                                  if (checked) {
                                    const newModels = selectedModels.includes("All models") 
                                      ? [model] 
                                      : [...selectedModels.filter(m => m !== "All models"), model];
                                    setSelectedModels(newModels);
                                  } else {
                                    setSelectedModels(selectedModels.filter(m => m !== model));
                                  }
                                }
                              }}
                            />
                            <label htmlFor={model} className="text-sm text-muted-foreground cursor-pointer">
                              {model}
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Separator orientation="vertical" className="h-5" />
                </>
              )}
              
              <StatusIndicators
                visibleSections={visibleSectionsCount}
                totalSections={totalSectionsCount}
                pendingTasks={pendingTasks}
                isLoading={dashboardStates.fullDashboardLoading || dashboardStates.widgetLoading}
              />
              
              <Button variant="ghost" size="sm" className="text-sm">
                <HelpCircle className="w-4 h-4" />
                <span className="ml-1">Help</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-muted/20">
          {activeView === "dashboard" && (
            <>
              {/* Show skeleton if full dashboard loading */}
              {dashboardStates.fullDashboardLoading ? (
                <DashboardSkeleton />
              ) : (
                <>
                  {/* Dashboard Content - Direct rendering based on activeTab */}
                  {hasAnalysis && (
                    <div className={`space-y-4 ${demoMode ? 'demo-content' : ''}`}>
                      {activeTab === "overview" && (
                        <>
                          {dashboardStates.emptyState ? (
                            <NoAIVisibilityEmpty />
                          ) : dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <BrandLoadingCard userRole={userRole} />
                          ) : (
                            <OverviewSection 
                              brandData={selectedBrand} 
                              selectedModels={selectedModels}
                              selectedDateRange={selectedDateRange}
                              userRole={userRole}
                              showBaseline={dashboardStates.showBaseline}
                              highlightTopSource={dashboardStates.highlightTopSource}
                              testTopSourceUrl={topSourceUrl}
                              dataPointsCount={dataPointsCount}
                              selectedGradient={selectedGradient}
                              demoMode={demoMode}
                              onQueryClick={(query) => {
                                setPreviousScrollPosition(window.scrollY);
                                setAutoOpenPrompt(query);
                                setActiveTab("queries");
                              }}
                              onNavigateToPrompts={() => {
                                setPreviousScrollPosition(window.scrollY);
                                setActiveTab("queries");
                              }}
                            />
                          )}
                        </>
                      )}

                      {activeTab === "brand" && (
                        <>
                          {dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <BrandLoadingCard userRole={userRole} />
                          ) : (
                            <BrandAnalysisSection brandData={selectedBrand} demoMode={demoMode} />
                          )}
                        </>
                      )}

                      {activeTab === "queries" && (
                        <>
                          {dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <BrandLoadingCard userRole={userRole} />
                          ) : (
                            <QueriesAndPromptsSection 
                              brandData={selectedBrand} 
                              prefilledQuery={prefilledQuery}
                              autoOpenPrompt={autoOpenPrompt}
                              demoMode={demoMode}
                              activeSubTab={queriesSubTab}
                              onQueryUsed={() => {
                                setPrefilledQuery("");
                                setAutoOpenPrompt("");
                              }}
                            />
                          )}
                        </>
                      )}

                      {activeTab === "competitors" && (
                        <>
                          {dashboardStates.emptyState ? (
                            <EmptyState
                              title="No Competitor Data"
                              description="No competitor information is available for this brand."
                            />
                          ) : dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <WidgetSkeleton />
                          ) : (
                            <CompetitorSection brandData={selectedBrand} demoMode={demoMode} />
                          )}
                        </>
                      )}

                      {activeTab === "trends" && (
                        <>
                          {dashboardStates.emptyState ? (
                            <EmptyState
                              title="No Trend Data Available"
                              description="Trend analysis requires at least 7 days of data."
                            />
                          ) : dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <WidgetSkeleton />
                          ) : (
                            <TrendsSection demoMode={demoMode} />
                          )}
                        </>
                      )}

                      {activeTab === "technical" && (
                        <>
                          {dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <WidgetSkeleton />
                          ) : (
                            <TechnicalCrawlabilitySection demoMode={demoMode} />
                          )}
                        </>
                      )}

                      {activeTab === "recommendations" && (
                        <>
                          {dashboardStates.widgetError ? (
                            <WidgetError onRetry={handleRetryWidget} />
                          ) : dashboardStates.widgetLoading ? (
                            <BrandLoadingCard userRole={userRole} />
                          ) : recommendationsSubTab === 'actionslog' ? (
                            <div className="h-[calc(100vh-12rem)]">
                              <ActionsLog />
                            </div>
                          ) : (
                            <RecommendationsSection brandData={selectedBrand} demoMode={demoMode} activeSubTab={recommendationsSubTab} />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeView === "brands" && <BrandManagementSection selectedBrand={selectedBrand} trackedBrands={trackedBrands} loadingDuration={loadingDuration} />}
          {activeView === "agency" && (
            <AgencyAdminSection 
              trackedBrands={trackedBrands}
              onBrandAdded={(newBrand) => setTrackedBrands(prev => [...prev, newBrand])}
              showLastClientWarning={showLastClientWarning}
              onLastClientWarningChange={setShowLastClientWarning}
            />
          )}
          {activeView === "settings" && <SettingsPage userRole={userRole} />}
        </main>
      </div>

      {/* Demo Mode Exit Button */}
      {demoMode && (
        <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 demo-exit-button">
          <Button
            onClick={() => setDemoMode(false)}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl rounded-full px-8 py-6 text-lg font-semibold flex items-center gap-3 backdrop-blur-sm border-2 border-border/40"
          >
            <X className="w-5 h-5" />
            Exit Demo Mode
          </Button>
        </div>
      )}

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
                    handleAddNewBrand();
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
  );
};

export default Index;
