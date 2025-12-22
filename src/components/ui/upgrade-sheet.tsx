import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowRight, Sparkles, TrendingUp, Eye, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const UPGRADE_CONTENT: Record<UpgradeType, {
  title: string;
  subtitle: string;
  benefit: string;
  features: string[];
  ctaLabel: string;
  ctaAction: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
}> = {
  prompt_fidelity: {
    title: "Unlock Full Discovery",
    subtitle: "Increase your visibility depth",
    benefit: "See every brand mention across all platforms with 100% fidelity benchmarking.",
    features: [
      "Complete prompt coverage across all AI platforms",
      "Real-time sentiment analysis",
      "Competitor mention tracking",
      "Historical trend analysis",
    ],
    ctaLabel: "Upgrade Coverage",
    ctaAction: "View Plans",
    icon: <Eye className="w-6 h-6" />,
    gradientFrom: "from-violet-500",
    gradientTo: "to-fuchsia-500",
    accentColor: "violet",
  },
  product_coverage: {
    title: "Expand Your Footprint",
    subtitle: "Prepare more products for AI discovery",
    benefit: "Track additional products across all AI platforms to maximize your brand's visibility.",
    features: [
      "AI readiness scoring for each product",
      "Optimization recommendations",
      "Category-level insights",
      "Cross-product analytics",
    ],
    ctaLabel: "Add More Products",
    ctaAction: "View Plans",
    icon: <BarChart3 className="w-6 h-6" />,
    gradientFrom: "from-emerald-500",
    gradientTo: "to-cyan-500",
    accentColor: "emerald",
  },
  chatbot_coverage: {
    title: "See What the World Sees",
    subtitle: "Unlock full chatbot coverage",
    benefit: "Monitor your brand presence across all major AI assistants, not just the basics.",
    features: [
      "ChatGPT, Claude, Gemini, and more",
      "Platform-specific insights",
      "Response quality scoring",
      "Cross-platform comparison",
    ],
    ctaLabel: "Unlock All Platforms",
    ctaAction: "View Plans",
    icon: <Sparkles className="w-6 h-6" />,
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
    accentColor: "blue",
  },
  general: {
    title: "Upgrade Your Intelligence",
    subtitle: "Level up your brand monitoring",
    benefit: "Get the complete picture of your brand's AI visibility.",
    features: [
      "Extended tracking limits",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
    ],
    ctaLabel: "Upgrade Now",
    ctaAction: "View Plans",
    icon: <TrendingUp className="w-6 h-6" />,
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
    accentColor: "amber",
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-t-0 p-0"
      >
        {/* Gradient header background */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-40 bg-gradient-to-b opacity-20 pointer-events-none",
          content.gradientFrom,
          content.gradientTo
        )} />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30 animate-pulse",
            `bg-gradient-to-br ${content.gradientFrom} ${content.gradientTo}`
          )} />
          <div className={cn(
            "absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl opacity-20 animate-pulse",
            `bg-gradient-to-tr ${content.gradientTo} ${content.gradientFrom}`
          )} style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-lg mx-auto px-6 py-8">
          <SheetHeader className="text-center pb-6">
            {/* Icon with gradient background */}
            <div className={cn(
              "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg",
              `bg-gradient-to-br ${content.gradientFrom} ${content.gradientTo}`
            )}>
              <div className="text-white">
                {content.icon}
              </div>
            </div>
            
            {/* Gradient title */}
            <SheetTitle className={cn(
              "text-2xl font-bold bg-clip-text text-transparent",
              `bg-gradient-to-r ${content.gradientFrom} ${content.gradientTo}`
            )}>
              {content.title}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-base mt-1">
              {content.subtitle}
            </SheetDescription>
          </SheetHeader>

          {/* Current status indicator */}
          {currentValue !== undefined && maxValue !== undefined && (
            <div className="my-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Usage</span>
                <span className="text-sm font-medium">
                  {currentValue} / {maxValue}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    `bg-gradient-to-r ${content.gradientFrom} ${content.gradientTo}`
                  )}
                  style={{ width: `${(currentValue / maxValue) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Benefit statement */}
          <p className="text-center text-base text-foreground/80 mb-6 leading-relaxed">
            {content.benefit}
          </p>

          {/* Features list with gradient accents */}
          <div className="space-y-3 mb-8">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-sm group"
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  `bg-gradient-to-br ${content.gradientFrom} ${content.gradientTo}`
                )}>
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <SheetFooter className="flex-col gap-3 sm:flex-col">
            {/* Gradient CTA button */}
            <Button 
              className={cn(
                "w-full h-14 text-base font-semibold text-white border-0 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                `bg-gradient-to-r ${content.gradientFrom} ${content.gradientTo}`
              )}
              onClick={() => {
                window.location.href = "/settings?tab=billing";
              }}
            >
              <Zap className="w-5 h-5 mr-2" />
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground"
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
