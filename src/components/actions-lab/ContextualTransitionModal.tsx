import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PromptSource } from './PromptSourceSelector';
import { ContentType } from './ContentTypeSelector';

interface ContextualTransitionModalProps {
  isOpen: boolean;
  onComplete: () => void;
  prompt: PromptSource | null;
  contentType: ContentType | null;
  productName?: string;
}

export const ContextualTransitionModal = ({
  isOpen,
  onComplete,
  prompt,
  contentType,
  productName
}: ContextualTransitionModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Analyzing prompt context', icon: Sparkles },
    { label: 'Extracting competitor insights', icon: Zap },
    { label: 'Building content structure', icon: FileText },
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      
      const stepTimers = steps.map((_, index) => 
        setTimeout(() => setCurrentStep(index + 1), (index + 1) * 800)
      );

      const completeTimer = setTimeout(() => {
        onComplete();
      }, steps.length * 800 + 600);

      return () => {
        stepTimers.forEach(clearTimeout);
        clearTimeout(completeTimer);
      };
    }
  }, [isOpen, onComplete, steps.length]);

  const getContentTypeLabel = (type: ContentType | null) => {
    const labels: Record<ContentType, string> = {
      'blog': 'Blog Post',
      'faq': 'FAQ Section',
      'comparison': 'Comparison Page',
      'case-study': 'Case Study'
    };
    return type ? labels[type] : 'Content';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
        >
          {/* Radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-lg w-full mx-4"
          >
            {/* Main Card */}
            <div className="rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4 border-b border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Generating {getContentTypeLabel(contentType)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Based on your prompt analysis
                    </p>
                  </div>
                </div>

                {/* Context Summary */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-sm text-foreground leading-relaxed">
                    Creating an{' '}
                    <span className="font-medium text-primary">
                      {getContentTypeLabel(contentType)?.toLowerCase()}
                    </span>
                    {productName && (
                      <>
                        {' '}for{' '}
                        <span className="font-medium">{productName}</span>
                      </>
                    )}
                    {' '}addressing:{' '}
                    <span className="italic text-muted-foreground">
                      &quot;{prompt?.prompt || 'your selected prompt'}&quot;
                    </span>
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-6">
                <div className="space-y-3">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isComplete = currentStep > index;
                    const isActive = currentStep === index;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                          isComplete && "bg-emerald-500/10",
                          isActive && "bg-primary/10 border border-primary/20"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                          isComplete && "bg-emerald-500/20",
                          isActive && "bg-primary/20",
                          !isComplete && !isActive && "bg-muted/50"
                        )}>
                          {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Icon className={cn(
                              "w-4 h-4 transition-colors",
                              isActive ? "text-primary animate-pulse" : "text-muted-foreground"
                            )} />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isComplete && "text-emerald-600",
                          isActive && "text-foreground",
                          !isComplete && !isActive && "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ml-auto flex items-center gap-1"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/20 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span>AEO Content Studio loading...</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentStep >= steps.length ? 1 : 0 }}
                    className="flex items-center gap-1 text-sm font-medium text-primary"
                  >
                    <span>Opening Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
