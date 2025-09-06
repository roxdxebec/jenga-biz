import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar,
  Wallet,
  PiggyBank,
  CreditCard,
  Target,
  Camera,
  Upload,
  Download,
  Share,
  Bot
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
}

interface FinancialTrackerProps {
  language?: string;
  currency?: string;
  currencySymbol?: string;
}

const FinancialTracker = ({ 
  language = 'en', 
  currency = 'KES', 
  currencySymbol = 'KSh' 
}: FinancialTrackerProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: ''
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: ''
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    en: {
      title: 'Financial Tracker',
      subtitle: 'Monitor your business finances and track progress toward goals',
      overview: 'Financial Overview',
      transactions: 'Transactions',
      goals: 'Financial Goals',
      totalIncome: 'Total Income',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      addTransaction: 'Add Transaction',
      addGoal: 'Add Financial Goal',
      income: 'Income',
      expense: 'Expense',
      amount: 'Amount',
      description: 'Description',
      category: 'Category',
      date: 'Date',
      progress: 'Progress',
      deadline: 'Deadline',
      save: 'Save',
      cancel: 'Cancel',
      goalTitle: 'Goal Title',
      targetAmount: 'Target Amount',
      categories: {
        sales: 'Sales',
        services: 'Services',
        inventory: 'Inventory',
        marketing: 'Marketing',
        office: 'Office Supplies',
        utilities: 'Utilities',
        transport: 'Transport',
        other: 'Other'
      },
      processingImage: 'Processing image... Please wait.',
      photoCapture: 'Take Photo',
      uploadFile: 'Upload File'
    },
    sw: {
      title: 'Kifuatiliaji cha Kifedha',
      subtitle: 'Fuatilia fedha za biashara yako na maendeleo ya malengo',
      overview: 'Muhtasari wa Kifedha',
      transactions: 'Miamala',
      goals: 'Malengo ya Kifedha',
      totalIncome: 'Jumla ya Mapato',
      totalExpenses: 'Jumla ya Matumizi',
      netProfit: 'Faida Halisi',
      addTransaction: 'Ongeza Muamala',
      addGoal: 'Ongeza Lengo la Kifedha',
      income: 'Mapato',
      expense: 'Matumizi',
      amount: 'Kiasi',
      description: 'Maelezo',
      category: 'Kategoria',
      date: 'Tarehe',
      progress: 'Maendeleo',
      deadline: 'Muda wa Mwisho',
      save: 'Hifadhi',
      cancel: 'Ghairi',
      goalTitle: 'Kichwa cha Lengo',
      targetAmount: 'Kiasi cha Lengo',
      categories: {
        sales: 'Mauzo',
        services: 'Huduma',
        inventory: 'Hesabu',
        marketing: 'Masoko',
        office: 'Vifaa vya Ofisi',
        utilities: 'Huduma za Msingi',
        transport: 'Usafiri',
        other: 'Nyingine'
      },
      processingImage: 'Kuchakata picha... Tafadhali subiri.',
      photoCapture: 'Piga Picha',
      uploadFile: 'Pakia Faili'
    }
  };

  const t = translations[language] || translations.en;

  const expenseCategories = [
    'inventory', 'marketing', 'office', 'utilities', 'transport', 'other'
  ];

  const incomeCategories = [
    'sales', 'services', 'other'
  ];

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      date: new Date()
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'income',
      amount: '',
      description: '',
      category: ''
    });

    toast({
      title: "Transaction Added",
      description: "Your transaction has been recorded"
    });
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: new Date(newGoal.deadline),
      category: newGoal.category || 'other'
    };

    setGoals([goal, ...goals]);
    setNewGoal({
      title: '',
      targetAmount: '',
      deadline: '',
      category: ''
    });

    toast({
      title: "Goal Added",
      description: "Your financial goal has been set"
    });
  };

  // Process image with OCR
  const processReceiptImage = async (file: File) => {
    setIsProcessingImage(true);
    try {
      const worker = await createWorker('eng');
      
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      console.log('OCR Result:', text);
      
      // Extract amount using regex
      const amountRegex = /(?:total|amount|sum|cost|price|pay|$|KSh|USD|EUR|GBP)\s*:?\s*([0-9,]+\.?[0-9]*)/gi;
      const matches = text.match(amountRegex);
      
      if (matches && matches.length > 0) {
        const extractedAmount = matches[0].replace(/[^0-9.]/g, '');
        
        if (extractedAmount && !isNaN(parseFloat(extractedAmount))) {
          setNewTransaction({
            ...newTransaction,
            amount: extractedAmount,
            description: 'Receipt scan - ' + new Date().toLocaleDateString()
          });
          
          toast({
            title: "Amount detected!",
            description: `Found amount: ${currencySymbol}${extractedAmount}. Please verify and add category.`,
          });
        } else {
          throw new Error('Could not extract amount');
        }
      } else {
        toast({
          title: "No amount found",
          description: "Could not detect amount from image. Please enter manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Processing failed",
        description: "Failed to process image. Please try again or enter manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processReceiptImage(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
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

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-lg text-gray-600">{t.subtitle}</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalIncome}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {currencySymbol}{totalIncome.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.totalExpenses}</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {currencySymbol}{totalExpenses.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t.netProfit}</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currencySymbol}{netProfit.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="w-4 h-4 text-green-600" /> :
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{t.categories[transaction.category]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(transaction.date, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.addTransaction}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => 
                    setNewTransaction({...newTransaction, type: value, category: ''})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">{t.income}</SelectItem>
                      <SelectItem value="expense">{t.expense}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={newTransaction.category} onValueChange={(value) => 
                    setNewTransaction({...newTransaction, category: value})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder={t.category} />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t.categories[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  type="number"
                  placeholder={t.amount}
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                />

                <Input
                  placeholder={t.description}
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={triggerCamera}
                    className="flex-1"
                    disabled={isProcessingImage}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t.photoCapture}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={triggerFileUpload}
                    className="flex-1"
                    disabled={isProcessingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t.uploadFile}
                  </Button>
                </div>

                <Button onClick={addTransaction} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addTransaction}
                </Button>

                {/* Hidden file inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {isProcessingImage && (
                  <div className="text-center text-sm text-gray-600 animate-pulse">
                    {t.processingImage}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction above.</p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="w-4 h-4 text-green-600" /> :
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {t.categories[transaction.category]}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(transaction.date, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-lg ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.addGoal}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={t.goalTitle}
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />

                <Input
                  type="number"
                  placeholder={t.targetAmount}
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                />

                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />

                <Button onClick={addGoal} className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  {t.addGoal}
                </Button>
              </CardContent>
            </Card>

            {/* Goals List */}
            {goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <Card key={goal.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          {goal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Progress:</span>
                            <span className="font-bold">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>{currencySymbol}{goal.currentAmount.toLocaleString()}</span>
                            <span>{currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Deadline: {format(goal.deadline, 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No financial goals set yet. Create your first goal above.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FinancialTracker;
