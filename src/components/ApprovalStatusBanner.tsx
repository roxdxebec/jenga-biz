import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle } from 'lucide-react';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';

interface ApprovalStatusBannerProps {
  className?: string;
}

/**
 * Banner component that shows approval status for organization users.
 * Shows different states: pending approval, approved, rejected, etc.
 */
export function ApprovalStatusBanner({ className = '' }: ApprovalStatusBannerProps) {
  const { hasPendingApproval, isOrganization, loading } = useApprovalStatus();

  // Don't show anything if not an organization or still loading
  if (loading || !isOrganization) {
    return null;
  }

  // If organization user has pending approval
  if (hasPendingApproval) {
    return (
      <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
        <Clock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Approval Pending:</strong> Your ecosystem enabler account is under review. 
          You'll have full access once a super admin approves your request. 
          You can still update your profile and browse available features.
        </AlertDescription>
      </Alert>
    );
  }

  // If organization user is approved (has hub_manager role but no pending approvals)
  return (
    <Alert className={`border-green-200 bg-green-50 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <strong>Account Approved:</strong> Your ecosystem enabler account is active. 
        Welcome to Jenga Biz Africa!
      </AlertDescription>
    </Alert>
  );
}