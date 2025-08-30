import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, Download, Filter, Calendar, Users, Building2, TrendingUp } from 'lucide-react';
import { CustomReportBuilder } from './CustomReportBuilder';
import { FilteredReportsView } from './FilteredReportsView';
import { AutomatedDonorReports } from './AutomatedDonorReports';
import { ReportExporter } from './ReportExporter';

interface ReportingDashboardProps {
  className?: string;
}

export function ReportingDashboard({ className }: ReportingDashboardProps) {
  const [selectedReportType, setSelectedReportType] = useState<string>('custom');

  const quickReportOptions = [
    {
      id: 'business-overview',
      title: 'Business Overview',
      description: 'Comprehensive business metrics and KPIs',
      icon: Building2,
      metrics: ['Total Businesses', 'Active Businesses', 'Revenue Trends', 'Geographic Distribution']
    },
    {
      id: 'impact-summary',
      title: 'Impact Summary',
      description: 'Job creation, survival rates, and finance access',
      icon: TrendingUp,
      metrics: ['Jobs Created', 'Business Survival Rate', 'Finance Access Success', 'Loan Readiness']
    },
    {
      id: 'user-engagement',
      title: 'User Engagement',
      description: 'User activity and platform engagement metrics',
      icon: Users,
      metrics: ['Active Users', 'Session Duration', 'Feature Usage', 'User Journey']
    },
    {
      id: 'financial-health',
      title: 'Financial Health',
      description: 'Revenue, expenses, and financial sustainability',
      icon: FileText,
      metrics: ['Revenue Trends', 'Expense Analysis', 'Profit Margins', 'Cash Flow']
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports and export data for stakeholders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter Data
          </Button>
        </div>
      </div>

      {/* Quick Report Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickReportOptions.map((option) => (
          <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <option.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{option.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {option.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {option.metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    • {metric}
                  </div>
                ))}
                {option.metrics.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{option.metrics.length - 3} more metrics
                  </div>
                )}
              </div>
              <Button size="sm" className="w-full mt-4">
                <Download className="h-3 w-3 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reporting Interface */}
      <Tabs value={selectedReportType} onValueChange={setSelectedReportType} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto gap-1">
          <TabsTrigger value="custom" className="text-xs sm:text-sm">
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="filtered" className="text-xs sm:text-sm">
            Filtered Views
          </TabsTrigger>
          <TabsTrigger value="donor" className="text-xs sm:text-sm">
            Donor Reports
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm">
            Export Center
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom" className="mt-6">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="filtered" className="mt-6">
          <FilteredReportsView />
        </TabsContent>

        <TabsContent value="donor" className="mt-6">
          <AutomatedDonorReports />
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ReportExporter />
        </TabsContent>
      </Tabs>
    </div>
  );
}