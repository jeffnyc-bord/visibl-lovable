import React, { useState } from "react";
import { X, Clock, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PromptResult {
  platform: string;
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
  responseTime: string;
  response: string;
  sources?: Array<{
    title: string;
    url: string;
    domain: string;
  }>;
}

interface PromptDetailsData {
  id: number;
  prompt: string;
  timestamp: string;
  results: PromptResult[];
  metrics: {
    totalMentions: number;
    topPlatforms: string[];
    avgSentiment: string;
    responseTime: string;
  };
}

interface PromptDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  promptData: PromptDetailsData | null;
}

export const PromptDetailsPanel = ({ isOpen, onClose, promptData }: PromptDetailsPanelProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ChatGPT");
  
  if (!isOpen || !promptData) return null;

  // Initialize selected platform with the first available result
  React.useEffect(() => {
    if (promptData?.results?.length > 0) {
      setSelectedPlatform(promptData.results[0].platform);
    }
  }, [promptData]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformStyles = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "chatgpt":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          accent: "text-green-700",
          bubble: "bg-green-100 border-green-200",
          logo: "https://cdn.openai.com/API/logo-openai.svg"
        };
      case "gemini":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200", 
          accent: "text-blue-700",
          bubble: "bg-blue-100 border-blue-200",
          logo: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
        };
      case "grok":
        return {
          bg: "bg-pink-50",
          border: "border-pink-200",
          accent: "text-pink-700", 
          bubble: "bg-pink-100 border-pink-200",
          logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg"
        };
      case "perplexity":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          accent: "text-purple-700",
          bubble: "bg-purple-100 border-purple-200",
          logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.svg"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          accent: "text-gray-700",
          bubble: "bg-gray-100 border-gray-200",
          logo: ""
        };
    }
  };

  const currentResult = promptData.results.find(result => result.platform === selectedPlatform);
  const currentStyles = getPlatformStyles(selectedPlatform);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-3/4 max-w-4xl bg-white border-l border-gray-200 z-50",
        "transform transition-transform duration-300 ease-in-out",
        "shadow-xl overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {promptData.prompt}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(promptData.timestamp).toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {promptData.results.length} platforms tested
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Quick Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{promptData.metrics.totalMentions}</div>
                  <div className="text-xs text-gray-500">Total Mentions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {promptData.results.filter(r => r.mentioned).length}
                  </div>
                  <div className="text-xs text-gray-500">Platforms Mentioned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 capitalize">{promptData.metrics.avgSentiment}</div>
                  <div className="text-xs text-gray-500">Avg Sentiment</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{promptData.metrics.responseTime}</div>
                  <div className="text-xs text-gray-500">Avg Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Carousel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Analysis</h3>
            
            {/* Carousel Navigation */}
            <div className="flex items-center justify-center space-x-4 py-4 bg-gray-50 rounded-lg">
              {promptData.results.map((result) => {
                const styles = getPlatformStyles(result.platform);
                const isSelected = selectedPlatform === result.platform;
                
                return (
                  <button
                    key={result.platform}
                    onClick={() => setSelectedPlatform(result.platform)}
                    className={cn(
                      "flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-200",
                      "hover:scale-105 hover:shadow-md",
                      isSelected 
                        ? cn("ring-2 ring-primary shadow-lg", styles.bg, styles.border, "border-2")
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      <span className={cn("font-bold text-sm", isSelected ? styles.accent : "text-gray-600")}>
                        {result.platform.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className={cn("text-xs font-medium", isSelected ? styles.accent : "text-gray-600")}>
                      {result.platform}
                    </span>
                    {result.mentioned ? (
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                        Mentioned
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
                        Not Mentioned
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Selected Platform Output */}
          {currentResult && (
            <Card className={cn("border-2", currentStyles.border)}>
              <CardContent className={cn("p-6", currentStyles.bg)}>
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      <span className={cn("font-bold text-sm", currentStyles.accent)}>
                        {currentResult.platform.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <h4 className={cn("text-xl font-semibold", currentStyles.accent)}>
                      {currentResult.platform}
                    </h4>
                    {currentResult.mentioned ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Brand Mentioned
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                        Not Mentioned
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(currentResult.sentiment)}
                      <span className="capitalize">{currentResult.sentiment}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentResult.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Response Content */}
                <div className={cn(
                  "rounded-lg border p-6 bg-white min-h-[200px]",
                  currentResult.platform.toLowerCase() === "chatgpt" ? "ml-4" : "",
                  currentResult.platform.toLowerCase() === "gemini" ? "space-y-2" : "",
                  currentResult.platform.toLowerCase() === "grok" ? "font-mono text-sm" : "",
                  currentStyles.bubble
                )}>
                  {currentResult.platform.toLowerCase() === "gemini" ? (
                    // Gemini structured format
                    <div className="space-y-4">
                      <h5 className="font-semibold text-blue-700 text-lg mb-3">Analysis Results</h5>
                      {currentResult.response.split('. ').map((sentence, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">{sentence}{i < currentResult.response.split('. ').length - 1 ? '.' : ''}</p>
                        </div>
                      ))}
                    </div>
                  ) : currentResult.platform.toLowerCase() === "chatgpt" ? (
                    // ChatGPT bubble format
                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-green-100" />
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-gray-700 leading-relaxed text-base">{currentResult.response}</p>
                      </div>
                    </div>
                  ) : currentResult.platform.toLowerCase() === "grok" ? (
                    // Grok informal format
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <span className="text-2xl">🤖</span>
                        <h5 className="font-bold text-pink-700 text-lg">Grok's Hot Take</h5>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
                        <p className="text-gray-700 italic text-base leading-relaxed">"{currentResult.response}"</p>
                      </div>
                      <p className="text-xs text-pink-600 font-normal text-right">- Your friendly neighborhood AI</p>
                    </div>
                  ) : (
                    // Perplexity formal format with sources
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-purple-700 text-lg mb-3 flex items-center">
                          <span className="mr-2">📚</span>
                          Research Summary
                        </h5>
                        <p className="text-gray-700 leading-relaxed text-base bg-purple-50 p-4 rounded-lg">{currentResult.response}</p>
                      </div>
                      {currentResult.sources && currentResult.sources.length > 0 && (
                        <div className="border-t pt-4">
                          <h5 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Sources & References:
                          </h5>
                          <div className="space-y-2 bg-purple-50 p-4 rounded-lg">
                            {currentResult.sources.map((source, sourceIndex) => (
                              <a
                                key={sourceIndex}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="font-medium">{source.title}</span>
                                <span className="text-purple-400">• {source.domain}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};