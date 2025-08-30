import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { CashflowData } from '@/hooks/useFinancialInsights';
import { useState } from 'react';

interface CashflowMonitorProps {
  cashflowData: CashflowData[];
  currency?: string;
  currencySymbol?: string;
}

export const CashflowMonitor = ({ 
  cashflowData, 
  currency = 'USD', 
  currencySymbol = '$' 
}: CashflowMonitorProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'composed'>('composed');
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'all'>('30');

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(1)}K`;
    }
    return `${currencySymbol}${value.toFixed(0)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter data based on time range
  const filteredData = cashflowData.slice(0, timeRange === 'all' ? undefined : parseInt(timeRange));

  // Calculate summary metrics
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.expenses, 0);
  const netCashflow = totalRevenue - totalExpenses;
  const currentRunway = filteredData.length > 0 ? filteredData[filteredData.length - 1].cumulativeCashflow : 0;

  // Calculate trend
  const recentData = filteredData.slice(-7);
  const olderData = filteredData.slice(-14, -7);
  const recentAvg = recentData.length > 0 ? recentData.reduce((sum, item) => sum + item.netCashflow, 0) / recentData.length : 0;
  const olderAvg = olderData.length > 0 ? olderData.reduce((sum, item) => sum + item.netCashflow, 0) / olderData.length : 0;
  const trendDirection = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';

  const chartData = filteredData.map(item => ({
    ...item,
    date: formatDate(item.date),
    revenueFormatted: formatCurrency(item.revenue),
    expensesFormatted: formatCurrency(item.expenses),
    netCashflowFormatted: formatCurrency(item.netCashflow),
    cumulativeCashflowFormatted: formatCurrency(item.cumulativeCashflow)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === 'all' ? 'all' : timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === 'all' ? 'all' : timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netCashflow)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {trendDirection === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
              {trendDirection === 'down' && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
              Trend: {trendDirection}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentRunway >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(currentRunway)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cumulative cashflow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Cashflow Analysis</CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="composed">Combined</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeCashflow" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    name="Cumulative"
                  />
                </LineChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--chart-1))" 
                    name="Revenue"
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="hsl(var(--chart-2))" 
                    name="Expenses"
                  />
                </BarChart>
              ) : (
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--chart-1))" 
                    name="Revenue"
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="hsl(var(--chart-2))" 
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeCashflow" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={3}
                    name="Cumulative"
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};