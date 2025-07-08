
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Globe, 
  TrendingUp, 
  Calendar,
  Settings,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Target,
  Building
} from "lucide-react";

export const BrandManagementSection = () => {
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "Tesla Motors",
      url: "tesla.com",
      type: "deep",
      status: "Active",
      visibilityScore: 91,
      reportFrequency: "Daily",
      lastReport: "2 hours ago",
      tier: "Primary Brand"
    },
    {
      id: 2,
      name: "Ford Motor Company",
      url: "ford.com",
      type: "competitor",
      status: "Active",
      visibilityScore: 78,
      reportFrequency: "Weekly",
      lastReport: "3 days ago",
      tier: "Competitor"
    },
    {
      id: 3,
      name: "General Motors",
      url: "gm.com",
      type: "competitor",
      status: "Active",
      visibilityScore: 72,
      reportFrequency: "Bi-weekly",
      lastReport: "1 week ago",
      tier: "Competitor"
    }
  ]);

  const getTypeColor = (type: string) => {
    return type === "deep" 
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Paused": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const deepTrackedCount = brands.filter(b => b.type === "deep").length;
  const competitorCount = brands.filter(b => b.type === "competitor").length;

  return (
    <div className="space-y-6">
      {/* Brand Limits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{deepTrackedCount}/3</p>
                  <p className="text-xs text-gray-600">Deep Tracked Brands</p>
                </div>
              </div>
              <Progress value={(deepTrackedCount / 3) * 100} className="w-16 h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{competitorCount}/10</p>
                  <p className="text-xs text-gray-600">Competitor Brands</p>
                </div>
              </div>
              <Progress value={(competitorCount / 10) * 100} className="w-16 h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {Math.round(brands.reduce((sum, brand) => sum + brand.visibilityScore, 0) / brands.length)}%
                </p>
                <p className="text-xs text-gray-600">Avg Visibility Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Brand */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Add New Brand</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Track your own brands deeply or monitor competitors for insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Enter website URL" className="h-9" />
            
            <Select>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Brand Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deep">Deep Tracked (Own Brand)</SelectItem>
                <SelectItem value="competitor">Competitor/Curiosity</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Report Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Brands List */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900">Tracked Brands</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Manage all your tracked brands and their analysis settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{brand.name}</h3>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600">{brand.url}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs px-2 py-0.5 ${getTypeColor(brand.type)}`}>
                      {brand.type === "deep" ? "Deep Tracked" : "Competitor"}
                    </Badge>
                    <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(brand.status)}`}>
                      {brand.status}
                    </Badge>
                  </div>
                  
                  <div className="text-right text-xs">
                    <p className="text-gray-900 font-medium">AI Visibility: {brand.visibilityScore}%</p>
                    <p className="text-gray-600">Reports: {brand.reportFrequency}</p>
                  </div>
                  
                  <div className="text-right text-xs">
                    <p className="text-gray-600">Last report</p>
                    <p className="text-gray-900">{brand.lastReport}</p>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Tier Info */}
      <Card className="shadow-sm border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">Professional Plan</h3>
              <p className="text-xs text-gray-600">
                You're using {deepTrackedCount}/3 deep tracked brands and {competitorCount}/10 competitor slots
              </p>
            </div>
            <Button variant="outline" className="text-sm h-8">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
