import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeveloperControlsProps {
  states: {
    fullDashboardLoading: boolean;
    widgetLoading: boolean;
    fullDashboardError: boolean;
    widgetError: boolean;
    showBaseline: boolean;
  };
  onStateChange: (state: string, value: boolean) => void;
  userRole: "business_user" | "agency_admin";
  onRoleChange: (role: "business_user" | "agency_admin") => void;
  loadingDuration: number;
  onLoadingDurationChange: (duration: number) => void;
  topSourceUrl: string;
  onTopSourceUrlChange: (url: string) => void;
  dataPointsCount: number;
  onDataPointsCountChange: (count: number) => void;
  selectedGradient: string;
  onGradientChange: (gradient: string) => void;
}

const gradientOptions = [
  { id: "gradient1", name: "Ocean Breeze", colors: ["#3B82F6", "#06B6D4", "#10B981"] },
  { id: "gradient2", name: "Sunset Glow", colors: ["#F59E0B", "#EF4444", "#EC4899"] },
  { id: "gradient3", name: "Purple Haze", colors: ["#69c5f2", "#a7def8", "#cbebfa"] },
  { id: "gradient4", name: "Fire & Ice", colors: ["#DC2626", "#F97316", "#FCD34D"] },
  { id: "gradient5", name: "Forest Dawn", colors: ["#059669", "#10B981", "#34D399"] },
  { id: "gradient6", name: "Royal Purple", colors: ["#6366F1", "#8B5CF6", "#A855F7"] },
  { id: "gradient7", name: "Miami Vice", colors: ["#06B6D4", "#8B5CF6", "#EC4899"] },
  { id: "gradient8", name: "Northern Lights", colors: ["#10B981", "#06B6D4", "#3B82F6"] },
  { id: "gradient9", name: "Rose Gold", colors: ["#F59E0B", "#EC4899", "#A855F7"] },
  { id: "gradient10", name: "Neon Dreams", colors: ["#84CC16", "#06B6D4", "#8B5CF6"] },
];

export function DeveloperControls({ states, onStateChange, userRole, onRoleChange, loadingDuration, onLoadingDurationChange, topSourceUrl, onTopSourceUrlChange, dataPointsCount, onDataPointsCountChange, selectedGradient, onGradientChange }: DeveloperControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
      key: "showBaseline",
      label: "Show Baseline State",
      description: "Shows single data point baseline message in trends"
    }
  ];

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-50">
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
        
        <CollapsibleContent className="animate-in slide-in-from-bottom-2 duration-300 ease-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:duration-200">
          <Card className="mt-2 w-80 max-h-[calc(100vh-8rem)] bg-background/95 backdrop-blur-sm border-2 shadow-lg transform transition-all duration-300 ease-out scale-100 animate-in fade-in-0 zoom-in-95 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-sm flex items-center gap-2">
                Dashboard State Controls
                <Badge variant="secondary" className="text-xs">DEV ONLY</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto flex-1">
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
              
              <div className="pt-2 border-t space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">User Role</Label>
                  <Select value={userRole} onValueChange={onRoleChange}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business_user">Business User</SelectItem>
                      <SelectItem value="agency_admin">Agency Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Loading Duration (seconds)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={loadingDuration}
                    onChange={(e) => onLoadingDurationChange(Number(e.target.value))}
                    className="h-8 text-xs"
                    placeholder="Duration in seconds"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls how long competitor addition loading lasts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Top Source URL (for testing)</Label>
                  <Input
                    type="text"
                    value={topSourceUrl}
                    onChange={(e) => onTopSourceUrlChange(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="www.example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Test overflow handling with long URLs
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Graph Data Points: {dataPointsCount}</Label>
                  <Input
                    type="range"
                    min="1"
                    max="6"
                    value={dataPointsCount}
                    onChange={(e) => onDataPointsCountChange(Number(e.target.value))}
                    className="h-8"
                  />
                  <p className="text-xs text-muted-foreground">
                    Control number of data points in visibility graphs
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Bar Chart Gradient</Label>
                  <Select value={selectedGradient} onValueChange={onGradientChange}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map((gradient) => (
                        <SelectItem key={gradient.id} value={gradient.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-16 h-3 rounded"
                              style={{
                                background: `linear-gradient(90deg, ${gradient.colors.join(', ')})`
                              }}
                            />
                            <span>{gradient.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose a gradient style for the bar chart
                  </p>
                </div>
                
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