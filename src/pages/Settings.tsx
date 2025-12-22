import { useState } from "react";
import { 
  User, 
  CircleUser, 
  Lock, 
  UserPlus, 
  Users, 
  Monitor, 
  Sparkles, 
  Palette,
  CreditCard
} from "lucide-react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettingsPanel } from "@/components/settings/AccountSettingsPanel";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import { InviteSettings } from "@/components/settings/InviteSettings";
import { PeopleSettings } from "@/components/settings/PeopleSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { ColorSchemeSettings } from "@/components/settings/ColorSchemeSettings";
import { BillingSettingsPanel } from "@/components/settings/BillingSettingsPanel";
import { Card } from "@/components/ui/card";

interface SettingsProps {
  userRole: "business_user" | "agency_admin";
}

type SettingsTab = 
  | "profile" 
  | "account" 
  | "password" 
  | "invite" 
  | "people" 
  | "appearance" 
  | "theme" 
  | "color-scheme"
  | "billing";

interface NavItem {
  key: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Personal Settings",
    items: [
      { key: "profile", label: "Profile", icon: User },
      { key: "account", label: "Account", icon: CircleUser },
      { key: "password", label: "Password & Authentication", icon: Lock },
      { key: "invite", label: "Invite", icon: UserPlus },
      { key: "people", label: "People / Workspace", icon: Users },
    ],
  },
  {
    title: "Preferences",
    items: [
      { key: "appearance", label: "Appearance", icon: Monitor },
      { key: "theme", label: "Theme Selection", icon: Sparkles },
      { key: "color-scheme", label: "Color Scheme", icon: Palette },
    ],
  },
  {
    title: "Billing",
    items: [
      { key: "billing", label: "Billing", icon: CreditCard },
    ],
  },
];

export const Settings = ({ userRole }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "account":
        return <AccountSettingsPanel />;
      case "password":
        return <PasswordSettings />;
      case "invite":
        return <InviteSettings />;
      case "people":
        return <PeopleSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "theme":
        return <ThemeSettings />;
      case "color-scheme":
        return <ColorSchemeSettings />;
      case "billing":
        return <BillingSettingsPanel />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex max-w-6xl mx-auto">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-border py-6 pr-6">
          <nav className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => setActiveTab(item.key)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 py-6 pl-8">
          <Card className="p-6 border-border">
            {renderContent()}
          </Card>
        </main>
      </div>
    </div>
  );
};
