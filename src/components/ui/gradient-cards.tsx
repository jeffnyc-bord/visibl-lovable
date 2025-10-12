import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Sparkles, Zap, Target } from "lucide-react";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  gradient?: "purple-blue" | "pink-orange" | "cyan-blue" | "green-teal";
}

export function GlassmorphicCard({ children, className, gradient = "purple-blue" }: GlassmorphicCardProps) {
  const gradients = {
    "purple-blue": "from-purple-400/20 via-blue-400/20 to-cyan-400/20",
    "pink-orange": "from-pink-400/20 via-rose-400/20 to-orange-400/20",
    "cyan-blue": "from-cyan-400/20 via-blue-400/20 to-indigo-400/20",
    "green-teal": "from-green-400/20 via-emerald-400/20 to-teal-400/20",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl",
      className
    )}>
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        gradients[gradient]
      )} />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

interface GradientMetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  gradient?: "purple" | "blue" | "pink" | "green";
}

export function GradientMetricCard({ title, value, change, icon, gradient = "purple" }: GradientMetricCardProps) {
  const gradients = {
    purple: "from-purple-500 via-purple-600 to-indigo-600",
    blue: "from-blue-500 via-blue-600 to-cyan-600",
    pink: "from-pink-500 via-rose-500 to-orange-500",
    green: "from-green-500 via-emerald-500 to-teal-500",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl",
      "bg-gradient-to-br",
      gradients[gradient]
    )}>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            {icon || <TrendingUp className="w-5 h-5" />}
          </div>
          {change && (
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
              {change}
            </span>
          )}
        </div>
        
        <div>
          <p className="text-sm text-white/80 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface GradientBadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "info";
  className?: string;
}

export function GradientBadge({ children, variant = "primary", className }: GradientBadgeProps) {
  const variants = {
    primary: "from-blue-500 to-purple-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-orange-500 to-pink-600",
    info: "from-cyan-500 to-blue-600",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg",
      "bg-gradient-to-r",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: "purple" | "blue" | "pink" | "green";
}

export function FeatureCard({ icon, title, description, gradient = "purple" }: FeatureCardProps) {
  const gradients = {
    purple: "from-purple-500/10 via-purple-600/10 to-indigo-600/10",
    blue: "from-blue-500/10 via-blue-600/10 to-cyan-600/10",
    pink: "from-pink-500/10 via-rose-500/10 to-orange-500/10",
    green: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
  };

  const iconGradients = {
    purple: "from-purple-500 to-indigo-600",
    blue: "from-blue-500 to-cyan-600",
    pink: "from-pink-500 to-orange-500",
    green: "from-green-500 to-teal-500",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl p-6 border border-border/50 bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
      gradients[gradient]
    )}>
      <div className={cn(
        "inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br text-white shadow-lg",
        iconGradients[gradient]
      )}>
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

interface GradientProgressProps {
  value: number;
  max?: number;
  gradient?: "purple" | "blue" | "pink" | "green";
  className?: string;
}

export function GradientProgress({ value, max = 100, gradient = "purple", className }: GradientProgressProps) {
  const gradients = {
    purple: "from-purple-500 via-purple-600 to-indigo-600",
    blue: "from-blue-500 via-blue-600 to-cyan-600",
    pink: "from-pink-500 via-rose-500 to-orange-500",
    green: "from-green-500 via-emerald-500 to-teal-500",
  };

  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("relative h-2 bg-muted rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
          gradients[gradient]
        )}
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

// Example usage component
export function GradientShowcase() {
  return (
    <div className="space-y-8 p-8">
      {/* Glassmorphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassmorphicCard gradient="purple-blue">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Glassmorphic Design</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful frosted glass effect with soft gradients
            </p>
          </div>
        </GlassmorphicCard>
        
        <GlassmorphicCard gradient="pink-orange">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Elegant UI</h3>
            <p className="text-sm text-muted-foreground">
              Modern and sophisticated design elements
            </p>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Gradient Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GradientMetricCard
          title="Total Revenue"
          value="$24,500"
          change="+12%"
          icon={<TrendingUp className="w-5 h-5" />}
          gradient="purple"
        />
        <GradientMetricCard
          title="Active Users"
          value="1,234"
          change="+23%"
          icon={<Sparkles className="w-5 h-5" />}
          gradient="blue"
        />
        <GradientMetricCard
          title="Performance"
          value="94%"
          change="+8%"
          icon={<Zap className="w-5 h-5" />}
          gradient="pink"
        />
      </div>

      {/* Gradient Badges */}
      <div className="flex flex-wrap gap-3">
        <GradientBadge variant="primary">
          <Sparkles className="w-3.5 h-3.5" />
          Premium
        </GradientBadge>
        <GradientBadge variant="success">
          Active
        </GradientBadge>
        <GradientBadge variant="warning">
          Trending
        </GradientBadge>
        <GradientBadge variant="info">
          New Feature
        </GradientBadge>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Analytics"
          description="Track your performance with detailed insights"
          gradient="purple"
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title="AI Powered"
          description="Intelligent recommendations and automation"
          gradient="blue"
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Fast & Secure"
          description="Lightning-fast performance with top security"
          gradient="pink"
        />
        <FeatureCard
          icon={<Target className="w-6 h-6" />}
          title="Goal Tracking"
          description="Set and achieve your business objectives"
          gradient="green"
        />
      </div>

      {/* Gradient Progress Bars */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">75%</span>
          </div>
          <GradientProgress value={75} gradient="purple" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">92%</span>
          </div>
          <GradientProgress value={92} gradient="blue" />
        </div>
      </div>
    </div>
  );
}
