import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Activity, TrendingUp, Calendar } from 'lucide-react';

interface ActivityData {
  date: string;
  logins: number;
  page_views: number;
  actions: number;
}

type TimeRange = '7d' | '30d' | '90d';

export const ActivityChart = () => {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  useEffect(() => {
    fetchActivityData();
  }, [timeRange]);

  const fetchActivityData = async () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const buildEmptySeries = () => {
      const base: { [key: string]: ActivityData } = {};
      for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        const ds = d.toISOString().split('T')[0];
        base[ds] = { date: ds, logins: 0, page_views: 0, actions: 0 };
      }
      return Object.values(base);
    };

    try {
      setLoading(true);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching activity data:', (error as any)?.message || error);
        setActivityData(buildEmptySeries());
        return;
      }

      const processed: { [key: string]: ActivityData } = {};
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split('T')[0];
        processed[dateStr] = { date: dateStr, logins: 0, page_views: 0, actions: 0 };
      }

      data?.forEach((activity: any) => {
        const date = String(activity.created_at).split('T')[0];
        if (processed[date]) {
          switch (activity.activity_type) {
            case 'login':
              processed[date].logins++;
              break;
            case 'page_view':
              processed[date].page_views++;
              break;
            case 'action_taken':
              processed[date].actions++;
              break;
          }
        }
      });

      setActivityData(Object.values(processed));
    } catch (error) {
      console.error('Error fetching activity data:', (error as any)?.message || error);
      setActivityData(buildEmptySeries());
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalLogins = activityData.reduce((sum, day) => sum + day.logins, 0);
  const totalPageViews = activityData.reduce((sum, day) => sum + day.page_views, 0);
  const totalActions = activityData.reduce((sum, day) => sum + day.actions, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogins}</div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPageViews}</div>
            <p className="text-xs text-muted-foreground">
              Total page interactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Actions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActions}</div>
            <p className="text-xs text-muted-foreground">
              Strategy builds, saves, etc.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                User Activity Trends
              </CardTitle>
              <CardDescription>
                Daily breakdown of user engagement over time
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value, name) => [value, name === 'logins' ? 'Logins' : name === 'page_views' ? 'Page Views' : 'Actions']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="logins"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="Logins"
              />
              <Area
                type="monotone"
                dataKey="page_views"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="actions"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
                name="Actions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
