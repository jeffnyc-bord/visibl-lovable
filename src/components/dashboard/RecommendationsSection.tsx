import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AIChatbotModal } from "@/components/ui/ai-chatbot-modal";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp, Star, Timer, Users, Target, Filter, BarChart3, Gauge, Brain, Sparkles, FileText, Code, Wand2, Bot, ChevronDown, ChevronUp, PlayCircle, Undo2, Calendar, PieChart, HelpCircle, RefreshCw } from "lucide-react";
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
  const [chatbotModal, setChatbotModal] = useState<{isOpen: boolean, content: any, title: string}>({
    isOpen: false,
    content: null,
    title: ""
  });
  const [lastGenerated, setLastGenerated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh recommendations
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastGenerated(new Date());
    setIsRefreshing(false);
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

  // Content generation function that directly opens chat
  const generateAndOpenChat = async (recommendationId: number) => {
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
    
    const content = contentTypes[recommendationId] || {
      type: "Content Blueprint",
      content: { outline: "Generated content blueprint for " + recommendation.title }
    };
    
    setGeneratedContent(prev => ({
      ...prev,
      [recommendationId]: content
    }));
    
    setContentGenerationLoading(null);
    
    // Directly open chat modal
    setChatbotModal({
      isOpen: true,
      content: content,
      title: recommendation.title
    });
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
    <div className="space-y-3">
      {/* Minimal Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/e81540f9-53d7-49d2-a3d4-e3eaf04efcb1.png" alt="AI Optimization Plan" className="w-5 h-5" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI-Powered Optimization Plan</h3>
                <p className="text-xs text-muted-foreground">
                  {completedActions.length === 0 
                    ? `${recommendations.length} strategic actions to boost AI visibility by +${totalImpact}%`
                    : `${completedActions.length}/${recommendations.length} completed • +${completedImpact}% gained so far`
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Last updated: {lastGenerated.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </Button>
              {completedActions.length > 0 && (
                <div className="text-right">
                  <div className="text-lg font-bold text-success">+{completedImpact}%</div>
                  <div className="text-xs text-muted-foreground">Impact Gained</div>
                </div>
              )}
            </div>
          </div>
          {completedActions.length > 0 && (
            <Progress value={(completedActions.length / recommendations.length) * 100} className="mt-2 h-1.5" />
          )}
        </CardContent>
      </Card>

      {/* Compact Progress Row */}
      {completedActions.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedActions.length} of {recommendations.length} completed
            </span>
            <span className="text-primary font-medium">
              +{completedImpact}% visibility gained
            </span>
          </div>
          <Progress value={(completedActions.length / recommendations.length) * 100} className="mt-2 h-1.5" />
        </div>
      )}

      {/* Compact Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-smart">AI Smart Sort</SelectItem>
              <SelectItem value="impact">By Impact</SelectItem>
              <SelectItem value="effort">By Effort</SelectItem>
              <SelectItem value="ai-visibility">By AI Visibility</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="authority">Authority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ExportDialog 
          trigger={
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Export
            </Button>
          }
          title="Export Optimization Plan"
          description="Export your AI optimization recommendations and progress"
          exportType="report"
        />
      </div>

      {/* Compact Recommendations List */}
      <div className="space-y-2">
        {filteredRecommendations.map((rec) => (
          <Collapsible key={rec.id} open={expandedCards.includes(rec.id)} onOpenChange={() => toggleCardExpansion(rec.id)}>
            <Card className={`transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/30 ${completedActions.includes(rec.id) ? 'bg-success/5 border-success/20' : ''}`}>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={completedActions.includes(rec.id)}
                        onChange={() => handleActionComplete(rec.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5"
                      />
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-foreground">{rec.title}</h4>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-center">
                        <div className="font-medium text-primary">+{rec.aiVisibilityIncrease}%</div>
                        <div className="text-muted-foreground">Impact</div>
                      </div>
                      <div className="flex flex-col items-center">
                        {getEffortIcon(rec.effort)}
                        <span className="text-xs text-muted-foreground mt-1">{rec.timeline}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCards.includes(rec.id) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 pb-3">
                  <div className="space-y-3 ml-6">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(rec.category)}
                        <span className="text-muted-foreground">{rec.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getImpactStars(rec.impact)}
                        <span className="text-muted-foreground ml-1">{rec.impact} Impact</span>
                      </div>
                      <div className="text-muted-foreground">
                        AI Score: {calculateAiScore(rec)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-foreground">Implementation Steps:</h5>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {rec.details.map((detail, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rec.contentGenerable && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => {
                            if (generatedContent[rec.id]) {
                              // If content already exists, directly open chat
                              setChatbotModal({
                                isOpen: true,
                                content: generatedContent[rec.id],
                                title: rec.title
                              });
                            } else {
                              // Generate content and open chat
                              generateAndOpenChat(rec.id);
                            }
                          }}
                          disabled={contentGenerationLoading === rec.id}
                        >
                          {contentGenerationLoading === rec.id ? (
                            <>
                              <Bot className="w-3 h-3 mr-1 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3 mr-1" />
                              {generatedContent[rec.id] ? 'Chat AI Assistant' : 'Get AI Help'}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Quick Wins Section - Only show if there are any */}
      {recommendations.filter(rec => rec.effort === "Low" || rec.timeline.includes("1 week")).length > 0 && (
        <Card className="bg-success/5 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Timer className="w-4 h-4 text-success" />
              <span>Quick Wins</span>
              <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                Start Here
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendations
                .filter(rec => rec.effort === "Low" || rec.timeline.includes("1 week"))
                .slice(0, 4)
                .map((rec) => (
                  <div key={rec.id} className="p-2 bg-background rounded border text-xs">
                    <div className="font-medium text-foreground">{rec.title}</div>
                    <div className="text-muted-foreground mt-1">{rec.timeline} • +{rec.aiVisibilityIncrease}% impact</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Chatbot Modal */}
      <AIChatbotModal
        isOpen={chatbotModal.isOpen}
        onClose={() => setChatbotModal({isOpen: false, content: null, title: ""})}
        generatedContent={chatbotModal.content}
        recommendationTitle={chatbotModal.title}
      />
    </div>
  );
};