import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Check,
  Copy,
  Code2,
  FileText,
  Link2,
  ExternalLink,
  Users,
  CheckCircle2,
  Crown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  initials: string;
  color: string;
  text: string;
  timestamp: string;
}

interface ReviewHandoffPanelProps {
  content: {
    title: string;
    h1: string;
    tldr: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
  };
  onStatusChange?: (status: 'draft' | 'ready' | 'approved') => void;
}

// Haptic success checkmark animation component
const HapticSuccessAnimation = ({ onComplete }: { onComplete: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 frosted-glass-vibrant"
    >
      <div className="relative animate-haptic-success">
        {/* Ripple effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-success/20 animate-haptic-ripple" />
        </div>
        
        {/* Circle and checkmark */}
        <svg width="96" height="96" viewBox="0 0 96 96" className="relative z-10">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="3"
            className="animate-haptic-circle"
          />
          <path
            d="M28 50 L42 64 L68 38"
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-haptic-checkmark"
          />
        </svg>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-1/3 text-lg font-medium text-foreground"
      >
        Content Approved
      </motion.p>
    </motion.div>
  );
};

// Preview link limit upsell component
const PreviewLinkLimitSheet = ({ 
  isOpen, 
  onClose, 
  currentCount 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  currentCount: number;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/60 frosted-glass"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-foreground">Preview Limit Reached</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          You've reached your preview limit ({currentCount}/3 active links). 
          Upgrade to Pro for unlimited shareable links and full team collaboration features.
        </p>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button size="sm" className="flex-1 gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Pro
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ReviewHandoffPanel = ({ content, onStatusChange }: ReviewHandoffPanelProps) => {
  const { toast } = useToast();
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [isReadyForImplementation, setIsReadyForImplementation] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [previewLinksCount, setPreviewLinksCount] = useState(2);
  const [showLimitSheet, setShowLimitSheet] = useState(false);
  
  // Mock comments for demonstration
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      initials: 'SC',
      color: 'bg-violet-500',
      text: 'The opening could be stronger. Consider leading with the key differentiator.',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: 'Mike Torres',
      initials: 'MT',
      color: 'bg-emerald-500',
      text: 'Love the comparison section. Very compelling.',
      timestamp: '1 hour ago'
    }
  ]);

  const generateHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
</head>
<body>
  <article>
    <h1>${content.h1}</h1>
    <p class="tldr"><strong>TL;DR:</strong> ${content.tldr}</p>
    ${content.sections.map(s => `
    <section>
      <h2>${s.heading}</h2>
      <p>${s.content}</p>
    </section>`).join('')}
  </article>
</body>
</html>`;
    return html;
  };

  const generateMarkdown = () => {
    const md = `# ${content.h1}

**TL;DR:** ${content.tldr}

${content.sections.map(s => `## ${s.heading}

${s.content}`).join('\n\n')}`;
    return md;
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generateHTML());
    toast({
      title: "Copied as HTML",
      description: "Clean HTML ready for your CMS.",
    });
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast({
      title: "Copied as Markdown",
      description: "Markdown copied to clipboard.",
    });
  };

  const handleCreatePreviewLink = () => {
    if (previewLinksCount >= 3) {
      setShowLimitSheet(true);
      return;
    }
    
    setPreviewLinksCount(prev => prev + 1);
    toast({
      title: "Preview Link Created",
      description: "Share this link with stakeholders for approval.",
    });
  };

  const handleSignOff = () => {
    setShowSuccessAnimation(true);
    onStatusChange?.('approved');
  };

  const handleReadyToggle = (checked: boolean) => {
    setIsReadyForImplementation(checked);
    onStatusChange?.(checked ? 'ready' : 'draft');
    
    if (checked) {
      toast({
        title: "Marked as Ready",
        description: "This action has been logged.",
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSuccessAnimation && (
          <HapticSuccessAnimation onComplete={() => setShowSuccessAnimation(false)} />
        )}
        {showLimitSheet && (
          <PreviewLinkLimitSheet 
            isOpen={showLimitSheet} 
            onClose={() => setShowLimitSheet(false)}
            currentCount={previewLinksCount}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Export Actions */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
            <Copy className="w-3 h-3" />
            Export
          </div>
          <div className="space-y-2">
            <button
              onClick={handleCopyHTML}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-medium text-foreground">Copy as HTML</div>
                <div className="text-[10px] text-muted-foreground">CMS-ready markup</div>
              </div>
              <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-medium text-foreground">Copy as Markdown</div>
                <div className="text-[10px] text-muted-foreground">Universal format</div>
              </div>
              <Copy className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={handleCreatePreviewLink}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-medium text-foreground">Create Preview Link</div>
                <div className="text-[10px] text-muted-foreground">
                  {previewLinksCount}/3 links used
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Thin rule separator */}
        <div className="thin-rule border-t" />

        {/* Collaboration */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
            <Users className="w-3 h-3" />
            Collaboration
          </div>
          
          {/* Comments Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Comments</span>
              {comments.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-medium">
                  {comments.length}
                </span>
              )}
            </div>
            <Switch
              checked={commentsEnabled}
              onCheckedChange={setCommentsEnabled}
              className="scale-75"
            />
          </div>

          {/* Comments List */}
          <AnimatePresence>
            {commentsEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-card border border-border/50 animate-comment-bubble"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white",
                        comment.color
                      )}>
                        {comment.initials}
                      </div>
                      <span className="text-xs font-medium text-foreground">{comment.author}</span>
                      <span className="text-[10px] text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {comment.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thin rule separator */}
        <div className="thin-rule border-t" />

        {/* Status & Approval */}
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
            <CheckCircle2 className="w-3 h-3" />
            Status
          </div>

          {/* Ready Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30 mb-3">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isReadyForImplementation ? "bg-success animate-status-pulse" : "bg-muted-foreground/30"
              )} />
              <span className="text-xs font-medium text-foreground">Ready for Implementation</span>
            </div>
            <Switch
              checked={isReadyForImplementation}
              onCheckedChange={handleReadyToggle}
              className="scale-75"
            />
          </div>

          {/* Sign-off Button */}
          <Button
            onClick={handleSignOff}
            disabled={!isReadyForImplementation}
            className={cn(
              "w-full gap-2 transition-all",
              isReadyForImplementation 
                ? "bg-success hover:bg-success/90 text-success-foreground" 
                : "opacity-50"
            )}
          >
            <Check className="w-4 h-4" />
            Sign Off & Approve
          </Button>

          {!isReadyForImplementation && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Toggle "Ready for Implementation" to enable approval
            </p>
          )}
        </div>
      </div>
    </>
  );
};
