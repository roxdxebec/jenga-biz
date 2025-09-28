import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAppSettingsReturn {
  loading: boolean;
  error: string | null;
  getAutoApprove: () => Promise<boolean>;
  setAutoApprove: (value: boolean) => Promise<boolean>;
}

/**
 * Hook for managing application settings via secure RPC calls
 * 
 * Features:
 * - Get auto-approval setting for organization signups
 * - Set auto-approval setting (super_admin only)
 * - Loading states and error handling
 * - All mutations use secure stored procedures with audit trails
 */
export function useAppSettings(): UseAppSettingsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get the auto-approve organizations setting
   * Returns false by default if setting doesn't exist
   */
  const getAutoApprove = useCallback(async (): Promise<boolean> => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'auto_approve_organizations')
        .maybeSingle();
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      // Parse string/boolean values
      return data ? (data.value === 'true' || data.value === true) : false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Set the auto-approve organizations setting
   * Uses secure RPC that enforces super_admin permissions and creates audit trail
   */
  const setAutoApprove = useCallback(async (value: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.rpc('set_app_setting', {
        p_key: 'auto_approve_organizations',
        p_value: value ? 'true' : 'false',
        p_reason: 'Toggle from admin UI'
      });
      
      setLoading(false);
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    getAutoApprove,
    setAutoApprove
  };
}