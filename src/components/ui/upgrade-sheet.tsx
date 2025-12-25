import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles, MessageSquare, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export type UpgradeType = 
  | "prompt_fidelity" 
  | "product_coverage" 
  | "chatbot_coverage" 
  | "general";

interface UpgradeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: UpgradeType;
  currentValue?: number;
  maxValue?: number;
}

// Sparkle particle component
const SparkleParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <div
    className="absolute animate-sparkle-float pointer-events-none"
    style={{
      left: `${x}%`,
      top: '-10px',
      animationDelay: `${delay}ms`,
      opacity: 0,
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-sparkle-spin"
      style={{ animationDelay: `${delay}ms` }}
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        fill="#22D3EE"
      />
    </svg>
  </div>
);

export const UpgradeSheet = ({
  open,
  onOpenChange,
  type,
}: UpgradeSheetProps) => {
  const [showParticles, setShowParticles] = useState(false);

  // Trigger particles when sheet opens
  useEffect(() => {
    if (open) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Generate random sparkle particles
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 600,
    size: 10 + Math.random() * 10,
  }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-t-0 p-0 bg-[#0D0D12]"
      >
        {/* Sparkle particles */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
            {sparkles.map((sparkle) => (
              <SparkleParticle
                key={`sparkle-${sparkle.id}`}
                x={sparkle.x}
                delay={sparkle.delay}
                size={sparkle.size}
              />
            ))}
          </div>
        )}

        {/* Subtle gradient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20 bg-cyan-500" />
        </div>

        <div className="relative max-w-xl mx-auto px-8 py-10">
          <SheetHeader className="text-left pb-6">
            {/* Large headline with accent color - lighter weight */}
            <SheetTitle className="text-3xl md:text-4xl font-extralight tracking-tight text-white leading-tight">
              Unlock Full{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent font-light">
                Discovery
              </span>
              .
            </SheetTitle>
            <SheetDescription className="text-[#9CA3AF] text-base mt-3 leading-relaxed">
              Increase your visibility confidence and monitor your brand across all major AI platforms.
            </SheetDescription>
          </SheetHeader>

          {/* Upgrade benefits - simple list with divider */}
          <div className="mb-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white text-sm font-medium">Increase Prompt Allowance</p>
                  <p className="text-[#6B7280] text-xs">60 prompts → 150 prompts</p>
                </div>
              </div>
              <Check className="w-4 h-4 text-cyan-400" />
            </div>
            
            {/* Horizontal divider */}
            <div className="h-px bg-white/10" />
            
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white text-sm font-medium">Unlock More Chatbots</p>
                  <p className="text-[#6B7280] text-xs">2 chatbots → 4 chatbots</p>
                </div>
              </div>
              <Check className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          {/* What's included */}
          <div className="mb-8">
            <h4 className="text-xs font-medium uppercase tracking-wider text-[#6B7280] mb-3">
              What's Included
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Track up to 4 chatbots (ChatGPT, Gemini, Perplexity, Grok)",
                "Send more prompts/day (higher limits for prompt lab, e.g., 25)",
                "15 AI Search Optimized articles from AEO Content Studio",
                "Advanced Reporting",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-400/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-cyan-400" />
                  </div>
                  <span className="text-[#D1D5DB] text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="flex-row gap-3 sm:flex-row justify-start">
            {/* Primary CTA */}
            <Button 
              className="h-12 px-6 text-base font-medium bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300 rounded-lg"
              onClick={() => {
                window.location.href = "/settings?tab=billing";
              }}
              
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {/* Secondary CTA */}
            <Button 
              className="h-12 px-6 text-base font-medium bg-[#1F2937] text-white hover:bg-[#374151] border-0 transition-all duration-300 rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              Maybe Later
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
