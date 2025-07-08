import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plug, Key, Globe, BarChart3, Copy, Eye, EyeOff } from "lucide-react";

interface IntegrationsSettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const IntegrationsSettings = ({ userRole }: IntegrationsSettingsProps) => {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production API", key: "sk_live_...", created: "2024-01-15", lastUsed: "2024-01-20" },
    { id: 2, name: "Development API", key: "sk_test_...", created: "2024-01-10", lastUsed: "Never" }
  ]);

  const [integrations, setIntegrations] = useState({
    googleAnalytics: { connected: true, account: "analytics@company.com" },
    googleSearchConsole: { connected: true, account: "webmaster@company.com" },
    semrush: { connected: false, account: null },
    ahrefs: { connected: false, account: null }
  });

  const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});

  const handleCreateApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substr(2, 9)}...`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never"
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleIntegration = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        connected: !prev[integration as keyof typeof prev].connected
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Third-party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plug className="w-5 h-5" />
            <span>Third-party Integrations</span>
          </CardTitle>
          <CardDescription>
            Connect your analytics and SEO tools for enhanced insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Analytics */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-500">
                  {integrations.googleAnalytics.connected 
                    ? `Connected as ${integrations.googleAnalytics.account}`
                    : "Not connected"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={integrations.googleAnalytics.connected ? "default" : "secondary"}>
                {integrations.googleAnalytics.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleToggleIntegration("googleAnalytics")}
              >
                {integrations.googleAnalytics.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>

          {/* Google Search Console */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Google Search Console</p>
                <p className="text-sm text-gray-500">
                  {integrations.googleSearchConsole.connected 
                    ? `Connected as ${integrations.googleSearchConsole.account}`
                    : "Not connected"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={integrations.googleSearchConsole.connected ? "default" : "secondary"}>
                {integrations.googleSearchConsole.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleToggleIntegration("googleSearchConsole")}
              >
                {integrations.googleSearchConsole.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>

          {/* SEMrush */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">SEMrush</p>
                <p className="text-sm text-gray-500">
                  {integrations.semrush.connected 
                    ? `Connected as ${integrations.semrush.account}`
                    : "Enhanced competitor analysis"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={integrations.semrush.connected ? "default" : "secondary"}>
                {integrations.semrush.connected ? "Connected" : "Available"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleToggleIntegration("semrush")}
              >
                Connect
              </Button>
            </div>
          </div>

          {/* Ahrefs */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Ahrefs</p>
                <p className="text-sm text-gray-500">
                  {integrations.ahrefs.connected 
                    ? `Connected as ${integrations.ahrefs.account}`
                    : "Advanced backlink analysis"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={integrations.ahrefs.connected ? "default" : "secondary"}>
                {integrations.ahrefs.connected ? "Connected" : "Available"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleToggleIntegration("ahrefs")}
              >
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Management */}
      {userRole === "agency_admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Keys</span>
            </CardTitle>
            <CardDescription>
              Generate and manage API keys for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{apiKey.name}</p>
                      <Badge variant="outline">Live</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {showApiKey[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleApiKeyVisibility(apiKey.id)}
                      >
                        {showApiKey[apiKey.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
            <Separator />
            <Button onClick={handleCreateApiKey} variant="outline" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Create New API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Webhook Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Settings</CardTitle>
          <CardDescription>
            Configure webhooks for real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              placeholder="https://your-app.com/webhooks/gseo"
              type="url"
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Events</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reportComplete">Report Completed</Label>
                  <p className="text-sm text-gray-500">Triggered when a report generation is finished</p>
                </div>
                <Switch id="reportComplete" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="brandAdded">Brand Added</Label>
                  <p className="text-sm text-gray-500">Triggered when a new brand is added for tracking</p>
                </div>
                <Switch id="brandAdded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alertTriggered">Alert Triggered</Label>
                  <p className="text-sm text-gray-500">Triggered when an AI visibility alert is fired</p>
                </div>
                <Switch id="alertTriggered" />
              </div>
            </div>
          </div>
          
          <Button className="w-full">Save Webhook Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};