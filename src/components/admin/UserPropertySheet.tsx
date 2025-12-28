import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Gift, RotateCcw, ExternalLink, Slack, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AdminUser } from './types';

interface UserPropertySheetProps {
  user: AdminUser | null;
  onClose: () => void;
  onImpersonate: (userId: string) => void;
  onGiftUsage: (userId: string, type: string, amount: number) => void;
  onResetUsage: (userId: string, type: string) => void;
}

export function UserPropertySheet({ 
  user, 
  onClose, 
  onImpersonate, 
  onGiftUsage, 
  onResetUsage 
}: UserPropertySheetProps) {
  if (!user) return null;

  const usageItems = [
    {
      label: 'Prompt Lab Usage',
      used: user.usage.promptsUsed,
      limit: user.usage.promptsLimit,
      key: 'prompts'
    },
    {
      label: 'Brand Slots',
      used: user.usage.brandsActive,
      limit: user.usage.brandsLimit,
      key: 'brands'
    },
    {
      label: 'Chatbots Tracked',
      used: user.usage.chatbotsTracked,
      limit: user.usage.chatbotsLimit,
      key: 'chatbots'
    }
  ];

  const tierColors = {
    starter: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 35%)' },
    pro: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' },
    enterprise: { bg: 'hsl(270 80% 95%)', text: 'hsl(270 70% 45%)' }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-[400px] bg-white border-l shadow-2xl z-50 overflow-hidden"
        style={{ 
          borderColor: 'hsl(0 0% 90%)',
          fontFamily: '"Google Sans Flex", system-ui, sans-serif'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-5 flex items-start justify-between"
          style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}
        >
          <div className="space-y-1">
            <h2 
              className="text-[17px] tracking-[-0.01em]"
              style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
            >
              {user.name}
            </h2>
            <p className="text-[13px]" style={{ color: 'hsl(0 0% 50%)' }}>
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-140px)]">
          {/* Status Row */}
          <div className="flex items-center gap-3">
            <Badge
              style={{
                background: tierColors[user.subscriptionTier].bg,
                color: tierColors[user.subscriptionTier].text,
                fontWeight: 500
              }}
              className="px-2.5 py-0.5 text-[11px] uppercase tracking-wide"
            >
              {user.subscriptionTier}
            </Badge>
            <Badge
              variant="outline"
              className="px-2 py-0.5 text-[11px]"
              style={{
                borderColor: user.status === 'active' ? 'hsl(142 71% 45%)' : 'hsl(0 0% 80%)',
                color: user.status === 'active' ? 'hsl(142 71% 35%)' : 'hsl(0 0% 50%)'
              }}
            >
              {user.status}
            </Badge>
            <span className="text-[12px] ml-auto" style={{ color: 'hsl(0 0% 55%)' }}>
              Last active: {user.lastActive}
            </span>
          </div>

          {/* Impersonate Button */}
          <Button
            variant="outline"
            className="w-full justify-center gap-2 h-10 text-[13px]"
            style={{
              borderColor: 'hsl(0 0% 88%)',
              color: 'hsl(0 0% 25%)',
              fontWeight: 500
            }}
            onClick={() => onImpersonate(user.id)}
          >
            <Eye className="w-4 h-4" />
            View Dashboard as User
          </Button>

          <Separator style={{ background: 'hsl(0 0% 94%)' }} />

          {/* Usage Section */}
          <div className="space-y-4">
            <h3 
              className="text-[13px] uppercase tracking-wide"
              style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
            >
              Current Consumption
            </h3>
            
            {usageItems.map((item) => {
              const percentage = (item.used / item.limit) * 100;
              const isNearLimit = percentage >= 80;
              
              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[13px]"
                      style={{ color: 'hsl(0 0% 30%)' }}
                    >
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-[13px] font-medium tabular-nums"
                        style={{ color: isNearLimit ? 'hsl(0 72% 51%)' : 'hsl(0 0% 25%)' }}
                      >
                        {item.used}/{item.limit}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onResetUsage(user.id, item.key)}
                          title="Reset"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onGiftUsage(user.id, item.key, 10)}
                          title="Gift +10"
                        >
                          <Gift className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-1.5"
                    style={{
                      background: 'hsl(0 0% 94%)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          <Separator style={{ background: 'hsl(0 0% 94%)' }} />

          {/* Content Stats */}
          <div className="space-y-3">
            <h3 
              className="text-[13px] uppercase tracking-wide"
              style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
            >
              Content Studio
            </h3>
            <div 
              className="p-4 rounded-lg"
              style={{ background: 'hsl(0 0% 98%)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: 'hsl(0 0% 40%)' }}>
                  Published Pages
                </span>
                <span 
                  className="text-[20px] font-semibold tabular-nums"
                  style={{ color: 'hsl(0 0% 15%)' }}
                >
                  {user.usage.contentPublished}
                </span>
              </div>
            </div>
          </div>

          {/* Enterprise Features */}
          {user.subscriptionTier === 'enterprise' && user.enterprise && (
            <>
              <Separator style={{ background: 'hsl(0 0% 94%)' }} />
              <div className="space-y-3">
                <h3 
                  className="text-[13px] uppercase tracking-wide"
                  style={{ fontWeight: 600, color: 'hsl(0 0% 45%)' }}
                >
                  Enterprise Features
                </h3>
                
                {user.enterprise.slackWebhook && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-9 text-[13px]"
                    style={{
                      borderColor: 'hsl(0 0% 88%)',
                      color: 'hsl(0 0% 30%)'
                    }}
                  >
                    <Slack className="w-4 h-4" />
                    Open Slack Channel
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </Button>
                )}

                <div className="flex gap-2">
                  {user.enterprise.dedicatedSupport && (
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-2 py-0.5"
                      style={{ background: 'hsl(142 71% 93%)', color: 'hsl(142 71% 35%)' }}
                    >
                      Dedicated Support
                    </Badge>
                  )}
                  {user.enterprise.priorityQueue && (
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-2 py-0.5"
                      style={{ background: 'hsl(45 93% 93%)', color: 'hsl(45 93% 30%)' }}
                    >
                      Priority Queue
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          className="absolute bottom-0 left-0 right-0 px-6 py-4 flex gap-3"
          style={{ 
            borderTop: '0.5px solid hsl(0 0% 92%)',
            background: 'hsl(0 0% 99%)'
          }}
        >
          <Button
            variant="outline"
            className="flex-1 h-9 text-[13px]"
            style={{
              borderColor: 'hsl(0 0% 88%)',
              color: 'hsl(0 0% 40%)'
            }}
          >
            Edit Details
          </Button>
          <Button
            className="flex-1 h-9 text-[13px]"
            style={{
              background: 'hsl(0 0% 10%)',
              color: 'white'
            }}
          >
            Manage Plan
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
