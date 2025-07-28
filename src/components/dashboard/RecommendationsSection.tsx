
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp, Star, Timer, Users, Target, Filter, BarChart3, Gauge } from "lucide-react";
import { useState } from "react";

export const RecommendationsSection = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("impact");
  const [filterBy, setFilterBy] = useState("all");

  const handleActionComplete = (actionId: number) => {
    setCompletedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
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
      {/* Action Plan Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span>AI Search Optimization Plan</span>
          </CardTitle>
          <CardDescription>
            Prioritized recommendations to improve your AI visibility and search optimization
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
                    <SelectItem value="impact">Highest Impact</SelectItem>
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

              {/* Action Details */}
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
