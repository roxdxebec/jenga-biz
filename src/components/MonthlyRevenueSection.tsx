
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TrendingUp, Plus, DollarSign, Edit, Save, X, Download, TrendingDown, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import CoachingTip from '@/components/CoachingTip';
import { format } from 'date-fns';

interface FinancialEntry {
  id: string;
  date: Date;
  month: string;
  revenue: number;
  expenses: number;
  notes: string;
  incomeBreakdown: {
    mobileMoney: number;
    cash: number;
    bankTransfer: number;
    custom: Record<string, number>;
  };
  expenseBreakdown: {
    rent: number;
    transport: number;
    supplies: number;
    marketing: number;
    misc: number;
    custom: Record<string, number>;
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
  const [financialData, setFinancialData] = useState<FinancialEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newIncomeSource, setNewIncomeSource] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const { toast } = useToast();

  // Translation object
  const translations = {
    en: {
      title: 'Revenue & Expense Tracker',
      subtitle: 'Monitor your business growth and track profitability.',
      financialOverview: 'Financial Overview',
      addEntry: 'Add Entry',
      lineChart: 'Line Chart',
      barChart: 'Bar Chart',
      timePeriod: 'Time Period',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      netLoss: 'Net Loss',
      financialEntries: 'Financial Entries',
      revenueAmount: 'Revenue amount',
      expenseAmount: 'Expense amount',
      entryNotes: 'Add notes about this entry...',
      incomeBreakdown: 'Income Sources',
      expenseBreakdown: 'Expense Categories',
      mobileMoney: 'Mobile Money',
      cash: 'Cash',
      bankTransfer: 'Bank Transfer',
      rent: 'Rent',
      transport: 'Transport',
      supplies: 'Supplies',
      marketing: 'Marketing',
      misc: 'Miscellaneous',
      downloadPdf: 'Download Summary',
      selectDate: 'Select Date',
      addCustomIncome: 'Add Custom Income Source',
      addCustomExpense: 'Add Custom Expense Category',
      customSource: 'Custom Source',
      customCategory: 'Custom Category',
      tier3Note: 'Enjoy full access to Strategy Grid Pro (Tier 3 features) while testing.',
      coachingTip: 'Track every expense, no matter how small. Understanding your costs helps you make better pricing decisions and find areas to save money.'
    },
    sw: {
      title: 'Kufuatilia Mapato na Gharama',
      subtitle: 'Fuatilia ukuaji wa biashara yako na ufuatilikie faida.',
      financialOverview: 'Muhtasari wa Kifedha',
      addEntry: 'Ongeza Ingizo',
      lineChart: 'Chati ya Mstari',
      barChart: 'Chati ya Baa',
      timePeriod: 'Kipindi cha Muda',
      daily: 'Kila Siku',
      weekly: 'Kila Wiki',
      monthly: 'Kila Mwezi',
      quarterly: 'Kila Robo',
      totalRevenue: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Gharama',
      netProfit: 'Faida Halisi',
      netLoss: 'Hasara Halisi',
      financialEntries: 'Maingizo ya Kifedha',
      revenueAmount: 'Kiasi cha mapato',
      expenseAmount: 'Kiasi cha gharama',
      entryNotes: 'Ongeza maelezo kuhusu ingizo hili...',
      incomeBreakdown: 'Vyanzo vya Mapato',
      expenseBreakdown: 'Makundi ya Gharama',
      mobileMoney: 'Pesa za Simu',
      cash: 'Fedha Taslimu',
      bankTransfer: 'Uhamisho wa Benki',
      rent: 'Kodi',
      transport: 'Usafiri',
      supplies: 'Vifaa',
      marketing: 'Uuzaji',
      misc: 'Mengineyo',
      downloadPdf: 'Pakua Muhtasari',
      selectDate: 'Chagua Tarehe',
      addCustomIncome: 'Ongeza Chanzo cha Mapato',
      addCustomExpense: 'Ongeza Kundi la Gharama',
      customSource: 'Chanzo cha Kawaida',
      customCategory: 'Kundi la Kawaida',
      tier3Note: 'Furahia ufikiaji kamili wa Strategy Grid Pro (vipengele vya Daraja la 3) wakati wa upimaji.',
      coachingTip: 'Fuatilia kila gharama, haijalishi ni ndogo kiasi gani. Kuelewa gharama zako kunakusaidia kufanya maamuzi bora ya bei na kupata maeneo ya kuokoa pesa.'
    },
    ar: {
      title: 'متتبع الإيرادات والمصروفات',
      subtitle: 'راقب نمو أعمالك وتتبع الربحية.',
      financialOverview: 'نظرة عامة مالية',
      addEntry: 'إضافة إدخال',
      lineChart: 'مخطط خطي',
      barChart: 'مخطط بياني',
      timePeriod: 'الفترة الزمنية',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      netLoss: 'صافي الخسارة',
      financialEntries: 'الإدخالات المالية',
      revenueAmount: 'مبلغ الإيرادات',
      expenseAmount: 'مبلغ المصروفات',
      entryNotes: 'أضف ملاحظات حول هذا الإدخال...',
      incomeBreakdown: 'مصادر الدخل',
      expenseBreakdown: 'فئات المصروفات',
      mobileMoney: 'أموال الهاتف المحمول',
      cash: 'نقداً',
      bankTransfer: 'تحويل بنكي',
      rent: 'إيجار',
      transport: 'نقل',
      supplies: 'إمدادات',
      marketing: 'تسويق',
      misc: 'متفرقات',
      downloadPdf: 'تحميل الملخص',
      selectDate: 'اختر التاريخ',
      addCustomIncome: 'إضافة مصدر دخل مخصص',
      addCustomExpense: 'إضافة فئة مصروفات مخصصة',
      customSource: 'مصدر مخصص',
      customCategory: 'فئة مخصصة',
      tier3Note: 'استمتع بالوصول الكامل إلى Strategy Grid Pro (ميزات المستوى 3) أثناء الاختبار.',
      coachingTip: 'تتبع كل مصروف مهما كان صغيراً. فهم تكاليفك يساعدك على اتخاذ قرارات تسعير أفضل وإيجاد مجالات لتوفير المال.'
    },
    fr: {
      title: 'Suivi des Revenus et Dépenses',
      subtitle: 'Surveillez la croissance de votre entreprise et suivez la rentabilité.',
      financialOverview: 'Aperçu Financier',
      addEntry: 'Ajouter Entrée',
      lineChart: 'Graphique Linéaire',
      barChart: 'Graphique en Barres',
      timePeriod: 'Période',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      totalRevenue: 'Revenus Totaux',
      totalExpenses: 'Dépenses Totales',
      netProfit: 'Bénéfice Net',
      netLoss: 'Perte Nette',
      financialEntries: 'Entrées Financières',
      revenueAmount: 'Montant des revenus',
      expenseAmount: 'Montant des dépenses',
      entryNotes: 'Ajoutez des notes sur cette entrée...',
      incomeBreakdown: 'Sources de Revenus',
      expenseBreakdown: 'Catégories de Dépenses',
      mobileMoney: 'Argent Mobile',
      cash: 'Espèces',
      bankTransfer: 'Virement Bancaire',
      rent: 'Loyer',
      transport: 'Transport',
      supplies: 'Fournitures',
      marketing: 'Marketing',
      misc: 'Divers',
      downloadPdf: 'Télécharger Résumé',
      selectDate: 'Sélectionner Date',
      addCustomIncome: 'Ajouter Source Revenus',
      addCustomExpense: 'Ajouter Catégorie Dépenses',
      customSource: 'Source Personnalisée',
      customCategory: 'Catégorie Personnalisée',
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
    const newEntry: FinancialEntry = {
      id: Date.now().toString(),
      date: selectedDate || new Date(),
      month: format(selectedDate || new Date(), 'MMM yyyy'),
      revenue: 0,
      expenses: 0,
      notes: '',
      incomeBreakdown: { mobileMoney: 0, cash: 0, bankTransfer: 0, custom: {} },
      expenseBreakdown: { rent: 0, transport: 0, supplies: 0, marketing: 0, misc: 0, custom: {} }
    };

    setFinancialData([...financialData, newEntry]);
    setEditingEntry(newEntry.id);
  };

  const updateFinancialEntry = (id: string, field: keyof FinancialEntry, value: any) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const calculateTotal = (breakdown: any): number => {
    return Object.values(breakdown).reduce((sum: number, val: any) => {
      if (typeof val === 'object' && val !== null) {
        return sum + Object.values(val).reduce((s: number, v: any) => s + (typeof v === 'number' ? v : 0), 0);
      }
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  };

  const updateIncomeBreakdown = (id: string, category: string, value: number) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? { 
        ...entry, 
        incomeBreakdown: { ...entry.incomeBreakdown, [category]: value },
        revenue: calculateTotal({ ...entry.incomeBreakdown, [category]: value })
      } : entry
    ));
  };

