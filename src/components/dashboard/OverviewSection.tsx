
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Brain, Search, Target } from "lucide-react";

export const OverviewSection = () => {
  return (
    <div className="space-y-6">
      {/* GSEO Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Visibility Score</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">72/100</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
            <Progress value={72} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Discoverability</CardTitle>
            <Search className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">68%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </p>
            <Progress value={68} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry AI Ranking</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">#7</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2 positions
            </p>
            <div className="text-xs text-purple-600 mt-1">out of 45 competitors</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Citation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">34%</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
            <div className="text-xs text-orange-600 mt-1">of relevant AI responses</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>AI Visibility Breakdown</CardTitle>
            <CardDescription>How your brand appears in AI-generated content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Product Mentions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">245</span>
                <Badge variant="secondary" className="text-xs">+18%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Brand Citations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">156</span>
                <Badge variant="secondary" className="text-xs">+12%</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Topic Authority</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">High</span>
                <Badge variant="secondary" className="text-xs">+2 levels</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Sentiment Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">8.2/10</span>
                <Badge variant="secondary" className="text-xs">+0.3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Top AI Sources</CardTitle>
            <CardDescription>Domains most frequently citing your brand in AI responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <span className="text-sm font-medium">techcrunch.com</span>
              </div>
              <Badge variant="outline">127 citations</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <span className="text-sm font-medium">forbes.com</span>
              </div>
              <Badge variant="outline">89 citations</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">3</span>
                </div>
                <span className="text-sm font-medium">venturebeat.com</span>
              </div>
              <Badge variant="outline">76 citations</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-600">4</span>
                </div>
                <span className="text-sm font-medium">businessinsider.com</span>
              </div>
              <Badge variant="outline">54 citations</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
