// Admin Dashboard Types

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  subscriptionTier: 'starter' | 'pro' | 'enterprise';
  usage: {
    promptsUsed: number;
    promptsLimit: number;
    brandsActive: number;
    brandsLimit: number;
    contentPublished: number;
    chatbotsTracked: number;
    chatbotsLimit: number;
  };
  enterprise?: {
    slackWebhook?: string;
    dedicatedSupport?: boolean;
    priorityQueue?: boolean;
  };
  createdAt: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  logo: string;
  status: 'healthy' | 'degraded' | 'down';
  avgResponseTime: number;
  successRate: number;
  lastCheck: string;
  promptsFired: number;
  errorCount: number;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  tier: 'starter' | 'pro' | 'enterprise';
  mrr: number;
  status: 'active' | 'churning' | 'cancelled' | 'trial';
  renewalDate: string;
  startDate: string;
  churnRisk: 'low' | 'medium' | 'high';
}

export interface BrandVerification {
  id: string;
  brandName: string;
  clientName: string;
  clientTier: 'enterprise' | 'pro';
  signalType: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  aiReadinessScore?: number;
  scoreChange?: number;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  sentTo: 'all' | 'enterprise' | 'pro';
}

export interface ActionLogEntry {
  id: string;
  action: string;
  user: string;
  target?: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export type AdminSection = 
  | 'users' 
  | 'subscriptions' 
  | 'llm-health' 
  | 'actions-log' 
  | 'support' 
  | 'enterprise';
