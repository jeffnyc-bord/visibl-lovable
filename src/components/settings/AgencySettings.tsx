import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building,
  CreditCard,
  Users,
  Settings,
  UserPlus,
  Upload,
  Palette
} from "lucide-react";

export const AgencySettings = () => {
  return (
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
              <Input defaultValue="Digital Marketing Pro" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Primary Contact Email</label>
              <Input defaultValue="admin@digitalmarketingpro.com" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Website</label>
              <Input defaultValue="https://digitalmarketingpro.com" className="h-9" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Industry Focus</label>
              <Select defaultValue="general">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Marketing</SelectItem>
                  <SelectItem value="saas">SaaS & Technology</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-gray-900 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Subscription & Billing
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Manage your agency's Visibl subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Agency Pro Plan</h3>
                  <p className="text-sm text-blue-700">50 Deep Brands • 150 Competitors</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">Active</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">11/50</p>
                <p className="text-xs text-gray-600">Deep Brands Used</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">47/150</p>
                <p className="text-xs text-gray-600">Competitors Used</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Next billing date:</span>
                <span className="font-medium">Feb 15, 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly cost:</span>
                <span className="font-medium">$299/month</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                View Usage
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-gray-900 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Team Management
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Manage your agency team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Team Member */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Input placeholder="team-member@youragency.com" className="flex-1 h-9" />
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
  );
};