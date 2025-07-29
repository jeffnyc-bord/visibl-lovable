import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Star, Shield } from "lucide-react";

interface BillingSettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const BillingSettings = ({ userRole }: BillingSettingsProps) => {
  // Mock current plan - in real app this would come from subscription status
  const currentPlan = userRole === "agency_admin" ? "Starter" : "Business";
  const monthlyPrice = userRole === "agency_admin" ? "$1,500" : "$99";
  const yearlyPrice = userRole === "agency_admin" ? "$18,000" : "$1,188";
  const clientLimit = userRole === "agency_admin" ? 5 : 1;
  
  // Mock usage data - in real app this would come from actual usage
  const currentClients = 3; // Current number of clients
  const competitorsUsed = 47; // Current competitors being tracked
  const competitorLimit = 150; // Limit based on plan
  const nextBillingDate = "Feb 15, 2026"; // Next billing date

  const billingHistory = [
    { date: "2024-01-01", amount: "$99.00", status: "Paid", invoice: "INV-2024-001" },
    { date: "2023-12-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-012" },
    { date: "2023-11-01", amount: "$99.00", status: "Paid", invoice: "INV-2023-011" },
  ];

  return (
    <div className="space-y-6">
      {/* Subscription & Billing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Subscription & Billing</span>
          </CardTitle>
          <CardDescription>
            Manage your agency's Visibl subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Card */}
          <div className="flex items-center justify-between p-6 border rounded-lg bg-green-50 border-green-200">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-green-800">{currentPlan} Plan</h3>
                <Badge className="bg-green-600 text-white">Active</Badge>
              </div>
              <p className="text-green-700 font-medium mt-1">
                {userRole === "agency_admin" ? `${clientLimit} Clients • ${yearlyPrice} per year` : "1 Brand • $1,188 per year"}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Monthly cost: {monthlyPrice}/month
              </p>
            </div>
            <div className="text-right">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Upgrade Plan</Button>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {userRole === "agency_admin" ? "Deep Brands/Clients Used" : "Brands Used"}
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {userRole === "agency_admin" ? `${currentClients}/${clientLimit}` : "1/1"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {userRole === "agency_admin" ? "Client accounts" : "Deep tracked brands"}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Competitors Used</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {userRole === "agency_admin" ? `${competitorsUsed}/${competitorLimit}` : "2/5"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Competitor tracking slots</p>
            </div>
          </div>

          {/* Billing Details */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Billing Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Billing Date:</span>
                <span className="text-sm font-medium text-gray-900">{nextBillingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Annual Cost:</span>
                <span className="text-sm font-medium text-gray-900">{yearlyPrice}</span>
              </div>
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
                <p className="text-sm text-gray-500">Expires 12/26</p>
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
                    <p className="text-sm text-gray-500">{bill.date}</p>
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

      {/* Available Plans for Agency Admins */}
      {userRole === "agency_admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Available Plans</span>
            </CardTitle>
            <CardDescription>
              Choose the plan that best fits your agency's needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Starter Plan */}
            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-green-800">Starter</h3>
                    <Badge className="bg-green-600">Current Plan</Badge>
                  </div>
                  <p className="text-green-700 font-medium">$1,500/month or $18,000/year</p>
                   <ul className="text-sm text-green-700 mt-2 space-y-1">
                     <li>• 5 client accounts</li>
                     <li>• Unlimited competitor tracking per client</li>
                     <li>• White labeled reports</li>
                     <li>• Team collaboration tools</li>
                   </ul>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Professional</h3>
                  <p className="text-gray-700 font-medium">$2,500/month or $30,000/year</p>
                   <ul className="text-sm text-gray-600 mt-2 space-y-1">
                     <li>• 15 client accounts</li>
                     <li>• Everything in Starter, plus:</li>
                     <li>• White labeled reports</li>
                     <li>• Advanced analytics and reporting</li>
                     <li>• Priority support</li>
                     <li>• Custom integrations</li>
                   </ul>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Enterprise</h3>
                  <p className="text-gray-700 font-medium">Contact Sales</p>
                   <ul className="text-sm text-gray-600 mt-2 space-y-1">
                     <li>• Unlimited client accounts</li>
                     <li>• Everything in Professional, plus:</li>
                     <li>• White labeled reports</li>
                     <li>• Dedicated account manager</li>
                     <li>• Custom development</li>
                     <li>• SLA guarantees</li>
                   </ul>
                </div>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade prompt for business users */}
      {userRole !== "agency_admin" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Shield className="w-5 h-5" />
              <span>Upgrade to Agency Plans</span>
            </CardTitle>
            <CardDescription className="text-orange-700">
              Unlock advanced features for agencies and larger teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Multiple client account management</li>
                <li>• White-label reports with your branding</li>
                <li>• Team collaboration tools</li>
                <li>• Priority support</li>
              </ul>
              <Button className="bg-orange-600 hover:bg-orange-700">
                View Agency Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};