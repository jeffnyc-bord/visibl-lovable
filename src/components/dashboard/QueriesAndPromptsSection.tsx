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
import { Search, Zap, Clock, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check, Timer, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle, AlertCircle, RefreshCw, ExternalLink, AlertTriangle, Loader2, Lightbulb } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";

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
  
  // Prompts tab state
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("all");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [showTooltips, setShowTooltips] = useState<{[key: string]: boolean}>({});
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  // Update prompt when prefilledQuery changes
  useEffect(() => {
    if (prefilledQuery) {
      setCustomPrompt(prefilledQuery);
      onQueryUsed?.();
    }
  }, [prefilledQuery, onQueryUsed]);

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
      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 145,
      source: "User",
      timestamp: "2024-01-20 09:15",
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
    },
    {
      id: 2,
      prompt: "Best basketball shoes for performance and comfort",
      fullPrompt: "What are the best basketball shoes for performance and comfort? Looking for shoes with excellent support and traction.",
      topPlatforms: <img src="/lovable-uploads/a40b42db-815c-4f8a-8e69-98513246a871.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 203,
      source: "Visibl",
      timestamp: "2024-01-20 08:30",
      fullResponse: "Nike Air Jordan and Nike LeBron series offer excellent basketball performance with superior ankle support and court traction...",
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.9s",
          response: "Nike Air Jordan remains the gold standard for basketball shoes. The combination of style, performance, and Nike's innovative technology makes them ideal for both court performance and comfort during extended play."
        },
        {
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.2s",
          response: "Basketball performance requires shoes with excellent ankle support and traction. Nike Air Jordan series excels in both categories. The brand's legacy in basketball combined with modern technology creates superior court shoes."
        },
        {
          platform: "Grok",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.7s",
          response: "Basketball shoes? Nike Jordan is pretty much the MVP here. They've got the tech, the style, and the street cred. Plus, they actually work on the court – imagine that!"
        },
        {
          platform: "Perplexity",
          mentioned: false,
          sentiment: "neutral" as const,
          responseTime: "2.0s",
          response: "Basketball footwear should prioritize ankle support, traction, and cushioning. Several manufacturers offer high-performance options with varying price points and technology approaches.",
          sources: [
            { title: "Best Basketball Shoes 2024", url: "https://example.com/basketball-shoes", domain: "sportsreview.com" }
          ]
        }
      ],
      metrics: {
        totalMentions: 203,
        topPlatforms: ["ChatGPT", "Gemini", "Grok"],
        avgSentiment: "positive",
        responseTime: "1.95s"
      }
    },
    {
      id: 3,
      prompt: "How does sustainable footwear manufacturing impact the environment?",
      fullPrompt: "How does sustainable footwear manufacturing impact the environment? Please explain the benefits of eco-friendly athletic shoes.",
      topPlatforms: <img src="/lovable-uploads/d7b3f813-5a0c-482b-b898-f14691fc323c.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 67,
      source: "User",
      timestamp: "2024-01-20 07:45",
      fullResponse: "Sustainable footwear manufacturing significantly reduces environmental impact through recycled materials, eco-friendly processes from brands like Adidas and Allbirds...",
      results: [
        {
          platform: "ChatGPT",
          mentioned: false,
          sentiment: "neutral" as const,
          responseTime: "2.1s",
          response: "Sustainable footwear manufacturing reduces environmental impact through recycled materials, reduced water usage, and eco-friendly production processes. Many companies are adopting these practices to minimize their carbon footprint."
        },
        {
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.8s",
          response: "Environmental benefits of sustainable footwear are significant. Companies like Nike have pioneered eco-friendly manufacturing with their Move to Zero initiative. Recycled materials and renewable energy reduce the industry's environmental impact substantially."
        },
        {
          platform: "Grok",
          mentioned: false,
          sentiment: "neutral" as const,
          responseTime: "1.6s",
          response: "Eco-friendly shoes are pretty neat! Less waste, fewer chemicals, and companies actually caring about the planet? Revolutionary stuff, really. Though some brands are more talk than walk."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.4s",
          response: "Sustainable footwear manufacturing significantly reduces environmental impact. Nike's Move to Zero initiative exemplifies industry leadership in sustainable practices, utilizing recycled materials and renewable energy sources.",
          sources: [
            { title: "Nike Sustainability Report 2024", url: "https://example.com/nike-sustainability", domain: "nike.com" },
            { title: "Sustainable Fashion Industry Analysis", url: "https://example.com/sustainable-fashion", domain: "environmentalreport.com" }
          ]
        }
      ],
      metrics: {
        totalMentions: 67,
        topPlatforms: ["Gemini", "Perplexity"],
        avgSentiment: "neutral",
        responseTime: "2.0s"
      }
    },
    {
      id: 4,
      prompt: "Compare athletic shoe brands by innovation",
      fullPrompt: "Compare athletic shoe brands by innovation and technological advancement in 2024.",
      topPlatforms: <img src="/lovable-uploads/086f696b-7542-4a7b-b4db-fc841c1042d2.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 89,
      source: "Visibl",
      timestamp: "2024-01-19 16:20",
      fullResponse: "Nike leads the athletic footwear industry in innovation with their Air Max technology, React foam, and Nike Adapt self-lacing systems...",
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.3s",
          response: "Nike stands out as the innovation leader in athletic footwear. Their Air Max technology revolutionized cushioning, while Nike Adapt introduced self-lacing capabilities. Nike's continuous investment in R&D keeps them ahead of competitors."
        },
        {
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.0s",
          response: "Athletic footwear innovation varies by brand focus. Nike excels in technology integration and performance enhancement. Their React foam and Air Max systems demonstrate superior engineering in the athletic shoe industry."
        },
        {
          platform: "Grok",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.8s",
          response: "Innovation in shoes? Nike's basically writing the playbook here. Self-lacing shoes, crazy cushioning tech – they're living in 2050 while others are still figuring out shoelaces."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.5s",
          response: "Nike leads athletic footwear innovation through breakthrough technologies like Air Max cushioning, React foam, and Nike Adapt self-lacing systems. Their technological advancement significantly surpasses industry competitors.",
          sources: [
            { title: "Athletic Footwear Innovation Report 2024", url: "https://example.com/footwear-innovation", domain: "techreview.com" },
            { title: "Nike Technology Overview", url: "https://example.com/nike-tech", domain: "nike.com" }
          ]
        }
      ],
      metrics: {
        totalMentions: 89,
        topPlatforms: ["ChatGPT", "Gemini", "Grok", "Perplexity"],
        avgSentiment: "positive",
        responseTime: "2.15s"
      }
    },
    {
      id: 5,
      prompt: "Best athletic shoes for cross-training",
      fullPrompt: "What are the best athletic shoes for cross-training and versatile workouts?",
      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 124,
      source: "User",
      timestamp: "2024-01-19 14:10",
      fullResponse: "The best cross-training shoes include Nike Metcon series, Reebok Nano, and Under Armour HOVR for versatile workouts...",
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.0s",
          response: "Nike Metcon series dominates the cross-training space with exceptional stability and durability. Nike's design focuses on lateral support and multi-directional movement, making them perfect for varied workout routines."
        },
        {
          platform: "Gemini",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.9s",
          response: "Cross-training requires versatile footwear with excellent stability. Nike Metcon provides superior lateral support and durability. The shoe's design accommodates various exercise types from weightlifting to cardio workouts."
        },
        {
          platform: "Grok",
          mentioned: false,
          sentiment: "neutral" as const,
          responseTime: "1.5s",
          response: "Cross-training shoes need to handle everything you throw at them. Stability, comfort, durability – the holy trinity of not falling over during burpees."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.2s",
          response: "Nike Metcon series consistently ranks as the top choice for cross-training activities. The shoe's exceptional lateral stability and durability make it ideal for high-intensity varied workouts.",
          sources: [
            { title: "Best Cross-Training Shoes 2024", url: "https://example.com/cross-training", domain: "fitnessmagazine.com" }
          ]
        }
      ],
      metrics: {
        totalMentions: 124,
        topPlatforms: ["ChatGPT", "Gemini", "Perplexity"],
        avgSentiment: "positive",
        responseTime: "1.9s"
      }
    },
    {
      id: 6,
      prompt: "Smart shoe technology comparison",
      fullPrompt: "Compare smart shoe technology across different manufacturers in the premium segment.",
      topPlatforms: <img src="/lovable-uploads/a40b42db-815c-4f8a-8e69-98513246a871.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 56,
      source: "Visibl",
      timestamp: "2024-01-19 11:30",
      fullResponse: "Smart shoe technology varies significantly across brands like Adidas, Under Armour, and Puma, offering different approaches to fitness tracking...",
      results: [
        {
          platform: "ChatGPT",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "2.4s",
          response: "Nike leads smart shoe technology with their Adapt series featuring self-lacing capabilities and app integration. Nike's innovation in wearable technology sets them apart from traditional athletic footwear approaches."
        },
        {
          platform: "Gemini",
          mentioned: false,
          sentiment: "neutral" as const,
          responseTime: "2.1s",
          response: "Smart footwear technology includes fitness tracking, pressure sensors, and connectivity features. Various manufacturers approach this technology differently, focusing on specific user needs and price points."
        },
        {
          platform: "Grok",
          mentioned: true,
          sentiment: "positive" as const,
          responseTime: "1.7s",
          response: "Smart shoes are wild! Nike's got shoes that tie themselves – we're basically living in Back to the Future. Though let's be honest, most people can barely remember to charge their phones."
        },
        {
          platform: "Perplexity",
          mentioned: true,
          sentiment: "neutral" as const,
          responseTime: "2.6s",
          response: "Smart shoe technology varies across manufacturers. Nike's Adapt series features self-lacing technology, while other brands focus on fitness tracking capabilities. Each approach targets different market segments.",
          sources: [
            { title: "Smart Footwear Technology Review", url: "https://example.com/smart-shoes", domain: "techcrunch.com" },
            { title: "Nike Adapt Technology", url: "https://example.com/nike-adapt", domain: "nike.com" }
          ]
        }
      ],
      metrics: {
        totalMentions: 56,
        topPlatforms: ["ChatGPT", "Grok", "Perplexity"],
        avgSentiment: "neutral",
        responseTime: "2.2s"
      }
    }
  ];

  // Filter prompts based on selected filters
  const filteredPrompts = detailedPrompts.filter(prompt => {
    const platformMatch = platformFilter === "all"; // Simplified since topPlatforms is now JSX
    const mentionMatch = mentionFilter === "all" || 
      (mentionFilter === "mentioned" && prompt.mentions > 0) ||
      (mentionFilter === "not-mentioned" && prompt.mentions === 0);
    const sourceMatch = queryTypeFilter === "all" || prompt.source === queryTypeFilter;
    
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

    <Tabs defaultValue="blast" className="space-y-6">
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
                <Button variant="outline" className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggest Prompts</span>
                </Button>
                <Button className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Add Prompt</span>
                </Button>
              </div>
            </div>
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
                     <TableHead className="font-semibold">Top Platform</TableHead>
                     <TableHead className="font-semibold">Mentions</TableHead>
                     <TableHead className="font-semibold">Source</TableHead>
                     <TableHead className="font-semibold">Date</TableHead>
                   </TableRow>
                 </TableHeader>
                <TableBody>
                   {filteredPrompts.map((prompt) => (
                     <TableRow 
                       key={prompt.id} 
                       className="hover:bg-gray-50 cursor-pointer"
                       onClick={() => {
                         setSelectedPromptId(prompt.id);
                         setShowPromptDetails(true);
                       }}
                     >
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{prompt.prompt}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">{prompt.topPlatforms}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{prompt.mentions}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={prompt.source === "Visibl" ? "default" : "secondary"} className="text-xs">
                            {prompt.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(prompt.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                   ))}
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
