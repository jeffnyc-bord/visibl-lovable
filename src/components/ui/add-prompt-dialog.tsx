import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, X, Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface AddPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (promptText: string) => void;
  promptsUsed?: number;
  maxPrompts?: number;
}

export const AddPromptDialog = ({ 
  open, 
  onOpenChange, 
  onAdd,
  promptsUsed = 4,
  maxPrompts = 5
}: AddPromptDialogProps) => {
  const { toast } = useToast();
  const { tier } = useSubscription();
  const [prompt, setPrompt] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const usagePercent = (promptsUsed / maxPrompts) * 100;
  const isNearLimit = usagePercent >= 80;

  // Reset states when dialog closes
  React.useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
      setShowSuccess(false);
      setPrompt("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Show success state, then close
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    onAdd(prompt.trim());
    setPrompt("");
    setShowSuccess(false);
  };

  const handleClose = () => {
    if (isSubmitting || showSuccess) return;
    setPrompt("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-foreground/20 backdrop-blur-sm" />
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div 
            className="w-full max-w-lg animate-in slide-in-from-bottom-8 duration-300 ease-out"
            style={{
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* macOS Sequoia Sheet Modal */}
            <div 
              className="relative rounded-[20px] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Success Overlay */}
              {showSuccess && (
                <div 
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95 animate-in fade-in duration-300"
                  style={{
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {/* Success checkmark with ring animation */}
                  <div className="relative mb-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 71% 45%) 100%)',
                        boxShadow: '0 0 0 0 hsla(142, 76%, 36%, 0.4)',
                        animation: 'successPulse 1s ease-out'
                      }}
                    >
                      <Check 
                        className="w-8 h-8 text-white" 
                        style={{
                          animation: 'checkDraw 0.4s ease-out 0.1s both'
                        }}
                      />
                    </div>
                  </div>
                  
                  <h3 
                    className="text-lg font-semibold text-foreground mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, sans-serif',
                      animationDelay: '0.15s',
                      animationFillMode: 'both'
                    }}
                  >
                    Added to Queue
                  </h3>
                  <p 
                    className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      animationDelay: '0.25s',
                      animationFillMode: 'both'
                    }}
                  >
                    Your prompt is now being analyzed
                  </p>
                  
                  {/* Animated queue indicator */}
                  <div 
                    className="mt-6 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ 
                      animationDelay: '0.35s',
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex -space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i}
                          className="w-2 h-2 rounded-full bg-primary/60"
                          style={{
                            animation: `queueDot 0.6s ease-in-out ${i * 0.1}s infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                    <span 
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                    >
                      Processing...
                    </span>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  disabled={isSubmitting || showSuccess}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Title with Sparkles */}
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-foreground/70" />
                  <h2 
                    className="text-lg font-semibold text-foreground tracking-tight"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, sans-serif' }}
                  >
                    New Intelligence Prompt
                  </h2>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="px-6 pb-6">
                {/* Prompt Text Area - Borderless */}
                <div className="relative mb-6">
                  <Textarea
                    placeholder="What would you like to ask the AI about your brand?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isSubmitting || showSuccess}
                    className="min-h-[140px] resize-none border-0 bg-transparent p-0 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      caretColor: 'hsl(211, 100%, 50%)', // System Blue cursor
                      fontSize: '15px',
                      lineHeight: '1.5'
                    }}
                  />
                  {/* Selection highlight would naturally use System Blue via browser defaults */}
                </div>

                {/* Bottom Bar: Capacity Meter + Actions */}
                <div className="flex flex-col gap-4">
                  {/* Top row: Capacity + Nudge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {/* Thin Progress Bar */}
                      <div className="w-16 h-1 bg-muted/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${usagePercent}%`,
                            backgroundColor: isNearLimit ? 'hsl(var(--destructive))' : 'hsl(var(--foreground) / 0.4)'
                          }}
                        />
                      </div>
                      <span 
                        className="text-xs text-muted-foreground whitespace-nowrap"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        {promptsUsed}/{maxPrompts} Prompts Used
                      </span>
                    </div>
                    
                    {/* Nudge for near limit */}
                    {isNearLimit && (
                      <button
                        type="button"
                        onClick={() => {
                          toast({
                            title: "Upgrade to Pro",
                            description: "Get unlimited prompts and more AI platforms.",
                          });
                        }}
                        className="text-xs text-primary hover:underline underline-offset-2 transition-all"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                      >
                        Need more coverage? Unlock more prompts.
                      </button>
                    )}
                  </div>

                  {/* Bottom row: Action Buttons - Right aligned */}
                  <div className="flex items-center justify-end gap-4">
                    {/* Cancel - Ghost with underline on hover */}
                    <button 
                      type="button" 
                      onClick={handleClose}
                      disabled={isSubmitting || showSuccess}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground relative group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif' }}
                    >
                      Cancel
                      <span className="absolute bottom-1.5 left-4 right-4 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </button>

                    {/* Save & Run - High-gloss black pill */}
                    <button 
                      type="submit" 
                      disabled={!prompt.trim() || isSubmitting || showSuccess}
                      className="px-6 py-2.5 rounded-full text-sm font-medium text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap flex items-center gap-2"
                      style={{ 
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        background: prompt.trim() && !isSubmitting
                          ? 'linear-gradient(180deg, hsl(0 0% 15%) 0%, hsl(0 0% 9%) 100%)' 
                          : 'hsl(var(--muted))'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save & Run'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogPortal>
      
      {/* Custom keyframes for success animation */}
      <style>{`
        @keyframes successPulse {
          0% {
            box-shadow: 0 0 0 0 hsla(142, 76%, 36%, 0.6);
            transform: scale(0.8);
          }
          50% {
            box-shadow: 0 0 0 20px hsla(142, 76%, 36%, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 hsla(142, 76%, 36%, 0);
            transform: scale(1);
          }
        }
        
        @keyframes checkDraw {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes queueDot {
          0% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </Dialog>
  );
};
