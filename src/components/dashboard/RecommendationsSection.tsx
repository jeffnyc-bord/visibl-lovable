
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp, Star, Timer, Users, Target, Filter, BarChart3, Gauge, Brain, Sparkles, FileText, Code, Wand2, Bot, ChevronDown, ChevronUp, PlayCircle, Undo2, Calendar, PieChart, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const RecommendationsSection = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("ai-smart");
  const [filterBy, setFilterBy] = useState("all");
  const [aiPrioritizationEnabled, setAiPrioritizationEnabled] = useState(true);
  const [contentGenerationLoading, setContentGenerationLoading] = useState<number | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<number, any>>({});
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});

  const handleActionComplete = (actionId: number) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const toggleCardExpansion = (actionId: number) => {
    setExpandedCards(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  // AI-driven recommendation prioritization
  const calculateAiScore = (rec: any) => {
    const impactWeight = 0.4;
    const competitiveAdvantageWeight = 0.3;
    const aiModelTrendWeight = 0.2;
    const implementationSpeedWeight = 0.1;
    
    const impactScore = rec.impact === "Very High" ? 100 : rec.impact === "High" ? 80 : rec.impact === "Medium" ? 60 : 40;
    const competitiveScore = rec.competitiveAdvantage || 70;
    const trendScore = rec.aiModelTrend || 80;
    const speedScore = rec.effort === "Low" ? 100 : rec.effort === "Medium" ? 70 : 40;
    
    return Math.round(
      (impactScore * impactWeight) + 
      (competitiveScore * competitiveAdvantageWeight) + 
      (trendScore * aiModelTrendWeight) + 
      (speedScore * implementationSpeedWeight)
    );
  };

  const recommendations = [
    {
      id: 1,
      title: "Add Comprehensive FAQ Sections",
      description: "Create detailed FAQ pages for each product to capture long-tail AI queries",
      priority: "High",
      effort: "Medium",
      impact: "High",
      timeline: "2-3 weeks",
      category: "Content",
      aiVisibilityIncrease: 15,
      competitiveAdvantage: 85,
      aiModelTrend: 92,
      contentGenerable: true,
      details: [
        "Add 20+ questions per product page",
        "Focus on comparison queries vs competitors",
        "Include pricing and integration questions",
        "Use natural language patterns"
      ]
    },
    {
      id: 2,
      title: "Implement Enhanced Structured Data",
      description: "Add Product and Organization schema markup to improve AI understanding",
      priority: "High",
      effort: "Low",
      impact: "High",
      timeline: "1 week",
      category: "Technical",
      aiVisibilityIncrease: 12,
      competitiveAdvantage: 78,
      aiModelTrend: 95,
      contentGenerable: true,
      details: [
        "Add Product schema to all service pages",
        "Implement Organization markup",
        "Include rating and review schema",
        "Add FAQ structured data"
      ]
    },
    {
      id: 3,
      title: "Create AI Trend Content Hub",
      description: "Develop content around emerging trends like 'conversational analytics'",
      priority: "Medium",
      effort: "High",
      impact: "High",
      timeline: "4-6 weeks",
      category: "Content",
      aiVisibilityIncrease: 25,
      competitiveAdvantage: 88,
      aiModelTrend: 96,
      contentGenerable: true,
      details: [
        "Write guides on conversational analytics",
        "Create self-service BI best practices",
        "Develop augmented analytics content",
        "Position as thought leader"
      ]
    },
    {
      id: 4,
      title: "Optimize Product Differentiation",
      description: "Clarify unique selling propositions to stand out in AI comparisons",
      priority: "High",
      effort: "Medium",
      impact: "Medium",
      timeline: "2 weeks",
      category: "Content",
      aiVisibilityIncrease: 8,
      competitiveAdvantage: 82,
      aiModelTrend: 75,
      contentGenerable: true,
      details: [
        "Highlight unique features prominently",
        "Add competitive advantage sections",
        "Include specific use cases",
        "Emphasize ROI and outcomes"
      ]
    },
    {
      id: 5,
      title: "Build Citation-Worthy Resources",
      description: "Create comprehensive guides and research that AI models will reference",
      priority: "Medium",
      effort: "High",
      impact: "Very High",
      timeline: "6-8 weeks",
      category: "Authority",
      aiVisibilityIncrease: 30,
      competitiveAdvantage: 92,
      aiModelTrend: 89,
      contentGenerable: true,
      details: [
        "Develop industry benchmark reports",
        "Create comprehensive buying guides",
        "Publish original research data",
        "Build quotable expert opinions"
      ]
    },
    {
      id: 6,
      title: "Improve Page Load Performance",
      description: "Optimize site speed for better AI crawler access and user experience",
      priority: "Medium",
      effort: "Medium",
      impact: "Low",
      timeline: "2-3 weeks",
      category: "Technical",
      aiVisibilityIncrease: 5,
      competitiveAdvantage: 65,
      aiModelTrend: 70,
      contentGenerable: false,
      details: [
        "Optimize images and assets",
        "Implement lazy loading",
        "Minimize JavaScript bundles",
        "Improve server response times"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort.toLowerCase()) {
      case "low": return <div className="flex space-x-0.5"><div className="w-2 h-2 bg-success rounded-full"></div><div className="w-2 h-2 bg-muted rounded-full"></div><div className="w-2 h-2 bg-muted rounded-full"></div></div>;
      case "medium": return <div className="flex space-x-0.5"><div className="w-2 h-2 bg-warning rounded-full"></div><div className="w-2 h-2 bg-warning rounded-full"></div><div className="w-2 h-2 bg-muted rounded-full"></div></div>;
      case "high": return <div className="flex space-x-0.5"><div className="w-2 h-2 bg-destructive rounded-full"></div><div className="w-2 h-2 bg-destructive rounded-full"></div><div className="w-2 h-2 bg-destructive rounded-full"></div></div>;
      default: return <div className="flex space-x-0.5"><div className="w-2 h-2 bg-muted rounded-full"></div><div className="w-2 h-2 bg-muted rounded-full"></div><div className="w-2 h-2 bg-muted rounded-full"></div></div>;
    }
  };

  const getImpactStars = (impact: string) => {
    const impactLevel = impact.toLowerCase();
    const starCount = impactLevel === "very high" ? 5 : impactLevel === "high" ? 4 : impactLevel === "medium" ? 3 : impactLevel === "low" ? 2 : 1;
    return (
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < starCount ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "content": return <Lightbulb className="w-4 h-4" />;
      case "technical": return <CheckCircle className="w-4 h-4" />;
      case "authority": return <TrendingUp className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Content generation function
  const generateContent = async (recommendationId: number) => {
    setContentGenerationLoading(recommendationId);
    
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contentTypes = {
      1: { // FAQ Sections
        type: "FAQ Content",
        content: {
          questions: [
            "How does your analytics platform compare to competitors?",
            "What makes your solution unique in the market?",
            "Can I integrate this with my existing tools?",
            "What's the typical ROI timeline for implementation?",
            "How does pricing scale with my business growth?"
          ],
          schema: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does your analytics platform compare to competitors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Generated answer focusing on unique differentiators]"
      }
    }
  ]
}`
        }
      },
      2: { // Structured Data
        type: "Schema Markup",
        content: {
          productSchema: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "AI Analytics Platform",
  "description": "Advanced AI-powered analytics solution",
  "brand": {
    "@type": "Brand",
    "name": "Your Company"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}`,
          organizationSchema: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yourcompany.com",
  "sameAs": ["https://linkedin.com/company/yourcompany"]
}`
        }
      },
      3: { // Content Hub
        type: "Content Outline",
        content: {
          topics: [
            "The Future of Conversational Analytics: 2024 Trends",
            "Self-Service BI: Empowering Non-Technical Users",
            "Augmented Analytics: When AI Meets Business Intelligence"
          ],
          contentFramework: `Topic: Conversational Analytics Guide
- Introduction to conversational analytics
- Current market landscape and trends
- Implementation best practices
- ROI measurement and KPIs
- Future outlook and predictions
- Case studies and success stories`
        }
      }
    };
    
    setGeneratedContent(prev => ({
      ...prev,
      [recommendationId]: contentTypes[recommendationId] || {
        type: "Content Blueprint",
        content: { outline: "Generated content blueprint for " + recommendation.title }
      }
    }));
    
    setContentGenerationLoading(null);
  };

  const getSortedAndFilteredRecommendations = () => {
    let filtered = recommendations.slice();
    
    // Apply filters
    if (filterBy !== "all") {
      if (filterBy === "completed") {
        filtered = filtered.filter(rec => completedActions.includes(rec.id));
      } else if (filterBy === "pending") {
        filtered = filtered.filter(rec => !completedActions.includes(rec.id));
      } else {
        filtered = filtered.filter(rec => rec.category.toLowerCase() === filterBy.toLowerCase());
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "ai-smart":
          return calculateAiScore(b) - calculateAiScore(a);
        case "impact":
          const impactOrder = { "very high": 5, "high": 4, "medium": 3, "low": 2, "very low": 1 };
          return (impactOrder[b.impact.toLowerCase()] || 0) - (impactOrder[a.impact.toLowerCase()] || 0);
        case "effort":
          const effortOrder = { "low": 1, "medium": 2, "high": 3 };
          return (effortOrder[a.effort.toLowerCase()] || 0) - (effortOrder[b.effort.toLowerCase()] || 0);
        case "category":
          return a.category.localeCompare(b.category);
        case "ai-visibility":
          return b.aiVisibilityIncrease - a.aiVisibilityIncrease;
        case "competitive":
          return (b.competitiveAdvantage || 0) - (a.competitiveAdvantage || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const totalImpact = recommendations.reduce((sum, rec) => sum + rec.aiVisibilityIncrease, 0);
  const completedImpact = recommendations
    .filter(rec => completedActions.includes(rec.id))
    .reduce((sum, rec) => sum + rec.aiVisibilityIncrease, 0);
  
  const filteredRecommendations = getSortedAndFilteredRecommendations();

  return (
    <div className="space-y-6">
      {/* Enhanced Progress & Summary */}
      <Card className={`border-0 shadow-lg transition-all duration-500 ${
        completedActions.length === 0 
          ? 'bg-card animate-fade-in' 
          : 'bg-card'
      }`}>
        <CardHeader className="relative overflow-hidden">
          
          <CardTitle className="flex items-center space-x-2 text-foreground relative z-10">
            <Brain className={`w-6 h-6 text-primary ${completedActions.length === 0 ? 'animate-pulse' : ''}`} />
            <span>AI-Powered Optimization Plan</span>
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardTitle>
          <CardDescription className="relative z-10">
            {completedActions.length === 0 
              ? "Your intelligent roadmap to AI visibility success - let's get started!"
              : "Intelligent recommendations prioritized by real-time AI model behavior and competitive analysis"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Empty State vs Progress State */}
          {completedActions.length === 0 ? (
            /* Compact Empty State */
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Boost Your AI Visibility?
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                  We've identified {recommendations.length} strategic actions that could increase your AI visibility by up to <span className="font-semibold text-primary">+{totalImpact}%</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Potential Impact */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                  <Gauge className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">+{totalImpact}%</div>
                  <div className="text-sm font-medium text-foreground mb-1">AI Visibility Potential</div>
                  <div className="text-xs text-muted-foreground">Ready to unlock</div>
                </div>
                
                {/* Quick Wins Available */}
                <div className="p-4 rounded-lg bg-success/5 border border-success/20 text-center">
                  <Timer className="w-6 h-6 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-success mb-1">
                    {recommendations.filter(rec => rec.effort === "Low" || rec.timeline.includes("1 week")).length}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">Quick Wins</div>
                  <div className="text-xs text-muted-foreground">Start here for fast results</div>
                </div>
                
                {/* Total Actions */}
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 text-center">
                  <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent mb-1">{recommendations.length}</div>
                  <div className="text-sm font-medium text-foreground mb-1">Strategic Actions</div>
                  <div className="text-xs text-muted-foreground">Optimized by AI</div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Pro Tip:</strong> Start with Quick Wins below for immediate results, then work through high-impact actions.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const firstQuickWin = recommendations.find(rec => rec.effort === "Low" || rec.timeline.includes("1 week"));
                    if (firstQuickWin && !expandedCards.includes(firstQuickWin.id)) {
                      toggleCardExpansion(firstQuickWin.id);
                    }
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start with Quick Wins
                </Button>
              </div>
            </div>
          ) : (
            /* Regular Progress State */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Circular Progress Chart */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="none"
                      className="opacity-20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(completedActions.length / recommendations.length) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-4xl font-bold text-primary">
                      {Math.round((completedActions.length / recommendations.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Complete</div>
                  </div>
                </div>
              </div>

              {/* High-Level Impact Summary */}
              <div className="space-y-4">
                <div className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-primary" />
                    Target AI Visibility
                  </h3>
                  <div className="text-3xl font-bold text-primary mb-2">Potential Gain: +{totalImpact}%</div>
                  <p className="text-sm text-muted-foreground">
                    Achieving this potential could increase your brand's AI mentions by ~40% and improve ranking for 200+ key queries.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-card border">
                    <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-success">{completedActions.length}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card border">
                    <TrendingUp className="w-6 h-6 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold text-warning">+{completedImpact}%</div>
                    <div className="text-xs text-muted-foreground">Progress Made</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar - Only show when there's progress */}
          {completedActions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Implementation Progress</span>
                <button 
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={() => setFilterBy(completedActions.length === recommendations.length ? "all" : "pending")}
                >
                  {completedActions.length} of {recommendations.length} actions complete
                </button>
              </div>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-in-out rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(completedActions.length / recommendations.length) * 100}%` }}
                >
                  {completedActions.length > 0 && (
                    <span className="text-xs font-medium text-primary-foreground">
                      {Math.round((completedActions.length / recommendations.length) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-smart">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>AI Smart Priority</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="impact">Highest Impact</SelectItem>
                    <SelectItem value="competitive">Competitive Advantage</SelectItem>
                    <SelectItem value="effort">Lowest Effort</SelectItem>
                    <SelectItem value="ai-visibility">AI Visibility Gain</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Filter:</span>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="authority">Authority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ExportDialog
              trigger={
                <Button variant="outline" size="sm">
                  Export Action Plan
                </Button>
              }
              title="Export Action Plan"
              description="Export your personalized action plan with detailed recommendations."
              exportType="report"
            />
          </div>
        </CardContent>
      </Card>

      {/* Streamlined Action Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Action Items ({filteredRecommendations.length})</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExpandedCards(expandedCards.length === filteredRecommendations.length ? [] : filteredRecommendations.map(r => r.id))}
          >
            {expandedCards.length === filteredRecommendations.length ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        {filteredRecommendations.map((rec) => {
          const isExpanded = expandedCards.includes(rec.id);
          const isCompleted = completedActions.includes(rec.id);
          
          return (
            <Card key={rec.id} className={`transition-all duration-200 ${
              isCompleted 
                ? 'bg-success/5 border-success/20 shadow-sm' 
                : 'bg-card border hover:shadow-md hover:border-primary/20'
            }`}>
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleCardExpansion(rec.id)}
              >
                {/* Streamlined Initial View */}
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleActionComplete(rec.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      
                      {/* Visual Priority Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          rec.priority === "High" ? "bg-destructive/10 text-destructive border-destructive/20" : 
                          rec.priority === "Medium" ? "bg-warning/10 text-warning border-warning/20" : 
                          "bg-success/10 text-success border-success/20"
                        }`}>
                          P{rec.priority === "High" ? "1" : rec.priority === "Medium" ? "2" : "3"}
                        </div>
                        <div className={`w-1 h-12 rounded-full ${
                          rec.priority === "High" ? "bg-destructive" : 
                          rec.priority === "Medium" ? "bg-warning" : "bg-success"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-1.5 rounded-md bg-primary/10">
                                {getCategoryIcon(rec.category)}
                              </div>
                              <CardTitle className={`text-base font-semibold ${
                                isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                              }`}>
                                {rec.title}
                              </CardTitle>
                              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                                isExpanded ? 'transform rotate-180' : ''
                              }`} />
                            </div>
                            <CardDescription className="text-sm">
                              {rec.description}
                            </CardDescription>
                          </div>
                          
                          {/* Prominent Metrics */}
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Effort</div>
                              <div className="flex items-center justify-center">
                                {getEffortIcon(rec.effort)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Impact</div>
                              <div className="flex items-center justify-center">
                                {getImpactStars(rec.impact)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                              <div className="text-xs font-medium text-foreground">{rec.timeline}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">AI Impact</div>
                              <div className="text-sm font-bold text-primary">+{rec.aiVisibilityIncrease}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                {/* Expanded View - "Why" and "How" */}
                <CollapsibleContent>
                  <CardContent className="pt-0 ml-10 space-y-6">
                    {/* Why This Matters (AI Analysis Summary) */}
                    {aiPrioritizationEnabled && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                          <Brain className="w-4 h-4 mr-2 text-primary" />
                          Why This Matters (AI Analysis)
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          This action scores {calculateAiScore(rec)}/100 in our AI optimization model, offering a{" "}
                          <span className="font-semibold text-primary">{rec.competitiveAdvantage}% competitive advantage</span>{" "}
                          with {rec.aiModelTrend}% relevance to current AI model trends. Implementing this could significantly improve your brand's visibility in AI-powered search results and recommendations.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-background/50 border border-border/30">
                          <div className="text-center">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Competitive Edge</div>
                            <div className="text-lg font-bold text-primary">{rec.competitiveAdvantage}%</div>
                            <Progress value={rec.competitiveAdvantage} className="h-1.5 mt-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-muted-foreground mb-1">AI Model Trend</div>
                            <div className="text-lg font-bold text-primary">{rec.aiModelTrend}%</div>
                            <Progress value={rec.aiModelTrend} className="h-1.5 mt-1" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Overall AI Score</div>
                            <div className="text-2xl font-bold text-primary">{calculateAiScore(rec)}<span className="text-sm text-muted-foreground">/100</span></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* How to Implement (Interactive Checklist) */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                        <PlayCircle className="w-4 h-4 mr-2 text-primary" />
                        How to Implement (Step-by-Step Guide)
                      </h4>
                      <div className="space-y-3">
                        {rec.details.map((detail, i) => (
                          <div key={i} className="flex items-start space-x-3 group">
                            <Checkbox 
                              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              id={`step-${rec.id}-${i}`}
                            />
                            <label 
                              htmlFor={`step-${rec.id}-${i}`}
                              className="text-sm text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors flex-1"
                            >
                              <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2 text-center leading-6">
                                {i + 1}
                              </span>
                              {detail}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prominent Generate Blueprint Button */}
                    {rec.contentGenerable && (
                      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground flex items-center">
                              <Wand2 className="w-4 h-4 mr-2 text-accent" />
                              AI Content Generation
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Generate ready-to-use blueprints and templates to accelerate implementation
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                size="default"
                                onClick={() => !generatedContent[rec.id] && generateContent(rec.id)}
                                disabled={contentGenerationLoading === rec.id}
                              >
                                {contentGenerationLoading === rec.id ? (
                                  <>
                                    <Bot className="w-4 h-4 mr-2 animate-pulse" />
                                    Generating Blueprint...
                                  </>
                                ) : generatedContent[rec.id] ? (
                                  <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Content Blueprint
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Content Blueprint
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            {generatedContent[rec.id] && (
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <Wand2 className="w-5 h-5 text-accent" />
                                    <span>Generated Blueprint: {rec.title}</span>
                                  </DialogTitle>
                                  <DialogDescription>
                                    AI-generated content blueprint and templates to accelerate implementation
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                    {generatedContent[rec.id].type}
                                  </Badge>
                                  <Tabs defaultValue="content" className="w-full">
                                    <TabsList>
                                      <TabsTrigger value="content">Content</TabsTrigger>
                                      <TabsTrigger value="schema">Schema/Code</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="content" className="space-y-4">
                                      {typeof generatedContent[rec.id].content === 'object' ? (
                                        Object.entries(generatedContent[rec.id].content).map(([key, value]) => (
                                          <div key={key} className="space-y-2">
                                            <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                            {Array.isArray(value) ? (
                                              <ul className="space-y-1">
                                                {value.map((item, i) => (
                                                  <li key={i} className="flex items-start space-x-2">
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="text-sm">{item}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <Textarea 
                                                value={String(value)} 
                                                readOnly 
                                                className="min-h-[100px] font-mono text-sm"
                                              />
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <Textarea 
                                          value={generatedContent[rec.id].content} 
                                          readOnly 
                                          className="min-h-[200px]"
                                        />
                                      )}
                                    </TabsContent>
                                    <TabsContent value="schema">
                                      {generatedContent[rec.id].content.schema || 
                                       generatedContent[rec.id].content.productSchema || 
                                       generatedContent[rec.id].content.contentFramework ? (
                                        <div className="space-y-4">
                                          {generatedContent[rec.id].content.schema && (
                                            <Textarea 
                                              value={generatedContent[rec.id].content.schema} 
                                              readOnly 
                                              className="font-mono text-sm min-h-[200px]"
                                            />
                                          )}
                                          {generatedContent[rec.id].content.productSchema && (
                                            <div className="space-y-2">
                                              <h4 className="font-semibold">Product Schema</h4>
                                              <Textarea 
                                                value={generatedContent[rec.id].content.productSchema} 
                                                readOnly 
                                                className="font-mono text-sm min-h-[150px]"
                                              />
                                            </div>
                                          )}
                                          {generatedContent[rec.id].content.organizationSchema && (
                                            <div className="space-y-2">
                                              <h4 className="font-semibold">Organization Schema</h4>
                                              <Textarea 
                                                value={generatedContent[rec.id].content.organizationSchema} 
                                                readOnly 
                                                className="font-mono text-sm min-h-[150px]"
                                              />
                                            </div>
                                          )}
                                          {generatedContent[rec.id].content.contentFramework && (
                                            <div className="space-y-2">
                                              <h4 className="font-semibold">Content Framework</h4>
                                              <Textarea 
                                                value={generatedContent[rec.id].content.contentFramework} 
                                                readOnly 
                                                className="font-mono text-sm min-h-[150px]"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">No schema or code templates available for this content type.</p>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-background text-xs">
                          {rec.category}
                        </Badge>
                        <Badge className={`${getPriorityColor(rec.priority)} text-xs`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        {isCompleted && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleActionComplete(rec.id)}
                          >
                            <Undo2 className="w-3 h-3 mr-1" />
                            Undo
                          </Button>
                        )}
                        {!isCompleted && (
                          <Button 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleActionComplete(rec.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Quick Wins Section - Always Visible */}
      <Card className={`border-0 shadow-lg transition-all duration-500 ${
        completedActions.length === 0 
          ? 'bg-gradient-to-br from-success/10 via-background to-success/15 border-success/30 animate-fade-in animation-delay-600' 
          : 'bg-gradient-to-br from-success/5 via-background to-success/10 border-success/20'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Timer className={`w-5 h-5 text-success ${completedActions.length === 0 ? 'animate-pulse' : ''}`} />
            <span>Quick Wins (1-2 weeks)</span>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              {completedActions.length === 0 ? 'Start Here!' : 'High Priority'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {completedActions.length === 0 
              ? "🎯 Perfect starting points for immediate AI visibility improvements - low effort, high impact!"
              : "Fast implementation actions for immediate AI visibility improvements - start here for maximum impact"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations
              .filter(rec => rec.effort === "Low" || rec.timeline.includes("1 week"))
              .map((rec, index) => (
                <div 
                  key={index} 
                  className="border border-success/20 rounded-lg p-4 bg-success/5 hover:bg-success/10 transition-all duration-200 cursor-pointer group"
                  onClick={() => !expandedCards.includes(rec.id) && toggleCardExpansion(rec.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground group-hover:text-success transition-colors">{rec.title}</h4>
                    <Badge className="bg-success/20 text-success border-success/30 text-xs">
                      Quick Win
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{rec.timeline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{rec.effort} effort</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-success">+{rec.aiVisibilityIncrease}%</span>
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
