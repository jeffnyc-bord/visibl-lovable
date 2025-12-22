import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Zap, Clock, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check, Timer, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle, AlertCircle, RefreshCw, ExternalLink, AlertTriangle, Loader2, Lightbulb, Settings, Plus, Trash2, Circle, Sparkles, Eye, ChevronRight, ArrowRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PromptDetailsPanel } from "@/components/ui/prompt-details-panel";
import { AddPromptDialog } from "@/components/ui/add-prompt-dialog";
import { SuggestPromptsDialog } from "@/components/ui/suggest-prompts-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
  autoOpenPrompt?: string;
  demoMode?: boolean;
}

type SubmenuItem = 'generate' | 'monitor' | 'test';

// Discovery question templates for different journey stages
const journeyStages = [
  {
    id: 'awareness',
    label: 'Awareness Stage',
    description: 'Early-stage discovery prompts',
  },
  {
    id: 'consideration',
    label: 'Consideration Stage',
    description: 'Comparison and evaluation prompts',
  },
  {
    id: 'decision',
    label: 'Decision Stage',
    description: 'Purchase-ready prompts',
  }
];

const knowledgeLevels = [
  { id: 'beginner', label: 'Beginner', description: 'No prior knowledge' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some familiarity' },
  { id: 'expert', label: 'Expert', description: 'Deep understanding' },
];

export const QueriesAndPromptsSection = ({ brandData, prefilledQuery, onQueryUsed, autoOpenPrompt, demoMode = false }: QueriesAndPromptsSectionProps) => {
  const { toast } = useToast();
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuItem>('generate');
  
  // Generate tab state
  const [brandName, setBrandName] = useState(brandData?.name || '');
  const [productCategory, setProductCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>(['awareness', 'consideration', 'decision']);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['beginner', 'intermediate']);
  const [isGeneratingDiscovery, setIsGeneratingDiscovery] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<Array<{
    prompt: string;
    stage: string;
    level: string;
  }>>([]);

  // Test tab state
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
  
  // Monitor tab state
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  
  // Queue state
  const [queuedPrompts, setQueuedPrompts] = useState<number[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  
  // Bulk selection state
  const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
  
  // Add prompt dialog state
  const [showAddPromptDialog, setShowAddPromptDialog] = useState(false);

  // Prompts state
  const [detailedPromptsState, setDetailedPromptsState] = useState<Array<{
    id: number;
    prompt: string;
    fullPrompt: string;
    topPlatforms: React.ReactNode;
    mentions: number;
    source: string;
    timestamp: string;
    queued: boolean;
    status: "completed" | "pending";
    fullResponse: string;
    results: Array<{ platform: string; mentioned: boolean; sentiment: "positive" | "neutral" | "negative"; responseTime: string; response: string }>;
    metrics: { totalMentions: number; topPlatforms: string[]; avgSentiment: string; responseTime: string };
  }>>(() => [
    {
      id: 102,
      prompt: "Nike Air Max vs Adidas Ultraboost",
      fullPrompt: "What's the difference between Nike Air Max and Adidas Ultraboost?",
      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 203,
      source: "System",
      timestamp: "2024-01-14 16:45",
      queued: false,
      status: "completed",
      fullResponse: "Nike Air Max and Adidas Ultraboost are both excellent choices...",
      results: [
        { platform: "ChatGPT", mentioned: true, sentiment: "positive", responseTime: "2.3s", response: "Nike Air Max offers superior cushioning..." },
        { platform: "Gemini", mentioned: true, sentiment: "neutral", responseTime: "2.0s", response: "Both are quality shoes..." },
      ],
      metrics: { totalMentions: 203, topPlatforms: ["ChatGPT", "Perplexity"], avgSentiment: "positive", responseTime: "2.0s" }
    },
    {
      id: 103,
      prompt: "Most comfortable athletic shoes for daily wear",
      fullPrompt: "What are the most comfortable athletic shoes for daily wear?",
      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 67,
      source: "System",
      timestamp: "2024-01-13 11:20",
      queued: false,
      status: "completed",
      fullResponse: "For all-day comfort, Nike offers excellent options...",
      results: [
        { platform: "ChatGPT", mentioned: true, sentiment: "positive", responseTime: "2.0s", response: "For daily comfort, Nike's Air Max..." },
      ],
      metrics: { totalMentions: 67, topPlatforms: ["ChatGPT", "Gemini"], avgSentiment: "positive", responseTime: "1.9s" }
    },
    {
      id: 1,
      prompt: "What are the best running shoes for marathon training?",
      fullPrompt: "What are the best running shoes for marathon training?",
      topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />,
      mentions: 145,
      source: "User",
      timestamp: "2024-01-20 09:15",
      queued: false,
      status: "completed",
      fullResponse: "For marathon training, Nike Air Zoom Pegasus stands out...",
      results: [
        { platform: "ChatGPT", mentioned: true, sentiment: "positive", responseTime: "2.1s", response: "For marathon training, Nike Air Zoom Pegasus stands out..." },
      ],
      metrics: { totalMentions: 145, topPlatforms: ["ChatGPT", "Gemini", "Perplexity"], avgSentiment: "positive", responseTime: "2.0s" }
    }
  ]);

  // Update prompt when prefilledQuery changes
  useEffect(() => {
    if (prefilledQuery) {
      setCustomPrompt(prefilledQuery);
      setActiveSubmenu('test');
      onQueryUsed?.();
    }
  }, [prefilledQuery, onQueryUsed]);

  // Auto-open prompt details when autoOpenPrompt is provided
  useEffect(() => {
    if (autoOpenPrompt) {
      const matchingPrompt = detailedPromptsState.find(prompt => 
        prompt.prompt === autoOpenPrompt || prompt.fullPrompt.includes(autoOpenPrompt)
      );
      if (matchingPrompt) {
        setSelectedPromptId(matchingPrompt.id);
        setShowPromptDetails(true);
        setActiveSubmenu('monitor');
      }
    }
  }, [autoOpenPrompt, detailedPromptsState]);

  const promptHistory = [
    { 
      id: 1, 
      prompt: "Compare Nike Air Max to Adidas Ultraboost", 
      timestamp: "2024-01-15 14:30", 
      testDate: "Today",
      totalPlatforms: 4,
      mentionedCount: 3,
      results: [
        { platform: "ChatGPT", mentioned: true, sentiment: "positive", responseTime: "2.4s", response: "Nike Air Max series offers superior cushioning..." },
        { platform: "Gemini", mentioned: true, sentiment: "positive", responseTime: "2.1s", response: "Nike Air Max leads in several categories..." },
      ]
    },
  ];

  const detailedPrompts = detailedPromptsState;

  const filteredPrompts = detailedPrompts.filter(prompt => {
    const platformMatch = platformFilter === "all";
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

  const submenuItems: Array<{ id: SubmenuItem; label: string; icon: React.ReactNode; description: string }> = [
    { id: 'generate', label: 'Generate', icon: <Sparkles className="w-4 h-4" />, description: 'Discover content gaps' },
    { id: 'monitor', label: 'Monitor', icon: <Eye className="w-4 h-4" />, description: 'Track prompts' },
    { id: 'test', label: 'Test', icon: <Zap className="w-4 h-4" />, description: 'AI workspace' },
  ];

  const toggleStage = (stageId: string) => {
    setSelectedStages(prev => prev.includes(stageId) ? prev.filter(s => s !== stageId) : [...prev, stageId]);
  };

  const toggleLevel = (levelId: string) => {
    setSelectedLevels(prev => prev.includes(levelId) ? prev.filter(l => l !== levelId) : [...prev, levelId]);
  };

  const handleGenerateDiscovery = () => {
    if (!brandName.trim() || !productCategory.trim()) {
      toast({ title: "Missing Information", description: "Please fill in at least the brand name and product category.", variant: "destructive" });
      return;
    }
    setIsGeneratingDiscovery(true);
    setTimeout(() => {
      const mockPrompts: Array<{ prompt: string; stage: string; level: string }> = [];
      selectedStages.forEach(stage => {
        selectedLevels.forEach(level => {
          const stageData = journeyStages.find(s => s.id === stage);
          if (stageData) {
            const promptCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < promptCount; i++) {
              const templates = [
                `What are the best ${productCategory} for ${targetAudience || 'everyday use'}?`,
                `${brandName} ${productCategory} reviews and comparisons`,
                `How does ${brandName} compare to other ${productCategory} brands?`,
                `Is ${brandName} good for ${painPoints || 'my needs'}?`,
                `Best ${productCategory} under $200 - is ${brandName} worth it?`,
              ];
              mockPrompts.push({
                prompt: templates[Math.floor(Math.random() * templates.length)],
                stage: stageData.label,
                level: knowledgeLevels.find(l => l.id === level)?.label || level
              });
            }
          }
        });
      });
      setGeneratedPrompts(mockPrompts);
      setIsGeneratingDiscovery(false);
      toast({ title: "Prompts Generated", description: `Discovered ${mockPrompts.length} potential content gap prompts.` });
    }, 2000);
  };

  const togglePromptQueue = (promptId: number) => {
    setQueuedPrompts(prev => prev.includes(promptId) ? prev.filter(id => id !== promptId) : [...prev, promptId]);
    toast({ title: queuedPrompts.includes(promptId) ? "Removed from Queue" : "Added to Queue", description: queuedPrompts.includes(promptId) ? "Prompt removed from queue." : "Prompt will be included in the next analysis run." });
  };

  const handleDeletePrompt = (promptId: number) => {
    setDetailedPromptsState(prev => prev.filter(p => p.id !== promptId));
    setQueuedPrompts(prev => prev.filter(id => id !== promptId));
    setSelectedPrompts(prev => prev.filter(id => id !== promptId));
    toast({ title: "Prompt Deleted", description: "The prompt has been removed from your library." });
  };

  const handleBulkDelete = () => {
    setDetailedPromptsState(prev => prev.filter(p => !selectedPrompts.includes(p.id)));
    setQueuedPrompts(prev => prev.filter(id => !selectedPrompts.includes(id)));
    toast({ title: "Prompts Deleted", description: `${selectedPrompts.length} prompts have been removed.` });
    setSelectedPrompts([]);
  };

  const toggleSelectPrompt = (promptId: number) => {
    setSelectedPrompts(prev => prev.includes(promptId) ? prev.filter(id => id !== promptId) : [...prev, promptId]);
  };

  const toggleSelectAll = () => {
    if (selectedPrompts.length === filteredPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(filteredPrompts.map(p => p.id));
    }
  };

  const handlePromptBlast = () => {
    if (!customPrompt.trim() || selectedPlatforms.length === 0) {
      setShowNoSelectionWarning(true);
      setTimeout(() => setShowNoSelectionWarning(false), 3000);
      return;
    }
    setIsBlasting(true);
    setBlastProgress(0);
    setShowLiveResults(false);
    setGlobalError(null);
    setPlatformErrors({});
    
    toast({ title: "Prompt Blast Started", description: `Testing your prompt across ${selectedPlatforms.length} AI platforms.` });
    
    const initialStates: {[key: string]: 'loading'} = {};
    selectedPlatforms.forEach(platform => { initialStates[platform] = 'loading'; });
    setPlatformStates(initialStates);
    
    const progressInterval = setInterval(() => {
      setBlastProgress(prev => prev >= 100 ? (clearInterval(progressInterval), 100) : prev + Math.random() * 15);
    }, 400);
    
    selectedPlatforms.forEach((platform, index) => {
      setTimeout(() => {
        const randomFailure = Math.random();
        if (randomFailure < 0.15) {
          setPlatformStates(prev => ({ ...prev, [platform]: 'error' }));
          setPlatformErrors(prev => ({ ...prev, [platform]: `Unable to connect to ${platform} API.` }));
        } else {
          setPlatformStates(prev => ({ ...prev, [platform]: 'success' }));
        }
      }, 1000 + (index * 500));
    });
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setBlastProgress(100);
      const mockResults = selectedPlatforms.map(platform => ({
        platform,
        mentioned: Math.random() > 0.3,
        sentiment: Math.random() > 0.5 ? "positive" : "neutral",
        responseTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
        response: `Mock response from ${platform} for: "${customPrompt.slice(0, 50)}..."`
      }));
      setLiveResults(mockResults);
      setActiveResultTab(selectedPlatforms[0]);
      setTimeout(() => {
        setIsBlasting(false);
        setBlastProgress(0);
        setShowLiveResults(true);
        toast({ title: "Prompt Blast Complete", description: `Tested across ${selectedPlatforms.length} platforms.` });
      }, 1000);
    }, 5000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case "negative": return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <>
      {globalError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">{globalError}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setGlobalError(null)} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex h-full min-h-[600px]">
        {/* Left Submenu */}
        <div className="w-52 border-r border-border/50 py-6 pr-4 flex-shrink-0">
          <div className="space-y-1">
            {submenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSubmenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  activeSubmenu === item.id
                    ? 'bg-foreground/5 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className={activeSubmenu === item.id ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>
                </div>
                {activeSubmenu === item.id && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 pl-8 py-6 overflow-auto">
          {/* Generate View */}
          {activeSubmenu === 'generate' && (
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground tracking-tight">Prompt Discovery</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Uncover content gaps across the customer journey. Generate prompts based on knowledge levels and buying stages.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Brand Name</label>
                    <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g., Nike" className="h-10 bg-background border-border/60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Category</label>
                    <Input value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="e.g., Running Shoes" className="h-10 bg-background border-border/60" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Target Audience</label>
                  <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Marathon runners, casual joggers" className="h-10 bg-background border-border/60" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Customer Pain Points</label>
                  <Textarea value={painPoints} onChange={(e) => setPainPoints(e.target.value)} placeholder="e.g., Foot pain during long runs, durability concerns..." rows={3} className="resize-none bg-background border-border/60" />
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Customer Journey Stages</label>
                  <div className="flex flex-wrap gap-2">
                    {journeyStages.map((stage) => (
                      <button key={stage.id} onClick={() => toggleStage(stage.id)} className={`px-3.5 py-2 rounded-full text-sm transition-all duration-200 ${selectedStages.includes(stage.id) ? 'bg-foreground text-background' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Knowledge Levels</label>
                  <div className="flex flex-wrap gap-2">
                    {knowledgeLevels.map((level) => (
                      <button key={level.id} onClick={() => toggleLevel(level.id)} className={`px-3.5 py-2 rounded-full text-sm transition-all duration-200 ${selectedLevels.includes(level.id) ? 'bg-foreground text-background' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleGenerateDiscovery} disabled={isGeneratingDiscovery} className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90">
                    {isGeneratingDiscovery ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing Content Gaps...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate Discovery Prompts</>)}
                  </Button>
                </div>
              </div>

              {generatedPrompts.length > 0 && (
                <div className="space-y-4 pt-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-foreground">Discovered Prompts<Badge variant="secondary" className="ml-2 text-xs">{generatedPrompts.length}</Badge></h3>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Plus className="w-3.5 h-3.5 mr-1.5" />Add All to Queue</Button>
                  </div>
                  <div className="space-y-2">
                    {generatedPrompts.map((item, index) => (
                      <div key={index} className="group flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate pr-4">{item.prompt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-muted-foreground">{item.stage}</span>
                            <span className="text-[11px] text-muted-foreground/50">•</span>
                            <span className="text-[11px] text-muted-foreground">{item.level}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => { setCustomPrompt(item.prompt); setActiveSubmenu('test'); }}>Test<ArrowRight className="w-3 h-3 ml-1" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Plus className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Monitor View */}
          {activeSubmenu === 'monitor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground tracking-tight">Prompts Library</h2>
                  <p className="text-sm text-muted-foreground mt-1">Track and manage prompts used to assess AI visibility.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <SuggestPromptsDialog brandName={brandData.name} onPromptsSelected={(prompts) => toast({ title: "Prompts Added", description: `${prompts.length} suggested prompts added.` })} />
                  <Button onClick={() => setShowAddPromptDialog(true)} className="bg-foreground text-background hover:bg-foreground/90"><MessageSquare className="w-4 h-4 mr-2" />Add Prompt</Button>
                  <AddPromptDialog open={showAddPromptDialog} onOpenChange={setShowAddPromptDialog} onAdd={(promptText) => {
                    const newPrompt = { id: Date.now(), prompt: promptText, fullPrompt: promptText, topPlatforms: <img src="/lovable-uploads/c3b25065-d9ca-4938-8482-52a5d5251489.png" alt="AI Platform" className="w-12 h-12" />, mentions: 0, source: "User", timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), queued: true, status: "pending" as const, fullResponse: "", results: [], metrics: { totalMentions: 0, topPlatforms: [], avgSentiment: "neutral", responseTime: "0s" } };
                    setDetailedPromptsState(prev => [newPrompt, ...prev]);
                    toast({ title: "Prompt Added", description: "Your custom prompt has been queued." });
                  }} />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                </div>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="AI Platform" /></SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Platforms</SelectItem>
                    {aiPlatforms.map(platform => (<SelectItem key={platform.id} value={platform.name}>{platform.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <Select value={mentionFilter} onValueChange={setMentionFilter}>
                  <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Mention Status" /></SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="mentioned">Only Mentioned</SelectItem>
                    <SelectItem value="not-mentioned">Only Not Mentioned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-40 bg-background"><SelectValue placeholder="Sources" /></SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions Bar */}
              {selectedPrompts.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-accent/50 border border-border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{selectedPrompts.length} prompt{selectedPrompts.length > 1 ? 's' : ''} selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPrompts([])}>Clear Selection</Button>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-2" />Delete Selected</Button>
                  </div>
                </div>
              )}

              {/* Prompts Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-12">
                        <button onClick={toggleSelectAll} className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-input hover:border-primary transition-all bg-background">
                          {selectedPrompts.length === filteredPrompts.length && filteredPrompts.length > 0 && <Check className="w-3 h-3 text-primary" />}
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
                        <TableRow key={prompt.id} className={`hover:bg-muted/30 ${isQueued ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => toggleSelectPrompt(prompt.id)} className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-input hover:border-primary transition-all bg-background">
                              {selectedPrompts.includes(prompt.id) && <Check className="w-3 h-3 text-primary" />}
                            </button>
                          </TableCell>
                          <TableCell className="cursor-pointer" onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}>
                            <div className="max-w-xs flex items-center space-x-2">
                              <p className="font-medium text-foreground truncate">{prompt.prompt}</p>
                              {isQueued && <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/5">Queued</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="cursor-pointer" onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}>
                            {prompt.status === "pending" ? <Badge variant="outline" className="text-xs text-muted-foreground">Pending</Badge> : prompt.topPlatforms}
                          </TableCell>
                          <TableCell className="cursor-pointer" onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}>
                            {prompt.status === "pending" ? <Badge variant="outline" className="text-xs border-orange-500 text-orange-500"><Loader2 className="w-3 h-3 animate-spin mr-1" />Queued</Badge> : <span className="font-medium text-foreground">{prompt.mentions}</span>}
                          </TableCell>
                          <TableCell className="cursor-pointer" onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}>
                            <Badge variant={prompt.source === "System" ? "default" : "secondary"} className="text-xs">{prompt.source}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground cursor-pointer" onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}>
                            {new Date(prompt.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Settings className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => togglePromptQueue(prompt.id)}>{isQueued ? <><X className="mr-2 h-4 w-4" />Remove from Queue</> : <><Plus className="mr-2 h-4 w-4" />Add to Queue</>}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedPromptId(prompt.id); setShowPromptDetails(true); }}><BarChart3 className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(prompt.prompt); toast({ title: "Copied", description: "Prompt copied." }); }}><Copy className="mr-2 h-4 w-4" />Copy Prompt</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeletePrompt(prompt.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Prompt</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Test View */}
          {activeSubmenu === 'test' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-semibold text-foreground tracking-tight">AI Testing Workspace</h2>
                <p className="text-sm text-muted-foreground mt-1">Test custom prompts across multiple AI platforms in real-time.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Your Test Prompt</label>
                  <Textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Example: 'Compare Nike to other athletic footwear brands...'" rows={4} className="resize-none bg-background border-border/60" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Select AI Platforms</label>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPlatforms(selectedPlatforms.length === aiPlatforms.length ? [] : aiPlatforms.map(p => p.name))} className="text-xs h-7">
                      {selectedPlatforms.length === aiPlatforms.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {aiPlatforms.map((platform) => {
                      const platformState = platformStates[platform.name] || 'idle';
                      const isSelected = selectedPlatforms.includes(platform.name);
                      return (
                        <button key={platform.id} onClick={() => setSelectedPlatforms(isSelected ? selectedPlatforms.filter(p => p !== platform.name) : [...selectedPlatforms, platform.name])} className={`relative p-4 rounded-lg border transition-all duration-200 text-left ${platformState === 'success' ? 'border-green-200 bg-green-50/50' : platformState === 'loading' ? 'border-blue-200 bg-blue-50/50' : platformState === 'error' ? 'border-destructive/20 bg-destructive/5' : isSelected ? 'border-foreground/20 bg-foreground/5' : 'border-border/40 hover:border-border/60'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${platform.color}`}></div>
                              <span className="text-sm font-medium">{platform.name}</span>
                            </div>
                            {platformState === 'loading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                            {platformState === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {platformState === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                            {platformState === 'idle' && isSelected && <Check className="w-4 h-4 text-foreground" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {showNoSelectionWarning && <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-200">Please select at least one AI platform</div>}
                </div>

                <Button onClick={handlePromptBlast} disabled={!customPrompt.trim() || selectedPlatforms.length === 0 || isBlasting} className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90">
                  {isBlasting ? (<><Loader2 className="w-5 h-5 mr-3 animate-spin" />Testing in Progress...</>) : (<><Play className="w-5 h-5 mr-3" />{selectedPlatforms.length > 0 ? `Blast to ${selectedPlatforms.length} Platforms` : 'Select Platforms to Blast'}</>)}
                </Button>
              </div>

              {/* Live Results */}
              {showLiveResults && liveResults.length > 0 && (
                <div className="space-y-4 pt-4">
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-medium text-foreground">Live Results</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">{liveResults.filter(r => r.mentioned).length}/{liveResults.length} Mentioned</Badge>
                  </div>

                  <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full mb-4">
                      {liveResults.map((result) => (
                        <TabsTrigger key={result.platform} value={result.platform} className="flex items-center space-x-2">
                          <span>{result.platform}</span>
                          {result.mentioned ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-destructive" />}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {liveResults.map((result) => (
                      <TabsContent key={result.platform} value={result.platform} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{result.responseTime}</span>
                          </div>
                          <Button variant="ghost" size="sm"><Copy className="w-4 h-4 mr-1" />Copy</Button>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">AI Response:</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{result.response}</p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* Test History */}
              <div className="space-y-4 pt-4">
                <Separator />
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-medium text-foreground">Test History</h3>
                </div>
                <div className="space-y-3">
                  {promptHistory.map((item) => (
                    <Collapsible key={item.id} open={expandedHistory === item.id} onOpenChange={(open) => setExpandedHistory(open ? item.id : null)}>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-foreground mb-2">{item.prompt}</p>
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" />{item.testDate}</span>
                                  <Badge variant="secondary">{item.mentionedCount}/{item.totalPlatforms} Mentioned</Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                                {expandedHistory === item.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t border-border bg-muted/20 p-4">
                            <div className="grid gap-4">
                              {item.results.map((result, index) => (
                                <div key={index} className="bg-background rounded-lg p-4 border border-border">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <Badge variant="outline">{result.platform}</Badge>
                                      {result.mentioned ? <Badge className="bg-green-100 text-green-800">Mentioned</Badge> : <Badge variant="secondary" className="bg-destructive/10 text-destructive">Not Mentioned</Badge>}
                                      <div className="flex items-center space-x-1">
                                        {getSentimentIcon(result.sentiment)}
                                        <span className="text-xs text-muted-foreground capitalize">{result.sentiment}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                      <Timer className="w-3 h-3" />
                                      <span>{result.responseTime}</span>
                                    </div>
                                  </div>
                                  <div className="bg-muted/30 rounded p-3">
                                    <p className="text-sm text-muted-foreground">{result.response}</p>
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
              </div>
            </div>
          )}
        </div>
      </div>

      <PromptDetailsPanel isOpen={showPromptDetails} onClose={() => setShowPromptDetails(false)} promptData={selectedPromptId ? detailedPrompts.find(p => p.id === selectedPromptId) || null : null} />
    </>
  );
};
