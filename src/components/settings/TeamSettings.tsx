import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, MoreHorizontal, Shield, Eye, Edit } from "lucide-react";

interface TeamSettingsProps {
  userRole: "business_user" | "agency_admin";
}

export const TeamSettings = ({ userRole }: TeamSettingsProps) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  const teamMembers = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john.doe@example.com", 
      role: "Admin", 
      status: "Active",
      initials: "JD"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane.smith@example.com", 
      role: "Editor", 
      status: "Active",
      initials: "JS"
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike.johnson@example.com", 
      role: "Viewer", 
      status: "Pending",
      initials: "MJ"
    }
  ];

  const handleInviteUser = () => {
    console.log("Inviting user:", { email: inviteEmail, role: inviteRole });
    setInviteEmail("");
    setInviteRole("viewer");
  };

  const rolePermissions = {
    admin: "Full access to all features and settings",
    editor: "Can create and edit reports, manage brands",
    viewer: "Read-only access to reports and data"
  };

  return (
    <div className="space-y-6">
      {/* Invite Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Invite Team Members</span>
          </CardTitle>
          <CardDescription>
            Add new team members to your {userRole === "agency_admin" ? "agency" : "account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleInviteUser} disabled={!inviteEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
          <CardDescription>
            Manage your team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                    {member.status}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {member.role === "Admin" && <Shield className="w-4 h-4 text-blue-600" />}
                    {member.role === "Editor" && <Edit className="w-4 h-4 text-green-600" />}
                    {member.role === "Viewer" && <Eye className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm font-medium">{member.role}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding what each role can do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Admin</p>
                <p className="text-sm text-gray-600">Full access to all features and settings</p>
                <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <li>• Manage team members and billing</li>
                  <li>• Create, edit, and delete all content</li>
                  <li>• Configure integrations and settings</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Edit className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Editor</p>
                <p className="text-sm text-gray-600">Can create and edit reports, manage brands</p>
                <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <li>• Add and manage brands</li>
                  <li>• Create and edit reports</li>
                  <li>• View all analytics data</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <Eye className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Viewer</p>
                <p className="text-sm text-gray-600">Read-only access to reports and data</p>
                <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <li>• View reports and analytics</li>
                  <li>• Export data and reports</li>
                  <li>• No editing capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};