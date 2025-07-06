
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
import { Search, TrendingUp, Brain, Target, Lightbulb, Filter, Globe } from "lucide-react";

const Index = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(true); // Set to true to show mock data

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">GSEO Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Last 30 days</span>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-800">
                Deep Tracked Brands: 1/3
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* URL Input Section */}
        <Card className="mb-8 border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Search className="w-5 h-5 text-blue-400" />
              <span>Analyze Brand Website</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your brand's primary website URL for comprehensive AI visibility analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="https://your-brand-website.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button 
                onClick={handleAnalysis}
                disabled={isAnalyzing || !websiteUrl}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Website"}
              </Button>
            </div>
            {isAnalyzing && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Crawling website and analyzing AI readiness...</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2 bg-gray-800" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        {hasAnalysis && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm shadow-sm border border-gray-700">
              <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="brand" className="flex items-center space-x-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">My Brand</span>
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex items-center space-x-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Competitors</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center space-x-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">AI Trends</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center space-x-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Actions</span>
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
      </div>
    </div>
  );
};

export default Index;
