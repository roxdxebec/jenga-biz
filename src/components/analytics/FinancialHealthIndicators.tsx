import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Calendar, Target } from 'lucide-react';
import { FinancialHealthMetrics } from '@/hooks/useFinancialInsights';

interface FinancialHealthIndicatorsProps {
  metrics: FinancialHealthMetrics;
  currency?: string;
  currencySymbol?: string;
}

export const FinancialHealthIndicators = ({ 
  metrics, 
  currency = 'USD', 
  currencySymbol = '$' 
}: FinancialHealthIndicatorsProps) => {
  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatNumber = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Financial Health Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Health Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`text-2xl font-bold ${getHealthColor(metrics.healthScore)}`}>
              {Math.round(metrics.healthScore)}
            </div>
            <div className="text-sm text-muted-foreground">/100</div>
          </div>
          <Progress value={metrics.healthScore} className="mb-2" />
          <Badge variant={getRiskBadgeVariant(metrics.riskLevel)} className="text-xs">
            {metrics.riskLevel.toUpperCase()} RISK
          </Badge>
        </CardContent>
      </Card>

      {/* Profit Margin */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.profitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.profitMargin >= 20 ? 'Excellent' : 
             metrics.profitMargin >= 10 ? 'Good' :
             metrics.profitMargin >= 0 ? 'Fair' : 'Needs attention'}
          </p>
        </CardContent>
      </Card>

      {/* Cashflow Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cashflow Trend</CardTitle>
          {getTrendIcon(metrics.cashflowTrend)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize mb-1">
            {metrics.cashflowTrend}
          </div>
          <div className="text-sm text-muted-foreground">
            Revenue: {metrics.revenueGrowthRate >= 0 ? '+' : ''}{metrics.revenueGrowthRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Expenses: {metrics.expenseGrowthRate >= 0 ? '+' : ''}{metrics.expenseGrowthRate.toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      {/* Monthly Burn Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Burn Rate</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencySymbol}{formatNumber(metrics.burnRate)}
          </div>
          <p className="text-xs text-muted-foreground">
            Average monthly expenses
          </p>
        </CardContent>
      </Card>

      {/* Sustainability Runway */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Runway</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            metrics.sustainabilityDays > 90 ? 'text-green-600' :
            metrics.sustainabilityDays > 30 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {Math.round(metrics.sustainabilityDays)}
          </div>
          <p className="text-xs text-muted-foreground">
            days at current burn rate
          </p>
          {metrics.sustainabilityDays < 60 && (
            <div className="flex items-center mt-2 text-yellow-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="text-xs">Attention needed</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Comparison */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue Growth</span>
              <span className={`text-sm font-medium ${metrics.revenueGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.revenueGrowthRate >= 0 ? '+' : ''}{metrics.revenueGrowthRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expense Growth</span>
              <span className={`text-sm font-medium ${metrics.expenseGrowthRate <= metrics.revenueGrowthRate ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.expenseGrowthRate >= 0 ? '+' : ''}{metrics.expenseGrowthRate.toFixed(1)}%
              </span>
            </div>
            {metrics.expenseGrowthRate > metrics.revenueGrowthRate && (
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="text-xs">Expenses growing faster</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};