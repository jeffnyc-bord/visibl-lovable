import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Plus } from "lucide-react";

interface AddPromptDialogProps {
  onPromptAdded?: (prompt: { prompt: string; category: string; priority: string; queued: boolean }) => void;
}

export const AddPromptDialog = ({ onPromptAdded }: AddPromptDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !category || !priority) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newPrompt = {
      prompt: prompt.trim(),
      category,
      priority,
      queued: true, // New prompts are automatically queued
    };

    onPromptAdded?.(newPrompt);
    
    toast({
      title: "Prompt Added to Queue",
      description: "Your custom prompt has been queued for the next analysis run.",
    });

    // Reset form and close dialog
    setPrompt("");
    setCategory("");
    setPriority("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span>Add Prompt</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Add Custom Prompt</span>
          </DialogTitle>
          <DialogDescription>
            Create a custom prompt to test your brand visibility across AI platforms.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt Text *</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your custom prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              Tip: Make your prompt specific and actionable for better AI responses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product Comparison</SelectItem>
                  <SelectItem value="brand">Brand Awareness</SelectItem>
                  <SelectItem value="feature">Feature Inquiry</SelectItem>
                  <SelectItem value="recommendation">Recommendation</SelectItem>
                  <SelectItem value="review">Reviews & Ratings</SelectItem>
                  <SelectItem value="general">General Query</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={priority} onValueChange={setPriority} required>
                <SelectTrigger>
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!prompt.trim() || !category || !priority}
          >
            Add Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};