
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar,
  Building,
  Mail,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus
} from "lucide-react";

export const AgencyAdminSection = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Tech Startup Inc",
      email: "admin@techstartup.com",
      status: "Active",
      tier: "Professional",
      deepTrackedBrands: 2,
      competitorBrands: 8,
      lastReport: "2 hours ago",
      avgVisibilityScore: 78
    },
    {
      id: 2,
      name: "Marketing Agency Co",
      email: "contact@marketingco.com",
      status: "Active",
      tier: "Enterprise",
      deepTrackedBrands: 5,
      competitorBrands: 15,
      lastReport: "1 hour ago",
      avgVisibilityScore: 82
    },
    {
      id: 3,
      name: "Local Restaurant Group",
      email: "info@restaurants.com",
      status: "Pending",
      tier: "Basic",
      deepTrackedBrands: 1,
      competitorBrands: 5,
      lastReport: "6 hours ago",
      avgVisibilityScore: 65
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Inactive": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Enterprise": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Professional": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Basic": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Agency Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-xs text-gray-600">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, client) => sum + client.deepTrackedBrands, 0)}
                </p>
                <p className="text-xs text-gray-600">Deep Tracked Brands</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(clients.reduce((sum, client) => sum + client.avgVisibilityScore, 0) / clients.length)}%
                </p>
                <p className="text-xs text-gray-600">Avg Visibility Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-600">Reports This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border border-gray-200 p-0.5 shadow-sm">
            <TabsTrigger value="clients" className="text-sm px-4 py-2">Client Management</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm px-4 py-2">Agency Settings</TabsTrigger>
          </TabsList>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>

        <TabsContent value="clients">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base text-gray-900">Client Accounts</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Manage all client accounts and their brand tracking configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{client.name}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(client.status)}`}>
                            {client.status}
                          </Badge>
                          <Badge className={`text-xs px-2 py-0.5 ${getTierColor(client.tier)}`}>
                            {client.tier}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">Last report: {client.lastReport}</p>
                      </div>
                      
                      <div className="text-right text-xs">
                        <p className="text-gray-900 font-medium">
                          {client.deepTrackedBrands} Deep / {client.competitorBrands} Comp
                        </p>
                        <p className="text-gray-600">Visibility: {client.avgVisibilityScore}%</p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-gray-900">Default Client Settings</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Configure default settings for new client accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Default Subscription Tier</label>
                  <Select defaultValue="basic">
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (1 Deep, 5 Competitors)</SelectItem>
                      <SelectItem value="professional">Professional (3 Deep, 10 Competitors)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (5 Deep, 20 Competitors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Default Report Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (Deep Tracked)</SelectItem>
                      <SelectItem value="weekly">Weekly (Competitors)</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly (Competitors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-gray-900">Agency Branding</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Customize the appearance for your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Agency Name</label>
                  <Input placeholder="Your Agency Name" className="h-9" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Domain</label>
                  <Input placeholder="reports.youragency.com" className="h-9" />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
