import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Sparkles, TrendingUp, Target, Star, Zap } from "lucide-react";

interface SuggestPromptsDialogProps {
  brandName?: string;
  onPromptsSelected?: (prompts: Array<{ prompt: string; category: string; priority: string }>) => void;
}

export const SuggestPromptsDialog = ({ brandName = "Nike", onPromptsSelected }: SuggestPromptsDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [selectedPrompts, setSelectedPrompts] = React.useState<string[]>([]);

  const suggestedPrompts = [
    {
      id: "1",
      prompt: `What are the best ${brandName} shoes for running?`,
      category: "Product Recommendation",
      priority: "high",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Tests brand visibility in product recommendation queries"
    },
    {
      id: "2", 
      prompt: `Compare ${brandName} vs Adidas running shoes`,
      category: "Brand Comparison",
      priority: "high",
      icon: <Target className="w-4 h-4" />,
      description: "Evaluates competitive positioning against main rivals"
    },
    {
      id: "3",
      prompt: `What makes ${brandName} innovative in athletic footwear?`,
      category: "Brand Innovation",
      priority: "medium",
      icon: <Zap className="w-4 h-4" />,
      description: "Assesses brand perception around innovation and technology"
    },
    {
      id: "4",
      prompt: `Best sustainable athletic shoes from ${brandName}`,
      category: "Sustainability",
      priority: "medium", 
      icon: <Star className="w-4 h-4" />,
      description: "Tests visibility around sustainability initiatives"
    },
    {
      id: "5",
      prompt: `${brandName} Air Max technology benefits`,
      category: "Product Features",
      priority: "high",
      icon: <Sparkles className="w-4 h-4" />,
      description: "Evaluates product-specific technology recognition"
    },
    {
      id: "6",
      prompt: `Most popular ${brandName} basketball shoes 2024`,
      category: "Product Trends",
      priority: "medium",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Tests current product trend awareness"
    },
    {
      id: "7",
      prompt: `${brandName} shoes for wide feet comfort`,
      category: "Product Fit",
      priority: "low",
      icon: <Target className="w-4 h-4" />,
      description: "Assesses brand mention in specific user needs"
    },
    {
      id: "8",
      prompt: `Where to buy authentic ${brandName} shoes online`,
      category: "Purchase Intent",
      priority: "high",
      icon: <Star className="w-4 h-4" />,
      description: "Tests visibility in purchase-related queries"
    }
  ];

  const handlePromptToggle = (promptId: string) => {
    setSelectedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPrompts.length === suggestedPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(suggestedPrompts.map(p => p.id));
    }
  };

  const handleAddSelected = () => {
    if (selectedPrompts.length === 0) {
      toast({
        title: "No Prompts Selected",
        description: "Please select at least one prompt to add.",
        variant: "destructive",
      });
      return;
    }

    const selectedPromptData = suggestedPrompts
      .filter(p => selectedPrompts.includes(p.id))
      .map(p => ({
        prompt: p.prompt,
        category: p.category,
        priority: p.priority
      }));

    onPromptsSelected?.(selectedPromptData);
    
    toast({
      title: "Prompts Added",
      description: `${selectedPrompts.length} suggested prompts have been added successfully.`,
    });

    setSelectedPrompts([]);
    setOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>Suggest Prompts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI-Suggested Prompts for {brandName}</span>
          </DialogTitle>
          <DialogDescription>
            Choose from curated prompts designed to test your brand's AI visibility across different query types and scenarios.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-muted-foreground">
            {selectedPrompts.length} of {suggestedPrompts.length} prompts selected
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedPrompts.length === suggestedPrompts.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {suggestedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${
                  selectedPrompts.includes(prompt.id) 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-border hover:border-border/60'
                }`}
                onClick={() => handlePromptToggle(prompt.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedPrompts.includes(prompt.id)}
                    onChange={() => handlePromptToggle(prompt.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-primary/80 to-primary/20 rounded-full"></div>
                      <p className="font-medium text-sm pl-4">{prompt.prompt}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">{prompt.description}</p>
                    <div className="flex items-center pl-4">
                      <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
                      <div className="text-xs text-muted-foreground">AI-curated suggestion</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddSelected}
            disabled={selectedPrompts.length === 0}
          >
            Add {selectedPrompts.length} Selected Prompts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};