import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Zap, Clock, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check, Timer, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BrandData {
  id: string;
  name: string;
  logo: string;
  url: string;
  visibilityScore: number;
  totalMentions: number;
  platformCoverage: number;
  industryRanking: number;
  mentionTrend: string;
  sentimentScore: number;
  lastUpdated: string;
  platforms: Array<{
    name: string;
    mentions: number;
    sentiment: string;
    coverage: number;
    trend: string;
  }>;
  products: Array<{
    id: number;
    name: string;
    category: string;
    visibilityScore: number;
    mentions: number;
    sentiment: string;
    lastOptimized: string;
  }>;
  competitors: Array<{
    name: string;
    visibilityScore: number;
    mentions: number;
    trend: string;
  }>;
}

interface QueriesAndPromptsSectionProps {
  brandData: BrandData;
  prefilledQuery?: string;
  onQueryUsed?: () => void;
}

export const QueriesAndPromptsSection = ({ brandData, prefilledQuery, onQueryUsed }: QueriesAndPromptsSectionProps) => {
  const { toast } = useToast();
  const [customPrompt, setCustomPrompt] = useState(prefilledQuery || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastProgress, setBlastProgress] = useState(0);
  const [showLiveResults, setShowLiveResults] = useState(false);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [activeResultTab, setActiveResultTab] = useState("ChatGPT");
  
  // Prompts tab state
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("all");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});

  // Update prompt when prefilledQuery changes
  useEffect(() => {
    if (prefilledQuery) {
      setCustomPrompt(prefilledQuery);
      onQueryUsed?.();
    }
  }, [prefilledQuery, onQueryUsed]);

  // Mock data for generated queries
  const coreQueries = [
    { query: "Best running shoes for marathon training", relevanceScore: 92, brand: "Nike", mentions: 145 },
    { query: "Nike Air Max vs Adidas Ultraboost", relevanceScore: 88, brand: "Nike", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", relevanceScore: 75, brand: "Nike", mentions: 67 },
    { query: "Best basketball shoes for performance", relevanceScore: 82, brand: "Nike", mentions: 89 },
  ];

  // Mock data for prompt blast history with comprehensive results
  const promptHistory = [
    { 
      id: 1, 
      prompt: "Compare Nike Air Max to Adidas Ultraboost in terms of comfort and performance", 
      timestamp: "2024-01-15 14:30", 
      testDate: "Today",
      totalPlatforms: 4,
      mentionedCount: 3,
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive",
          responseTime: "2.4s",
          response: "The Nike Air Max series offers superior cushioning technology with its Air Max units compared to the Adidas Ultraboost's Boost foam. Nike's design provides better heel support and stability. While the Adidas has responsive energy return, Nike Air Max delivers better performance and comfort for all-day wear."
        },
        {
          platform: "Claude",
          mentioned: true,
          sentiment: "neutral",
          responseTime: "1.8s",
          response: "Both shoes target different athletic needs. Nike Air Max focuses on lifestyle comfort and casual wear, while Adidas Ultraboost emphasizes running performance. Nike has advantage in durability and classic styling."
        },
        {
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive",
          responseTime: "2.1s",
          response: "Nike Air Max leads in several categories: brand heritage, style versatility, and cushioning technology. Adidas Ultraboost offers premium materials and modern design language. For long-term comfort, Nike's Air Max technology provides consistent support."
        },
        {
          platform: "Perplexity",
          mentioned: false,
          sentiment: "neutral",
          responseTime: "1.5s",
          response: "Athletic footwear comparison focuses on comfort, performance, and style. Both German and American manufacturers offer competitive options in this segment with different technology approaches."
        }
      ]
    },
    { 
      id: 2, 
      prompt: "What are the benefits of Nike's sustainable shoe manufacturing?", 
      timestamp: "2024-01-14 16:20", 
      testDate: "Yesterday",
      totalPlatforms: 3,
      mentionedCount: 2,
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive",
          responseTime: "2.1s",
          response: "Nike has been a pioneer in sustainable athletic footwear manufacturing, with their Move to Zero initiative reducing carbon emissions. Nike's use of recycled materials and sustainable practices makes their shoes environmentally responsible."
        },
        {
          platform: "Claude",
          mentioned: true,
          sentiment: "positive",
          responseTime: "1.9s",
          response: "Environmental benefits include reduced waste and lower carbon footprint. Nike's approach to sustainable manufacturing through recycled materials and renewable energy creates a comprehensive eco-friendly production system."
        },
        {
          platform: "Gemini",
          mentioned: false,
          sentiment: "neutral",
          responseTime: "1.7s",
          response: "Athletic footwear companies are increasingly adopting sustainable practices including recycled materials and reduced waste manufacturing processes."
        }
      ]
    }
  ];

  // Mock data for detailed prompts table
  const detailedPrompts = [
    {
      id: 1,
      prompt: "What are the best running shoes for marathon training?",
      fullPrompt: "What are the best running shoes for marathon training? I'm looking for shoes that provide excellent cushioning, durability, and support for long-distance running.",
      platform: "ChatGPT",
      mentioned: true,
      result: "Ranked #1",
      queryType: "Ranking",
      timestamp: "2024-01-20 09:15",
      fullResponse: "For marathon training, here are the top running shoes: 1. Nike Air Zoom Pegasus - Excellent all-around shoe 2. Adidas Ultraboost - Superior energy return 3. Brooks Ghost - Reliable cushioning 4. Hoka Clifton - Maximum comfort..."
    },
    {
      id: 2,
      prompt: "Best basketball shoes for performance and comfort",
      fullPrompt: "What are the best basketball shoes for performance and comfort? Looking for shoes with excellent support and traction.",
      platform: "Claude",
      mentioned: true,
      result: "Positive Mention",
      queryType: "Discovery",
      timestamp: "2024-01-20 08:30",
      fullResponse: "Nike Air Jordan and Nike LeBron series offer excellent basketball performance with superior ankle support and court traction..."
    },
    {
      id: 3,
      prompt: "How does sustainable footwear manufacturing impact the environment?",
      fullPrompt: "How does sustainable footwear manufacturing impact the environment? Please explain the benefits of eco-friendly athletic shoes.",
      platform: "Gemini",
      mentioned: false,
      result: "Not Mentioned",
      queryType: "Factual",
      timestamp: "2024-01-20 07:45",
      fullResponse: "Sustainable footwear manufacturing significantly reduces environmental impact through recycled materials, eco-friendly processes from brands like Adidas and Allbirds..."
    },
    {
      id: 4,
      prompt: "Compare athletic shoe brands by innovation",
      fullPrompt: "Compare athletic shoe brands by innovation and technological advancement in 2024.",
      platform: "Copilot",
      mentioned: true,
      result: "Ranked #1",
      queryType: "Ranking",
      timestamp: "2024-01-19 16:20",
      fullResponse: "Nike leads the athletic footwear industry in innovation with their Air Max technology, React foam, and Nike Adapt self-lacing systems..."
    },
    {
      id: 5,
      prompt: "Best athletic shoes for cross-training",
      fullPrompt: "What are the best athletic shoes for cross-training and versatile workouts?",
      platform: "Perplexity",
      mentioned: true,
      result: "Brand Known",
      queryType: "Discovery",
      timestamp: "2024-01-19 14:10",
      fullResponse: "The best cross-training shoes include Nike Metcon series, Reebok Nano, and Under Armour HOVR for versatile workouts..."
    },
    {
      id: 6,
      prompt: "Smart shoe technology comparison",
      fullPrompt: "Compare smart shoe technology across different manufacturers in the premium segment.",
      platform: "Grok",
      mentioned: false,
      result: "Not Mentioned",
      queryType: "Templated",
      timestamp: "2024-01-19 11:30",
      fullResponse: "Smart shoe technology varies significantly across brands like Adidas, Under Armour, and Puma, offering different approaches to fitness tracking..."
    }
  ];

  // Filter prompts based on selected filters
  const filteredPrompts = detailedPrompts.filter(prompt => {
    const platformMatch = platformFilter === "all" || prompt.platform === platformFilter;
    const mentionMatch = mentionFilter === "all" || 
      (mentionFilter === "mentioned" && prompt.mentioned) ||
      (mentionFilter === "not-mentioned" && !prompt.mentioned);
    const queryTypeMatch = queryTypeFilter === "all" || prompt.queryType === queryTypeFilter;
    
    return platformMatch && mentionMatch && queryTypeMatch;
  });

  const aiPlatforms = [
    { id: "chatgpt", name: "ChatGPT", color: "bg-green-500" },
    { id: "claude", name: "Claude", color: "bg-orange-500" },
    { id: "gemini", name: "Gemini", color: "bg-blue-500" },
    { id: "perplexity", name: "Perplexity", color: "bg-purple-500" },
    { id: "grok", name: "Grok", color: "bg-pink-500" },
    { id: "copilot", name: "Copilot", color: "bg-indigo-500" },
    { id: "google-ai", name: "Google AI Mode", color: "bg-red-500" },
    { id: "overviews", name: "Google Overviews", color: "bg-yellow-500" }
  ];

  // Mock data for AI platform mentions from generated queries
  const platformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 28 },
    { platform: "Claude", mentions: 324, percentage: 20 },
    { platform: "Gemini", mentions: 287, percentage: 18 },
    { platform: "Perplexity", mentions: 180, percentage: 11 },
    { platform: "Grok", mentions: 145, percentage: 9 },
    { platform: "Copilot", mentions: 123, percentage: 8 },
    { platform: "Google AI Mode", mentions: 98, percentage: 6 },
    { platform: "Google Overviews", mentions: 87, percentage: 5 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(220, 14%, 69%)', 'hsl(220, 14%, 83%)'];

  const handlePromptBlast = () => {
    if (!customPrompt.trim() || selectedPlatforms.length === 0) return;
    
    setIsBlasting(true);
    setBlastProgress(0);
    setShowLiveResults(false);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setBlastProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 400);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setBlastProgress(100);
      
      // Mock live results
      const mockResults = selectedPlatforms.map(platform => ({
        platform,
        mentioned: Math.random() > 0.3,
        sentiment: Math.random() > 0.5 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative",
        responseTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
        response: `Mock response from ${platform} for the prompt: "${customPrompt.slice(0, 50)}..."`
      }));
      
      setLiveResults(mockResults);
      setActiveResultTab(selectedPlatforms[0]);
      
      setTimeout(() => {
        setIsBlasting(false);
        setBlastProgress(0);
        setShowLiveResults(true);
        toast({
          title: "Prompt Blast Complete",
          description: `Successfully tested prompt across ${selectedPlatforms.length} AI platforms.`,
        });
      }, 1000);
    }, 5000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case "negative": return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isBlasting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Blasting Prompt...
                </h3>
                <p className="text-gray-600 text-sm">
                  Testing your prompt across {selectedPlatforms.length} AI platforms...
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(blastProgress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {blastProgress < 25 ? "Preparing queries..." :
                   blastProgress < 50 ? "Sending to AI platforms..." :
                   blastProgress < 75 ? "Collecting responses..." :
                   "Analyzing results..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    <Tabs defaultValue="blast" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="blast">Prompt Blast Lab</TabsTrigger>
        <TabsTrigger value="prompts">Prompts Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="blast" className="space-y-6">
        {/* Modern Prompt Blast Workspace */}
        <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
          <CardHeader className="bg-gray-50/50">
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <img src="/lovable-uploads/31ceee67-302b-4950-8dcf-30088590bd21.png" alt="AI Testing Workspace" className="w-5 h-5" />
              </div>
              <span>AI Testing Workspace</span>
            </CardTitle>
            <CardDescription>
              Test custom prompts across multiple AI platforms in real-time and compare responses instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Your Test Prompt
              </label>
              <Textarea
                placeholder="Example: 'Compare Nike to other athletic footwear brands in terms of innovation and market leadership...'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="w-full resize-none border-2 border-gray-200 focus:border-purple-400 rounded-xl p-4 text-base"
              />
              <p className="text-xs text-gray-500">
                Write a detailed prompt to get comprehensive responses from AI platforms.
              </p>
            </div>
            
            {/* Platform Selection Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  Select AI Platforms
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allPlatformNames = aiPlatforms.map(p => p.name);
                    if (selectedPlatforms.length === allPlatformNames.length) {
                      setSelectedPlatforms([]);
                    } else {
                      setSelectedPlatforms([...allPlatformNames]);
                    }
                  }}
                  className="text-xs h-7"
                >
                  {selectedPlatforms.length === aiPlatforms.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aiPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlatforms.includes(platform.name)
                        ? 'border-purple-400 bg-purple-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selectedPlatforms.includes(platform.name)) {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.name));
                      } else {
                        setSelectedPlatforms([...selectedPlatforms, platform.name]);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    {selectedPlatforms.includes(platform.name) && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {selectedPlatforms.length} of {aiPlatforms.length} platforms
              </p>
            </div>

            {/* Blast Button */}
            <Button 
              onClick={handlePromptBlast}
              disabled={!customPrompt.trim() || selectedPlatforms.length === 0 || isBlasting}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-3" />
              {isBlasting ? "Testing in Progress..." : `Blast to ${selectedPlatforms.length} Platforms`}
            </Button>
          </CardContent>
        </Card>

        {/* Live Results View */}
        {showLiveResults && liveResults.length > 0 && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span>Live Results</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {liveResults.filter(r => r.mentioned).length}/{liveResults.length} Mentioned
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time responses from AI platforms for your test prompt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
                  {liveResults.map((result) => (
                    <TabsTrigger 
                      key={result.platform} 
                      value={result.platform}
                      className="flex items-center space-x-2"
                    >
                      <span>{result.platform}</span>
                      {result.mentioned ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <X className="w-3 h-3 text-red-600" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {liveResults.map((result) => (
                  <TabsContent key={result.platform} value={result.platform} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        {result.mentioned ? (
                          <Badge className="bg-green-100 text-green-800">Mentioned</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">Not Mentioned</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Sentiment:</span>
                        <div className="flex items-center space-x-1">
                          {getSentimentIcon(result.sentiment)}
                          <Badge variant="secondary" className={getSentimentColor(result.sentiment)}>
                            {result.sentiment}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{result.responseTime}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="w-fit">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{result.response}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Prompt History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-orange-500" />
              <span>Test History</span>
            </CardTitle>
            <CardDescription>
              Previous prompt tests with detailed platform-by-platform results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promptHistory.map((item) => (
                <Collapsible key={item.id} open={expandedHistory === item.id} onOpenChange={(open) => setExpandedHistory(open ? item.id : null)}>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">{item.prompt}</p>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.testDate}
                              </span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {item.mentionedCount}/{item.totalPlatforms} Mentioned
                              </Badge>
                              <span className="text-xs text-gray-400">{item.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                            {expandedHistory === item.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="grid gap-4">
                          {item.results.map((result, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline">{result.platform}</Badge>
                                  {result.mentioned ? (
                                    <Badge className="bg-green-100 text-green-800">Mentioned</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="bg-red-100 text-red-800">Not Mentioned</Badge>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    {getSentimentIcon(result.sentiment)}
                                    <span className="text-xs text-gray-600 capitalize">{result.sentiment}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Timer className="w-3 h-3" />
                                  <span>{result.responseTime}</span>
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded p-3">
                                <p className="text-sm text-gray-700">{result.response}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prompts" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <img src="/lovable-uploads/d065101f-8248-41db-a466-8cd39c5a5533.png" alt="Terminal" className="w-5 h-5" />
              <span>Prompts Analysis</span>
            </CardTitle>
            <CardDescription>
              Detailed view of queries used to assess your brand's AI visibility across platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="AI Platform" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">All Platforms</SelectItem>
                  {aiPlatforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.name}>{platform.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mentionFilter} onValueChange={setMentionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Mention Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="mentioned">Only Mentioned</SelectItem>
                  <SelectItem value="not-mentioned">Only Not Mentioned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={queryTypeFilter} onValueChange={setQueryTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Query Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Ranking">Ranking</SelectItem>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="Factual">Factual</SelectItem>
                  <SelectItem value="Templated">Templated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prompts Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Prompt</TableHead>
                    <TableHead className="font-semibold">Platform</TableHead>
                    <TableHead className="font-semibold">Result</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.map((prompt) => (
                    <>
                      <TableRow key={prompt.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{prompt.prompt}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 h-6 px-2 text-xs"
                              onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}
                            >
                              {expandedPrompt === prompt.id ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  View Details
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{prompt.platform}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {prompt.mentioned ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm">{prompt.result}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {prompt.queryType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(prompt.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable row content */}
                      {expandedPrompt === prompt.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-gray-50 p-0">
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Full Prompt:</h4>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                  {prompt.fullPrompt}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                  {prompt.fullResponse}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </>
  );
};
