import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Shield, 
  Globe, 
  Search,
  Code,
  Link,
  Server,
  Zap,
  FileText
} from "lucide-react";

export const TechnicalCrawlabilitySection = () => {
  const crawlMetrics = {
    pagesTotal: 47,
    pagesCrawled: 42,
    pagesIndexed: 38,
    errors: 3,
    avgLoadTime: 1.2,
    coreWebVitals: "Good"
  };

  const structuredDataItems = [
    { type: "Product", pages: 12, status: "valid", coverage: 100 },
    { type: "Organization", pages: 1, status: "valid", coverage: 100 },
    { type: "FAQPage", pages: 0, status: "missing", coverage: 0 },
    { type: "BreadcrumbList", pages: 15, status: "partial", coverage: 65 },
    { type: "Review", pages: 8, status: "valid", coverage: 100 }
  ];

  const technicalIssues = [
    {
      category: "Crawl Errors",
      icon: Server,
      items: [
        { issue: "404 Not Found", count: 2, severity: "medium" },
        { issue: "Server Timeout", count: 1, severity: "high" },
        { issue: "Blocked by robots.txt", count: 0, severity: "low" }
      ]
    },
    {
      category: "Content Issues",
      icon: FileText,
      items: [
        { issue: "Duplicate content", count: 5, severity: "medium" },
        { issue: "Missing meta descriptions", count: 3, severity: "low" },
        { issue: "JavaScript-rendered content", count: 8, severity: "medium" }
      ]
    },
    {
      category: "Internal Linking",
      icon: Link,
      items: [
        { issue: "Orphan pages", count: 2, severity: "high" },
        { issue: "Deep pages (>4 clicks)", count: 7, severity: "medium" },
        { issue: "Broken internal links", count: 1, severity: "high" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "text-green-700 bg-green-50 border-green-200";
      case "partial": return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "missing": return "text-red-700 bg-red-50 border-red-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-700 bg-red-50 border-red-200";
      case "medium": return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-700 bg-blue-50 border-blue-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Crawl Status Overview */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
            <Search className="w-4 h-4 text-blue-500" />
            <span>Crawl Status & Health</span>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Overview of how search engines and AI models can access your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">{crawlMetrics.pagesCrawled}</div>
              <div className="text-xs text-gray-600">Pages Crawled</div>
              <div className="text-xs text-gray-500">of {crawlMetrics.pagesTotal} total</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">{crawlMetrics.pagesIndexed}</div>
              <div className="text-xs text-gray-600">Pages Indexed</div>
              <div className="text-xs text-gray-500">by AI models</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">{crawlMetrics.errors}</div>
              <div className="text-xs text-gray-600">Crawl Errors</div>
              <div className="text-xs text-gray-500">need attention</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">{crawlMetrics.avgLoadTime}s</div>
              <div className="text-xs text-gray-600">Avg Load Time</div>
              <div className="text-xs text-gray-500">Core Web Vitals: {crawlMetrics.coreWebVitals}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Crawl Coverage</span>
              <span className="text-gray-900">{Math.round((crawlMetrics.pagesCrawled / crawlMetrics.pagesTotal) * 100)}%</span>
            </div>
            <Progress value={(crawlMetrics.pagesCrawled / crawlMetrics.pagesTotal) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Structured Data Analysis */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
            <Code className="w-4 h-4 text-purple-500" />
            <span>Structured Data Analysis</span>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Schema.org markup status and recommendations for better AI understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {structuredDataItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                    <Badge className={`${getStatusColor(item.status)} text-xs px-2 py-0.5`}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {item.pages} pages • {item.coverage}% coverage
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.status === "valid" && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {item.status === "partial" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                  {item.status === "missing" && <XCircle className="w-4 h-4 text-red-600" />}
                  <Button variant="ghost" size="sm" className="p-0.5 text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {technicalIssues.map((category, index) => (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-gray-900 text-sm">
                <category.icon className="w-4 h-4 text-gray-500" />
                <span>{category.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex-1">
                      <div className="text-xs text-gray-700">{item.issue}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${getSeverityColor(item.severity)} text-xs px-1.5 py-0.5`}>
                          {item.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.count} instances</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security & Performance */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-gray-900 text-base">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Security & Performance</span>
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Security status and performance metrics affecting AI crawlability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">HTTPS Status</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Secure</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">SSL Certificate</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Valid</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Mixed Content</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">None</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Core Web Vitals</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Good</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Mobile Friendly</span>
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0.5">Yes</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700">Robots.txt</span>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs px-2 py-0.5">Review Needed</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};