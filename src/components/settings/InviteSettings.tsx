import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface PendingInvite {
  email: string;
  sentAt: string;
}

export const InviteSettings = () => {
  const [email, setEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const { toast } = useToast();

  const handleSendInvite = () => {
    if (!email) return;
    
    setPendingInvites(prev => [...prev, { email, sentAt: new Date().toISOString() }]);
    toast({
      title: "Invitation Sent",
      description: `Invitation sent to ${email}`,
    });
    setEmail("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Invite</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Invite team members to join your workspace
        </p>
      </div>

      <Separator />

      {/* Email Address Input */}
      <div className="space-y-2">
        <Label htmlFor="inviteEmail" className="text-sm font-medium">
          Email address
        </Label>
        <div className="flex gap-3 max-w-lg">
          <Input
            id="inviteEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1"
          />
          <Button onClick={handleSendInvite} disabled={!email}>
            Send invite
          </Button>
        </div>
      </div>

      <Separator />

      {/* Pending Invites */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Pending invites</h3>
        {pendingInvites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending invitations</p>
        ) : (
          <div className="space-y-2">
            {pendingInvites.map((invite, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <span className="text-sm">{invite.email}</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
