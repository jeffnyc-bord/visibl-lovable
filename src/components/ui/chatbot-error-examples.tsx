import React, { useState } from 'react';
import { 
  ChatbotFullError, 
  ChatbotWidgetError, 
  ChatbotInlineError, 
  ChatbotEmptyState 
} from './chatbot-error-states';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

// Example component showing how to integrate chatbot error states
export function ChatbotErrorExamples() {
  const [showFullError, setShowFullError] = useState(false);
  const [showWidgetError, setShowWidgetError] = useState(false);
  const [showInlineError, setShowInlineError] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const handleRetry = () => {
    console.log('Retrying chatbot request...');
    // Reset error states
    setShowFullError(false);
    setShowWidgetError(false);
    setShowInlineError(false);
    setShowEmptyState(false);
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
    // Open support dialog or redirect to support
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Chatbot Error State Examples</h2>
        <p className="text-muted-foreground mb-6">
          Click the buttons below to see different error states for chatbot failures.
        </p>
      </div>

      {/* Trigger Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="destructive" 
          onClick={() => setShowFullError(true)}
        >
          Full Screen Error
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowWidgetError(!showWidgetError)}
        >
          Widget Error
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowInlineError(!showInlineError)}
        >
          Inline Error
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowEmptyState(!showEmptyState)}
        >
          Empty State
        </Button>
      </div>

      {/* Error Type Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Error Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatbotWidgetError
              platform="ChatGPT"
              errorType="network"
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limit Error Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatbotWidgetError
              platform="Claude"
              errorType="quota"
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server Error Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatbotWidgetError
              platform="Gemini"
              errorType="server"
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Blocked Example</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatbotWidgetError
              platform="Grok"
              errorType="blocked"
              onRetry={handleRetry}
            />
          </CardContent>
        </Card>
      </div>

      {/* Inline Errors */}
      {showInlineError && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Inline Error Examples</h3>
          <ChatbotInlineError
            platform="ChatGPT"
            errorType="timeout"
            message="ChatGPT request timed out"
            onRetry={handleRetry}
          />
          <ChatbotInlineError
            platform="Claude"
            errorType="quota"
            message="Rate limit exceeded for Claude"
            onRetry={handleRetry}
          />
          <ChatbotInlineError
            platform="Gemini"
            errorType="blocked"
            message="Content was blocked by Gemini filters"
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Widget Error */}
      {showWidgetError && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Widget Error</h3>
          <ChatbotWidgetError
            platform="AI Assistant"
            errorType="server"
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Empty State</h3>
          <ChatbotEmptyState
            platform="AI Assistant"
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Full Screen Error */}
      {showFullError && (
        <ChatbotFullError
          platform="ChatGPT"
          errorType="server"
          onRetry={handleRetry}
          onContactSupport={handleContactSupport}
        />
      )}
    </div>
  );
}

// Example of integrating error states into existing prompt details panel
export function PromptDetailsPanelWithErrors() {
  const [platformErrors, setPlatformErrors] = useState<{[key: string]: string}>({});
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  const simulateError = (platform: string, errorType: string) => {
    setPlatformErrors(prev => ({ ...prev, [platform]: errorType }));
  };

  const retryPlatform = (platform: string) => {
    setLoadingStates(prev => ({ ...prev, [platform]: true }));
    setPlatformErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[platform];
      return newErrors;
    });

    // Simulate retry
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [platform]: false }));
      // Randomly succeed or fail
      if (Math.random() > 0.7) {
        simulateError(platform, 'network');
      }
    }, 2000);
  };

  const platforms = ['ChatGPT', 'Claude', 'Gemini', 'Grok'];

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">AI Platform Responses</h3>
      
      <div className="space-y-4">
        {platforms.map(platform => {
          const hasError = platformErrors[platform];
          const isLoading = loadingStates[platform];

          return (
            <Card key={platform}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {platform}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => simulateError(platform, 'network')}
                  >
                    Simulate Error
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasError ? (
                  <ChatbotInlineError
                    platform={platform}
                    errorType={hasError as any}
                    message={`Failed to get response from ${platform}`}
                    onRetry={() => retryPlatform(platform)}
                  />
                ) : isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <div className="text-sm">
                    This is a sample response from {platform}. Everything is working correctly.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}