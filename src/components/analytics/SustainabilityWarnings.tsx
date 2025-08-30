import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, DollarSign, Target, Lightbulb, ChevronRight } from 'lucide-react';
import { SustainabilityWarning } from '@/hooks/useFinancialInsights';

interface SustainabilityWarningsProps {
  warnings: SustainabilityWarning[];
  onActionClick?: (warning: SustainabilityWarning) => void;
}

export const SustainabilityWarnings = ({ 
  warnings, 
  onActionClick 
}: SustainabilityWarningsProps) => {
  const getWarningIcon = (type: string) => {
    switch (type) {
      case 'burn_rate': return <TrendingDown className="h-4 w-4" />;
      case 'negative_trend': return <AlertTriangle className="h-4 w-4" />;
      case 'low_margin': return <DollarSign className="h-4 w-4" />;
      case 'irregular_revenue': return <Target className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  if (warnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Financial Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-green-600 mb-2">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-green-600 mb-2">All Clear!</h3>
            <p className="text-sm text-muted-foreground">
              Your financial health indicators are within healthy ranges. Keep up the good work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group warnings by severity
  const groupedWarnings = warnings.reduce((acc, warning) => {
    if (!acc[warning.severity]) acc[warning.severity] = [];
    acc[warning.severity].push(warning);
    return acc;
  }, {} as Record<string, SustainabilityWarning[]>);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Financial Health Alerts
            <Badge variant="outline" className="ml-auto">
              {warnings.length} {warnings.length === 1 ? 'Alert' : 'Alerts'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* High severity warnings */}
          {groupedWarnings.high && (
            <div className="space-y-3">
              <h4 className="font-medium text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Issues
              </h4>
              {groupedWarnings.high.map((warning, index) => (
                <Alert key={index} variant={getAlertVariant(warning.severity)}>
                  <div className="flex items-start gap-3">
                    {getWarningIcon(warning.type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {warning.message}
                        <Badge variant={getSeverityColor(warning.severity)}>
                          {warning.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-3 w-3" />
                          {warning.recommendation}
                        </div>
                        {onActionClick && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => onActionClick(warning)}
                          >
                            Take Action
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Medium severity warnings */}
          {groupedWarnings.medium && (
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Areas for Improvement
              </h4>
              {groupedWarnings.medium.map((warning, index) => (
                <Alert key={index} variant={getAlertVariant(warning.severity)}>
                  <div className="flex items-start gap-3">
                    {getWarningIcon(warning.type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {warning.message}
                        <Badge variant={getSeverityColor(warning.severity)}>
                          {warning.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-3 w-3" />
                          {warning.recommendation}
                        </div>
                        {onActionClick && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => onActionClick(warning)}
                          >
                            Learn More
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Low severity warnings */}
          {groupedWarnings.low && (
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Optimization Opportunities
              </h4>
              {groupedWarnings.low.map((warning, index) => (
                <Alert key={index} variant={getAlertVariant(warning.severity)}>
                  <div className="flex items-start gap-3">
                    {getWarningIcon(warning.type)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {warning.message}
                        <Badge variant={getSeverityColor(warning.severity)}>
                          {warning.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-3 w-3" />
                          {warning.recommendation}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Financial Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Revenue Optimization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Diversify income streams</li>
                <li>• Implement recurring revenue models</li>
                <li>• Focus on high-margin products/services</li>
                <li>• Improve customer retention</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Cost Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Track all expenses regularly</li>
                <li>• Negotiate better supplier terms</li>
                <li>• Automate processes to reduce labor costs</li>
                <li>• Review subscriptions and recurring costs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};