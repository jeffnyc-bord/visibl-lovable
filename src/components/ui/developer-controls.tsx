import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, EyeOff } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeveloperControlsProps {
  states: {
    fullDashboardLoading: boolean;
    widgetLoading: boolean;
    fullDashboardError: boolean;
    widgetError: boolean;
    emptyState: boolean;
  };
  onStateChange: (state: string, value: boolean) => void;
}

export function DeveloperControls({ states, onStateChange }: DeveloperControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const controlItems = [
    {
      key: "fullDashboardLoading",
      label: "Full Dashboard Loading",
      description: "Shows skeleton loading for entire dashboard"
    },
    {
      key: "widgetLoading", 
      label: "Widget Loading",
      description: "Shows loading state for individual widgets"
    },
    {
      key: "fullDashboardError",
      label: "Full Dashboard Error", 
      description: "Shows full-screen error overlay"
    },
    {
      key: "widgetError",
      label: "Widget Error",
      description: "Shows error state in individual widgets"
    },
    {
      key: "emptyState",
      label: "Empty/No Data State",
      description: "Shows empty state when no data is available"
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/95 backdrop-blur-sm border-2 shadow-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Dev Controls
            {isOpen ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="mt-2 w-80 bg-background/95 backdrop-blur-sm border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                Dashboard State Controls
                <Badge variant="secondary" className="text-xs">DEV ONLY</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {controlItems.map((item) => (
                <div key={item.key} className="flex items-start space-x-3">
                  <Switch
                    id={item.key}
                    checked={states[item.key as keyof typeof states]}
                    onCheckedChange={(checked) => onStateChange(item.key, checked)}
                  />
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor={item.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    Object.keys(states).forEach(key => {
                      onStateChange(key, false);
                    });
                  }}
                >
                  Reset All States
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}