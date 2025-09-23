import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStrategy } from '@/hooks/useStrategy';

export const UserDashboardCheck: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { strategies, currentStrategy, setCurrentStrategy, loading: strategiesLoading } = useStrategy();

  // Ensure currentStrategy is explicitly managed
  useEffect(() => {
    console.log('[useStrategy] strategies:', strategies);
    console.log('[useStrategy] currentStrategy before check:', currentStrategy);

    if (strategies.length === 0) return;
    if (currentStrategy === undefined) {
      console.log('[useStrategy] setting currentStrategy to null');
      setCurrentStrategy(null);
    }
  }, [strategies, currentStrategy, setCurrentStrategy]);

  if (authLoading || strategiesLoading) {
    console.log('[DashboardCheck] loading...', { authLoading, strategiesLoading });
    return <div>Loading dashboard...</div>;
  }

  console.log('[DashboardCheck] render check', { currentStrategy, strategiesCount: strategies.length });

  return (
    <div>
      <h1>User Dashboard Loaded!</h1>
      <p>User: {user?.email || 'No user'}</p>
      <p>Current Strategy: {currentStrategy?.id || 'None selected'}</p>
      <p>Total Strategies: {strategies.length}</p>
    </div>
  );
};