import { useState } from "react";
import { AlertTriangle, RefreshCw, Bot, WifiOff, ServerCrash, Clock, MessageSquareX, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ChatbotErrorProps {
  onRetry?: () => void;
  onContactSupport?: () => void;
  errorType?: 'network' | 'server' | 'timeout' | 'blocked' | 'quota' | 'generic';
  platform?: string;
  title?: string;
  description?: string;
}

// Full screen chatbot error for complete failures
export function ChatbotFullError({ 
  onRetry, 
  onContactSupport, 
  errorType = 'generic',
  platform = 'AI Assistant'
}: ChatbotErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getErrorConfig = () => {
    switch (errorType) {
      case 'network':
        return {
          icon: <WifiOff className="w-12 h-12" />,
          title: "Connection Lost",
          description: `Unable to connect to ${platform}. Please check your internet connection and try again.`,
          code: "ERR_NETWORK_FAILURE",
          solution: "Check your internet connection and firewall settings."
        };
      case 'server':
        return {
          icon: <ServerCrash className="w-12 h-12" />,
          title: `${platform} is Temporarily Down`,
          description: `${platform} servers are experiencing issues. Our team is working to restore service.`,
          code: "ERR_SERVER_UNAVAILABLE",
          solution: "This is a temporary issue. Please try again in a few minutes."
        };
      case 'timeout':
        return {
          icon: <Clock className="w-12 h-12" />,
          title: "Request Timed Out",
          description: `${platform} took too long to respond. This might be due to high demand.`,
          code: "ERR_REQUEST_TIMEOUT",
          solution: "Try breaking your request into smaller parts or wait a moment before retrying."
        };
      case 'blocked':
        return {
          icon: <MessageSquareX className="w-12 h-12" />,
          title: "Request Blocked",
          description: `Your request was blocked by ${platform}'s content filters.`,
          code: "ERR_CONTENT_BLOCKED",
          solution: "Try rephrasing your request with different language."
        };
      case 'quota':
        return {
          icon: <Settings className="w-12 h-12" />,
          title: "Rate Limit Reached",
          description: `You've reached the usage limit for ${platform}. Please try again later.`,
          code: "ERR_QUOTA_EXCEEDED",
          solution: "Wait a few minutes before making another request."
        };
      default:
        return {
          icon: <Bot className="w-12 h-12" />,
          title: "AI Assistant Unavailable",
          description: `${platform} is currently experiencing technical difficulties.`,
          code: "ERR_GENERIC_FAILURE",
          solution: "Please try again or contact support if the issue persists."
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-lg mx-auto px-6">
        {/* Error Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <div className="text-destructive">
            {config.icon}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">
              {config.title}
            </h1>
            <Badge variant="destructive" className="text-xs">
              {errorType.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            {config.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {onContactSupport && (
            <Button variant="outline" onClick={onContactSupport} size="lg">
              Contact Support
            </Button>
          )}
        </div>

        {/* Help Links */}
        <div className="pt-4 space-y-2 text-sm text-muted-foreground">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Technical Details'}
          </button>

          {/* Collapsible Details */}
          {showDetails && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left space-y-3 border border-border/50">
              <div>
                <p className="font-medium text-foreground">Error Code:</p>
                <p className="text-sm font-mono">{config.code}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Suggested Solution:</p>
                <p className="text-sm">{config.solution}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Timestamp:</p>
                <p className="text-sm font-mono">{new Date().toISOString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Widget-level chatbot error for smaller components
export function ChatbotWidgetError({ 
  onRetry, 
  platform = 'AI', 
  errorType = 'generic',
  title
}: ChatbotErrorProps) {
  const getErrorMessage = () => {
    switch (errorType) {
      case 'network':
        return `Unable to connect to ${platform}`;
      case 'server':
        return `${platform} is temporarily unavailable`;
      case 'timeout':
        return `${platform} request timed out`;
      case 'blocked':
        return `Request blocked by ${platform}`;
      case 'quota':
        return `${platform} rate limit reached`;
      default:
        return `${platform} is currently unavailable`;
    }
  };

  const getIcon = () => {
    switch (errorType) {
      case 'network':
        return <WifiOff className="h-4 w-4" />;
      case 'server':
        return <ServerCrash className="h-4 w-4" />;
      case 'timeout':
        return <Clock className="h-4 w-4" />;
      case 'blocked':
        return <MessageSquareX className="h-4 w-4" />;
      case 'quota':
        return <Settings className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Alert variant="destructive" className="border-dashed">
      {getIcon()}
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">{title || getErrorMessage()}</div>
          <div className="text-sm mt-1">
            {errorType === 'quota' 
              ? 'Please wait a few minutes before trying again.'
              : 'Please check your connection and try again.'
            }
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
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Inline chatbot error for conversation failures
export function ChatbotInlineError({ 
  onRetry, 
  platform = 'AI',
  errorType = 'generic',
  message = "Failed to get response"
}: ChatbotErrorProps & { message?: string }) {
  const getErrorColor = () => {
    switch (errorType) {
      case 'quota':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'blocked':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'timeout':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getErrorColor()} my-2`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {errorType === 'quota' ? (
            <Settings className="w-4 h-4" />
          ) : errorType === 'blocked' ? (
            <MessageSquareX className="w-4 h-4" />
          ) : errorType === 'timeout' ? (
            <Clock className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            {message}
          </div>
          <div className="text-xs mt-1 opacity-75">
            {errorType === 'quota' && 'Rate limit exceeded. Please wait before trying again.'}
            {errorType === 'blocked' && 'Your message was blocked by content filters.'}
            {errorType === 'timeout' && 'The request took too long to complete.'}
            {errorType === 'network' && 'Network connection failed.'}
            {errorType === 'server' && `${platform} servers are experiencing issues.`}
            {errorType === 'generic' && 'An unexpected error occurred.'}
          </div>
        </div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="flex-shrink-0 h-8 w-8 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Empty state for when no chatbot responses are available
export function ChatbotEmptyState({ 
  platform = 'AI Assistant',
  onRetry 
}: ChatbotErrorProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">No Responses Available</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {platform} hasn't provided any responses yet. This could be due to connectivity issues or the service being temporarily unavailable.
          </p>
        </div>
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}