import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminUser } from './types';
import { UserPropertySheet } from './UserPropertySheet';
import { toast } from '@/hooks/use-toast';

interface UsersModuleProps {
  users: AdminUser[];
}

export function UsersModule({ users }: UsersModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImpersonate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: 'Impersonation Mode',
      description: `Now viewing dashboard as ${user?.name}`,
    });
  };

  const handleGiftUsage = (userId: string, type: string, amount: number) => {
    toast({
      title: 'Usage Extended',
      description: `Added +${amount} ${type} to user account`,
    });
  };

  const handleResetUsage = (userId: string, type: string) => {
    toast({
      title: 'Usage Reset',
      description: `Reset ${type} usage for this billing cycle`,
    });
  };

  const tierColors = {
    starter: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 35%)' },
    pro: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' },
    enterprise: { bg: 'hsl(270 80% 95%)', text: 'hsl(270 70% 45%)' }
  };

  const statusColors = {
    active: { border: 'hsl(142 71% 45%)', text: 'hsl(142 71% 35%)' },
    inactive: { border: 'hsl(0 0% 75%)', text: 'hsl(0 0% 50%)' },
    pending: { border: 'hsl(45 93% 47%)', text: 'hsl(45 93% 35%)' }
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{ fontFamily: '"Google Sans Flex", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div 
        className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}
      >
        <div>
          <h1 
            className="text-[20px] tracking-[-0.02em]"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            Identity & Access
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            {users.length} total users
          </p>
        </div>
        <Button 
          className="gap-2 h-9 text-[13px]"
          style={{ 
            background: 'hsl(0 0% 10%)', 
            color: 'white',
            fontWeight: 500
          }}
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
            style={{ color: 'hsl(0 0% 50%)' }}
          />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-[13px]"
            style={{
              background: 'hsl(0 0% 98%)',
              borderColor: 'hsl(0 0% 90%)',
              fontFamily: '"Google Sans Flex", system-ui, sans-serif'
            }}
          />
        </div>
      </div>

      {/* User List - High Density Table */}
      <div className="flex-1 overflow-auto px-6">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                User
              </th>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Role
              </th>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Plan
              </th>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Status
              </th>
              <th 
                className="text-right py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Last Active
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedUser(user)}
                className="cursor-pointer group"
                style={{ borderBottom: '0.5px solid hsl(0 0% 94%)' }}
              >
                <td className="py-3">
                  <div>
                    <p 
                      className="text-[13px] group-hover:text-primary transition-colors"
                      style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                    >
                      {user.name}
                    </p>
                    <p className="text-[12px]" style={{ color: 'hsl(0 0% 55%)' }}>
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="py-3">
                  <span 
                    className="text-[12px] capitalize"
                    style={{ color: 'hsl(0 0% 40%)' }}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3">
                  <Badge
                    className="text-[10px] uppercase tracking-wide px-2 py-0.5"
                    style={{
                      background: tierColors[user.subscriptionTier].bg,
                      color: tierColors[user.subscriptionTier].text,
                      fontWeight: 500
                    }}
                  >
                    {user.subscriptionTier}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge
                    variant="outline"
                    className="text-[10px] capitalize px-2 py-0.5"
                    style={{
                      borderColor: statusColors[user.status].border,
                      color: statusColors[user.status].text
                    }}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="py-3 text-right">
                  <span 
                    className="text-[12px] tabular-nums"
                    style={{ color: 'hsl(0 0% 55%)' }}
                  >
                    {user.lastActive}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Property Sheet */}
      {selectedUser && (
        <UserPropertySheet
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onImpersonate={handleImpersonate}
          onGiftUsage={handleGiftUsage}
          onResetUsage={handleResetUsage}
        />
      )}
    </div>
  );
}
