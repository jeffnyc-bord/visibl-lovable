import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Zap, Clock, Target, Bot, Play, History, Copy, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export const QueriesAndPromptsSection = () => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

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

  const aiPlatforms = ["ChatGPT", "Claude", "Gemini", "Perplexity"];

  // Mock data for AI platform mentions from generated queries
  const platformMentionsData = [
    { platform: "ChatGPT", mentions: 456, percentage: 38 },
    { platform: "Claude", mentions: 324, percentage: 27 },
    { platform: "Gemini", mentions: 287, percentage: 24 },
    { platform: "Perplexity", mentions: 133, percentage: 11 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(220, 14%, 69%)', 'hsl(220, 14%, 83%)'];

  const handlePromptBlast = () => {
    if (!customPrompt.trim() || selectedPlatforms.length === 0) return;
    
    // In a real implementation, this would trigger API calls to selected platforms
    console.log("Blasting prompt to platforms:", selectedPlatforms);
    console.log("Prompt:", customPrompt);
    
    // Reset form
    setCustomPrompt("");
    setSelectedPlatforms([]);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generated" className="space-y-4">
        <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
          <TabsTrigger value="generated" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <Search className="w-4 h-4" />
            <span>Generated Queries Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="prompt-blast" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <Zap className="w-4 h-4" />
            <span>Prompt Blast Lab</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="space-y-6">
          {/* Core Queries Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Core Brand Queries</span>
              </CardTitle>
              <CardDescription>
                System-generated queries that are most relevant to your brand, based on AI understanding and market analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coreQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{query.query}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Relevance: {query.relevanceScore}%
                        </Badge>
                        <span className="text-sm text-gray-600">{query.mentions} AI mentions</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-1" />
                      Analyze
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Platform Mentions Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <span>AI Platform Mention Distribution</span>
              </CardTitle>
              <CardDescription>
                Brand mentions across AI platforms from your generated queries and prompt blasts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Mentions by Platform</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={platformMentionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="mentions" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution Percentage</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={platformMentionsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="percentage"
                        label={(entry) => `${entry.platform}: ${entry.percentage}%`}
                      >
                        {platformMentionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-Queries Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-500" />
                <span>AI Platform Responses</span>
              </CardTitle>
              <CardDescription>
                Detailed analysis of how different AI platforms respond to brand-related sub-queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Query</TableHead>
                    <TableHead>Parent Query</TableHead>
                    <TableHead>AI Platform</TableHead>
                    <TableHead>Response Preview</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subQueries.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.query}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.parentQuery}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.platform}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-gray-600 truncate">{item.aiResponse}</p>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt-blast" className="space-y-6">
          {/* Prompt Blast Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Custom Prompt Testing</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select AI Platforms
                </label>
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
                disabled={!customPrompt.trim() || selectedPlatforms.length === 0}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Blast Prompt to Selected Platforms
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
      </Tabs>
    </div>
  );
};