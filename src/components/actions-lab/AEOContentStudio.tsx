import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Sparkles,
  Link2,
  Type,
  List,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Brain,
  Hash,
  AlertCircle,
  Plus,
  Image,
  Quote,
  Trash2,
  GripVertical,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Share2,
  Code2,
  FileText,
  ExternalLink,
  Copy,
  X,
  MessageCircle,
  Send,
  Save,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Pencil, Eye } from 'lucide-react';
import { PromptSource } from './PromptSourceSelector';
import { ContentType } from './ContentTypeSelector';
import { ReviewHandoffPanel } from './ReviewHandoffPanel';
import { useToast } from '@/hooks/use-toast';

// Inline annotation types
interface AnnotationReply {
  id: string;
  comment: string;
  author: string;
  authorInitials: string;
  timestamp: Date;
}

interface InlineAnnotation {
  id: string;
  selectedText: string;
  comment: string;
  author: string;
  authorInitials: string;
  timestamp: Date;
  position: { top: number; left: number };
  resolved: boolean;
  replies: AnnotationReply[];
}

// Floating annotation bubble component
const InlineAnnotationBubble = ({
  position,
  onSubmit,
  onClose,
  selectedText
}: {
  position: { top: number; left: number };
  onSubmit: (comment: string) => void;
  onClose: () => void;
  selectedText: string;
}) => {
  const [comment, setComment] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="fixed z-[100] bg-popover rounded-lg shadow-lg border border-border w-64"
      style={{ top: position.top + 24, left: Math.max(16, Math.min(position.left - 128, window.innerWidth - 280)) }}
    >
      <div className="p-3">
        <textarea
          ref={inputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-0 py-0 text-sm bg-transparent border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === 'Escape') {
              onClose();
            }
          }}
        />
      </div>

      <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-border/50">
        <button
          onClick={onClose}
          className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </div>
    </motion.div>
  );
};

// Annotation marker component (shows in margin)
const AnnotationMarker = ({
  annotation,
  onClick,
  isActive
}: {
  annotation: InlineAnnotation;
  onClick: () => void;
  isActive: boolean;
}) => (
  <motion.button
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={cn(
      "absolute -right-8 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer",
      isActive 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
        : "bg-primary/10 text-primary hover:bg-primary/20"
    )}
    style={{ top: annotation.position.top - 12 }}
    onClick={onClick}
    title={`Comment by ${annotation.author}`}
  >
    <MessageCircle className="w-3 h-3" />
  </motion.button>
);

// Annotation detail popover with reply threads
const AnnotationDetail = ({
  annotation,
  onResolve,
  onClose,
  onAddReply
}: {
  annotation: InlineAnnotation;
  onResolve: () => void;
  onClose: () => void;
  onAddReply: (reply: string) => void;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showReplyInput && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [showReplyInput]);

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onAddReply(replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  // Mock team members for demo variety
  const teamColors: Record<string, string> = {
    'Y': 'bg-primary/20 text-primary',
    'SC': 'bg-violet-500/20 text-violet-600',
    'MJ': 'bg-amber-500/20 text-amber-600',
    'AR': 'bg-emerald-500/20 text-emerald-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="absolute -right-80 top-0 w-80 frosted-glass-vibrant rounded-xl shadow-2xl border border-border/50 z-50 max-h-[400px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold",
            teamColors[annotation.authorInitials] || 'bg-primary/20 text-primary'
          )}>
            {annotation.authorInitials}
          </div>
          <div>
            <div className="text-xs font-medium text-foreground">{annotation.author}</div>
            <div className="text-[9px] text-muted-foreground">
              {annotation.timestamp.toLocaleDateString()} at {annotation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted/50">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Selected text */}
        <div className="mb-3 px-2 py-1.5 bg-primary/5 rounded-lg border-l-2 border-primary">
          <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{annotation.selectedText}"</p>
        </div>

        {/* Original Comment */}
        <p className="text-xs text-foreground leading-relaxed mb-3">{annotation.comment}</p>

        {/* Reply Thread */}
        {annotation.replies.length > 0 && (
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                {annotation.replies.length} {annotation.replies.length === 1 ? 'Reply' : 'Replies'}
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            
            {annotation.replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="pl-3 border-l-2 border-muted"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold",
                    teamColors[reply.authorInitials] || 'bg-primary/20 text-primary'
                  )}>
                    {reply.authorInitials}
                  </div>
                  <span className="text-[10px] font-medium text-foreground">{reply.author}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {reply.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{reply.comment}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reply Input */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2"
            >
              <textarea
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 text-xs bg-muted/30 border border-border/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                  if (e.key === 'Escape') {
                    setShowReplyInput(false);
                    setReplyText('');
                  }
                }}
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText('');
                  }}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                  className="h-6 px-2.5 gap-1 text-[10px]"
                >
                  <Send className="w-2.5 h-2.5" />
                  Reply
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between p-3 pt-2 border-t border-border/30">
        {!showReplyInput ? (
          <button
            onClick={() => setShowReplyInput(true)}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Reply
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onResolve}
          className="flex items-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <CheckCircle2 className="w-3 h-3" />
          Resolve
        </button>
      </div>
    </motion.div>
  );
};

