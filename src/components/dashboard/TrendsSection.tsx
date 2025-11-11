
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, Search, HelpCircle } from "lucide-react";
import { useState } from "react";

export const TrendsSection = ({ demoMode = false }: { demoMode?: boolean }) => {
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const trends = [
    {
      topic: "Real-time Analytics",
      growth: 45,
      aiMentions: 2847,
      relevance: "High",
      description: "Increasing demand for instant data processing and visualization",
      keywords: ["real-time", "live data", "instant analytics", "streaming"]
    },
    {
      topic: "AI-Powered Insights",
      growth: 67,
      aiMentions: 3521,
      relevance: "Very High",
      description: "Integration of machine learning for automated data insights",
      keywords: ["AI insights", "automated analysis", "smart recommendations"]
    },
    {
      topic: "Low-Code Analytics",
      growth: 38,
      aiMentions: 1965,
      relevance: "Medium",
      description: "Democratization of analytics through visual, code-free interfaces",
      keywords: ["drag and drop", "visual builder", "no-code", "citizen developer"]
    },
    {
      topic: "Embedded Analytics",
      growth: 29,
      aiMentions: 1432,
      relevance: "High",
      description: "Integration of analytics directly into business applications",
      keywords: ["embedded", "white-label", "integration", "API-first"]
    }
  ];

  const aiQuestions = [
    {
      question: "What's the best real-time analytics platform for startups?",
      frequency: 234,
      currentAnswer: "Limited brand mention",
      opportunity: "High"
    },
    {
      question: "How to choose between different data visualization tools?",
      frequency: 189,
      currentAnswer: "Competitor focused",
      opportunity: "Medium"
    },
    {
      question: "What are the benefits of AI-powered analytics?",
      frequency: 156,
      currentAnswer: "Generic responses",
      opportunity: "High"
    },
    {
      question: "Best practices for embedding analytics in SaaS apps?",
      frequency: 142,
      currentAnswer: "No brand mention",
      opportunity: "Very High"
    }
  ];

  const getRelevanceColor = (relevance: string) => {
    switch (relevance.toLowerCase()) {
      case "very high": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity.toLowerCase()) {
      case "very high": return "bg-green-100 text-green-800";
      case "high": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Market Trends */}
      <Card className="border-0 shadow-lg group relative" onMouseLeave={() => setShowTooltips({...showTooltips, trends: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>AI Market Trends</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, trends: !showTooltips.trends})}
              />
              {showTooltips.trends && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Current and emerging trends in your industry as discussed by AI models, showing growth rates and mention frequency.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Current and emerging trends in your industry as discussed by AI models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {trends.map((trend, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{trend.topic}</h4>
                    <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                  </div>
                  <Badge className={getRelevanceColor(trend.relevance)}>
                    {trend.relevance}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">+{trend.growth}%</span>
                      <Progress value={trend.growth} className="flex-1 h-2" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">AI Mentions</div>
                    <div className="text-lg font-bold text-blue-600">{trend.aiMentions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Related Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {trend.keywords.slice(0, 2).map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {trend.keywords.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{trend.keywords.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Answer Gaps */}
      <Card className="border-0 shadow-lg group relative" onMouseLeave={() => setShowTooltips({...showTooltips, gaps: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Answer Gaps</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, gaps: !showTooltips.gaps})}
              />
              {showTooltips.gaps && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>Questions AI users ask where your brand could provide better answers, ranked by opportunity level and query frequency.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Questions AI users ask where your brand could provide better answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiQuestions.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1 pr-4">{item.question}</h4>
                  <Badge className={getOpportunityColor(item.opportunity)}>
                    {item.opportunity}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Query Frequency: </span>
                    <span className="font-medium">{item.frequency}/month</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current AI Answer: </span>
                    <span className="font-medium text-orange-600">{item.currentAnswer}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Opportunity Level: </span>
                    <span className="font-medium">{item.opportunity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emerging Keywords */}
      <Card className="border-0 shadow-lg group relative" onMouseLeave={() => setShowTooltips({...showTooltips, keywords: false})}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-green-600" />
              <span>Emerging Keyword Clusters</span>
            </div>
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={() => setShowTooltips({...showTooltips, keywords: !showTooltips.keywords})}
              />
              {showTooltips.keywords && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-popover border rounded-md shadow-md">
                  <p>New keyword patterns emerging in AI responses relevant to your industry, showing both rising and declining trends.</p>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            New keyword patterns emerging in AI responses relevant to your industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rising Keywords</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">conversational analytics</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={78} className="w-20 h-2" />
                    <span className="text-xs text-green-600">+78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">self-service BI</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="text-xs text-green-600">+65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">augmented analytics</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={52} className="w-20 h-2" />
                    <span className="text-xs text-green-600">+52%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Declining Keywords</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">traditional reporting</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={25} className="w-20 h-2" />
                    <span className="text-xs text-red-600">-25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">static dashboards</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={18} className="w-20 h-2" />
                    <span className="text-xs text-red-600">-18%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">manual data analysis</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={33} className="w-20 h-2" />
                    <span className="text-xs text-red-600">-33%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
