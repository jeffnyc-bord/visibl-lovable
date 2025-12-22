import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Zap, X, Check } from 'lucide-react';
import { PromptSource } from './PromptSourceSelector';
import { ContentType } from './ContentTypeSelector';

interface ContextualTransitionModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
  prompt: PromptSource | null;
  contentType: ContentType | null;
  productName?: string;
}

export const ContextualTransitionModal = ({
  isOpen,
  onComplete,
  onCancel,
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

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

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
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
        >
          {/* Cancel button - top right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onCancel}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all group"
          >
            <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-md w-full mx-6"
          >
            {/* Centered content */}
            <div className="text-center mb-12">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-medium text-white mb-2"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif' }}
              >
                Generating {getContentTypeLabel(contentType)}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/50 text-sm"
              >
                {productName ? `for ${productName}` : 'Based on your prompt analysis'}
              </motion.p>
            </div>

            {/* Progress steps - minimal design */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = currentStep > index;
                const isActive = currentStep === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                        ${isComplete ? 'bg-white/20' : isActive ? 'bg-white/10' : 'bg-white/5'}
                      `}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className={`w-4 h-4 transition-all ${isActive ? 'text-white' : 'text-white/30'}`} />
                      )}
                    </div>

                    <span
                      className={`
                        text-sm transition-colors duration-500
                        ${isComplete ? 'text-white/70' : isActive ? 'text-white' : 'text-white/30'}
                      `}
                    >
                      {step.label}
                    </span>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-auto flex gap-1"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Escape hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-white/25 text-xs mt-12"
            >
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-mono text-[10px]">Esc</kbd> to cancel
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
