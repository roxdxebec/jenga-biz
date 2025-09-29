import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useImpactMeasurement } from '@/hooks/useImpactMeasurement';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoanReadinessScorer = () => {
  const { loanAssessments, addLoanAssessment, loading } = useImpactMeasurement();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    business_id: '',
    credit_score: '',
    revenue_stability_score: '',
    cash_flow_score: '',
    debt_to_income_ratio: '',
    collateral_value: '',
    business_plan_score: '',
    financial_documentation_score: ''
  });

  const calculateOverallScore = () => {
    const scores = [
      parseFloat(formData.credit_score) || 0,
      parseFloat(formData.revenue_stability_score) || 0,
      parseFloat(formData.cash_flow_score) || 0,
      parseFloat(formData.business_plan_score) || 0,
      parseFloat(formData.financial_documentation_score) || 0
    ].filter(score => score > 0);

    if (scores.length === 0) return 0;
    
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Adjust for debt-to-income ratio (lower is better)
    const debtRatio = parseFloat(formData.debt_to_income_ratio) || 0;
    const debtPenalty = debtRatio > 0.4 ? 10 : debtRatio > 0.3 ? 5 : 0;
    
    return Math.max(0, Math.min(100, averageScore - debtPenalty));
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'highly_qualified';
    if (score >= 65) return 'loan_ready';
    if (score >= 45) return 'partially_ready';
    return 'not_ready';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_id) {
      toast({
        title: "Validation Error",
        description: "Please provide business ID.",
        variant: "destructive"
      });
      return;
    }

    const overallScore = calculateOverallScore();
    const readinessLevel = getReadinessLevel(overallScore);

    try {
      await addLoanAssessment({
        business_id: formData.business_id,
        assessment_date: new Date().toISOString().split('T')[0],
        credit_score: formData.credit_score ? parseInt(formData.credit_score) : undefined,
        revenue_stability_score: formData.revenue_stability_score ? parseInt(formData.revenue_stability_score) : undefined,
        cash_flow_score: formData.cash_flow_score ? parseInt(formData.cash_flow_score) : undefined,
        debt_to_income_ratio: formData.debt_to_income_ratio ? parseFloat(formData.debt_to_income_ratio) : undefined,
        collateral_value: formData.collateral_value ? parseFloat(formData.collateral_value) : 0,
        business_plan_score: formData.business_plan_score ? parseInt(formData.business_plan_score) : undefined,
        financial_documentation_score: formData.financial_documentation_score ? parseInt(formData.financial_documentation_score) : undefined,
        overall_readiness_score: overallScore,
        readiness_level: readinessLevel,
        recommendations: []
      });

      toast({
        title: "Success",
        description: "Loan readiness assessment added successfully."
      });

      setIsAdding(false);
      setFormData({
        business_id: '',
        credit_score: '',
        revenue_stability_score: '',
        cash_flow_score: '',
        debt_to_income_ratio: '',
        collateral_value: '',
        business_plan_score: '',
        financial_documentation_score: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add loan readiness assessment.",
        variant: "destructive"
      });
    }
  };

  // Calculate metrics
  const totalAssessments = loanAssessments.length;
  const avgReadinessScore = totalAssessments > 0 
    ? loanAssessments.reduce((sum, a) => sum + (a.overall_readiness_score || 0), 0) / totalAssessments 
    : 0;
  
  const readinessDistribution = loanAssessments.reduce((acc, assessment) => {
    const level = assessment.readiness_level || 'not_ready';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Prepare chart data
  const scoreDistribution = loanAssessments.reduce((acc, assessment) => {
    const scoreRange = (assessment.overall_readiness_score || 0) >= 80 ? '80-100' :
                      (assessment.overall_readiness_score || 0) >= 60 ? '60-79' :
                      (assessment.overall_readiness_score || 0) >= 40 ? '40-59' :
                      (assessment.overall_readiness_score || 0) >= 20 ? '20-39' : '0-19';
    
    const existing = acc.find(item => item.range === scoreRange);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ range: scoreRange, count: 1 });
    }
    return acc;
  }, [] as Array<{ range: string; count: number }>);

  // Average scores for radar chart
  const avgScores = loanAssessments.length > 0 ? {
    creditScore: loanAssessments.reduce((sum, a) => sum + (a.credit_score || 0), 0) / loanAssessments.length,
    revenueStability: loanAssessments.reduce((sum, a) => sum + (a.revenue_stability_score || 0), 0) / loanAssessments.length,
    cashFlow: loanAssessments.reduce((sum, a) => sum + (a.cash_flow_score || 0), 0) / loanAssessments.length,
    businessPlan: loanAssessments.reduce((sum, a) => sum + (a.business_plan_score || 0), 0) / loanAssessments.length,
    documentation: loanAssessments.reduce((sum, a) => sum + (a.financial_documentation_score || 0), 0) / loanAssessments.length
  } : { creditScore: 0, revenueStability: 0, cashFlow: 0, businessPlan: 0, documentation: 0 };

  const radarData = [
    { subject: 'Credit Score', score: avgScores.creditScore, fullMark: 100 },
    { subject: 'Revenue Stability', score: avgScores.revenueStability, fullMark: 100 },
    { subject: 'Cash Flow', score: avgScores.cashFlow, fullMark: 100 },
    { subject: 'Business Plan', score: avgScores.businessPlan, fullMark: 100 },
    { subject: 'Documentation', score: avgScores.documentation, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Loan Readiness Scoring
          </CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : totalAssessments}
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
                <p className="text-sm font-medium text-muted-foreground">Avg Readiness Score</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${avgReadinessScore.toFixed(0)}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Loan Ready</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   (readinessDistribution.loan_ready || 0) + (readinessDistribution.highly_qualified || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Need Support</p>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-16" /> : 
                   (readinessDistribution.not_ready || 0) + (readinessDistribution.partially_ready || 0)}
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
            <CardTitle>Average Scores by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name="Average Score" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Businesses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Readiness Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : loanAssessments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No loan readiness assessments yet. Add your first assessment to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {loanAssessments.slice(0, 10).map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={
                          assessment.readiness_level === 'highly_qualified' ? "default" :
                          assessment.readiness_level === 'loan_ready' ? "secondary" :
                          assessment.readiness_level === 'partially_ready' ? "outline" : "destructive"
                        }
                      >
                        {assessment.readiness_level?.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="font-medium">
                        Overall Score: {assessment.overall_readiness_score || 0}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(assessment.assessment_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={assessment.overall_readiness_score || 0} 
                      className="w-full h-2"
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      {assessment.credit_score && (
                        <span>Credit: {assessment.credit_score}</span>
                      )}
                      {assessment.revenue_stability_score && (
                        <span>Revenue: {assessment.revenue_stability_score}%</span>
                      )}
                      {assessment.cash_flow_score && (
                        <span>Cash Flow: {assessment.cash_flow_score}%</span>
                      )}
                      {assessment.business_plan_score && (
                        <span>Plan: {assessment.business_plan_score}%</span>
                      )}
                      {assessment.financial_documentation_score && (
                        <span>Docs: {assessment.financial_documentation_score}%</span>
                      )}
                    </div>
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
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>New Loan Readiness Assessment</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Overall Score: {calculateOverallScore().toFixed(0)}% 
                  <Badge className="ml-2" variant={
                    getReadinessLevel(calculateOverallScore()) === 'highly_qualified' ? "default" :
                    getReadinessLevel(calculateOverallScore()) === 'loan_ready' ? "secondary" :
                    getReadinessLevel(calculateOverallScore()) === 'partially_ready' ? "outline" : "destructive"
                  }>
                    {getReadinessLevel(calculateOverallScore()).replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
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
                      <Label htmlFor="credit_score">Credit Score (300-850)</Label>
                      <Input
                        id="credit_score"
                        type="number"
                        min="300"
                        max="850"
                        value={formData.credit_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, credit_score: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="revenue_stability_score">Revenue Stability Score (0-100)</Label>
                      <Input
                        id="revenue_stability_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.revenue_stability_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, revenue_stability_score: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cash_flow_score">Cash Flow Score (0-100)</Label>
                      <Input
                        id="cash_flow_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.cash_flow_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, cash_flow_score: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="debt_to_income_ratio">Debt-to-Income Ratio (0.0-1.0)</Label>
                      <Input
                        id="debt_to_income_ratio"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={formData.debt_to_income_ratio}
                        onChange={(e) => setFormData(prev => ({ ...prev, debt_to_income_ratio: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="collateral_value">Collateral Value ($)</Label>
                      <Input
                        id="collateral_value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.collateral_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, collateral_value: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="business_plan_score">Business Plan Score (0-100)</Label>
                      <Input
                        id="business_plan_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.business_plan_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, business_plan_score: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="financial_documentation_score">Financial Documentation Score (0-100)</Label>
                      <Input
                        id="financial_documentation_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.financial_documentation_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, financial_documentation_score: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Assessment</Button>
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