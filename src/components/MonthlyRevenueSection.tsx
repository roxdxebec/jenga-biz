
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, DollarSign, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface RevenueEntry {
  id: number;
  date: Date;
  amount: number;
  type: string;
  category: 'revenue';
}

interface ExpenseEntry {
  id: number;
  date: Date;
  amount: number;
  type: string;
  category: 'expense';
}

interface MonthlyRevenueSectionProps {
  strategyData?: any;
  language?: string;
  currency?: string;
  currencySymbol?: string;
  country?: string;
  onCountryChange?: (country: string) => void;
}

const MonthlyRevenueSection = ({ 
  strategyData, 
  language = 'en', 
  currency = 'KES', 
  currencySymbol = 'KSh',
  country = 'KE',
  onCountryChange
}: MonthlyRevenueSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [revenueAmount, setRevenueAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [revenueType, setRevenueType] = useState('cash');
  const [expenseType, setExpenseType] = useState('operational');
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);

  const currencyOptions = [
    { code: 'KE', currency: 'KES', symbol: 'KSh', name: 'Kenya Shilling' },
    { code: 'TZ', currency: 'TZS', symbol: 'TSh', name: 'Tanzania Shilling' },
    { code: 'UG', currency: 'UGX', symbol: 'USh', name: 'Uganda Shilling' },
    { code: 'RW', currency: 'RWF', symbol: 'RWF', name: 'Rwanda Franc' },
    { code: 'ET', currency: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    { code: 'GH', currency: 'GHS', symbol: '₵', name: 'Ghana Cedi' },
    { code: 'NG', currency: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'ZA', currency: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'EG', currency: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'MA', currency: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
    { code: 'US', currency: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GB', currency: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'FR', currency: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'DE', currency: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const translations = {
    en: {
      title: 'Financial Tracker',
      subtitle: 'Track your daily revenue and expenses',
      currency: 'Currency',
      selectDate: 'Select Date',
      revenue: 'Revenue',
      expenses: 'Expenses',
      amount: 'Amount',
      type: 'Type',
      addRevenue: 'Add Revenue',
      addExpense: 'Add Expense',
      revenueTypes: {
        cash: 'Cash',
        mobileMoney: 'Mobile Money',
        bankTransfer: 'Bank Transfer',
        card: 'Card Payment'
      },
      expenseTypes: {
        operational: 'Operational',
        inventory: 'Inventory',
        marketing: 'Marketing',
        utilities: 'Utilities'
      },
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      noEntries: 'No entries yet',
      deleteEntry: 'Delete'
    },
    sw: {
      title: 'Kufuatilia Fedha',
      subtitle: 'Fuatilia mapato na matumizi yako ya kila siku',
      currency: 'Sarafu',
      selectDate: 'Chagua Tarehe',
      revenue: 'Mapato',
      expenses: 'Matumizi',
      amount: 'Kiasi',
      type: 'Aina',
      addRevenue: 'Ongeza Mapato',
      addExpense: 'Ongeza Matumizi',
      revenueTypes: {
        cash: 'Pesa Taslimu',
        mobileMoney: 'Pesa za Simu',
        bankTransfer: 'Uhamishaji wa Benki',
        card: 'Malipo ya Kadi'
      },
      expenseTypes: {
        operational: 'Uendeshaji',
        inventory: 'Hesabu',
        marketing: 'Uuzaji',
        utilities: 'Huduma'
      },
      totalRevenue: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Matumizi',
      netProfit: 'Faida Safi',
      noEntries: 'Hakuna ingizo bado',
      deleteEntry: 'Futa'
    },
    ar: {
      title: 'متتبع الماليات',
      subtitle: 'تتبع الإيرادات والمصروفات اليومية',
      currency: 'العملة',
      selectDate: 'اختر التاريخ',
      revenue: 'الإيرادات',
      expenses: 'المصروفات',
      amount: 'المبلغ',
      type: 'النوع',
      addRevenue: 'إضافة إيراد',
      addExpense: 'إضافة مصروف',
      revenueTypes: {
        cash: 'نقداً',
        mobileMoney: 'الأموال المحمولة',
        bankTransfer: 'تحويل بنكي',
        card: 'دفع بالبطاقة'
      },
      expenseTypes: {
        operational: 'تشغيلي',
        inventory: 'المخزون',
        marketing: 'التسويق',
        utilities: 'المرافق'
      },
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      noEntries: 'لا توجد إدخالات بعد',
      deleteEntry: 'حذف'
    },
    fr: {
      title: 'Suivi Financier',
      subtitle: 'Suivez vos revenus et dépenses quotidiens',
      currency: 'Devise',
      selectDate: 'Sélectionner Date',
      revenue: 'Revenus',
      expenses: 'Dépenses',
      amount: 'Montant',
      type: 'Type',
      addRevenue: 'Ajouter Revenu',
      addExpense: 'Ajouter Dépense',
      revenueTypes: {
        cash: 'Espèces',
        mobileMoney: 'Argent Mobile',
        bankTransfer: 'Virement Bancaire',
        card: 'Paiement Carte'
      },
      expenseTypes: {
        operational: 'Opérationnel',
        inventory: 'Inventaire',
        marketing: 'Marketing',
        utilities: 'Services Publics'
      },
      totalRevenue: 'Revenus Totaux',
      totalExpenses: 'Dépenses Totales',
      netProfit: 'Bénéfice Net',
      noEntries: 'Aucune entrée encore',
      deleteEntry: 'Supprimer'
    }
  };

  const t = translations[language] || translations.en;

  const addRevenueEntry = () => {
    console.log('Adding revenue entry:', { amount: revenueAmount, date: selectedDate, type: revenueType });
    
    if (!revenueAmount || !selectedDate) {
      alert('Please enter an amount and select a date');
      return;
    }
    
    const amount = parseFloat(revenueAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const newEntry: RevenueEntry = {
      id: Date.now(),
      date: new Date(selectedDate),
      amount: amount,
      type: revenueType,
      category: 'revenue'
    };
    
    setRevenueEntries(prev => [...prev, newEntry]);
    setRevenueAmount('');
    console.log('Revenue entry added successfully:', newEntry);
  };

  const addExpenseEntry = () => {
    console.log('Adding expense entry:', { amount: expenseAmount, date: selectedDate, type: expenseType });
    
    if (!expenseAmount || !selectedDate) {
      alert('Please enter an amount and select a date');
      return;
    }
    
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const newEntry: ExpenseEntry = {
      id: Date.now(),
      date: new Date(selectedDate),
      amount: amount,
      type: expenseType,
      category: 'expense'
    };
    
    setExpenseEntries(prev => [...prev, newEntry]);
    setExpenseAmount('');
    console.log('Expense entry added successfully:', newEntry);
  };

  const deleteRevenueEntry = (id: number) => {
    setRevenueEntries(prev => prev.filter(entry => entry.id !== id));
    console.log('Revenue entry deleted:', id);
  };

  const deleteExpenseEntry = (id: number) => {
    setExpenseEntries(prev => prev.filter(entry => entry.id !== id));
    console.log('Expense entry deleted:', id);
  };

  const totalRevenue = revenueEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                {t.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>
            
            {onCountryChange && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">{t.currency}</Label>
                <Select value={country} onValueChange={onCountryChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.symbol} {option.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-64">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : t.selectDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  {t.revenue}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>{t.amount}</Label>
                  <Input
                    type="number"
                    value={revenueAmount}
                    onChange={(e) => setRevenueAmount(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>{t.type}</Label>
                  <Select value={revenueType} onValueChange={setRevenueType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">{t.revenueTypes.cash}</SelectItem>
                      <SelectItem value="mobileMoney">{t.revenueTypes.mobileMoney}</SelectItem>
                      <SelectItem value="bankTransfer">{t.revenueTypes.bankTransfer}</SelectItem>
                      <SelectItem value="card">{t.revenueTypes.card}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={addRevenueEntry} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  type="button"
                >
                  {t.addRevenue}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-lg text-red-800 flex items-center">
                  <Minus className="w-5 h-5 mr-2" />
                  {t.expenses}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>{t.amount}</Label>
                  <Input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label>{t.type}</Label>
                  <Select value={expenseType} onValueChange={setExpenseType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">{t.expenseTypes.operational}</SelectItem>
                      <SelectItem value="inventory">{t.expenseTypes.inventory}</SelectItem>
                      <SelectItem value="marketing">{t.expenseTypes.marketing}</SelectItem>
                      <SelectItem value="utilities">{t.expenseTypes.utilities}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={addExpenseEntry} 
                  className="w-full bg-red-600 hover:bg-red-700"
                  type="button"
                >
                  {t.addExpense}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-green-600">{t.totalRevenue}</p>
                <p className="text-2xl font-bold text-green-800">
                  {currencySymbol} {totalRevenue.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-red-600">{t.totalExpenses}</p>
                <p className="text-2xl font-bold text-red-800">
                  {currencySymbol} {totalExpenses.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card className={`border-blue-200 ${netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-blue-600">{t.netProfit}</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  {currencySymbol} {netProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {(revenueEntries.length > 0 || expenseEntries.length > 0) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Entries</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...revenueEntries, ...expenseEntries]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div key={entry.id} className={`p-3 rounded border ${
                      entry.category === 'revenue' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {entry.category === 'revenue' ? '+' : '-'}{currencySymbol} {entry.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">{entry.type}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500">
                            {format(new Date(entry.date), 'MMM dd, yyyy')}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => entry.category === 'revenue' ? deleteRevenueEntry(entry.id) : deleteExpenseEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {revenueEntries.length === 0 && expenseEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>{t.noEntries}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenueSection;
