import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Star, Shield } from "lucide-react";

interface BillingSettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const BillingSettings = ({ userRole }: BillingSettingsProps) => {
  const currentPlan = userRole === "agency_admin" ? "Agency Pro" : "Business";
  const monthlyPrice = userRole === "agency_admin" ? "$199" : "$99";

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
              <p className="text-sm text-gray-600 mt-1">{userRole === "agency_admin" ? `${monthlyPrice}/month • ` : ""}Billed monthly</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>• {userRole === "agency_admin" ? "Unlimited" : "1"} deep-tracked brand{userRole === "agency_admin" ? "s" : ""}</p>
                <p>• {userRole === "agency_admin" ? "Unlimited" : "5"} competitor slots</p>
                <p>• {userRole === "agency_admin" ? "White-label reports" : "Standard reports"}</p>
                {userRole === "agency_admin" && <p>• Multi-client management</p>}
                {userRole !== "agency_admin" && <p className="text-xs mt-1 text-gray-400">This plan allows for a single deep-tracked brand and a limited number of competitors.</p>}
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" size="sm">Change Plan</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Brands Used</p>
              <p className="text-2xl font-semibold">{userRole === "agency_admin" ? "3" : "1"} / {userRole === "agency_admin" ? "∞" : "1"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Competitor Slots</p>
              <p className="text-2xl font-semibold">{userRole === "agency_admin" ? "7" : "2"} / {userRole === "agency_admin" ? "∞" : "5"}</p>
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

      {userRole !== "agency_admin" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Shield className="w-5 h-5" />
              <span>Upgrade to Agency Pro</span>
            </CardTitle>
            <CardDescription className="text-orange-700">
              Unlock advanced features for agencies and larger teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Unlimited brands and competitor tracking</li>
                <li>• White-label reports with your branding</li>
                <li>• Multi-client management dashboard</li>
                <li>• Advanced team permissions</li>
                <li>• Priority support</li>
              </ul>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Upgrade to Agency Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};