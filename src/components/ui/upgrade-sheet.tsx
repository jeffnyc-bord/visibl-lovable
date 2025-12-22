import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowRight } from "lucide-react";
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
        className="rounded-t-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="max-w-lg mx-auto">
          <SheetHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <SheetTitle className="text-xl font-semibold">
              {content.title}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {content.subtitle}
            </SheetDescription>
          </SheetHeader>

          {/* Current status indicator */}
          {currentValue !== undefined && maxValue !== undefined && (
            <div className="my-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Usage</span>
                <span className="text-sm font-medium">
                  {currentValue} / {maxValue}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary/60 rounded-full transition-all duration-500"
                  style={{ width: `${(currentValue / maxValue) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Benefit statement */}
          <p className="text-center text-sm text-foreground/80 mb-6">
            {content.benefit}
          </p>

          {/* Features list */}
          <div className="space-y-3 mb-8">
            {content.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              className="w-full h-12 text-base font-medium"
              onClick={() => {
                // Navigate to billing/upgrade page
                window.location.href = "/settings?tab=billing";
              }}
            >
              {content.ctaLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground"
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
