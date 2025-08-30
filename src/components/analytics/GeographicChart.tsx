import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Users, Building2 } from 'lucide-react';

interface GeographicData {
  country_code: string;
  country_name: string;
  user_count: number;
  active_businesses: number;
  total_revenue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const GeographicChart = () => {
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeographicData();
  }, []);

  const fetchGeographicData = async () => {
    try {
      const { data, error } = await supabase
        .from('geographic_analytics')
        .select('*')
        .order('user_count', { ascending: false });

      if (error) throw error;
      setGeoData(data || []);
    } catch (error) {
      console.error('Error fetching geographic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = geoData.map(item => ({
    name: item.country_name,
    users: item.user_count,
    businesses: item.active_businesses,
    revenue: item.total_revenue
  }));

  const pieData = geoData.slice(0, 6).map(item => ({
    name: item.country_name,
    value: item.user_count
  }));

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              User Distribution by Country
            </CardTitle>
            <CardDescription>
              Geographic breakdown of registered users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User vs Business Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Users vs Active Businesses
            </CardTitle>
            <CardDescription>
              Comparison of user base and business activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Users" />
                <Bar dataKey="businesses" fill="#82ca9d" name="Active Businesses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Geographic Analytics Details
          </CardTitle>
          <CardDescription>
            Detailed breakdown by country including user count, businesses, and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Active Businesses</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geoData.map((country) => (
                <TableRow key={country.country_code}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {country.country_code}
                      </Badge>
                      {country.country_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{country.user_count}</TableCell>
                  <TableCell className="text-right">{country.active_businesses}</TableCell>
                  <TableCell className="text-right">
                    ${country.total_revenue?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      country.user_count > 0 
                        ? (country.active_businesses / country.user_count) > 0.5 
                          ? "default" 
                          : "secondary"
                        : "outline"
                    }>
                      {country.user_count > 0 
                        ? `${((country.active_businesses / country.user_count) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};