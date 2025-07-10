
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Plus, DollarSign, Edit, Save, X, Download, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import CoachingTip from '@/components/CoachingTip';

interface FinancialEntry {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  notes: string;
  expenseBreakdown: {
    rent: number;
    transport: number;
    supplies: number;
    marketing: number;
    other: number;
  };
}

interface MonthlyRevenueSectionProps {
  isPro?: boolean;
  strategyData?: any;
  language?: string;
  currency?: string;
  currencySymbol?: string;
}

const MonthlyRevenueSection = ({ 
  isPro = true, 
  strategyData = null, 
  language = 'en',
  currency = 'USD',
  currencySymbol = '$'
}: MonthlyRevenueSectionProps) => {
  const [financialData, setFinancialData] = useState<FinancialEntry[]>([
    {
      id: '1',
      month: 'Jan 2024',
      revenue: 5000,
      expenses: 2000,
      notes: 'Launch month - better than expected!',
      expenseBreakdown: { rent: 800, transport: 200, supplies: 500, marketing: 300, other: 200 }
    },
    {
      id: '2',
      month: 'Feb 2024',
      revenue: 7500,
      expenses: 2500,
      notes: 'Added new marketing channels',
      expenseBreakdown: { rent: 800, transport: 250, supplies: 600, marketing: 500, other: 350 }
    },
    {
      id: '3',
      month: 'Mar 2024',
      revenue: 12000,
      expenses: 3500,
      notes: 'First profitable month',
      expenseBreakdown: { rent: 800, transport: 300, supplies: 800, marketing: 800, other: 800 }
    }
  ]);

  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const { toast } = useToast();

  // Translation object
  const translations = {
    en: {
      title: 'Business Revenue & Expense Summary',
      subtitle: 'Monitor your business growth and track profitability.',
      financialOverview: 'Financial Overview',
      addMonth: 'Add Month',
      lineChart: 'Line Chart',
      barChart: 'Bar Chart',
      timePeriod: 'Time Period',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      netLoss: 'Net Loss',
      financialEntries: 'Financial Entries',
      revenueAmount: 'Revenue amount',
      expenseAmount: 'Expense amount',
      monthNotes: 'Add notes about this month...',
      expenseBreakdown: 'Expense Breakdown',
      rent: 'Rent',
      transport: 'Transport',
      supplies: 'Supplies',
      marketing: 'Marketing',
      other: 'Other',
      downloadPdf: 'Download My Revenue & Expense Summary (PDF)',
      tier3Note: 'Enjoy full access to Strategy Grid Pro (Tier 3 features) while testing.',
      coachingTip: 'Track every expense, no matter how small. Understanding your costs helps you make better pricing decisions and find areas to save money.'
    },
    sw: {
      title: 'Muhtasari wa Mapato na Gharama za Biashara',
      subtitle: 'Fuatilia ukuaji wa biashara yako na ufuatilie faida.',
      financialOverview: 'Muhtasari wa Kifedha',
      addMonth: 'Ongeza Mwezi',
      lineChart: 'Chati ya Mstari',
      barChart: 'Chati ya Baa',
      timePeriod: 'Kipindi cha Muda',
      monthly: 'Kila Mwezi',
      quarterly: 'Kila Robo',
      yearly: 'Kila Mwaka',
      totalRevenue: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Gharama',
      netProfit: 'Faida Halisi',
      netLoss: 'Hasara Halisi',
      financialEntries: 'Maingizo ya Kifedha',
      revenueAmount: 'Kiasi cha mapato',
      expenseAmount: 'Kiasi cha gharama',
      monthNotes: 'Ongeza maelezo kuhusu mwezi huu...',
      expenseBreakdown: 'Mgawanyiko wa Gharama',
      rent: 'Kodi',
      transport: 'Usafiri',
      supplies: 'Vifaa',
      marketing: 'Uuzaji',
      other: 'Mengineyo',
      downloadPdf: 'Pakua Muhtasari Wangu wa Mapato na Gharama (PDF)',
      tier3Note: 'Furahia ufikiaji kamili wa Strategy Grid Pro (vipengele vya Daraja la 3) wakati wa upimaji.',
      coachingTip: 'Fuatilia kila gharama, haijalishi ni ndogo kiasi gani. Kuelewa gharama zako kunakusaidia kufanya maamuzi bora ya bei na kupata maeneo ya kuokoa pesa.'
    },
    ar: {
      title: 'ملخص إيرادات ومصروفات الأعمال',
      subtitle: 'راقب نمو أعمالك وتتبع الربحية.',
      financialOverview: 'نظرة عامة مالية',
      addMonth: 'إضافة شهر',
      lineChart: 'مخطط خطي',
      barChart: 'مخطط بياني',
      timePeriod: 'الفترة الزمنية',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      yearly: 'سنوي',
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      netLoss: 'صافي الخسارة',
      financialEntries: 'الإدخالات المالية',
      revenueAmount: 'مبلغ الإيرادات',
      expenseAmount: 'مبلغ المصروفات',
      monthNotes: 'أضف ملاحظات حول هذا الشهر...',
      expenseBreakdown: 'تفصيل المصروفات',
      rent: 'إيجار',
      transport: 'نقل',
      supplies: 'إمدادات',
      marketing: 'تسويق',
      other: 'أخرى',
      downloadPdf: 'تحميل ملخص الإيرادات والمصروفات (PDF)',
      tier3Note: 'استمتع بالوصول الكامل إلى Strategy Grid Pro (ميزات المستوى 3) أثناء الاختبار.',
      coachingTip: 'تتبع كل مصروف مهما كان صغيراً. فهم تكاليفك يساعدك على اتخاذ قرارات تسعير أفضل وإيجاد مجالات لتوفير المال.'
    },
    fr: {
      title: 'Résumé des Revenus et Dépenses d\'Affaires',
      subtitle: 'Surveillez la croissance de votre entreprise et suivez la rentabilité.',
      financialOverview: 'Aperçu Financier',
      addMonth: 'Ajouter un Mois',
      lineChart: 'Graphique Linéaire',
      barChart: 'Graphique en Barres',
      timePeriod: 'Période',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
      totalRevenue: 'Revenus Totaux',
      totalExpenses: 'Dépenses Totales',
      netProfit: 'Bénéfice Net',
      netLoss: 'Perte Nette',
      financialEntries: 'Entrées Financières',
      revenueAmount: 'Montant des revenus',
      expenseAmount: 'Montant des dépenses',
      monthNotes: 'Ajoutez des notes sur ce mois...',
      expenseBreakdown: 'Répartition des Dépenses',
      rent: 'Loyer',
      transport: 'Transport',
      supplies: 'Fournitures',
      marketing: 'Marketing',
      other: 'Autres',
      downloadPdf: 'Télécharger Mon Résumé de Revenus et Dépenses (PDF)',
      tier3Note: 'Profitez d\'un accès complet à Strategy Grid Pro (fonctionnalités de niveau 3) pendant les tests.',
      coachingTip: 'Suivez chaque dépense, peu importe sa taille. Comprendre vos coûts vous aide à prendre de meilleures décisions de prix et à trouver des domaines pour économiser de l\'argent.'
    }
  };

  const t = translations[language] || translations.en;

  const chartData = financialData.map(entry => ({
    ...entry,
    profit: entry.revenue - entry.expenses
  }));

  const totalRevenue = financialData.reduce((sum, entry) => sum + entry.revenue, 0);
  const totalExpenses = financialData.reduce((sum, entry) => sum + entry.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--destructive))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--success))",
    },
  };

  const addFinancialEntry = () => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const newEntry: FinancialEntry = {
      id: Date.now().toString(),
      month: currentMonth,
      revenue: 0,
      expenses: 0,
      notes: '',
      expenseBreakdown: { rent: 0, transport: 0, supplies: 0, marketing: 0, other: 0 }
    };

    setFinancialData([...financialData, newEntry]);
    setEditingEntry(newEntry.id);
  };

  const updateFinancialEntry = (id: string, field: keyof FinancialEntry, value: any) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const updateExpenseBreakdown = (id: string, category: string, value: number) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? { 
        ...entry, 
        expenseBreakdown: { ...entry.expenseBreakdown, [category]: value },
        expenses: Object.values({ ...entry.expenseBreakdown, [category]: value }).reduce((sum, val) => sum + val, 0)
      } : entry
    ));
  };

  const downloadPDF = () => {
    toast({
      title: t.downloadPdf,
      description: "PDF download feature coming soon!"
    });
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

      {/* Tier 3 Note */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800 text-center">
          {t.tier3Note}
        </p>
      </div>

      {/* Coaching Tip */}
      <CoachingTip tip={t.coachingTip} language={language} />

      {/* Financial Entries */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
              {t.financialEntries}
            </div>
            <Button
              onClick={addFinancialEntry}
              size="sm"
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t.addMonth}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{entry.month}</span>
                  <Button
                    onClick={() => setEditingEntry(editingEntry === entry.id ? null : entry.id)}
                    size="sm"
                    variant="ghost"
                  >
                    {editingEntry === entry.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">{t.totalRevenue}</label>
                    {editingEntry === entry.id ? (
                      <Input
                        type="number"
                        value={entry.revenue}
                        onChange={(e) => updateFinancialEntry(entry.id, 'revenue', parseInt(e.target.value) || 0)}
                        placeholder={t.revenueAmount}
                      />
                    ) : (
                      <p className="text-lg font-semibold text-green-600">
                        {currencySymbol}{entry.revenue.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">{t.totalExpenses}</label>
                    <p className="text-lg font-semibold text-red-600">
                      {currencySymbol}{entry.expenses.toLocaleString()}
                    </p>
                  </div>
                </div>

                {editingEntry === entry.id && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">{t.expenseBreakdown}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(entry.expenseBreakdown).map(([category, amount]) => (
                        <div key={category}>
                          <label className="text-xs text-gray-500 capitalize">
                            {t[category] || category}
                          </label>
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => updateExpenseBreakdown(entry.id, category, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {entry.revenue - entry.expenses >= 0 ? t.netProfit : t.netLoss}
                  </label>
                  <p className={`text-lg font-semibold ${entry.revenue - entry.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currencySymbol}{Math.abs(entry.revenue - entry.expenses).toLocaleString()}
                  </p>
                </div>

                {editingEntry === entry.id ? (
                  <Textarea
                    value={entry.notes}
                    onChange={(e) => updateFinancialEntry(entry.id, 'notes', e.target.value)}
                    placeholder={t.monthNotes}
                    rows={2}
                  />
                ) : (
                  entry.notes && (
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                  )
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Chart */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              {t.financialOverview}
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timePeriod} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setTimePeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t.monthly}</SelectItem>
                  <SelectItem value="quarterly">{t.quarterly}</SelectItem>
                  <SelectItem value="yearly">{t.yearly}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                size="sm"
                variant="outline"
              >
                {chartType === 'line' ? t.barChart : t.lineChart}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full mb-4">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}
                      tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={3} />
                    <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={3} />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12}
                      tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">{t.totalRevenue}</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {currencySymbol}{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-800">{t.totalExpenses}</span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {currencySymbol}{totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <div className="flex items-center">
                <DollarSign className={`w-5 h-5 mr-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                <span className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  {netProfit >= 0 ? t.netProfit : t.netLoss}
                </span>
              </div>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                {currencySymbol}{Math.abs(netProfit).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Download PDF Button */}
          <div className="mt-6 text-center">
            <Button onClick={downloadPDF} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              {t.downloadPdf}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenueSection;
