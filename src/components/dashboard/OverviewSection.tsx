
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "@/components/ui/export-dialog";
import { TrendingUp, TrendingDown, Brain, Search, Target, Download } from "lucide-react";

export const OverviewSection = () => {
  const visibilityData = [
    { date: "17 Feb", tesla: 15, hyundai: 12 },
    { date: "18 Feb", tesla: 25, hyundai: 20 },
    { date: "19 Feb", tesla: 35, hyundai: 32 },
    { date: "20 Feb", tesla: 32, hyundai: 38 },
    { date: "21 Feb", tesla: 42, hyundai: 35 },
    { date: "22 Feb", tesla: 38, hyundai: 40 },
  ];

  const industryRanking = [
    { rank: 1, brand: "Hyundai", visibility: "39%", change: "+4%", trend: "up", prevRank: 3 },
    { rank: 2, brand: "Tesla", visibility: "33%", change: "-1%", trend: "down", prevRank: 1 },
    { rank: 3, brand: "BMW", visibility: "24%", change: "-6%", trend: "down", prevRank: 2 },
    { rank: 4, brand: "Ford", visibility: "23%", change: "0%", trend: "neutral", prevRank: 4 },
    { rank: 5, brand: "Jeep", visibility: "20%", change: "-2%", trend: "down", prevRank: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Visibility Score</CardTitle>
            <img src="/lovable-uploads/080bc80f-9dc7-491f-8a51-b6156f660dde.png" alt="AI Visibility Score" className="h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-gray-900">72/100</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
            <Progress value={72} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Product Discoverability</CardTitle>
            <Search className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-gray-900">68%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </p>
            <Progress value={68} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Industry AI Ranking</CardTitle>
            <img src="/lovable-uploads/6d96032a-5e62-4e84-b278-3c492029f934.png" alt="Industry AI Ranking" className="h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-gray-900">#2</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1 position
            </p>
            <div className="text-xs text-gray-500 mt-1">out of 45 competitors</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">AI Citation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold text-gray-900">33%</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1% from last month
            </p>
            <div className="text-xs text-gray-500 mt-1">of relevant AI responses</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visibility Chart */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Visibility</CardTitle>
                <CardDescription className="text-gray-600">Brands with the highest visibility</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-xs">Line View</Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">Bar View</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Tesla</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                <span className="text-sm font-medium">Hyundai</span>
              </div>
            </div>
            
            {/* Simple chart representation */}
            <div className="h-64 flex items-end space-x-8 border-b border-l border-gray-200 p-4">
              {visibilityData.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1 h-40 justify-end">
                    <div 
                      className="w-4 bg-red-500 rounded-t"
                      style={{ height: `${item.tesla * 2}px` }}
                    ></div>
                    <div 
                      className="w-4 bg-gray-800 rounded-t"
                      style={{ height: `${item.hyundai * 2}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>60%</span>
            </div>
          </CardContent>
        </Card>

        {/* Industry Ranking */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Industry ranking</CardTitle>
                <CardDescription className="text-gray-600">Brands with the highest visibility</CardDescription>
              </div>
              <ExportDialog
                trigger={
                  <Button variant="ghost" size="sm" className="text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                }
                title="Export Industry Ranking"
                description="Export the industry ranking data in your preferred format."
                exportType="data"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b border-gray-100">
                <span>#</span>
                <span>Brand</span>
                <span>Visibility</span>
                <span>Previous Rank</span>
              </div>
              
              {industryRanking.map((item) => (
                <div key={item.rank} className="grid grid-cols-4 gap-4 items-center py-2">
                  <span className="text-sm font-medium text-gray-900">{item.rank}</span>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${
                      item.brand === 'Tesla' ? 'bg-red-500' : 
                      item.brand === 'Hyundai' ? 'bg-gray-800' :
                      item.brand === 'BMW' ? 'bg-blue-500' :
                      item.brand === 'Ford' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {item.brand.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.brand}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">{item.visibility}</span>
                    <span className={`text-xs flex items-center ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                       item.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                      {item.change}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">#</span>
                    <span className="text-sm font-medium text-gray-900 ml-1">{item.prevRank}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Mentions */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Recent Tesla Mentions</CardTitle>
              <CardDescription className="text-gray-600">Chats that mentioned Tesla</CardDescription>
            </div>
            <ExportDialog
              trigger={
                <Button variant="ghost" size="sm" className="text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              }
              title="Export Recent Mentions"
              description="Export recent mentions data in your preferred format."
              exportType="data"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">🤖</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Best new car deals with government incentives?</h4>
                  <span className="text-xs text-gray-500">1 hr ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium"># 3rd position</span> • Tesla offers significant rebates on their model 3 and model y, qualifying for the full federal tax credit.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
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
