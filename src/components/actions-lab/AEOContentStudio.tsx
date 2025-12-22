import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Sparkles,
  Link2,
  Type,
  List,
  CheckCircle2,
  ArrowLeft,
  Globe,
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
  Heading2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PromptSource } from './PromptSourceSelector';
import { ContentType } from './ContentTypeSelector';

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
  showSparkle = false
}: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  showSparkle?: boolean;
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

  if (isEditing) {
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
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-text hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors group relative inline-block",
        className
      )}
    >
      {value || <span className="text-muted-foreground/50">{placeholder}</span>}
      {showSparkle && (
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
  const [syncStatus, setSyncStatus] = useState<'draft' | 'syncing' | 'live'>('draft');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  
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

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('live');
      onPublish?.();
    }, 2000);
  };

  const updateSection = (id: string, field: 'heading' | 'content', value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map((s) => 
        s.id === id ? { ...s, [field]: value, isAiGenerated: false } : s
      )
    }));
  };

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
  };

  const deleteSection = (id: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const reorderSections = (newOrder: GeneratedSection[]) => {
    setContent(prev => ({
      ...prev,
      sections: newOrder
    }));
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
            
            <Button
              onClick={handleSync}
              disabled={syncStatus === 'syncing' || isGenerating}
              size="sm"
              className={cn(
                "h-8 gap-1.5 text-xs",
                syncStatus === 'live' && "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {syncStatus === 'draft' && (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  Sync to Site
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Syncing...
                </>
              )}
              {syncStatus === 'live' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live
                </>
              )}
            </Button>
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
            <div className="max-w-2xl mx-auto py-16 px-12">
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
                      {/* Controls bar - appears on hover */}
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

                      {section.type === 'text' && (
                        <div className="space-y-3">
                          {/* Styling toolbar */}
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

                          <EditableText
                            value={section.heading}
                            onChange={(v) => updateSection(section.id, 'heading', v)}
                            className={cn(
                              "font-semibold text-foreground block",
                              section.style?.headingLevel === 'h2' ? "text-xl" : 
                              section.style?.headingLevel === 'h3' ? "text-base" : "text-lg"
                            )}
                            showSparkle={section.isAiGenerated}
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
                          />
                        </blockquote>
                      )}
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>

                {/* Add section button */}
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
            </div>
          </motion.main>

          {/* Right Panel - Context */}
          <motion.aside
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-64 border-l border-border/30 p-4 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Source */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
                  <Brain className="w-3 h-3" />
                  Source Context
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {prompt?.fullPrompt || 'No prompt selected'}
                </p>
              </div>

              {/* LLM Insights */}
              <div className="pt-4 border-t border-border/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
                  LLM Insights
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">G</span>
                      </div>
                      <span className="text-xs font-medium">Gemini</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Optimized for conversational queries.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">P</span>
                      </div>
                      <span className="text-xs font-medium">Perplexity</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      High citation probability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitor Gap */}
              <div className="pt-4 border-t border-border/30">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3">
                  Competitor Gap
                </div>
                <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/5 border border-amber-500/20">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-amber-700">Adidas Ultraboost</div>
                    <p className="text-[10px] text-amber-600/80">23 prompts you don&apos;t appear in</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
