
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, ExternalLink } from "lucide-react";

export const BrandAnalysisSection = () => {
  const products = [
    {
      name: "AI Analytics Suite",
      description: "Advanced analytics platform with machine learning capabilities",
      aiReadiness: 85,
      url: "/products/ai-analytics",
      issues: ["Missing FAQ section", "Limited structured data"],
      strengths: ["Clear value proposition", "Detailed feature list"]
    },
    {
      name: "Data Visualization Tool",
      description: "Interactive dashboard builder for business intelligence",
      aiReadiness: 72,
      url: "/products/data-viz",
      issues: ["Vague product description", "No pricing information"],
      strengths: ["Good use cases", "Customer testimonials"]
    },
    {
      name: "Predictive Modeling Engine",
      description: "Machine learning platform for predictive analytics",
      aiReadiness: 91,
      url: "/products/predictive-ml",
      issues: ["Missing technical specifications"],
      strengths: ["Comprehensive documentation", "Clear ROI examples"]
    }
  ];

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Brand Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Brand AI Readiness Overview</CardTitle>
          <CardDescription>
            Analysis of your website's content optimization for AI consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Products Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">82%</div>
              <div className="text-sm text-gray-600">Avg AI Readiness</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">47</div>
              <div className="text-sm text-gray-600">Pages Crawled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product & Service Analysis</h3>
        {products.map((product, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{product.name}</span>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {product.description}
                  </CardDescription>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getReadinessColor(product.aiReadiness)}`}>
                  {getReadinessIcon(product.aiReadiness)}
                  <span className="text-sm font-medium">{product.aiReadiness}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>AI Readiness Score</span>
                    <span>{product.aiReadiness}%</span>
                  </div>
                  <Progress value={product.aiReadiness} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {product.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {product.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Technical AI Crawlability</CardTitle>
          <CardDescription>
            Technical factors affecting how AI models can access and understand your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Structured Data Coverage</span>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Page Load Speed</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile Friendliness</span>
                <Badge className="bg-green-100 text-green-800">Perfect</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Clarity Score</span>
                <Badge className="bg-yellow-100 text-yellow-800">Needs Work</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">FAQ Coverage</span>
                <Badge className="bg-red-100 text-red-800">Poor</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Internal Linking</span>
                <Badge className="bg-green-100 text-green-800">Good</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
