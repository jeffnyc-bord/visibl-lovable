import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Copy, ThumbsUp, ThumbsDown, Sparkles, Stars, Zap, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedContent: any;
  recommendationTitle: string;
}

export const AIChatbotModal = ({ isOpen, onClose, generatedContent, recommendationTitle }: AIChatbotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && generatedContent) {
      // Initialize conversation with the generated content
      const initialMessages: Message[] = [
        {
          id: '1',
          type: 'system',
          content: `I've generated content for: ${recommendationTitle}`,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'ai',
          content: formatGeneratedContent(generatedContent),
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'ai',
          content: "Feel free to ask me questions about this content or request modifications!",
          timestamp: new Date()
        }
      ];
      setMessages(initialMessages);
    }
  }, [isOpen, generatedContent, recommendationTitle]);

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const formatGeneratedContent = (content: any) => {
    let formatted = `**${content.type}**\n\n`;
    
    Object.entries(content.content).map(([key, value]) => {
      formatted += `**${key.replace(/([A-Z])/g, ' $1').toUpperCase()}:**\n`;
      if (Array.isArray(value)) {
        formatted += value.map(item => `• ${item}`).join('\n') + '\n\n';
      } else {
        formatted += `${value}\n\n`;
      }
    });
    
    return formatted;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('modify') || input.includes('change') || input.includes('edit')) {
      return "I can help you modify this content! Could you be more specific about what changes you'd like to make? For example:\n\n• Change the tone or style\n• Add more details to specific sections\n• Adjust the technical complexity\n• Focus on different aspects";
    }
    
    if (input.includes('implement') || input.includes('how to') || input.includes('steps')) {
      return "Here's how to implement this recommendation:\n\n1. **Review the generated content** - Make sure it aligns with your brand voice\n2. **Customize for your needs** - Adapt the content to your specific use case\n3. **Test implementation** - Start with a small section before full deployment\n4. **Monitor performance** - Track engagement and AI visibility improvements\n\nWould you like me to elaborate on any of these steps?";
    }
    
    if (input.includes('seo') || input.includes('optimization')) {
      return "This content is optimized for AI visibility! Key SEO benefits:\n\n• **Structured data** improves AI understanding\n• **Natural language patterns** match user queries\n• **Comprehensive coverage** increases topic authority\n• **FAQ format** captures long-tail searches\n\nThis should help improve your rankings in AI-powered search results!";
    }
    
    if (input.includes('competitor') || input.includes('advantage')) {
      return "Great question! This content gives you competitive advantages by:\n\n• **First-mover advantage** in AI-optimized content\n• **Comprehensive coverage** that competitors might miss\n• **Authority building** through detailed, helpful information\n• **Better AI citations** due to structured approach\n\nYou'll be ahead of competitors who haven't optimized for AI yet!";
    }
    
    return "I'm here to help you with this content! You can ask me about:\n\n• Implementation details\n• Customization options\n• SEO optimization\n• Competitive advantages\n• Technical requirements\n\nWhat would you like to know more about?";
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 bg-gradient-to-br from-background via-background to-primary/5 border-primary/20 shadow-2xl">
        {/* Enhanced Header */}
        <DialogHeader className="relative p-6 border-b bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50"></div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-20 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/30 backdrop-blur-sm">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Content Assistant
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat about your generated content
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                AI Generated
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-success/10 to-success/20 text-success border-success/30">
                <Zap className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Enhanced Chat Area */}
        <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-background/50 to-muted/20" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`flex animate-fade-in ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex space-x-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Enhanced Avatars */}
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${
                      message.type === 'user' ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gradient-to-r from-accent to-primary'
                    }`}></div>
                    <Avatar className="w-10 h-10 relative border-2 border-white/20 shadow-lg">
                      <AvatarFallback className={`${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-primary/20 to-accent/20 text-primary' 
                          : 'bg-gradient-to-br from-accent/20 to-primary/20 text-accent'
                      }`}>
                        {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Enhanced Message Bubbles */}
                  <div className={`relative rounded-2xl p-4 shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/30 ml-auto' 
                      : message.type === 'system'
                      ? 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 text-accent'
                      : 'bg-gradient-to-br from-muted/80 to-muted/60 border-border/30'
                  }`}>
                    {/* Message decoration */}
                    {message.type === 'ai' && (
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse"></div>
                    )}
                    
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    
                    {/* Enhanced Action Buttons */}
                    {message.type === 'ai' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                        <div className="flex items-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-3 text-xs hover:bg-white/10 transition-all duration-200 hover:scale-105"
                            onClick={() => copyContent(message.content)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs hover:bg-white/10 hover:text-success transition-all duration-200">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs hover:bg-white/10 hover:text-destructive transition-all duration-200">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-4 max-w-[85%]">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-gradient-to-r from-accent to-primary"></div>
                    <Avatar className="w-10 h-10 relative border-2 border-white/20 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-accent/20 to-primary/20 text-accent">
                        <Bot className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-gradient-to-br from-muted/80 to-muted/60 rounded-2xl p-4 shadow-lg border border-border/30">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="p-6 border-t bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-sm">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about this content, request modifications, or get implementation help..."
                className="pr-12 h-12 bg-background/80 border-primary/20 focus:border-primary/40 rounded-xl transition-all duration-200"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Stars className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              className="h-12 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Press Enter to send • Ask for modifications, implementation help, or SEO advice
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};