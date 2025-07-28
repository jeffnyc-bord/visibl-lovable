import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, Image, Upload } from "lucide-react";

export const AccountSettings = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [dashboardImage, setDashboardImage] = useState<string | null>(null);


  const handleProfileUpdate = () => {
    // Implementation for profile update
    console.log("Profile updated:", profileData);
  };

  const handlePasswordChange = () => {
    // Implementation for password change
    console.log("Password change requested");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDashboardImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

      {/* Dashboard Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Dashboard Customization</span>
          </CardTitle>
          <CardDescription>
            Customize your overview dashboard appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="dashboardImage">Overview Dashboard Image</Label>
            <div className="flex items-center space-x-4">
              {dashboardImage ? (
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border">
                  <img src={dashboardImage} alt="Dashboard preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-20 rounded-lg bg-gray-100 border flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <input
                  id="dashboardImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('dashboardImage')?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Button>
                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x400px, max 5MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};