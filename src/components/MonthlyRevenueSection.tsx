
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, CalendarIcon, Download, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RevenueEntry {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'cash' | 'mobile_money' | 'bank_transfer' | 'card';
}

interface ExpenseEntry {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

interface MonthlyRevenueSectionProps {
  strategyData: any;
  language?: string;
  currency?: string;
  currencySymbol?: string;
}

const MonthlyRevenueSection = ({ strategyData, language = 'en', currency = 'KES', currencySymbol = 'KSh' }: MonthlyRevenueSectionProps) => {
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState(currencySymbol);

  // Currency mapping for African countries + USD
  const currencyMap = {
    'KE': { currency: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    'TZ': { currency: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
    'UG': { currency: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    'RW': { currency: 'RWF', symbol: 'RWF', name: 'Rwandan Franc' },
    'ET': { currency: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    'GH': { currency: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
    'NG': { currency: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    'ZA': { currency: 'ZAR', symbol: 'R', name: 'South African Rand' },
    'EG': { currency: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    'MA': { currency: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
    'DZ': { currency: 'DZD', symbol: 'DA', name: 'Algerian Dinar' },
    'TN': { currency: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
    'LY': { currency: 'LYD', symbol: 'LD', name: 'Libyan Dinar' },
    'SD': { currency: 'SDG', symbol: 'SDG', name: 'Sudanese Pound' },
    'SS': { currency: 'SSP', symbol: 'SSP', name: 'South Sudanese Pound' },
    'ER': { currency: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
    'DJ': { currency: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
    'SO': { currency: 'SOS', symbol: 'Sh', name: 'Somali Shilling' },
    'CF': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'TD': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'CM': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'GQ': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'GA': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'CG': { currency: 'XAF', symbol: 'CFA', name: 'Central African CFA Franc' },
    'SN': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'ML': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'BF': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'NE': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'CI': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'GN': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'TG': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'BJ': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'MW': { currency: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
    'ZM': { currency: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
    'ZW': { currency: 'ZWL', symbol: 'Z$', name: 'Zimbabwean Dollar' },
    'BW': { currency: 'BWP', symbol: 'P', name: 'Botswanan Pula' },
    'NA': { currency: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
    'SZ': { currency: 'SZL', symbol: 'E', name: 'Swazi Lilangeni' },
    'LS': { currency: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
    'MG': { currency: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
    'MU': { currency: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
    'SC': { currency: 'SCR', symbol: '₨', name: 'Seychellois Rupee' },
    'KM': { currency: 'KMF', symbol: 'CF', name: 'Comorian Franc' },
    'MZ': { currency: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
    'AO': { currency: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
    'CV': { currency: 'CVE', symbol: '$', name: 'Cape Verdean Escudo' },
    'ST': { currency: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra' },
    'GW': { currency: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    'SL': { currency: 'SLE', symbol: 'Le', name: 'Sierra Leonean Leone' },
    'LR': { currency: 'LRD', symbol: 'L$', name: 'Liberian Dollar' },
    'GM': { currency: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
    'US': { currency: 'USD', symbol: '$', name: 'US Dollar' }
  };

  const translations = {
    en: {
      title: 'Financial Tracker',
      revenue: 'Revenue',
      expenses: 'Expenses',
      profit: 'Profit/Loss',
      addRevenue: 'Add Revenue',
      addExpense: 'Add Expense',
      date: 'Date',
      amount: 'Amount',
      category: 'Category',
      description: 'Description',
      type: 'Payment Type',
      cash: 'Cash',
      mobileMoney: 'Mobile Money',
      bankTransfer: 'Bank Transfer',
      card: 'Card Payment',
      currency: 'Currency',
      downloadSummary: 'Download Summary',
      selectDate: 'Select date',
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit'
    },
    sw: {
      title: 'Kiwango cha Fedha',
      revenue: 'Mapato',
      expenses: 'Matumizi',
      profit: 'Faida/Hasara',
      addRevenue: 'Ongeza Mapato',
      addExpense: 'Ongeza Matumizi',
      date: 'Tarehe',
      amount: 'Kiasi',
      category: 'Kategoria',
      description: 'Maelezo',
      type: 'Aina ya Malipo',
      cash: 'Pesa Taslimu',
      mobileMoney: 'Pesa za Simu',
      bankTransfer: 'Uhamisho wa Benki',
      card: 'Malipo ya Kadi',
      currency: 'Sarafu',
      downloadSummary: 'Pakua Muhtasari',
      selectDate: 'Chagua tarehe',
      totalRevenue: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Matumizi',
      netProfit: 'Faida Halisi'
    },
    ar: {
      title: 'متتبع الشؤون المالية',
      revenue: 'الإيرادات',
      expenses: 'المصروفات',
      profit: 'الربح/الخسارة',
      addRevenue: 'إضافة إيرادات',
      addExpense: 'إضافة مصروفات',
      date: 'التاريخ',
      amount: 'المبلغ',
      category: 'الفئة',
      description: 'الوصف',
      type: 'نوع الدفع',
      cash: 'نقداً',
      mobileMoney: 'الأموال المحمولة',
      bankTransfer: 'تحويل بنكي',
      card: 'دفع بالبطاقة',
      currency: 'العملة',
      downloadSummary: 'تحميل الملخص',
      selectDate: 'اختر التاريخ',
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح'
    },
    fr: {
      title: 'Suivi Financier',
      revenue: 'Revenus',
      expenses: 'Dépenses',
      profit: 'Profit/Perte',
      addRevenue: 'Ajouter Revenus',
      addExpense: 'Ajouter Dépense',
      date: 'Date',
      amount: 'Montant',
      category: 'Catégorie',
      description: 'Description',
      type: 'Type de Paiement',
      cash: 'Espèces',
      mobileMoney: 'Argent Mobile',
      bankTransfer: 'Virement Bancaire',
      card: 'Paiement par Carte',
      currency: 'Devise',
      downloadSummary: 'Télécharger Résumé',
      selectDate: 'Sélectionner date',
      totalRevenue: 'Total des Revenus',
      totalExpenses: 'Total des Dépenses',
      netProfit: 'Bénéfice Net'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  // Calculate totals with proper type safety
  const totalRevenue = revenueEntries.reduce((sum, entry) => {
    const amount = typeof entry.amount === 'number' ? entry.amount : 0;
    return sum + amount;
  }, 0);

  const totalExpenses = expenseEntries.reduce((sum, entry) => {
    const amount = typeof entry.amount === 'number' ? entry.amount : 0;
    return sum + amount;
  }, 0);

  const netProfit = totalRevenue - totalExpenses;

  const handleCurrencyChange = (countryCode: string) => {
    const currencyInfo = currencyMap[countryCode as keyof typeof currencyMap];
    if (currencyInfo) {
      setSelectedCurrency(currencyInfo.currency);
      setSelectedCurrencySymbol(currencyInfo.symbol);
    }
  };

  const addRevenueEntry = () => {
    const newEntry: RevenueEntry = {
      id: Date.now().toString(),
      date: new Date(),
      amount: 0,
      category: '',
      description: '',
      type: 'cash'
    };
    setRevenueEntries([...revenueEntries, newEntry]);
  };

  const addExpenseEntry = () => {
    const newEntry: ExpenseEntry = {
      id: Date.now().toString(),
      date: new Date(),
      amount: 0,
      category: '',
      description: ''
    };
    setExpenseEntries([...expenseEntries, newEntry]);
  };

  const updateRevenueEntry = (id: string, field: keyof RevenueEntry, value: any) => {
    setRevenueEntries(revenueEntries.map(entry => 
      entry.id === id ? { 
        ...entry, 
        [field]: field === 'amount' ? (typeof value === 'string' ? parseFloat(value) || 0 : value) : value 
      } : entry
    ));
  };

  const updateExpenseEntry = (id: string, field: keyof ExpenseEntry, value: any) => {
    setExpenseEntries(expenseEntries.map(entry => 
      entry.id === id ? { 
        ...entry, 
        [field]: field === 'amount' ? (typeof value === 'string' ? parseFloat(value) || 0 : value) : value 
      } : entry
    ));
  };

  const deleteRevenueEntry = (id: string) => {
    setRevenueEntries(revenueEntries.filter(entry => entry.id !== id));
  };

  const deleteExpenseEntry = (id: string) => {
    setExpenseEntries(expenseEntries.filter(entry => entry.id !== id));
  };

  const handleDownloadSummary = () => {
    console.log('Downloading financial summary...');
    // PDF generation would be implemented here
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          {t.title}
        </CardTitle>
        
        {/* Currency Selector inside the Financial Tracker */}
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-sm font-medium">{t.currency}:</span>
          <Select value={Object.keys(currencyMap).find(key => currencyMap[key as keyof typeof currencyMap].currency === selectedCurrency)} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
              {Object.entries(currencyMap).map(([code, info]) => (
                <SelectItem key={code} value={code}>
                  {info.symbol} - {info.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800">{t.totalRevenue}</h3>
            <p className="text-2xl font-bold text-green-600">
              {selectedCurrencySymbol}{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800">{t.totalExpenses}</h3>
            <p className="text-2xl font-bold text-red-600">
              {selectedCurrencySymbol}{totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${netProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className={`font-semibold ${netProfit >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
              {t.netProfit}
            </h3>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {selectedCurrencySymbol}{netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{t.revenue}</h3>
            <Button onClick={addRevenueEntry} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t.addRevenue}
            </Button>
          </div>
          
          {revenueEntries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="text-sm font-medium">{t.date}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !entry.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {entry.date ? format(entry.date, "PPP") : <span>{t.selectDate}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={entry.date}
                      onSelect={(date) => date && updateRevenueEntry(entry.id, 'date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.amount}</label>
                <Input
                  type="number"
                  value={entry.amount || ''}
                  onChange={(e) => updateRevenueEntry(entry.id, 'amount', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.category}</label>
                <Input
                  value={entry.category}
                  onChange={(e) => updateRevenueEntry(entry.id, 'category', e.target.value)}
                  placeholder="Sales, Services..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.description}</label>
                <Input
                  value={entry.description}
                  onChange={(e) => updateRevenueEntry(entry.id, 'description', e.target.value)}
                  placeholder="Description..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.type}</label>
                <Select value={entry.type} onValueChange={(value) => updateRevenueEntry(entry.id, 'type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cash">{t.cash}</SelectItem>
                    <SelectItem value="mobile_money">{t.mobileMoney}</SelectItem>
                    <SelectItem value="bank_transfer">{t.bankTransfer}</SelectItem>
                    <SelectItem value="card">{t.card}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteRevenueEntry(entry.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Expense Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{t.expenses}</h3>
            <Button onClick={addExpenseEntry} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              {t.addExpense}
            </Button>
          </div>
          
          {expenseEntries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="text-sm font-medium">{t.date}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !entry.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {entry.date ? format(entry.date, "PPP") : <span>{t.selectDate}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={entry.date}
                      onSelect={(date) => date && updateExpenseEntry(entry.id, 'date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.amount}</label>
                <Input
                  type="number"
                  value={entry.amount || ''}
                  onChange={(e) => updateExpenseEntry(entry.id, 'amount', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.category}</label>
                <Input
                  value={entry.category}
                  onChange={(e) => updateExpenseEntry(entry.id, 'category', e.target.value)}
                  placeholder="Rent, Supplies..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">{t.description}</label>
                <Input
                  value={entry.description}
                  onChange={(e) => updateExpenseEntry(entry.id, 'description', e.target.value)}
                  placeholder="Description..."
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteExpenseEntry(entry.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Download Summary Button */}
        <div className="flex justify-center pt-4">
          <Button onClick={handleDownloadSummary} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            {t.downloadSummary}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenueSection;
