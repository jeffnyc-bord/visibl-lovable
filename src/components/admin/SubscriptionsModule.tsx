import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Users,
  RefreshCw,
  Plus,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription } from './types';

interface SubscriptionsModuleProps {
  subscriptions: Subscription[];
  revenueStats: {
    mrr: number;
    mrrChange: number;
    activeSubscriptions: number;
    churnRate: number;
    trialConversions: number;
    avgRevPerUser: number;
  };
}

export function SubscriptionsModule({ subscriptions, revenueStats }: SubscriptionsModuleProps) {
  const [showPlanConfigurator, setShowPlanConfigurator] = useState(false);

  const tierColors = {
    starter: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 35%)' },
    pro: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' },
    enterprise: { bg: 'hsl(270 80% 95%)', text: 'hsl(270 70% 45%)' }
  };

  const statusColors = {
    active: { bg: 'hsl(142 71% 95%)', text: 'hsl(142 71% 35%)' },
    churning: { bg: 'hsl(0 72% 95%)', text: 'hsl(0 72% 45%)' },
    cancelled: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 50%)' },
    trial: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' }
  };

  const churnRiskColors = {
    low: 'hsl(142 71% 45%)',
    medium: 'hsl(45 93% 47%)',
    high: 'hsl(0 72% 51%)'
  };

  const churningSubscriptions = subscriptions.filter(s => s.status === 'churning' || s.churnRisk === 'high');

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
            Revenue & Subscriptions
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            Subscription lifecycle management
          </p>
        </div>
        <Button 
          className="gap-2 h-9 text-[13px]"
          style={{ 
            background: 'hsl(0 0% 10%)', 
            color: 'white',
            fontWeight: 500
          }}
          onClick={() => setShowPlanConfigurator(true)}
        >
          <Settings2 className="w-4 h-4" />
          Plan Configurator
        </Button>
      </div>

      {/* Revenue Stats */}
      <div 
        className="px-6 py-5 grid grid-cols-4 gap-6"
        style={{ borderBottom: '0.5px solid hsl(0 0% 94%)' }}
      >
        <div>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
            Monthly Recurring Revenue
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p 
              className="text-[26px] tabular-nums"
              style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
            >
              ${revenueStats.mrr.toLocaleString()}
            </p>
            <span 
              className="text-[12px] flex items-center gap-0.5"
              style={{ color: 'hsl(142 71% 45%)' }}
            >
              <TrendingUp className="w-3 h-3" />
              +{revenueStats.mrrChange}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
            Active Subscriptions
          </p>
          <p 
            className="text-[26px] mt-1 tabular-nums"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            {revenueStats.activeSubscriptions}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
            Churn Rate
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p 
              className="text-[26px] tabular-nums"
              style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
            >
              {revenueStats.churnRate}%
            </p>
            <span 
              className="text-[12px]"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              this month
            </span>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'hsl(0 0% 55%)' }}>
            Avg Revenue / User
          </p>
          <p 
            className="text-[26px] mt-1 tabular-nums"
            style={{ fontWeight: 600, color: 'hsl(0 0% 10%)' }}
          >
            ${revenueStats.avgRevPerUser}
          </p>
        </div>
      </div>

      {/* Churn Alerts */}
      {churningSubscriptions.length > 0 && (
        <div 
          className="mx-6 mt-5 p-4 rounded-lg"
          style={{ background: 'hsl(0 72% 97%)', border: '1px solid hsl(0 72% 90%)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(0 72% 51%)' }} />
            <span 
              className="text-[13px]"
              style={{ fontWeight: 600, color: 'hsl(0 72% 40%)' }}
            >
              Churn Alerts
            </span>
            <Badge 
              className="ml-1 text-[10px] px-1.5"
              style={{ background: 'hsl(0 72% 51%)', color: 'white' }}
            >
              {churningSubscriptions.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {churningSubscriptions.slice(0, 3).map(sub => (
              <div 
                key={sub.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ background: 'white' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px]" style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}>
                    {sub.userName}
                  </span>
                  <Badge
                    className="text-[10px] px-2 py-0.5"
                    style={{
                      background: tierColors[sub.tier].bg,
                      color: tierColors[sub.tier].text
                    }}
                  >
                    {sub.tier}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px]" style={{ color: 'hsl(0 0% 55%)' }}>
                    Renewal: {sub.renewalDate}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[11px]"
                    style={{ borderColor: 'hsl(0 72% 80%)', color: 'hsl(0 72% 45%)' }}
                  >
                    Reach Out
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="flex-1 overflow-auto px-6 mt-5">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '0.5px solid hsl(0 0% 92%)' }}>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Customer
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
                MRR
              </th>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Status
              </th>
              <th 
                className="text-left py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Churn Risk
              </th>
              <th 
                className="text-right py-3 text-[11px] uppercase tracking-wide"
                style={{ fontWeight: 600, color: 'hsl(0 0% 50%)' }}
              >
                Renewal
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub, index) => (
              <motion.tr
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="cursor-pointer group hover:bg-muted/30"
                style={{ borderBottom: '0.5px solid hsl(0 0% 94%)' }}
              >
                <td className="py-3">
                  <span 
                    className="text-[13px]"
                    style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                  >
                    {sub.userName}
                  </span>
                </td>
                <td className="py-3">
                  <Badge
                    className="text-[10px] uppercase tracking-wide px-2 py-0.5"
                    style={{
                      background: tierColors[sub.tier].bg,
                      color: tierColors[sub.tier].text,
                      fontWeight: 500
                    }}
                  >
                    {sub.tier}
                  </Badge>
                </td>
                <td className="py-3">
                  <span 
                    className="text-[13px] tabular-nums"
                    style={{ fontWeight: 500, color: 'hsl(0 0% 20%)' }}
                  >
                    ${sub.mrr}
                  </span>
                </td>
                <td className="py-3">
                  <Badge
                    className="text-[10px] capitalize px-2 py-0.5"
                    style={{
                      background: statusColors[sub.status].bg,
                      color: statusColors[sub.status].text,
                      fontWeight: 500
                    }}
                  >
                    {sub.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ background: churnRiskColors[sub.churnRisk] }}
                    />
                    <span 
                      className="text-[12px] capitalize"
                      style={{ color: churnRiskColors[sub.churnRisk] }}
                    >
                      {sub.churnRisk}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span 
                    className="text-[12px] tabular-nums"
                    style={{ color: 'hsl(0 0% 55%)' }}
                  >
                    {sub.renewalDate}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
