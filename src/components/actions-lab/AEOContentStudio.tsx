import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  ToggleLeft,
  ToggleRight,
  FileCode,
  Link2,
  Type,
  List,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Zap,
  Brain,
  Target,
  ExternalLink,
  Code,
  Hash,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PromptSource } from './PromptSourceSelector';
import { ContentType } from './ContentTypeSelector';

interface GeneratedContent {
  title: string;
  urlSlug: string;
  h1: string;
  tldr: string;
  sections: Array<{
    heading: string;
    content: string;
    isAiGenerated: boolean;
  }>;
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
  const editorRef = useRef<HTMLDivElement>(null);

  // Mock generated content based on prompt
  const generatedContent: GeneratedContent = {
    title: `${productName || 'Your Product'} vs Competitors: A Comprehensive Guide`,
    urlSlug: `${productName?.toLowerCase().replace(/\s+/g, '-') || 'product'}-comparison-guide`,
    h1: `Why ${productName || 'Your Product'} Stands Out in ${contentType === 'comparison' ? 'Direct Comparisons' : 'the Market'}`,
    tldr: `${productName || 'Your Product'} offers superior performance in key areas including comfort, durability, and value. Unlike competitors, it features proprietary technology that delivers measurable results.`,
    sections: [
      {
        heading: 'What Makes Us Different',
        content: `When comparing ${productName || 'our product'} to alternatives, three key differentiators emerge: innovative design, proven performance metrics, and exceptional customer satisfaction scores. Our approach focuses on solving real user problems rather than feature bloat.`,
        isAiGenerated: true
      },
      {
        heading: 'Performance Comparison',
        content: `In side-by-side testing, ${productName || 'our product'} consistently outperforms the competition in the metrics that matter most to users. Our proprietary technology delivers 40% better efficiency while maintaining the quality standards our customers expect.`,
        isAiGenerated: true
      },
      {
        heading: 'Customer Testimonials',
        content: `"I switched from a competitor and the difference was immediately noticeable. The attention to detail and overall quality exceeded my expectations." — Verified Customer`,
        isAiGenerated: true
      }
    ],
    entities: [productName || 'Product', 'Performance', 'Quality', 'Innovation', 'Customer Satisfaction']
  };

