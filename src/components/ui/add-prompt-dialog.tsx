import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface AddPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (promptText: string) => void;
}

export const AddPromptDialog = ({ open, onOpenChange, onAdd }: AddPromptDialogProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }

    onAdd(prompt.trim());
    
    // Reset form
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Add Custom Prompt</span>
          </DialogTitle>
          <DialogDescription>
            Create a custom prompt to test your product visibility across AI platforms.
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
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!prompt.trim()}
            >
              Add Prompt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};