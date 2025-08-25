import { useState } from "react";
import { AlertTriangle, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  onRetry?: () => void;
  title?: string;
  description?: string;
  type?: "full" | "widget" | "empty";
}

export function FullDashboardError({ onRetry }: { onRetry: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-lg mx-auto px-6">
        {/* Friendly Robot Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-12 h-12 text-primary">
            {/* Simple robot illustration using text/symbols */}
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <circle cx="24" cy="20" r="8" fill="currentColor" opacity="0.3" />
              <circle cx="20" cy="18" r="1.5" fill="currentColor" />
              <circle cx="28" cy="18" r="1.5" fill="currentColor" />
              <path d="M20 22 Q24 25 28 22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <rect x="20" y="28" width="8" height="6" rx="2" fill="currentColor" opacity="0.3" />
              <line x1="24" y1="12" x2="24" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground">
            Looks like we hit a snag.
          </h1>
          <p className="text-muted-foreground text-lg">
            Our servers are experiencing a high volume of requests, but we're working to get things back online.
          </p>
        </div>

        <Button onClick={onRetry} size="lg" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>

        {/* Help Links */}
        <div className="pt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              What's happening?
            </button>
            <span className="text-muted-foreground/50">•</span>
            <button
              onClick={() => setShowSupport(!showSupport)}
              className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Contact Support
            </button>
          </div>

          {/* Collapsible Details */}
          {showDetails && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left space-y-2 border border-border/50">
              <div>
                <p className="font-medium text-foreground">For users:</p>
                <p className="text-sm">Our team is investigating a server connectivity issue in your region.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Technical details:</p>
                <p className="text-sm font-mono">Error Code: 503 Service Unavailable</p>
              </div>
            </div>
          )}

          {/* Support Contact */}
          {showSupport && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center space-y-2 border border-border/50">
              <div>
                <p className="font-medium text-foreground">Need help?</p>
                <p className="text-sm">Get in touch with our support team:</p>
                <a 
                  href="mailto:support@company.com" 
                  className="text-sm font-medium text-primary hover:underline"
                >
                  support@company.com
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WidgetError({ onRetry, title = "Unable to load data" }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="border-dashed">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm mt-1">
            There was an error fetching these insights. Please try refreshing the page.
          </div>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function EmptyState({ 
  title = "No data available", 
  description = "No data found for the selected criteria.",
  type = "empty" 
}: ErrorStateProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Database className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Specific empty states for different widgets
export function NoAIVisibilityEmpty() {
  return (
    <EmptyState
      title="No AI Visibility Found"
      description="It looks like we haven't detected any AI mentions for this brand in the selected date range. Try broadening your date range or ensure your brand has been scanned."
    />
  );
}

export function NoCompetitorDataEmpty() {
  return (
    <EmptyState
      title="No Competitor Data"
      description="No competitor information is available for this brand. Data may still be processing or competitors may need to be configured."
    />
  );
}

export function NoTrendsDataEmpty() {
  return (
    <EmptyState
      title="No Trend Data Available"
      description="Trend analysis requires at least 7 days of data. Please check back once more data has been collected."
    />
  );
}