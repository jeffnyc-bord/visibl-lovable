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
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Oops, something went wrong.
          </h1>
          <p className="text-muted-foreground">
            We're having trouble loading your dashboard right now. Please try again in a few moments.
          </p>
        </div>
        <Button onClick={onRetry} size="lg" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
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