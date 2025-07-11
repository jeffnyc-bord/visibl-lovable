
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/ui/export-dialog";
import { TrendingUp, TrendingDown, ExternalLink, Target } from "lucide-react";

export const CompetitorSection = () => {
  const competitors = [
    {
      name: "DataViz Pro",
      domain: "datavizpro.com",
      aiVisibility: 89,
      marketShare: 24,
      trend: "up",
      trendValue: 12,
      keyProducts: ["Advanced Charts", "Real-time Dashboards", "API Integration"],
      aiMentions: 342,
      sentiment: 8.4
    },
    {
      name: "Analytics Master",
      domain: "analyticsmaster.io",
      aiVisibility: 76,
      marketShare: 18,
      trend: "down",
      trendValue: -5,
      keyProducts: ["ML Analytics", "Predictive Models", "Custom Reports"],
      aiMentions: 298,
      sentiment: 7.9
    },
    {
      name: "ChartBuilder",
      domain: "chartbuilder.com",
      aiVisibility: 68,
      marketShare: 15,
      trend: "up",
      trendValue: 8,
      keyProducts: ["Drag & Drop Builder", "Templates", "Collaboration Tools"],
      aiMentions: 234,
      sentiment: 7.6
    },
    {
      name: "InsightFlow",
      domain: "insightflow.net",
      aiVisibility: 72,
      marketShare: 12,
      trend: "up",
      trendValue: 15,
      keyProducts: ["Data Pipelines", "Auto Insights", "Mobile Analytics"],
      aiMentions: 189,
      sentiment: 8.1
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Competitive Landscape Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Competitive AI Landscape</span>
          </CardTitle>
          <CardDescription>
            Analysis of key competitors and their AI visibility performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-sm text-gray-600">Key Competitors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">76%</div>
              <div className="text-sm text-gray-600">Avg AI Visibility</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">#7</div>
              <div className="text-sm text-gray-600">Your Ranking</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1,063</div>
              <div className="text-sm text-gray-600">Total AI Mentions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detailed Competitor Analysis</h3>
          <ExportDialog
            trigger={
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            }
            title="Export Competitor Analysis"
            description="Export detailed competitor analysis report in your preferred format."
            exportType="report"
          />
        </div>
        
        {competitors.map((competitor, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{competitor.name}</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription>{competitor.domain}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(competitor.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(competitor.trend)}`}>
                    {competitor.trend === "up" ? "+" : ""}{competitor.trendValue}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">AI Visibility</div>
                  <div className="text-2xl font-bold text-blue-600">{competitor.aiVisibility}%</div>
                  <Progress value={competitor.aiVisibility} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Market Share</div>
                  <div className="text-2xl font-bold text-green-600">{competitor.marketShare}%</div>
                  <Progress value={competitor.marketShare} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">AI Mentions</div>
                  <div className="text-2xl font-bold text-purple-600">{competitor.aiMentions}</div>
                  <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Sentiment</div>
                  <div className="text-2xl font-bold text-orange-600">{competitor.sentiment}/10</div>
                  <div className="text-xs text-gray-500 mt-1">AI responses</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Products & Services</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.keyProducts.map((product, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitive Gaps */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Competitive Opportunities</CardTitle>
          <CardDescription>
            Areas where you can gain advantage over competitors in AI visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-3">Opportunities</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  FAQ sections missing from 75% of competitors
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Limited structured data implementation
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                  Weak content on emerging AI trends
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-3">Threats</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  DataViz Pro gaining AI mention share rapidly
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  InsightFlow improving sentiment scores
                </li>
                <li className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                  Industry moving toward real-time analytics
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
