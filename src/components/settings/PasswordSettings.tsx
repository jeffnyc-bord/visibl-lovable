import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export const PasswordSettings = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const { toast } = useToast();

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Password & Authentication</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your password and security settings
        </p>
      </div>

      <Separator />

      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-sm font-medium">
          Current password
        </Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwords.current}
          onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
          className="max-w-md"
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm font-medium">
          New password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={passwords.new}
          onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
          className="max-w-md"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm new password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwords.confirm}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
          className="max-w-md"
        />
      </div>

      <Button 
        onClick={handleChangePassword}
        disabled={!passwords.current || !passwords.new || !passwords.confirm}
      >
        Update password
      </Button>
    </div>
  );
};
