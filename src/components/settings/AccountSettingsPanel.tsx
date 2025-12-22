import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AccountSettingsPanel = () => {
  const [email] = useState("john@example.com");
  const [accountId] = useState("acc_1234567890");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyAccountId = () => {
    navigator.clipboard.writeText(accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Account ID copied to clipboard",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "This feature is not yet implemented",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email address
        </Label>
        <Input
          id="email"
          value={email}
          readOnly
          className="max-w-md bg-muted/50"
        />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Your email is verified
          <Check className="h-3 w-3 text-green-500" />
        </p>
      </div>

      {/* Account ID */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Account ID</Label>
        <div className="flex items-center gap-3">
          <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono">
            {accountId}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyAccountId}
            className="gap-1"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Copy
          </Button>
        </div>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
        <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
