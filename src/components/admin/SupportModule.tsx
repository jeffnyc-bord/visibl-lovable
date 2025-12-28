import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  userTier: 'starter' | 'pro' | 'enterprise';
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReply: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 't1',
    subject: 'API integration not returning results',
    user: 'Jessica Williams',
    userTier: 'enterprise',
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-28T08:00:00Z',
    lastReply: '10 min ago'
  },
  {
    id: 't2',
    subject: 'Need help setting up brand tracking',
    user: 'Marcus Johnson',
    userTier: 'pro',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-27T14:30:00Z',
    lastReply: '2 hours ago'
  },
  {
    id: 't3',
    subject: 'Billing inquiry about plan upgrade',
    user: 'David Park',
    userTier: 'starter',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-26T09:15:00Z',
    lastReply: '1 day ago'
  }
];

export function SupportModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const priorityColors = {
    low: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 45%)' },
    medium: { bg: 'hsl(45 93% 95%)', text: 'hsl(45 93% 35%)' },
    high: { bg: 'hsl(0 72% 95%)', text: 'hsl(0 72% 45%)' }
  };

  const statusColors = {
    open: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' },
    pending: { bg: 'hsl(45 93% 95%)', text: 'hsl(45 93% 35%)' },
    resolved: { bg: 'hsl(142 71% 95%)', text: 'hsl(142 71% 35%)' }
  };

  const tierColors = {
    starter: { bg: 'hsl(0 0% 95%)', text: 'hsl(0 0% 35%)' },
    pro: { bg: 'hsl(220 90% 95%)', text: 'hsl(220 80% 45%)' },
    enterprise: { bg: 'hsl(270 80% 95%)', text: 'hsl(270 70% 45%)' }
  };

  const openTickets = mockTickets.filter(t => t.status === 'open').length;

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
            Support Tickets
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'hsl(0 0% 50%)' }}>
            {openTickets} open tickets
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {mockTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-xl border cursor-pointer hover:shadow-sm transition-shadow"
              style={{
                background: 'hsl(0 0% 100%)',
                borderColor: ticket.priority === 'high' ? 'hsl(0 72% 85%)' : 'hsl(0 0% 92%)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className="text-[9px] uppercase px-1.5 py-0.5"
                      style={{
                        background: priorityColors[ticket.priority].bg,
                        color: priorityColors[ticket.priority].text,
                        fontWeight: 600
                      }}
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className="text-[9px] capitalize px-1.5 py-0.5"
                      style={{
                        background: statusColors[ticket.status].bg,
                        color: statusColors[ticket.status].text
                      }}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <p 
                    className="text-[14px] mt-2"
                    style={{ fontWeight: 500, color: 'hsl(0 0% 15%)' }}
                  >
                    {ticket.subject}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" style={{ color: 'hsl(0 0% 55%)' }} />
                      <span className="text-[12px]" style={{ color: 'hsl(0 0% 50%)' }}>
                        {ticket.user}
                      </span>
                    </div>
                    <Badge
                      className="text-[9px] uppercase px-1.5 py-0.5"
                      style={{
                        background: tierColors[ticket.userTier].bg,
                        color: tierColors[ticket.userTier].text
                      }}
                    >
                      {ticket.userTier}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p 
                    className="text-[11px]"
                    style={{ color: 'hsl(0 0% 55%)' }}
                  >
                    Last reply
                  </p>
                  <p 
                    className="text-[12px] mt-0.5"
                    style={{ color: 'hsl(0 0% 35%)', fontWeight: 500 }}
                  >
                    {ticket.lastReply}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
