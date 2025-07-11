
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useState } from "react";

export const RecommendationsSection = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([]);

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
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "content": return <Lightbulb className="w-4 h-4" />;
      case "technical": return <CheckCircle className="w-4 h-4" />;
      case "authority": return <TrendingUp className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const totalImpact = recommendations.reduce((sum, rec) => sum + rec.aiVisibilityIncrease, 0);
  const completedImpact = recommendations
    .filter(rec => completedActions.includes(rec.id))
    .reduce((sum, rec) => sum + rec.aiVisibilityIncrease, 0);

  return (
    <div className="space-y-6">
      {/* Action Plan Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span>AI Search Optimization Plan</span>
          </CardTitle>
          <CardDescription>
            Prioritized recommendations to improve your AI visibility and search optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{recommendations.length}</div>
              <div className="text-sm text-gray-600">Total Actions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedActions.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">+{totalImpact}%</div>
              <div className="text-sm text-gray-600">Potential AI Visibility</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">+{completedImpact}%</div>
              <div className="text-sm text-gray-600">Progress Made</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((completedActions.length / recommendations.length) * 100)}%</span>
            </div>
            <Progress value={(completedActions.length / recommendations.length) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detailed Action Items</h3>
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

        {recommendations.map((rec) => (
          <Card key={rec.id} className={`border-0 shadow-lg transition-all ${
            completedActions.includes(rec.id) ? 'bg-green-50 border-green-200' : 'hover:shadow-xl'
          }`}>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={completedActions.includes(rec.id)}
                  onCheckedChange={() => handleActionComplete(rec.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={`flex items-center space-x-2 ${
                        completedActions.includes(rec.id) ? 'line-through text-gray-500' : ''
                      }`}>
                        {getCategoryIcon(rec.category)}
                        <span>{rec.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {rec.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        +{rec.aiVisibilityIncrease}% AI Visibility
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Effort Level</div>
                  <Badge variant="secondary">{rec.effort}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Expected Impact</div>
                  <Badge variant="secondary">{rec.impact}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Timeline</div>
                  <div className="text-sm font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {rec.timeline}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <Badge variant="outline">{rec.category}</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Action Details</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {rec.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
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
