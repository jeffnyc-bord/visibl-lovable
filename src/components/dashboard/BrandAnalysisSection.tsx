
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, ExternalLink, TrendingUp, TrendingDown, Zap } from "lucide-react";

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
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-8">
      {/* Brand Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-gray-900 text-xl">Brand AI Readiness Overview</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-base">
            Analysis of your website's content optimization for AI consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-white/60 border border-white/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-blue-600 mb-3">3</div>
              <div className="text-sm font-medium text-gray-600">Products Identified</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/60 border border-white/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-emerald-600 mb-3">82%</div>
              <div className="text-sm font-medium text-gray-600">Avg AI Readiness</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/60 border border-white/50 backdrop-blur-sm">
              <div className="text-4xl font-bold text-purple-600 mb-3">47</div>
              <div className="text-sm font-medium text-gray-600">Pages Crawled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Analysis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Product & Service Analysis</h3>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            3 products analyzed
          </Badge>
        </div>
        
        {products.map((product, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-3 text-gray-900 mb-2">
                    <span className="text-lg">{product.name}</span>
                    <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4 ml-6">
                  <div className="flex items-center space-x-2 text-sm">
                    {product.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-medium ${product.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                      {product.change}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 ${getReadinessColor(product.aiReadiness)}`}>
                    {getReadinessIcon(product.aiReadiness)}
                    <span className="text-sm font-bold">{product.aiReadiness}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-600 font-medium">AI Readiness Score</span>
                    <span className="text-gray-900 font-bold">{product.aiReadiness}%</span>
                  </div>
                  <Progress value={product.aiReadiness} className="h-3 bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {product.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-emerald-700 flex items-start">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-100">
                    <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {product.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-amber-700 flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{issue}</span>
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
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-gray-900 text-xl">Technical AI Crawlability</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-base">
            Technical factors affecting how AI models can access and understand your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Structured Data Coverage</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Good</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Page Load Speed</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Mobile Friendliness</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Perfect</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Content Clarity Score</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Needs Work</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">FAQ Coverage</span>
                <Badge className="bg-red-100 text-red-700 border-red-200">Poor</Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-medium text-gray-700">Internal Linking</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
