
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  UserPlus,
  FileText,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Upload,
  Palette,
  Download
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
      lastScan: "2 hours ago",
      avgVisibilityScore: 78,
      visibilityTrend: { value: 5, direction: "up" },
      url: "techstartup.com"
    },
    {
      id: 2,
      name: "Marketing Agency Co",
      email: "contact@marketingco.com",
      status: "Active",
      tier: "Enterprise",
      deepTrackedBrands: 5,
      competitorBrands: 15,
      lastScan: "1 hour ago",
      avgVisibilityScore: 82,
      visibilityTrend: { value: 3, direction: "up" },
      url: "marketingco.com"
    },
    {
      id: 3,
      name: "Local Restaurant Group",
      email: "info@restaurants.com",
      status: "Pending",
      tier: "Basic",
      deepTrackedBrands: 1,
      competitorBrands: 5,
      lastScan: "6 hours ago",
      avgVisibilityScore: 65,
      visibilityTrend: { value: 2, direction: "down" },
      url: "restaurants.com"
    },
    {
      id: 4,
      name: "E-commerce Store",
      email: "team@ecomstore.com",
      status: "Active",
      tier: "Professional",
      deepTrackedBrands: 3,
      competitorBrands: 12,
      lastScan: "30 minutes ago",
      avgVisibilityScore: 91,
      visibilityTrend: { value: 7, direction: "up" },
      url: "ecomstore.com"
    }
  ]);

  const handleViewDashboard = (clientId: number) => {
    console.log(`Navigating to dashboard for client ${clientId}`);
    // In a real app, this would navigate to the client's dashboard
  };

  const handleGenerateReport = (clientId: number, clientName: string) => {
    console.log(`Generating report for ${clientName}`);
    // In a real app, this would trigger report generation
  };

  const handleEditClient = (clientId: number) => {
    console.log(`Editing client ${clientId}`);
    // In a real app, this would open edit modal
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

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

  const getHealthIndicator = (score: number) => {
    if (score >= 80) return { color: "bg-green-500", label: "Excellent" };
    if (score >= 60) return { color: "bg-yellow-500", label: "Needs Attention" };
    return { color: "bg-red-500", label: "Critical" };
  };

  return (
    <div className="space-y-6">
      {/* Agency Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === "Active").length}</p>
                  <p className="text-xs text-gray-600">Active Clients</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.reduce((sum, client) => sum + client.deepTrackedBrands, 0)}
                  </p>
                  <p className="text-xs text-gray-600">Brands Under Management</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(clients.reduce((sum, client) => sum + client.avgVisibilityScore, 0) / clients.length)}%
                    </p>
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      <span className="text-xs font-medium">+2%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Avg Visibility Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-600">Reports This Week</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800">
                <ExternalLink className="w-3 h-3 mr-1" />
                View All
              </Button>
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
              <TooltipProvider>
                <div className="space-y-3">
                  {clients.map((client) => {
                    const healthIndicator = getHealthIndicator(client.avgVisibilityScore);
                    return (
                      <div 
                        key={client.id} 
                        className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleViewDashboard(client.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                              {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{client.name}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{client.email}</span>
                              </div>
                              <span>•</span>
                              <span className="text-blue-600 font-medium">{client.url}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                          <div className="text-center">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={`text-xs px-2 py-1 font-medium ${getStatusColor(client.status)}`}>
                                {client.status}
                              </Badge>
                              <Badge className={`text-xs px-2 py-1 font-medium ${getTierColor(client.tier)}`}>
                                {client.tier}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">Last AI Scan: {client.lastScan}</p>
                          </div>
                          
                          <div className="text-center relative">
                            <div className="flex items-center justify-center space-x-3 mb-1">
                              <div className="flex items-center space-x-1">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className={`w-3 h-3 rounded-full ${healthIndicator.color} ring-2 ring-white shadow-sm`}></div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{healthIndicator.label}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <span className="text-xl font-bold text-gray-900">{client.avgVisibilityScore}%</span>
                              </div>
                              <div className={`flex items-center ${
                                client.visibilityTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {client.visibilityTrend.direction === 'up' ? 
                                  <ArrowUp className="w-3 h-3" /> : 
                                  <ArrowDown className="w-3 h-3" />
                                }
                                <span className="text-sm font-medium">{client.visibilityTrend.value}%</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">Visibility Score</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {client.deepTrackedBrands} Deep / {client.competitorBrands} Comp
                            </p>
                            <p className="text-xs text-gray-600">Brand Limits</p>
                          </div>
                          
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDashboard(client.id);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Dashboard</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateReport(client.id, client.name);
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Generate Report</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-9 w-9 p-0 hover:bg-orange-100 hover:text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClient(client.id);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Client</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClient(client.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Client</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Agency Profile & Subscription */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-gray-900">Agency Profile</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Basic information about your agency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Agency Name</label>
                    <Input placeholder="Your Agency Name" className="h-9" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Email</label>
                    <Input placeholder="contact@youragency.com" className="h-9" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Website</label>
                    <Input placeholder="www.youragency.com" className="h-9" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-gray-900">Subscription & Billing</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your agency's master subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900">Enterprise Plan</span>
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    </div>
                    <p className="text-sm text-blue-700">50 Deep-Tracked Brands • 200 Competitors</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Used: 11/50 Deep Brands</span>
                      <span className="text-gray-600">78/200 Competitors</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Manage Billing
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Team Management */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-gray-900">Team Management</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Invite and manage agency team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Input placeholder="team@youragency.com" className="flex-1 h-9" />
                    <Select defaultValue="editor">
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                  
                  {/* Current Team Members */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">JD</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-600">john@youragency.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Admin</Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">SM</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sarah Miller</p>
                          <p className="text-xs text-gray-600">sarah@youragency.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Editor</Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* White-Labeling & Default Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-gray-900 flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    White-Labeling
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Customize reports and client-facing materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Agency Logo</label>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Upload className="w-4 h-4 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Brand Color Theme</label>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg border-2 border-blue-700 cursor-pointer"></div>
                      <div className="w-8 h-8 bg-green-600 rounded-lg border-2 border-transparent cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-600 rounded-lg border-2 border-transparent cursor-pointer"></div>
                      <div className="w-8 h-8 bg-orange-600 rounded-lg border-2 border-transparent cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-600 rounded-lg border-2 border-transparent cursor-pointer"></div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Domain</label>
                    <Input placeholder="reports.youragency.com" className="h-9" />
                    <p className="text-xs text-gray-500 mt-1">For white-labeled client reports</p>
                  </div>
                </CardContent>
              </Card>
              
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
                    <Select defaultValue="professional">
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
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Auto-Generate Reports</label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Disabled</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
