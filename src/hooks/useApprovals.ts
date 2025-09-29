// @ts-nocheck
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PendingApproval {
  id: string;
  user_id: string;
  type: string;
  payload: any;
  status: string;
  created_at: string;
}

interface UseApprovalsReturn {
  loading: boolean;
  error: string | null;
  listPending: () => Promise<PendingApproval[]>;
  approve: (approvalId: string, notes?: string, grantRole?: string) => Promise<boolean>;
  reject: (approvalId: string, reason?: string) => Promise<boolean>;
}

/**
 * Hook for managing the approval workflow for organization signups
 * 
 * Features:
 * - List pending approvals (super_admin only)
 * - Approve pending organizations with role assignment
 * - Reject pending organizations with reason
 * - All actions use secure stored procedures with audit trails
 * - RLS ensures only super_admins can access approval data
 */
export function useApprovals(): UseApprovalsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * List all pending organization signup approvals
   * Returns empty array if user doesn't have super_admin permissions
   */
  const listPending = useCallback(async (): Promise<PendingApproval[]> => {
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('pending_approvals')
        .select('id, user_id, payload, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        setError(error.message);
        return [];
      }
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    }
  }, []);

  /**
   * Approve a pending organization signup
   * Grants the specified role (default: hub_manager) to the user
   * Uses secure RPC that enforces super_admin permissions
   */
  const approve = useCallback(async (
    approvalId: string, 
    notes?: string, 
    grantRole: string = 'hub_manager'
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.rpc('approve_pending_org', {
        p_approval_id: approvalId,
        p_notes: notes || null,
        p_grant_role: grantRole
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

  /**
   * Reject a pending organization signup
   * Uses secure RPC that enforces super_admin permissions
   */
  const reject = useCallback(async (
    approvalId: string, 
    reason?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.rpc('reject_pending_org', {
        p_approval_id: approvalId,
        p_reason: reason || null
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
    listPending,
    approve,
    reject
  };
}
