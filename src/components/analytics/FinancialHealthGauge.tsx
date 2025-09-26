import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface FinancialHealthGaugeProps {
  healthScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  profitMargin?: number;
  burnRate?: number;
  growthRate?: number;
}

export const FinancialHealthGauge = ({ 
  healthScore = 0,
  riskLevel = 'medium',
  profitMargin = 0,
  burnRate = 0,
  growthRate = 0
}: FinancialHealthGaugeProps) => {
  
  // Gauge data for radial chart
  const gaugeData = [
    {
      name: 'Health Score',
      value: healthScore,
      fill: healthScore >= 70 ? 'hsl(var(--success))' : 
            healthScore >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'
    }
  ];

  const getHealthStatus = () => {
    if (healthScore >= 70) return { status: 'Healthy', color: 'success', icon: CheckCircle };
    if (healthScore >= 40) return { status: 'Neutral', color: 'warning', icon: AlertCircle };
    return { status: 'At Risk', color: 'destructive', icon: AlertTriangle };
  };

  const getRiskBadgeVariant = () => {
    switch (riskLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getIndicatorColor = (value: number, isReversed = false) => {
    if (value === 0) return 'hsl(var(--muted-foreground))';
    if (isReversed) {
      return value > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--success))';
    }
    return value > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  };

  const getTrendIcon = (value: number, isReversed = false) => {
    if (value === 0) return Minus;
    if (isReversed) {
      return value > 0 ? TrendingDown : TrendingUp;
    }
    return value > 0 ? TrendingUp : TrendingDown;
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Health Gauge */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            <CardTitle>Financial Health Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-48 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="100%"
                  innerRadius="60%"
                  outerRadius="90%"
                  startAngle={180}
                  endAngle={0}
                  data={gaugeData}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={gaugeData[0].fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <div className="text-3xl font-bold">
                {Math.round(healthScore)}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 text-${healthStatus.color}`} />
              <span className={`font-medium text-${healthStatus.color}`}>
                {healthStatus.status}
              </span>
              <Badge variant={getRiskBadgeVariant()}>
                {riskLevel} risk
              </Badge>
            </div>
          </div>
          
          {healthScore === 0 && (
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🎯 Health score will be calculated based on your financial metrics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traffic Light Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Health Indicators</CardTitle>
          <p className="text-sm text-muted-foreground">
            Key financial metrics at a glance
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Profit Margin Indicator */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getIndicatorColor(profitMargin) }}
                />
                <span className="font-medium">Profit Margin</span>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const TrendIcon = getTrendIcon(profitMargin);
                  return <TrendIcon className="h-4 w-4" style={{ color: getIndicatorColor(profitMargin) }} />;
                })()}
                <span className="font-semibold">
                  {profitMargin === 0 ? '0%' : `${profitMargin.toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Burn Rate Indicator */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getIndicatorColor(burnRate, true) }}
                />
                <span className="font-medium">Burn Rate</span>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const TrendIcon = getTrendIcon(burnRate, true);
                  return <TrendIcon className="h-4 w-4" style={{ color: getIndicatorColor(burnRate, true) }} />;
                })()}
                <span className="font-semibold">
                  {burnRate === 0 ? '$0/mo' : `$${Math.abs(burnRate).toFixed(0)}/mo`}
                </span>
              </div>
            </div>

            {/* Growth Rate Indicator */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getIndicatorColor(growthRate) }}
                />
                <span className="font-medium">Growth Rate</span>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const TrendIcon = getTrendIcon(growthRate);
                  return <TrendIcon className="h-4 w-4" style={{ color: getIndicatorColor(growthRate) }} />;
                })()}
                <span className="font-semibold">
                  {growthRate === 0 ? '0%' : `${growthRate.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          {(profitMargin === 0 && burnRate === 0 && growthRate === 0) && (
            <div className="text-center mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🚦 Traffic light indicators will show red/yellow/green based on your metrics
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
