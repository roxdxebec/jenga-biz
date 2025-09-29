// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Download, RefreshCw, X } from 'lucide-react';

interface ExportStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

interface ExportProgressTrackerProps {
  exportId: string;
  steps: ExportStep[];
  onCancel?: () => void;
  onRetry?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function ExportProgressTracker({ 
  exportId, 
  steps, 
  onCancel, 
  onRetry, 
  onDownload,
  className 
}: ExportProgressTrackerProps) {
  const overallProgress = steps.reduce((acc, step) => acc + step.progress, 0) / steps.length;
  const currentStep = steps.find(step => step.status === 'processing');
  const failedStep = steps.find(step => step.status === 'failed');
  const allCompleted = steps.every(step => step.status === 'completed');
  const hasFailed = steps.some(step => step.status === 'failed');

  const getStepIcon = (step: ExportStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const getStatusColor = (status: ExportStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return '';
    const endTime = end || new Date();
    const duration = Math.round((endTime.getTime() - start.getTime()) / 1000);
    
    if (duration < 60) return `${duration}s`;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Export Progress</CardTitle>
            <CardDescription>Export ID: {exportId}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasFailed && (
              <Badge variant="destructive">Failed</Badge>
            )}
            {allCompleted && (
              <Badge variant="default">Completed</Badge>
            )}
            {currentStep && (
              <Badge variant="secondary">Processing</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current Step Highlight */}
        {currentStep && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {currentStep.name}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {currentStep.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {currentStep.progress}%
                </p>
              </div>
            </div>
            <Progress value={currentStep.progress} className="mt-3 h-2" />
          </div>
        )}

        {/* Failed Step Highlight */}
        {failedStep && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 dark:text-red-100">
                  {failedStep.name} Failed
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {failedStep.error || 'An unexpected error occurred during this step.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Export Steps</h4>
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
              {getStepIcon(step)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{step.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Step {index + 1}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
                {step.error && (
                  <p className="text-xs text-red-500 mt-1">{step.error}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step.status === 'processing' && (
                  <div className="flex items-center gap-2">
                    <Progress value={step.progress} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground min-w-8">
                      {step.progress}%
                    </span>
                  </div>
                )}
                
                <div className="text-right min-w-16">
                  <p className={`text-xs font-medium ${getStatusColor(step.status)}`}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                  </p>
                  {(step.startTime || step.endTime) && (
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(step.startTime, step.endTime)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {onCancel && !allCompleted && !hasFailed && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel Export
            </Button>
          )}
          
          {onRetry && hasFailed && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Export
            </Button>
          )}
          
          {onDownload && allCompleted && (
            <Button size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}