import React from "react";
import { X, Clock, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink } from "lucide-react";
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
  if (!isOpen || !promptData) return null;

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
          bubble: "bg-green-100 border-green-200"
        };
      case "gemini":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200", 
          accent: "text-blue-700",
          bubble: "bg-blue-100 border-blue-200"
        };
      case "grok":
        return {
          bg: "bg-pink-50",
          border: "border-pink-200",
          accent: "text-pink-700", 
          bubble: "bg-pink-100 border-pink-200"
        };
      case "perplexity":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          accent: "text-purple-700",
          bubble: "bg-purple-100 border-purple-200"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          accent: "text-gray-700",
          bubble: "bg-gray-100 border-gray-200"
        };
    }
  };

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
        <div className="p-6 space-y-8">
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

          {/* Platform Results */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Responses</h3>
            
            {promptData.results.map((result, index) => {
              const styles = getPlatformStyles(result.platform);
              
              return (
                <Card key={index} className={cn("border-2", styles.border)}>
                  <CardContent className={cn("p-6", styles.bg)}>
                    {/* Platform Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h4 className={cn("text-lg font-semibold", styles.accent)}>
                          {result.platform}
                        </h4>
                        {result.mentioned ? (
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
                          {getSentimentIcon(result.sentiment)}
                          <span className="capitalize">{result.sentiment}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{result.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Response Content */}
                    <div className={cn(
                      "rounded-lg border p-4 bg-white",
                      result.platform.toLowerCase() === "chatgpt" ? "ml-4" : "",
                      result.platform.toLowerCase() === "gemini" ? "space-y-2" : "",
                      result.platform.toLowerCase() === "grok" ? "font-mono text-sm" : "",
                      styles.bubble
                    )}>
                      {result.platform.toLowerCase() === "gemini" ? (
                        // Gemini structured format
                        <div className="space-y-3">
                          {result.response.split('. ').map((sentence, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <p className="text-gray-700">{sentence}{i < result.response.split('. ').length - 1 ? '.' : ''}</p>
                            </div>
                          ))}
                        </div>
                      ) : result.platform.toLowerCase() === "chatgpt" ? (
                        // ChatGPT bubble format
                        <div className="relative">
                          <div className="absolute -left-8 top-0 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-green-100" />
                          <p className="text-gray-700 leading-relaxed">{result.response}</p>
                        </div>
                      ) : result.platform.toLowerCase() === "grok" ? (
                        // Grok informal format
                        <div className="space-y-2">
                          <p className="text-gray-700 italic">"{result.response}"</p>
                          <p className="text-xs text-pink-600 font-normal">- Grok's take on this</p>
                        </div>
                      ) : (
                        // Perplexity formal format with sources
                        <div className="space-y-4">
                          <p className="text-gray-700 leading-relaxed">{result.response}</p>
                          {result.sources && result.sources.length > 0 && (
                            <div className="border-t pt-3">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Sources:</h5>
                              <div className="space-y-1">
                                {result.sources.map((source, sourceIndex) => (
                                  <a
                                    key={sourceIndex}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-xs text-purple-600 hover:text-purple-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>{source.title} - {source.domain}</span>
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};