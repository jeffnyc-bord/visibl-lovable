import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export const ThemeSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState("default");

  const themes = [
    { id: "default", name: "Default", colors: ["#3b82f6", "#8b5cf6", "#06b6d4"] },
    { id: "ocean", name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#14b8a6"] },
    { id: "forest", name: "Forest", colors: ["#22c55e", "#84cc16", "#10b981"] },
    { id: "sunset", name: "Sunset", colors: ["#f97316", "#ef4444", "#f59e0b"] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Theme Selection</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a color theme for the interface
        </p>
      </div>

      <Separator />

      <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-2 gap-4 max-w-md">
        {themes.map((theme) => (
          <Label
            key={theme.id}
            htmlFor={theme.id}
            className={`flex flex-col gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedTheme === theme.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value={theme.id} id={theme.id} className="sr-only" />
            <div className="flex gap-1">
              {theme.colors.map((color, i) => (
                <div
                  key={i}
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{theme.name}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
