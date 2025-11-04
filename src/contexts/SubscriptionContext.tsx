import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface SubscriptionLimits {
  maxProducts: number;
  maxBrands: number;
  trackingFrequency: 'twice_weekly' | 'daily';
}

interface SubscriptionContextType {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  productsTracked: number;
  canAddProduct: boolean;
  canAddBrand: boolean;
  brandsTracked: number;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const TIER_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: { maxProducts: 10, maxBrands: 1, trackingFrequency: 'twice_weekly' },
  pro: { maxProducts: 25, maxBrands: 5, trackingFrequency: 'daily' },
  enterprise: { maxProducts: 999999, maxBrands: 999999, trackingFrequency: 'daily' },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [productsTracked, setProductsTracked] = useState(0);
  const [brandsTracked, setBrandsTracked] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile with subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, products_tracked')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setTier(profile?.subscription_tier || 'free');
      setProductsTracked(profile?.products_tracked || 0);
      
      // Count user's brands
      const { count: brandCount } = await supabase
        .from('brands')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setBrandsTracked(brandCount || 0);
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
  const canAddProduct = productsTracked < limits.maxProducts;
  const canAddBrand = brandsTracked < limits.maxBrands;

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        limits,
        productsTracked,
        brandsTracked,
        canAddProduct,
        canAddBrand,
        loading,
        refreshSubscription: fetchSubscription,
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
