import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: 'product_limit' | 'tracking_frequency' | 'platform_expansion' | 'prompt_limit';
}

export const UpgradeDialog = ({ open, onOpenChange, reason }: UpgradeDialogProps) => {
  const { tier } = useSubscription();

  const plans = [
    {
      name: 'Pro',
      price: '$99/month',
      features: [
        'Daily tracking',
        'Up to 25 products',
        '4 AI platforms',
        'Up to 50 prompts',
        'Advanced analytics',
        'Priority support',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Daily tracking',
        'Unlimited products',
        'All AI platforms',
        'Unlimited prompts',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
      ],
    },
  ];

  const getMessage = () => {
    switch (reason) {
      case 'product_limit':
        return tier === 'starter'
          ? 'You\'ve reached the limit of 2 chatbots on the Starter plan.'
          : 'You\'ve reached the limit of 10 chatbots on the Pro plan.';
      case 'tracking_frequency':
        return 'Daily tracking is only available on Pro and Enterprise plans.';
      case 'platform_expansion':
        return tier === 'starter'
          ? 'Expand your AI coverage beyond 2 platforms. Upgrade to Pro for access to 4 AI platforms or Enterprise for unlimited coverage.'
          : 'Unlock all AI platforms with an Enterprise plan for maximum coverage.';
      case 'prompt_limit':
        return tier === 'starter'
          ? 'You\'ve reached the limit of 10 prompts on the Starter plan. Upgrade to Pro for up to 50 prompts.'
          : 'Unlock unlimited prompts with an Enterprise plan.';
      default:
        return 'Upgrade your plan to unlock more features.';
    }
  };

  const getTitle = () => {
    switch (reason) {
      case 'platform_expansion':
        return 'Expand Your AI Coverage';
      case 'prompt_limit':
        return 'Unlock More Prompts';
      default:
        return 'Upgrade Your Plan';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getMessage()}</DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {plans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2">{plan.price}</p>
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full">
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
