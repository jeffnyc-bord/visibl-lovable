import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

interface SubscriptionLimits {
  maxChatbots: number;
  maxPrompts: number;
  maxArticles: number;
  trackingFrequency: 'twice_weekly' | 'daily';
}

interface SubscriptionContextType {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  chatbotsTracked: number;
  promptsUsed: number;
  articlesUsed: number;
  canAddChatbot: boolean;
  canAddPrompt: boolean;
  canGenerateArticle: boolean;
  loading: boolean;
  swapsUsed: number;
  swapsRemaining: number;
  canSwap: boolean;
  refreshSubscription: () => Promise<void>;
  // Dev mode overrides
  devOverrides: {
    articlesUsed?: number;
    promptsUsed?: number;
    chatbotsTracked?: number;
  };
  setDevOverrides: (overrides: SubscriptionContextType['devOverrides']) => void;
}

const TIER_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  starter: { maxChatbots: 2, maxPrompts: 10, maxArticles: 5, trackingFrequency: 'twice_weekly' },
  pro: { maxChatbots: 10, maxPrompts: 50, maxArticles: 25, trackingFrequency: 'daily' },
  enterprise: { maxChatbots: 999999, maxPrompts: 999999, maxArticles: 999999, trackingFrequency: 'daily' },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('starter');
  const [chatbotsTracked, setChatbotsTracked] = useState(0);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [articlesUsed, setArticlesUsed] = useState(0);
  const [swapsUsed, setSwapsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [devOverrides, setDevOverrides] = useState<SubscriptionContextType['devOverrides']>({});

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile with subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, chatbots_tracked, prompts_used, articles_used, swaps_used')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setTier((profile?.subscription_tier as SubscriptionTier) || 'starter');
      setChatbotsTracked(profile?.chatbots_tracked || 0);
      setPromptsUsed(profile?.prompts_used || 0);
      setArticlesUsed(profile?.articles_used || 0);
      setSwapsUsed(profile?.swaps_used || 0);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const limits = TIER_LIMITS[tier];
  
  // Apply dev overrides if set
  const effectiveChatbotsTracked = devOverrides.chatbotsTracked ?? chatbotsTracked;
  const effectivePromptsUsed = devOverrides.promptsUsed ?? promptsUsed;
  const effectiveArticlesUsed = devOverrides.articlesUsed ?? articlesUsed;
  
  const canAddChatbot = effectiveChatbotsTracked < limits.maxChatbots;
  const canAddPrompt = effectivePromptsUsed < limits.maxPrompts;
  const canGenerateArticle = effectiveArticlesUsed < limits.maxArticles;
  const swapsRemaining = Math.max(0, 3 - swapsUsed);
  const canSwap = swapsUsed < 3;

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        limits,
        chatbotsTracked: effectiveChatbotsTracked,
        promptsUsed: effectivePromptsUsed,
        articlesUsed: effectiveArticlesUsed,
        canAddChatbot,
        canAddPrompt,
        canGenerateArticle,
        loading,
        swapsUsed,
        swapsRemaining,
        canSwap,
        refreshSubscription: fetchSubscription,
        devOverrides,
        setDevOverrides,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