  // Typewriter effects for progressive reveal
  const { displayedText: titleText, isComplete: titleComplete } = useTypewriter(
    generatedContent.title, 25, 500
  );
  const { displayedText: slugText, isComplete: slugComplete } = useTypewriter(
    generatedContent.urlSlug, 20, 1200
  );
  const { displayedText: h1Text, isComplete: h1Complete } = useTypewriter(
    generatedContent.h1, 20, 2000
  );
  const { displayedText: tldrText, isComplete: tldrComplete } = useTypewriter(
    generatedContent.tldr, 15, 2800
  );

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Lab</span>
            </Button>
            <div className="h-5 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">
                AEO Content Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-xs font-medium">Generating...</span>
              </motion.div>
            )}
            
            <Button
              onClick={handleSync}
              disabled={syncStatus === 'syncing' || isGenerating}
              className={cn(
                "gap-2 transition-all duration-300",
                syncStatus === 'live' && "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {syncStatus === 'draft' && (
                <>
                  <Globe className="w-4 h-4" />
                  Sync to Site
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Syncing...
                </>
              )}
              {syncStatus === 'live' && (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Live
                </>
              )}
            </Button>
          </div>
        </motion.header>

        {/* Main Layout */}
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Left Inspector - AEO Structure */}
          <motion.aside
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="w-64 border-r border-border/40 bg-muted/20 p-4 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Structural Health */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Structural Health
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">AEO Optimized</span>
                    </div>
                    <p className="text-[11px] text-emerald-600/80">
                      Content structured for AI answer engines
                    </p>
                  </div>
                </div>
              </div>

              {/* Schema Markup */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Schema Markup
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSchemaEnabled(!schemaEnabled)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                      schemaEnabled
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-background/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className={cn(
                        "w-4 h-4",
                        schemaEnabled ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-xs font-medium",
                        schemaEnabled ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {contentType === 'faq' ? 'FAQPage' : 'HowTo'}
                      </span>
                    </div>
                    {schemaEnabled ? (
                      <ToggleRight className="w-5 h-5 text-primary" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  <button
                    onClick={() => setEntityVerification(!entityVerification)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                      entityVerification
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-background/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Target className={cn(
                        "w-4 h-4",
                        entityVerification ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-xs font-medium",
                        entityVerification ? "text-foreground" : "text-muted-foreground"
                      )}>
                        Entity Verification
                      </span>
                    </div>
                    {entityVerification ? (
                      <ToggleRight className="w-5 h-5 text-primary" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Document Structure */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Document Structure
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground">
                    <Type className="w-3.5 h-3.5" />
                    <span>Title Tag</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground">
                    <Hash className="w-3.5 h-3.5" />
                    <span>H1 Heading</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground">
                    <List className="w-3.5 h-3.5" />
                    <span>3 Sections</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>SEO URL</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto" />
                  </div>
                </div>
              </div>

              {/* Key Entities */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Key Entities
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {generatedContent.entities.map((entity, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Center Stage - The Canvas */}
          <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            ref={editorRef}
            className="flex-1 overflow-y-auto bg-background"
          >
            <div className="max-w-3xl mx-auto py-12 px-8">
              {/* Meta Section */}
              <div className="mb-8 pb-6 border-b border-border/30">
                {/* Title */}
                <div className="mb-4">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1 block">
                    SEO Title
                  </label>
                  <div className="relative">
                    <h1 className="text-2xl font-semibold text-foreground leading-tight font-['SF_Pro_Display',system-ui,sans-serif]">
                      {titleText}
                      {!titleComplete && (
                        <span className="inline-block w-0.5 h-6 bg-primary ml-0.5 animate-pulse" />
                      )}
                    </h1>
                    {titleComplete && (
                      <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-primary/60" />
                    )}
                  </div>
                </div>

                {/* URL Slug */}
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                  <span className="text-muted-foreground/60">yourbrand.com/blog/</span>
                  <span className="text-primary">
                    {slugText}
                    {!slugComplete && (
                      <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                    )}
                  </span>
                </div>
              </div>

              {/* H1 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: slugComplete ? 1 : 0.3 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold text-foreground leading-tight font-['SF_Pro_Display',system-ui,sans-serif]">
                  {h1Text}
                  {slugComplete && !h1Complete && (
                    <span className="inline-block w-0.5 h-8 bg-primary ml-0.5 animate-pulse" />
                  )}
                </h2>
              </motion.div>

              {/* TL;DR Block */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: h1Complete ? 1 : 0.3, y: h1Complete ? 0 : 10 }}
                className="mb-8 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                      Quick Answer
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/20 text-primary uppercase">
                        AI Overview Ready
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tldrText}
                      {h1Complete && !tldrComplete && (
                        <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content Sections */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: tldrComplete ? 1 : 0.3 }}
                className="space-y-8"
              >
                {generatedContent.sections.map((section, index) => (
                  <motion.section
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: tldrComplete ? 1 : 0, 
                      y: tldrComplete ? 0 : 20 
                    }}
                    transition={{ delay: index * 0.3 }}
                    className="group relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2 font-['SF_Pro_Display',system-ui,sans-serif]">
                          {section.heading}
                          {section.isAiGenerated && (
                            <Sparkles className="w-4 h-4 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {/* Highlight entities */}
                          {section.content.split(/(\b(?:Nike Air Max|performance|quality|efficiency|technology)\b)/gi).map((part, i) => {
                            const isEntity = generatedContent.entities.some(
                              e => part.toLowerCase().includes(e.toLowerCase())
                            ) || ['performance', 'quality', 'efficiency', 'technology'].includes(part.toLowerCase());
                            
                            return isEntity ? (
                              <span 
                                key={i} 
                                className="text-foreground font-medium bg-primary/10 px-0.5 rounded"
                              >
                                {part}
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </motion.div>
            </div>
          </motion.main>

          {/* Right Sidebar - Intelligence Layer */}
          <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            className="w-72 border-l border-border/40 bg-muted/20 p-4 overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Context Source */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5" />
                  Intelligence Context
                </h3>
                <div className="p-3 rounded-lg bg-background border border-border/50">
                  <div className="text-xs font-medium text-foreground mb-1">Source Prompt</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {prompt?.fullPrompt || 'No prompt selected'}
                  </p>
                </div>
              </div>

              {/* LLM Insights */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  LLM Insights
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-background border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">G</span>
                      </div>
                      <span className="text-xs font-medium">Gemini Analysis</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Content optimized for conversational queries about product comparisons.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">P</span>
                      </div>
                      <span className="text-xs font-medium">Perplexity Signals</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      High citation probability for direct answer format.
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitor Context */}
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Competitor Gap Analysis
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-amber-700 mb-0.5">
                          Adidas Ultraboost
                        </div>
                        <p className="text-[10px] text-amber-600/80">
                          Ranks for 23 prompts you don&apos;t appear in
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-start gap-2">
                      <Target className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-foreground mb-0.5">
                          Content addresses:
                        </div>
                        <ul className="text-[10px] text-muted-foreground space-y-0.5">
                          <li>• Price vs value comparison</li>
                          <li>• Durability metrics</li>
                          <li>• Real user testimonials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schema Preview */}
              {schemaEnabled && (
                <div>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    Schema Preview
                  </h3>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                    <pre>{`{
  "@context": "schema.org",
  "@type": "${contentType === 'faq' ? 'FAQPage' : 'HowTo'}",
  "name": "${generatedContent.title.slice(0, 30)}...",
  "mainEntity": [...]
}`}</pre>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
