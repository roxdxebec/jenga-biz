// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Download, 
  Send, 
  Settings, 
  Eye, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  FileText,
  Mail
} from 'lucide-react';

interface DonorReportTemplate {
  id: string;
  name: string;
  description: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  recipients: string[];
  metrics: string[];
  isActive: boolean;
  lastGenerated?: Date;
  nextScheduled?: Date;
}

interface ReportMetric {
  id: string;
  name: string;
  category: string;
  icon: any;
  value: string | number;
  change: number;
  format: 'number' | 'currency' | 'percentage';
}

export function AutomatedDonorReports() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<DonorReportTemplate>>({
    name: '',
    description: '',
    frequency: 'monthly',
    recipients: [],
    metrics: [],
    isActive: true
  });

  const donorTemplates: DonorReportTemplate[] = [
    {
      id: 'impact-overview',
      name: 'Impact Overview Report',
      description: 'Comprehensive overview of program impact including job creation and business outcomes',
      frequency: 'monthly',
      recipients: ['donor1@foundation.org', 'program@foundation.org'],
      metrics: ['jobs_created', 'businesses_supported', 'revenue_generated', 'survival_rate'],
      isActive: true,
      lastGenerated: new Date('2024-01-15'),
      nextScheduled: new Date('2024-02-15')
    },
    {
      id: 'financial-summary',
      name: 'Financial Impact Summary',
      description: 'Financial metrics including loan disbursements, repayment rates, and business revenue',
      frequency: 'quarterly',
      recipients: ['finance@foundation.org', 'board@foundation.org'],
      metrics: ['total_loans', 'repayment_rate', 'total_revenue', 'avg_business_growth'],
      isActive: true,
      lastGenerated: new Date('2024-01-01'),
      nextScheduled: new Date('2024-04-01')
    },
    {
      id: 'demographic-report',
      name: 'Demographic Impact Report',
      description: 'Breakdown of program impact by demographics including gender, age, and location',
      frequency: 'quarterly',
      recipients: ['research@foundation.org'],
      metrics: ['female_entrepreneurs', 'youth_businesses', 'rural_businesses', 'urban_businesses'],
      isActive: false,
      lastGenerated: new Date('2023-12-01'),
      nextScheduled: new Date('2024-03-01')
    }
  ];

  const availableMetrics: ReportMetric[] = [
    {
      id: 'jobs_created',
      name: 'Jobs Created',
      category: 'Impact',
      icon: Users,
      value: 1247,
      change: 12.5,
      format: 'number'
    },
    {
      id: 'businesses_supported',
      name: 'Businesses Supported',
      category: 'Impact',
      icon: Target,
      value: 342,
      change: 8.2,
      format: 'number'
    },
    {
      id: 'revenue_generated',
      name: 'Total Revenue Generated',
      category: 'Financial',
      icon: DollarSign,
      value: 2450000,
      change: 15.3,
      format: 'currency'
    },
    {
      id: 'survival_rate',
      name: 'Business Survival Rate',
      category: 'Impact',
      icon: TrendingUp,
      value: 87.5,
      change: 3.2,
      format: 'percentage'
    },
    {
      id: 'total_loans',
      name: 'Total Loans Disbursed',
      category: 'Financial',
      icon: DollarSign,
      value: 1850000,
      change: 22.1,
      format: 'currency'
    },
    {
      id: 'repayment_rate',
      name: 'Loan Repayment Rate',
      category: 'Financial',
      icon: TrendingUp,
      value: 94.3,
      change: 1.8,
      format: 'percentage'
    }
  ];

  const formatValue = (value: string | number, format: 'number' | 'currency' | 'percentage') => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const generateReport = (templateId: string) => {
    const template = donorTemplates.find(t => t.id === templateId);
    console.log('Generating report for template:', templateId);
    alert(`${template?.name} report generated successfully! Check your downloads folder.`);
    // Implementation would generate and download the report
  };

  const previewReport = (templateId: string) => {
    const template = donorTemplates.find(t => t.id === templateId);
    console.log('Previewing report for template:', templateId);
    alert(`Preview for ${template?.name} will open in a new window.`);
    // Implementation would show report preview
  };

  const scheduleReport = (templateId: string) => {
    const template = donorTemplates.find(t => t.id === templateId);
    console.log('Scheduling report for template:', templateId);
    alert(`${template?.name} has been scheduled for automated generation.`);
    // Implementation would set up automated scheduling
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Automated Donor Reports
          </CardTitle>
          <CardDescription>
            Pre-configured report templates that automatically pull relevant metrics for donors and stakeholders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={() => setShowTemplateEditor(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Create Template
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Manager
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Recipient Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Overview</CardTitle>
          <CardDescription>
            Current performance metrics available for donor reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableMetrics.map((metric) => (
              <div key={metric.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-5 w-5 text-primary" />
                  <Badge variant={metric.change > 0 ? 'default' : 'destructive'} className="text-xs">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{formatValue(metric.value, metric.format)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {donorTemplates.map((template) => (
          <Card key={template.id} className={`${!template.isActive ? 'opacity-75' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={template.isActive} />
                  <Badge variant={template.isActive ? 'default' : 'secondary'}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Frequency</p>
                  <p className="font-medium capitalize">{template.frequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Recipients</p>
                  <p className="font-medium">{template.recipients.length} recipients</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Last Generated</p>
                  <p className="font-medium">
                    {template.lastGenerated?.toLocaleDateString() || 'Never'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Next Scheduled</p>
                  <p className="font-medium">
                    {template.nextScheduled?.toLocaleDateString() || 'Not scheduled'}
                  </p>
                </div>
              </div>

              {/* Metrics Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Included Metrics</p>
                <div className="flex flex-wrap gap-1">
                  {template.metrics.slice(0, 3).map((metricId) => {
                    const metric = availableMetrics.find(m => m.id === metricId);
                    return metric ? (
                      <Badge key={metricId} variant="outline" className="text-xs">
                        {metric.name}
                      </Badge>
                    ) : null;
                  })}
                  {template.metrics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.metrics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress to Next Report */}
              {template.isActive && template.nextScheduled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next report in</span>
                    <span className="font-medium">
                      {Math.ceil((template.nextScheduled.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => generateReport(template.id)}>
                  <Download className="h-3 w-3 mr-2" />
                  Generate Now
                </Button>
                <Button variant="outline" size="sm" onClick={() => previewReport(template.id)}>
                  <Eye className="h-3 w-3 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => scheduleReport(template.id)}>
                  <Clock className="h-3 w-3 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Editor Modal/Panel would go here */}
      {showTemplateEditor && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Create New Report Template</CardTitle>
            <CardDescription>
              Set up a new automated report template for donors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name..."
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newTemplate.frequency} 
                  onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this report will cover..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Creating template:', newTemplate);
                setShowTemplateEditor(false);
              }}>
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}