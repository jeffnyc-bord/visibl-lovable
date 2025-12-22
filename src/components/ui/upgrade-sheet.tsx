import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles, TrendingUp, Eye, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
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

const UPGRADE_CONTENT: Record<UpgradeType, {
  titleStart: string;
  titleAccent: string;
  titleEnd: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  icon: React.ReactNode;
}> = {
  prompt_fidelity: {
    titleStart: "Unlock Full",
    titleAccent: "Discovery",
    titleEnd: ".",
    subtitle: "See every brand mention across all platforms with complete fidelity benchmarking.",
    features: [
      "Complete prompt coverage across all AI platforms",
      "Real-time sentiment analysis",
      "Competitor mention tracking",
      "Historical trend analysis",
    ],
    ctaLabel: "Upgrade Coverage",
    icon: <Eye className="w-5 h-5" />,
  },
  product_coverage: {
    titleStart: "Expand Your",
    titleAccent: "Footprint",
    titleEnd: ".",
    subtitle: "Track additional products across all AI platforms to maximize your brand's visibility.",
    features: [
      "AI readiness scoring for each product",
      "Optimization recommendations",
      "Category-level insights",
      "Cross-product analytics",
    ],
    ctaLabel: "Add More Products",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  chatbot_coverage: {
    titleStart: "See What the",
    titleAccent: "World",
    titleEnd: " Sees.",
    subtitle: "Monitor your brand presence across all major AI assistants, not just the basics.",
    features: [
      "ChatGPT, Claude, Gemini, and more",
      "Platform-specific insights",
      "Response quality scoring",
      "Cross-platform comparison",
    ],
    ctaLabel: "Unlock All Platforms",
    icon: <Sparkles className="w-5 h-5" />,
  },
  general: {
    titleStart: "Lead with",
    titleAccent: "AI",
    titleEnd: ".",
    subtitle: "Get the complete picture of your brand's AI visibility and outpace the competition.",
    features: [
      "Extended tracking limits",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
    ],
    ctaLabel: "Upgrade Now",
    icon: <TrendingUp className="w-5 h-5" />,
  },
};

export const UpgradeSheet = ({
  open,
  onOpenChange,
  type,
  currentValue,
  maxValue,
}: UpgradeSheetProps) => {
  const content = UPGRADE_CONTENT[type];
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
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-t-0 p-0 bg-[#0D0D12]"
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

        <div className="relative max-w-xl mx-auto px-8 py-12">
          <SheetHeader className="text-left pb-8">
            {/* Large headline with accent color */}
            <SheetTitle className="text-4xl md:text-5xl font-light tracking-tight text-white leading-tight">
              {content.titleStart}{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                {content.titleAccent}
              </span>
              {content.titleEnd}
            </SheetTitle>
            <SheetDescription className="text-[#9CA3AF] text-lg mt-4 leading-relaxed max-w-md">
              {content.subtitle}
            </SheetDescription>
          </SheetHeader>

          {/* Current status indicator */}
          {currentValue !== undefined && maxValue !== undefined && (
            <div className="my-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF]">Current Usage</span>
                <span className="text-sm font-medium text-white">
                  {currentValue} / {maxValue}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${(currentValue / maxValue) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Features list */}
          <div className="space-y-4 mb-10">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#0D0D12]" />
                </div>
                <span className="text-[#D1D5DB] text-base">{feature}</span>
              </div>
            ))}
          </div>

          <SheetFooter className="flex-row gap-3 sm:flex-row justify-start">
            {/* Primary CTA - outlined style matching hero */}
            <Button 
              className="h-12 px-6 text-base font-medium bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300 rounded-lg"
              onClick={() => {
                window.location.href = "/settings?tab=billing";
              }}
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {/* Secondary CTA - solid dark style */}
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
