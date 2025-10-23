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
import { Search, Zap, Clock, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check, Timer, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle, AlertCircle, RefreshCw, ExternalLink, AlertTriangle, Loader2, Lightbulb, Settings, Plus, Trash2, Circle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";
import { AddPromptDialog } from "@/components/ui/add-prompt-dialog";
import { SuggestPromptsDialog } from "@/components/ui/suggest-prompts-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  autoOpenPrompt?: string; // Query text to automatically open
}

export const QueriesAndPromptsSection = ({ brandData, prefilledQuery, onQueryUsed, autoOpenPrompt }: QueriesAndPromptsSectionProps) => {
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
  
  // Prompts tab state
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  
  // Queue state
  const [queuedPrompts, setQueuedPrompts] = useState<number[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  
  // Bulk selection state
  const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
  
  // Add prompt dialog state
  const [showAddPromptDialog, setShowAddPromptDialog] = useState(false);

  // Prompts state - convert mock data to state
  const [detailedPromptsState, setDetailedPromptsState] = useState(() => {
    // Top prompts from overview section
    const topPromptsFromOverview = [
      {
        id: 102,
        prompt: "Nike Air Max vs Adidas Ultraboost",
        fullPrompt: "What's the difference between Nike Air Max and Adidas Ultraboost? Which one is better for daily wear and athletic performance?",
        topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
        mentions: 203,
        source: "System",
        timestamp: "2024-01-14 16:45",
        queued: false,
        status: "completed" as "completed" | "pending",
        fullResponse: "Nike Air Max and Adidas Ultraboost are both excellent choices, but they serve different purposes. Nike Air Max offers superior style and cushioning technology, while Ultraboost focuses on energy return.",
        results: [
          {
            platform: "ChatGPT",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "2.3s",
            response: "Nike Air Max offers superior cushioning with visible air technology and iconic style. It's excellent for both casual wear and athletic activities, with Nike's reputation for quality and innovation."
          },
          {
            platform: "Gemini",
            mentioned: true,
            sentiment: "neutral" as const,
            responseTime: "2.0s",
            response: "Both Nike Air Max and Adidas Ultraboost are quality shoes. Nike Air Max offers distinctive style with visible air cushioning, while Ultraboost focuses on energy return technology."
          },
          {
            platform: "Grok",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.9s",
            response: "Nike Air Max brings the heat with visible Air cushioning and that classic swoosh style. Solid choice for everyday wear and light workouts."
          },
          {
            platform: "Perplexity",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.7s",
            response: "Nike Air Max provides excellent cushioning and style versatility. The visible Air technology gives superior comfort for daily wear and light athletic activities."
          }
        ],
        metrics: {
          totalMentions: 203,
          topPlatforms: ["ChatGPT", "Perplexity", "Gemini"],
          avgSentiment: "positive",
          responseTime: "2.0s"
        }
      },
      {
        id: 103,
        prompt: "Most comfortable athletic shoes for daily wear",
        fullPrompt: "What are the most comfortable athletic shoes for daily wear? I need something that provides all-day comfort for walking and standing.",
        topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
        mentions: 67,
        source: "System",
        timestamp: "2024-01-13 11:20",
        queued: false,
        status: "completed" as "completed" | "pending",
        fullResponse: "For all-day comfort, Nike offers several excellent options including the Air Max series and React technology shoes that provide superior cushioning and support.",
        results: [
          {
            platform: "ChatGPT",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "2.0s",
            response: "For daily comfort, Nike's Air Max and React series provide excellent all-day cushioning and support, making them ideal for walking and standing."
          },
          {
            platform: "Gemini",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.9s",
            response: "Nike offers excellent comfort with their Air Max and React technology. These shoes provide superior cushioning and support for all-day wear."
          },
          {
            platform: "Grok",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.7s",
            response: "Nike's Air Max and React shoes are top choices for all-day comfort, combining cushioning tech with durability for extended wear."
          },
          {
            platform: "Perplexity",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.8s",
            response: "For all-day comfort, Nike's Air Max series and React technology shoes stand out with superior cushioning and support designed for extended walking and standing."
          }
        ],
        metrics: {
          totalMentions: 67,
          topPlatforms: ["ChatGPT", "Gemini", "Grok", "Perplexity"],
          avgSentiment: "positive",
          responseTime: "1.9s"
        }
      },
      {
        id: 104,
        prompt: "Best basketball shoes for performance",
        fullPrompt: "What are the best basketball shoes for performance? I need shoes that provide excellent grip, ankle support, and cushioning for competitive play.",
        topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
        mentions: 89,
        source: "System",
        timestamp: "2024-01-12 09:30",
        queued: false,
        status: "completed" as "completed" | "pending",
        fullResponse: "Nike dominates basketball performance with Air Jordan and LeBron series, offering superior grip, ankle support, and cushioning technology for competitive play.",
        results: [
          {
            platform: "ChatGPT",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "2.2s",
            response: "Nike dominates basketball with Air Jordan and LeBron series. These shoes offer superior grip, ankle support, and cushioning technology for competitive performance."
          },
          {
            platform: "Grok",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.9s",
            response: "Nike's basketball shoes, particularly Air Jordan and LeBron lines, provide excellent performance with superior grip and ankle support for competitive play."
          },
          {
            platform: "Perplexity",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.6s",
            response: "Nike leads in basketball performance footwear. The Air Jordan and LeBron series offer exceptional grip, support, and cushioning for competitive basketball."
          }
        ],
        metrics: {
          totalMentions: 89,
          topPlatforms: ["ChatGPT", "Grok", "Perplexity"],
          avgSentiment: "positive",
          responseTime: "1.9s"
        }
      }
    ];

    // Initial mock data
    return [
      ...topPromptsFromOverview,
      {
        id: 1,
        prompt: "What are the best running shoes for marathon training?",
        fullPrompt: "What are the best running shoes for marathon training? I'm looking for shoes that provide excellent cushioning, durability, and support for long-distance running.",
        topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
        mentions: 145,
        source: "User",
        timestamp: "2024-01-20 09:15",
        queued: false,
        status: "completed" as "completed" | "pending",
        fullResponse: "For marathon training, here are the top running shoes: 1. Nike Air Zoom Pegasus - Excellent all-around shoe 2. Adidas Ultraboost - Superior energy return 3. Brooks Ghost - Reliable cushioning 4. Hoka Clifton - Maximum comfort...",
        results: [
          {
            platform: "ChatGPT",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "2.1s",
            response: "For marathon training, Nike Air Zoom Pegasus stands out as the top choice. The shoe provides excellent cushioning with Nike's Air Zoom technology, making it ideal for long-distance running. Nike's reputation for quality and performance makes it a reliable choice for serious marathon runners."
          },
          {
            platform: "Gemini",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "1.8s",
            response: "Marathon training requires shoes with superior cushioning and support. Nike Air Zoom Pegasus offers excellent durability and comfort for long-distance running. The shoe's design provides optimal energy return and stability for marathon preparation."
          },
          {
            platform: "Grok",
            mentioned: false,
            sentiment: "neutral" as const,
            responseTime: "1.5s",
            response: "Look, when it comes to marathon training, you need shoes that won't let you down. There are several solid options out there, but comfort and durability should be your top priorities. Find what works for your feet!"
          },
          {
            platform: "Perplexity",
            mentioned: true,
            sentiment: "positive" as const,
            responseTime: "2.3s",
            response: "Based on comprehensive testing and runner feedback, Nike Air Zoom Pegasus consistently ranks among the top marathon training shoes. The shoe offers excellent cushioning through Nike's Air Zoom technology and provides the durability needed for high-mileage training.",
            sources: [
              { title: "Best Marathon Running Shoes 2024", url: "https://example.com/marathon-shoes", domain: "runningmagazine.com" },
              { title: "Nike Air Zoom Pegasus Review", url: "https://example.com/pegasus-review", domain: "runnersworld.com" }
            ]
          }
        ],
        metrics: {
          totalMentions: 145,
          topPlatforms: ["ChatGPT", "Gemini", "Perplexity"],
          avgSentiment: "positive",
          responseTime: "2.0s"
        }
      }
    ];
  });

  // Update prompt when prefilledQuery changes
  useEffect(() => {
    if (prefilledQuery) {
      setCustomPrompt(prefilledQuery);
      onQueryUsed?.();
    }
  }, [prefilledQuery, onQueryUsed]);

  // Auto-open prompt details when autoOpenPrompt is provided
  useEffect(() => {
    if (autoOpenPrompt) {
      // Find the prompt that matches the autoOpenPrompt query
      const matchingPrompt = detailedPromptsState.find(prompt => 
        prompt.prompt === autoOpenPrompt || prompt.fullPrompt.includes(autoOpenPrompt)
      );
      
      if (matchingPrompt) {
        setSelectedPromptId(matchingPrompt.id);
        setShowPromptDetails(true);
      }
    }
  }, [autoOpenPrompt, detailedPromptsState]);

  // Mock data for generated queries
  const coreQueries = [
    { query: "Best running shoes for marathon training", brand: "Nike", mentions: 145 },
    { query: "Nike Air Max vs Adidas Ultraboost", brand: "Nike", mentions: 203 },
    { query: "Most comfortable athletic shoes for daily wear", brand: "Nike", mentions: 67 },
    { query: "Best basketball shoes for performance", brand: "Nike", mentions: 89 },
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
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive",
          responseTime: "2.1s",
          response: "Nike Air Max leads in several categories: brand heritage, style versatility, and cushioning technology. Adidas Ultraboost offers premium materials and modern design language. For long-term comfort, Nike's Air Max technology provides consistent support."
        },
        {
          platform: "Grok",
          mentioned: true,
          sentiment: "neutral",
          responseTime: "1.8s",
          response: "Both shoes target different athletic needs. Nike Air Max focuses on lifestyle comfort and casual wear, while Adidas Ultraboost emphasizes running performance. Nike has advantage in durability and classic styling."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "positive",
          responseTime: "1.5s",
          response: "Nike Air Max offers superior cushioning with visible Air technology and better durability for all-day wear. Adidas Ultraboost excels in running-specific performance with Boost foam energy return."
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
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive",
          responseTime: "1.9s",
          response: "Environmental benefits include reduced waste and lower carbon footprint. Nike's approach to sustainable manufacturing through recycled materials and renewable energy creates a comprehensive eco-friendly production system."
        },
        {
          platform: "Grok",
          mentioned: true,
          sentiment: "positive",
          responseTime: "1.8s",
          response: "Nike's Move to Zero initiative is legit. They're cutting emissions and using recycled materials to make sustainable shoes without compromising performance."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "positive",
          responseTime: "1.7s",
          response: "Nike's sustainable manufacturing includes Move to Zero initiative, recycled materials usage, and reduced carbon emissions. Their eco-friendly practices span the entire production cycle."
        }
      ]
    }
  ];

  // Use state for detailed prompts instead of mock data
  const detailedPrompts = detailedPromptsState;

  // Filter prompts based on selected filters
  const filteredPrompts = detailedPrompts.filter(prompt => {
    const platformMatch = platformFilter === "all"; // Simplified since topPlatforms is now JSX
    const mentionMatch = mentionFilter === "all" || 
      (mentionFilter === "mentioned" && prompt.mentions > 0) ||
      (mentionFilter === "not-mentioned" && prompt.mentions === 0);
    const sourceMatch = sourceFilter === "all" || prompt.source === sourceFilter;
    
    return platformMatch && mentionMatch && sourceMatch;
  });

  const aiPlatforms = [
    { id: "chatgpt", name: "ChatGPT", color: "bg-green-500" },
    { id: "gemini", name: "Gemini", color: "bg-blue-500" },
    { id: "perplexity", name: "Perplexity", color: "bg-purple-500" },
    { id: "grok", name: "Grok", color: "bg-pink-500" }
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

  // Queue helper functions
  const togglePromptQueue = (promptId: number) => {
    setQueuedPrompts(prev => {
      if (prev.includes(promptId)) {
        return prev.filter(id => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
    
    const isAdding = !queuedPrompts.includes(promptId);
    toast({
      title: isAdding ? "Added to Queue" : "Removed from Queue",
      description: isAdding 
        ? "Prompt will be included in the next analysis run." 
        : "Prompt removed from queue.",
    });
  };

  const handleDeletePrompt = (promptId: number) => {
    setDetailedPromptsState(prev => prev.filter(p => p.id !== promptId));
    setQueuedPrompts(prev => prev.filter(id => id !== promptId));
    setSelectedPrompts(prev => prev.filter(id => id !== promptId));
    toast({
      title: "Prompt Deleted",
      description: "The prompt has been removed from your library.",
    });
  };

  const handleBulkDelete = () => {
    setDetailedPromptsState(prev => prev.filter(p => !selectedPrompts.includes(p.id)));
    setQueuedPrompts(prev => prev.filter(id => !selectedPrompts.includes(id)));
    toast({
      title: "Prompts Deleted",
      description: `${selectedPrompts.length} prompts have been removed from your library.`,
    });
    setSelectedPrompts([]);
  };

  const toggleSelectPrompt = (promptId: number) => {
    setSelectedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPrompts.length === filteredPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(filteredPrompts.map(p => p.id));
    }
  };

  const processQueue = () => {
    if (queuedPrompts.length === 0) {
      toast({
        title: "Queue Empty",
        description: "No prompts are currently queued.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingQueue(true);
    
    toast({
      title: "Clearing Queue",
      description: `Removing ${queuedPrompts.length} prompts from queue...`,
    });

    // Simulate clearing
    setTimeout(() => {
      setIsProcessingQueue(false);
      setQueuedPrompts([]);
      
      toast({
        title: "Queue Cleared",
        description: "All prompts have been removed from the queue.",
      });
    }, 1000);
  };

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
    
    // Show immediate feedback
    toast({
      title: "Prompt Blast Started",
      description: `Testing your prompt across ${selectedPlatforms.length} AI platforms. You can continue exploring while we work.`,
    });
    
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

      {/* Error banner */}
      {globalError && (
        <div className="mb-4 p-3 bg-red-50/80 border border-red-200/60 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{globalError}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGlobalError(null)}
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

    <Tabs defaultValue="prompts" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="prompts">Prompts</TabsTrigger>
        <TabsTrigger value="blast">Prompt Blast Lab</TabsTrigger>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {aiPlatforms.map((platform) => {
                  const platformState = platformStates[platform.name] || 'idle';
                  const platformError = platformErrors[platform.name];
                  const isSelected = selectedPlatforms.includes(platform.name);
                  const hasBlasted = isBlasting || Object.keys(platformStates).length > 0;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`relative p-6 rounded-lg border cursor-pointer transition-all duration-300 overflow-hidden ${
                        hasBlasted && isSelected ? 'min-h-[120px]' : 'h-16'
                      } ${
                        platformState === 'error' || platformState === 'rate-limited' || platformState === 'prompt-rejected'
                          ? 'border-red-200/80 bg-red-50/50'
                          : platformState === 'loading'
                          ? 'border-blue-200/80 bg-blue-50/50'
                          : platformState === 'success'
                          ? 'border-green-200/80 bg-green-50/50'
                          : isSelected
                          ? 'border-primary/30 bg-primary/5 shadow-sm hover:shadow-md'
                          : 'border-border/40 hover:border-border/60 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        if (platformState === 'loading') return;
                        if (isSelected) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.name));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, platform.name]);
                        }
                      }}
                    >
                      {/* Platform Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${platform.color}`}></div>
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        
                        {/* Status Icons */}
                        {platformState === 'loading' && (
                          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        )}
                        {platformState === 'success' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {(platformState === 'error' || platformState === 'rate-limited') && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        {platformState === 'prompt-rejected' && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        {platformState === 'idle' && isSelected && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      {/* States - only show after blast */}
                      {hasBlasted && isSelected && (
                        <>
                          {/* Error States */}
                          {platformError && (
                            <div className="space-y-3">
                              <div className="text-xs font-medium text-red-600">
                                {platformState === 'error' ? 'Service Unavailable' :
                                 platformState === 'rate-limited' ? 'Usage Limit Reached' :
                                 'Prompt Rejected'}
                              </div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                {platformError}
                              </div>
                              
                              {/* Action Buttons */}
                              {platformState === 'error' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    retryPlatform(platform.name);
                                  }}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Retry
                                </Button>
                              )}
                              {platformState === 'rate-limited' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast({
                                      title: "Upgrade Plan",
                                      description: "This would redirect to upgrade options.",
                                    });
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Upgrade
                                </Button>
                              )}
                            </div>
                          )}

                          {/* Loading State */}
                          {platformState === 'loading' && (
                            <div className="text-xs text-blue-600 font-medium">
                              Processing your prompt...
                            </div>
                          )}

                          {/* Success State */}
                          {platformState === 'success' && (
                            <div className="text-xs text-green-600 font-medium">
                              Response received successfully
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Selected: {selectedPlatforms.length} of {aiPlatforms.length} platforms
                </p>
                {showNoSelectionWarning && (
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200 animate-fade-in">
                    Please select at least one AI platform to blast
                  </div>
                )}
              </div>
            </div>

            {/* Blast Button */}
            <Button 
              onClick={handlePromptBlast}
              disabled={!customPrompt.trim() || selectedPlatforms.length === 0 || isBlasting}
              className={`w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                isBlasting 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {isBlasting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Testing in Progress...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-3" />
                  {selectedPlatforms.length > 0 ? `Blast to ${selectedPlatforms.length} Platforms` : 'Select Platforms to Blast'}
                </>
              )}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <img src="/lovable-uploads/d065101f-8248-41db-a466-8cd39c5a5533.png" alt="Terminal" className="w-5 h-5" />
                  <span>Prompts Analysis</span>
                </CardTitle>
                <CardDescription>
                  Detailed view of queries used to assess your brand's AI visibility across platforms.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <SuggestPromptsDialog 
                  brandName={brandData.name}
                  onPromptsSelected={(prompts) => {
                    toast({
                      title: "Prompts Added",
                      description: `${prompts.length} suggested prompts have been added to your library.`,
                    });
                  }}
                />
                <Button
                  onClick={() => setShowAddPromptDialog(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Prompt
                </Button>
                <AddPromptDialog
                  open={showAddPromptDialog}
                  onOpenChange={setShowAddPromptDialog}
                  onAdd={(promptText) => {
                    // Create new prompt with pending status
                    const newPrompt = {
                      id: Date.now(),
                      prompt: promptText,
                      fullPrompt: promptText,
                      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
                      mentions: 0,
                      source: "User",
                      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                      queued: true,
                      status: "pending" as const,
                      fullResponse: "",
                      results: [],
                      metrics: {
                        totalMentions: 0,
                        topPlatforms: [],
                        avgSentiment: "neutral",
                        responseTime: "0s"
                      }
                    };

                    setDetailedPromptsState(prev => [newPrompt, ...prev]);
                    
                    toast({
                      title: "Prompt Added",
                      description: "Your custom prompt has been queued for analysis.",
                    });
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Queue Controls */}
            {queuedPrompts.length > 0 && (
              <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-gray-900">Queue Status:</span>
                    <Badge 
                      variant="default"
                      className="flex items-center space-x-1"
                    >
                      <span>{queuedPrompts.length} prompts queued</span>
                      {isProcessingQueue && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={processQueue}
                  disabled={isProcessingQueue}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {isProcessingQueue ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Clearing...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>Clear Queue</span>
                    </>
                  )}
                </Button>
              </div>
            )}

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

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sources" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Visibl">Visibl</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions Bar */}
            {selectedPrompts.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-accent/50 border border-border rounded-lg backdrop-blur-sm animate-in slide-in-from-top-2 fade-in-0 duration-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                    {selectedPrompts.length} prompt{selectedPrompts.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedPrompts([])}
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}

            {/* Prompts Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-out">
              <Table>
                  <TableHeader>
                   <TableRow className="bg-gray-50">
                     <TableHead className="w-12">
                       <button
                         onClick={toggleSelectAll}
                         className="group relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-input hover:border-primary transition-all duration-200 cursor-pointer bg-background"
                       >
                         <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                           selectedPrompts.length === filteredPrompts.length && filteredPrompts.length > 0
                             ? 'bg-primary scale-100 opacity-100' 
                             : 'bg-transparent scale-0 opacity-0'
                         }`} />
                         <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                           selectedPrompts.length === filteredPrompts.length && filteredPrompts.length > 0
                             ? 'text-primary-foreground scale-100 opacity-100' 
                             : 'text-transparent scale-0 opacity-0'
                         }`} />
                       </button>
                     </TableHead>
                     <TableHead className="font-semibold">Prompt</TableHead>
                     <TableHead className="font-semibold">Top Platform</TableHead>
                     <TableHead className="font-semibold">Mentions</TableHead>
                     <TableHead className="font-semibold">Source</TableHead>
                     <TableHead className="font-semibold">Date</TableHead>
                     <TableHead className="font-semibold w-16">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                   {filteredPrompts.map((prompt) => {
                     const isQueued = queuedPrompts.includes(prompt.id) || prompt.queued;
                     return (
                       <TableRow 
                         key={prompt.id} 
                         className={`hover:bg-gray-50 ${isQueued ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                       >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleSelectPrompt(prompt.id)}
                            className="group relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-input hover:border-primary transition-all duration-200 cursor-pointer bg-background"
                          >
                            <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
                              selectedPrompts.includes(prompt.id)
                                ? 'bg-primary scale-100 opacity-100' 
                                : 'bg-transparent scale-0 opacity-0'
                            }`} />
                            <Check className={`w-3 h-3 relative z-10 transition-all duration-200 ${
                              selectedPrompts.includes(prompt.id)
                                ? 'text-primary-foreground scale-100 opacity-100' 
                                : 'text-transparent scale-0 opacity-0'
                            }`} />
                          </button>
                        </TableCell>
                        <TableCell
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedPromptId(prompt.id);
                            setShowPromptDetails(true);
                          }}
                        >
                          <div className="max-w-xs flex items-center space-x-2">
                            <p className="font-medium text-gray-900 truncate">{prompt.prompt}</p>
                            {isQueued && (
                              <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/5">
                                Queued
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedPromptId(prompt.id);
                              setShowPromptDetails(true);
                            }}
                          >
                           <div className="flex items-center">
                             {prompt.status === "pending" ? (
                               <Badge variant="outline" className="text-xs text-gray-500">
                                 Pending
                               </Badge>
                             ) : (
                               prompt.topPlatforms
                             )}
                           </div>
                         </TableCell>
                         <TableCell
                           className="cursor-pointer"
                           onClick={() => {
                             setSelectedPromptId(prompt.id);
                             setShowPromptDetails(true);
                           }}
                         >
                           <div className="flex items-center space-x-2">
                             {prompt.status === "pending" ? (
                               <Badge variant="outline" className="text-xs border-orange-500 text-orange-500 bg-orange-50">
                                 <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                 Queued
                               </Badge>
                             ) : (
                               <span className="font-medium text-gray-900">{prompt.mentions}</span>
                             )}
                           </div>
                         </TableCell>
                        <TableCell
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedPromptId(prompt.id);
                            setShowPromptDetails(true);
                          }}
                        >
                          <Badge variant={prompt.source === "Visibl" ? "default" : "secondary"} className="text-xs">
                            {prompt.source}
                          </Badge>
                        </TableCell>
                        <TableCell 
                          className="text-sm text-gray-600 cursor-pointer"
                          onClick={() => {
                            setSelectedPromptId(prompt.id);
                            setShowPromptDetails(true);
                          }}
                        >
                          {new Date(prompt.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => togglePromptQueue(prompt.id)}>
                                {isQueued ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" />
                                    Remove from Queue
                                  </>
                                ) : (
                                  <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add to Queue
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedPromptId(prompt.id);
                                setShowPromptDetails(true);
                              }}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(prompt.prompt);
                                toast({
                                  title: "Copied",
                                  description: "Prompt copied to clipboard.",
                                });
                              }}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Prompt
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeletePrompt(prompt.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Prompt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                     );
                   })}
                </TableBody>
              </Table>
            </div>

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Prompt Details Panel */}
    <PromptDetailsPanel
      isOpen={showPromptDetails}
      onClose={() => setShowPromptDetails(false)}
      promptData={selectedPromptId ? detailedPrompts.find(p => p.id === selectedPromptId) || null : null}
    />
    </>
  );
};
