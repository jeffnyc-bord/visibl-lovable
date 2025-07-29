
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
import { Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp, Star, Timer, Users, Target, Filter, BarChart3, Gauge, Brain, Sparkles, FileText, Code, Wand2, Bot } from "lucide-react";
import { useState, useEffect } from "react";

export const RecommendationsSection = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("ai-smart");
  const [filterBy, setFilterBy] = useState("all");
  const [aiPrioritizationEnabled, setAiPrioritizationEnabled] = useState(true);
  const [contentGenerationLoading, setContentGenerationLoading] = useState<number | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<number, any>>({});

  const handleActionComplete = (actionId: number) => {
    setCompletedActions(prev => 
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
      {/* AI-Enhanced Action Plan Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Brain className="w-6 h-6 text-primary" />
            <span>AI-Powered Optimization Plan</span>
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </CardTitle>
          <CardDescription>
            Intelligent recommendations prioritized by real-time AI model behavior and competitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-card border">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-1">{recommendations.length}</div>
              <div className="text-sm text-muted-foreground">Total Actions</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-3xl font-bold text-success mb-1">{completedActions.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Gauge className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">+{totalImpact}%</div>
              <div className="text-sm text-muted-foreground">Potential AI Visibility</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <TrendingUp className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-3xl font-bold text-warning mb-1">+{completedImpact}%</div>
              <div className="text-sm text-muted-foreground">Progress Made</div>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="font-medium text-foreground">Overall Progress</span>
              <span className="font-bold text-primary">{Math.round((completedActions.length / recommendations.length) * 100)}%</span>
            </div>
            <Progress value={(completedActions.length / recommendations.length) * 100} className="h-4" />
          </div>
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

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Action Items ({filteredRecommendations.length})</h3>

        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className={`transition-all duration-200 hover:shadow-lg ${
            completedActions.includes(rec.id) 
              ? 'bg-success/5 border-success/20 shadow-sm' 
              : 'bg-card border hover:shadow-xl hover:border-primary/20'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={completedActions.includes(rec.id)}
                  onCheckedChange={() => handleActionComplete(rec.id)}
                  className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className={`flex items-center space-x-3 text-lg ${
                        completedActions.includes(rec.id) ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getCategoryIcon(rec.category)}
                        </div>
                        <span>{rec.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2 text-base leading-relaxed">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={`${getPriorityColor(rec.priority)} border`}>
                        {rec.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">
                        +{rec.aiVisibilityIncrease}% AI Visibility
                      </Badge>
                      {aiPrioritizationEnabled && (
                        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                          <Brain className="w-3 h-3 mr-1" />
                          AI Score: {calculateAiScore(rec)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="ml-10 space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Effort Level</div>
                    <div className="flex items-center space-x-2">
                      {getEffortIcon(rec.effort)}
                      <span className="text-sm font-medium text-muted-foreground">{rec.effort}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Star className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Expected Impact</div>
                    <div className="flex items-center space-x-2">
                      {getImpactStars(rec.impact)}
                      <span className="text-sm font-medium text-muted-foreground">{rec.impact}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Timer className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Timeline</div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {rec.timeline}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights & Implementation Details */}
              <div className="space-y-4">
                {/* AI-driven insights */}
                {aiPrioritizationEnabled && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-primary" />
                      AI Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Competitive Edge:</span>
                        <div className="mt-1">
                          <Progress value={rec.competitiveAdvantage} className="h-2" />
                          <span className="text-xs text-muted-foreground">{rec.competitiveAdvantage}% advantage</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">AI Model Trend:</span>
                        <div className="mt-1">
                          <Progress value={rec.aiModelTrend} className="h-2" />
                          <span className="text-xs text-muted-foreground">{rec.aiModelTrend}% relevance</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Overall AI Score:</span>
                        <div className="mt-1 text-lg font-bold text-primary">{calculateAiScore(rec)}/100</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Generation */}
                {rec.contentGenerable && (
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center">
                        <Wand2 className="w-4 h-4 mr-2 text-accent" />
                        AI Content Generation
                      </h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => !generatedContent[rec.id] && generateContent(rec.id)}
                            disabled={contentGenerationLoading === rec.id}
                          >
                            {contentGenerationLoading === rec.id ? (
                              <>
                                <Bot className="w-4 h-4 mr-2 animate-pulse" />
                                Generating...
                              </>
                            ) : generatedContent[rec.id] ? (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                View Content
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Blueprint
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        {generatedContent[rec.id] && (
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Wand2 className="w-5 h-5 text-accent" />
                                <span>Generated Content: {rec.title}</span>
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
                    <p className="text-sm text-muted-foreground">
                      Generate ready-to-use content blueprints, schema markup, and implementation templates.
                    </p>
                  </div>
                )}

                {/* Implementation Details */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                    Implementation Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {rec.details.map((detail, i) => (
                       <div key={i} className="flex items-start space-x-3 text-sm">
                         <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                         <span className="text-muted-foreground leading-relaxed">{detail}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className="bg-background">
                  {rec.category}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Details
                  </Button>
                  {!completedActions.includes(rec.id) && (
                    <Button size="sm" className="text-xs">
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Wins */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Wins (1-2 weeks)</CardTitle>
          <CardDescription>
            Fast implementation actions for immediate AI visibility improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations
              .filter(rec => rec.effort === "Low" || rec.timeline.includes("1 week"))
              .map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">Quick Win</Badge>
                    <span className="text-sm font-medium text-blue-600">+{rec.aiVisibilityIncrease}%</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
