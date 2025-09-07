import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  Activity,
  Lightbulb,
  RefreshCw,
  FileText
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

interface FinancialAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: boolean;
}

interface FinancialTip {
  id: string;
  category: string;
  title: string;
  description: string;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [newTransaction, setNewTransaction] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    description: '',
    category: ''
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample financial alerts
  const financialAlerts: FinancialAlert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Current runway: 0 days',
      description: 'Improve cashflow to extend operational runway',
      severity: 'HIGH',
      actionRequired: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'Profit margin is below healthy threshold',
      description: 'Optimize pricing strategy or reduce costs',
      severity: 'MEDIUM',
      actionRequired: false
    }
  ];

  // Financial health tips
  const financialTips: FinancialTip[] = [
    {
      id: '1',
      category: 'Revenue Optimization',
      title: 'Diversify income streams',
      description: ''
    },
    {
      id: '2',
      category: 'Revenue Optimization',
      title: 'Implement recurring revenue models',
      description: ''
    },
    {
      id: '3',
      category: 'Revenue Optimization',
      title: 'Focus on high-margin products/services',
      description: ''
    },
    {
      id: '4',
      category: 'Revenue Optimization',
      title: 'Improve customer retention',
      description: ''
    },
    {
      id: '5',
      category: 'Cost Management',
      title: 'Track all expenses regularly',
      description: ''
    },
    {
      id: '6',
      category: 'Cost Management',
      title: 'Negotiate better supplier terms',
      description: ''
    },
    {
      id: '7',
      category: 'Cost Management',
      title: 'Automate processes to reduce labor costs',
      description: ''
    },
    {
      id: '8',
      category: 'Cost Management',
      title: 'Review subscriptions and recurring costs',
      description: ''
    }
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;
  const healthScore = Math.max(0, Math.min(100, 50 + (profitMargin * 2))); // Simple calculation

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Financial Tracker</h1>
          </div>
          <p className="text-lg text-gray-600">Track your daily revenue and expenses with ease</p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm font-medium">Currency</span>
            <Select value={currency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">🇰🇪 KSh KES</SelectItem>
                <SelectItem value="USD">🇺🇸 $ USD</SelectItem>
                <SelectItem value="EUR">🇪🇺 € EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* How it works info */}
          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>How it works:</strong> Record revenue and expenses. Take a photo of receipt or upload image/screenshot from your storage, or enter details manually.
            </AlertDescription>
          </Alert>

          {/* Date Display */}
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-white rounded-lg border shadow-sm">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{format(new Date(), 'MMMM do, yyyy')}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue-expenses">Revenue/Expenses</TabsTrigger>
            <TabsTrigger value="health-gauge">Health Gauge</TabsTrigger>
            <TabsTrigger value="cashflow-monitor">Cashflow Monitor</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{Math.round(healthScore)}/100</div>
                  <p className="text-gray-600 mb-4">medium risk level</p>
                  <Progress value={healthScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Profit Margin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Profit Margin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">{profitMargin.toFixed(1)}%</div>
                <p className="text-gray-600">Revenue vs expenses</p>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Active Alerts
                  <Badge variant="destructive">{financialAlerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Needs attention</p>
                <div className="space-y-3">
                  {financialAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {alert.type === 'critical' && <XCircle className="w-4 h-4 text-red-600" />}
                          {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                      <Button size="sm" variant="outline">
                        Take Action →
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Insights Demo Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Insights Demo Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">All visualizations are ready with placeholder data. Start adding financial records to see real insights.</p>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check for Data
                </Button>
              </CardContent>
            </Card>

            {/* Financial Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Financial Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Revenue Optimization</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {financialTips.filter(tip => tip.category === 'Revenue Optimization').map(tip => (
                        <li key={tip.id} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {tip.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Cost Management</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {financialTips.filter(tip => tip.category === 'Cost Management').map(tip => (
                        <li key={tip.id} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {tip.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue/Expenses Tab */}
          <TabsContent value="revenue-expenses" className="space-y-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Period</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Button className="h-16 bg-blue-600 hover:bg-blue-700">
                    <Bot className="w-5 h-5 mr-2" />
                    AI Summary
                  </Button>
                  <Button variant="outline" className="h-16 border-green-500 text-green-700 hover:bg-green-50">
                    <Download className="w-5 h-5 mr-2" />
                    Download Summary
                  </Button>
                  <Button variant="outline" className="h-16 border-blue-500 text-blue-700 hover:bg-blue-50">
                    <Share className="w-5 h-5 mr-2" />
                    Share Financials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Insights Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Financial Insights Dashboard
                </CardTitle>
                <p className="text-sm text-gray-600">Comprehensive analysis of your financial health and cashflow trends</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Form */}
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">+ Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Input
                  type="number"
                  placeholder="0"
                  value={newTransaction.type === 'income' ? newTransaction.amount : ''}
                  onChange={(e) => setNewTransaction({...newTransaction, type: 'income', amount: e.target.value})}
                />
                
                <Select 
                  value={newTransaction.type === 'income' ? newTransaction.category : ''} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: 'income', category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setNewTransaction({...newTransaction, type: 'income'});
                      addTransaction();
                    }}
                  >
                    Record New Payment
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={triggerCamera}
                    disabled={isProcessingImage}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={triggerFileUpload}
                    disabled={isProcessingImage}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Form */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">— Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Input
                  type="number"
                  placeholder="0"
                  value={newTransaction.type === 'expense' ? newTransaction.amount : ''}
                  onChange={(e) => setNewTransaction({...newTransaction, type: 'expense', amount: e.target.value})}
                />
                
                <Select 
                  value={newTransaction.type === 'expense' ? newTransaction.category : ''} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: 'expense', category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operational" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setNewTransaction({...newTransaction, type: 'expense'});
                      addTransaction();
                    }}
                  >
                    Record New Expense
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={triggerCamera}
                    disabled={isProcessingImage}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={triggerFileUpload}
                    disabled={isProcessingImage}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-green-700 font-medium mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-800">{currencySymbol} {totalIncome.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-red-700 font-medium mb-2">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-800">{currencySymbol} {totalExpenses.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6 text-center">
                <p className="text-blue-700 font-medium mb-2">Financial Health</p>
                <p className="text-3xl font-bold text-blue-800">Profitable</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Gauge Tab */}
          <TabsContent value="health-gauge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Gauge Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced health metrics and projections will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cashflow Monitor Tab */}
          <TabsContent value="cashflow-monitor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cashflow Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time cashflow monitoring and alerts will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sustainability Tab */}
          <TabsContent value="sustainability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Business sustainability analysis and projections.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing image... Please wait.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialTracker;