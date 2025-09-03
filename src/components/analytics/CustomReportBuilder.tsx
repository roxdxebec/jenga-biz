import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Download, Eye, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, subMonths, subYears } from 'date-fns';

interface MetricOption {
  id: string;
  category: string;
  name: string;
  description: string;
  dataType: 'number' | 'percentage' | 'currency' | 'text';
}

interface ReportConfig {
  name: string;
  description: string;
  metrics: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
  groupBy: string;
  filters: Record<string, any>;
}

export function CustomReportBuilder() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    metrics: [],
    dateRange: {
      from: subMonths(new Date(), 3),
      to: new Date(),
    },
    groupBy: 'monthly',
    filters: {},
  });

  const [showDatePicker, setShowDatePicker] = useState<'from' | 'to' | null>(null);

  const metricOptions: MetricOption[] = [
    // Business Metrics
    { id: 'total_businesses', category: 'Business', name: 'Total Businesses', description: 'Count of all registered businesses', dataType: 'number' },
    { id: 'active_businesses', category: 'Business', name: 'Active Businesses', description: 'Count of currently active businesses', dataType: 'number' },
    { id: 'business_survival_rate', category: 'Business', name: 'Business Survival Rate', description: 'Percentage of businesses still active', dataType: 'percentage' },
    { id: 'new_registrations', category: 'Business', name: 'New Registrations', description: 'Number of new business registrations', dataType: 'number' },

    // Financial Metrics
    { id: 'total_revenue', category: 'Financial', name: 'Total Revenue', description: 'Combined revenue across all businesses', dataType: 'currency' },
    { id: 'average_revenue', category: 'Financial', name: 'Average Revenue', description: 'Average revenue per business', dataType: 'currency' },
    { id: 'total_expenses', category: 'Financial', name: 'Total Expenses', description: 'Combined expenses across all businesses', dataType: 'currency' },
    { id: 'profit_margins', category: 'Financial', name: 'Profit Margins', description: 'Average profit margin percentage', dataType: 'percentage' },

    // Impact Metrics
    { id: 'jobs_created', category: 'Impact', name: 'Jobs Created', description: 'Total number of jobs created', dataType: 'number' },
    { id: 'loans_approved', category: 'Impact', name: 'Loans Approved', description: 'Number of approved loan applications', dataType: 'number' },
    { id: 'loan_approval_rate', category: 'Impact', name: 'Loan Approval Rate', description: 'Percentage of approved loans', dataType: 'percentage' },
    { id: 'finance_access_success', category: 'Impact', name: 'Finance Access Success', description: 'Success rate for accessing finance', dataType: 'percentage' },

    // User Engagement
    { id: 'active_users', category: 'Engagement', name: 'Active Users', description: 'Number of active platform users', dataType: 'number' },
    { id: 'session_duration', category: 'Engagement', name: 'Avg Session Duration', description: 'Average time spent on platform', dataType: 'number' },
    { id: 'page_views', category: 'Engagement', name: 'Page Views', description: 'Total page views', dataType: 'number' },
    { id: 'feature_usage', category: 'Engagement', name: 'Feature Usage', description: 'Most used platform features', dataType: 'text' },
  ];

  const timeRangeOptions = [
    { label: 'Last 7 days', value: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
    { label: 'Last 30 days', value: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: 'Last 3 months', value: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
    { label: 'Last 6 months', value: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
    { label: 'Last year', value: () => ({ from: subYears(new Date(), 1), to: new Date() }) },
  ];

  const groupByOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const categorizedMetrics = metricOptions.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, MetricOption[]>);

  const handleMetricToggle = (metricId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const handleTimeRangeSelect = (option: any) => {
    setReportConfig(prev => ({
      ...prev,
      dateRange: option.value()
    }));
  };

  const generateReport = () => {
    // This would typically call an API to generate the report
    console.log('Generating report with config:', reportConfig);
    alert(`Report "${reportConfig.name}" generation started! Check your downloads folder.`);
  };

  const previewReport = () => {
    // This would show a preview of the report
    console.log('Previewing report with config:', reportConfig);
    alert(`Preview for "${reportConfig.name}" will open in a new window.`);
  };

  const saveTemplate = () => {
    // This would save the current configuration as a template
    console.log('Saving template:', reportConfig);
    alert(`Template "${reportConfig.name}" saved successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Define your custom report by selecting metrics, time range, and filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter report name..."
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Input
                id="report-description"
                placeholder="Brief description of the report..."
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Time Range Selection */}
          <div className="space-y-4">
            <Label>Time Range</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {timeRangeOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeRangeSelect(option)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover open={showDatePicker === 'from'} onOpenChange={(open) => setShowDatePicker(open ? 'from' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(reportConfig.dateRange.from, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={reportConfig.dateRange.from}
                      onSelect={(date) => {
                        if (date) {
                          setReportConfig(prev => ({ ...prev, dateRange: { ...prev.dateRange, from: date } }));
                          setShowDatePicker(null);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover open={showDatePicker === 'to'} onOpenChange={(open) => setShowDatePicker(open ? 'to' : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(reportConfig.dateRange.to, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={reportConfig.dateRange.to}
                      onSelect={(date) => {
                        if (date) {
                          setReportConfig(prev => ({ ...prev, dateRange: { ...prev.dateRange, to: date } }));
                          setShowDatePicker(null);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Group By</Label>
                <Select value={reportConfig.groupBy} onValueChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groupByOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Metrics</CardTitle>
              <CardDescription>
                Choose the metrics you want to include in your report
              </CardDescription>
            </div>
            <Badge variant="outline">
              {reportConfig.metrics.length} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(categorizedMetrics).map(([category, metrics]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-foreground">{category} Metrics</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const categoryMetricIds = metrics.map(m => m.id);
                      const allSelected = categoryMetricIds.every(id => reportConfig.metrics.includes(id));
                      
                      if (allSelected) {
                        // Deselect all in this category
                        setReportConfig(prev => ({
                          ...prev,
                          metrics: prev.metrics.filter(id => !categoryMetricIds.includes(id))
                        }));
                      } else {
                        // Select all in this category
                        setReportConfig(prev => ({
                          ...prev,
                          metrics: [...prev.metrics, ...categoryMetricIds.filter(id => !prev.metrics.includes(id))]
                        }));
                      }
                    }}
                  >
                    {metrics.every(m => reportConfig.metrics.includes(m.id)) ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <Checkbox
                        id={metric.id}
                        checked={reportConfig.metrics.includes(metric.id)}
                        onCheckedChange={() => handleMetricToggle(metric.id)}
                      />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                          {metric.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {metric.description}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {metric.dataType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {category !== Object.keys(categorizedMetrics)[Object.keys(categorizedMetrics).length - 1] && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" onClick={saveTemplate}>
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
        <Button variant="outline" onClick={previewReport}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Report
        </Button>
        <Button 
          onClick={generateReport}
          disabled={!reportConfig.name || reportConfig.metrics.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  );
}