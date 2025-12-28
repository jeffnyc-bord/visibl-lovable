import { AdminUser, LLMProvider, Subscription, BrandVerification, ActionLogEntry, SystemAlert } from './types';

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@enterprise.com',
    role: 'user',
    status: 'active',
    lastActive: '2 min ago',
    subscriptionTier: 'enterprise',
    usage: {
      promptsUsed: 245,
      promptsLimit: 500,
      brandsActive: 8,
      brandsLimit: 15,
      contentPublished: 34,
      chatbotsTracked: 6,
      chatbotsLimit: 8
    },
    enterprise: {
      slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXX',
      dedicatedSupport: true,
      priorityQueue: true
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@startup.io',
    role: 'user',
    status: 'active',
    lastActive: '1 hour ago',
    subscriptionTier: 'pro',
    usage: {
      promptsUsed: 89,
      promptsLimit: 150,
      brandsActive: 3,
      brandsLimit: 5,
      contentPublished: 12,
      chatbotsTracked: 4,
      chatbotsLimit: 5
    },
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@agency.co',
    role: 'moderator',
    status: 'active',
    lastActive: '15 min ago',
    subscriptionTier: 'pro',
    usage: {
      promptsUsed: 142,
      promptsLimit: 150,
      brandsActive: 5,
      brandsLimit: 5,
      contentPublished: 28,
      chatbotsTracked: 5,
      chatbotsLimit: 5
    },
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@retail.com',
    role: 'user',
    status: 'active',
    lastActive: '3 days ago',
    subscriptionTier: 'starter',
    usage: {
      promptsUsed: 18,
      promptsLimit: 25,
      brandsActive: 1,
      brandsLimit: 1,
      contentPublished: 4,
      chatbotsTracked: 2,
      chatbotsLimit: 3
    },
    createdAt: '2024-03-01'
  },
  {
    id: '5',
    name: 'Jessica Williams',
    email: 'jessica@fortune500.com',
    role: 'user',
    status: 'active',
    lastActive: '5 min ago',
    subscriptionTier: 'enterprise',
    usage: {
      promptsUsed: 412,
      promptsLimit: 500,
      brandsActive: 12,
      brandsLimit: 15,
      contentPublished: 67,
      chatbotsTracked: 8,
      chatbotsLimit: 8
    },
    enterprise: {
      slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/YYYY',
      dedicatedSupport: true,
      priorityQueue: true
    },
    createdAt: '2023-11-10'
  },
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex@newuser.com',
    role: 'user',
    status: 'pending',
    lastActive: 'Never',
    subscriptionTier: 'starter',
    usage: {
      promptsUsed: 0,
      promptsLimit: 25,
      brandsActive: 0,
      brandsLimit: 1,
      contentPublished: 0,
      chatbotsTracked: 0,
      chatbotsLimit: 3
    },
    createdAt: '2024-03-28'
  }
];

export const mockLLMProviders: LLMProvider[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '/lovable-uploads/chatGPT_logo.png',
    status: 'healthy',
    avgResponseTime: 142,
    successRate: 99.8,
    lastCheck: '30 sec ago',
    promptsFired: 12847,
    errorCount: 3
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logo: '/lovable-uploads/gemini_logo.png',
    status: 'healthy',
    avgResponseTime: 156,
    successRate: 99.5,
    lastCheck: '30 sec ago',
    promptsFired: 8934,
    errorCount: 8
  },
  {
    id: 'claude',
    name: 'Claude',
    logo: '/lovable-uploads/claude_logo.png',
    status: 'degraded',
    avgResponseTime: 289,
    successRate: 97.2,
    lastCheck: '30 sec ago',
    promptsFired: 5621,
    errorCount: 24
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    logo: '/lovable-uploads/perplexity_logo.png',
    status: 'healthy',
    avgResponseTime: 178,
    successRate: 99.1,
    lastCheck: '30 sec ago',
    promptsFired: 4532,
    errorCount: 6
  },
  {
    id: 'grok',
    name: 'Grok',
    logo: '/lovable-uploads/grok_logo_new.png',
    status: 'down',
    avgResponseTime: 0,
    successRate: 0,
    lastCheck: '30 sec ago',
    promptsFired: 1245,
    errorCount: 156
  }
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 's1',
    userId: '1',
    userName: 'Sarah Chen',
    tier: 'enterprise',
    mrr: 499,
    status: 'active',
    renewalDate: '2024-04-15',
    startDate: '2024-01-15',
    churnRisk: 'low'
  },
  {
    id: 's2',
    userId: '2',
    userName: 'Marcus Johnson',
    tier: 'pro',
    mrr: 99,
    status: 'active',
    renewalDate: '2024-04-20',
    startDate: '2024-02-20',
    churnRisk: 'medium'
  },
  {
    id: 's3',
    userId: '3',
    userName: 'Elena Rodriguez',
    tier: 'pro',
    mrr: 99,
    status: 'churning',
    renewalDate: '2024-04-08',
    startDate: '2024-01-08',
    churnRisk: 'high'
  },
  {
    id: 's4',
    userId: '5',
    userName: 'Jessica Williams',
    tier: 'enterprise',
    mrr: 499,
    status: 'active',
    renewalDate: '2024-04-10',
    startDate: '2023-11-10',
    churnRisk: 'low'
  },
  {
    id: 's5',
    userId: '6',
    userName: 'Alex Thompson',
    tier: 'starter',
    mrr: 0,
    status: 'trial',
    renewalDate: '2024-04-28',
    startDate: '2024-03-28',
    churnRisk: 'medium'
  }
];

