import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface RevenueExpenseChartProps {
  data?: Array<{
    period: string;
    revenue: number;
    expenses: number;
    balance: number;
  }>;
  currency?: string;
  currencySymbol?: string;
}

export const RevenueExpenseChart = ({ 
  data = [], 
  currency = 'USD',
  currencySymbol = '$'
}: RevenueExpenseChartProps) => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Generate placeholder data when no real data exists
  const chartData = data.length > 0 ? data : [
    { period: 'Week 1', revenue: 0, expenses: 0, balance: 0 },
    { period: 'Week 2', revenue: 0, expenses: 0, balance: 0 },
    { period: 'Week 3', revenue: 0, expenses: 0, balance: 0 },
    { period: 'Week 4', revenue: 0, expenses: 0, balance: 0 },
    { period: 'Week 5', revenue: 0, expenses: 0, balance: 0 },
    { period: 'Week 6', revenue: 0, expenses: 0, balance: 0 },
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
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
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Revenue vs Expenses</CardTitle>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Stacked bar chart with running balance overlay
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                name="Revenue" 
                fill="hsl(var(--primary))" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="hsl(var(--destructive))" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                name="Running Balance"
                stroke="hsl(var(--accent-foreground))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent-foreground))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--accent-foreground))', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {data.length === 0 && (
          <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              📊 This chart will show your revenue vs expenses with a running balance line once you add financial data
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};