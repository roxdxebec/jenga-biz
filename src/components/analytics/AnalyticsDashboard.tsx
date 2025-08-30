import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, Globe, TrendingUp, Activity, Calendar } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { GeographicChart } from './GeographicChart';
import { ActivityChart } from './ActivityChart';
import { EngagementMetrics } from './EngagementMetrics';
import { BusinessIntelligenceDashboard } from './BusinessIntelligenceDashboard';

interface DashboardMetrics {
  totalUsers: number;
  activeBusinesses: number;
  totalCountries: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyRegistrations: number;
}

export const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch key metrics
      const [
        { count: totalUsers },
        { count: activeBusinesses },
        { count: totalCountries },
        { data: dailyActive },
        { data: weeklyActive },
        { data: monthlyRegs }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('geographic_analytics').select('*', { count: 'exact', head: true }),
        supabase.from('analytics_summaries')
          .select('metric_value')
          .eq('metric_type', 'daily_active_users')
          .eq('metric_date', new Date().toISOString().split('T')[0])
          .maybeSingle(),
        supabase.from('analytics_summaries')
          .select('metric_value')
          .eq('metric_type', 'weekly_active_users')
          .gte('metric_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .maybeSingle(),
        supabase.from('analytics_summaries')
          .select('metric_value')
          .eq('metric_type', 'monthly_registrations')
          .eq('metric_date', new Date().toISOString().slice(0, 7) + '-01')
          .maybeSingle()
      ]);

      setMetrics({
        totalUsers: totalUsers || 0,
        activeBusinesses: activeBusinesses || 0,
        totalCountries: totalCountries || 0,
        dailyActiveUsers: dailyActive?.metric_value || 0,
        weeklyActiveUsers: weeklyActive?.metric_value || 0,
        monthlyRegistrations: monthlyRegs?.metric_value || 0
      });
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform performance and user engagement</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <MetricsCard
              title="Total Users"
              value={metrics?.totalUsers || 0}
              icon={Users}
              description="Registered platform users"
            />
            <MetricsCard
              title="Active Businesses"
              value={metrics?.activeBusinesses || 0}
              icon={Building2}
              description="Businesses currently active"
            />
            <MetricsCard
              title="Countries"
              value={metrics?.totalCountries || 0}
              icon={Globe}
              description="Geographic reach"
            />
            <MetricsCard
              title="Daily Active Users"
              value={metrics?.dailyActiveUsers || 0}
              icon={Activity}
              description="Users active today"
            />
            <MetricsCard
              title="Weekly Active Users"
              value={metrics?.weeklyActiveUsers || 0}
              icon={TrendingUp}
              description="Users active this week"
            />
            <MetricsCard
              title="Monthly Registrations"
              value={metrics?.monthlyRegistrations || 0}
              icon={Calendar}
              description="New users this month"
            />
          </>
        )}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="business-intelligence" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business-intelligence">Business Intelligence</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Analytics</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business-intelligence" className="space-y-4">
          <BusinessIntelligenceDashboard />
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-4">
          <GeographicChart />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <ActivityChart />
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <EngagementMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};