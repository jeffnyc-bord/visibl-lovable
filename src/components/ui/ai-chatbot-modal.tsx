import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Send, Copy, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
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
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">AI Content Assistant</DialogTitle>
              <p className="text-sm text-muted-foreground">Chat about your generated content</p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.type === 'user' ? 'bg-primary/10' : 'bg-accent/10'}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'system'
                      ? 'bg-accent/20 border border-accent/30'
                      : 'bg-muted'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-border/20">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 px-2 text-xs"
                          onClick={() => copyContent(message.content)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-[80%]">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-accent/10">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about this content, request modifications, or get implementation help..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Ask for modifications, implementation help, or SEO advice
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};