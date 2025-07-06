
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

export const BrandAnalysisSection = () => {
  const products = [
    {
      name: "AI Analytics Suite",
      description: "Advanced analytics platform with machine learning capabilities",
      aiReadiness: 85,
      url: "/products/ai-analytics",
      issues: ["Missing FAQ section", "Limited structured data"],
      strengths: ["Clear value proposition", "Detailed feature list"],
      trend: "up",
      change: "+2%"
    },
    {
      name: "Data Visualization Tool",
      description: "Interactive dashboard builder for business intelligence",
      aiReadiness: 72,
      url: "/products/data-viz",
      issues: ["Vague product description", "No pricing information"],
      strengths: ["Good use cases", "Customer testimonials"],
      trend: "down",
      change: "-1%"
    },
    {
      name: "Predictive Modeling Engine",
      description: "Machine learning platform for predictive analytics",
      aiReadiness: 91,
      url: "/products/predictive-ml",
      issues: ["Missing technical specifications"],
      strengths: ["Comprehensive documentation", "Clear ROI examples"],
      trend: "up",
      change: "+5%"
    }
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-900/30 border-green-800";
    if (score >= 60) return "text-yellow-400 bg-yellow-900/30 border-yellow-800";
    return "text-red-400 bg-red-900/30 border-red-800";
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Brand Overview */}
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Brand AI Readiness Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Analysis of your website's content optimization for AI consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <div className="text-sm text-gray-400">Products Identified</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-3xl font-bold text-green-400 mb-2">82%</div>
              <div className="text-sm text-gray-400">Avg AI Readiness</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-3xl font-bold text-purple-400 mb-2">47</div>
              <div className="text-sm text-gray-400">Pages Crawled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Product & Service Analysis</h3>
        {products.map((product, index) => (
          <Card key={index} className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <span>{product.name}</span>
                    <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:text-white">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="mt-1 text-gray-400">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-sm">
                    {product.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={product.trend === "up" ? "text-green-400" : "text-red-400"}>
                      {product.change}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getReadinessColor(product.aiReadiness)}`}>
                    {getReadinessIcon(product.aiReadiness)}
                    <span className="text-sm font-medium">{product.aiReadiness}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">AI Readiness Score</span>
                    <span className="text-white">{product.aiReadiness}%</span>
                  </div>
                  <Progress value={product.aiReadiness} className="h-2 bg-gray-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-800/30">
                    <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {product.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-800/30">
                    <h4 className="text-sm font-medium text-orange-400 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {product.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
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
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Technical AI Crawlability</CardTitle>
          <CardDescription className="text-gray-400">
            Technical factors affecting how AI models can access and understand your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">Structured Data Coverage</span>
                <Badge className="bg-green-900/50 text-green-400 border-green-800">Good</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">Page Load Speed</span>
                <Badge className="bg-green-900/50 text-green-400 border-green-800">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">Mobile Friendliness</span>
                <Badge className="bg-green-900/50 text-green-400 border-green-800">Perfect</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">Content Clarity Score</span>
                <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-800">Needs Work</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">FAQ Coverage</span>
                <Badge className="bg-red-900/50 text-red-400 border-red-800">Poor</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <span className="text-sm text-gray-300">Internal Linking</span>
                <Badge className="bg-green-900/50 text-green-400 border-green-800">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
