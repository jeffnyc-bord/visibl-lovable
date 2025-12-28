import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Database, 
  Activity, 
  Settings, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  HardDrive,
  Cpu,
  Globe,
  Search,
  MoreHorizontal,
  ChevronRight,
  X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import boardLabsIcon from "@/assets/board-labs-icon-hex.png";

interface AdminDashboardProps {
  onClose: () => void;
}

// Mock data for admin dashboard
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", lastActive: "2 min ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", lastActive: "15 min ago" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "User", status: "inactive", lastActive: "2 days ago" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "active", lastActive: "1 hour ago" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "User", status: "pending", lastActive: "Never" },
];

const mockSystemStats = {
  cpu: 45,
  memory: 62,
  storage: 38,
  uptime: "99.9%",
  requests: "12.4k",
  avgResponseTime: "142ms"
};

const mockRecentActivity = [
  { id: 1, action: "User signup", user: "charlie@example.com", time: "2 min ago", type: "info" },
  { id: 2, action: "Failed login attempt", user: "unknown@test.com", time: "15 min ago", type: "warning" },
  { id: 3, action: "Database backup completed", user: "System", time: "1 hour ago", type: "success" },
  { id: 4, action: "New brand added", user: "john@example.com", time: "2 hours ago", type: "info" },
  { id: 5, action: "Rate limit exceeded", user: "api-client-42", time: "3 hours ago", type: "warning" },
];

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarItems = [
    { key: "overview", label: "Overview", icon: Activity },
    { key: "users", label: "Users", icon: Users },
    { key: "system", label: "System Health", icon: Server },
    { key: "security", label: "Security", icon: Shield },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background"
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={boardLabsIcon} alt="Logo" className="w-5 h-5" />
              <span className="font-semibold text-foreground">Admin Console</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">DEV</Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Close Button */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={onClose}
            >
              <X className="w-4 h-4" />
              Exit Admin
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              {sidebarItems.find(s => s.key === activeSection)?.label || "Overview"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Config
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 space-y-6">
            {activeSection === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                          <p className="text-2xl font-bold text-foreground">1,247</p>
                        </div>
                        <div className="p-3 rounded-full bg-primary/10">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12.5% from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Sessions</p>
                          <p className="text-2xl font-bold text-foreground">342</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                          <Activity className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Real-time</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">API Requests</p>
                          <p className="text-2xl font-bold text-foreground">{mockSystemStats.requests}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Avg: {mockSystemStats.avgResponseTime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">System Uptime</p>
                          <p className="text-2xl font-bold text-foreground">{mockSystemStats.uptime}</p>
                        </div>
                        <div className="p-3 rounded-full bg-emerald-100">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                        <span>All systems operational</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                    <CardDescription>Latest system events and user actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockRecentActivity.map((activity) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'success' ? 'bg-green-500' :
                              activity.type === 'warning' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.user}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "users" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">User Management</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Users className="w-4 h-4" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                user.status === 'active' ? 'border-green-500 text-green-600' :
                                user.status === 'inactive' ? 'border-gray-400 text-gray-500' :
                                'border-yellow-500 text-yellow-600'
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">{user.lastActive}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeSection === "system" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">CPU Usage</span>
                        </div>
                        <span className="text-lg font-bold">{mockSystemStats.cpu}%</span>
                      </div>
                      <Progress value={mockSystemStats.cpu} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Memory</span>
                        </div>
                        <span className="text-lg font-bold">{mockSystemStats.memory}%</span>
                      </div>
                      <Progress value={mockSystemStats.memory} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Storage</span>
                        </div>
                        <span className="text-lg font-bold">{mockSystemStats.storage}%</span>
                      </div>
                      <Progress value={mockSystemStats.storage} className="h-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Logs</CardTitle>
                    <CardDescription>Recent system events and errors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-2 max-h-64 overflow-auto">
                      <div className="text-green-600">[2024-01-15 10:23:45] INFO: Database connection established</div>
                      <div className="text-foreground">[2024-01-15 10:23:44] INFO: Server started on port 3000</div>
                      <div className="text-yellow-600">[2024-01-15 10:22:30] WARN: Rate limit threshold approaching</div>
                      <div className="text-foreground">[2024-01-15 10:22:15] INFO: Cache cleared successfully</div>
                      <div className="text-foreground">[2024-01-15 10:21:00] INFO: Scheduled backup completed</div>
                      <div className="text-green-600">[2024-01-15 10:20:45] INFO: Health check passed</div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security Overview</CardTitle>
                  <CardDescription>Monitor security events and threats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Firewall</span>
                      </div>
                      <p className="text-sm text-green-600">Active & Protected</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">SSL/TLS</span>
                      </div>
                      <p className="text-sm text-green-600">Valid until Dec 2025</p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Threats Blocked</span>
                      </div>
                      <p className="text-sm text-yellow-600">23 this week</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Recent Security Events</h4>
                    <div className="space-y-2">
                      {[
                        { event: "Blocked suspicious IP: 192.168.1.x", time: "2 hours ago", severity: "warning" },
                        { event: "Password reset requested", time: "5 hours ago", severity: "info" },
                        { event: "2FA enabled for admin user", time: "1 day ago", severity: "success" },
                      ].map((event, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              event.severity === 'warning' ? 'bg-yellow-500' :
                              event.severity === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                            <span className="text-sm">{event.event}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admin Settings</CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Settings configuration panel would go here. This is a dev-only admin dashboard for testing purposes.
                    </p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
