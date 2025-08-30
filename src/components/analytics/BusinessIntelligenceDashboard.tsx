import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useBusinessIntelligence } from '@/hooks/useBusinessIntelligence';
import { MetricsCard } from './MetricsCard';
import { FinancialInsightsDashboard } from './FinancialInsightsDashboard';

export const BusinessIntelligenceDashboard = () => {
  const {
    stageCompletionRates,
    dropOffPoints,
    templateAnalytics,
    milestoneAnalytics,
    loading,
    error
  } = useBusinessIntelligence();

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Advanced analytics and insights for business strategy optimization</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <MetricsCard
              title="Total Milestones"
              value={milestoneAnalytics?.total_milestones || 0}
              icon={Target}
              description="Business milestones tracked"
            />
            <MetricsCard
              title="Completed Milestones"
              value={milestoneAnalytics?.completed_milestones || 0}
              icon={CheckCircle}
              description="Successfully achieved goals"
            />
            <MetricsCard
              title="Overdue Milestones"
              value={milestoneAnalytics?.overdue_milestones || 0}
              icon={AlertTriangle}
              description="Past due date milestones"
            />
            <MetricsCard
              title="Avg Completion Time"
              value={Math.round(milestoneAnalytics?.avg_completion_time || 0)}
              icon={Clock}
              description="Days to complete milestones"
            />
          </>
        )}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="milestones" className="text-xs sm:text-sm">Milestone Tracking</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs sm:text-sm">Financial Insights</TabsTrigger>
          <TabsTrigger value="stages" className="text-xs sm:text-sm">Stage Completion</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm">Template Analytics</TabsTrigger>
          <TabsTrigger value="dropoffs" className="text-xs sm:text-sm">Drop-off Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="milestones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Milestone Overview</CardTitle>
                <CardDescription>Progress tracking across all business milestones</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {milestoneAnalytics?.total_milestones ? 
                          Math.round((milestoneAnalytics.completed_milestones / milestoneAnalytics.total_milestones) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={milestoneAnalytics?.total_milestones ? 
                        (milestoneAnalytics.completed_milestones / milestoneAnalytics.total_milestones) * 100 : 0} 
                    />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{milestoneAnalytics?.completed_milestones || 0}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">
                          {(milestoneAnalytics?.total_milestones || 0) - (milestoneAnalytics?.completed_milestones || 0) - (milestoneAnalytics?.overdue_milestones || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{milestoneAnalytics?.overdue_milestones || 0}</p>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestones by Business Stage</CardTitle>
                <CardDescription>Breakdown of milestone completion across different business stages</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {milestoneAnalytics?.milestones_by_stage.map((stage, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{stage.business_stage}</Badge>
                          <span className="text-sm">{stage.count} milestones</span>
                        </div>
                        <div className="text-sm font-medium">
                          {Math.round(stage.completion_rate)}% complete
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No milestones data available</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <FinancialInsightsDashboard />
        </TabsContent>
        
        <TabsContent value="stages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stage Completion Rates</CardTitle>
              <CardDescription>How users progress through different strategy building stages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {stageCompletionRates.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stage.stage_name}</span>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{stage.total_starts} starts</span>
                          <span>{stage.total_completions} completions</span>
                          <span className="font-medium">{stage.completion_rate}%</span>
                        </div>
                      </div>
                      <Progress value={stage.completion_rate} />
                      <div className="text-xs text-muted-foreground">
                        Avg completion time: {stage.avg_time_to_complete} minutes
                      </div>
                    </div>
                  ))}
                  {stageCompletionRates.length === 0 && (
                    <p className="text-muted-foreground text-sm">No stage completion data available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Usage Analytics</CardTitle>
              <CardDescription>Performance metrics for different business templates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {templateAnalytics.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{template.template_name}</h4>
                        <Badge variant={template.completion_rate > 50 ? "default" : "secondary"}>
                          {template.completion_rate.toFixed(1)}% completion
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">{template.total_selections}</span> selections
                        </div>
                        <div>
                          <span className="font-medium">{template.total_completions}</span> completions
                        </div>
                        <div>
                          <span className="font-medium">{template.avg_completion_time.toFixed(1)}</span> min avg
                        </div>
                      </div>
                      <Progress value={template.completion_rate} />
                    </div>
                  ))}
                  {templateAnalytics.length === 0 && (
                    <p className="text-muted-foreground text-sm">No template usage data available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dropoffs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Drop-off Analysis</CardTitle>
              <CardDescription>Identify where users are leaving the strategy building process</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {dropOffPoints.map((point, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{point.page_path}</p>
                        <p className="text-sm text-muted-foreground">
                          {point.total_entries} entries • {point.avg_time_on_page}s avg time
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {point.drop_off_rate > 50 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          <span className={`font-medium ${point.drop_off_rate > 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {point.drop_off_rate}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{point.total_exits} exits</p>
                      </div>
                    </div>
                  ))}
                  {dropOffPoints.length === 0 && (
                    <p className="text-muted-foreground text-sm">No drop-off data available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};