export const mockBrandVerifications: BrandVerification[] = [
  {
    id: 'bv1',
    brandName: 'TechCorp AI',
    clientName: 'Sarah Chen',
    clientTier: 'enterprise',
    signalType: 'Featured Snippet Capture',
    submittedAt: '2024-03-28T10:30:00Z',
    status: 'pending',
    aiReadinessScore: 87,
    scoreChange: 5
  },
  {
    id: 'bv2',
    brandName: 'Fortune500 Brand',
    clientName: 'Jessica Williams',
    clientTier: 'enterprise',
    signalType: 'AI Citation Growth',
    submittedAt: '2024-03-28T09:15:00Z',
    status: 'pending',
    aiReadinessScore: 72,
    scoreChange: -12
  },
  {
    id: 'bv3',
    brandName: 'StartupIO',
    clientName: 'Marcus Johnson',
    clientTier: 'pro',
    signalType: 'Competitive Displacement',
    submittedAt: '2024-03-27T16:45:00Z',
    status: 'verified'
  }
];

export const mockActionLog: ActionLogEntry[] = [
  {
    id: 'a1',
    action: 'User impersonation started',
    user: 'admin@visibl.io',
    target: 'sarah.chen@enterprise.com',
    timestamp: '2 min ago',
    type: 'info'
  },
  {
    id: 'a2',
    action: 'Usage limit extended',
    user: 'admin@visibl.io',
    target: 'marcus@startup.io (+25 prompts)',
    timestamp: '15 min ago',
    type: 'success'
  },
  {
    id: 'a3',
    action: 'Brand verification approved',
    user: 'admin@visibl.io',
    target: 'StartupIO',
    timestamp: '1 hour ago',
    type: 'success'
  },
  {
    id: 'a4',
    action: 'System alert sent',
    user: 'System',
    target: 'Claude API latency warning',
    timestamp: '2 hours ago',
    type: 'warning'
  },
  {
    id: 'a5',
    action: 'Failed API health check',
    user: 'System',
    target: 'Grok API',
    timestamp: '3 hours ago',
    type: 'error'
  },
  {
    id: 'a6',
    action: 'New enterprise signup',
    user: 'System',
    target: 'jessica@fortune500.com',
    timestamp: '5 hours ago',
    type: 'success'
  }
];

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 'sa1',
    title: 'Claude API Experiencing Latency',
    message: 'Response times are elevated. We are monitoring the situation.',
    severity: 'warning',
    createdAt: '2024-03-28T08:00:00Z',
    sentTo: 'all'
  },
  {
    id: 'sa2',
    title: 'Grok API Temporarily Unavailable',
    message: 'Grok integration is currently down. Expected resolution: 2 hours.',
    severity: 'critical',
    createdAt: '2024-03-28T07:00:00Z',
    sentTo: 'all'
  }
];

// Revenue stats
export const mockRevenueStats = {
  mrr: 14567,
  mrrChange: 12.4,
  activeSubscriptions: 156,
  churnRate: 2.1,
  trialConversions: 34,
  avgRevPerUser: 93.4
};
