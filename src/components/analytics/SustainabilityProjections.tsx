import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface SustainabilityProjectionsProps {
  currentBalance?: number;
  monthlyBurnRate?: number;
  monthlyRevenue?: number;
  projectionMonths?: number;
  currency?: string;
  currencySymbol?: string;
  warnings?: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    threshold: number;
    currentValue: number;
    recommendation: string;
  }>;
}

export const SustainabilityProjections = ({ 
  currentBalance = 0,
  monthlyBurnRate = 0,
  monthlyRevenue = 0,
  projectionMonths = 12,
  currency = 'USD',
  currencySymbol = '$',
  warnings = []
}: SustainabilityProjectionsProps) => {
  
  // Generate projection data
  const generateProjectionData = () => {
    const data = [];
    let runningBalance = currentBalance;
    const netMonthlyChange = monthlyRevenue - monthlyBurnRate;
    
    for (let i = 0; i <= projectionMonths; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        projectedBalance: runningBalance,
        criticalThreshold: 0,
        warningThreshold: monthlyBurnRate * 3, // 3 months runway
      });
      
      runningBalance += netMonthlyChange;
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  
  // Calculate runway
  const calculateRunway = () => {
    if (monthlyBurnRate <= 0 || currentBalance <= 0) return null;
    if (monthlyRevenue >= monthlyBurnRate) return 'Sustainable';
    return Math.floor(currentBalance / (monthlyBurnRate - monthlyRevenue));
  };

  const runway = calculateRunway();
  
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertCircle;
      case 'low': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Runway and Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cash Runway</p>
                <p className={`text-2xl font-bold ${
                  typeof runway === 'number' && runway < 6 ? 'text-red-600' :
                  typeof runway === 'number' && runway < 12 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {runway === null ? '0 months' : 
                   runway === 'Sustainable' ? '∞' : `${runway} months`}
                </p>
              </div>
              <Clock className={`h-8 w-8 ${
                typeof runway === 'number' && runway < 6 ? 'text-red-600' :
                typeof runway === 'number' && runway < 12 ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Burn</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(monthlyBurnRate)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Warnings</p>
                <p className={`text-2xl font-bold ${
                  warnings.length === 0 ? 'text-green-600' :
                  warnings.some(w => w.severity === 'high') ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {warnings.length}
                </p>
              </div>
              {warnings.length === 0 ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className={`h-8 w-8 ${
                  warnings.some(w => w.severity === 'high') ? 'text-red-600' : 'text-yellow-600'
                }`} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projection Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Sustainability Forecast</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            12-month projection based on current burn rate and revenue
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
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
                
                {/* Reference lines for thresholds */}
                <ReferenceLine 
                  y={0} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  label={{ value: "Critical Level", position: "right" }}
                />
                <ReferenceLine 
                  y={monthlyBurnRate * 3} 
                  stroke="hsl(var(--warning))" 
                  strokeDasharray="5 5"
                  label={{ value: "Warning Level", position: "right" }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="projectedBalance" 
                  name="Projected Balance"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {currentBalance === 0 && monthlyBurnRate === 0 && (
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                📈 Dotted projection line will forecast your runway based on current burn rate vs revenue
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threshold Warnings */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Alerts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Threshold-based warnings and recommendations
          </p>
        </CardHeader>
        <CardContent>
          {warnings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-green-600 mb-2">All Clear!</h3>
              <p className="text-sm text-muted-foreground">
                No sustainability warnings at this time. Your business is on a healthy financial track.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {warnings.map((warning) => {
                const SeverityIcon = getSeverityIcon(warning.severity);
                return (
                  <Alert key={warning.id}>
                    <SeverityIcon className="h-4 w-4" />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <AlertDescription className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{warning.message}</span>
                            <Badge variant={getSeverityColor(warning.severity)}>
                              {warning.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {warning.recommendation}
                          </p>
                        </AlertDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    </div>
                  </Alert>
                );
              })}
            </div>
          )}
          
          {warnings.length === 0 && currentBalance === 0 && (
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ⚠️ Alerts will appear here when burn rate exceeds revenue growth or other thresholds are crossed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};