import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Users, Target, Zap } from 'lucide-react';

interface EngagementData {
  avgSessionDuration: number;
  returnUserRate: number;
  featureAdoption: { [key: string]: number };
  userRetention: { day1: number; day7: number; day30: number };
  topUsers: Array<{
    user_id: string;
    activity_count: number;
    last_active: string;
  }>;
}

export const EngagementMetrics = () => {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);

      // Get user activity data for engagement calculations
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('user_id, activity_type, activity_data, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (activitiesError) throw activitiesError;

      // Calculate engagement metrics
      const userSessions: { [userId: string]: Date[] } = {};
      const featureUsage: { [feature: string]: number } = {};
      const userLastActive: { [userId: string]: Date } = {};

      activities?.forEach(activity => {
        const userId = activity.user_id;
        const activityDate = new Date(activity.created_at);

        // Track user sessions
        if (!userSessions[userId]) userSessions[userId] = [];
        userSessions[userId].push(activityDate);

        // Track feature usage
        if (activity.activity_type === 'action_taken' && activity.activity_data && typeof activity.activity_data === 'object' && 'action' in activity.activity_data) {
          const feature = (activity.activity_data as any).action;
          featureUsage[feature] = (featureUsage[feature] || 0) + 1;
        }

        // Track last active
        if (!userLastActive[userId] || activityDate > userLastActive[userId]) {
          userLastActive[userId] = activityDate;
        }
      });

      // Calculate average session duration (simplified)
      let totalSessionMinutes = 0;
      let sessionCount = 0;
      Object.values(userSessions).forEach(sessions => {
        if (sessions.length > 1) {
          sessions.sort((a, b) => a.getTime() - b.getTime());
          for (let i = 1; i < sessions.length; i++) {
            const duration = (sessions[i].getTime() - sessions[i-1].getTime()) / (1000 * 60);
            if (duration < 180) { // Only count sessions under 3 hours as valid
              totalSessionMinutes += duration;
              sessionCount++;
            }
          }
        }
      });

      const avgSessionDuration = sessionCount > 0 ? totalSessionMinutes / sessionCount : 0;

      // Calculate return user rate (users active in last 7 days vs total users)
      const activeUsers = Object.keys(userLastActive).filter(userId => 
        userLastActive[userId] >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      // totalUsers will be computed hub-aware below; skip direct totalUsers query here.

      // Calculate user retention (simplified)
      const now = new Date();
      const day1Cutoff = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const day7Cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const day30Cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const day1Retention = Object.values(userLastActive).filter(date => date >= day1Cutoff).length;
      const day7Retention = Object.values(userLastActive).filter(date => date >= day7Cutoff).length;
      const day30Retention = Object.values(userLastActive).filter(date => date >= day30Cutoff).length;

      // Get top active users
      const userActivityCounts = Object.entries(userSessions).map(([userId, sessions]) => ({
        user_id: userId,
        activity_count: sessions.length,
        last_active: userLastActive[userId]?.toISOString() || ''
      })).sort((a, b) => b.activity_count - a.activity_count).slice(0, 10);

      // Try to get total users respecting hub filter
      let totalUsersCount = 0;
      try {
        const { getCurrentHubIdFromStorage } = await import('@/lib/tenant');
        const hubId = getCurrentHubIdFromStorage();
        let res;
        try {
          const q = supabase.from('profiles').select('*', { count: 'exact', head: true });
          if (hubId) q.eq('hub_id', hubId);
          res = await q;
          if (res.error) throw res.error;
        } catch (e: any) {
          const msg = String(e?.message || e?.error || '');
          if (msg.includes('column') && msg.includes('does not exist')) {
            const res2 = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            totalUsersCount = res2.count || 0;
          } else {
            throw e;
          }
        }
        totalUsersCount = res.count || 0;
      } catch (e) {
        console.warn('Failed to fetch total users with hub filter, defaulting to 0', e);
      }

      const returnUserRate = totalUsersCount ? (activeUsers / totalUsersCount) * 100 : 0;

      setEngagementData({
        avgSessionDuration,
        returnUserRate,
        featureAdoption: featureUsage,
        userRetention: {
          day1: day1Retention,
          day7: day7Retention,
          day30: day30Retention
        },
        topUsers: userActivityCounts
      });
    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!engagementData) return null;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    return `${Math.round(minutes / 60)}h ${Math.round(minutes % 60)}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(engagementData.avgSessionDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average time per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return User Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementData.returnUserRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Users active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">7-Day Retention</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementData.userRetention.day7}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">30-Day Retention</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementData.userRetention.day30}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Feature Adoption */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption</CardTitle>
            <CardDescription>
              Most used features and actions by users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(engagementData.featureAdoption)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([feature, count]) => (
                <div key={feature} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {feature.replace(/_/g, ' ')}
                    </span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                  <Progress 
                    value={(count / Math.max(...Object.values(engagementData.featureAdoption))) * 100} 
                    className="h-2"
                  />
                </div>
              ))
            }
          </CardContent>
        </Card>

        {/* Top Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
            <CardDescription>
              Users with highest activity in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead className="text-right">Activities</TableHead>
                  <TableHead className="text-right">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagementData.topUsers.slice(0, 5).map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="font-mono text-xs">
                          {user.user_id.slice(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {user.activity_count}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {user.last_active ? 
                        new Date(user.last_active).toLocaleDateString() : 
                        'N/A'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
