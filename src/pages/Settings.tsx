import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Users, Plug, Building } from "lucide-react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { IntegrationsSettings } from "@/components/settings/IntegrationsSettings";
import { AgencySettings } from "@/components/settings/AgencySettings";

interface SettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const Settings = ({ userRole }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, billing, team, and integrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
          <TabsTrigger value="account" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <User className="w-4 h-4" />
            <span>Account</span>
          </TabsTrigger>
          {userRole === "agency_admin" && (
            <TabsTrigger value="agency" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
              <Building className="w-4 h-4" />
              <span>Agency</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="billing" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <CreditCard className="w-4 h-4" />
            <span>Billing</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <Users className="w-4 h-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2 data-[state=active]:bg-gray-100 text-sm px-4 py-2">
            <Plug className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        {userRole === "agency_admin" && (
          <TabsContent value="agency">
            <AgencySettings />
          </TabsContent>
        )}

        <TabsContent value="billing">
          <BillingSettings userRole={userRole} />
        </TabsContent>

        <TabsContent value="team">
          <TeamSettings userRole={userRole} />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
};