import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Global skeleton with unified shimmer effect for initial dashboard load
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Metrics Cards with unified shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart - AI Visibility Trend */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-80 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          {/* Chart skeleton with grid pattern */}
          <div className="h-64 w-full bg-muted rounded relative">
            <div className="absolute inset-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-0.5 w-full bg-muted-foreground/20 rounded" />
              ))}
            </div>
            {/* Simulated chart line */}
            <svg className="absolute inset-4 w-full h-full">
              <path
                d="M 0 80 Q 100 40 200 60 T 400 50"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground/30"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Industry Ranking Table */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <CardHeader>
          <div className="h-6 w-56 bg-muted rounded" />
          <div className="h-4 w-80 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Table header */}
            <div className="flex gap-4 pb-2 border-b border-border">
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-4 w-8 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted rounded" />
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Individual widget loading states with content-specific animations
export function ChartWidgetSkeleton() {
  return (
    <div className="h-64 w-full bg-muted/50 rounded relative overflow-hidden">
      <div className="absolute inset-4">
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className="h-0.5 w-full bg-muted-foreground/20 rounded mb-4"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {/* Animated drawing line */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 0 80 Q 100 40 200 60 T 400 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary/60"
            strokeDasharray="400"
            strokeDashoffset="400"
            style={{
              animation: "draw 2s ease-in-out infinite"
            }}
          />
        </svg>
      </div>
    </div>
  );
}

export function ScorecardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-muted rounded flex-1"
            style={{ 
              animation: `fillUp 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-muted rounded flex-1"
            style={{ 
              animation: `fillUp 1.5s ease-in-out infinite`,
              animationDelay: `${(i + 3) * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className="flex gap-4"
          style={{ 
            animation: `slideInLeft 0.5s ease-out`,
            animationDelay: `${i * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

// Generic widget skeleton - kept for backward compatibility
export function WidgetSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-80" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}