  const updateExpenseBreakdown = (id: string, category: string, value: number) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? { 
        ...entry, 
        expenseBreakdown: { ...entry.expenseBreakdown, [category]: value },
        expenses: calculateTotal({ ...entry.expenseBreakdown, [category]: value })
      } : entry
    ));
  };

  const updateCustomIncomeBreakdown = (id: string, customCategory: string, value: number) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? {
        ...entry,
        incomeBreakdown: {
          ...entry.incomeBreakdown,
          custom: { ...entry.incomeBreakdown.custom, [customCategory]: value }
        },
        revenue: calculateTotal({
          ...entry.incomeBreakdown,
          custom: { ...entry.incomeBreakdown.custom, [customCategory]: value }
        })
      } : entry
    ));
  };

  const updateCustomExpenseBreakdown = (id: string, customCategory: string, value: number) => {
    setFinancialData(financialData.map(entry => 
      entry.id === id ? {
        ...entry,
        expenseBreakdown: {
          ...entry.expenseBreakdown,
          custom: { ...entry.expenseBreakdown.custom, [customCategory]: value }
        },
        expenses: calculateTotal({
          ...entry.expenseBreakdown,
          custom: { ...entry.expenseBreakdown.custom, [customCategory]: value }
        })
      } : entry
    ));
  };

  const addCustomIncomeSource = (entryId: string) => {
    if (!newIncomeSource.trim()) return;
    
    setFinancialData(financialData.map(entry => 
      entry.id === entryId ? {
        ...entry,
        incomeBreakdown: {
          ...entry.incomeBreakdown,
          custom: { ...entry.incomeBreakdown.custom, [newIncomeSource]: 0 }
        }
      } : entry
    ));
    setNewIncomeSource('');
  };

  const addCustomExpenseCategory = (entryId: string) => {
    if (!newExpenseCategory.trim()) return;
    
    setFinancialData(financialData.map(entry => 
      entry.id === entryId ? {
        ...entry,
        expenseBreakdown: {
          ...entry.expenseBreakdown,
          custom: { ...entry.expenseBreakdown.custom, [newExpenseCategory]: 0 }
        }
      } : entry
    ));
    setNewExpenseCategory('');
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
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
              {t.financialEntries}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {t.selectDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={addFinancialEntry}
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-300 hover:bg-orange-50 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" />
                {t.addEntry}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No financial entries yet. Click "Add Entry" to get started!</p>
              </div>
            ) : (
              financialData.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700">{format(entry.date, 'PPP')}</span>
                      <p className="text-sm text-gray-500">{entry.month}</p>
                    </div>
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
                      <p className="text-lg font-semibold text-green-600">
                        {currencySymbol}{entry.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">{t.totalExpenses}</label>
                      <p className="text-lg font-semibold text-red-600">
                        {currencySymbol}{entry.expenses.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {editingEntry === entry.id && (
                    <div className="space-y-4">
                      {/* Income Breakdown */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{t.incomeBreakdown}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(entry.incomeBreakdown).map(([category, amount]) => {
                            if (category === 'custom') {
                              return Object.entries(amount as Record<string, number>).map(([customCat, customAmount]) => (
                                <div key={`income-${customCat}`}>
                                  <label className="text-xs text-gray-500 capitalize">{customCat}</label>
                                  <Input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => updateCustomIncomeBreakdown(entry.id, customCat, Number(e.target.value) || 0)}
                                    size="sm"
                                  />
                                </div>
                              ));
                            }
                            return (
                              <div key={`income-${category}`}>
                                <label className="text-xs text-gray-500 capitalize">
                                  {t[category] || category}
                                </label>
                                <Input
                                  type="number"
                                  value={amount as number}
                                  onChange={(e) => updateIncomeBreakdown(entry.id, category, Number(e.target.value) || 0)}
                                  size="sm"
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder={t.customSource}
                            value={newIncomeSource}
                            onChange={(e) => setNewIncomeSource(e.target.value)}
                            size="sm"
                          />
                          <Button size="sm" onClick={() => addCustomIncomeSource(entry.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Expense Breakdown */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{t.expenseBreakdown}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(entry.expenseBreakdown).map(([category, amount]) => {
                            if (category === 'custom') {
                              return Object.entries(amount as Record<string, number>).map(([customCat, customAmount]) => (
                                <div key={`expense-${customCat}`}>
                                  <label className="text-xs text-gray-500 capitalize">{customCat}</label>
                                  <Input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => updateCustomExpenseBreakdown(entry.id, customCat, Number(e.target.value) || 0)}
                                    size="sm"
                                  />
                                </div>
                              ));
                            }
                            return (
                              <div key={`expense-${category}`}>
                                <label className="text-xs text-gray-500 capitalize">
                                  {t[category] || category}
                                </label>
                                <Input
                                  type="number"
                                  value={amount as number}
                                  onChange={(e) => updateExpenseBreakdown(entry.id, category, Number(e.target.value) || 0)}
                                  size="sm"
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder={t.customCategory}
                            value={newExpenseCategory}
                            onChange={(e) => setNewExpenseCategory(e.target.value)}
                            size="sm"
                          />
                          <Button size="sm" onClick={() => addCustomExpenseCategory(entry.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
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
                      placeholder={t.entryNotes}
                      rows={2}
                    />
                  ) : (
                    entry.notes && (
                      <p className="text-sm text-gray-600">{entry.notes}</p>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Chart */}
      {financialData.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                {t.financialOverview}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Select value={timePeriod} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly') => setTimePeriod(value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t.daily}</SelectItem>
                    <SelectItem value="weekly">{t.weekly}</SelectItem>
                    <SelectItem value="monthly">{t.monthly}</SelectItem>
                    <SelectItem value="quarterly">{t.quarterly}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {chartType === 'line' ? t.barChart : t.lineChart}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chart and summary content */}
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
              <Button onClick={downloadPDF} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                {t.downloadPdf}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonthlyRevenueSection;
