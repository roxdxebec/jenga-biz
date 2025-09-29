import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HubAnalytics {
  hub_id: string | null;
  total_businesses: number;
  active_businesses: number;
  total_revenue: number;
  total_users: number;
}

export function useHubAnalytics() {
  return useQuery({
    queryKey: ['hub-analytics'],
    queryFn: async (): Promise<HubAnalytics> => {
      const { data, error } = await supabase.rpc('get_hub_analytics');
      
      if (error) {
        throw error;
      }
      
      return data as HubAnalytics;
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 2
  });
}