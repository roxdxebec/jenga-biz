import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, TrendingUp, DollarSign, Download, RefreshCw } from 'lucide-react';
import { useFinancialInsights } from '@/hooks/useFinancialInsights';
import { FinancialHealthIndicators } from './FinancialHealthIndicators';
import { CashflowMonitor } from './CashflowMonitor';
import { SustainabilityWarnings } from './SustainabilityWarnings';
import { RevenueExpenseChart } from './RevenueExpenseChart';
import { FinancialHealthGauge } from './FinancialHealthGauge';
import { EnhancedCashflowMonitor } from './EnhancedCashflowMonitor';
import { SustainabilityProjections } from './SustainabilityProjections';
import { useToast } from '@/hooks/use-toast';

interface FinancialInsightsDashboardProps {
  businessId?: string;
  currency?: string;
  currencySymbol?: string;
}

export const FinancialInsightsDashboard = ({ 
  businessId,
  currency = 'USD',
  currencySymbol = '$'
}: FinancialInsightsDashboardProps) => {
  const { toast } = useToast();
  const [aggregationPeriod, setAggregationPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [showReportDialog, setShowReportDialog] = useState(false);
  
  const {
    financialRecords,
    financialHealthMetrics,
    cashflowData,
    sustainabilityWarnings,
    loading,
    error,
    fetchFinancialRecords,
    getAggregatedData
  } = useFinancialInsights(businessId);

  const handleRefresh = async () => {
    await fetchFinancialRecords();
    toast({
      title: 'Data Refreshed',
      description: 'Financial data has been updated successfully',
    });
  };

  const handleWarningAction = (warning: any) => {
    toast({
      title: 'Action Required',
      description: `Selected action for: ${warning.message}`,
    });
  };

  const generateFinancialReport = () => {
    const aggregatedData = getAggregatedData(aggregationPeriod);
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: aggregationPeriod,
      healthMetrics: financialHealthMetrics,
      aggregatedData,
      warnings: sustainabilityWarnings,
      totalRecords: financialRecords.length
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Report Downloaded',
      description: 'Financial insights report has been generated and downloaded',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading financial insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading financial data: {error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for new visualizations even when no financial records
  const transformedRevenueExpenseData = financialRecords.length > 0 
    ? getAggregatedData(aggregationPeriod).map(item => ({
        period: item.period,
        revenue: item.revenue,
        expenses: item.expenses,
        balance: item.revenue - item.expenses
      }))
    : [];

  const transformedCashflowData = cashflowData.map(item => ({
    date: item.date,
    inflows: item.revenue,
    outflows: item.expenses,
    netCashflow: item.netCashflow,
    cumulativeCashflow: item.cumulativeCashflow
  }));

  // Calculate current balance and monthly metrics
  const currentBalance = cashflowData.length > 0 
    ? cashflowData[cashflowData.length - 1].cumulativeCashflow 
    : 0;
  
  const recentData = cashflowData.slice(-3);
  const avgMonthlyRevenue = recentData.length > 0 
    ? recentData.reduce((sum, item) => sum + item.revenue, 0) / recentData.length 
    : 0;
  const avgMonthlyExpenses = recentData.length > 0 
    ? recentData.reduce((sum, item) => sum + item.expenses, 0) / recentData.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Insights Dashboard
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive analysis of your financial health and cashflow trends
              </p>
            </div>
            <div className="flex gap-2">
              <Select 
                value={aggregationPeriod} 
                onValueChange={(value: any) => setAggregationPeriod(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Financial Report</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate a comprehensive financial report including health metrics, 
                      aggregated data, and sustainability warnings.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={generateFinancialReport} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download JSON Report
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowReportDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue/Expenses</TabsTrigger>
          <TabsTrigger value="health" className="text-xs sm:text-sm">Health Gauge</TabsTrigger>
          <TabsTrigger value="cashflow" className="text-xs sm:text-sm">Cashflow Monitor</TabsTrigger>
          <TabsTrigger value="projections" className="text-xs sm:text-sm">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  financialHealthMetrics.healthScore >= 70 ? 'text-green-600' :
                  financialHealthMetrics.healthScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(financialHealthMetrics.healthScore)}/100
                </div>
                <p className="text-xs text-muted-foreground">
                  {financialHealthMetrics.riskLevel} risk level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  financialHealthMetrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {financialHealthMetrics.profitMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue vs expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  sustainabilityWarnings.length === 0 ? 'text-green-600' :
                  sustainabilityWarnings.some(w => w.severity === 'high') ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {sustainabilityWarnings.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sustainabilityWarnings.length === 0 ? 'All clear' : 'Needs attention'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Notice */}
          {financialRecords.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Financial Insights Demo Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  All visualizations are ready with placeholder data. Start adding financial records to see real insights.
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check for Data
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Warnings */}
          {sustainabilityWarnings.length > 0 && (
            <SustainabilityWarnings 
              warnings={sustainabilityWarnings.slice(0, 2)} 
              onActionClick={handleWarningAction}
            />
          )}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <RevenueExpenseChart 
              data={transformedRevenueExpenseData}
              currency={currency}
              currencySymbol={currencySymbol}
            />
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <FinancialHealthGauge 
            healthScore={financialHealthMetrics.healthScore}
            riskLevel={financialHealthMetrics.riskLevel as 'low' | 'medium' | 'high'}
            profitMargin={financialHealthMetrics.profitMargin}
            burnRate={financialHealthMetrics.burnRate}
            growthRate={financialHealthMetrics.revenueGrowthRate}
          />
          
          {/* Legacy Health Indicators */}
          <FinancialHealthIndicators 
            metrics={financialHealthMetrics}
            currency={currency}
            currencySymbol={currencySymbol}
          />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <EnhancedCashflowMonitor 
            data={transformedCashflowData}
            currency={currency}
            currencySymbol={currencySymbol}
          />
          
          {/* Legacy Cashflow Monitor */}
          <CashflowMonitor 
            cashflowData={cashflowData}
            currency={currency}
            currencySymbol={currencySymbol}
          />
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <SustainabilityProjections 
            currentBalance={currentBalance}
            monthlyBurnRate={avgMonthlyExpenses}
            monthlyRevenue={avgMonthlyRevenue}
            projectionMonths={12}
            currency={currency}
            currencySymbol={currencySymbol}
            warnings={sustainabilityWarnings.map((warning, index) => ({
              id: `warning-${index}`,
              type: warning.type,
              severity: warning.severity,
              message: warning.message,
              threshold: 0,
              currentValue: 0,
              recommendation: warning.recommendation
            }))}
          />
          
          {/* Legacy Warnings */}
          <SustainabilityWarnings 
            warnings={sustainabilityWarnings}
            onActionClick={handleWarningAction}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};