import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";

export const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    displayName: "John Doe",
    username: "johndoe",
    bio: "",
    company: "Acme Inc"
  });

  const handleSave = () => {
    console.log("Profile saved:", profileData);
  };

  const initials = profileData.displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your public profile information
        </p>
      </div>

      <Separator />

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 border-2 border-border">
          <AvatarFallback className="text-xl bg-muted text-muted-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Change photo
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG or GIF. Max 2MB.
          </p>
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium">
          Display name
        </Label>
        <Input
          id="displayName"
          value={profileData.displayName}
          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
          className="max-w-md"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Username
        </Label>
        <Input
          id="username"
          value={profileData.username}
          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
          className="max-w-md"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio
        </Label>
        <Input
          id="bio"
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself"
          className="max-w-md"
        />
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium">
          Company
        </Label>
        <Input
          id="company"
          value={profileData.company}
          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
          className="max-w-md"
        />
      </div>

      <Button onClick={handleSave}>Save changes</Button>
    </div>
  );
};
