import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template_config: {
    vision: string;
    mission: string;
    targetMarket: string;
    revenueModel: string;
    valueProposition: string;
    keyPartners: string;
    marketingApproach: string;
    operationalNeeds: string;
    growthGoals: string;
  };
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export function useBusinessTemplates() {
  const [templates, setTemplates] = useState<BusinessTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch templates from the API
        const response = await apiClient.listTemplates();
        setTemplates(response);
      } catch (err) {
        console.error('Failed to load business templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, loading, error };
}
