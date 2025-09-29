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

  // During development, allow all features for entrepreneurs regardless of subscription
  const canAccessFeature = (feature: string) => {
    // Development rule: all entrepreneur features accessible regardless of subscription
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // Production logic would check subscription tier features
    if (!hasActiveSubscription) return false;
    
    // For now, all active subscriptions get all features
    // Later this can be enhanced with feature-specific checks
    return true;
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
