
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Plus, DollarSign, Edit, Save, X } from 'lucide-react';
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
  language?: string;
}

const MonthlyRevenueSection = ({ isPro = true, strategyData = null, language = 'en' }: MonthlyRevenueSectionProps) => {
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

  // Translation object
  const translations = {
    en: {
      title: 'Monthly Revenue Tracker',
      subtitle: 'Monitor your business growth and identify revenue trends.',
      revenueOverview: 'Revenue Overview',
      addMonth: 'Add Month',
      lineChart: 'Line Chart',
      barChart: 'Bar Chart',
      latestMonth: 'Latest Month',
      growthRate: 'Growth Rate',
      revenueEntries: 'Revenue Entries',
      aiInsight: 'AI Growth Insight',
      revenueAmount: 'Revenue amount',
      monthNotes: 'Add notes about this month...',
      insightFast: 'Looks like you\'re growing fast! Consider increasing prices or exploring new channels.',
      insightSteady: 'Steady growth is great! Focus on customer retention and referrals.',
      insightDip: 'Revenue dipped this month. Review your marketing strategy and customer feedback.',
      insightDefault: 'Track your revenue consistently to identify patterns and opportunities.'
    },
    sw: {
      title: 'Kifuatiliaji cha Mapato ya Kila Mwezi',
      subtitle: 'Fuatilia ukuaji wa biashara yako na kutambua mielekeo ya mapato.',
      revenueOverview: 'Muhtasari wa Mapato',
      addMonth: 'Ongeza Mwezi',
      lineChart: 'Chati ya Mstari',
      barChart: 'Chati ya Baa',
      latestMonth: 'Mwezi wa Hivi Karibuni',
      growthRate: 'Kiwango cha Ukuaji',
      revenueEntries: 'Maingizo ya Mapato',
      aiInsight: 'Ufahamu wa Ukuaji wa AI',
      revenueAmount: 'Kiasi cha mapato',
      monthNotes: 'Ongeza maelezo kuhusu mwezi huu...',
      insightFast: 'Inaonekana unakua haraka! Fikiria kuongeza bei au kuchunguza njia mpya.',
      insightSteady: 'Ukuaji wa kawaida ni mzuri! Zingatia uhifadhi wa wateja na marejesho.',
      insightDip: 'Mapato yameshuka mwezi huu. Kagua mkakati wako wa uuzaji na maoni ya wateja.',
      insightDefault: 'Fuatilia mapato yako kwa uongozi ili kutambua mifumo na fursa.'
    },
    ar: {
      title: 'متتبع الإيرادات الشهرية',
      subtitle: 'راقب نمو أعمالك وحدد اتجاهات الإيرادات.',
      revenueOverview: 'نظرة عامة على الإيرادات',
      addMonth: 'إضافة شهر',
      lineChart: 'مخطط خطي',
      barChart: 'مخطط بياني',
      latestMonth: 'أحدث شهر',
      growthRate: 'معدل النمو',
      revenueEntries: 'إدخالات الإيرادات',
      aiInsight: 'رؤية النمو بالذكاء الاصطناعي',
      revenueAmount: 'مبلغ الإيرادات',
      monthNotes: 'أضف ملاحظات حول هذا الشهر...',
      insightFast: 'يبدو أنك تنمو بسرعة! فكر في زيادة الأسعار أو استكشاف قنوات جديدة.',
      insightSteady: 'النمو المستقر رائع! ركز على الاحتفاظ بالعملاء والإحالات.',
      insightDip: 'انخفضت الإيرادات هذا الشهر. راجع استراتيجية التسويق وتعليقات العملاء.',
      insightDefault: 'تتبع إيراداتك باستمرار لتحديد الأنماط والفرص.'
    },
    fr: {
      title: 'Suivi des Revenus Mensuels',
      subtitle: 'Surveillez la croissance de votre entreprise et identifiez les tendances de revenus.',
      revenueOverview: 'Aperçu des Revenus',
      addMonth: 'Ajouter un Mois',
      lineChart: 'Graphique Linéaire',
      barChart: 'Graphique en Barres',
      latestMonth: 'Dernier Mois',
      growthRate: 'Taux de Croissance',
      revenueEntries: 'Entrées de Revenus',
      aiInsight: 'Insight de Croissance IA',
      revenueAmount: 'Montant des revenus',
      monthNotes: 'Ajoutez des notes sur ce mois...',
      insightFast: 'Il semble que vous grandissiez rapidement ! Considérez augmenter les prix ou explorer de nouveaux canaux.',
      insightSteady: 'Une croissance stable c\'est génial ! Concentrez-vous sur la rétention client et les références.',
      insightDip: 'Les revenus ont chuté ce mois-ci. Révisez votre stratégie marketing et les commentaires clients.',
      insightDefault: 'Suivez vos revenus de manière cohérente pour identifier les modèles et opportunités.'
    }
  };

  const t = translations[language] || translations.en;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  };

  const latestRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const previousRevenue = revenueData[revenueData.length - 2]?.revenue || 0;
  const growthRate = previousRevenue > 0 ? ((latestRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

  const addRevenueEntry = () => {
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

  const getAIInsight = () => {
    const growth = parseFloat(growthRate.toString());
    if (growth > 20) {
      return t.insightFast;
    } else if (growth > 0) {
      return t.insightSteady;
    } else if (growth < -10) {
      return t.insightDip;
    }
    return t.insightDefault;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600">
          {t.subtitle}
        </p>
      </div>

      {/* Revenue Chart */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              {t.revenueOverview}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                size="sm"
                variant="outline"
              >
                {chartType === 'line' ? t.barChart : t.lineChart}
              </Button>
              <Button
                onClick={addRevenueEntry}
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.addMonth}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={revenueData}>
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
                  <BarChart data={revenueData}>
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
                <span className="text-sm font-medium text-green-800">{t.latestMonth}</span>
              </div>
              <p className="text-xl font-bold text-green-900">
                ${latestRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">{t.growthRate}</span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {growthRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Entries */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
            {t.revenueEntries}
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
                          placeholder={t.revenueAmount}
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
                      placeholder={t.monthNotes}
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

      {/* AI Insights */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-1">{t.aiInsight}</h4>
              <p className="text-sm text-green-700">{getAIInsight()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenueSection;
