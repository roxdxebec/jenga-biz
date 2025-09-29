// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useImpactMeasurement } from '@/hooks/useImpactMeasurement';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Plus, Shield, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

export const BusinessSurvivalTracker = () => {
  const { survivalRecords, addSurvivalRecord, loading } = useImpactMeasurement();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    business_id: '',
    months_in_operation: 0,
    is_active: true,
    revenue_trend: 'stable',
    employee_count: 0,
    survival_risk_score: 50,
    closure_reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_id || formData.months_in_operation < 0) {
      toast({
        title: "Validation Error",
        description: "Please provide valid business ID and months in operation.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSurvivalRecord({
        business_id: formData.business_id,
        assessment_date: new Date().toISOString().split('T')[0],
        months_in_operation: formData.months_in_operation,
        is_active: formData.is_active,
        closure_date: !formData.is_active ? new Date().toISOString().split('T')[0] : undefined,
        closure_reason: !formData.is_active && formData.closure_reason ? formData.closure_reason : undefined,
        revenue_trend: formData.revenue_trend,
        employee_count: formData.employee_count,
        survival_risk_score: formData.survival_risk_score,
        risk_factors: [],
        support_interventions: []
      });

      toast({
        title: "Success",
        description: "Business survival record added successfully."
      });

      setIsAdding(false);
      setFormData({
        business_id: '',
        months_in_operation: 0,
        is_active: true,
        revenue_trend: 'stable',
        employee_count: 0,
        survival_risk_score: 50,
        closure_reason: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add survival record.",
        variant: "destructive"
      });
    }
  };

  // Calculate metrics
  const totalBusinesses = survivalRecords.length;
  const activeBusinesses = survivalRecords.filter(r => r.is_active).length;
  const survivalRate = totalBusinesses > 0 ? (activeBusinesses / totalBusinesses) * 100 : 0;
  const avgOperatingMonths = totalBusinesses > 0 
    ? survivalRecords.reduce((sum, r) => sum + r.months_in_operation, 0) / totalBusinesses 
    : 0;

  // Prepare chart data
  const survivalByMonths = survivalRecords.reduce((acc, record) => {
    const monthGroup = record.months_in_operation < 12 ? '0-11' :
                      record.months_in_operation < 24 ? '12-23' :
                      record.months_in_operation < 36 ? '24-35' : '36+';
    
    const existing = acc.find(item => item.months === monthGroup);
    if (existing) {
      existing.total += 1;
      if (record.is_active) existing.active += 1;
    } else {
      acc.push({
        months: monthGroup,
        total: 1,
        active: record.is_active ? 1 : 0,
        survival_rate: record.is_active ? 100 : 0
      });
    }
    return acc;
  }, [] as Array<{ months: string; total: number; active: number; survival_rate: number }>);

  // Calculate survival rates for each group
  survivalByMonths.forEach(group => {
    group.survival_rate = group.total > 0 ? (group.active / group.total) * 100 : 0;
  });

  const closureReasons = survivalRecords
    .filter(r => !r.is_active && r.closure_reason)
    .reduce((acc, record) => {
      const reason = record.closure_reason!;
      const existing = acc.find(item => item.reason === reason);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ reason, count: 1 });
      }
      return acc;
    }, [] as Array<{ reason: string; count: number }>);

  const riskDistribution = survivalRecords.reduce((acc, record) => {
    const riskLevel = (record.survival_risk_score || 50) >= 75 ? 'High Risk' :
                      (record.survival_risk_score || 50) >= 50 ? 'Medium Risk' :
                      (record.survival_risk_score || 50) >= 25 ? 'Low Risk' : 'Very Low Risk';
    
    const existing = acc.find(item => item.level === riskLevel);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ level: riskLevel, count: 1 });
    }
    return acc;
  }, [] as Array<{ level: string; count: number }>);

  const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--secondary))', 'hsl(var(--primary))'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Business Survival Tracking
          </CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Assessment
          </Button>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Active Businesses</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : activeBusinesses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Survival Rate</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${survivalRate.toFixed(1)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Operating Period</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${avgOperatingMonths.toFixed(1)}mo`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">High Risk Businesses</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   survivalRecords.filter(r => (r.survival_risk_score || 0) >= 75).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Survival Rate by Operating Period</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={survivalByMonths}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="months" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="survival_rate" fill="hsl(var(--primary))" name="Survival Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Closure Reasons */}
      {closureReasons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Closure Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {closureReasons.map((reason, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{reason.count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {reason.reason.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Survival Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : survivalRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No survival assessments yet. Add your first assessment to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {survivalRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={record.is_active ? "default" : "destructive"}>
                      {record.is_active ? "Active" : "Closed"}
                    </Badge>
                    <span className="font-medium">{record.months_in_operation} months</span>
                    <span className="text-sm text-muted-foreground">
                      {record.employee_count} employees
                    </span>
                    <Badge 
                      variant={(record.survival_risk_score || 0) >= 75 ? "destructive" :
                              (record.survival_risk_score || 0) >= 50 ? "secondary" : "default"}
                    >
                      Risk: {record.survival_risk_score || 0}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.assessment_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Assessment Modal */}
      {isAdding && (
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle>Add Survival Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="business_id">Business ID</Label>
                    <Input
                      id="business_id"
                      value={formData.business_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, business_id: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="months_in_operation">Months in Operation</Label>
                    <Input
                      id="months_in_operation"
                      type="number"
                      min="0"
                      value={formData.months_in_operation}
                      onChange={(e) => setFormData(prev => ({ ...prev, months_in_operation: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Business is Active</Label>
                  </div>

                  {!formData.is_active && (
                    <div>
                      <Label htmlFor="closure_reason">Closure Reason</Label>
                      <Select value={formData.closure_reason} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, closure_reason: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial_difficulties">Financial Difficulties</SelectItem>
                          <SelectItem value="market_conditions">Market Conditions</SelectItem>
                          <SelectItem value="personal_reasons">Personal Reasons</SelectItem>
                          <SelectItem value="pivot">Business Pivot</SelectItem>
                          <SelectItem value="success_exit">Successful Exit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="revenue_trend">Revenue Trend</Label>
                    <Select value={formData.revenue_trend} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, revenue_trend: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increasing">Increasing</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="declining">Declining</SelectItem>
                        <SelectItem value="volatile">Volatile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="employee_count">Employee Count</Label>
                    <Input
                      id="employee_count"
                      type="number"
                      min="0"
                      value={formData.employee_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, employee_count: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="survival_risk_score">Survival Risk Score (0-100)</Label>
                    <Input
                      id="survival_risk_score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.survival_risk_score}
                      onChange={(e) => setFormData(prev => ({ ...prev, survival_risk_score: parseInt(e.target.value) || 50 }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Assessment</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
};