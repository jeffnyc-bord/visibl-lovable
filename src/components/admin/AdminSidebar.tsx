import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Activity, 
  FileText, 
  HeadphonesIcon, 
  Building2,
  X,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import boardLabsIcon from '@/assets/board-labs-icon-hex.png';
import { AdminSection } from './types';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onClose: () => void;
  pendingVerifications: number;
  criticalAlerts: number;
}

const sidebarItems: { key: AdminSection; label: string; icon: React.ElementType }[] = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { key: 'llm-health', label: 'LLM Health', icon: Activity },
  { key: 'actions-log', label: 'Global Actions Log', icon: FileText },
  { key: 'support', label: 'Support Tickets', icon: HeadphonesIcon },
  { key: 'enterprise', label: 'Enterprise', icon: Building2 },
];

export function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  onClose,
  pendingVerifications,
  criticalAlerts 
}: AdminSidebarProps) {
  return (
    <div 
      className="w-[260px] h-full flex flex-col border-r"
      style={{ 
        borderColor: 'hsl(0 0% 92%)',
        background: 'hsl(0 0% 99%)',
        fontFamily: '"Google Sans Flex", system-ui, sans-serif'
      }}
    >
      {/* Header */}
      <div 
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '0.5px solid hsl(0 0% 90%)' }}
      >
        <div className="flex items-center gap-2.5">
          <img src={boardLabsIcon} alt="Logo" className="w-5 h-5" />
          <span 
            className="text-[15px] tracking-[-0.01em]"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            Control Center
          </span>
        </div>
        {criticalAlerts > 0 && (
          <div className="relative">
            <Bell className="w-4 h-4 text-red-500" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-medium">
              {criticalAlerts}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.key;
          const showBadge = item.key === 'enterprise' && pendingVerifications > 0;
          
          return (
            <motion.button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all duration-150"
              style={{
                background: isActive ? 'hsl(0 0% 95%)' : 'transparent',
                color: isActive ? 'hsl(0 0% 10%)' : 'hsl(0 0% 45%)',
                fontWeight: isActive ? 500 : 400
              }}
            >
              <div className="flex items-center gap-2.5">
                <item.icon 
                  className="w-4 h-4" 
                  style={{ 
                    strokeWidth: isActive ? 2 : 1.5,
                    opacity: isActive ? 1 : 0.7 
                  }} 
                />
                {item.label}
              </div>
              {showBadge && (
                <Badge 
                  variant="destructive" 
                  className="h-5 px-1.5 text-[10px] font-medium"
                >
                  {pendingVerifications}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div 
        className="p-4"
        style={{ borderTop: '0.5px solid hsl(0 0% 90%)' }}
      >
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-[13px] h-9"
          style={{ 
            color: 'hsl(0 0% 45%)',
            fontWeight: 400
          }}
          onClick={onClose}
        >
          <X className="w-4 h-4" />
          Exit Control Center
        </Button>
      </div>
    </div>
  );
}
