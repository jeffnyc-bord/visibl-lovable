import { useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { UsersModule } from "./UsersModule";
import { LLMHealthModule } from "./LLMHealthModule";
import { SubscriptionsModule } from "./SubscriptionsModule";
import { EnterpriseModule } from "./EnterpriseModule";
import { ActionsLogModule } from "./ActionsLogModule";
import { SupportModule } from "./SupportModule";
import { GlobalNotificationCenter } from "./GlobalNotificationCenter";
import { AdminSection } from "./types";
import { 
  mockAdminUsers, 
  mockLLMProviders, 
  mockSubscriptions, 
  mockBrandVerifications, 
  mockActionLog,
  mockRevenueStats 
} from "./mockData";

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("users");
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const pendingVerifications = mockBrandVerifications.filter(b => b.status === 'pending').length;
  const criticalAlerts = mockLLMProviders.filter(p => p.status === 'down').length;

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UsersModule users={mockAdminUsers} />;
      case 'subscriptions':
        return <SubscriptionsModule subscriptions={mockSubscriptions} revenueStats={mockRevenueStats} />;
      case 'llm-health':
        return <LLMHealthModule providers={mockLLMProviders} />;
      case 'actions-log':
        return <ActionsLogModule entries={mockActionLog} />;
      case 'support':
        return <SupportModule />;
      case 'enterprise':
        return <EnterpriseModule brandVerifications={mockBrandVerifications} />;
      default:
        return <UsersModule users={mockAdminUsers} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100]"
      style={{ 
        background: 'hsl(0 0% 99%)',
        fontFamily: '"Google Sans Flex", system-ui, sans-serif'
      }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onClose={onClose}
          pendingVerifications={pendingVerifications}
          criticalAlerts={criticalAlerts}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div 
            className="h-14 px-6 flex items-center justify-end gap-3"
            style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8 text-[12px]"
              style={{
                borderColor: 'hsl(0 0% 88%)',
                color: 'hsl(0 0% 35%)',
                fontWeight: 500
              }}
              onClick={() => setShowNotificationCenter(true)}
            >
              <Bell className="w-3.5 h-3.5" />
              Push Alert
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Global Notification Center Modal */}
      <GlobalNotificationCenter
        open={showNotificationCenter}
        onOpenChange={setShowNotificationCenter}
      />
    </motion.div>
  );
}
