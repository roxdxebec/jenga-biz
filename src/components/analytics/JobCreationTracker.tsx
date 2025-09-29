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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Users, TrendingUp, DollarSign } from 'lucide-react';

export const JobCreationTracker = () => {
  const { jobRecords, addJobRecord, loading } = useImpactMeasurement();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    business_id: '',
    jobs_created: 0,
    job_type: '',
    employment_type: 'full_time',
    skill_level: 'entry',
    average_wage: '',
    benefits_provided: false,
    gender_breakdown: { male: 0, female: 0, other: 0 },
    age_breakdown: { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 },
    retention_rate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_id || formData.jobs_created <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide business ID and number of jobs created.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addJobRecord({
        business_id: formData.business_id,
        recorded_date: new Date().toISOString().split('T')[0],
        jobs_created: formData.jobs_created,
        job_type: formData.job_type || undefined,
        employment_type: formData.employment_type,
        skill_level: formData.skill_level,
        average_wage: formData.average_wage ? parseFloat(formData.average_wage) : undefined,
        benefits_provided: formData.benefits_provided,
        gender_breakdown: formData.gender_breakdown,
        age_breakdown: formData.age_breakdown,
        retention_rate: formData.retention_rate ? parseFloat(formData.retention_rate) : undefined
      });

      toast({
        title: "Success",
        description: "Job creation record added successfully."
      });

      setIsAdding(false);
      setFormData({
        business_id: '',
        jobs_created: 0,
        job_type: '',
        employment_type: 'full_time',
        skill_level: 'entry',
        average_wage: '',
        benefits_provided: false,
        gender_breakdown: { male: 0, female: 0, other: 0 },
        age_breakdown: { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 },
        retention_rate: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job creation record.",
        variant: "destructive"
      });
    }
  };

  // Prepare chart data
  const monthlyData = jobRecords.reduce((acc, record) => {
    const month = new Date(record.recorded_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.jobs_created += record.jobs_created;
      existing.total_wage += (record.average_wage || 0) * record.jobs_created;
    } else {
      acc.push({
        month,
        jobs_created: record.jobs_created,
        total_wage: (record.average_wage || 0) * record.jobs_created
      });
    }
    return acc;
  }, [] as Array<{ month: string; jobs_created: number; total_wage: number }>);

  const skillLevelData = jobRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.level === record.skill_level);
    if (existing) {
      existing.count += record.jobs_created;
    } else {
      acc.push({ level: record.skill_level, count: record.jobs_created });
    }
    return acc;
  }, [] as Array<{ level: string; count: number }>);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Job Creation Tracking
          </CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   jobRecords.reduce((sum, record) => sum + record.jobs_created, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Retention</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   `${(jobRecords.reduce((sum, record) => sum + (record.retention_rate || 0), 0) / 
                        Math.max(jobRecords.length, 1)).toFixed(1)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Wage</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   `$${(jobRecords.reduce((sum, record) => sum + (record.average_wage || 0), 0) / 
                         Math.max(jobRecords.length, 1)).toFixed(0)}`}
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
            <CardTitle>Monthly Job Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs_created" fill="hsl(var(--primary))" name="Jobs Created" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs by Skill Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, percent }: any) => `${level} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {skillLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Creation Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : jobRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No job creation records yet. Add your first record to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {jobRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{record.jobs_created} jobs</Badge>
                    <span className="font-medium">{record.employment_type.replace('_', ' ')}</span>
                    <span className="text-sm text-muted-foreground">{record.skill_level}</span>
                    {record.average_wage && (
                      <span className="text-sm text-muted-foreground">
                        ${record.average_wage.toLocaleString()}/yr
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.recorded_date).toLocaleDateString()}
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
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle>Add Job Creation Record</CardTitle>
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
                    <Label htmlFor="jobs_created">Number of Jobs Created</Label>
                    <Input
                      id="jobs_created"
                      type="number"
                      min="1"
                      value={formData.jobs_created}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobs_created: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select value={formData.employment_type} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, employment_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skill_level">Skill Level</Label>
                    <Select value={formData.skill_level} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, skill_level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="skilled">Skilled</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="average_wage">Average Annual Wage (Optional)</Label>
                    <Input
                      id="average_wage"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.average_wage}
                      onChange={(e) => setFormData(prev => ({ ...prev, average_wage: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="benefits"
                      checked={formData.benefits_provided}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, benefits_provided: checked }))}
                    />
                    <Label htmlFor="benefits">Benefits Provided</Label>
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