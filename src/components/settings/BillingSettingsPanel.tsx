import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";

export const BillingSettingsPanel = () => {
  const billingHistory = [
    { date: "Dec 15, 2024", amount: "$49.00", status: "Paid" },
    { date: "Nov 15, 2024", amount: "$49.00", status: "Paid" },
    { date: "Oct 15, 2024", amount: "$49.00", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Billing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      <Separator />

      {/* Current Plan */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Pro Plan</h3>
            <p className="text-sm text-muted-foreground">$49/month • Renews on Jan 15, 2025</p>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
        <Button variant="outline" className="mt-4">Change plan</Button>
      </div>

      {/* Payment Method */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Payment method</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">VISA</span>
            <span className="text-sm text-muted-foreground">•••• •••• •••• 4242</span>
          </div>
          <Button variant="ghost" size="sm">Update</Button>
        </div>
      </div>

      {/* Billing History */}
      <div className="border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Billing history</h3>
        <div className="space-y-3">
          {billingHistory.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{item.date}</span>
              <span className="text-sm text-foreground">{item.amount}</span>
              <Badge variant="secondary" className="font-normal">{item.status}</Badge>
              <Button variant="ghost" size="sm" className="gap-1">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
