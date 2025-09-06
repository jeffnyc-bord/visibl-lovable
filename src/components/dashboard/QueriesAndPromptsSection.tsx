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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Zap, Clock, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check, Timer, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle, AlertCircle, RefreshCw, ExternalLink, AlertTriangle, Loader2, Plus, Trash2, Lightbulb, Calendar, ArrowUpDown } from "lucide-react";
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
  
  // Platform-specific error states
  const [platformStates, setPlatformStates] = useState<{
    [key: string]: 'idle' | 'loading' | 'success' | 'error' | 'rate-limited' | 'prompt-rejected'
  }>({});
  const [platformErrors, setPlatformErrors] = useState<{[key: string]: string}>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showNoSelectionWarning, setShowNoSelectionWarning] = useState(false);
  
  // Dashboard state
  const [sortBy, setSortBy] = useState<'mentions' | 'date'>('mentions');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddPromptDialog, setShowAddPromptDialog] = useState(false);
  const [showSuggestPromptsDialog, setShowSuggestPromptsDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("all");

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

  // Mock data for dashboard prompts
  const dashboardPrompts = [
    {
      id: 1,
      prompt: "What are the best running shoes for marathon training?",
      date: "2024-01-20",
      mentions: 127,
      topPlatforms: ["ChatGPT", "Claude", "Gemini"],
      type: "Visibl Generated",
      isGenerated: true
    },
    {
      id: 2,
      prompt: "Best basketball shoes for performance and comfort",
      date: "2024-01-19",
      mentions: 95,
      topPlatforms: ["ChatGPT", "Perplexity"],
      type: "User Added",
      isGenerated: false
    },
    {
      id: 3,
      prompt: "Compare athletic shoe brands by innovation",
      date: "2024-01-19",
      mentions: 84,
      topPlatforms: ["Claude", "Gemini", "Copilot"],
      type: "Visibl Generated",
      isGenerated: true
    },
    {
      id: 4,
      prompt: "How does sustainable footwear manufacturing impact the environment?",
      date: "2024-01-18",
      mentions: 73,
      topPlatforms: ["Gemini"],
      type: "User Added",
      isGenerated: false
    },
    {
      id: 5,
      prompt: "Best athletic shoes for cross-training",
      date: "2024-01-18",
      mentions: 67,
      topPlatforms: ["Perplexity", "ChatGPT"],
      type: "Visibl Generated",
      isGenerated: true
    },
    {
      id: 6,
      prompt: "Smart shoe technology comparison",
      date: "2024-01-17",
      mentions: 52,
      topPlatforms: ["Grok"],
      type: "User Added",
      isGenerated: false
    }
  ];

  // Mock data for prompts in queue
  const queuedPrompts = [
    {
      id: 101,
      prompt: "What are the most comfortable walking shoes for all-day wear?",
      submittedDate: "2024-01-21 10:30",
      status: "processing"
    },
    {
      id: 102,
      prompt: "Compare Nike vs Adidas running shoe technologies",
      submittedDate: "2024-01-21 09:15",
      status: "queued"
    },
    {
      id: 103,
      prompt: "Best eco-friendly athletic footwear brands",
      submittedDate: "2024-01-21 08:45",
      status: "queued"
    }
  ];

  // Filter and sort dashboard prompts
  const filteredDashboardPrompts = dashboardPrompts
    .filter(prompt => {
      const dateMatch = dateFilter === "all" || 
        (dateFilter === "today" && prompt.date === "2024-01-20") ||
        (dateFilter === "week" && new Date(prompt.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === "month" && new Date(prompt.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      
      const typeMatch = typeFilter === "all" || 
        (typeFilter === "generated" && prompt.isGenerated) ||
        (typeFilter === "user" && !prompt.isGenerated);
      
      return dateMatch && typeMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'mentions') {
        return sortOrder === 'desc' ? b.mentions - a.mentions : a.mentions - b.mentions;
      } else {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
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
    if (!customPrompt.trim()) {
      setShowNoSelectionWarning(true);
      setTimeout(() => setShowNoSelectionWarning(false), 3000);
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      setShowNoSelectionWarning(true);
      setTimeout(() => setShowNoSelectionWarning(false), 3000);
      return;
    }
    
    setIsBlasting(true);
    setBlastProgress(0);
    setShowLiveResults(false);
    setGlobalError(null);
    setPlatformErrors({});
    
    // Initialize platform states to loading
    const initialStates: {[key: string]: 'loading'} = {};
    selectedPlatforms.forEach(platform => {
      initialStates[platform] = 'loading';
    });
    setPlatformStates(initialStates);
    
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
    
    // Simulate individual platform processing
    selectedPlatforms.forEach((platform, index) => {
      setTimeout(() => {
        // Simulate various failure scenarios
        const randomFailure = Math.random();
        
        if (randomFailure < 0.15) {
          // API/Service interruption (15% chance)
          setPlatformStates(prev => ({ ...prev, [platform]: 'error' }));
          setPlatformErrors(prev => ({ 
            ...prev, 
            [platform]: `We're unable to connect to the ${platform} API at the moment. This is likely a temporary issue on their end.`
          }));
        } else if (randomFailure < 0.25) {
          // Rate limiting (10% chance)
          setPlatformStates(prev => ({ ...prev, [platform]: 'rate-limited' }));
          setPlatformErrors(prev => ({ 
            ...prev, 
            [platform]: `You have reached your daily query limit for ${platform}. Try again later or consider upgrading your plan.`
          }));
        } else if (randomFailure < 0.35) {
          // Prompt rejected (10% chance)
          setPlatformStates(prev => ({ ...prev, [platform]: 'prompt-rejected' }));
          setPlatformErrors(prev => ({ 
            ...prev, 
            [platform]: `${platform} rejected this prompt. This may be due to its length or content. Please review and try again.`
          }));
        } else {
          // Success
          setPlatformStates(prev => ({ ...prev, [platform]: 'success' }));
        }
      }, 1000 + (index * 500));
    });
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setBlastProgress(100);
      
      // Mock live results only for successful platforms
      const mockResults = selectedPlatforms.map(platform => {
        const state = platformStates[platform] || 'success';
        if (state === 'success') {
          return {
            platform,
            mentioned: Math.random() > 0.3,
            sentiment: Math.random() > 0.5 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative",
            responseTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
            response: `Mock response from ${platform} for the prompt: "${customPrompt.slice(0, 50)}..."`
          };
        }
        return null;
      }).filter(Boolean);
      
      setLiveResults(mockResults);
      setActiveResultTab(selectedPlatforms[0]);
      
      setTimeout(() => {
        setIsBlasting(false);
        setBlastProgress(0);
        setShowLiveResults(true);
        
        const successCount = Object.values(platformStates).filter(state => state === 'success').length;
        const errorCount = selectedPlatforms.length - successCount;
        
        if (errorCount === 0) {
          toast({
            title: "Prompt Blast Complete",
            description: `Successfully tested prompt across ${selectedPlatforms.length} AI platforms.`,
          });
        } else if (successCount > 0) {
          // Show non-intrusive banner instead of toast for partial failures
          setGlobalError(`Blast finished with errors: ${successCount} platforms succeeded, ${errorCount} encountered issues.`);
        } else {
          setGlobalError("All platforms encountered issues. Please check your connections and try again.");
        }
      }, 1000);
    }, 5000);
  };

  const retryPlatform = (platform: string) => {
    setPlatformStates(prev => ({ ...prev, [platform]: 'loading' }));
    setPlatformErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[platform];
      return newErrors;
    });

    setTimeout(() => {
      // Simulate retry with higher success rate
      const randomFailure = Math.random();
      if (randomFailure < 0.2) {
        setPlatformStates(prev => ({ ...prev, [platform]: 'error' }));
        setPlatformErrors(prev => ({ 
          ...prev, 
          [platform]: `We're still unable to connect to the ${platform} API. Please try again later.`
        }));
      } else {
        setPlatformStates(prev => ({ ...prev, [platform]: 'success' }));
        toast({
          title: "Retry Successful",
          description: `Successfully connected to ${platform}.`,
        });
      }
    }, 2000);
  };

  const handleAddPrompt = () => {
    if (!newPrompt.trim()) return;
    
    // Here you would typically add the prompt to your database
    toast({
      title: "Prompt Added",
      description: "Your prompt has been added to the queue for processing.",
    });
    
    setNewPrompt("");
    setShowAddPromptDialog(false);
  };

  const handleSuggestPrompts = () => {
    setIsGeneratingPrompts(true);
    
    // Simulate AI prompt generation
    setTimeout(() => {
      setSuggestedPrompts([
        "What are the most durable athletic shoes for intensive training?",
        "Compare Nike Air technology with competitors' cushioning systems",
        "Best sustainable running shoes for environmentally conscious athletes",
        "Which brand offers the best value for money in basketball shoes?",
        "Latest innovations in athletic footwear for 2024"
      ]);
      setIsGeneratingPrompts(false);
    }, 2000);
  };

  const handleDeletePrompt = (promptId: number) => {
    // Here you would typically delete from your database
    toast({
      title: "Prompt Deleted",
      description: "The prompt has been removed from your analysis.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    });
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
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generator">Prompt Generator</TabsTrigger>
          <TabsTrigger value="history">Testing History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Header with Action Buttons */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AI Visibility Dashboard</h2>
              <p className="text-muted-foreground">Manage and analyze your brand's AI visibility prompts</p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={showSuggestPromptsDialog} onOpenChange={setShowSuggestPromptsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleSuggestPrompts}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Suggest Prompts
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI-Generated Prompt Suggestions</DialogTitle>
                    <DialogDescription>
                      Based on your brand profile and industry trends, here are personalized prompt suggestions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {isGeneratingPrompts ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Generating personalized prompts...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {suggestedPrompts.map((prompt, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <p className="text-sm flex-1">{prompt}</p>
                            <Button size="sm" variant="outline" onClick={() => {
                              setNewPrompt(prompt);
                              setShowAddPromptDialog(true);
                            }}>
                              Add to Queue
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAddPromptDialog} onOpenChange={setShowAddPromptDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Prompt</DialogTitle>
                    <DialogDescription>
                      Create a new prompt to test your brand's AI visibility
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your prompt here..."
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddPromptDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPrompt}>
                        Add to Queue
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Prompts in Queue Section */}
          {queuedPrompts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Prompts in Queue ({queuedPrompts.length})
                </CardTitle>
                <CardDescription>
                  Prompts submitted for processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queuedPrompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex-1">
                        <p className="font-medium">{prompt.prompt}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {formatDate(prompt.submittedDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={prompt.status === 'processing' ? 'default' : 'secondary'}>
                          {prompt.status === 'processing' ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Processing
                            </>
                          ) : (
                            'Queued'
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prompt Analysis Dashboard</CardTitle>
                  <CardDescription>
                    Track and analyze your AI visibility performance across platforms
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Prompt Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="generated">Visibl Generated</SelectItem>
                      <SelectItem value="user">User Added</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prompt</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            if (sortBy === 'date') {
                              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                            } else {
                              setSortBy('date');
                              setSortOrder('desc');
                            }
                          }}
                          className="h-auto p-0 font-medium"
                        >
                          Date
                          <ArrowUpDown className="h-4 w-4 ml-2" />
                        </Button>
                      </TableHead>
                      <TableHead>Top Platforms</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            if (sortBy === 'mentions') {
                              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                            } else {
                              setSortBy('mentions');
                              setSortOrder('desc');
                            }
                          }}
                          className="h-auto p-0 font-medium"
                        >
                          Mentions
                          <ArrowUpDown className="h-4 w-4 ml-2" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDashboardPrompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="max-w-[400px]">
                          <div className="space-y-1">
                            <p className="font-medium">{prompt.prompt}</p>
                            <Badge 
                              variant={prompt.isGenerated ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {prompt.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(prompt.date)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {prompt.topPlatforms.slice(0, 3).map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {prompt.topPlatforms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt.topPlatforms.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-lg">{prompt.mentions}</span>
                            <span className="text-sm text-muted-foreground">mentions</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePrompt(prompt.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredDashboardPrompts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No prompts match your current filters
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          {/* AI Visibility Generator section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Visibility Generator
              </CardTitle>
              <CardDescription>
                Create intelligent prompts to test your brand's visibility across AI platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Prompt Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Custom Prompt</h3>
                  <Button variant="outline" size="sm" onClick={() => copyPrompt(customPrompt)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  placeholder="Enter your custom prompt to test across AI platforms..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select AI Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {aiPlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                        <span className="font-medium text-sm">{platform.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blast Button and Warning */}
              <div className="space-y-3">
                {showNoSelectionWarning && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Please enter a prompt and select at least one platform to continue.
                      </span>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handlePromptBlast}
                  className="w-full"
                  size="lg"
                  disabled={isBlasting}
                >
                  {isBlasting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Blasting Prompts... {Math.round(blastProgress)}%
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Blast to Platforms ({selectedPlatforms.length} selected)
                    </>
                  )}
                </Button>
              </div>

              {/* Platform Status Cards */}
              {(isBlasting || Object.keys(platformStates).length > 0) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Platform Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPlatforms.map((platformId) => {
                      const platform = aiPlatforms.find(p => p.id === platformId);
                      const state = platformStates[platformId] || 'idle';
                      const error = platformErrors[platformId];
                      
                      return (
                        <Card key={platformId} className={`transition-all ${
                          state === 'success' ? 'border-green-500 bg-green-50' :
                          state === 'error' || state === 'rate-limited' || state === 'prompt-rejected' ? 'border-red-500 bg-red-50' :
                          state === 'loading' ? 'border-blue-500 bg-blue-50' :
                          'border-gray-200'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${platform?.color}`}></div>
                                <span className="font-medium">{platform?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                                {state === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                {(state === 'error' || state === 'rate-limited' || state === 'prompt-rejected') && (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => retryPlatform(platformId)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Retry
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            {error && (
                              <p className="text-sm text-red-600 mt-2">{error}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Testing History section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Testing History
              </CardTitle>
              <CardDescription>
                Review past prompt tests and their detailed results across AI platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {promptHistory.map((test, index) => (
                <Card key={test.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{test.prompt}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {test.testDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {test.timestamp}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{test.mentionedCount}</div>
                          <div className="text-xs text-muted-foreground">Mentioned</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{test.totalPlatforms}</div>
                          <div className="text-xs text-muted-foreground">Platforms</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={test.results[0]?.platform} className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        {test.results.map((result) => (
                          <TabsTrigger 
                            key={result.platform} 
                            value={result.platform}
                            className="text-xs"
                          >
                            <div className="flex items-center gap-1">
                              {result.mentioned ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <X className="h-3 w-3 text-red-500" />
                              )}
                              {result.platform}
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {test.results.map((result) => (
                        <TabsContent key={result.platform} value={result.platform} className="mt-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Badge variant={result.mentioned ? "default" : "secondary"}>
                                    {result.mentioned ? "Mentioned" : "Not Mentioned"}
                                  </Badge>
                                  <Badge variant="outline" className={
                                    result.sentiment === "positive" ? "border-green-500 text-green-700" :
                                    result.sentiment === "negative" ? "border-red-500 text-red-700" :
                                    "border-gray-500 text-gray-700"
                                  }>
                                    {result.sentiment} sentiment
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Timer className="h-4 w-4" />
                                  {result.responseTime}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm leading-relaxed">{result.response}</p>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
