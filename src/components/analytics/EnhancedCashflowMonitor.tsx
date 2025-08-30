import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useState } from 'react';
import { TrendingUp, Droplets, BarChart3 } from 'lucide-react';

interface CashflowData {
  date: string;
  inflows: number;
  outflows: number;
  netCashflow: number;
  cumulativeCashflow: number;
}

interface EnhancedCashflowMonitorProps {
  data?: CashflowData[];
  currency?: string;
  currencySymbol?: string;
}

export const EnhancedCashflowMonitor = ({ 
  data = [], 
  currency = 'USD',
  currencySymbol = '$'
}: EnhancedCashflowMonitorProps) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [chartView, setChartView] = useState('flows');
  
  // Generate placeholder data when no real data exists
  const chartData: CashflowData[] = data.length > 0 ? data : [
    { date: '2024-08', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
    { date: '2024-09', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
    { date: '2024-10', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
    { date: '2024-11', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
    { date: '2024-12', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
    { date: '2025-01', inflows: 0, outflows: 0, netCashflow: 0, cumulativeCashflow: 0 },
  ];
  
  const formatCurrency = (value: number) => {
    if (value === 0) return `${currencySymbol}0`;
    if (Math.abs(value) >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(1)}K`;
    }
    return `${currencySymbol}${value.toFixed(0)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{formatDate(label)}</p>
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

  // Calculate summary metrics
  const totalInflows = chartData.reduce((sum, item) => sum + item.inflows, 0);
  const totalOutflows = chartData.reduce((sum, item) => sum + item.outflows, 0);
  const netPosition = totalInflows - totalOutflows;
  const currentBuffer = chartData[chartData.length - 1]?.cumulativeCashflow || 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inflows</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalInflows)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outflows</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalOutflows)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Position</p>
                <p className={`text-2xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netPosition)}
                </p>
              </div>
              <BarChart3 className={`h-8 w-8 ${netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Liquidity Buffer</p>
                <p className={`text-2xl font-bold ${currentBuffer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentBuffer)}
                </p>
              </div>
              <Droplets className={`h-8 w-8 ${currentBuffer >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cashflow Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <CardTitle>Cashflow Analysis</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={chartView === 'flows' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartView('flows')}
              >
                Flows
              </Button>
              <Button
                variant={chartView === 'cumulative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartView('cumulative')}
              >
                Buffer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'flows' ? (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="inflows" 
                    name="Inflows"
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outflows" 
                    name="Outflows"
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cumulativeCashflow"
                    name="Cumulative Cashflow"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {data.length === 0 && (
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💧 {chartView === 'flows' 
                  ? 'Line chart showing your money inflows vs outflows over time' 
                  : 'Area chart showing your cumulative liquidity buffer (positive or negative)'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};