interface GeneratedSection {
  id: string;
  type: 'text' | 'image' | 'list' | 'quote';
  heading: string;
  content: string;
  imageUrl?: string;
  isAiGenerated: boolean;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    headingLevel?: 'h2' | 'h3';
  };
}

interface GeneratedContent {
  title: string;
  urlSlug: string;
  h1: string;
  tldr: string;
  sections: GeneratedSection[];
  entities: string[];
}

interface AEOContentStudioProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: PromptSource | null;
  contentType: ContentType | null;
  productName?: string;
  onPublish?: () => void;
}

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 30, startDelay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const startTimeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setIsComplete(true);
        }
      }, speed);
      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
};

// Editable text component with Apple-like styling
const EditableText = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder = '',
  multiline = false,
  showSparkle = false,
  disabled = false
}: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  showSparkle?: boolean;
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing && !disabled) {
    const Component = multiline ? 'textarea' : 'input';
    return (
      <Component
        ref={inputRef as any}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-transparent border-0 outline-none ring-2 ring-primary/30 rounded-md px-2 py-1 -mx-2 -my-1",
          "focus:ring-primary/50 transition-all",
          multiline && "resize-none min-h-[100px]",
          className
        )}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
      />
    );
  }

  return (
    <span 
      onClick={() => !disabled && setIsEditing(true)}
      className={cn(
        "rounded px-2 py-1 -mx-2 -my-1 transition-colors group relative inline-block",
        !disabled && "cursor-text hover:bg-muted/50",
        disabled && "cursor-default select-text",
        className
      )}
    >
      {value || <span className="text-muted-foreground/50">{placeholder}</span>}
      {showSparkle && !disabled && (
        <Sparkles className="w-3.5 h-3.5 text-primary/40 absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </span>
  );
};

export const AEOContentStudio = ({
  isOpen,
  onClose,
  prompt,
  contentType,
  productName,
  onPublish
}: AEOContentStudioProps) => {
  const [schemaEnabled, setSchemaEnabled] = useState(true);
  const [entityVerification, setEntityVerification] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [contentStatus, setContentStatus] = useState<'draft' | 'ready' | 'approved'>('draft');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const shareSheetRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mode: 'edit' for editing content, 'review' for commenting
  const [studioMode, setStudioMode] = useState<'edit' | 'review'>('edit');

  // Inline annotation state
  const [annotations, setAnnotations] = useState<InlineAnnotation[]>([]);
  const [showAnnotationBubble, setShowAnnotationBubble] = useState(false);
  const [annotationPosition, setAnnotationPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  // Handle text selection for annotations - only in review mode
  const handleTextSelection = useCallback(() => {
    // Only allow annotations in review mode
    if (studioMode !== 'review') return;
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Only trigger if selection is within content area
      if (contentAreaRef.current?.contains(range.commonAncestorContainer as Node)) {
        setSelectedText(selection.toString().trim());
        setAnnotationPosition({
          top: rect.top,
          left: rect.left + rect.width / 2
        });
        setShowAnnotationBubble(true);
      }
    }
  }, [studioMode]);

  // Add annotation
  const handleAddAnnotation = useCallback((comment: string) => {
    const newAnnotation: InlineAnnotation = {
      id: Date.now().toString(),
      selectedText,
      comment,
      author: 'You',
      authorInitials: 'Y',
      timestamp: new Date(),
      position: { top: annotationPosition.top - (contentAreaRef.current?.getBoundingClientRect().top || 0), left: annotationPosition.left },
      resolved: false,
      replies: []
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    setShowAnnotationBubble(false);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
    toast({ title: "Comment added", description: "Your annotation has been saved." });
  }, [selectedText, annotationPosition, toast]);

  // Add reply to annotation
  const handleAddReply = useCallback((annotationId: string, replyComment: string) => {
    const newReply: AnnotationReply = {
      id: Date.now().toString(),
      comment: replyComment,
      author: 'You',
      authorInitials: 'Y',
      timestamp: new Date()
    };
    setAnnotations(prev => prev.map(a => 
      a.id === annotationId 
        ? { ...a, replies: [...a.replies, newReply] }
        : a
    ));
    toast({ title: "Reply added", description: "Your reply has been posted." });
  }, [toast]);

  // Resolve annotation
  const handleResolveAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setActiveAnnotationId(null);
    toast({ title: "Comment resolved", description: "The annotation has been removed." });
  }, [toast]);

  // Listen for mouseup to detect selection
  useEffect(() => {
    const handleMouseUp = () => {
      // Small delay to allow selection to complete
      setTimeout(handleTextSelection, 10);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleTextSelection]);

  // Close annotation bubble on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showAnnotationBubble) {
        const target = e.target as HTMLElement;
        if (!target.closest('.annotation-bubble')) {
          setShowAnnotationBubble(false);
          setSelectedText('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAnnotationBubble]);
  
  // Editable content state
  const [content, setContent] = useState<GeneratedContent>({
    title: `${productName || 'Your Product'} vs Competitors: A Comprehensive Guide`,
    urlSlug: `${productName?.toLowerCase().replace(/\s+/g, '-') || 'product'}-comparison-guide`,
    h1: `Why ${productName || 'Your Product'} Stands Out in ${contentType === 'comparison' ? 'Direct Comparisons' : 'the Market'}`,
    tldr: `${productName || 'Your Product'} offers superior performance in key areas including comfort, durability, and value. Unlike competitors, it features proprietary technology that delivers measurable results.`,
    sections: [
      {
        id: '1',
        type: 'text',
        heading: 'What Makes Us Different',
        content: `When comparing ${productName || 'our product'} to alternatives, three key differentiators emerge: innovative design, proven performance metrics, and exceptional customer satisfaction scores.`,
        isAiGenerated: true
      },
      {
        id: '2',
        type: 'text',
        heading: 'Performance Comparison',
        content: `In side-by-side testing, ${productName || 'our product'} consistently outperforms the competition. Our proprietary technology delivers 40% better efficiency while maintaining quality standards.`,
        isAiGenerated: true
      },
      {
        id: '3',
        type: 'text',
        heading: 'Customer Testimonials',
        content: `"I switched from a competitor and the difference was immediately noticeable. The attention to detail exceeded my expectations." — Verified Customer`,
        isAiGenerated: true
      }
    ],
    entities: [productName || 'Product', 'Performance', 'Quality', 'Innovation']
  });

  // Typewriter effects
  const { displayedText: titleText, isComplete: titleComplete } = useTypewriter(content.title, 25, 500);
  const { displayedText: slugText, isComplete: slugComplete } = useTypewriter(content.urlSlug, 20, 1200);
  const { displayedText: h1Text, isComplete: h1Complete } = useTypewriter(content.h1, 20, 2000);
  const { displayedText: tldrText, isComplete: tldrComplete } = useTypewriter(content.tldr, 15, 2800);

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(true);
      const timer = setTimeout(() => setIsGenerating(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
    toast({ title: "Copied as HTML", description: "Clean HTML ready for your CMS." });
    setShowShareSheet(false);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    toast({ title: "Copied as Markdown", description: "Markdown copied to clipboard." });
    setShowShareSheet(false);
  };

  const handleCreatePreviewLink = () => {
    toast({ title: "Preview Link Created", description: "Share this link with stakeholders." });
    setShowShareSheet(false);
  };

  // Close share sheet on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareSheetRef.current && !shareSheetRef.current.contains(event.target as Node)) {
        setShowShareSheet(false);
      }
    };
    if (showShareSheet) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showShareSheet]);

  const updateSection = (id: string, field: 'heading' | 'content', value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map((s) => 
        s.id === id ? { ...s, [field]: value, isAiGenerated: false } : s
      )
    }));
    setHasUnsavedChanges(true);
  };

  // Save content handler
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation (in real app, this would persist to backend)
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    toast({ 
      title: "Changes saved", 
      description: "Your content has been saved successfully." 
    });
  };

  // Track content changes for unsaved indicator
  useEffect(() => {
    if (!isGenerating && lastSaved === null) {
      // Don't mark as unsaved during initial generation
      return;
    }
  }, [content, isGenerating, lastSaved]);

  const addSection = (type: 'text' | 'image' | 'list' | 'quote') => {
    const newSection: GeneratedSection = {
      id: Date.now().toString(),
      type,
      heading: type === 'image' ? '' : 'New Section',
      content: type === 'list' ? 'Item 1\nItem 2\nItem 3' : '',
      imageUrl: type === 'image' ? '' : undefined,
      isAiGenerated: false
    };
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setShowAddMenu(false);
    setHasUnsavedChanges(true);
  };

  const deleteSection = (id: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const reorderSections = (newOrder: GeneratedSection[]) => {
    setContent(prev => ({
      ...prev,
      sections: newOrder
    }));
    setHasUnsavedChanges(true);
  };

  const toggleSectionStyle = (id: string, style: 'bold' | 'italic' | 'underline') => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id 
          ? { ...s, style: { ...s.style, [style]: !s.style?.[style] }, isAiGenerated: false }
          : s
      )
    }));
    setHasUnsavedChanges(true);
  };

  const setSectionHeadingLevel = (id: string, level: 'h2' | 'h3') => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id 
          ? { ...s, style: { ...s.style, headingLevel: s.style?.headingLevel === level ? undefined : level }, isAiGenerated: false }
          : s
      )
    }));
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Minimal Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-12 border-b border-border/30 bg-background flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Button>
            <span className="text-xs text-muted-foreground/60">|</span>
            <span className="text-xs text-muted-foreground">AEO Content Studio</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit / Review Mode Toggle */}
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
              <button
                onClick={() => setStudioMode('edit')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  studioMode === 'edit' 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setStudioMode('review')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  studioMode === 'review' 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="w-3 h-3" />
                Review
                {annotations.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                    {annotations.length}
                  </span>
                )}
              </button>
            </div>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 text-primary"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-xs">Generating...</span>
              </motion.div>
            )}

            {/* Status indicator */}
            {contentStatus !== 'draft' && (
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-medium",
                contentStatus === 'ready' && "bg-amber-500/10 text-amber-600",
                contentStatus === 'approved' && "bg-success/10 text-success"
              )}>
                {contentStatus === 'ready' ? 'Ready' : 'Approved'}
              </span>
            )}

            {/* Save Button with Status Indicator */}
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {lastSaved && !hasUnsavedChanges && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-1.5 text-success"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Saved</span>
                  </motion.div>
                )}
                {hasUnsavedChanges && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-muted-foreground"
                  >
                    Unsaved changes
                  </motion.span>
                )}
              </AnimatePresence>
              <Button
                onClick={handleSave}
                disabled={isGenerating || isSaving || (!hasUnsavedChanges && lastSaved !== null)}
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 gap-1.5 text-xs transition-all",
                  hasUnsavedChanges && "animate-pulse"
                )}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Save className="w-3.5 h-3.5" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </>
                )}
              </Button>
            </div>
            
            {/* Share Button with Sheet */}
            <div className="relative" ref={shareSheetRef}>
              <Button
                onClick={() => setShowShareSheet(!showShareSheet)}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>

              {/* Frosted Glass Share Sheet */}
              <AnimatePresence>
                {showShareSheet && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl border border-border/50 shadow-2xl frosted-glass-vibrant z-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-foreground">Export & Share</span>
                      <button 
                        onClick={() => setShowShareSheet(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="space-y-1.5">
                      <button
                        onClick={handleCopyHTML}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
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
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
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

                      <div className="thin-rule border-t my-2" />

                      <button
                        onClick={handleCreatePreviewLink}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Link2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-medium text-foreground">Create Preview Link</div>
                          <div className="text-[10px] text-muted-foreground">Shareable read-only URL</div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Main 3-Panel Layout */}
        <div className="flex h-[calc(100vh-3rem)]">
          
          {/* Left Panel - Structure */}
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-56 border-r border-border/30 p-4 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* AEO Status */}
              <div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-emerald-500/10 text-emerald-600 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">AEO Optimized</span>
                </div>
              </div>

              {/* Document Structure */}
              <div className="space-y-1 pt-2 border-t border-border/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2">
                  Structure
                </div>
                {[
                  { icon: Type, label: 'Title Tag' },
                  { icon: Hash, label: 'H1 Heading' },
                  { icon: List, label: `${content.sections.length} Sections` },
                  { icon: Link2, label: 'SEO URL' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />
                  </div>
                ))}
              </div>

              {/* Entities */}
              <div className="pt-2 border-t border-border/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2">
                  Key Entities
                </div>
                <div className="flex flex-wrap gap-1">
                  {content.entities.map((entity, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Center - The Canvas (Editable) */}
          <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 overflow-y-auto"
          >
            <div ref={contentAreaRef} className="max-w-2xl mx-auto py-16 px-12 relative">
              {/* Review mode indicator */}
              {studioMode === 'review' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8 text-center"
                >
                  <span className="text-[11px] text-muted-foreground">
                    Select text to add a comment
                  </span>
                </motion.div>
              )}

              {/* Inline Annotation Bubble - Only in review mode */}
              <AnimatePresence>
                {showAnnotationBubble && selectedText && studioMode === 'review' && (
                  <div className="annotation-bubble">
                    <InlineAnnotationBubble
                      position={annotationPosition}
                      selectedText={selectedText}
                      onSubmit={handleAddAnnotation}
                      onClose={() => {
                        setShowAnnotationBubble(false);
                        setSelectedText('');
                        window.getSelection()?.removeAllRanges();
                      }}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Annotation Markers in Margin - Only in review mode */}
              {studioMode === 'review' && annotations.map((annotation) => (
                <div key={annotation.id} className="relative">
                  <AnnotationMarker
                    annotation={annotation}
                    isActive={activeAnnotationId === annotation.id}
                    onClick={() => setActiveAnnotationId(
                      activeAnnotationId === annotation.id ? null : annotation.id
                    )}
                  />
                  <AnimatePresence>
                    {activeAnnotationId === annotation.id && (
                      <AnnotationDetail
                        annotation={annotation}
                        onResolve={() => handleResolveAnnotation(annotation.id)}
                        onClose={() => setActiveAnnotationId(null)}
                        onAddReply={(reply) => handleAddReply(annotation.id, reply)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {/* Meta */}
              <div className="mb-10 pb-6 border-b border-border/20">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-2">
                  SEO Title
                </div>
                {!titleComplete ? (
                  <h1 className="text-xl font-semibold text-foreground">
                    {titleText}
                    <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
                  </h1>
                ) : (
                  <EditableText
                    value={content.title}
                    onChange={(v) => setContent(prev => ({ ...prev, title: v }))}
                    className="text-xl font-semibold text-foreground block"
                    showSparkle
                    disabled={studioMode === 'review'}
                  />
                )}

                <div className="flex items-center gap-1 mt-3 text-xs font-mono">
                  <span className="text-muted-foreground/50">yourbrand.com/blog/</span>
                  {!slugComplete ? (
                    <span className="text-primary">
                      {slugText}
                      <span className="inline-block w-0.5 h-3 bg-primary ml-0.5 animate-pulse" />
                    </span>
                  ) : (
                    <EditableText
                      value={content.urlSlug}
                      onChange={(v) => setContent(prev => ({ ...prev, urlSlug: v }))}
                      className="text-primary"
                      disabled={studioMode === 'review'}
                    />
                  )}
                </div>
              </div>

              {/* H1 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: slugComplete ? 1 : 0.3 }}
                className="mb-8"
              >
                {!h1Complete ? (
                  <h2 className="text-2xl font-bold text-foreground">
                    {h1Text}
                    {slugComplete && <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-pulse" />}
                  </h2>
                ) : (
                  <EditableText
                    value={content.h1}
                    onChange={(v) => setContent(prev => ({ ...prev, h1: v }))}
                    className="text-2xl font-bold text-foreground block"
                    showSparkle
                    disabled={studioMode === 'review'}
                  />
                )}
              </motion.div>

              {/* TL;DR */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: h1Complete ? 1 : 0.3 }}
                className="mb-10 pl-4 border-l-2 border-primary/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">Quick Answer</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary uppercase">
                    AI Overview Ready
                  </span>
                </div>
                {!tldrComplete ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tldrText}
                    {h1Complete && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />}
                  </p>
                ) : (
                  <EditableText
                    value={content.tldr}
                    onChange={(v) => setContent(prev => ({ ...prev, tldr: v }))}
                    className="text-sm text-muted-foreground leading-relaxed block"
                    multiline
                    disabled={studioMode === 'review'}
                  />
                )}
              </motion.div>

              {/* Sections - Reorderable */}
              <Reorder.Group
                axis="y"
                values={content.sections}
                onReorder={reorderSections}
                className="space-y-6"
              >
                <AnimatePresence>
                  {content.sections.map((section) => (
                    <Reorder.Item
                      key={section.id}
                      value={section}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: tldrComplete ? 1 : 0, y: tldrComplete ? 0 : 20 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative"
                    >
                      {/* Controls bar - appears on hover, only in edit mode */}
                      {studioMode === 'edit' && (
                        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Drag handle */}
                          <div className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded text-muted-foreground">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="p-1.5 hover:bg-destructive/10 rounded text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {section.type === 'text' && (
                        <div className="space-y-3">
                          {/* Styling toolbar - only in edit mode */}
                          {studioMode === 'edit' && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toggleSectionStyle(section.id, 'bold')}
                                className={cn(
                                  "p-1.5 rounded hover:bg-muted transition-colors",
                                  section.style?.bold && "bg-muted text-primary"
                                )}
                                title="Bold"
                              >
                                <Bold className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleSectionStyle(section.id, 'italic')}
                                className={cn(
                                  "p-1.5 rounded hover:bg-muted transition-colors",
                                  section.style?.italic && "bg-muted text-primary"
                                )}
                                title="Italic"
                              >
                                <Italic className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleSectionStyle(section.id, 'underline')}
                                className={cn(
                                  "p-1.5 rounded hover:bg-muted transition-colors",
                                  section.style?.underline && "bg-muted text-primary"
                                )}
                                title="Underline"
                              >
                                <Underline className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-px h-4 bg-border mx-1" />
                              <button
                                onClick={() => setSectionHeadingLevel(section.id, 'h2')}
                                className={cn(
                                  "p-1.5 rounded hover:bg-muted transition-colors",
                                  section.style?.headingLevel === 'h2' && "bg-muted text-primary"
                                )}
                                title="Heading 2"
                              >
                                <Heading1 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSectionHeadingLevel(section.id, 'h3')}
                                className={cn(
                                  "p-1.5 rounded hover:bg-muted transition-colors",
                                  section.style?.headingLevel === 'h3' && "bg-muted text-primary"
                                )}
                                title="Heading 3"
                              >
                                <Heading2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <EditableText
                            value={section.heading}
                            onChange={(v) => updateSection(section.id, 'heading', v)}
                            className={cn(
                              "font-semibold text-foreground block",
                              section.style?.headingLevel === 'h2' ? "text-xl" : 
                              section.style?.headingLevel === 'h3' ? "text-base" : "text-lg"
                            )}
                            showSparkle={section.isAiGenerated}
                            disabled={studioMode === 'review'}
                          />
                          <EditableText
                            value={section.content}
                            onChange={(v) => updateSection(section.id, 'content', v)}
                            className={cn(
                              "text-sm text-muted-foreground leading-relaxed block",
                              section.style?.bold && "font-semibold",
                              section.style?.italic && "italic",
                              section.style?.underline && "underline"
                            )}
                            multiline
                            disabled={studioMode === 'review'}
                          />
                        </div>
                      )}

                      {section.type === 'image' && (
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                          {section.content ? (
                            <img 
                              src={section.content} 
                              alt="Content" 
                              className="max-w-full rounded-lg mx-auto"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <>
                              <Image className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
                              <input
                                type="text"
                                placeholder="Paste image URL..."
                                className="px-3 py-2 text-sm border border-border rounded-lg bg-transparent w-64"
                                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                              />
                            </>
                          )}
                        </div>
                      )}

                      {section.type === 'quote' && (
                        <blockquote className="border-l-4 border-primary/30 pl-6 py-2 italic">
                          <EditableText
                            value={section.content}
                            onChange={(v) => updateSection(section.id, 'content', v)}
                            className="text-lg text-muted-foreground"
                            multiline
                            placeholder="Enter quote..."
                            disabled={studioMode === 'review'}
                          />
                        </blockquote>
                      )}
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>

                {/* Add section button - only in edit mode */}
                {studioMode === 'edit' && (
                  <div className="relative pt-4" ref={addMenuRef}>
                    <button
                      onClick={() => setShowAddMenu(!showAddMenu)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add section
                    </button>

                    <AnimatePresence>
                      {showAddMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg z-10 overflow-hidden"
                        >
                          <div className="p-1">
                            {[
                              { type: 'text' as const, icon: Type, label: 'Text Section' },
                              { type: 'image' as const, icon: Image, label: 'Image' },
                              { type: 'quote' as const, icon: Quote, label: 'Quote' }
                            ].map((item) => (
                              <button
                                key={item.type}
                                onClick={() => addSection(item.type)}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-muted-foreground" />
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              {/* Annotation count indicator - only show in review mode */}
              {studioMode === 'review' && annotations.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {annotations.length} comment{annotations.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </motion.main>

          {/* Right Panel - Review & Handoff */}
          <motion.aside
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-72 border-l border-border/30 p-4 overflow-y-auto"
          >
            {/* Source Context - Compact */}
            <div className="mb-4 pb-4 border-b border-border/30">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2">
                <Brain className="w-3 h-3" />
                Source Context
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                {prompt?.fullPrompt || 'No prompt selected'}
              </p>
            </div>

            {/* Review & Handoff Panel */}
            <ReviewHandoffPanel 
              content={{
                title: content.title,
                h1: content.h1,
                tldr: content.tldr,
                sections: content.sections.map(s => ({
                  heading: s.heading,
                  content: s.content
                }))
              }}
              onStatusChange={setContentStatus}
            />

            {/* LLM Insights - Compact */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
                LLM Insights
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-white">G</span>
                  </div>
                  <span className="text-[10px] font-medium">Gemini Ready</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-violet-500/10 text-violet-600">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-white">P</span>
                  </div>
                  <span className="text-[10px] font-medium">High Citation</span>
                </div>
              </div>
            </div>

            {/* Competitor Gap - Compact */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-medium text-amber-700">Competitor Gap</div>
                  <p className="text-[9px] text-amber-600/80">23 prompts missing coverage</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
