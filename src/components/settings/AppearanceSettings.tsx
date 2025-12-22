import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

export const AppearanceSettings = () => {
  const [theme, setTheme] = useState("system");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how the app looks on your device
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-medium">Theme</Label>
        <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4 max-w-md">
          <Label
            htmlFor="light"
            className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
              theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="light" id="light" className="sr-only" />
            <Sun className="h-5 w-5" />
            <span className="text-sm">Light</span>
          </Label>
          <Label
            htmlFor="dark"
            className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
              theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="dark" id="dark" className="sr-only" />
            <Moon className="h-5 w-5" />
            <span className="text-sm">Dark</span>
          </Label>
          <Label
            htmlFor="system"
            className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors ${
              theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="system" id="system" className="sr-only" />
            <Monitor className="h-5 w-5" />
            <span className="text-sm">System</span>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
};
