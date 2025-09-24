import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStrategy } from '@/hooks/useStrategy';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardContent from '@/components/DashboardContent';

const UserDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { strategies, currentStrategy, loading: strategiesLoading } = useStrategy();

  // Show spinner only while auth or strategies are loading
  if (authLoading || strategiesLoading || user === undefined) {
    return <div>Loading dashboard...</div>;
  }

  // If no user is logged in
  if (user === null) {
    return <div>Please sign in to access your dashboard.</div>;
  }

  // Render the full dashboard
  return (
    <DashboardLayout>
      <DashboardContent
        user={user}
        currentStrategy={currentStrategy}
        strategies={strategies}
      />
    </DashboardLayout>
  );
};

export default UserDashboard;