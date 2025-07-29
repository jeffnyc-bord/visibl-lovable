
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

  const handleViewDashboard = (clientId: number, clientName: string) => {
    console.log(`Navigating to dashboard for client ${clientId}: ${clientName}`);
    // Navigate to client's AI Visibility Dashboard
    // This would typically use React Router or update parent component state
    window.location.href = `/?client=${clientId}&view=dashboard`;
  };

  const handleGenerateReport = (clientId: number, clientName: string) => {
    console.log(`Generating report for ${clientName}`);
    // In a real app, this would trigger report generation
  };

  const handleAddNewClient = () => {
    console.log("Opening Add New Client modal");
    // This would open a modal/form for client onboarding
    alert("Add New Client functionality would open here");
  };

  const handleClientSettings = (clientId: number, clientName: string) => {
    console.log(`Opening settings for client ${clientId}: ${clientName}`);
    // Navigate to client-specific settings page
    window.location.href = `/?client=${clientId}&view=settings`;
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

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-gray-900">Client Accounts</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Manage all client accounts and their brand tracking configurations
            </CardDescription>
          </div>
          <Button 
            onClick={handleAddNewClient}
            className="bg-black hover:bg-gray-800 text-white text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="space-y-3">
                  {clients.map((client) => {
                    const healthIndicator = getHealthIndicator(client.avgVisibilityScore);
                    return (
                      <div 
                        key={client.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDashboard(client.id, client.name)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-lg flex items-center justify-center border">
                            <Building className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-foreground text-sm">{client.name}</h3>
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">{client.url}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center justify-center">
                              <span className="text-lg font-bold text-foreground">{client.avgVisibilityScore}%</span>
                              <span className={`text-xs ml-1 ${
                                client.visibilityTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {client.visibilityTrend.direction === 'up' ? '+' : '-'}{client.visibilityTrend.value}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">Visibility Score</p>
                          </div>
                          
                          
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              {client.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{client.tier}</p>
                          </div>
                          
                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleClientSettings(client.id, client.name)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
      </Card>
    </div>
  );
};
