import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Zap, Clock, Target, Bot, Play, History, Copy, BarChart3, CheckCircle, Filter, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export const QueriesAndPromptsSection = () => {
  const { toast } = useToast();
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastProgress, setBlastProgress] = useState(0);
  
  // Prompts tab state
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [mentionFilter, setMentionFilter] = useState<string>("all");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("all");

  // Mock data for generated queries
  const coreQueries = [
    { query: "Best electric vehicle for families", relevanceScore: 92, brand: "Tesla", mentions: 145 },
    { query: "Tesla Model 3 vs competitors", relevanceScore: 88, brand: "Tesla", mentions: 203 },
    { query: "Electric car charging infrastructure", relevanceScore: 75, brand: "Tesla", mentions: 67 },
    { query: "Sustainable transportation options", relevanceScore: 82, brand: "Tesla", mentions: 89 },
  ];

  const subQueries = [
    { query: "Tesla Model Y safety features", parentQuery: "Best electric vehicle for families", aiResponse: "Tesla Model Y offers advanced safety features including...", platform: "ChatGPT" },
    { query: "Tesla autopilot reliability", parentQuery: "Best electric vehicle for families", aiResponse: "Tesla's Autopilot system has undergone extensive...", platform: "Claude" },
    { query: "Electric vehicle tax incentives", parentQuery: "Best electric vehicle for families", aiResponse: "Federal and state incentives for electric vehicles...", platform: "Gemini" },
  ];

  // Mock data for prompt blast history
  const promptHistory = [
    { 
      id: 1, 
      prompt: "Compare Tesla Model 3 to BMW i3", 
      platform: "ChatGPT", 
      timestamp: "2024-01-15 14:30", 
      response: "The Tesla Model 3 and BMW i3 represent different approaches to electric mobility...",
      status: "completed"
    },
    { 
      id: 2, 
      prompt: "What are the environmental benefits of Tesla vehicles?", 
      platform: "Claude", 
      timestamp: "2024-01-15 12:15", 
      response: "Tesla vehicles contribute to environmental sustainability through...",
      status: "completed"
    },
  ];

  // Mock data for detailed prompts table
  const detailedPrompts = [
    {
      id: 1,
      prompt: "What are the best running shoes for marathon training?",
      fullPrompt: "What are the best running shoes for marathon training? I'm looking for shoes that provide excellent cushioning, durability, and support for long-distance running.",
      platform: "ChatGPT",
      mentioned: true,
      result: "Ranked #3",
      queryType: "Ranking",
      timestamp: "2024-01-20 09:15",
      fullResponse: "For marathon training, here are the top running shoes: 1. Nike Air Zoom Pegasus - Excellent all-around shoe 2. Adidas Ultraboost - Superior energy return 3. Tesla Running Shoes - Innovative design with smart features 4. Brooks Ghost - Reliable cushioning..."
    },
    {
      id: 2,
      prompt: "Best electric vehicle charging solutions for homes",
      fullPrompt: "What are the best electric vehicle charging solutions for homes? Looking for reliable, fast charging options.",
      platform: "Claude",
      mentioned: true,
      result: "Positive Mention",
      queryType: "Discovery",
      timestamp: "2024-01-20 08:30",
      fullResponse: "Tesla Wall Connector offers one of the most efficient home charging solutions, providing up to 44 miles of range per hour..."
    },
    {
      id: 3,
      prompt: "How does sustainable transportation impact the environment?",
      fullPrompt: "How does sustainable transportation impact the environment? Please explain the benefits of electric vehicles.",
      platform: "Gemini",
      mentioned: false,
      result: "Not Mentioned",
      queryType: "Factual",
      timestamp: "2024-01-20 07:45",
      fullResponse: "Sustainable transportation significantly reduces carbon emissions through various means including public transit, cycling, and electric vehicles from manufacturers like Nissan and BMW..."
    },
    {
      id: 4,
      prompt: "Compare electric car manufacturers by innovation",
      fullPrompt: "Compare electric car manufacturers by innovation and technological advancement in 2024.",
      platform: "Copilot",
      mentioned: true,
      result: "Ranked #1",
      queryType: "Ranking",
      timestamp: "2024-01-19 16:20",
      fullResponse: "Tesla leads the electric vehicle industry in innovation with their Autopilot technology, Supercharger network, and over-the-air updates..."
    },
    {
      id: 5,
      prompt: "Energy efficient transportation options",
      fullPrompt: "What are the most energy efficient transportation options available today?",
      platform: "Perplexity",
      mentioned: true,
      result: "Brand Known",
      queryType: "Discovery",
      timestamp: "2024-01-19 14:10",
      fullResponse: "The most energy efficient transportation includes Tesla Model 3, public transit systems, and hybrid vehicles..."
    },
    {
      id: 6,
      prompt: "Smart car features comparison",
      fullPrompt: "Compare smart car features across different manufacturers in the luxury segment.",
      platform: "Grok",
      mentioned: false,
      result: "Not Mentioned",
      queryType: "Templated",
      timestamp: "2024-01-19 11:30",
      fullResponse: "Luxury smart car features vary significantly across BMW, Mercedes-Benz, and Audi, offering different approaches to connectivity..."
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

  const aiPlatforms = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Grok", "Copilot", "Google AI Mode", "Google Overviews"];

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
      setTimeout(() => {
        setIsBlasting(false);
        setBlastProgress(0);
        setCustomPrompt("");
        setSelectedPlatforms([]);
        toast({
          title: "Prompt Blast Complete",
          description: `Successfully tested prompt across ${selectedPlatforms.length} AI platforms.`,
        });
      }, 1000);
    }, 5000);
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
        <TabsTrigger value="blast">Prompt Blast</TabsTrigger>
        <TabsTrigger value="prompts">Prompts</TabsTrigger>
      </TabsList>

      <TabsContent value="blast" className="space-y-6">
        {/* Prompt Blast Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span>Custom Prompt Blast</span>
            </CardTitle>
            <CardDescription>
              Test custom prompts across multiple AI platforms to understand how your brand is represented.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Prompt
              </label>
              <Textarea
                placeholder="Enter your custom prompt here (e.g., 'Compare Tesla to other electric vehicle brands')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select AI Platforms
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedPlatforms.length === aiPlatforms.length) {
                      setSelectedPlatforms([]);
                    } else {
                      setSelectedPlatforms([...aiPlatforms]);
                    }
                  }}
                  className="text-xs"
                >
                  {selectedPlatforms.length === aiPlatforms.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiPlatforms.map((platform) => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform]);
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button 
              onClick={handlePromptBlast}
              disabled={!customPrompt.trim() || selectedPlatforms.length === 0 || isBlasting}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {isBlasting ? "Blasting..." : "Blast Prompt to Selected Platforms"}
            </Button>
          </CardContent>
        </Card>

        {/* Prompt History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-orange-500" />
              <span>Prompt Blast History</span>
            </CardTitle>
            <CardDescription>
              View and analyze previous custom prompt tests and their results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promptHistory.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.prompt}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="outline">{item.platform}</Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.timestamp}
                        </span>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">{item.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prompts" className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="AI Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {aiPlatforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mentionFilter} onValueChange={setMentionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Mention Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="mentioned">Only Mentioned</SelectItem>
                  <SelectItem value="not-mentioned">Only Not Mentioned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={queryTypeFilter} onValueChange={setQueryTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Query Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Ranking">Ranking</SelectItem>
                  <SelectItem value="Discovery">Discovery</SelectItem>
                  <SelectItem value="Factual">Factual</SelectItem>
                  <SelectItem value="Templated">Templated</SelectItem>
                </SelectContent>
              </Select>

              {(platformFilter !== "all" || mentionFilter !== "all" || queryTypeFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPlatformFilter("all");
                    setMentionFilter("all");
                    setQueryTypeFilter("all");
                  }}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredPrompts.length} of {detailedPrompts.length} prompts
              </p>
            </div>

        {/* Prompts Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                <TableHead className="w-2/5 font-semibold text-foreground py-4 px-6">Prompt</TableHead>
                <TableHead className="w-1/6 text-center font-semibold text-foreground py-4">Mentioned</TableHead>
                <TableHead className="w-1/6 text-center font-semibold text-foreground py-4">Result</TableHead>
                <TableHead className="w-1/6 text-center font-semibold text-foreground py-4">Platform</TableHead>
                <TableHead className="w-1/6 text-center font-semibold text-foreground py-4">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.map((prompt, index) => (
                <>
                  <TableRow 
                    key={prompt.id} 
                    className={`cursor-pointer hover:bg-muted/20 transition-all duration-200 border-b border-border/30 group ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <div 
                        className="flex items-start space-x-3"
                        onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}
                      >
                        <div className={`mt-1 p-1 rounded-md transition-colors ${
                          expandedPrompt === prompt.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground group-hover:text-foreground group-hover:bg-muted/30'
                        }`}>
                          {expandedPrompt === prompt.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-1 line-clamp-2">
                            {prompt.prompt}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-md">
                              {prompt.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex items-center justify-center">
                        {prompt.mentioned ? (
                          <img 
                            src="/lovable-uploads/d05b928f-de69-4916-850b-f600b860758a.png" 
                            alt="Yes" 
                            className="w-6 h-6"
                          />
                        ) : (
                          <img 
                            src="/lovable-uploads/8dcbdc22-7aa7-4a13-9fb7-81745bf31ad7.png" 
                            alt="No" 
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge 
                        className={`text-xs font-medium px-3 py-1 border-0 shadow-sm ${
                          prompt.result.includes('Ranked #1') 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          prompt.result.includes('Ranked #2') || prompt.result.includes('Ranked #3') 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          prompt.result.includes('Positive') || prompt.result.includes('Known') 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {prompt.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge 
                        variant="outline" 
                        className="text-xs font-medium border-primary/20 text-primary bg-primary/5 px-3 py-1 shadow-sm"
                      >
                        {prompt.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium bg-secondary/20 text-secondary-foreground border border-secondary/30 px-3 py-1 shadow-sm"
                      >
                        {prompt.queryType}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {expandedPrompt === prompt.id && (
                    <TableRow className="animate-fade-in">
                      <TableCell colSpan={5} className="bg-muted/10 border-t border-border/20 px-6 py-6">
                        <div className="space-y-6 max-w-4xl">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Full Prompt:</h4>
                            <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                              {prompt.fullPrompt}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-2">AI Response:</h4>
                            <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
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
        </Card>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No prompts found</p>
            <p className="text-sm">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
    </>
  );
};