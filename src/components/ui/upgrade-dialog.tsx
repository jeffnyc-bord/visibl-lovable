import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: 'product_limit' | 'tracking_frequency';
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
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
      ],
    },
  ];

  const getMessage = () => {
    if (reason === 'product_limit') {
      return tier === 'free'
        ? 'You\'ve reached the limit of 10 products on the Free plan.'
        : 'You\'ve reached the limit of 25 products on the Pro plan.';
    }
    return 'Daily tracking is only available on Pro and Enterprise plans.';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
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
