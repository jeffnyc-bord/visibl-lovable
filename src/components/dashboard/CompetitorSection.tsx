
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/ui/export-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown, ExternalLink, Target, Plus, Filter, BarChart3, LineChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart as RechartsLineChart, Line, Area, AreaChart } from "recharts";
import { useState } from "react";

export const CompetitorSection = () => {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(["DataViz Pro", "Analytics Master", "ChartBuilder"]);
  const [dateRange, setDateRange] = useState("30");
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");

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

  const yourBrand = {
    name: "Your Brand",
    aiVisibility: 65,
    marketShare: 10,
    aiMentions: 156,
    sentiment: 7.2
  };

  // Chart data for AI Visibility comparison
  const visibilityData = [
    { name: "Your Brand", value: yourBrand.aiVisibility },
    ...competitors
      .filter(c => selectedCompetitors.includes(c.name))
      .map(c => ({ name: c.name, value: c.aiVisibility }))
  ];

  // Chart data for mentions over time (mock data)
  const mentionsTimeData = [
    { date: "Week 1", "Your Brand": 35, "DataViz Pro": 85, "Analytics Master": 72, "ChartBuilder": 58 },
    { date: "Week 2", "Your Brand": 42, "DataViz Pro": 88, "Analytics Master": 70, "ChartBuilder": 61 },
    { date: "Week 3", "Your Brand": 38, "DataViz Pro": 92, "Analytics Master": 68, "ChartBuilder": 59 },
    { date: "Week 4", "Your Brand": 41, "DataViz Pro": 95, "Analytics Master": 74, "ChartBuilder": 56 }
  ];

  const handleCompetitorToggle = (competitorName: string) => {
    setSelectedCompetitors(prev => 
      prev.includes(competitorName)
        ? prev.filter(name => name !== competitorName)
        : [...prev, competitorName]
    );
  };

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
            <img src="/lovable-uploads/9ed4aa18-f1e1-454e-9a51-5342807e8e7a.png" alt="Competitive Landscape" className="w-5 h-5" />
            <span>Competitive AI Landscape</span>
          </CardTitle>
          <CardDescription>
            Analysis of key competitors and their AI visibility performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
              <div className="text-sm text-muted-foreground">Key Competitors</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600 mb-1">76%</div>
              <div className="text-sm text-muted-foreground">Avg AI Visibility</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-600 mb-1">#7</div>
              <div className="text-sm text-muted-foreground">Your Ranking</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <LineChart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-600 mb-1">1,063</div>
              <div className="text-sm text-muted-foreground">Total AI Mentions</div>
            </div>
          </div>
          
          {/* Quick trend visualization */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Your Performance vs. Competitors</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Below Average</span>
              <div className="flex-1 mx-4 relative">
                <div className="h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full"></div>
                <div className="absolute top-0 left-[65%] w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-0.5 border-2 border-white shadow-md"></div>
              </div>
              <span className="text-muted-foreground">Above Average</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">Your AI Visibility: 65% (Industry Avg: 76%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Comparison Dashboard */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Competitive Comparison</span>
              </CardTitle>
              <CardDescription>
                Interactive analysis and side-by-side comparison of key metrics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === "table" ? "charts" : "table")}
              >
                {viewMode === "table" ? <LineChart className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                {viewMode === "table" ? "Charts View" : "Table View"}
              </Button>
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
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Select Competitors:</span>
              {competitors.map((competitor) => (
                <div key={competitor.name} className="flex items-center space-x-1">
                  <Checkbox
                    id={competitor.name}
                    checked={selectedCompetitors.includes(competitor.name)}
                    onCheckedChange={() => handleCompetitorToggle(competitor.name)}
                  />
                  <label htmlFor={competitor.name} className="text-xs cursor-pointer">
                    {competitor.name}
                  </label>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Competitor
            </Button>
          </div>

          {viewMode === "table" ? (
            /* Comparison Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Metric</TableHead>
                    <TableHead className="text-center">Your Brand</TableHead>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableHead key={competitor.name} className="text-center">
                          {competitor.name}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AI Visibility</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-blue-600">{yourBrand.aiVisibility}%</span>
                        <Progress value={yourBrand.aiVisibility} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-blue-600">{competitor.aiVisibility}%</span>
                            <Progress value={competitor.aiVisibility} className="w-16 h-2" />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Market Share</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-green-600">{yourBrand.marketShare}%</span>
                        <Progress value={yourBrand.marketShare} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-green-600">{competitor.marketShare}%</span>
                            <Progress value={competitor.marketShare} className="w-16 h-2" />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AI Mentions</TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-purple-600">{yourBrand.aiMentions}</span>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <span className="text-lg font-bold text-purple-600">{competitor.aiMentions}</span>
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sentiment Score</TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-orange-600">{yourBrand.sentiment}/10</span>
                    </TableCell>
                    {competitors
                      .filter(c => selectedCompetitors.includes(c.name))
                      .map(competitor => (
                        <TableCell key={competitor.name} className="text-center">
                          <span className="text-lg font-bold text-orange-600">{competitor.sentiment}/10</span>
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Charts View */
            <div className="space-y-8">
              {/* AI Visibility Comparison Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">AI Visibility Comparison</h4>
                <ChartContainer
                  config={{
                    value: {
                      label: "AI Visibility %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visibilityData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Mentions Trend Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">AI Mentions Trend (Last 30 Days)</h4>
                <ChartContainer
                  config={{
                    "Your Brand": {
                      label: "Your Brand",
                      color: "hsl(var(--chart-1))",
                    },
                    "DataViz Pro": {
                      label: "DataViz Pro",
                      color: "hsl(var(--chart-2))",
                    },
                    "Analytics Master": {
                      label: "Analytics Master", 
                      color: "hsl(var(--chart-3))",
                    },
                    "ChartBuilder": {
                      label: "ChartBuilder",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={mentionsTimeData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="Your Brand" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                      />
                      {selectedCompetitors.includes("DataViz Pro") && (
                        <Line 
                          type="monotone" 
                          dataKey="DataViz Pro" 
                          stroke="hsl(var(--chart-2))" 
                          strokeWidth={2}
                        />
                      )}
                      {selectedCompetitors.includes("Analytics Master") && (
                        <Line 
                          type="monotone" 
                          dataKey="Analytics Master" 
                          stroke="hsl(var(--chart-3))" 
                          strokeWidth={2}
                        />
                      )}
                      {selectedCompetitors.includes("ChartBuilder") && (
                        <Line 
                          type="monotone" 
                          dataKey="ChartBuilder" 
                          stroke="hsl(var(--chart-4))" 
                          strokeWidth={2}
                        />
                      )}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Condensed Competitor Cards */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Competitor Profiles</CardTitle>
          <CardDescription>
            Quick overview of each competitor with detailed analysis links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitors.map((competitor, index) => (
              <Card key={index} className="relative hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{competitor.name}</h4>
                      <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(competitor.trend)}
                      <span className={`text-xs font-medium ${getTrendColor(competitor.trend)}`}>
                        {competitor.trend === "up" ? "+" : ""}{competitor.trendValue}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">AI Visibility</span>
                      <span className="font-medium">{competitor.aiVisibility}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Mentions</span>
                      <span className="font-medium">{competitor.aiMentions}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sentiment</span>
                      <span className="font-medium">{competitor.sentiment}/10</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Full Details
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

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
