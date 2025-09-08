import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Sparkles } from "lucide-react";

interface SuggestPromptsDialogProps {
  brandName?: string;
  onPromptsSelected?: (prompts: Array<{ prompt: string }>) => void;
}

export const SuggestPromptsDialog = ({ brandName = "Nike", onPromptsSelected }: SuggestPromptsDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [selectedPrompts, setSelectedPrompts] = React.useState<string[]>([]);

  const suggestedPrompts = [
    {
      id: "1",
      prompt: `What are the best ${brandName} shoes for running?`,
      description: "Tests brand visibility in product recommendation queries",
      color: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200"
    },
    {
      id: "2", 
      prompt: `Compare ${brandName} vs Adidas running shoes`,
      description: "Evaluates competitive positioning against main rivals",
      color: "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200"
    },
    {
      id: "3",
      prompt: `What makes ${brandName} innovative in athletic footwear?`,
      description: "Assesses brand perception around innovation and technology",
      color: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200"
    },
    {
      id: "4",
      prompt: `Best sustainable athletic shoes from ${brandName}`,
      description: "Tests visibility around sustainability initiatives",
      color: "bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-200"
    },
    {
      id: "5",
      prompt: `${brandName} Air Max technology benefits`,
      description: "Evaluates product-specific technology recognition",
      color: "bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-200"
    },
    {
      id: "6",
      prompt: `Most popular ${brandName} basketball shoes 2024`,
      description: "Tests current product trend awareness",
      color: "bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-indigo-200"
    },
    {
      id: "7",
      prompt: `${brandName} shoes for wide feet comfort`,
      description: "Assesses brand mention in specific user needs",
      color: "bg-gradient-to-r from-green-500/10 to-lime-500/10 border-green-200"
    },
    {
      id: "8",
      prompt: `Where to buy authentic ${brandName} shoes online`,
      description: "Tests visibility in purchase-related queries",
      color: "bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200"
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
        prompt: p.prompt
      }));

    onPromptsSelected?.(selectedPromptData);
    
    toast({
      title: "Prompts Added",
      description: `${selectedPrompts.length} suggested prompts have been added successfully.`,
    });

    setSelectedPrompts([]);
    setOpen(false);
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
                className={`relative p-4 border rounded-lg transition-all cursor-pointer hover:shadow-sm ${
                  selectedPrompts.includes(prompt.id) 
                    ? `${prompt.color} border-primary` 
                    : 'border-border hover:border-border/60'
                }`}
                onClick={() => handlePromptToggle(prompt.id)}
              >
                {/* Colorful accent dot */}
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                  selectedPrompts.includes(prompt.id) ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedPrompts.includes(prompt.id)}
                    onChange={() => handlePromptToggle(prompt.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2 pr-6">
                    <p className="font-medium text-sm leading-relaxed">{prompt.prompt}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{prompt.description}</p>
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