import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, DollarSign, Trash2, Camera, Upload, Download, Share, Bot } from 'lucide-react';
import { format } from 'date-fns';
import Tesseract from 'tesseract.js';
import ShareModal from '@/components/ShareModal';

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
  const [customRevenueType, setCustomRevenueType] = useState('');
  const [customExpenseType, setCustomExpenseType] = useState('');
  const [revenueEntries, setRevenueEntries] = useState<RevenueEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [timePeriod, setTimePeriod] = useState('daily');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
      addRevenue: 'Record New Payment',
      addExpense: 'Record New Expense',
      scanReceipt: 'Scan Receipt',
      revenueTypes: {
        cash: 'Cash',
        mobileMoney: 'Mobile Money',
        bankTransfer: 'Bank Transfer',
        card: 'Card Payment',
        crypto: 'Cryptocurrency',
        other: 'Other'
      },
      expenseTypes: {
        operational: 'Operational',
        inventory: 'Inventory',
        marketing: 'Marketing',
        utilities: 'Utilities',
        other: 'Other'
      },
      totalRevenue: 'Total Revenue',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      noEntries: 'No entries yet',
      deleteEntry: 'Delete',
      recentEntries: 'Recent Entries',
      timePeriod: 'Time Period',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annual: 'Annual',
      custom: 'Custom Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      financialSummary: 'Financial Summary',
      aiSummary: 'AI Summary',
      downloadSummary: 'Download Summary',
      shareFinancials: 'Share Financials'
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
      addRevenue: 'Rekodi Malipo Mapya',
      addExpense: 'Rekodi Matumizi Mapya',
      scanReceipt: 'Changanua Risiti',
      revenueTypes: {
        cash: 'Pesa Taslimu',
        mobileMoney: 'Pesa za Simu',
        bankTransfer: 'Uhamishaji wa Benki',
        card: 'Malipo ya Kadi',
        crypto: 'Sarafu za Kidijiti',
        other: 'Nyingine'
      },
      expenseTypes: {
        operational: 'Uendeshaji',
        inventory: 'Hesabu',
        marketing: 'Uuzaji',
        utilities: 'Huduma',
        other: 'Nyingine'
      },
      totalRevenue: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Matumizi',
      netProfit: 'Faida Safi',
      noEntries: 'Hakuna ingizo bado',
      deleteEntry: 'Futa',
      recentEntries: 'Maingizo ya Hivi Karibuni',
      timePeriod: 'Kipindi cha Wakati',
      daily: 'Kila Siku',
      weekly: 'Kila Wiki',
      monthly: 'Kila Mwezi',
      quarterly: 'Kila Robo',
      annual: 'Kila Mwaka',
      custom: 'Mipaka Maalum',
      startDate: 'Tarehe ya Mwanzo',
      endDate: 'Tarehe ya Mwisho',
      financialSummary: 'Muhtasari wa Fedha',
      aiSummary: 'Muhtasari wa AI',
      downloadSummary: 'Pakua Muhtasari',
      shareFinancials: 'Shiriki Fedha'
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
      addRevenue: 'تسجيل دفعة جديدة',
      addExpense: 'تسجيل مصروف جديد',
      scanReceipt: 'مسح الإيصال',
      revenueTypes: {
        cash: 'نقداً',
        mobileMoney: 'الأموال المحمولة',
        bankTransfer: 'تحويل بنكي',
        card: 'دفع بالبطاقة',
        crypto: 'العملة المشفرة',
        other: 'أخرى'
      },
      expenseTypes: {
        operational: 'تشغيلي',
        inventory: 'المخزون',
        marketing: 'التسويق',
        utilities: 'المرافق',
        other: 'أخرى'
      },
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      noEntries: 'لا توجد إدخالات بعد',
      deleteEntry: 'حذف',
      recentEntries: 'الإدخالات الحديثة',
      timePeriod: 'الفترة الزمنية',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      annual: 'سنوي',
      custom: 'نطاق مخصص',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      financialSummary: 'الملخص المالي',
      aiSummary: 'ملخص الذكاء الاصطناعي',
      downloadSummary: 'تحميل الملخص',
      shareFinancials: 'مشاركة الماليات'
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
      addRevenue: 'Enregistrer Nouveau Paiement',
      addExpense: 'Enregistrer Nouvelle Dépense',
      scanReceipt: 'Scanner Reçu',
      revenueTypes: {
        cash: 'Espèces',
        mobileMoney: 'Argent Mobile',
        bankTransfer: 'Virement Bancaire',
        card: 'Paiement Carte',
        crypto: 'Cryptomonnaie',
        other: 'Autre'
      },
      expenseTypes: {
        operational: 'Opérationnel',
        inventory: 'Inventaire',
        marketing: 'Marketing',
        utilities: 'Services Publics',
        other: 'Autre'
      },
      totalRevenue: 'Revenus Totaux',
      totalExpenses: 'Dépenses Totales',
      netProfit: 'Bénéfice Net',
      noEntries: 'Aucune entrée encore',
      deleteEntry: 'Supprimer',
      recentEntries: 'Entrées Récentes',
      timePeriod: 'Période',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      annual: 'Annuel',
      custom: 'Plage Personnalisée',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      financialSummary: 'Résumé Financier',
      aiSummary: 'Résumé IA',
      downloadSummary: 'Télécharger Résumé',
      shareFinancials: 'Partager Finances'
    }
  };

  const t = translations[language] || translations.en;

  // Fixed Add Revenue Function
  const addRevenueEntry = () => {
    if (!revenueAmount || !selectedDate) {
      alert('Please enter an amount and select a date');
      return;
    }
    
    const amount = parseFloat(revenueAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const finalType = revenueType === 'other' ? customRevenueType || 'Other' : revenueType;
    
    const newEntry: RevenueEntry = {
      id: Date.now(),
      date: new Date(selectedDate),
      amount: amount,
      type: finalType,
      category: 'revenue'
    };
    
    setRevenueEntries(prev => [...prev, newEntry]);
    setRevenueAmount('');
  };

  // Fixed Add Expense Function
  const addExpenseEntry = () => {
    if (!expenseAmount || !selectedDate) {
      alert('Please enter an amount and select a date');
      return;
    }
    
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const finalType = expenseType === 'other' ? customExpenseType || 'Other' : expenseType;
    
    const newEntry: ExpenseEntry = {
      id: Date.now(),
      date: new Date(selectedDate),
      amount: amount,
      type: finalType,
      category: 'expense'
    };
    
    setExpenseEntries(prev => [...prev, newEntry]);
    setExpenseAmount('');
  };

  // Fixed Delete Functions
  const deleteRevenueEntry = (id: number) => {
    setRevenueEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const deleteExpenseEntry = (id: number) => {
    setExpenseEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Extract amounts from OCR text (multiple amounts)
  const extractAmountsFromText = (text: string) => {
    // Look for currency symbols and numbers
    const patterns = [
      /(?:KSh|TSh|USh|₦|₵|R|E£|DH|\$|£|€)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:KSh|TSh|USh|₦|₵|R|E£|DH|\$|£|€)/gi,
      /(?:total|amount|price|cost|pay|paid)[\s:]*(?:KSh|TSh|USh|₦|₵|R|E£|DH|\$|£|€)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    ];

    const amounts = [];
    for (const pattern of patterns) {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const numericMatch = match[0].match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        if (numericMatch) {
          const amount = numericMatch[1].replace(/,/g, '');
          if (!amounts.includes(amount) && parseFloat(amount) > 0) {
            amounts.push(amount);
          }
        }
      });
    }
    
    // If no specific patterns found, look for standalone numbers
    if (amounts.length === 0) {
      const numberPattern = /(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
      const matches = [...text.matchAll(numberPattern)];
      matches.forEach(match => {
        const amount = match[1].replace(/,/g, '');
        if (parseFloat(amount) > 10 && !amounts.includes(amount)) { // Filter out very small numbers
          amounts.push(amount);
        }
      });
    }
    
    return amounts;
  };

  // Process image with OCR
  const processReceiptImage = async (file: File) => {
    setIsProcessingImage(true);
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      
      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);
      
      const amounts = extractAmountsFromText(extractedText);
      if (amounts.length > 0) {
        if (amounts.length === 1) {
          setExpenseAmount(amounts[0]);
          alert(`Found amount: ${currencySymbol} ${amounts[0]}`);
        } else {
          // Multiple amounts found - let user choose
          const amountList = amounts.map((amt, idx) => `${idx + 1}. ${currencySymbol} ${amt}`).join('\n');
          const choice = prompt(`Found multiple amounts:\n${amountList}\n\nEnter the number of the amount you want to use (1-${amounts.length}):`);
          const choiceIndex = parseInt(choice) - 1;
          if (choiceIndex >= 0 && choiceIndex < amounts.length) {
            setExpenseAmount(amounts[choiceIndex]);
          } else {
            setExpenseAmount(amounts[0]); // Default to first amount
          }
        }
      } else {
        alert('Could not detect amount from image. Please enter manually.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process image. Please try again or enter manually.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processReceiptImage(file);
    }
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Trigger camera capture
  const triggerCamera = () => {
    cameraInputRef.current?.click();
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Filter entries based on time period
  const getFilteredEntries = (entries: (RevenueEntry | ExpenseEntry)[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timePeriod) {
      case 'daily':
        return entries.filter(entry => {
          const entryDate = new Date(entry.date.getFullYear(), entry.date.getMonth(), entry.date.getDate());
          return entryDate.getTime() === today.getTime();
        });
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return entries.filter(entry => entry.date >= weekStart);
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return entries.filter(entry => entry.date >= monthStart);
      case 'quarterly':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return entries.filter(entry => entry.date >= quarterStart);
      case 'annual':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return entries.filter(entry => entry.date >= yearStart);
      case 'custom':
        if (!customStartDate || !customEndDate) return entries;
        return entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= customStartDate && entryDate <= customEndDate;
        });
      default:
        return entries;
    }
  };

  const filteredRevenueEntries = getFilteredEntries(revenueEntries);
  const filteredExpenseEntries = getFilteredEntries(expenseEntries);
  
  const totalRevenue = filteredRevenueEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = filteredExpenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleAISummary = () => {
    // AI Summary functionality - would analyze financial data and provide insights
    const insights = `Based on your ${timePeriod} financial data:\n\n• Total Revenue: ${currencySymbol} ${totalRevenue.toFixed(2)}\n• Total Expenses: ${currencySymbol} ${totalExpenses.toFixed(2)}\n• Net Profit: ${currencySymbol} ${netProfit.toFixed(2)}\n• Profit Margin: ${totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%\n\nKey Insights:\n• ${netProfit >= 0 ? 'Your business is profitable' : 'Consider reviewing expenses to improve profitability'}\n• ${filteredRevenueEntries.length > 0 ? `Most revenue from: ${filteredRevenueEntries.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)?.type || 'N/A'}` : 'No revenue entries recorded'}\n• ${filteredExpenseEntries.length > 0 ? `Highest expense category: ${filteredExpenseEntries.reduce((prev, current) => (prev.amount > current.amount) ? prev : current)?.type || 'N/A'}` : 'No expense entries recorded'}`;
    
    alert(insights);
  };

  const handleDownloadSummary = () => {
    // Download functionality - would generate PDF report
    console.log('Downloading financial summary...');
    alert('Financial summary download would be implemented here.');
  };

  const financialData = {
    timePeriod,
    totalRevenue,
    totalExpenses,
    netProfit,
    revenueEntries: filteredRevenueEntries,
    expenseEntries: filteredExpenseEntries,
    currency: currencySymbol
  };

  return (
    <div id="financial-section" className="space-y-6">
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

          {/* Entry Date Selector (for adding new entries) */}
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
                      <SelectItem value="crypto">{t.revenueTypes.crypto}</SelectItem>
                      <SelectItem value="other">{t.revenueTypes.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  {revenueType === 'other' && (
                    <Input
                      value={customRevenueType}
                      onChange={(e) => setCustomRevenueType(e.target.value)}
                      placeholder="e.g., Deliveries, Consultation, etc."
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      addRevenueEntry();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    type="button"
                  >
                    {t.addRevenue}
                  </Button>
                  
                  <Button
                    onClick={triggerCamera}
                    className="bg-blue-600 hover:bg-blue-700"
                    type="button"
                    disabled={isProcessingImage}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={triggerFileUpload}
                    className="bg-purple-600 hover:bg-purple-700"
                    type="button"
                    disabled={isProcessingImage}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
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
                      <SelectItem value="other">{t.expenseTypes.other}</SelectItem>
                    </SelectContent>
                  </Select>
                  {expenseType === 'other' && (
                    <Input
                      value={customExpenseType}
                      onChange={(e) => setCustomExpenseType(e.target.value)}
                      placeholder="e.g., Transport, Equipment, etc."
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      addExpenseEntry();
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    type="button"
                  >
                    {t.addExpense}
                  </Button>
                  
                  <Button
                    onClick={triggerCamera}
                    className="bg-blue-600 hover:bg-blue-700"
                    type="button"
                    disabled={isProcessingImage}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={triggerFileUpload}
                    className="bg-purple-600 hover:bg-purple-700"
                    type="button"
                    disabled={isProcessingImage}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isProcessingImage && (
                  <div className="text-center text-sm text-gray-600">
                    Processing image... Please wait.
                  </div>
                )}
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
                <p className="text-sm text-blue-600">Financial Health</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  {netProfit >= 0 ? 'Profitable' : 'Loss'}
                </p>
                <p className={`text-lg ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  {currencySymbol} {netProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {(revenueEntries.length > 0 || expenseEntries.length > 0) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.recentEntries}</h3>
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

      {/* Financial Summary Card */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-xl font-bold text-gray-800">{t.financialSummary}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Time Period Selector */}
          <div className="flex items-center justify-center space-x-4">
            <Label className="text-sm font-medium">{t.timePeriod}</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t.daily}</SelectItem>
                <SelectItem value="weekly">{t.weekly}</SelectItem>
                <SelectItem value="monthly">{t.monthly}</SelectItem>
                <SelectItem value="quarterly">{t.quarterly}</SelectItem>
                <SelectItem value="annual">{t.annual}</SelectItem>
                <SelectItem value="custom">{t.custom}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {timePeriod === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.startDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? format(customStartDate, 'MMM dd') : t.startDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={setCustomStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.endDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? format(customEndDate, 'MMM dd') : t.endDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={setCustomEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
              onClick={handleAISummary}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Bot className="w-4 h-4 mr-2" />
              {t.aiSummary}
            </Button>
            
            <Button 
              onClick={handleDownloadSummary}
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-green-500"
            >
              <Download className="w-4 h-4 mr-2" />
              {t.downloadSummary}
            </Button>
            
            <ShareModal 
              strategy={financialData} 
              language={language}
              customTitle={t.shareFinancials}
              customIcon={<Share className="w-4 h-4 mr-2" />}
              isFinancial={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyRevenueSection;