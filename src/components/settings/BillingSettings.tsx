import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Star, Shield } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface BillingSettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const BillingSettings = ({ userRole }: BillingSettingsProps) => {
  const { tier, limits, chatbotsTracked, promptsUsed, articlesUsed } = useSubscription();
  
  // Map subscription tier to display values
  const tierNames = {
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise'
  };
  
  const tierPrices = {
    starter: '$0/month (Trial)',
    pro: '$99/month',
    enterprise: 'Custom pricing'
  };
  
  const currentPlan = tierNames[tier];
  const planPrice = tierPrices[tier];
  const planFeatures = tier === 'starter'
    ? ['Twice weekly tracking', '2 chatbots', '10 prompts (5 auto-generated)', '5 AEO articles', 'Community support']
    : tier === 'pro'
    ? ['Daily tracking', '10 chatbots', '50 prompts', '25 AEO articles', 'Priority support']
    : ['Daily tracking', 'Unlimited chatbots', 'Unlimited prompts', 'Unlimited AEO articles', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'];

  const billingHistory = [
    { date: "2024-01-01", amount: "$99.00", status: "Paid", invoice: "INV-2024-001" },
    { date: "2023-12-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-012" },
    { date: "2023-11-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-011" },
  ];

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Current Subscription</span>
          </CardTitle>
          <CardDescription>
            Manage your subscription plan and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{currentPlan} Plan</h3>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{planPrice}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                {planFeatures.map((feature, index) => (
                  <p key={index}>• {feature}</p>
                ))}
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" size="sm">Change Plan</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Chatbots Tracked</p>
              <p className="text-2xl font-semibold">
                {chatbotsTracked} / {limits.maxChatbots === 999999 ? '∞' : limits.maxChatbots}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Prompts Used</p>
              <p className="text-2xl font-semibold">
                {promptsUsed} / {limits.maxPrompts === 999999 ? '∞' : limits.maxPrompts}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">AEO Articles Generated</p>
              <p className="text-2xl font-semibold">
                {articlesUsed} / {limits.maxArticles === 999999 ? '∞' : limits.maxArticles}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Methods</span>
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/26</p>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Button variant="outline" className="w-full">
            Add New Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Billing History</span>
          </CardTitle>
          <CardDescription>
            View and download your invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map((bill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{bill.invoice}</p>
                    <p className="text-sm text-muted-foreground">{bill.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{bill.amount}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={bill.status === "Paid" ? "default" : "destructive"}>
                        {bill.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < billingHistory.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      {tier !== 'enterprise' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Available Plans</span>
            </CardTitle>
            <CardDescription>
              Upgrade to unlock more features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Starter Plan */}
              <div className={`border rounded-lg p-6 space-y-4 ${tier === 'starter' ? 'border-primary' : ''}`}>
                {tier === 'starter' && <Badge className="mb-2">Current Plan</Badge>}
                <div>
                  <h3 className="text-lg font-semibold">Starter</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Free Trial</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Twice weekly tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    2 chatbots
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    10 prompts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    5 AEO articles
                  </li>
                </ul>
                {tier === 'starter' && (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                )}
              </div>

              {/* Pro Plan */}
              <div className={`border-2 rounded-lg p-6 space-y-4 relative ${tier === 'pro' ? 'border-primary' : 'border-primary'}`}>
                {tier === 'pro' ? (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>
                ) : (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <div>
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Daily tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    10 chatbots
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    50 prompts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    25 AEO articles
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full" disabled={tier === 'pro'}>
                  {tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Enterprise</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">Custom</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Daily tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Unlimited chatbots
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Unlimited prompts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Unlimited AEO articles
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    SLA guarantee
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};