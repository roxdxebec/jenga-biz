// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useImpactMeasurement } from '@/hooks/useImpactMeasurement';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Plus, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

export const FinanceAccessMetrics = () => {
  const { financeRecords, addFinanceRecord, loading } = useImpactMeasurement();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    business_id: '',
    funding_source: 'bank_loan',
    funding_type: 'applied',
    amount_requested: '',
    amount_approved: '',
    amount_disbursed: '',
    interest_rate: '',
    loan_term_months: '',
    purpose: 'working_capital',
    application_status: 'pending',
    rejection_reason: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_id || !formData.funding_source || !formData.funding_type) {
      toast({
        title: "Validation Error",
        description: "Please provide required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addFinanceRecord({
        business_id: formData.business_id,
        record_date: new Date().toISOString().split('T')[0],
        funding_source: formData.funding_source,
        funding_type: formData.funding_type,
        amount_requested: formData.amount_requested ? parseFloat(formData.amount_requested) : undefined,
        amount_approved: formData.amount_approved ? parseFloat(formData.amount_approved) : undefined,
        amount_disbursed: formData.amount_disbursed ? parseFloat(formData.amount_disbursed) : undefined,
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : undefined,
        loan_term_months: formData.loan_term_months ? parseInt(formData.loan_term_months) : undefined,
        purpose: formData.purpose || undefined,
        application_status: formData.application_status,
        rejection_reason: formData.rejection_reason || undefined,
        notes: formData.notes || undefined
      });

      toast({
        title: "Success",
        description: "Finance access record added successfully."
      });

      setIsAdding(false);
      setFormData({
        business_id: '',
        funding_source: 'bank_loan',
        funding_type: 'applied',
        amount_requested: '',
        amount_approved: '',
        amount_disbursed: '',
        interest_rate: '',
        loan_term_months: '',
        purpose: 'working_capital',
        application_status: 'pending',
        rejection_reason: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add finance access record.",
        variant: "destructive"
      });
    }
  };

  // Calculate metrics
  const totalApplications = financeRecords.length;
  const approvedApplications = financeRecords.filter(r => 
    r.application_status === 'approved' || r.application_status === 'disbursed'
  ).length;
  const rejectedApplications = financeRecords.filter(r => r.application_status === 'rejected').length;
  const pendingApplications = financeRecords.filter(r => 
    r.application_status === 'pending' || r.application_status === 'under_review'
  ).length;
  
  const successRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;
  
  const totalRequested = financeRecords.reduce((sum, r) => sum + (r.amount_requested || 0), 0);
  const totalApproved = financeRecords.reduce((sum, r) => sum + (r.amount_approved || 0), 0);
  const totalDisbursed = financeRecords.reduce((sum, r) => sum + (r.amount_disbursed || 0), 0);
  
  const avgInterestRate = financeRecords.filter(r => r.interest_rate).length > 0
    ? financeRecords.reduce((sum, r) => sum + (r.interest_rate || 0), 0) / 
      financeRecords.filter(r => r.interest_rate).length
    : 0;

  // Prepare chart data
  const fundingSourceData = financeRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.source === record.funding_source);
    if (existing) {
      existing.count += 1;
      existing.total_amount += record.amount_disbursed || record.amount_approved || 0;
    } else {
      acc.push({
        source: record.funding_source,
        count: 1,
        total_amount: record.amount_disbursed || record.amount_approved || 0
      });
    }
    return acc;
  }, [] as Array<{ source: string; count: number; total_amount: number }>);

  const monthlyData = financeRecords.reduce((acc, record) => {
    const month = new Date(record.record_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.applications += 1;
      existing.approved += (record.application_status === 'approved' || record.application_status === 'disbursed') ? 1 : 0;
      existing.amount += record.amount_disbursed || record.amount_approved || 0;
    } else {
      acc.push({
        month,
        applications: 1,
        approved: (record.application_status === 'approved' || record.application_status === 'disbursed') ? 1 : 0,
        amount: record.amount_disbursed || record.amount_approved || 0
      });
    }
    return acc;
  }, [] as Array<{ month: string; applications: number; approved: number; amount: number }>);

  const statusData = [
    { name: 'Approved', value: approvedApplications, color: 'hsl(var(--primary))' },
    { name: 'Pending', value: pendingApplications, color: 'hsl(var(--secondary))' },
    { name: 'Rejected', value: rejectedApplications, color: 'hsl(var(--destructive))' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Finance Access Metrics
          </CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : totalApplications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${successRate.toFixed(1)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `$${totalDisbursed.toLocaleString()}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Interest Rate</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${avgInterestRate.toFixed(1)}%`}
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
            <CardTitle>Monthly Finance Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="hsl(var(--secondary))" name="Applications" />
                <Bar dataKey="approved" fill="hsl(var(--primary))" name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funding Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Sources Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fundingSourceData.map((source, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="text-lg font-semibold capitalize">
                  {source.source.replace('_', ' ')}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {source.count} applications
                </div>
                <div className="text-sm text-muted-foreground">
                  ${source.total_amount.toLocaleString()} funded
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Finance Access Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : financeRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No finance access records yet. Add your first record to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {financeRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant={
                        record.application_status === 'approved' || record.application_status === 'disbursed' ? "default" :
                        record.application_status === 'rejected' ? "destructive" : "secondary"
                      }
                    >
                      {record.application_status.toUpperCase()}
                    </Badge>
                    <span className="font-medium capitalize">
                      {record.funding_source.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${(record.amount_requested || 0).toLocaleString()} requested
                    </span>
                    {(record.amount_approved || record.amount_disbursed) && (
                      <span className="text-sm text-green-600">
                        ${((record.amount_disbursed || record.amount_approved) || 0).toLocaleString()} approved
                      </span>
                    )}
                    {record.interest_rate && (
                      <span className="text-xs text-muted-foreground">
                        {record.interest_rate}% interest
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.record_date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Record Modal */}
      {isAdding && (
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Add Finance Access Record</CardTitle>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="funding_source">Funding Source</Label>
                      <Select value={formData.funding_source} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, funding_source: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_loan">Bank Loan</SelectItem>
                          <SelectItem value="microfinance">Microfinance</SelectItem>
                          <SelectItem value="grant">Grant</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="application_status">Application Status</Label>
                      <Select value={formData.application_status} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, application_status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="disbursed">Disbursed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount_requested">Amount Requested ($)</Label>
                      <Input
                        id="amount_requested"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount_requested}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount_requested: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount_approved">Amount Approved ($)</Label>
                      <Input
                        id="amount_approved"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.amount_approved}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount_approved: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                      <Input
                        id="interest_rate"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.interest_rate}
                        onChange={(e) => setFormData(prev => ({ ...prev, interest_rate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="loan_term_months">Loan Term (Months)</Label>
                      <Input
                        id="loan_term_months"
                        type="number"
                        min="1"
                        value={formData.loan_term_months}
                        onChange={(e) => setFormData(prev => ({ ...prev, loan_term_months: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select value={formData.purpose} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, purpose: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working_capital">Working Capital</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="expansion">Expansion</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.application_status === 'rejected' && (
                    <div>
                      <Label htmlFor="rejection_reason">Rejection Reason</Label>
                      <Input
                        id="rejection_reason"
                        value={formData.rejection_reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, rejection_reason: e.target.value }))}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Record</Button>
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