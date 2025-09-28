import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ApprovalStatus {
  hasPendingApproval: boolean;
  isOrganization: boolean;
  loading: boolean;
}

/**
 * Hook to check if the current user has pending organization approvals
 * or is an organization that may have restricted access.
 */
export function useApprovalStatus(): ApprovalStatus {
  const { user } = useAuth();
  const [status, setStatus] = useState<ApprovalStatus>({
    hasPendingApproval: false,
    isOrganization: false,
    loading: true,
  });

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) {
        setStatus({
          hasPendingApproval: false,
          isOrganization: false,
          loading: false,
        });
        return;
      }

      try {
        // Check if user has organization account type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setStatus(prev => ({ ...prev, loading: false }));
          return;
        }

        const isOrganization = profile?.account_type === 'organization';

        if (isOrganization) {
          // Check if there are pending approvals for this user
          const { data: pendingApprovals, error: approvalsError } = await supabase
            .from('pending_approvals')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .limit(1);

          if (approvalsError) {
            console.error('Error checking pending approvals:', approvalsError);
          }

          const hasPendingApproval = (pendingApprovals || []).length > 0;

          setStatus({
            hasPendingApproval,
            isOrganization,
            loading: false,
          });
        } else {
          setStatus({
            hasPendingApproval: false,
            isOrganization: false,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
        setStatus({
          hasPendingApproval: false,
          isOrganization: false,
          loading: false,
        });
      }
    };

    checkApprovalStatus();
  }, [user?.id]);

  return status;
}