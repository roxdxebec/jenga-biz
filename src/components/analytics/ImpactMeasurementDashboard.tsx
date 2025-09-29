import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useImpactMeasurement } from '@/hooks/useImpactMeasurement';
import { JobCreationTracker } from './JobCreationTracker';
import { BusinessSurvivalTracker } from './BusinessSurvivalTracker';
import { LoanReadinessScorer } from './LoanReadinessScorer';
import { FinanceAccessMetrics } from './FinanceAccessMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  BarChart3, 
  Target,
  AlertTriangle
} from 'lucide-react';

export const ImpactMeasurementDashboard = () => {
  const { impactMetrics, loading, error } = useImpactMeasurement();

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Error loading impact data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Created</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{impactMetrics.totalJobsCreated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg {impactMetrics.averageJobsPerBusiness.toFixed(1)} per business
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Survival Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{impactMetrics.businessSurvivalRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Avg {impactMetrics.averageSurvivalMonths.toFixed(1)} months operating
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finance Access Success</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{impactMetrics.financeAccessSuccess.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  ${impactMetrics.totalFundingSecured.toLocaleString()} secured
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{impactMetrics.jobRetentionRate.toFixed(1)}%</div>
                <Badge 
                  variant={impactMetrics.jobRetentionRate >= 80 ? "default" : 
                           impactMetrics.jobRetentionRate >= 60 ? "secondary" : "destructive"}
                  className="mt-1"
                >
                  {impactMetrics.jobRetentionRate >= 80 ? 'Excellent' :
                   impactMetrics.jobRetentionRate >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Loan Readiness Distribution */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Loan Readiness Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(impactMetrics.loanReadinessDistribution).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {level.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tracking Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 p-1">
          <TabsTrigger value="jobs" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 py-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Job Creation</span>
            <span className="sm:hidden">Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="survival" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 py-2">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Survival Rates</span>
            <span className="sm:hidden">Survival</span>
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 py-2">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Loan Readiness</span>
            <span className="sm:hidden">Loans</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 py-2">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Finance Access</span>
            <span className="sm:hidden">Finance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <JobCreationTracker />
        </TabsContent>

        <TabsContent value="survival" className="space-y-4">
          <BusinessSurvivalTracker />
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <LoanReadinessScorer />
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <FinanceAccessMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
};