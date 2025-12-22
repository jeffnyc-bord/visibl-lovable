import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const ColorSchemeSettings = () => {
  const [settings, setSettings] = useState({
    highContrast: false,
    reducedMotion: false,
    colorBlindMode: false
  });
  const { toast } = useToast();

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    const settingNames = {
      highContrast: "High contrast",
      reducedMotion: "Reduced motion",
      colorBlindMode: "Color blind mode"
    };
    toast({
      title: "Settings Updated",
      description: `${settingNames[key]} ${value ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Color Scheme</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Accessibility and color preferences
        </p>
      </div>

      <Separator />

      <div className="space-y-4 max-w-md">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="highContrast" className="font-medium">High contrast</Label>
            <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
          </div>
          <Switch
            id="highContrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="reducedMotion" className="font-medium">Reduced motion</Label>
            <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
          </div>
          <Switch
            id="reducedMotion"
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => handleSettingChange("reducedMotion", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="colorBlindMode" className="font-medium">Color blind mode</Label>
            <p className="text-sm text-muted-foreground">Use patterns in addition to colors</p>
          </div>
          <Switch
            id="colorBlindMode"
            checked={settings.colorBlindMode}
            onCheckedChange={(checked) => handleSettingChange("colorBlindMode", checked)}
          />
        </div>
      </div>
    </div>
  );
};
