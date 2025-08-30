import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image, 
  Settings, 
  Eye, 
  Upload,
  Palette,
  Layout,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ReportBrandingConfig } from './ReportBrandingConfig';
import { ExportProgressTracker } from './ExportProgressTracker';

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv';
  template: string;
  includeCharts: boolean;
  includeLogo: boolean;
  customBranding: boolean;
  pageOrientation: 'portrait' | 'landscape';
  includeRawData: boolean;
  dateRange: {
    from: Date;
    to: Date;
  };
}

interface ExportJob {
  id: string;
  name: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  downloadUrl?: string;
  error?: string;
}

export function ReportExporter() {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    template: 'standard',
    includeCharts: true,
    includeLogo: true,
    customBranding: false,
    pageOrientation: 'portrait',
    includeRawData: false,
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date()
    }
  });

  const [showBrandingConfig, setShowBrandingConfig] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Impact Report - January 2024',
      format: 'PDF',
      status: 'completed',
      progress: 100,
      createdAt: new Date('2024-01-15'),
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Financial Data Export',
      format: 'Excel',
      status: 'processing',
      progress: 75,
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      name: 'Business Directory',
      format: 'CSV',
      status: 'failed',
      progress: 0,
      createdAt: new Date('2024-01-16'),
      error: 'Data validation failed'
    }
  ]);

  const templateOptions = [
    { value: 'standard', label: 'Standard Report', description: 'Clean, professional layout' },
    { value: 'executive', label: 'Executive Summary', description: 'High-level overview format' },
    { value: 'detailed', label: 'Detailed Analysis', description: 'Comprehensive with charts and tables' },
    { value: 'donor', label: 'Donor Report', description: 'Impact-focused for stakeholders' },
    { value: 'minimal', label: 'Minimal Layout', description: 'Simple, data-focused design' }
  ];

  const startExport = () => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      name: `Export - ${new Date().toLocaleDateString()}`,
      format: exportConfig.format.toUpperCase(),
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simulate export process
    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'processing', progress: 25 }
            : job
        )
      );
    }, 1000);

    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress: 50 }
            : job
        )
      );
    }, 2000);

    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress: 75 }
            : job
        )
      );
    }, 3000);

    setTimeout(() => {
      setExportJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'completed', progress: 100, downloadUrl: '#' }
            : job
        )
      );
    }, 4000);
  };

  const previewExport = () => {
    console.log('Previewing export with config:', exportConfig);
  };

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Format & Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Export Configuration
            </CardTitle>
            <CardDescription>
              Choose format, template, and export options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={exportConfig.format === 'pdf' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportConfig(prev => ({ ...prev, format: 'pdf' }))}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">PDF</span>
                  <span className="text-xs text-muted-foreground">Print-ready</span>
                </Button>
                <Button
                  variant={exportConfig.format === 'excel' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportConfig(prev => ({ ...prev, format: 'excel' }))}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  <span className="text-xs">Excel</span>
                  <span className="text-xs text-muted-foreground">Editable</span>
                </Button>
                <Button
                  variant={exportConfig.format === 'csv' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setExportConfig(prev => ({ ...prev, format: 'csv' }))}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">CSV</span>
                  <span className="text-xs text-muted-foreground">Raw data</span>
                </Button>
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Report Template</Label>
              <Select 
                value={exportConfig.template} 
                onValueChange={(value) => setExportConfig(prev => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templateOptions.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      <div className="space-y-1">
                        <div className="font-medium">{template.label}</div>
                        <div className="text-xs text-muted-foreground">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Options for PDF/Excel */}
            {(exportConfig.format === 'pdf' || exportConfig.format === 'excel') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-charts">Include Charts & Visualizations</Label>
                  <Switch
                    id="include-charts"
                    checked={exportConfig.includeCharts}
                    onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeCharts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-logo">Include Logo & Branding</Label>
                  <Switch
                    id="include-logo"
                    checked={exportConfig.includeLogo}
                    onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeLogo: checked }))}
                  />
                </div>

                {exportConfig.format === 'pdf' && (
                  <div className="space-y-2">
                    <Label>Page Orientation</Label>
                    <Select 
                      value={exportConfig.pageOrientation} 
                      onValueChange={(value: any) => setExportConfig(prev => ({ ...prev, pageOrientation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {exportConfig.format === 'excel' && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-raw-data">Include Raw Data Sheets</Label>
                    <Switch
                      id="include-raw-data"
                      checked={exportConfig.includeRawData}
                      onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, includeRawData: checked }))}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branding & Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding & Customization
            </CardTitle>
            <CardDescription>
              Configure logos, colors, and styling for your reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom Branding Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="custom-branding">Custom Branding</Label>
                <p className="text-xs text-muted-foreground">Use custom logo and colors</p>
              </div>
              <Switch
                id="custom-branding"
                checked={exportConfig.customBranding}
                onCheckedChange={(checked) => setExportConfig(prev => ({ ...prev, customBranding: checked }))}
              />
            </div>

            {/* Branding Options */}
            {exportConfig.customBranding ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowBrandingConfig(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Custom Logo
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 border"></div>
                      <Input value="#3B82F6" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-600 border"></div>
                      <Input value="#6B7280" className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JBA</span>
                  </div>
                  <div>
                    <p className="font-medium">Jenga Biz Africa</p>
                    <p className="text-xs text-muted-foreground">Default branding will be used</p>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Button */}
            <Button variant="outline" className="w-full" onClick={previewExport}>
              <Eye className="h-4 w-4 mr-2" />
              Preview Report Layout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 justify-center">
            <Button size="lg" onClick={startExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="lg">
              <Settings className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export History & Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Export History & Progress</CardTitle>
          <CardDescription>
            Track your export jobs and download completed reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exportJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(job.status)}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{job.name}</p>
                      <Badge variant={getStatusColor(job.status)} className="text-xs">
                        {job.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {job.format}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {job.createdAt.toLocaleString()}
                    </p>
                    {job.error && (
                      <p className="text-xs text-red-500">{job.error}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {job.status === 'processing' && (
                    <div className="flex items-center gap-2 min-w-24">
                      <Progress value={job.progress} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{job.progress}%</span>
                    </div>
                  )}
                  
                  {job.status === 'completed' && job.downloadUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  {job.status === 'failed' && (
                    <Button size="sm" variant="outline">
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditional Components */}
      {showBrandingConfig && (
        <ReportBrandingConfig onClose={() => setShowBrandingConfig(false)} />
      )}
    </div>
  );
}