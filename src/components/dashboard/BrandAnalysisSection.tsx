
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

export const BrandAnalysisSection = () => {
  const products = [
    {
      name: "Model 3",
      description: "Electric sedan with advanced autopilot capabilities and premium interior",
      aiReadiness: 85,
      url: "/products/model-3",
      issues: ["Missing FAQ section", "Limited structured data"],
      strengths: ["Clear value proposition", "Detailed feature list"],
      trend: "up",
      change: "+2%"
    },
    {
      name: "Model Y",
      description: "Compact SUV with versatile cargo space and all-wheel drive",
      aiReadiness: 72,
      url: "/products/model-y",
      issues: ["Vague product description", "No pricing information"],
      strengths: ["Good use cases", "Customer testimonials"],
      trend: "down",
      change: "-1%"
    },
    {
      name: "Model S",
      description: "Luxury electric vehicle with long range and high performance",
      aiReadiness: 91,
      url: "/products/model-s",
      issues: ["Missing technical specifications"],
      strengths: ["Comprehensive documentation", "Clear ROI examples"],
      trend: "up",
      change: "+5%"
    }
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-3 h-3" />;
    if (score >= 60) return <AlertCircle className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
  };

  return (
    <div className="space-y-4">
      {/* Brand Overview */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-base">Brand AI Readiness Overview</CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Analysis of your website's content optimization for AI consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-xs text-gray-600">Products Identified</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">82%</div>
              <div className="text-xs text-gray-600">Avg AI Readiness</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">47</div>
              <div className="text-xs text-gray-600">Pages Crawled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Analysis */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-900">Product & Service Analysis</h3>
        {products.map((product, index) => (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
                    <span>{product.name}</span>
                    <Button variant="ghost" size="sm" className="p-0.5 text-gray-400 hover:text-gray-600">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="mt-1 text-gray-600 text-sm">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs">
                    {product.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={product.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {product.change}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getReadinessColor(product.aiReadiness)}`}>
                    {getReadinessIcon(product.aiReadiness)}
                    <span className="text-xs font-medium">{product.aiReadiness}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">AI Readiness Score</span>
                    <span className="text-gray-900">{product.aiReadiness}%</span>
                  </div>
                  <Progress value={product.aiReadiness} className="h-1.5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="text-xs font-medium text-green-700 mb-1.5 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Strengths
                    </h4>
                    <ul className="space-y-0.5">
                      {product.strengths.map((strength, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-center">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <h4 className="text-xs font-medium text-orange-700 mb-1.5 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-0.5">
                      {product.issues.map((issue, i) => (
                        <li key={i} className="text-xs text-orange-700 flex items-center">
                          <div className="w-1 h-1 bg-orange-500 rounded-full mr-1.5"></div>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical SEO for AI */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-base">Technical AI Crawlability</CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Technical factors affecting how AI models can access and understand your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Structured Data Coverage</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Good</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Page Load Speed</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Mobile Friendliness</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Perfect</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Content Clarity Score</span>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs px-2 py-0.5">Needs Work</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">FAQ Coverage</span>
                <Badge className="bg-red-100 text-red-700 border-red-300 text-xs px-2 py-0.5">Poor</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Internal Linking</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
