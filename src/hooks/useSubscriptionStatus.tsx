import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';

export interface SubscriptionStatus {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: Record<string, any>;
  } | null;
  status: 'active' | 'inactive' | 'expired' | 'loading';
  currentPeriodEnd: string | null;
  isLoading: boolean;
}

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    plan: null,
    status: 'loading',
    currentPeriodEnd: null,
    isLoading: true,
  });

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setSubscription({
          plan: null,
          status: 'inactive',
          currentPeriodEnd: null,
          isLoading: false,
        });
        return;
      }

      setSubscription(prev => ({ ...prev, isLoading: true }));
      
      try {
        const sub = await apiClient.getMySubscription();
        if (sub && sub.status === 'active') {
          setSubscription({
            plan: sub.plan,
            status: 'active',
            currentPeriodEnd: sub.current_period_end,
            isLoading: false,
          });
        } else {
          setSubscription({
            plan: null,
            status: 'inactive',
            currentPeriodEnd: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to load subscription status:', error);
        setSubscription({
          plan: null,
          status: 'inactive',
          currentPeriodEnd: null,
          isLoading: false,
        });
      }
    };

    load();
  }, [user?.id]);

  // Helper functions for feature gating
  const hasActiveSubscription = subscription.status === 'active';
  const isPremium = subscription.plan?.name?.toLowerCase() === 'premium';
  const isPro = subscription.plan?.name?.toLowerCase() === 'pro';
  const isFree = !hasActiveSubscription || subscription.plan?.name?.toLowerCase() === 'free';

  // TEMPORARY: Allow all features regardless of subscription
  // TODO: Implement proper subscription gating when ready
  const canAccessFeature = (feature: string) => {
    // Keep all subscription logic in place but always return true
    // This allows us to easily restore the gating later
    const hasAccess = true;
    
    // Log the feature check for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Subscription] Feature '${feature}' access:`, {
        hasAccess,
        subscriptionStatus: subscription.status,
        plan: subscription.plan?.name || 'none'
      });
    }
    
    return hasAccess;
  };

  return {
    ...subscription,
    hasActiveSubscription,
    isPremium,
    isPro,
    isFree,
    canAccessFeature,
  };
}
