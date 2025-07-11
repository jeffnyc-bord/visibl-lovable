import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  ExternalLink, 
  Eye, 
  Globe, 
  Link, 
  Search, 
  Shield, 
  TrendingUp, 
  XCircle,
  Zap
} from "lucide-react";

export const TechnicalCrawlabilitySection = () => {
  return (
    <div className="space-y-6">
      {/* Technical AI Crawlability */}
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
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span>Technical AI Crawlability Score</span>
          </CardTitle>
          <CardDescription>
            Overall assessment of how well your site supports AI crawling and understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Health Score</span>
                <span className="text-2xl font-bold text-green-600">87/100</span>
              </div>
              <Progress value={87} className="h-3" />
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">92</div>
              <div className="text-xs text-gray-500">Crawl Health</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">75</div>
              <div className="text-xs text-gray-500">Schema Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">89</div>
              <div className="text-xs text-gray-500">Accessibility</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">95</div>
              <div className="text-xs text-gray-500">Security</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crawl Status & Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Crawl Status & Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1,247</div>
                <div className="text-sm text-gray-600">Pages Crawled</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,198</div>
                <div className="text-sm text-gray-600">AI Indexed</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Successful crawls</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">96.1%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">404 Errors</span>
                </div>
                <Badge variant="destructive">23 pages</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Server Errors (5xx)</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">7 pages</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Avg. Page Speed</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">2.3s</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structured Data Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-600" />
              <span>Schema Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Organization Schema</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Valid</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Product Schema</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">89% coverage</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">FAQ Schema</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">Missing</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Breadcrumb Schema</span>
                </div>
                <Badge variant="destructive">Not found</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Review Schema</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Valid</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Schema Implementation</span>
                <span className="text-sm font-bold">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Content Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Content Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">JavaScript Rendering</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Optimal</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Hidden Content</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">12 issues</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Duplicate Content</span>
                </div>
                <Badge variant="destructive">45 pages</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Canonicalization</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Proper</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Core Web Vitals</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internal Linking & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link className="w-4 h-4 text-cyan-600" />
              <span>Internal Linking & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Site Architecture</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Depth: 4 levels</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Orphan Pages</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">8 pages</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">Internal Links</span>
                </div>
                <Badge variant="secondary">4,627 total</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">HTTPS Status</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">100% Secure</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">SSL Certificate</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Valid</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crawl Errors Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Critical Crawl Errors</span>
          </CardTitle>
          <CardDescription>
            Issues that may prevent AI models from properly indexing your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium">404 Not Found</span>
                </div>
                <Badge variant="destructive">23 pages</Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Product pages returning 404 errors, preventing AI indexing
              </div>
              <div className="text-xs text-gray-500">
                Top affected: /products/model-s, /products/cybertruck, /products/solar-panels
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Robots.txt Blocking</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">12 resources</Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                CSS and JS files blocked from crawling, affecting page understanding
              </div>
              <div className="text-xs text-gray-500">
                Blocked: /assets/main.css, /js/product-viewer.js, /assets/fonts/
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Slow Loading Pages</span>
                </div>
                <Badge className="bg-orange-100 text-orange-800">18 pages</Badge>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Pages loading slower than 3 seconds may timeout during AI crawling
              </div>
              <div className="text-xs text-gray-500">
                Slowest: /configurator (5.2s), /gallery (4.8s), /compare (4.1s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};