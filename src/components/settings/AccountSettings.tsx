import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, Bell } from "lucide-react";

export const AccountSettings = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    reportCompletion: true,
    systemUpdates: false,
    weeklyDigest: true,
    marketingEmails: false
  });

  const handleProfileUpdate = () => {
    // Implementation for profile update
    console.log("Profile updated:", profileData);
  };

  const handlePasswordChange = () => {
    // Implementation for password change
    console.log("Password change requested");
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
          </div>
          <Button onClick={handleProfileUpdate}>Update Profile</Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={profileData.currentPassword}
              onChange={(e) => setProfileData(prev => ({...prev, currentPassword: e.target.value}))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData(prev => ({...prev, newPassword: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData(prev => ({...prev, confirmPassword: e.target.value}))}
              />
            </div>
          </div>
          <Button onClick={handlePasswordChange}>Change Password</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Choose which notifications you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reportCompletion">Report Completion</Label>
                <p className="text-sm text-gray-500">Get notified when your reports are ready</p>
              </div>
              <Switch
                id="reportCompletion"
                checked={notifications.reportCompletion}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, reportCompletion: checked}))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemUpdates">System Updates</Label>
                <p className="text-sm text-gray-500">Receive notifications about platform updates</p>
              </div>
              <Switch
                id="systemUpdates"
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, systemUpdates: checked}))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                <p className="text-sm text-gray-500">Get a weekly summary of your brand performance</p>
              </div>
              <Switch
                id="weeklyDigest"
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, weeklyDigest: checked}))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails">Marketing Emails</Label>
                <p className="text-sm text-gray-500">Receive product updates and marketing communications</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, marketingEmails: checked}))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};