import React, { useState } from "react";
import { X, ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, User, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PromptResult {
  platform: string;
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
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
  };
}

interface PromptDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  promptData: PromptDetailsData | null;
}

export const PromptDetailsPanel = ({ isOpen, onClose, promptData }: PromptDetailsPanelProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ChatGPT");
  
  // Initialize selected platform with the first available result
  React.useEffect(() => {
    if (isOpen && promptData?.results?.length > 0) {
      setSelectedPlatform(promptData.results[0].platform);
    }
  }, [promptData, isOpen]);

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
          bg: "bg-gradient-to-br from-green-50 to-emerald-100",
          border: "border-green-200",
          accent: "text-green-700",
          bubble: "bg-green-100 border-green-200",
          logo: "/lovable-uploads/21661e0f-75fe-4662-8b83-54120e1f0e7c.png",
          gradient: "from-green-400 to-emerald-600"
        };
      case "gemini":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
          border: "border-blue-200", 
          accent: "text-blue-700",
          bubble: "bg-blue-100 border-blue-200",
          logo: "/lovable-uploads/65ec39db-9a58-4ca5-9d92-81f8768dfc3f.png",
          gradient: "from-blue-400 to-indigo-600"
        };
      case "grok":
        return {
          bg: "bg-gradient-to-br from-gray-50 to-slate-100",
          border: "border-gray-200",
          accent: "text-gray-700", 
          bubble: "bg-gray-100 border-gray-200",
          logo: "/lovable-uploads/b1669738-c954-407c-a16a-fc81886dda6b.png",
          gradient: "from-gray-600 to-black"
        };
      case "perplexity":
        return {
          bg: "bg-gradient-to-br from-teal-50 to-cyan-100",
          border: "border-teal-200",
          accent: "text-teal-700",
          bubble: "bg-teal-100 border-teal-200",
          logo: "/lovable-uploads/74062f18-e53e-487e-ad8e-f12d3c959444.png",
          gradient: "from-teal-400 to-cyan-600"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          accent: "text-gray-700",
          bubble: "bg-gray-100 border-gray-200",
          logo: "",
          gradient: "from-gray-400 to-gray-600"
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

          {/* Platform Carousel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Analysis</h3>
            
            {/* Enhanced Carousel Navigation */}
            <div className="flex items-center justify-center space-x-12 py-8">
              {promptData.results.map((result) => {
                const styles = getPlatformStyles(result.platform);
                const isSelected = selectedPlatform === result.platform;
                
                return (
                  <button
                    key={result.platform}
                    onClick={() => setSelectedPlatform(result.platform)}
                    className={cn(
                      "relative transition-all duration-300 hover:scale-110 transform-gpu",
                      isSelected ? "scale-125" : "opacity-60 hover:opacity-80"
                    )}
                  >
                    <img 
                      src={styles.logo} 
                      alt={`${result.platform} logo`}
                      className={cn(
                        "w-20 h-20 object-contain transition-all duration-300",
                        isSelected ? "drop-shadow-lg" : ""
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Platform Output */}
          {currentResult && (
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="p-6">
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
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
                  </div>
                </div>

                {/* Response Content */}
                {currentResult.platform.toLowerCase() === "chatgpt" ? (
                  // ChatGPT interface format
                  <div className="bg-gray-50 p-6 space-y-6 rounded-lg">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl max-w-lg">
                        <p className="text-sm">{promptData.prompt}</p>
                      </div>
                    </div>
                    
                    {/* ChatGPT Response */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <img 
                          src="/lovable-uploads/21661e0f-75fe-4662-8b83-54120e1f0e7c.png" 
                          alt="ChatGPT" 
                          className="w-5 h-5 brightness-0 invert"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm leading-relaxed mb-3">
                          {currentResult.response}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentResult.platform.toLowerCase() === "gemini" ? (
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};