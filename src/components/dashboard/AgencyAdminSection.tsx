
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddClientDialog } from "@/components/ui/add-client-dialog";
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
  Download,
  Loader2
} from "lucide-react";

export const AgencyAdminSection = () => {
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Nike",
      email: "admin@nike.com",
      status: "Active" as "Active" | "Scanning" | "Pending" | "Inactive",
      tier: "Enterprise",
      deepTrackedBrands: 3,
      competitorBrands: 12,
      lastScan: "1 hour ago",
      avgVisibilityScore: 89,
      visibilityTrend: { value: 4, direction: "up" as const },
      url: "nike.com",
      brand: "nike",
      isScanning: false
    },
    {
      id: 2,
      name: "Adidas",
      email: "contact@adidas.com",
      status: "Active" as "Active" | "Scanning" | "Pending" | "Inactive",
      tier: "Enterprise",
      deepTrackedBrands: 2,
      competitorBrands: 10,
      lastScan: "2 hours ago",
      avgVisibilityScore: 85,
      visibilityTrend: { value: 6, direction: "up" as const },
      url: "adidas.com",
      brand: "adidas",
      isScanning: false
    },
    {
      id: 3,
      name: "Apple",
      email: "team@apple.com",
      status: "Active" as "Active" | "Scanning" | "Pending" | "Inactive",
      tier: "Professional",
      deepTrackedBrands: 4,
      competitorBrands: 8,
      lastScan: "30 minutes ago",
      avgVisibilityScore: 94,
      visibilityTrend: { value: 3, direction: "up" as const },
      url: "apple.com",
      brand: "apple",
      isScanning: false
    }
  ]);

  const handleViewDashboard = (clientId: number, clientName: string) => {
    const client = clients.find(c => c.id === clientId);
    const brandParam = client?.brand || clientName.toLowerCase();
    console.log(`Navigating to dashboard for client ${clientId}: ${clientName} (${brandParam})`);
    // Navigate to the specific brand's dashboard
    window.location.href = `/?brand=${brandParam}&view=dashboard`;
  };

  const handleGenerateReport = (clientId: number, clientName: string) => {
    console.log(`Generating report for ${clientName}`);
    // In a real app, this would trigger report generation
  };

  const handleAddNewClient = () => {
    setShowAddClientDialog(true);
  };

  const handleClientAdded = (newClient: any) => {
    setClients(prev => [...prev, newClient]);
    
    // Simulate completing the scan after 10 seconds
    setTimeout(() => {
      setClients(prev => 
        prev.map(client => 
          client.id === newClient.id 
            ? { 
                ...client, 
                status: "Active" as const, 
                isScanning: false,
                avgVisibilityScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
                lastScan: "Just completed"
              }
            : client
        )
      );
    }, 10000);
  };

  const handleClientSettings = (clientId: number, clientName: string) => {
    const client = clients.find(c => c.id === clientId);
    const brandParam = client?.brand || clientName.toLowerCase();
    console.log(`Opening settings for client ${clientId}: ${clientName} (${brandParam})`);
    // Navigate to client-specific settings page with proper context
    window.location.href = `/?brand=${brandParam}&view=settings`;
  };

  const handleDisableClient = (clientId: number) => {
    setClients(prev =>
      prev.map(client =>
        client.id === clientId
          ? { ...client, status: client.status === "Active" ? "Inactive" : "Active" as "Active" | "Scanning" | "Pending" | "Inactive" }
          : client
      )
    );
  };

  const handleDeleteClient = (clientId: number) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 border-green-200";
      case "Scanning": return "bg-blue-100 text-blue-700 border-blue-200";
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

      {/* Client Accounts - Watchlist Style */}
      <div className="space-y-6">
        {/* Client Tracking Overview */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-foreground">Client Tracking Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Active Clients</div>
              <div className="text-sm text-muted-foreground">
                {clients.filter(c => c.status === "Active").length} / {clients.length} clients
              </div>
            </div>
            
            <Button 
              onClick={handleAddNewClient}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Client
            </Button>
          </CardContent>
        </Card>

        {/* Your Client Portfolio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Your Client Portfolio</h3>
            <p className="text-sm text-muted-foreground">{clients.length} client{clients.length !== 1 ? 's' : ''} tracked</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {clients.map((client) => (
              <Card 
                key={client.id} 
                className="relative overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
                onClick={() => handleViewDashboard(client.id, client.name)}
              >
                {/* Three-dot menu - appears on hover */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 z-50 bg-background">
                      <DropdownMenuItem onClick={() => handleClientSettings(client.id, client.name)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDisableClient(client.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {client.status === "Active" ? "Disable Client" : "Enable Client"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="p-5 space-y-3">
                  {/* Logo/Icon */}
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-20 h-20 bg-background rounded-lg flex items-center justify-center border border-border">
                      {client.isScanning ? (
                        <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                      ) : (
                        <Building className="w-10 h-10 text-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Brand Name & URL */}
                  <div className="text-center space-y-0.5">
                    <h4 className="font-semibold text-base text-foreground">{client.name}</h4>
                    <p className="text-xs text-muted-foreground">{client.url}</p>
                  </div>

                  {/* AI Visibility Score */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="text-xs text-muted-foreground">AI Visibility</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">
                          {client.isScanning ? "--" : `${client.avgVisibilityScore}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mentions */}
                  {!client.isScanning && (
                    <div className="flex items-baseline justify-between pb-3 border-b border-border">
                      <span className="text-xs text-muted-foreground">Mentions</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-semibold text-foreground">
                          {client.deepTrackedBrands}.{client.competitorBrands}K
                        </span>
                        <span className={`text-xs font-medium ${
                          client.visibilityTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {client.visibilityTrend.direction === 'up' ? '+' : '-'}{client.visibilityTrend.value}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status & Report Frequency */}
                  <div className="flex items-center justify-between pt-1">
                    <Badge 
                      variant="secondary"
                      className={`text-xs ${client.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : client.status === 'Scanning' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                    >
                      {client.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{client.tier}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

        <AddClientDialog 
          open={showAddClientDialog} 
          onOpenChange={setShowAddClientDialog}
          onClientAdded={handleClientAdded}
          currentClientCount={clients.length}
          subscriptionTier="Starter"
        />
    </div>
  );
};
