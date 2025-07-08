
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, TrendingUp, Plus, DollarSign, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface RevenueEntry {
  id: string;
  month: string;
  revenue: number;
  notes: string;
}

interface MonthlyRevenueSectionProps {
  isPro?: boolean;
  strategyData?: any;
}

const MonthlyRevenueSection = ({ isPro = false, strategyData = null }: MonthlyRevenueSectionProps) => {
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([
    {
      id: '1',
      month: 'Jan 2024',
      revenue: 5000,
      notes: 'Launch month - better than expected!'
    },
    {
      id: '2',
      month: 'Feb 2024',
      revenue: 7500,
      notes: 'Added new marketing channels'
    },
    {
      id: '3',
      month: 'Mar 2024',
      revenue: 12000,
      notes: 'First profitable month'
    }
  ]);

  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const { toast } = useToast();

  // Sample data for free users
  const sampleData = [
    { month: 'Jan', revenue: 2500, notes: 'Starting small' },
    { month: 'Feb', revenue: 4200, notes: 'Growing steadily' },
    { month: 'Mar', revenue: 6800, notes: 'Marketing boost' },
    { month: 'Apr', revenue: 8500, notes: 'New customers' },
    { month: 'May', revenue: 11200, notes: 'Peak season' },
    { month: 'Jun', revenue: 9800, notes: 'Seasonal dip' }
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  };

  const currentData = isPro ? revenueData : sampleData;
  const latestRevenue = currentData[currentData.length - 1]?.revenue || 0;
  const previousRevenue = currentData[currentData.length - 2]?.revenue || 0;
  const growthRate = previousRevenue > 0 ? ((latestRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

  const addRevenueEntry = () => {
    if (!isPro) {
      toast({
        title: "Upgrade Required",
        description: "Upgrade to Strategy Grid Pro to track your real business revenue.",
        variant: "destructive",
      });
      return;
    }

    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const newEntry: RevenueEntry = {
      id: Date.now().toString(),
      month: currentMonth,
      revenue: 0,
      notes: ''
    };

    setRevenueData([...revenueData, newEntry]);
    setEditingEntry(newEntry.id);
  };

  const updateRevenueEntry = (id: string, field: keyof RevenueEntry, value: string | number) => {
    setRevenueData(revenueData.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const deleteRevenueEntry = (id: string) => {
    setRevenueData(revenueData.filter(entry => entry.id !== id));
  };

  const handleUpgrade = () => {
    toast({
      title: "Upgrade Required",
      description: "Upgrade to Strategy Grid Pro to track your real business revenue and get AI insights.",
      variant: "destructive",
    });
  };

  const getAIInsight = () => {
    if (!isPro) return null;
    
    const growth = parseFloat(growthRate.toString());
    if (growth > 20) {
      return "Looks like you're growing fast! Consider increasing prices or exploring new channels.";
    } else if (growth > 0) {
      return "Steady growth is great! Focus on customer retention and referrals.";
    } else if (growth < -10) {
      return "Revenue dipped this month. Review your marketing strategy and customer feedback.";
    }
    return "Track your revenue consistently to identify patterns and opportunities.";
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Monthly Revenue Tracker
        </h2>
        <p className="text-gray-600">
          Monitor your business growth and identify revenue trends.
        </p>
      </div>

      {/* Revenue Chart */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              Revenue Overview
              {!isPro && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Feature
                </Badge>
              )}
            </div>
            {isPro && (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                  size="sm"
                  variant="outline"
                >
                  {chartType === 'line' ? 'Bar Chart' : 'Line Chart'}
                </Button>
                <Button
                  onClick={addRevenueEntry}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Month
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isPro && (
            <div className="relative">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Upgrade to Strategy Grid Pro to track your real business revenue.
                  </p>
                  <Button onClick={handleUpgrade} size="sm" className="bg-gradient-to-r from-orange-500 to-yellow-500">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="h-64 w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--color-revenue)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />} 
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="var(--color-revenue)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Revenue Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">Latest Month</span>
              </div>
              <p className="text-xl font-bold text-green-900">
                ${latestRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Growth Rate</span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {growthRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Entries (Pro Only) */}
      {isPro && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
              Revenue Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.map((entry) => (
                <div key={entry.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="w-24">
                        <span className="text-sm font-medium text-gray-700">{entry.month}</span>
                      </div>
                      <div className="flex-1">
                        {editingEntry === entry.id ? (
                          <Input
                            type="number"
                            value={entry.revenue}
                            onChange={(e) => updateRevenueEntry(entry.id, 'revenue', parseInt(e.target.value) || 0)}
                            placeholder="Revenue amount"
                            className="w-full"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">
                            ${entry.revenue.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {editingEntry === entry.id ? (
                      <Textarea
                        value={entry.notes}
                        onChange={(e) => updateRevenueEntry(entry.id, 'notes', e.target.value)}
                        placeholder="Add notes about this month..."
                        className="w-full"
                        rows={2}
                      />
                    ) : (
                      entry.notes && (
                        <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                      )
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingEntry === entry.id ? (
                      <>
                        <Button
                          onClick={() => setEditingEntry(null)}
                          size="sm"
                          variant="outline"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => setEditingEntry(null)}
                          size="sm"
                          variant="ghost"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditingEntry(entry.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights (Pro Only) */}
      {isPro && getAIInsight() && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-1">AI Growth Insight</h4>
                <p className="text-sm text-green-700">{getAIInsight()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Message for Free Users */}
      {!isPro && (
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <Crown className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-800 mb-3">
                  Upgrade to Strategy Grid Pro to track your real business revenue and get personalized AI insights.
                </p>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonthlyRevenueSection;
